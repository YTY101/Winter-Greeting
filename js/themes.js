// 主题配置：新增主题只需在此对象中添加一项
export const THEMES = {
  xuehua: {
    label: '雪华',
    subtitle: '立冬，是“冬之始也”。收起秋意，且把温暖留在心里。',
    tagline: '一候水始冰，二候地始冻，三候雉入大水为蜃。',
    audio: './assets/audio/xuehua.mp3',
    vars: {}, // 若需特定 CSS 变量可写入，如 {"--accent":"#xxxxxx"}
    snow: { densityFactor: 1.0, speed: 1.0, drift: 1.0 }
  },
  dengying: {
    label: '灯影',
    subtitle: '小灯映窗，心有暖意。愿长夜有光，归途不寒。',
    tagline: '冬灯微照，愿你所行皆安。',
    audio: './assets/audio/dengying.mp3',
    vars: {},
    snow: { densityFactor: 0.7, speed: 0.9, drift: 0.6 }
  },
  meixiang: {
    label: '梅香',
    subtitle: '疏影横斜水清浅，暗香浮动月黄昏。',
    tagline: '江南无所有，聊赠一枝春。',
    audio: './assets/audio/meixiang.mp3',
    vars: {},
    snow: { densityFactor: 0.9, speed: 0.9, drift: 1.2 }
  },
  dongzhuan: {
    label: '冬馔',
    subtitle: '围炉煮茶，热汤入口。把温暖握在手心。',
    tagline: '人间烟火气，最抚凡人心。',
    audio: './assets/audio/dongzhuan.mp3',
    vars: {},
    snow: { densityFactor: 0.8, speed: 0.8, drift: 0.9 }
  }
};
