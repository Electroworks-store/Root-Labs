import { useEffect, useRef } from 'react';
import React from 'react';
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
        scrub: 0.3,
        invalidateOnRefresh: true,
      },
    });

    // ── Panel animations driven by the line's actual draw progress ───
    // The line tip sits at (progress × track.scrollWidth) in track-space.
    // Each panel fires its enter/exit when that tip crosses its left edge.
    const allPanels = Array.from(track.querySelectorAll('.hproc__panel'));

    // --- collect visual elements ---
    const tiles      = allPanels[0]?.querySelectorAll('.hproc__cp-tile');
    const cpAnnots   = allPanels[0]?.querySelectorAll('[data-cp="chip"], [data-cp="status"], [data-cp="coords"]');
    const cpCallouts = allPanels[0]?.querySelectorAll('[data-cp="callout"]');
    const sticky     = allPanels[1]?.querySelector('.hproc__sticky');
    const wheel      = allPanels[2]?.querySelector('.hproc__wheel');
    const fontScene     = allPanels[3]?.querySelector('.hproc__font-heading-wrap');
    const fontInfo      = allPanels[3]?.querySelectorAll('.hproc__font-callout, .hproc__font-info .body');
    const fontHighlight = allPanels[3]?.querySelectorAll('[data-fp="hl"]');
    const todoCard      = allPanels[1]?.querySelector('.hproc__ios-todo');
    const browser    = allPanels[4]?.querySelector('.hproc__resp-browser');
    const blocks     = allPanels[5]?.querySelectorAll('.hproc__layout-tile');
    const uniqueTitle = allPanels[6]?.querySelector('.hproc__unique-title');
    const flowers    = allPanels[6]?.querySelectorAll('.hproc__sakura');

    // --- collect text elements ---
    const p1Title    = allPanels[0]?.querySelector('.hproc__cp-title');
    const p3Text     = allPanels[1]?.querySelectorAll('.hproc__jfn-title, .body');
    const p4Body     = allPanels[2]?.querySelector('.body');
    const p6Text     = allPanels[4]?.querySelectorAll('.hproc__resp-title, .body');
    const p7Text     = allPanels[5]?.querySelectorAll('.hproc__layout-title, .body');
    const uniqueBody = allPanels[6]?.querySelector('.hproc__unique-body');

    // --- initial hidden state (visual) ---
    if (tiles?.length)    gsap.set(tiles,       { y: -260, opacity: 0 });
    if (cpAnnots?.length)   gsap.set(cpAnnots,   { y: 12, opacity: 0 });
    if (cpCallouts?.length) gsap.set(cpCallouts, { y: 16, opacity: 0 });
    if (sticky)           gsap.set(sticky,       { y: -50, opacity: 0 });
    if (wheel)            gsap.set(wheel,        { rotation: -180, scale: 0, opacity: 0 });
    if (fontScene)           gsap.set(fontScene,      { y: 40, opacity: 0 });
    if (fontHighlight?.length) gsap.set(fontHighlight, { strokeDasharray: 460, strokeDashoffset: 460 });
    if (fontInfo?.length)     gsap.set(fontInfo,       { y: 20, opacity: 0 });
    if (todoCard)             gsap.set(todoCard,       { y: 44, opacity: 0, scale: 0.88 });
    if (browser)          gsap.set(browser,      { y: 30, opacity: 0 });
    if (blocks?.length)   gsap.set(blocks,       { opacity: 0 });
    if (uniqueTitle)      gsap.set(uniqueTitle,  { y: 30, opacity: 0 });
    if (flowers?.length)  gsap.set(flowers,      { scale: 0, opacity: 0 });

    // --- initial hidden state (text) ---
    if (p1Title)          gsap.set(p1Title,      { y: 20, opacity: 0 });
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
        if (tiles?.length) {
          gsap.killTweensOf(tiles);
          const ta = Array.from(tiles);
          // Column layout: col0=[ta0 top-left, ta1 bottom-left], col1=[ta2 top-right, ta3 bottom-right]
          const bottom = [ta[1], ta[3]].filter(Boolean);
          const top    = [ta[0], ta[2]].filter(Boolean);
          gsap.to(bottom, { y: 0, opacity: 1, duration: 0.95, stagger: 0.1,              ease: 'bounce.out', clearProps: 'transform,opacity' });
          gsap.to(top,    { y: 0, opacity: 1, duration: 0.95, stagger: 0.1, delay: 0.22, ease: 'bounce.out', clearProps: 'transform,opacity' });
        }
        if (cpAnnots?.length) {
          gsap.killTweensOf(cpAnnots);
          gsap.to(cpAnnots, { y: 0, opacity: 1, duration: 0.45, stagger: 0.08, delay: 0.55, ease: 'power3.out', clearProps: 'transform,opacity' });
        }
        if (cpCallouts?.length) {
          gsap.killTweensOf(cpCallouts);
          gsap.to(cpCallouts, { y: 0, opacity: 1, duration: 0.55, stagger: 0.12, delay: 0.85, ease: 'power3.out', clearProps: 'transform,opacity' });
        }
        if (p1Title) { gsap.killTweensOf(p1Title); inText(p1Title); }
      },
      () => {
        if (sticky) { gsap.killTweensOf(sticky); gsap.to(sticky, { y: 0, opacity: 1, duration: 0.65, ease: 'back.out(1.4)', clearProps: 'transform,opacity' }); }
        if (todoCard) { gsap.killTweensOf(todoCard); gsap.to(todoCard, { y: 0, opacity: 1, scale: 1, duration: 0.72, delay: 0.18, ease: 'back.out(1.7)', clearProps: 'transform,opacity' }); }
        if (p3Text?.length) { gsap.killTweensOf(p3Text); inText(p3Text); }
      },
      () => {
        if (wheel) { gsap.killTweensOf(wheel); gsap.to(wheel, { rotation: 0, scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.5)', clearProps: 'transform,opacity' }); }
        if (p4Body) { gsap.killTweensOf(p4Body); inText(p4Body); }
      },
      () => {
        if (fontScene) { gsap.killTweensOf(fontScene); gsap.to(fontScene, { y: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.4)', clearProps: 'transform,opacity' }); }
        if (fontHighlight?.length) { gsap.killTweensOf(fontHighlight); gsap.to(fontHighlight, { strokeDashoffset: 0, duration: 0.82, stagger: 0.2, delay: 0.7, ease: 'power2.out' }); }
        if (fontInfo?.length) { gsap.killTweensOf(fontInfo); inText(fontInfo); }
      },
      () => {
        if (browser) { gsap.killTweensOf(browser); gsap.to(browser, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', clearProps: 'transform,opacity' }); }
        if (p6Text?.length) { gsap.killTweensOf(p6Text); inText(p6Text); }
      },
      () => {
        if (blocks?.length) { gsap.killTweensOf(blocks); gsap.to(blocks, { opacity: 1, duration: 0.45, stagger: 0.06, ease: 'power2.out' }); }
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
        if (tiles?.length) {
          gsap.killTweensOf(tiles);
          gsap.to(tiles, { y: -260, opacity: 0, duration: 0.3, stagger: 0.04, ease: 'power2.in' });
        }
        if (cpAnnots?.length)   { gsap.killTweensOf(cpAnnots);   gsap.to(cpAnnots,   { y: 12, opacity: 0, duration: 0.2, ease: 'power2.in' }); }
        if (cpCallouts?.length) { gsap.killTweensOf(cpCallouts); gsap.to(cpCallouts, { y: 16, opacity: 0, duration: 0.2, ease: 'power2.in' }); }
        if (p1Title) { gsap.killTweensOf(p1Title); outText(p1Title); }
      },
      () => {
        if (sticky) { gsap.killTweensOf(sticky); gsap.to(sticky, { y: -50, opacity: 0, duration: 0.3, ease: 'power2.in' }); }
        if (todoCard) { gsap.killTweensOf(todoCard); gsap.to(todoCard, { y: 44, opacity: 0, scale: 0.88, duration: 0.28, ease: 'power2.in' }); }
        if (p3Text?.length) { gsap.killTweensOf(p3Text); outText(p3Text); }
      },
      () => {
        if (wheel) { gsap.killTweensOf(wheel); gsap.to(wheel, { rotation: -180, scale: 0, opacity: 0, duration: 0.35, ease: 'power2.in' }); }
        if (p4Body) { gsap.killTweensOf(p4Body); outText(p4Body); }
      },
      () => {
        if (fontScene) { gsap.killTweensOf(fontScene); gsap.to(fontScene, { y: 40, opacity: 0, duration: 0.3, ease: 'power2.in' }); }
        if (fontHighlight?.length) { gsap.killTweensOf(fontHighlight); gsap.to(fontHighlight, { strokeDashoffset: 460, duration: 0.25, ease: 'power2.in' }); }
        if (fontInfo?.length) { gsap.killTweensOf(fontInfo); outText(fontInfo); }
      },
      () => {
        if (browser) { gsap.killTweensOf(browser); gsap.to(browser, { y: 30, opacity: 0, duration: 0.3, ease: 'power2.in' }); }
        if (p6Text?.length) { gsap.killTweensOf(p6Text); outText(p6Text); }
      },
      () => {
        if (blocks?.length) { gsap.killTweensOf(blocks); gsap.to(blocks, { opacity: 0, duration: 0.2, stagger: 0.04, ease: 'power2.in' }); }
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
    const panelEntered = new Array(allPanels.length).fill(false);
    // Fire when the panel's left edge reaches ~40% from the left of the
    // viewport (i.e. the panel is in the right-center of the screen,
    // just after it has fully entered from the right edge).
    const getThresholds = () => {
      const vw = window.innerWidth;
      const scrollable = track.scrollWidth - vw;
      return allPanels.map((p, i) => {
        if (i === 0) return Infinity;
        const fireAt = (p.offsetLeft - vw * 0.65) / scrollable;
        return Math.max(0, fireAt);
      });
    };
    let thresholds = getThresholds();

    // Fire panel 0's enter animation as soon as the section enters the
    // viewport (vertical scroll only) — no horizontal scroll needed.
    // No exit: let the content stay rendered and translate naturally
    // off-screen as the horizontal track pans past it.
    const panel0ST = ScrollTrigger.create({
      trigger: outer,
      start: 'top bottom-=15%',
      end: 'bottom top',
      onEnter:    () => { if (!panelEntered[0]) { panelEntered[0] = true; enterFns[0]?.(); } },
      onEnterBack:() => { if (!panelEntered[0]) { panelEntered[0] = true; enterFns[0]?.(); } },
    });

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
          // Panel 0 is managed entirely by panel0ST (viewport entry).
          // Never let the progress watcher touch it.
          if (i === 0) return;
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
      panel0ST.kill();
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
  const panels = 7;
  const width = panels * 100;
  const midY = 50;
  const amp = 26;
  // How far horizontally the control points sit from each segment boundary.
  // Placing them at ~37% of the segment width produces a natural sine shape.
  const cp = 37;

  // First segment: explicit cubic bezier (trough, going down)
  let d = `M 0 ${midY} C ${cp} ${midY + amp}, ${100 - cp} ${midY + amp}, 100 ${midY}`;

  // Remaining segments: S (smooth cubic) — the SVG engine auto-mirrors the
  // previous second control point, guaranteeing tangent continuity (no teeth).
  for (let i = 1; i < panels; i++) {
    const x1 = (i + 1) * 100;
    const sign = i % 2 === 0 ? 1 : -1; // alternate peak / trough
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
  const boardRef = useRef(null);

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    const cols = Array.from(board.querySelectorAll('.hproc__cp-col'));
    const cleanups = [];

    cols.forEach((col) => {
      const tiles = Array.from(col.querySelectorAll('.hproc__cp-tile'));
      // tiles[0] = top, tiles[1] = bottom (DOM order matches column flex direction)
      const [topTile, bottomTile] = tiles;

      // Realistic single-bounce: quick takeoff, gravity fall, small settle
      const bounce = (el, delay = 0) => {
        if (!el) return;
        gsap.killTweensOf(el);
        const tl = gsap.timeline({ defaults: { overwrite: 'auto' } });
        tl.to(el, { y: -32, duration: 0.18, ease: 'power2.out', delay })
          .to(el, { y: 0,   duration: 0.65, ease: 'bounce.out' });
      };

      if (topTile) {
        const onEnter = () => bounce(topTile);
        topTile.addEventListener('mouseenter', onEnter);
        cleanups.push(() => topTile.removeEventListener('mouseenter', onEnter));
      }
      if (bottomTile) {
        const onEnter = () => {
          // Bottom rises first; the tile resting on it gets carried up an instant later.
          bounce(bottomTile);
          bounce(topTile, 0.04);
        };
        bottomTile.addEventListener('mouseenter', onEnter);
        cleanups.push(() => bottomTile.removeEventListener('mouseenter', onEnter));
      }
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <div className="hproc__panel hproc__panel--below">
      <div className="hproc__panel-inner">
        <div className="hproc__cp-stage">
          {/* Top-right version chip */}
          <div className="hproc__cp-chip" data-cp="chip">v8.0.3</div>

          {/* 4x4 grid behind, with the 2x2 tile block centered inside it */}
          <div className="hproc__cp-board" ref={boardRef}>
            <div className="hproc__cp-gridbg" aria-hidden="true">
              {Array.from({ length: 16 }).map((_, i) => (
                <span key={i} className="hproc__cp-cell" />
              ))}
            </div>

            <div className="hproc__cp-grid">
              <div className="hproc__cp-col">
                <div className="hproc__cp-tile" data-pos="top" />
                <div className="hproc__cp-tile" data-pos="bottom" />
              </div>
              <div className="hproc__cp-col">
                <div className="hproc__cp-tile hproc__cp-tile--yellow" data-pos="top" />
                <div className="hproc__cp-tile" data-pos="bottom" />
              </div>
            </div>

            {/* Coordinates sit directly under the bottom-left tile, width of 1 cell */}
            <div className="hproc__cp-coords" data-cp="coords">
              <span>x: 142.1</span>
              <span>y: 582.3</span>
            </div>
          </div>

          {/* Right: huge title */}
          <div className="hproc__cp-title">
            Creation
            <br />
            Process
          </div>

          {/* Hand-drawn callouts pointing at design elements — each arrow is unique */}
          <CpCallout
            className="hproc__cp-callout--tiles"
            text="Bouncy color blocks"
            arrow="curveDownRight"
            pathD="M 12 10 C 22 2, 48 16, 64 38 C 74 54, 96 70, 114 72"
            headPos={{ x: 114, y: 72, rot: 28 }}
            dotPos={{ cx: 62, cy: 36 }}
          />
          <CpCallout
            className="hproc__cp-callout--grid"
            text="4&times;4 reference grid"
            arrow="curveUpRight"
            pathD="M 6 72 C 14 82, 38 68, 54 52 C 66 38, 76 16, 106 8"
            headPos={{ x: 106, y: 8, rot: -40 }}
            dotPos={{ cx: 52, cy: 50 }}
          />
          <CpCallout
            className="hproc__cp-callout--font"
            text="Bold display font"
            arrow="curveUpLeft"
            pathD="M 108 72 C 98 82, 76 64, 60 46 C 44 28, 22 12, 8 8"
            headPos={{ x: 8, y: 8, rot: -148 }}
            dotPos={{ cx: 60, cy: 46 }}
          />
        </div>
      </div>
    </div>
  );
}

/* Hand-drawn callout: wavy SVG sketch box + curly arrow */
function CpCallout({ className = '', text, arrow, pathD, headPos, dotPos }) {
  // Fallback arrow paths in 120×80 viewBox (overridden per-callout via props).
  const defaultPaths = {
    curveDownRight: 'M 8 14 C 30 6, 60 30, 70 50 C 76 64, 88 70, 110 70',
    curveDownLeft:  'M 112 14 C 90 6, 60 30, 50 50 C 44 64, 32 70, 10 70',
    curveUpRight:   'M 8 66 C 30 74, 60 50, 70 30 C 76 16, 88 10, 110 10',
    curveUpLeft:    'M 112 66 C 90 74, 60 50, 50 30 C 44 16, 32 10, 10 10',
  };
  const defaultHeads = {
    curveDownRight: { x: 110, y: 70, rot: 30 },
    curveDownLeft:  { x: 10,  y: 70, rot: 150 },
    curveUpRight:   { x: 110, y: 10, rot: -30 },
    curveUpLeft:    { x: 10,  y: 10, rot: -150 },
  };
  const d    = pathD   ?? defaultPaths[arrow];
  const head = headPos ?? defaultHeads[arrow];
  const dot  = dotPos  ?? { cx: 60, cy: 42 };
  return (
    <div className={`hproc__cp-callout ${className}`} data-cp="callout">
      <div className="hproc__cp-callout-box">
        {/* Hand-drawn wavy rectangle drawn behind the text */}
        <svg
          className="hproc__cp-callout-frame"
          viewBox="0 0 220 50"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Slightly imperfect rectangle: each edge is a gentle curve and
              corners overshoot a touch, mimicking a hand-drawn box. */}
          <path
            d="
              M 6 4
              C 60 2, 130 6, 214 3
              C 218 18, 216 32, 215 47
              C 150 49, 70 46, 5 48
              C 3 32, 7 18, 6 4
              Z
            "
            fill="none"
            stroke="#0A0A0A"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="hproc__cp-callout-text">{text}</span>
      </div>
      <svg
        className="hproc__cp-callout-arrow"
        viewBox="0 0 120 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d={d}
          stroke="#0A0A0A"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <g transform={`translate(${head.x} ${head.y}) rotate(${head.rot})`}>
          <path
            d="M 0 0 L -8 -4 M 0 0 L -8 4"
            stroke="#0A0A0A"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </g>
      </svg>
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
  const INITIAL = [
    { label: 'Discovery & brief', done: true  },
    { label: 'Wireframes',        done: true  },
    { label: 'Visual design',     done: false },
    { label: 'Development',       done: false },
    { label: 'Launch',            done: false },
  ];
  const [items, setItems] = React.useState(INITIAL);
  const toggle = (idx) =>
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, done: !it.done } : it));
  const doneCount = items.filter(i => i.done).length;

  return (
    <div className="hproc__panel hproc__panel--below">
      <div className="hproc__panel-inner">
        <div className="hproc__jfn-layout">

          {/* left: text */}
          <div className="hproc__jfn-text">
            <div className="hproc__jfn-title">
              Brand &amp;
              <br />
              Strategy
            </div>
            <p className="body">
              Every great website starts with a clear direction. We define your
              voice, positioning, and visual identity before a single pixel is drawn.
            </p>
          </div>

          {/* right: ios todo */}
          <div className="hproc__ios-todo">
            <div className="hproc__ios-todo__shine" aria-hidden="true" />

            <div className="hproc__ios-todo__header">
              <span className="hproc__ios-todo__title">Project tasks</span>
              <span className="hproc__ios-todo__badge">{doneCount}/{items.length}</span>
            </div>

            <div className="hproc__ios-todo__progress-track" aria-hidden="true">
              <div
                className="hproc__ios-todo__progress-fill"
                style={{ width: `${(doneCount / items.length) * 100}%` }}
              />
            </div>

            <ul className="hproc__ios-todo__list">
              {items.map(({ label, done }, idx) => (
                <li
                  key={idx}
                  className={`hproc__ios-todo__item${done ? ' done' : ''}`}
                  onClick={() => toggle(idx)}
                  role="checkbox"
                  aria-checked={done}
                  tabIndex={0}
                  onKeyDown={e => (e.key === ' ' || e.key === 'Enter') && toggle(idx)}
                >
                  <span className="hproc__ios-todo__checkbox" aria-hidden="true">
                    {done && (
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                  <span className="hproc__ios-todo__label">{label}</span>
                </li>
              ))}
            </ul>
          </div>

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
            Colors shape emotion, trust, and action. Cool blues calm and stabilize. Warm oranges energize and inspire. Strategic palettes guide users and reinforce your brand.
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
          <div className="hproc__font-info">

            {/* Heading with hand-painted highlighter swipe behind it */}
            <div className="hproc__font-heading-wrap">
              <svg
                className="hproc__font-highlight"
                viewBox="0 0 420 110"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                {/* Two overlapping marker passes for an uneven, hand-drawn feel */}
                <path
                  data-fp="hl"
                  d="M 14 58 C 80 50, 180 66, 290 54 C 350 47, 390 60, 408 56"
                  stroke="#FFD93D"
                  strokeWidth="62"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.78"
                />
                <path
                  data-fp="hl"
                  d="M 22 64 C 120 70, 220 50, 320 62 C 360 67, 388 56, 402 60"
                  stroke="#FFD93D"
                  strokeWidth="54"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.55"
                />
              </svg>
              <h3 className="hproc__font-title">Typography</h3>

              {/* Hand-drawn callout — above right side of heading, arrow curves left to connect */}
              <CpCallout
                className="hproc__font-callout"
                text="sets the whole tone"
                arrow="curveDownLeft"
                pathD="M 50 4 C 38 28, 18 55, 2 73"
                headPos={{ x: 2, y: 73, rot: 25 }}
                dotPos={{ cx: 28, cy: 40 }}
              />
            </div>

            <p className="body">
              Type carries meaning before a single word is read. The right
              pairing builds trust, sets rhythm, and gives your brand its
              unmistakable voice. The wrong one quietly undermines
              everything around it.
            </p>

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

          {/* Left: morphing device frame */}
          <div className="hproc__resp-browser">
            <div className="hproc__morph-frame">

              {/* Live page content (responds via @container queries) */}
              <div className="hproc__morph-page">
                <div className="hproc__morph-nav">
                  <div className="hproc__morph-logo" />
                  <div className="hproc__morph-links">
                    <span /><span /><span />
                  </div>
                  <div className="hproc__morph-burger" aria-hidden="true">
                    <span /><span /><span />
                  </div>
                </div>

                <div className="hproc__morph-hero">
                  <div className="hproc__morph-heading">Build Beautiful<br />Websites</div>
                  <div className="hproc__morph-subline" />
                  <div className="hproc__morph-cta">Get Started</div>
                </div>

                <div className="hproc__morph-grid">
                  <div className="hproc__morph-card" />
                  <div className="hproc__morph-card" />
                  <div className="hproc__morph-card" />
                </div>
              </div>

              {/* Fake cursor — tip sits on the bottom-right corner */}
              <div className="hproc__morph-cursor" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path
                    d="M5.5 3.2 L5.5 17.5 L9.3 13.9 L12.1 19.4 L13.9 18.6 L11.1 13.1 L16.6 13.1 Z"
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

          {/* Right: title + body text */}
          <div className="hproc__resp-text">
            <div className="hproc__resp-title">Responsiveness</div>
            <p className="body">
              One site, every screen. Layouts reflow, type scales, and content
              re-stacks so your brand feels purpose-built whether it lands on a
              27 inch monitor or a phone in someone&rsquo;s pocket.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

function PanelLayout() {
  const pathRef   = useRef(null);
  const tilesRef  = useRef([]);
  const TILE_COUNT = 13;

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    let raf = 0;
    const start = performance.now();

    const tick = (now) => {
      const t = (now - start) / 1000;

      // Single smooth arc — two control points wobble on independent sine phases
      // so the curve breathes organically without repeating
      const cp1x =  80 + Math.cos(t * 0.31 + 1.0) * 40;
      const cp1y = 100 + Math.sin(t * 0.47)        * 60;
      const cp2x = 600 + Math.cos(t * 0.27 + 2.2)  * 40;
      const cp2y = 100 + Math.sin(t * 0.39 + 1.6)  * 60;

      // Path goes well off-screen left (-180) and off-screen right (860)
      const d = `M -180 870 C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, 860 855`;
      path.setAttribute('d', d);

      const total = path.getTotalLength();
      // KEY FIX: span = total / count → tiles always perfectly fill the arc,
      // no gaps ever, regardless of how the path morphs.
      const span = total / TILE_COUNT;
      const flow  = (t * 26) % total;

      tilesRef.current.forEach((el, i) => {
        if (!el) return;
        const u  = (i * span + flow) % total;
        const p  = path.getPointAtLength(u);
        const p2 = path.getPointAtLength(Math.min(u + 2, total - 0.1));
        const angle = Math.atan2(p2.y - p.y, p2.x - p.x) * 180 / Math.PI;
        const sway  = Math.sin(t * 1.2 + i * 0.88) * 2.5;
        el.setAttribute(
          'transform',
          `translate(${p.x.toFixed(2)} ${p.y.toFixed(2)}) rotate(${(angle + sway).toFixed(2)})`
        );
      });

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="hproc__panel hproc__panel--below">
      <div className="hproc__panel-inner">
        <div className="hproc__layout-row">

          {/* Full-panel SVG — arc extends off both side edges */}
          <svg
            className="hproc__layout-arc"
            viewBox="0 0 680 840"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* Guide path — coords outside viewBox are fine, overflow:visible */}
            <path
              ref={pathRef}
              d="M -180 870 C 80 100, 600 100, 860 855"
              fill="none"
              stroke="none"
            />
            {Array.from({ length: TILE_COUNT }).map((_, i) => (
              <g
                key={i}
                className="hproc__layout-tile"
                ref={(el) => (tilesRef.current[i] = el)}
              >
                {/* Placeholder rect — swap for <image> when real assets ready */}
                <rect x={-36} y={-22} width={72} height={44} rx={6} fill="#0A0A0A" />
              </g>
            ))}
          </svg>

          <div className="hproc__layout-text">
            <div className="hproc__layout-title">Layout</div>
            <p className="body">
              Stop settling for generic templates. We design cool, highly
              custom layouts that frame your content with intent.
            </p>
          </div>

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
    <div className="hproc__panel hproc__panel--center">
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
