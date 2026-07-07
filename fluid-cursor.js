/**
 * Fluid Cursor — bolinha brilhante com rastro fluido que se dissolve elegantemente.
 * Uso: incluir este arquivo em qualquer página (<script src="fluid-cursor.js" defer></script>)
 * Não precisa de HTML extra — o canvas é criado e injetado automaticamente.
 */

(() => {
  'use strict';

  if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches) return;

  // ---------- Configuração (ajuste à vontade) ----------
  const CONFIG = {
    color: [176, 141, 87],   // RGB dourado (#B08D57)
    coreRadius: 3,             // raio do núcleo (bolinha central)
    trailPointLife: 500,       // ms até um ponto do rastro sumir totalmente
    maxTrailPoints: 100,       // limite de pontos ativos (perf)
    pointSpacing: 3,           // distância mínima (px) entre pontos novos do rastro
    baseWidth: 5,              // espessura inicial do rastro (px)
    glowBlur: 18,              // blur do glow do núcleo
    smoothing: 1,              // 0-1, quanto o cursor "segue" suavemente o mouse real
  };

  // ---------- Setup do canvas ----------
  const canvas = document.createElement('canvas');
  canvas.id = 'fluid-cursor-canvas';
  Object.assign(canvas.style, {
    position: 'fixed',
    inset: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: '2147483647',
    mixBlendMode: 'screen', // funde bonito sobre fundos escuros; troque p/ 'normal' se preferir
  });
  document.documentElement.appendChild(canvas);
  document.documentElement.style.cursor = 'none';

  const ctx = canvas.getContext('2d');
  let dpr = Math.max(1, window.devicePixelRatio || 1);

  function resize() {
    dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  // ---------- Estado ----------
  const raw = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const pos = { x: raw.x, y: raw.y };
  let lastEmit = { x: pos.x, y: pos.y };
  let hasMouse = false;

  /** @type {{x:number,y:number,born:number}[]} */
  const trail = [];

  window.addEventListener('pointermove', (e) => {
    raw.x = e.clientX;
    raw.y = e.clientY;
    hasMouse = true;
  }, { passive: true });

  window.addEventListener('pointerleave', () => { hasMouse = false; });

  // ---------- Loop principal ----------
  let lastTime = performance.now();

  function frame(now) {
    const dt = Math.min(48, now - lastTime); // clamp p/ evitar saltos ao trocar de aba
    lastTime = now;

    // Suaviza o movimento do núcleo (easing exponencial independente de framerate)
    const ease = 1 - Math.pow(1 - CONFIG.smoothing, dt / 16.67);
    pos.x += (raw.x - pos.x) * ease;
    pos.y += (raw.y - pos.y) * ease;

    // Emite pontos de rastro interpolando entre o último ponto e o atual,
    // assim movimentos rápidos não deixam "buracos" no rastro
    const dx = pos.x - lastEmit.x;
    const dy = pos.y - lastEmit.y;
    const dist = Math.hypot(dx, dy);

    if (dist >= CONFIG.pointSpacing) {
      const steps = Math.ceil(dist / CONFIG.pointSpacing);
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        trail.push({
          x: lastEmit.x + dx * t,
          y: lastEmit.y + dy * t,
          born: now,
        });
      }
      lastEmit = { x: pos.x, y: pos.y };
      while (trail.length > CONFIG.maxTrailPoints) trail.shift();
    }

    // Remove pontos expirados
    while (trail.length && now - trail[0].born > CONFIG.trailPointLife) {
      trail.shift();
    }

    render(now);
    requestAnimationFrame(frame);
  }

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function render(now) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!hasMouse && trail.length === 0) return;

    const [r, g, b] = CONFIG.color;
    ctx.globalCompositeOperation = 'lighter'; // blending aditivo = brilho fluido

    // ---- Rastro: desenhado como segmentos que afinam e desvanecem ----
    for (let i = 1; i < trail.length; i++) {
      const p0 = trail[i - 1];
      const p1 = trail[i];
      const age = (now - p1.born) / CONFIG.trailPointLife; // 0 → novo, 1 → expira
      const life = Math.max(0, 1 - easeOutCubic(age));
      if (life <= 0) continue;

      const width = CONFIG.baseWidth * life * 0.9 + 0.5;
      const alpha = life * 0.55;

      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.lineCap = 'round';
      ctx.lineWidth = width;
      ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.shadowColor = `rgba(${r},${g},${b},${alpha})`;
      ctx.shadowBlur = 10 * life;
      ctx.stroke();
    }

    // ---- Núcleo: bolinha brilhante no centro ----
    if (hasMouse) {
      ctx.shadowBlur = CONFIG.glowBlur;
      ctx.shadowColor = `rgba(${r},${g},${b},0.9)`;

      const gradient = ctx.createRadialGradient(
        pos.x, pos.y, 0,
        pos.x, pos.y, CONFIG.coreRadius * 2.4
      );
      gradient.addColorStop(0, `rgba(255,255,255,0.95)`);
      gradient.addColorStop(0.35, `rgba(${r},${g},${b},0.9)`);
      gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);

      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(pos.x, pos.y, CONFIG.coreRadius * 2.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = '#ffffff';
      ctx.arc(pos.x, pos.y, CONFIG.coreRadius * 0.55, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.shadowBlur = 0;
    ctx.globalCompositeOperation = 'source-over';
  }

  requestAnimationFrame((t) => { lastTime = t; requestAnimationFrame(frame); });
})();
