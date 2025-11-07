// 背景音乐管理：支持淡入/淡出与主题切换时的交叉淡变（单音轨序列式）
export class AudioManager {
  constructor() {
    this.a = new Audio();
    this.a.loop = true; this.a.preload = 'auto';
    this.userVolume = 0.6;
    this.a.volume = 0.6;
    this.isUserInteracted = false;
    this._fadeReq = null;
    document.body.appendChild(this.a);
  }

  resumeContext(){ this.isUserInteracted = true; }

  setVolume(v){
    const vol = Math.max(0, Math.min(1, v));
    this.userVolume = vol;
    this.a.volume = vol; // 若正在淡变，也会被下一帧覆盖为目标值
  }

  _cancelFade(){ if(this._fadeReq){ cancelAnimationFrame(this._fadeReq); this._fadeReq = null; } }

  fadeTo(target=1.0, ms=600){
    this._cancelFade();
    const start = performance.now();
    const from = this.a.volume;
    const to = Math.max(0, Math.min(1, target));
    return new Promise(resolve=>{
      const step = (now)=>{
        const t = Math.min(1, (now - start) / ms);
        // easeInOutCubic
        const eased = t<.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2;
        this.a.volume = from + (to - from) * eased;
        if(t < 1){ this._fadeReq = requestAnimationFrame(step); }
        else { this._fadeReq = null; resolve(); }
      };
      this._fadeReq = requestAnimationFrame(step);
    });
  }

  async playWithFade(ms=600){
    try{
      if(this.a.paused && this.isUserInteracted){
        this.a.volume = 0;
        await this.a.play().catch(()=>{});
        await this.fadeTo(this.userVolume, ms);
      }
    }catch(e){ console.warn('playWithFade error:', e); }
  }

  async pauseWithFade(ms=600){
    try{
      await this.fadeTo(0, ms);
      this.a.pause();
    }catch(e){ console.warn('pauseWithFade error:', e); }
  }

  async crossfadeTo(src, ms=800){
    if(!src) return;
    // 若相同曲目，直接确保播放
    if(this.a.src && this.a.src.endsWith(src)) {
      if(this.isUserInteracted) await this.playWithFade(300);
      return;
    }
    await this.fadeTo(0, ms*0.5);
    this.a.src = src;
    if(this.isUserInteracted) await this.a.play().catch(()=>{});
    await this.fadeTo(this.userVolume, ms*0.5);
  }

  async setSrcAndPlay(src){
    await this.crossfadeTo(src, 900);
  }

  async toggle(){
    if(this.a.paused){ await this.playWithFade(500); return true; }
    await this.pauseWithFade(500); return false;
  }

  // 获取当前是否处于播放状态
  isPlaying(){
    return !this.a.paused;
  }

  // 在主题切换时设置音源，但尊重当前播放/暂停状态
  async setSrcRespectingPlayback(src, ms=800){
    if(!src) return;
    const wasPlaying = !this.a.paused;
    // 已是同一音源
    if(this.a.src && this.a.src.endsWith(src)){
      // 仍在播放则补一小段淡入，暂停则不动
      if(wasPlaying && this.isUserInteracted){ await this.playWithFade(300); }
      return;
    }
    if(wasPlaying){
      // 正在播放：做交叉淡变
      await this.crossfadeTo(src, ms);
    }else{
      // 已暂停：仅切换音源，不自动播放
      this._cancelFade();
      this.a.volume = this.userVolume;
      this.a.src = src;
    }
  }
}
