import { useEffect, useRef } from 'react';
import gsap from '../gsap-config';

/* ─── Scoped styles ─────────────────────────────────────────────────────────
   All selectors are prefixed with .h2- to avoid collisions with App.jsx styles.
   The body-level background / grain overlay from hero2.html is replicated on
   .h2-hero and .h2-hero::before so it's fully self-contained.
──────────────────────────────────────────────────────────────────────────── */
const HERO2_STYLES = `
.h2-hero {
  --h2-bg:    #f5f0e8;
  --h2-ink:   #141212;
  --h2-muted: #6b6358;

  position: relative;
  width: 100%;
  min-height: 100vh;
  min-height: 100svh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(2rem, 5vw, 4.5rem);
  z-index: 1;
  background: var(--h2-bg);
  color: var(--h2-ink);
  font-family: "Helvetica Now", "Helvetica Neue", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  box-sizing: border-box;
}

/* Soft paper-grain wash */
.h2-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse at 20% 30%, rgba(255, 252, 245, 0.6), transparent 60%),
    radial-gradient(ellipse at 80% 70%, rgba(240, 230, 215, 0.4), transparent 60%);
  z-index: 0;
}

/* Sakura branch illustration */
.h2-tree {
  position: absolute;
  top: 2%;
  right: -4%;
  width: clamp(680px, 88vw, 1400px);
  max-width: 115%;
  height: auto;
  pointer-events: none;
  z-index: 4;
  transform-origin: top right;
  opacity: 0;
  animation: h2treeFadeIn 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards;
}

.h2-tree img {
  width: 100%;
  height: auto;
  display: block;
  user-select: none;
  -webkit-user-drag: none;
}

@keyframes h2treeFadeIn {
  from { opacity: 0; transform: translate(20px, -10px) scale(1.02); }
  to   { opacity: 1; transform: translate(0, 0) scale(1); }
}

/* Typography wrapper */
.h2-content {
  position: relative;
  z-index: 2 !important;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* "Build your digital" subtitle */
.h2-eyebrow {
  font-family: "Helvetica Now", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 400;
  font-size: clamp(2.4rem, 5.6vw, 4.6rem);
  letter-spacing: -0.025em;
  line-height: 1.05;
  color: var(--h2-ink);
  margin-bottom: clamp(0.8rem, 2.4vw, 1.8rem);
  opacity: 0;
  transform: translateY(10px);
  animation: h2fadeUp 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.15s forwards;
}

@keyframes h2fadeUp {
  to { opacity: 1; transform: translateY(0); }
}

/* Giant ROOTS heading */
.h2-roots {
  font-family: "Helvetica Now", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 400;
  font-size: clamp(5rem, 22vw, 22rem);
  line-height: 0.95;
  color: var(--h2-ink);
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  letter-spacing: -0.04em;
  user-select: none;
  margin: 0;
  padding: 0;
}

.h2-roots span {
  display: inline-block;
  opacity: 0;
  transform: translateY(20px);
  animation: h2letterIn 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.h2-roots span:nth-child(1) { animation-delay: 0.55s; }
.h2-roots span:nth-child(2) { animation-delay: 0.63s; }
.h2-roots span:nth-child(3) { animation-delay: 0.71s; }
.h2-roots span:nth-child(4) { animation-delay: 0.79s; }
.h2-roots span:nth-child(5) { animation-delay: 0.87s; }

@keyframes h2letterIn {
  to { opacity: 1; transform: translateY(0); }
}

/* Bottom row */
.h2-footer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: clamp(2rem, 4vw, 3.5rem) clamp(2rem, 5vw, 4.5rem);
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 2rem;
  z-index: 3 !important;
  opacity: 0;
  transform: translateY(10px);
  animation: h2fadeUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 1.4s forwards;
}

.h2-module-tag {
  font-family: "Helvetica Now", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 700;
  font-size: 0.78rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--h2-ink);
}

.h2-lede {
  font-family: "Helvetica Now", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 500;
  font-size: 0.92rem;
  line-height: 1.5;
  color: var(--h2-muted);
  max-width: 400px;
  text-align: right;
}

/* Falling petals layer */
.h2-petals {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 20;
  overflow: hidden;
}

.h2-petal {
  position: absolute;
  top: -24px;
  left: 0;
  will-change: transform, opacity;
  pointer-events: none;
}

/* Responsive */
@media (max-width: 720px) {
  .h2-tree {
    top: 0;
    right: 0;
    width: 100%;
    opacity: 0.95;
  }
  .h2-roots {
    font-size: clamp(4rem, 24vw, 9rem);
  }
  .h2-eyebrow {
    font-size: clamp(2rem, 8vw, 3rem);
  }
  .h2-footer {
    flex-direction: column;
    align-items: flex-start;
  }
  .h2-lede {
    text-align: left;
    max-width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .h2-eyebrow,
  .h2-roots span,
  .h2-footer,
  .h2-tree {
    opacity: 1 !important;
    transform: none !important;
    animation: none !important;
  }
}
`;

/* ─── Physics engine ─────────────────────────────────────────────────────────
   Ported directly from hero2.html's IIFE.
   Accepts the hero root el + petals container el, returns a cleanup function.
──────────────────────────────────────────────────────────────────────────── */
function initPhysics(heroEl, container) {
  if (typeof window.Matter === 'undefined') return () => {};

  const COLORS = ['#7B4FBF', '#9B6FD4', '#B088E8'];
  const PETAL_PATHS = [
    'M10 0 C14 4, 18 10, 10 20 C2 10, 6 4, 10 0 Z',
    'M10 1 C15 5, 17 12, 10 19 C3 12, 5 5, 10 1 Z',
    'M10 0 C13 6, 19 11, 10 20 C1 11, 7 6, 10 0 Z',
  ];
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const TARGET = 38;
  const MAX = 45;

  const { Engine, Runner, Bodies, Body, Composite, Events } = window.Matter;

  const engine = Engine.create();
  engine.gravity.y = 0.08;
  engine.gravity.scale = 0.0028;

  const runner = Runner.create();
  Runner.run(runner, engine);

  const petals = [];
  const staticBodies = [];
  let nextSpawnAt = 0;

  const CAT_DEFAULT = 0x0001;

  function clearStatics() {
    staticBodies.forEach(b => Composite.remove(engine.world, b));
    staticBodies.length = 0;
  }

  function buildStatics() {
    clearStatics();
    const w = window.innerWidth;
    const heroBottom = heroEl.getBoundingClientRect().bottom;
    staticBodies.push(Bodies.rectangle(-50, heroBottom / 2, 100, heroBottom * 3, { isStatic: true }));
    staticBodies.push(Bodies.rectangle(w + 50, heroBottom / 2, 100, heroBottom * 3, { isStatic: true }));
    staticBodies.push(Bodies.rectangle(w / 2, heroBottom + 30, w * 2, 60, { isStatic: true }));
    Composite.add(engine.world, staticBodies);
  }

  function spawnPetal() {
    if (petals.length >= MAX) return;

    const isPhysical = Math.random() < 0.6;
    const size = Math.round(gsap.utils.random(12, 26));
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const pathD = PETAL_PATHS[Math.floor(Math.random() * PETAL_PATHS.length)];
    const opacity = isPhysical
      ? +gsap.utils.random(0.6, 0.9, 0.01)
      : +gsap.utils.random(0.3, 0.55, 0.01);

    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 20 20');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('class', 'h2-petal');

    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', pathD);
    path.setAttribute('fill', color);
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-opacity', '0.3');
    path.setAttribute('stroke-width', '0.5');
    svg.appendChild(path);
    svg.style.opacity = opacity;
    container.appendChild(svg);

    gsap.set(svg, { xPercent: -50, yPercent: -50, x: -100, y: -100 });

    // Build irregular convex polygon (5–7 vertices)
    const n = Math.floor(gsap.utils.random(5, 8));
    const verts = [];
    const r = size / 2;
    for (let k = 0; k < n; k++) {
      const ang = (k / n) * Math.PI * 2;
      const rr = r * gsap.utils.random(0.7, 1.0);
      verts.push({ x: Math.cos(ang) * rr, y: Math.sin(ang) * rr });
    }

    const x = gsap.utils.random(0, window.innerWidth);
    const y = -30 - Math.random() * 40;
    const petalFilter = isPhysical
      ? { category: CAT_DEFAULT, mask: 0xFFFFFFFF }
      : { category: CAT_DEFAULT, mask: CAT_DEFAULT };

    let body = Bodies.fromVertices(x, y, [verts], {
      frictionAir: 0.04,
      friction: 0.8,
      restitution: 0.05,
      density: 0.0008,
      collisionFilter: petalFilter,
    }, true);

    if (!body) {
      body = Bodies.circle(x, y, size / 2, {
        frictionAir: 0.04,
        friction: 0.8,
        restitution: 0.05,
        density: 0.0008,
        collisionFilter: petalFilter,
      });
    }

    Body.setVelocity(body, { x: gsap.utils.random(-1.2, 1.2), y: gsap.utils.random(0, 0.6) });
    Body.setAngularVelocity(body, gsap.utils.random(-0.05, 0.05));
    Composite.add(engine.world, body);

    petals.push({
      body,
      el: svg,
      setX: gsap.quickSetter(svg, 'x', 'px'),
      setY: gsap.quickSetter(svg, 'y', 'px'),
      setR: gsap.quickSetter(svg, 'rotation', 'deg'),
      size,
      baseOpacity: opacity,
      lastMove: performance.now(),
      spawnTime: performance.now(),
      fadeTimer: null,
      fading: false,
    });
  }

  function removePetal(p) {
    if (p.fadeTimer) { clearTimeout(p.fadeTimer); p.fadeTimer = null; }
    gsap.killTweensOf(p.el);
    Composite.remove(engine.world, p.body);
    if (p.el && p.el.parentNode) p.el.parentNode.removeChild(p.el);
  }

  buildStatics();
  const initBurst = Math.min(5, TARGET);
  for (let i = 0; i < initBurst; i++) spawnPetal();
  nextSpawnAt = performance.now() + 300;

  // DOM-sync + recycling loop
  Events.on(engine, 'afterUpdate', () => {
    const now = performance.now();
    const heroBottom = heroEl.getBoundingClientRect().bottom;
    const REST_SPEED = 0.35;
    const GROUND_BAND = 60;

    for (let i = petals.length - 1; i >= 0; i--) {
      const p = petals[i];
      const b = p.body;
      p.setX(b.position.x);
      p.setY(b.position.y);
      p.setR(b.angle * 57.2957795);

      const moving = b.speed > REST_SPEED;
      if (moving) p.lastMove = now;

      const atBottom = b.position.y > heroBottom - GROUND_BAND;
      if (atBottom && !moving && !p.fading && !p.fadeTimer) {
        (petal => {
          petal.fadeTimer = setTimeout(() => {
            petal.fadeTimer = null;
            if (petal.body.speed > REST_SPEED) return;
            petal.fading = true;
            gsap.to(petal.el, {
              opacity: 0,
              duration: 1.2,
              ease: 'power1.inOut',
              onComplete: () => {
                const k = petals.indexOf(petal);
                if (k >= 0) {
                  removePetal(petal);
                  petals.splice(k, 1);
                  spawnPetal();
                }
              },
            });
          }, 1000);
        })(p);
      } else if ((moving || !atBottom) && p.fadeTimer) {
        clearTimeout(p.fadeTimer);
        p.fadeTimer = null;
      }

      // Safety: fell past hero bottom
      if (b.position.y > heroBottom + 200) {
        removePetal(p);
        petals.splice(i, 1);
      }
    }

    // Cap at MAX — drop oldest settled petals first
    if (petals.length > MAX) {
      const settled = petals
        .map((p, idx) => ({ p, idx, age: now - p.lastMove }))
        .filter(o => o.age > 1500)
        .sort((a, b) => b.age - a.age);
      while (petals.length > MAX && settled.length) {
        const item = settled.shift();
        const k = petals.indexOf(item.p);
        if (k >= 0) { removePetal(item.p); petals.splice(k, 1); }
      }
    }

    // Staggered natural spawn
    if (petals.length < TARGET && now >= nextSpawnAt) {
      spawnPetal();
      nextSpawnAt = now + 100 + Math.random() * Math.random() * 400;
    }
  });

  // Cursor wind
  let lastPt = null;
  let lastPtTime = 0;
  const WIND_RADIUS = 120;

  function applyWind(x, y, vx, vy) {
    const speed = Math.hypot(vx, vy);
    if (speed < 0.05) return;
    const force = Math.min(0.012, 0.0009 * speed);
    petals.forEach(({ body: b }) => {
      const dx = b.position.x - x;
      const dy = b.position.y - y;
      const dist = Math.hypot(dx, dy);
      if (dist < WIND_RADIUS && dist > 0.5) {
        const falloff = 1 - dist / WIND_RADIUS;
        const f = force * falloff;
        Body.applyForce(b, b.position, {
          x: (dx / dist) * f,
          y: (dy / dist) * f - 0.0006 * falloff * speed,
        });
      }
    });
  }

  function onPointerMove(e) {
    const pt = (e.touches && e.touches[0]) ? e.touches[0] : e;
    if (typeof pt.clientX !== 'number') return;
    const { clientX: x, clientY: y } = pt;
    const t = performance.now();
    if (lastPt) {
      const dt = Math.max(1, t - lastPtTime);
      applyWind(x, y, (x - lastPt.x) * (16 / dt), (y - lastPt.y) * (16 / dt));
    }
    lastPt = { x, y };
    lastPtTime = t;
  }

  window.addEventListener('mousemove', onPointerMove, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });

  // Resize: rebuild static walls
  let resizeT;
  function onResize() {
    clearTimeout(resizeT);
    resizeT = setTimeout(buildStatics, 200);
  }
  window.addEventListener('resize', onResize);

  // Visibility: pause when tab hidden
  let running = true;
  function onVisibilityChange() {
    if (document.hidden && running) {
      Runner.stop(runner);
      running = false;
    } else if (!document.hidden && !running) {
      Runner.run(runner, engine);
      running = true;
    }
  }
  document.addEventListener('visibilitychange', onVisibilityChange);

  // Cleanup function returned to React
  return () => {
    Runner.stop(runner);
    Events.off(engine, 'afterUpdate');
    window.removeEventListener('mousemove', onPointerMove);
    window.removeEventListener('touchmove', onPointerMove);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    clearTimeout(resizeT);
    [...petals].forEach(p => removePetal(p));
    petals.length = 0;
    Composite.clear(engine.world, false);
    Engine.clear(engine);
  };
}

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function Hero2Section() {
  const heroRef = useRef(null);
  const petalsRef = useRef(null);
  const eyebrowRef = useRef(null);

  // Inject scoped styles once
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.setAttribute('data-hero2-styles', '');
    styleEl.textContent = HERO2_STYLES;
    document.head.appendChild(styleEl);
    return () => styleEl.remove();
  }, []);

  // Load Matter.js from CDN → wait for fonts + entrance → start physics
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let mounted = true;
    let scriptEl = null;
    let physicsCleanup = null;

    function startPhysics() {
      const heroEl = heroRef.current;
      const container = petalsRef.current;
      if (!heroEl || !container) return;

      // Wrap eyebrow chars in inline spans (legacy — no collision bodies,
      // but keeps parity with the standalone hero2.html version)
      const eyebrow = eyebrowRef.current;
      if (eyebrow && !eyebrow.dataset.wrapped) {
        const text = eyebrow.textContent;
        const frag = document.createDocumentFragment();
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          if (ch === ' ') {
            frag.appendChild(document.createTextNode(' '));
          } else {
            const span = document.createElement('span');
            span.textContent = ch;
            span.dataset.letter = ch;
            span.style.display = 'inline-block';
            frag.appendChild(span);
          }
        }
        eyebrow.innerHTML = '';
        eyebrow.appendChild(frag);
        eyebrow.dataset.wrapped = '1';
      }

      // Wait for fonts + entrance animations (~1.7 s) before measuring layout
      const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
      const entranceDone = new Promise(res => setTimeout(res, 1700));
      Promise.all([fontsReady, entranceDone]).then(() => {
        requestAnimationFrame(() => {
          if (mounted && heroRef.current && petalsRef.current) {
            physicsCleanup = initPhysics(heroRef.current, petalsRef.current);
          }
        });
      });
    }

    if (window.Matter) {
      startPhysics();
    } else {
      scriptEl = document.createElement('script');
      scriptEl.src = 'https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js';
      scriptEl.onload = () => { if (mounted) startPhysics(); };
      document.body.appendChild(scriptEl);
    }

    return () => {
      mounted = false;
      if (physicsCleanup) physicsCleanup();
      if (scriptEl && scriptEl.parentNode) scriptEl.parentNode.removeChild(scriptEl);
    };
  }, []);

  return (
    <main className="h2-hero" ref={heroRef} role="banner">
      {/* Sakura branch illustration */}
      <div className="h2-tree" aria-hidden="true">
        <img src="/img/Sakura%20branch.svg" alt="" />
      </div>

      {/* Falling petals (Matter.js-driven) */}
      <div className="h2-petals" ref={petalsRef} aria-hidden="true" />

      <div className="h2-content">
        <h2 className="h2-eyebrow" ref={eyebrowRef}>We build your digital</h2>
        <h1 className="h2-roots" aria-label="ROOTS">
          <span data-letter="R">R</span>
          <span data-letter="O">O</span>
          <span data-letter="O">O</span>
          <span data-letter="T">T</span>
          <span data-letter="S">S</span>
        </h1>
      </div>

      <div className="h2-footer">
        <div className="h2-module-tag">VERSION 1.8</div>
        <p className="h2-lede">
          We create unique foundations for your&nbsp;business.<br />
          Strategic design and code, built to scale.
        </p>
      </div>
    </main>
  );
}
