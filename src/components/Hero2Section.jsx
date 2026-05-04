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
  justify-content: flex-end;
  padding: clamp(1rem, 2vw, 2rem) clamp(2rem, 5vw, 4.5rem) clamp(2rem, 5vw, 4.5rem) clamp(2rem, 5vw, 4.5rem);
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

.h2-content {
  position: absolute;
  left: clamp(2.5rem, 8.85vw, 8rem);
  right: clamp(2.5rem, 9vw, 8.5rem);
  bottom: clamp(4.5rem, 9.5vh, 5.6rem);
  z-index: 3;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  grid-template-areas:
    "heading heading"
    "actions copy";
  align-items: end;
  column-gap: clamp(2rem, 6vw, 8rem);
  row-gap: clamp(0.9rem, 2vw, 1.4rem);
}

.h2-heading {
  grid-area: heading;
  margin: 0 0 clamp(0.8rem, 1.8vw, 1.6rem) -0.5rem;
  color: var(--h2-ink);
  font-family: "Helvetica Neue", Helvetica, "Geist", Arial, sans-serif;
  letter-spacing: -0.055em;
}

.h2-heading-top,
.h2-heading-main {
  display: block;
}

.h2-heading-top {
  margin-bottom: clamp(1rem, 2.4vw, 1.7rem);
  font-size: clamp(3rem, 5.15vw, 4.7rem);
  font-weight: 400;
  line-height: 1.04;
  letter-spacing: -0.052em;
}

.h2-heading-main {
  font-size: clamp(6rem, 13vw, 12.4rem);
  font-weight: 700;
  line-height: 0.82;
  white-space: nowrap;
}

.h2-copy {
  grid-area: copy;
  max-width: 100%;
  margin: 0;
  color: rgba(20, 18, 18, 0.5);
  font-family: "Helvetica Neue", Helvetica, "Geist", Arial, sans-serif;
  font-size: clamp(0.85rem, 0.98vw, 0.95rem);
  font-weight: 400;
  line-height: 1.45;
  text-align: right;
  justify-self: end;
}

.h2-actions {
  grid-area: actions;
  justify-self: start;
  display: flex;
  align-items: center;
  gap: clamp(1rem, 2vw, 2rem);
}

.h2-button {
  min-height: 42px;
  padding: 0 1.65rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: "Helvetica Neue", Helvetica, "Geist", Arial, sans-serif;
  font-size: 0.86rem;
  font-weight: 600;
  line-height: 1;
  text-decoration: none;
  transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease;
}

.h2-button:hover {
  transform: translateY(-1px);
}

.h2-button-primary {
  background: #8A3DE6;
  color: #fff;
  border: 1px solid #8A3DE6;
  box-shadow: inset 0 0 0 4px rgba(255, 255, 255, 0.13);
}

.h2-button-secondary {
  background: transparent;
  color: rgba(20, 18, 18, 0.74);
  border: 1px solid rgba(20, 18, 18, 0.18);
  font-weight: 500;
}

.h2-button-secondary:hover {
  border-color: rgba(20, 18, 18, 0.34);
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
.h2-content {
    left: clamp(1.25rem, 6vw, 2rem);
    right: clamp(1.25rem, 6vw, 2rem);
    bottom: clamp(3rem, 7vh, 4.5rem);
    grid-template-columns: 1fr;
    grid-template-areas:
      "heading"
      "actions"
      "copy";
    row-gap: 1rem;
  }
  .h2-copy {
    text-align: left;
  }
  .h2-heading-top {
    margin-bottom: 0.75rem;
    font-size: clamp(2.25rem, 10vw, 3.25rem);
  }
  .h2-heading-main {
    font-size: clamp(3.5rem, 18vw, 5.25rem);
    line-height: 0.9;
    white-space: normal;
  }
  .h2-copy {
    max-width: 100%;
    font-size: 0.9rem;
  }
  .h2-actions {
    justify-self: end;
    gap: 0.75rem;
  }
  .h2-button {
    min-height: 40px;
    padding: 0 1.1rem;
    font-size: 0.8rem;
  }
}

@media (prefers-reduced-motion: reduce) {
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
  engine.gravity.y = 0.05;
  engine.gravity.scale = 0.0018;

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

    const airFriction = gsap.utils.random(0.045, 0.11);

    let body = Bodies.fromVertices(x, y, [verts], {
      frictionAir: airFriction,
      friction: 0.8,
      restitution: 0.05,
      density: gsap.utils.random(0.0005, 0.0012),
      collisionFilter: petalFilter,
    }, true);

    if (!body) {
      body = Bodies.circle(x, y, size / 2, {
        frictionAir: airFriction,
        friction: 0.8,
        restitution: 0.05,
        density: gsap.utils.random(0.0005, 0.0012),
        collisionFilter: petalFilter,
      });
    }

    Body.setVelocity(body, { x: gsap.utils.random(-2.8, 2.8), y: gsap.utils.random(0.2, 1.2) });
    Body.setAngularVelocity(body, gsap.utils.random(-0.12, 0.12));
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

      // Wait for branch entrance before measuring layout.
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

      <div className="h2-content">
        <h1 className="h2-heading">
          <span className="h2-heading-top">We build your</span>
          <span className="h2-heading-main">Digital Roots</span>
        </h1>
        <p className="h2-copy">
          We create unique foundations for your business.<br />
          Strategic design and code, built to scale.
        </p>
        <div className="h2-actions" aria-label="Hero calls to action">
          <a href="#contact" className="h2-button h2-button-primary">Get Started</a>
          <a href="#work" className="h2-button h2-button-secondary">See Our Work</a>
        </div>
      </div>

      {/* Falling petals (Matter.js-driven) */}
      <div className="h2-petals" ref={petalsRef} aria-hidden="true" />
    </main>
  );
}
