// Scene bawaan netral. Ditulis dengan h() (= React.createElement) karena kode dijalankan dinamis tanpa JSX.
export const DEFAULT_2D = `function Scene() {
  const frame = useCurrentFrame();
  const { width: W, height: H, durationInFrames } = useVideoConfig();
  const p = frame / durationInFrames, T = Math.PI * 2, u = Math.min(W, H);
  const wave = (k, amp, ph) => {
    let d = 'M 0 ' + H;
    for (let x = 0; x <= W; x += W / 40) d += ' L ' + x + ' ' + (H * (0.55 + k * 0.08) + Math.sin(x / W * T * 1.5 + p * T + ph) * u * amp);
    return d + ' L ' + W + ' ' + H + ' Z';
  };
  const dots = Array.from({ length: 14 }, (_, i) => {
    const r = Math.sin(i * 12.9898) * 43758.5453, f = r - Math.floor(r);
    return { x: f * W, y: (((f * 7 + p * (1 + (i % 2))) % 1) * H), s: u * (0.004 + f * 0.006) };
  });
  return h('svg', { width: W, height: H, viewBox: '0 0 ' + W + ' ' + H, xmlns: 'http://www.w3.org/2000/svg' },
    h('defs', null,
      h('linearGradient', { id: 'bg', x1: 0, y1: 0, x2: 1, y2: 1 },
        h('stop', { offset: '0%', stopColor: '#0f172a' }), h('stop', { offset: '100%', stopColor: '#312e81' })),
      h('linearGradient', { id: 'w', x1: 0, y1: 0, x2: 1, y2: 0 },
        h('stop', { offset: '0%', stopColor: '#6366f1' }), h('stop', { offset: '100%', stopColor: '#ec4899' }))),
    h('rect', { width: W, height: H, fill: 'url(#bg)' }),
    h('path', { d: wave(0, 0.05, 0), fill: 'url(#w)', opacity: 0.35 }),
    h('path', { d: wave(1, 0.04, 2), fill: 'url(#w)', opacity: 0.5 }),
    h('path', { d: wave(2, 0.03, 4), fill: 'url(#w)', opacity: 0.7 }),
    dots.map((d, i) => h('circle', { key: i, cx: d.x, cy: d.y, r: d.s, fill: '#fff', opacity: 0.6 })));
}`;

