import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../gsap-config';
import sakura1 from '../../img/sakura1.webp';
import sakura2 from '../../img/sakura2.webp';
import beaker from '../../img/beaker.webp';
import './HorizontalProcess.css';

/**
 * HorizontalProcess
 * --------------------------------------------------------------------
 * Pinned horizontal-scroll storyboard for the design process.
 * Vertical scroll → horizontal track translation via GSAP ScrollTrigger.
 * The wavy purple SVG sits inside the track so it spans every panel and
 * translates with them.
 */
export default function HorizontalProcess() {
  const outerRef = useRef(null);
  const stageRef = useRef(null);
  const trackRef = useRef(null);
  const pathRef  = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const outer = outerRef.current;
    const path  = pathRef.current;
    if (!track || !stage || !outer || !path) return;

    const mq = window.matchMedia('(max-width: 900px)');
    if (mq.matches) return;

    const getDistance = () => track.scrollWidth - window.innerWidth;

    const setHeight = () => {
      outer.style.height = `${getDistance() + window.innerHeight}px`;
    };
    setHeight();

    // ── Horizontal pan ──────────────────────────────────────────────
    const tween = gsap.to(track, {
      x: () => -getDistance(),
      ease: 'none',
      scrollTrigger: {
        trigger: outer,
        start: 'top top',
        end: () => `+=${getDistance()}`,
        scrub: 1,
        pin: stage,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // ── Path draw-on-scroll ─────────────────────────────────────────
    // getTotalLength() returns the length in SVG user units; because
    // the SVG uses preserveAspectRatio="none" it scales, but
    // strokeDasharray/Offset are in the same user-unit space so the
    // ratio stays correct regardless of screen size.
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });

    const drawTween = gsap.to(path, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: outer,
        start: 'top top',
        end: () => `+=${getDistance()}`,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    // ── Panel animations driven by the line's actual draw progress ───
    // The line tip sits at (progress × track.scrollWidth) in track-space.
    // Each panel fires its enter/exit when that tip crosses its left edge.
    const allPanels = Array.from(track.querySelectorAll('.hproc__panel'));

    // --- collect visual elements ---
    const tiles      = allPanels[0]?.querySelectorAll('.hproc__cp-tile');
    const pencil     = allPanels[1]?.querySelector('.hproc__bs-pencil');
    const sticky     = allPanels[2]?.querySelector('.hproc__sticky');
    const wheel      = allPanels[3]?.querySelector('.hproc__wheel');
    const fontWords  = allPanels[4]?.querySelectorAll('.fw-sans, .fw-serif, .fw-mono');
    const browser    = allPanels[5]?.querySelector('.hproc__resp-browser');
    const blocks     = allPanels[6]?.querySelectorAll('.hproc__layout-stack > div');
    const uniqueTitle = allPanels[7]?.querySelector('.hproc__unique-title');
    const flowers    = allPanels[7]?.querySelectorAll('.hproc__sakura');

    // --- collect text elements ---
    const p1Title    = allPanels[0]?.querySelector('.hproc__cp-title');
    const p2Text     = allPanels[1]?.querySelectorAll('.hproc__bs-title, .body');
    const p3Text     = allPanels[2]?.querySelectorAll('.hproc__jfn-title, .body');
    const p4Body     = allPanels[3]?.querySelector('.body');
    const p6Text     = allPanels[5]?.querySelectorAll('.hproc__resp-title, .body');
    const p7Text     = allPanels[6]?.querySelectorAll('.hproc__layout-title, .body');
    const uniqueBody = allPanels[7]?.querySelector('.hproc__unique-body');

    // --- initial hidden state (visual) ---
    if (tiles?.length)    gsap.set(tiles,       { scale: 0, rotation: -15, opacity: 0 });
    if (pencil)           gsap.set(pencil,       { rotation: 50, scale: 0, opacity: 0, transformOrigin: '80% 80%' });
    if (sticky)           gsap.set(sticky,       { y: -50, opacity: 0 });
    if (wheel)            gsap.set(wheel,        { rotation: -180, scale: 0, opacity: 0 });
    if (fontWords?.length) gsap.set(fontWords,   { y: 40, opacity: 0 });
    if (browser)          gsap.set(browser,      { y: 30, opacity: 0 });
    if (blocks?.length)   gsap.set(blocks,       { scale: 0, opacity: 0 });
    if (uniqueTitle)      gsap.set(uniqueTitle,  { y: 30, opacity: 0 });
    if (flowers?.length)  gsap.set(flowers,      { scale: 0, opacity: 0 });

    // --- initial hidden state (text) ---
    if (p1Title)          gsap.set(p1Title,      { y: 20, opacity: 0 });
    if (p2Text?.length)   gsap.set(p2Text,       { y: 20, opacity: 0 });
    if (p3Text?.length)   gsap.set(p3Text,       { y: 20, opacity: 0 });
    if (p4Body)           gsap.set(p4Body,       { y: 20, opacity: 0 });
    if (p6Text?.length)   gsap.set(p6Text,       { y: 20, opacity: 0 });
    if (p7Text?.length)   gsap.set(p7Text,       { y: 20, opacity: 0 });
    if (uniqueBody)       gsap.set(uniqueBody,   { y: 20, opacity: 0 });

    const inText  = (els) => gsap.to(els, { y: 0,  opacity: 1, duration: 0.5,  stagger: 0.07, delay: 0.12, ease: 'power3.out',  clearProps: 'transform,opacity' });
    const outText = (els) => gsap.to(els, { y: 20, opacity: 0, duration: 0.25, stagger: 0.04,             ease: 'power2.in' });

    // --- enter / exit pairs ---
    const enterFns = [
      () => {
        if (tiles?.length) { gsap.killTweensOf(tiles); gsap.to(tiles, { scale: 1, rotation: 0, opacity: 1, duration: 0.55, stagger: 0.1, ease: 'back.out(1.7)', clearProps: 'transform,opacity' }); }
        if (p1Title) { gsap.killTweensOf(p1Title); inText(p1Title); }
      },
      () => {
        if (pencil) { gsap.killTweensOf(pencil); gsap.to(pencil, { rotation: 0, scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(2)', clearProps: 'transform,opacity' }); }
        if (p2Text?.length) { gsap.killTweensOf(p2Text); inText(p2Text); }
      },
      () => {
        if (sticky) { gsap.killTweensOf(sticky); gsap.to(sticky, { y: 0, opacity: 1, duration: 0.65, ease: 'back.out(1.4)', clearProps: 'transform,opacity' }); }
        if (p3Text?.length) { gsap.killTweensOf(p3Text); inText(p3Text); }
      },
      () => {
        if (wheel) { gsap.killTweensOf(wheel); gsap.to(wheel, { rotation: 0, scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.5)', clearProps: 'transform,opacity' }); }
        if (p4Body) { gsap.killTweensOf(p4Body); inText(p4Body); }
      },
      () => { if (fontWords?.length) { gsap.killTweensOf(fontWords); gsap.to(fontWords, { y: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: 'power3.out', clearProps: 'transform,opacity' }); } },
      () => {
        if (browser) { gsap.killTweensOf(browser); gsap.to(browser, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', clearProps: 'transform,opacity' }); }
        if (p6Text?.length) { gsap.killTweensOf(p6Text); inText(p6Text); }
      },
      () => {
        if (blocks?.length) { gsap.killTweensOf(blocks); gsap.to(blocks, { scale: 1, opacity: 1, duration: 0.45, stagger: 0.08, ease: 'back.out(1.7)', clearProps: 'transform,opacity' }); }
        if (p7Text?.length) { gsap.killTweensOf(p7Text); inText(p7Text); }
      },
      () => {
        if (uniqueTitle) { gsap.killTweensOf(uniqueTitle); gsap.to(uniqueTitle, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', clearProps: 'transform,opacity' }); }
        if (flowers?.length) { gsap.killTweensOf(flowers); gsap.to(flowers, { scale: 1, opacity: 1, duration: 0.5, stagger: 0.12, delay: 0.2, ease: 'back.out(1.7)', clearProps: 'transform,opacity' }); }
        if (uniqueBody) { gsap.killTweensOf(uniqueBody); inText(uniqueBody); }
      },
    ];
    const exitFns = [
      () => {
        if (tiles?.length) { gsap.killTweensOf(tiles); gsap.to(tiles, { scale: 0, rotation: -15, opacity: 0, duration: 0.25, stagger: 0.05, ease: 'power2.in' }); }
        if (p1Title) { gsap.killTweensOf(p1Title); outText(p1Title); }
      },
      () => {
        if (pencil) { gsap.killTweensOf(pencil); gsap.to(pencil, { rotation: 50, scale: 0, opacity: 0, duration: 0.3, ease: 'power2.in' }); }
        if (p2Text?.length) { gsap.killTweensOf(p2Text); outText(p2Text); }
      },
      () => {
        if (sticky) { gsap.killTweensOf(sticky); gsap.to(sticky, { y: -50, opacity: 0, duration: 0.3, ease: 'power2.in' }); }
        if (p3Text?.length) { gsap.killTweensOf(p3Text); outText(p3Text); }
      },
      () => {
        if (wheel) { gsap.killTweensOf(wheel); gsap.to(wheel, { rotation: -180, scale: 0, opacity: 0, duration: 0.35, ease: 'power2.in' }); }
        if (p4Body) { gsap.killTweensOf(p4Body); outText(p4Body); }
      },
      () => { if (fontWords?.length) { gsap.killTweensOf(fontWords); gsap.to(fontWords, { y: 40, opacity: 0, duration: 0.25, stagger: 0.06, ease: 'power2.in' }); } },
      () => {
        if (browser) { gsap.killTweensOf(browser); gsap.to(browser, { y: 30, opacity: 0, duration: 0.3, ease: 'power2.in' }); }
        if (p6Text?.length) { gsap.killTweensOf(p6Text); outText(p6Text); }
      },
      () => {
        if (blocks?.length) { gsap.killTweensOf(blocks); gsap.to(blocks, { scale: 0, opacity: 0, duration: 0.2, stagger: 0.05, ease: 'power2.in' }); }
        if (p7Text?.length) { gsap.killTweensOf(p7Text); outText(p7Text); }
      },
      () => {
        if (uniqueTitle) { gsap.killTweensOf(uniqueTitle); gsap.to(uniqueTitle, { y: 30, opacity: 0, duration: 0.3, ease: 'power2.in' }); }
        if (flowers?.length) { gsap.killTweensOf(flowers); gsap.to(flowers, { scale: 0, opacity: 0, duration: 0.25, stagger: 0.06, ease: 'power2.in' }); }
        if (uniqueBody) { gsap.killTweensOf(uniqueBody); outText(uniqueBody); }
      },
    ];

    // --- single progress watcher tied to the same scroll range ---
    // Threshold: fire when the drawn line has crossed into a panel.
    // First three panels trigger earlier (line just touches them) so the
    // initial reveal feels punchy; later panels wait until ~25% in.
    const TRIGGER_EARLY = 0.05;
    const TRIGGER_INTO_PANEL = 0.25;
    const panelEntered = new Array(allPanels.length).fill(false);
    const getThresholds = () =>
      allPanels.map((p, i) => {
        // P1 fires almost immediately so it lands while the section pins in
        if (i === 0) return 0.02;
        const ratio = i < 3 ? TRIGGER_EARLY : TRIGGER_INTO_PANEL;
        return (p.offsetLeft + p.offsetWidth * ratio) / track.scrollWidth;
      });
    let thresholds = getThresholds();

    const progressST = ScrollTrigger.create({
      trigger: outer,
      start: 'top top',
      end: () => `+=${getDistance()}`,
      scrub: true,
      invalidateOnRefresh: true,
      onRefresh: () => { thresholds = getThresholds(); },
      onUpdate: (self) => {
        const prog = self.progress;
        thresholds.forEach((t, i) => {
          if (prog >= t && !panelEntered[i]) {
            panelEntered[i] = true;
            enterFns[i]?.();
          } else if (prog < t && panelEntered[i]) {
            panelEntered[i] = false;
            exitFns[i]?.();
          }
        });
      },
    });

    const onResize = () => {
      setHeight();
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', onResize);

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      drawTween.scrollTrigger?.kill();
      drawTween.kill();
      progressST.kill();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <section className="hproc" aria-label="Our creation process">
      <div ref={outerRef} className="hproc__outer">
        <div ref={stageRef} className="hproc__stage">
          <div ref={trackRef} className="hproc__track">
            {/* Wavy line lives inside the track so it spans all panels */}
            <Waves pathRef={pathRef} />
            <PanelCreationProcess />
            <PanelBrandStrategy />
            <PanelJustForNow />
            <PanelColor />
            <PanelFont />
            <PanelResponsiveness />
            <PanelLayout />
            <PanelUnique />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- */
/* Wavy purple background line — absolute, full-track                */
/* ----------------------------------------------------------------- */
function Waves({ pathRef }) {
  const panels = 8;
  const width = panels * 100;
  const midY = 50;
  const amp = 26;
  // How far horizontally the control points sit from each segment boundary.
  // Placing them at ~37% of the segment width produces a natural sine shape.
  const cp = 37;

  // First segment: explicit cubic bezier (peak, going up)
  let d = `M 0 ${midY} C ${cp} ${midY - amp}, ${100 - cp} ${midY - amp}, 100 ${midY}`;

  // Remaining segments: S (smooth cubic) — the SVG engine auto-mirrors the
  // previous second control point, guaranteeing tangent continuity (no teeth).
  for (let i = 1; i < panels; i++) {
    const x1 = (i + 1) * 100;
    const sign = i % 2 === 0 ? -1 : 1; // alternate trough / peak
    const cpY = midY + sign * amp;
    d += ` S ${x1 - cp} ${cpY}, ${x1} ${midY}`;
  }

  return (
    <div className="hproc__waves" aria-hidden="true">
      <svg
        viewBox={`0 0 ${width} 100`}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path ref={pathRef} d={d} />
      </svg>
    </div>
  );
}

/* ----------------------------------------------------------------- */
/* Panels                                                            */
/* ----------------------------------------------------------------- */
function PanelCreationProcess() {
  return (
    <div className="hproc__panel hproc__panel--below">
      <div className="hproc__panel-inner">
        <div className="hproc__cp-layout">
          <div className="hproc__cp-grid">
            <div className="hproc__cp-tile" />
            <div className="hproc__cp-tile hproc__cp-tile--yellow" />
            <div className="hproc__cp-tile" />
            <div className="hproc__cp-tile" />
          </div>
          <div className="hproc__cp-title">
            Creation
            <br />
            Process
          </div>
        </div>
      </div>
    </div>
  );
}

function PanelBrandStrategy() {
  return (
    <div className="hproc__panel hproc__panel--above">
      <div className="hproc__panel-inner">
        <div className="hproc__bs-layout">
          <PencilSVG />
          <div className="hproc__bs-title">
            Brand &amp;
            <br />
            Strategy
          </div>
          <p className="body">
            Stop settling for generic templates. We design cool, highly creative
            websites tailored exactly to your brand’s unique edge.
          </p>
        </div>
      </div>
    </div>
  );
}

function PencilSVG() {
  return (
    <svg
      className="hproc__bs-pencil"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g transform="rotate(-35 50 50)">
        <rect x="22" y="42" width="46" height="16" rx="2" fill="#FFD93D" stroke="#0A0A0A" strokeWidth="2" />
        <rect x="14" y="42" width="10" height="16" rx="2" fill="#FF8AB8" stroke="#0A0A0A" strokeWidth="2" />
        <rect x="22" y="42" width="3" height="16" fill="#0A0A0A" />
        <polygon points="68,42 80,50 68,58" fill="#F4D9B0" stroke="#0A0A0A" strokeWidth="2" />
        <polygon points="76,46 80,50 76,54" fill="#0A0A0A" />
        <line x1="34" y1="46" x2="62" y2="46" stroke="#0A0A0A" strokeWidth="1" opacity="0.4" />
        <line x1="34" y1="54" x2="62" y2="54" stroke="#0A0A0A" strokeWidth="1" opacity="0.4" />
      </g>
    </svg>
  );
}

function PanelJustForNow() {
  return (
    <div className="hproc__panel hproc__panel--below">
      <div className="hproc__panel-inner">
        <div className="hproc__jfn-layout">
          <div className="hproc__sticky">
            <h4>to-do</h4>
            <ul>
              <li className="done"><span className="box" /><span>Concept</span></li>
              <li className="done"><span className="box" /><span>Wireframes</span></li>
              <li><span className="box" /><span>Visual design</span></li>
              <li><span className="box" /><span>Build</span></li>
              <li><span className="box" /><span>Launch</span></li>
            </ul>
          </div>
          <div className="hproc__jfn-title">
            Just for
            <br />
            now
          </div>
          <p className="body">
            Stop settling for generic templates. We design cool, highly creative
            websites tailored exactly to your brand.
          </p>
        </div>
      </div>
    </div>
  );
}

function PanelColor() {
  return (
    <div className="hproc__panel hproc__panel--above">
      <div className="hproc__panel-inner">
        <div className="hproc__color-layout">
          <div className="hproc__wheel">
            <span className="hproc__wheel-label">Color</span>
          </div>
          <p className="body" style={{ textAlign: 'center' }}>
            Stop settling for generic templates. We design cool, highly.
          </p>
        </div>
      </div>
    </div>
  );
}

function PanelFont() {
  return (
    <div className="hproc__panel hproc__panel--below">
      <div className="hproc__panel-inner">
        <div className="hproc__font-layout">
          <div className="hproc__font-words">
            <span className="fw-sans">Font</span>
            <span className="fw-serif">Font</span>
            <span className="fw-mono">Font</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PanelResponsiveness() {
  return (
    <div className="hproc__panel hproc__panel--above">
      <div className="hproc__panel-inner">
        <div className="hproc__resp-layout">
          <div className="hproc__resp-title">Responsiveness</div>
          <p className="body">
            Stop settling for generic templates. We design cool, highly.
          </p>
          <div className="wyg-brand-visual hproc__resp-browser">
            <div className="wyg-brand-browser">
              <div className="wyg-brand-browser-bar">
                <span className="wdot wdot-r" />
                <span className="wdot wdot-y" />
                <span className="wdot wdot-g" />
                <div className="wyg-brand-url-bar">
                  <span>yourbrand.com</span>
                </div>
              </div>
              <div className="wyg-brand-screen">
                <div className="wyg-brand-page">
                  <div className="wyg-bp-nav">
                    <div className="wyg-bp-logo" />
                    <div className="wyg-bp-links"><span /><span /><span /></div>
                  </div>
                  <div className="wyg-bp-hero">
                    <div className="wyg-bp-tagline" />
                    <div className="wyg-bp-subtitle" />
                    <div className="wyg-bp-cta" />
                  </div>
                  <div className="wyg-bp-features">
                    <div className="wyg-bp-feat" />
                    <div className="wyg-bp-feat" />
                    <div className="wyg-bp-feat" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PanelLayout() {
  return (
    <div className="hproc__panel hproc__panel--below">
      <div className="hproc__panel-inner">
        <div className="hproc__layout-row">
          <div className="hproc__layout-stack">
            <div />
            <div />
            <div className="tall" />
            <div />
            <div />
          </div>
          <div className="hproc__layout-title">Layout</div>
          <p className="body">
            Stop settling for generic templates. We design cool, highly.
          </p>
        </div>
      </div>
    </div>
  );
}

/* Cherry blossom SVG — 5 rounded petals + stamen dots */
function CherryBlossom({ size = 100 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* 5 petals rotated around centre */}
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="50"
          cy="26"
          rx="13"
          ry="20"
          fill="#F9A8C4"
          transform={`rotate(${deg} 50 50)`}
        />
      ))}
      {/* Lighter inner petal highlight */}
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={`h${deg}`}
          cx="50"
          cy="30"
          rx="7"
          ry="11"
          fill="#FDD0DF"
          transform={`rotate(${deg} 50 50)`}
        />
      ))}
      {/* Centre circle */}
      <circle cx="50" cy="50" r="9" fill="#F472A0" />
      {/* Stamen dots */}
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <circle
            key={`s${deg}`}
            cx={50 + 6 * Math.cos(rad)}
            cy={50 + 6 * Math.sin(rad)}
            r="1.8"
            fill="#C2185B"
          />
        );
      })}
    </svg>
  );
}

function PanelUnique() {
  return (
    <div className="hproc__panel hproc__panel--above">
      <div className="hproc__panel-inner">
        <div className="hproc__unique-layout">
          {/* Large flower — top right */}
          <span className="hproc__sakura hproc__sakura--tr" aria-hidden="true">
            <CherryBlossom size={130} />
          </span>
          {/* Medium flower — bottom left */}
          <span className="hproc__sakura hproc__sakura--bl" aria-hidden="true">
            <CherryBlossom size={80} />
          </span>
          {/* Small flower — mid right accent */}
          <span className="hproc__sakura hproc__sakura--mr" aria-hidden="true">
            <CherryBlossom size={60} />
          </span>
          <div className="hproc__unique-title">Make it unique</div>
          <p className="hproc__unique-body">
            Stop settling for generic templates.<br />We design cool, highly personalised websites.
          </p>
        </div>
      </div>
    </div>
  );
}
