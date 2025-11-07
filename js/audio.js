export class AudioManager {
  constructor() {
    this.a = new Audio();
    this.a.loop = true; this.a.preload = 'auto'; this.a.volume = 0.6;
    this.isUserInteracted = false;
    document.body.appendChild(this.a); // 保证移动端可控
  }
  resumeContext() {
    // 某些浏览器需用户手势才允许播放
    this.isUserInteracted = true;
  }
  async setSrcAndPlay(src){
    if(!src){ return; }
    try{
      this.a.src = src;
      if(this.isUserInteracted){ await this.a.play().catch(()=>{}); }
    }catch(e){ console.warn('Audio play error:', e); }
  }
  toggle(){
    if(this.a.paused){ this.a.play().catch(()=>{}); return true; }
    this.a.pause(); return false;
  }
  setVolume(v){ this.a.volume = Math.max(0, Math.min(1, v)); }
  isPlaying(){ return !this.a.paused; }
}
