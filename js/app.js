import { THEMES } from './themes.js';
import { SnowEngine } from './snow.js';
import { AudioManager } from './audio.js';

// 简易打字机
function typeText(el, text, speed = 26){
  if(!el) return; el.textContent = ''; let i = 0;
  const t = setInterval(()=>{
    el.textContent += text.charAt(i++);
    if(i>=text.length) clearInterval(t);
  }, speed);
}

const blessings = [
  '愿你冬日有光，心中有暖。',
  '立冬添衣，愿你被温柔和好运环绕。',
  '风雪起，万物藏，愿你所爱皆安。',
  '愿你在寒冬里，也能看见梅开时的芬芳。',
  '把热茶握在手，把希望放在心。',
  '愿你不畏霜雪，所行皆坦途。',
  '冬有暖阳，心有热汤，日子有盼。',
  '岁岁年年，常温常暖。',
  '愿你所念皆如愿，所盼皆可期。',
  '立冬安康，喜乐常驻。'
];

const els = {
  subtitle: document.getElementById('subtitle'),
  tagline: document.getElementById('tagline'),
  blessing: document.getElementById('blessing'),
  newBlessing: document.getElementById('newBlessing'),
  year: document.getElementById('year'),
  musicToggle: document.getElementById('musicToggle'),
  musicVolume: document.getElementById('musicVolume'),
  chips: Array.from(document.querySelectorAll('.chip-btn')),
  snow: document.getElementById('snow'),
  reveal: document.getElementById('themeReveal'),
};

els.year.textContent = new Date().getFullYear();

const snow = new SnowEngine(els.snow);
const audio = new AudioManager();

// 初始化主题（记忆本地设置）
const DEFAULT_THEME = 'xuehua';
const savedTheme = localStorage.getItem('theme') || DEFAULT_THEME;
const savedVol = parseFloat(localStorage.getItem('volume') || '0.6');
audio.setVolume(savedVol); els.musicVolume.value = String(savedVol);

// 辅助：按钮 pressed 状态
function setPressed(theme){
  els.chips.forEach(btn=>btn.setAttribute('aria-pressed', String(btn.dataset.theme===theme)));
}

// 主题揭示动效（底部左→右扫过）
function runReveal(){
  els.reveal.classList.remove('revealing');
  // 强制重排以重启动画
  void els.reveal.offsetWidth;
  els.reveal.classList.add('revealing');
}

// 应用主题：颜色/文案/雪效/音乐 + 动效协调
async function applyTheme(theme){
  const conf = THEMES[theme] || THEMES[DEFAULT_THEME];

  // 动效：先启动 reveal（在底部从左到右扫过）
  document.body.classList.add('switching');
  runReveal();

  // 稍作延迟，让“揭示”先出现一点，再切换实际主题，获得更自然的“覆盖”感觉
  setTimeout(()=>{ document.body.setAttribute('data-theme', theme); }, 120);

  // 可选：按需写入 CSS 变量（大部分色彩由 CSS data-theme 提供）
  if(conf.vars){ for(const [k,v] of Object.entries(conf.vars)){ document.documentElement.style.setProperty(k, v); } }

  // 文案
  els.tagline.textContent = conf.tagline || '';
  typeText(els.subtitle, conf.subtitle || '', 22);

  // 雪效参数
  snow.applyThemeOptions(conf.snow);

  // 音乐：尊重当前播放状态（若暂停则不自动播放）
  await audio.setSrcRespectingPlayback(conf.audio);

  // 状态&持久化
  setPressed(theme);
  localStorage.setItem('theme', theme);

  // 同步按钮文案
  els.musicToggle.textContent = audio.isPlaying() ? '⏸ 暂停音乐' : '🎵 背景音乐';

  // 清理切换标记
  setTimeout(()=>{ document.body.classList.remove('switching'); }, 950);
}

// 主题按钮事件
els.chips.forEach(btn=>{
  btn.addEventListener('click', async ()=>{
    audio.resumeContext(); // 标记已有用户交互（移动端）
    await applyTheme(btn.dataset.theme);
  });
});

// 随机祝福
els.newBlessing.addEventListener('click', ()=>{
  audio.resumeContext();
  const text = blessings[Math.floor(Math.random()*blessings.length)];
  els.blessing.style.opacity = 0; els.blessing.style.transition = 'opacity .35s ease';
  setTimeout(()=>{ typeText(els.blessing, text, 26); els.blessing.style.opacity = 1; }, 180);
});

// 音乐开关/音量（淡入/淡出）
els.musicToggle.addEventListener('click', async ()=>{
  audio.resumeContext();
  const playing = await audio.toggle();
  els.musicToggle.textContent = playing ? '⏸ 暂停音乐' : '🎵 背景音乐';
});
els.musicVolume.addEventListener('input', e=>{
  const v = parseFloat(e.target.value);
  audio.setVolume(v);
  localStorage.setItem('volume', String(v));
});

// 初次应用主题
applyTheme(savedTheme);
