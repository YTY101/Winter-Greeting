export class SnowEngine {
  constructor(canvas){
    this.canvas = canvas; this.ctx = canvas.getContext('2d');
    this.W = canvas.width = window.innerWidth;
    this.H = canvas.height = window.innerHeight;
    this.flakes = [];
    this.baseCount = Math.min(140, Math.floor(this.W * this.H / 18000));
    this.opts = { densityFactor: 1.0, speed: 1.0, drift: 1.0 };
    this._populate(); this._loop();
    window.addEventListener('resize', () => this._resize());
  }
  _populate(){
    const count = Math.floor(this.baseCount * this.opts.densityFactor);
    this.flakes = Array.from({length: count}, () => this._makeFlake());
  }
  _makeFlake(){
    const {W,H} = this;
    return {
      x: Math.random()*W, y: Math.random()*H,
      r: Math.random()*2.1+0.6,
      vy: (Math.random()*0.8+0.25)*this.opts.speed,
      vx: (Math.random()-0.5)*0.4*this.opts.drift,
      a: Math.random()*Math.PI*2
    };
  }
  _resize(){
    this.W = this.canvas.width = window.innerWidth;
    this.H = this.canvas.height = window.innerHeight;
    this.baseCount = Math.min(140, Math.floor(this.W * this.H / 18000));
    this._populate();
  }
  applyThemeOptions(opts){
    this.opts = Object.assign({}, this.opts, opts || {});
    this._populate();
  }
  _loop(){
    const c = this.ctx; const {W,H} = this;
    c.clearRect(0,0,W,H); c.fillStyle = 'rgba(255,255,255,0.95)';
    for(const f of this.flakes){
      f.a += (0.003 + f.r*0.0008) * this.opts.drift;
      f.x += f.vx + Math.sin(f.a) * 0.2 * this.opts.drift;
      f.y += f.vy;
      if(f.y > H + 6){ f.y = -6; f.x = Math.random()*W; }
      if(f.x > W + 6){ f.x = -6; } if(f.x < -6){ f.x = W + 6; }
      c.beginPath(); c.arc(f.x, f.y, f.r, 0, Math.PI*2); c.fill();
    }
    requestAnimationFrame(() => this._loop());
  }
}
