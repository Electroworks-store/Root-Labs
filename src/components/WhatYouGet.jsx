import { useEffect, useRef, useState } from 'react';
import { gsap } from '../gsap-config';
import './WhatYouGet.css';

const FEATURES = [
  {
    id: 'performance',
    eyebrow: 'Performance',
    title: 'Fast where it counts.',
    body: 'Pages are built to feel immediate, stable, and polished across devices, so visitors are never waiting on the experience.',
    stats: ['Speed-first layout', 'Clean motion', 'Mobile tuned'],
  },
  {
    id: 'analytics',
    eyebrow: 'Analytics',
    title: 'Ranked where it counts.',
    body: 'Every page is structured for search with fast load times, clean semantic markup, and content your audience is actively looking for.',
    stats: ['SEO structure', 'Search traffic', 'Page speed scores'],
  },
  {
    id: 'design',
    eyebrow: 'Unique design',
    title: '',
    body: 'A creative website built specifically for your brand. We craft distinctive layouts, unexpected details, and memorable interactions that capture your vibe and make you stand out.',
    stats: ['No templates', 'Custom visuals', 'Memorable details'],
  },
];

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

export default function WhatYouGet() {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [animatedScenes, setAnimatedScenes] = useState(() => new Set());
  const centerPosition = scrollProgress * (FEATURES.length - 1);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress = scrollable > 0 ? clamp(-rect.top / scrollable) : 0;
      const nextIndex = progress >= 0.995
        ? FEATURES.length - 1
        : Math.min(FEATURES.length - 1, Math.floor(progress * FEATURES.length));

      section.style.setProperty('--wyg-progress', progress.toFixed(3));
      setScrollProgress((current) => (Math.abs(current - progress) < 0.002 ? current : progress));
      setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
      setAnimatedScenes((prev) => prev.has(nextIndex) ? prev : (s => { s.add(nextIndex); return s; })(new Set(prev)));
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { section.classList.add('is-entered'); io.disconnect(); } },
      { threshold: 0.15 }
    );
    io.observe(section);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      io.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="wyg"
      aria-label="What do you get"
      style={{ '--wyg-steps': FEATURES.length }}
    >
      <div className="wyg__sticky">
        <div className="wyg__left">
          <h2 className="wyg__title">
            <span>What do you get if</span>
            <span>you choose <mark>us</mark>?</span>
          </h2>
          <a href="#contact" className="wyg__cta">
            A custom site that performs, teaches you what visitors are doing, and carries a design system people remember.
          </a>


        </div>

        <div className="wyg__right">
          <div className="wyg__viewport">
            {FEATURES.map((feature, index) => (
              <article
                key={feature.id}
                className={`wyg__scene wyg__scene--${feature.id} ${activeIndex === index ? 'is-active' : ''} ${animatedScenes.has(index) ? 'has-animated' : ''}`}
                aria-hidden={activeIndex !== index}
                style={{ '--scene-index': index, '--scene-distance': Math.abs(index - centerPosition).toFixed(3) }}
              >
                <div className="wyg__visual">
                  <FeatureVisual id={feature.id} hasAnimated={animatedScenes.has(index)} />
                </div>
                <div className="wyg__copy">
                  {feature.title && <h3>{feature.title}</h3>}
                  <p>{feature.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureVisual({ id, hasAnimated }) {
  if (id === 'performance') return <PerformanceVisual />;
  if (id === 'analytics') return <AnalyticsVisual />;
  return <DesignVisual hasAnimated={hasAnimated} />;
}

function PerformanceVisual() {
  return (
    <div className="wyg-meter" aria-hidden="true">
      <svg className="wyg-meter__svg" viewBox="0 0 280 190" role="img">
        <defs>
          <path id="wyg-perf-arc" d="M 37,150 A 103,103 0 0 1 243,150" />
        </defs>
        <text className="wyg-meter__arc-text" textAnchor="middle">
          <textPath href="#wyg-perf-arc" startOffset="50%">PERFORMANCE</textPath>
        </text>
        <path className="wyg-meter__track" d="M48 150 A92 92 0 0 1 232 150" />
        <path className="wyg-meter__fill" d="M75 148 A65 65 0 0 1 205 148" />
      </svg>
      <span className="wyg-meter__needle" />
      <span className="wyg-meter__pin" />
    </div>
  );
}

function AnalyticsVisual() {
  return (
    <div className="wyg-bars" aria-hidden="true">
      <div className="wyg-bars__chart">
        <span style={{ '--h': '38%', '--d': '80ms' }} />
        <span style={{ '--h': '68%', '--d': '180ms' }} />
        <span style={{ '--h': '92%', '--d': '280ms' }} />
      </div>
      <div className="wyg-bars__baseline" />
    </div>
  );
}

function DesignVisual({ hasAnimated }) {
  const boardRef  = useRef(null);
  const cursorRef = useRef(null);
  const navRef    = useRef(null);
  const h1Ref     = useRef(null);
  const pillRef   = useRef(null);
  const bodyRef   = useRef(null);
  const btnRef    = useRef(null);
  const animRan   = useRef(false);

  useEffect(() => {
    if (!hasAnimated || animRan.current) return;
    animRan.current = true;

    const board  = boardRef.current;
    const cursor = cursorRef.current;
    if (!board || !cursor) return;

    const cRect = board.getBoundingClientRect();
    const center = (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left - cRect.left + r.width / 2, y: r.top - cRect.top + r.height / 2 };
    };

    // Measure natural centers BEFORE any scatter
    const nav  = navRef.current;
    const h1   = h1Ref.current;
    const pill = pillRef.current;
    const body = bodyRef.current;
    const btn  = btnRef.current;

    const items = [
      { el: nav,  nat: center(nav),  sx: -90,  sy: -120, sr: -6,  ss: 0.88 },
      { el: h1,   nat: center(h1),   sx: -110, sy: -90,  sr: -10, ss: 0.86 },
      { el: pill, nat: center(pill), sx: 110,  sy: -110, sr: 30,  ss: 0.80, finalRot: 18 },
      { el: body, nat: center(body), sx: -100, sy:  90,  sr:  8,  ss: 0.90 },
      { el: btn,  nat: center(btn),  sx:  -80, sy: 110,  sr: -10, ss: 0.88 },
    ].filter(({ el }) => el);

    // Scatter all elements from their natural positions
    items.forEach(({ el, sx, sy, sr, ss }) => {
      gsap.set(el, { x: sx, y: sy, rotation: sr, scale: ss, opacity: 0 });
    });
    gsap.set(cursor, { x: 0, y: 0, opacity: 0, scale: 1 });

    const DUR    = 0.42;
    const TRAVEL = 0.15;
    const tl     = gsap.timeline({ delay: 0.25 });

    items.forEach(({ el, nat, sx, sy, finalRot }) => {
      // Cursor travels to where the scattered element is (nat + scatter offset)
      const fromX = nat.x + sx;
      const fromY = nat.y + sy;

      const landProps = finalRot !== undefined
        ? { opacity: 1, x: 0, y: 0, rotation: finalRot, scale: 1, duration: DUR, ease: 'power2.inOut' }
        : { opacity: 1, x: 0, y: 0, rotation: 0, scale: 1, duration: DUR, ease: 'power2.inOut', clearProps: 'transform' };

      tl
        .to(cursor, { x: fromX, y: fromY, opacity: 1, duration: TRAVEL, ease: 'power2.inOut' })
        .to(el,     { opacity: 1,                       duration: 0.08 }, '<0.06')
        .to(cursor, { scale: 0.76,                       duration: 0.07, ease: 'power2.in' })
        .to(cursor, { x: nat.x, y: nat.y,               duration: DUR,  ease: 'power2.inOut' })
        .to(el,     landProps, '<')
        .to(cursor, { scale: 1,                          duration: 0.08, ease: 'back.out(2.5)' });
    });

    tl.to(cursor, { opacity: 0, duration: 0.22, ease: 'power2.out' });
  }, [hasAnimated]);

  return (
    <div className="wyg-build" aria-hidden="true">
      <div className="wyg-build__board" ref={boardRef}>
        <div className="wyg-build__nav" ref={navRef}>
          <span className="wyg-build__nav-logo" />
          <span className="wyg-build__nav-blur" />
        </div>
        <div className="wyg-build__h1" ref={h1Ref}>
          <span>Built for</span>
          <span>your brand.</span>
        </div>
        <div className="wyg-build__pill" ref={pillRef}>
          <div className="wyg-build__pill-img" />
          <div className="wyg-build__pill-img wyg-build__pill-img--2" />
        </div>
        <div className="wyg-build__body" ref={bodyRef}>
          <span />
          <span />
        </div>
        <div className="wyg-build__btn" ref={btnRef}>See the work</div>
        <div className="wyg-build__cursor" ref={cursorRef} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="26" height="26">
            <path
              d="M5.5 3 L5.5 18 L9.2 14.2 L12 20 L14 19 L11.2 13.2 L16.8 13.2 Z"
              fill="#ffffff"
              stroke="#1a1a1a"
              strokeWidth="0.85"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}