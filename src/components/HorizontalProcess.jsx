import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { gsap, ScrollTrigger } from '../gsap-config';
import beakerSketch1 from '../../img/beakersketch1.webp';
import beakerSketch2 from '../../img/beakersketch2.webp';
import beakerSketch3 from '../../img/beakersketch3.webp';
import beakerFrame1 from '../../img/beaker1.webp';
import beakerFrame2 from '../../img/beaker2.webp';
import beakerFrame3 from '../../img/beaker3.webp';
import beakerFrame4 from '../../img/beaker4.webp';
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
  const [mobilePanel, setMobilePanel] = useState(0);
  const PANEL_COUNT = 7;

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const outer = outerRef.current;
    const path  = pathRef.current;
    if (!track || !stage || !outer || !path) return;

    // Kill any stale triggers from a previous React StrictMode double-invoke
    ScrollTrigger.getAll().forEach(st => {
      if (st.trigger === outer || st.pin === stage) st.kill();
    });

    // ── Collect elements + initial states + animations (shared mobile & desktop) ─
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
    const layoutCard      = allPanels[5]?.querySelector('.hproc__la-card');
    const layoutCardTitle = allPanels[5]?.querySelector('.hproc__la-cardtitle');
    const layoutCardBody  = allPanels[5]?.querySelector('.hproc__la-cardbody');
    const layoutCta       = allPanels[5]?.querySelector('.hproc__la-cta');
    const layoutCircle    = allPanels[5]?.querySelector('.hproc__la-circle');
    const layoutImg1      = allPanels[5]?.querySelector('.hproc__la-img--1');
    const layoutImg2      = allPanels[5]?.querySelector('.hproc__la-img--2');
    const layoutCursor    = allPanels[5]?.querySelector('.hproc__la-drag-cursor');
    const uniqueTitle = allPanels[6]?.querySelector('.hproc__unique-title');
    const uniqueSequence = allPanels[6]?.querySelectorAll('.hproc__unique-step, .hproc__unique-arrow');

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
    if (layoutCard)      gsap.set(layoutCard,      { opacity: 0, y: 60, scale: 0.94 });
    if (layoutCardTitle) gsap.set(layoutCardTitle, { opacity: 0, x: -180, y: -90, rotation: -8 });
    if (layoutCardBody)  gsap.set(layoutCardBody,  { opacity: 0, x: -220, y: 140, rotation: 6 });
    if (layoutCta)       gsap.set(layoutCta,       { opacity: 0, x: 110,  y: 160, rotation: -14, scale: 0.85 });
    if (layoutCircle)    gsap.set(layoutCircle,    { opacity: 0, x: 240,  y: -200, scale: 0.55, rotation: -30 });
    if (layoutImg1)      gsap.set(layoutImg1,      { opacity: 0, x: -260, y: -160, rotation: -15, scale: 0.8 });
    if (layoutImg2)      gsap.set(layoutImg2,      { opacity: 0, x: 280,  y: 180,  rotation: 18,  scale: 0.8 });
    if (layoutCursor)    gsap.set(layoutCursor,    { opacity: 0 });
    if (uniqueTitle)      gsap.set(uniqueTitle,    { y: 30, opacity: 0 });
    if (uniqueSequence?.length) gsap.set(uniqueSequence, { y: 22, opacity: 0 });

    // --- initial hidden state (text) ---
    if (p1Title)          gsap.set(p1Title,      { y: 20, opacity: 0 });
    if (p3Text?.length)   gsap.set(p3Text,       { y: 20, opacity: 0 });
    if (p4Body)           gsap.set(p4Body,       { y: 20, opacity: 0 });
    if (p6Text?.length)   gsap.set(p6Text,       { y: 20, opacity: 0 });
    if (p7Text?.length)   gsap.set(p7Text,       { y: 20, opacity: 0 });
    if (uniqueBody)       gsap.set(uniqueBody,   { y: 20, opacity: 0 });

    let laBuildTl = null;
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
        // Kill any previous build run
        if (laBuildTl) { laBuildTl.kill(); laBuildTl = null; }

        // Restore panel opacity before running the build sequence
        const panelInner5 = allPanels[5]?.querySelector('.hproc__panel-inner');
        if (panelInner5) gsap.set(panelInner5, { opacity: 1 });

        // ── Mobile: small scatter + staggered fly-in (cursor drag not suited to touch) ──
        if (window.matchMedia('(max-width: 900px)').matches) {
          if (layoutCard)      gsap.set(layoutCard,      { opacity: 0, y: 24,  scale: 0.97 });
          if (layoutCardTitle) gsap.set(layoutCardTitle, { opacity: 0, y: 16,  x: 0, rotation: 0 });
          if (layoutCardBody)  gsap.set(layoutCardBody,  { opacity: 0, y: 16,  x: 0, rotation: 0 });
          if (layoutCta)       gsap.set(layoutCta,       { opacity: 0, y: 12,  x: 0, rotation: 0, scale: 1 });
          if (layoutCircle)    gsap.set(layoutCircle,    { opacity: 0, y: 10,  x: 0, scale: 1, rotation: 0 });
          if (layoutImg1)      gsap.set(layoutImg1,      { opacity: 0, y: -12, x: 0, rotation: 0, scale: 1 });
          if (layoutImg2)      gsap.set(layoutImg2,      { opacity: 0, y: 12,  x: 0, rotation: 0, scale: 1 });
          if (layoutCursor)    gsap.set(layoutCursor,    { opacity: 0 });
          if (layoutCard) gsap.to(layoutCard, { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'power3.out' });
          [layoutImg1, layoutCircle, layoutImg2, layoutCardTitle, layoutCardBody, layoutCta]
            .filter(Boolean)
            .forEach((el, i) => gsap.to(el, { opacity: 1, y: 0, duration: 0.5, delay: 0.1 + i * 0.07, ease: 'power3.out', clearProps: 'transform,opacity' }));
          if (p7Text?.length) inText(p7Text);
          return;
        }

        // Snap card to final y for accurate child measurements (opacity stays 0)
        if (layoutCard) { gsap.killTweensOf(layoutCard); gsap.set(layoutCard, { y: 0, scale: 1 }); }
        if (layoutCursor) gsap.set(layoutCursor, { opacity: 0, x: 0, y: 0, scale: 1 });

        const ctr = allPanels[5]?.querySelector('.hproc__layout-row');
        if (!ctr || !layoutCursor) {
          // Fallback: no cursor, just fly-in
          if (layoutCard) gsap.to(layoutCard, { opacity: 1, duration: 0.4, ease: 'power2.out' });
          [layoutImg1, layoutCircle, layoutImg2, layoutCardTitle, layoutCardBody, layoutCta]
            .forEach((el, i) => el && gsap.to(el, { opacity: 1, x: 0, y: 0, rotation: 0, scale: 1, duration: 0.8, delay: 0.3 + i * 0.12, ease: 'power3.out', clearProps: 'transform,opacity' }));
          if (p7Text?.length) inText(p7Text);
          return;
        }

        // Measure all scattered positions relative to container (measurements happen
        // synchronously here, before any tweens fire, so all elements are still scattered)
        const cRect = ctr.getBoundingClientRect();
        const elCenter = (el) => {
          const r = el.getBoundingClientRect();
          return { x: r.left - cRect.left + r.width / 2, y: r.top - cRect.top + r.height / 2 };
        };

        // [element, scatterX, scatterY] — must match the gsap.set values in initial state
        const items = [
          [layoutImg1,      -260, -160],
          [layoutCircle,     240, -200],
          [layoutImg2,       280,  180],
          [layoutCardTitle, -180,  -90],
          [layoutCardBody,  -220,  140],
          [layoutCta,        110,  160],
        ].filter(([el]) => el);

        const moves = items.map(([el, sx, sy]) => {
          const from = elCenter(el);
          return { el, from, to: { x: from.x - sx, y: from.y - sy } };
        });

        const DUR    = 0.42;  // drag duration per element
        const TRAVEL = 0.14;  // cursor travel time between elements

        laBuildTl = gsap.timeline();

        // Card canvas fades in first while cursor is off-screen
        laBuildTl.to(layoutCard, { opacity: 1, duration: 0.25, delay: 0.08, ease: 'power2.out' });

        // Title + body slide in right away, before the drag sequence
        if (p7Text?.length) {
          laBuildTl.to(p7Text, { y: 0, opacity: 1, duration: 0.55, stagger: 0.1, ease: 'power3.out', clearProps: 'transform,opacity' }, '<0.05');
        }

        moves.forEach(({ el, from, to }) => {
          laBuildTl
            // Cursor moves to scattered element position
            .to(layoutCursor, { x: from.x, y: from.y, opacity: 1, duration: TRAVEL, ease: 'power2.inOut' })
            // Press down
            .to(layoutCursor, { scale: 0.76, duration: 0.07, ease: 'power2.in' })
            // Drag cursor and element together to natural position
            .to(layoutCursor, { x: to.x, y: to.y, duration: DUR, ease: 'power2.inOut' })
            .to(el, { opacity: 1, x: 0, y: 0, rotation: 0, scale: 1, duration: DUR, ease: 'power2.inOut', clearProps: 'transform,opacity' }, '<')
            // Release
            .to(layoutCursor, { scale: 1, duration: 0.08, ease: 'back.out(2.5)' });
        });

        // Cursor fades out
        laBuildTl.to(layoutCursor, { opacity: 0, duration: 0.22, ease: 'power2.out' });
      },
      () => {
        if (uniqueTitle) { gsap.killTweensOf(uniqueTitle); gsap.to(uniqueTitle, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', clearProps: 'transform,opacity' }); }
        if (uniqueSequence?.length) { gsap.killTweensOf(uniqueSequence); gsap.to(uniqueSequence, { y: 0, opacity: 1, duration: 0.55, stagger: 0.09, delay: 0.18, ease: 'power3.out', clearProps: 'transform,opacity' }); }
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
        // Fade out the whole panel, then instantly scatter elements under the hood
        const panelInner5 = allPanels[5]?.querySelector('.hproc__panel-inner');
        if (laBuildTl) { laBuildTl.kill(); laBuildTl = null; }
        if (panelInner5) {
          gsap.to(panelInner5, {
            opacity: 0,
            duration: 0.45,
            ease: 'power2.inOut',
            onComplete: () => {
              // Scatter elements while invisible so replaying looks correct
              if (layoutCursor)    gsap.set(layoutCursor,    { opacity: 0 });
              if (layoutCard)      gsap.set(layoutCard,      { opacity: 0, y: 60, scale: 0.94 });
              if (layoutImg1)      gsap.set(layoutImg1,      { opacity: 0, x: -260, y: -160, rotation: -15, scale: 0.8 });
              if (layoutCircle)    gsap.set(layoutCircle,    { opacity: 0, x: 240,  y: -200, scale: 0.55, rotation: -30 });
              if (layoutImg2)      gsap.set(layoutImg2,      { opacity: 0, x: 280,  y: 180,  rotation: 18,  scale: 0.8 });
              if (layoutCardTitle) gsap.set(layoutCardTitle, { opacity: 0, x: -180, y: -90,  rotation: -8 });
              if (layoutCardBody)  gsap.set(layoutCardBody,  { opacity: 0, x: -220, y: 140,  rotation: 6 });
              if (layoutCta)       gsap.set(layoutCta,       { opacity: 0, x: 110,  y: 160,  rotation: -14, scale: 0.85 });
            },
          });
        } else {
          if (layoutCursor)    gsap.set(layoutCursor,    { opacity: 0 });
          if (layoutCard)      gsap.set(layoutCard,      { opacity: 0, y: 60, scale: 0.94 });
          if (layoutImg1)      gsap.set(layoutImg1,      { opacity: 0, x: -260, y: -160, rotation: -15, scale: 0.8 });
          if (layoutCircle)    gsap.set(layoutCircle,    { opacity: 0, x: 240,  y: -200, scale: 0.55, rotation: -30 });
          if (layoutImg2)      gsap.set(layoutImg2,      { opacity: 0, x: 280,  y: 180,  rotation: 18,  scale: 0.8 });
          if (layoutCardTitle) gsap.set(layoutCardTitle, { opacity: 0, x: -180, y: -90,  rotation: -8 });
          if (layoutCardBody)  gsap.set(layoutCardBody,  { opacity: 0, x: -220, y: 140,  rotation: 6 });
          if (layoutCta)       gsap.set(layoutCta,       { opacity: 0, x: 110,  y: 160,  rotation: -14, scale: 0.85 });
        }
        if (p7Text?.length) { gsap.killTweensOf(p7Text); outText(p7Text); }
      },
      () => {
        if (uniqueTitle) { gsap.killTweensOf(uniqueTitle); gsap.to(uniqueTitle, { y: 30, opacity: 0, duration: 0.3, ease: 'power2.in' }); }
        if (uniqueSequence?.length) { gsap.killTweensOf(uniqueSequence); gsap.to(uniqueSequence, { y: 22, opacity: 0, duration: 0.25, stagger: 0.04, ease: 'power2.in' }); }
        if (uniqueBody) { gsap.killTweensOf(uniqueBody); outText(uniqueBody); }
      },
    ];

    // ── Defined early so GSAP refresh callbacks always have it in scope ─────
    const getDistance = () => track.scrollWidth - window.innerWidth;
    const TAIL_DWELL = 700;

    // ── Mobile: swipe carousel with per-panel animations ────────────────────
    const mq = window.matchMedia('(max-width: 900px)');
    if (mq.matches) {
      enterFns[0]?.();
      let lastPanel = 0;
      let rafId     = null;
      let prevLeft  = -1;

      const commit = () => {
        rafId = null;
        const idx = Math.min(
          Math.round(track.scrollLeft / track.clientWidth),
          PANEL_COUNT - 1
        );
        setMobilePanel(idx);
        if (idx !== lastPanel) {
          enterFns[idx]?.();
          lastPanel = idx;
        }
      };

      // Poll every animation frame; commit as soon as scrollLeft stops changing.
      // This fires the moment snap settles — no fixed timeout needed.
      const poll = () => {
        if (track.scrollLeft === prevLeft) {
          commit();
        } else {
          prevLeft = track.scrollLeft;
          rafId = requestAnimationFrame(poll);
        }
      };

      // scroll: kicks off polling (only one rAF chain at a time)
      const onScroll = () => {
        if (!rafId) {
          prevLeft = track.scrollLeft;
          rafId = requestAnimationFrame(poll);
        }
      };

      // scrollend: authoritative on modern browsers — cancel any pending poll
      const onScrollEnd = () => {
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        commit();
      };

      track.addEventListener('scroll',    onScroll,    { passive: true });
      track.addEventListener('scrollend', onScrollEnd, { passive: true });
      return () => {
        if (rafId) cancelAnimationFrame(rafId);
        track.removeEventListener('scroll',    onScroll);
        track.removeEventListener('scrollend', onScrollEnd);
      };
    }

    // ── Desktop: ScrollTrigger horizontal pan ───────────────────────────────
    const setHeight = () => {
      outer.style.height = `${getDistance() + TAIL_DWELL + window.innerHeight}px`;
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
        invalidateOnRefresh: true,
      },
    });

    // ── Pin the stage for the full pan + tail dwell ────────────────
    const pinST = ScrollTrigger.create({
      trigger: outer,
      start: 'top top',
      end: () => `+=${getDistance() + TAIL_DWELL}`,
      pin: stage,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    });

    // ── Path draw-on-scroll ─────────────────────────────────────────
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
      pinST.kill();
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
          <div className="hproc__dots" aria-hidden="true">
            {Array.from({ length: PANEL_COUNT }, (_, i) => (
              <button
                key={i}
                className={`hproc__dot${mobilePanel === i ? ' is-active' : ''}`}
                onClick={() => {
                  trackRef.current?.scrollTo({ left: i * trackRef.current.clientWidth, behavior: 'smooth' });
                }}
                aria-label={`Go to panel ${i + 1}`}
              />
            ))}
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
  const midY = 60;
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

/* On-brand abstract placeholder — cream backdrop with bold geometric shapes
   in the site's purple / yellow / black palette. Compositions use balanced
   asymmetry: one anchor shape with smaller counter-weights for visual rhythm. */
function BrandCard({ variant = 'a' }) {
  if (variant === 'b') {
    // Anchor: large yellow disc on the right.
    // Counter-weights: stacked purple bars on the left + small black square.
    return (
      <svg viewBox="0 0 130 85" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="130" height="85" fill="#F5F2EC" />
        <circle cx="92" cy="42.5" r="26" fill="#FFD93D" />
        <rect x="14" y="22" width="34" height="6" rx="3" fill="#7C6AF7" />
        <rect x="14" y="34" width="22" height="6" rx="3" fill="#7C6AF7" />
        <rect x="14" y="46" width="28" height="6" rx="3" fill="#7C6AF7" />
        <rect x="14" y="60" width="10" height="10" rx="2" fill="#0A0A0A" />
      </svg>
    );
  }
  // Anchor: large purple half-circle on the left.
  // Counter-weights: yellow dot upper-right + black bar across the bottom.
  return (
    <svg viewBox="0 0 130 85" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="130" height="85" fill="#F5F2EC" />
      <path d="M 0 14 A 34 34 0 0 1 0 82 Z" fill="#7C6AF7" />
      <circle cx="96" cy="26" r="11" fill="#FFD93D" />
      <rect x="48" y="60" width="68" height="5" rx="2.5" fill="#0A0A0A" />
    </svg>
  );
}

function PanelLayout() {
  return (
    <div className="hproc__panel hproc__panel--below">
      <div className="hproc__panel-inner">
        <div className="hproc__layout-row">

          {/* Assembling card on the left */}
          <div className="hproc__la-card">
            <div className="hproc__la-card-left">
              <h3 className="hproc__la-cardtitle">Image<br />Carousel</h3>
              <p className="hproc__la-cardbody">
                Showcase your work in style. Images orbit smoothly, keeping visitors engaged.
              </p>
              <button type="button" className="hproc__la-cta">See Examples</button>
            </div>

            <div className="hproc__la-orbit">
              <div className="hproc__la-circle" aria-hidden="true" />
              <div className="hproc__la-img hproc__la-img--1"><BrandCard variant="a" /></div>
              <div className="hproc__la-img hproc__la-img--2"><BrandCard variant="b" /></div>
            </div>
          </div>

          {/* Fake drag cursor — GSAP moves this around the panel */}
          <div className="hproc__la-drag-cursor" aria-hidden="true">
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

          {/* Big title + body to the right of the card */}
          <div className="hproc__layout-text">
            <div className="hproc__layout-title">Layout</div>
            <p className="body">
              Every page has a story. We craft bespoke layouts that guide
              the eye, create breathing room, and make your content feel
              like it belongs exactly where it is.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

function UniqueFlowArrow() {
  return (
    <svg
      className="hproc__unique-arrow"
      viewBox="0 0 150 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M 4 24 C 33 19, 66 20, 96 21 C 115 22, 129 20, 142 18"
        stroke="#0A0A0A"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M 124 9 C 132 12, 139 15, 145 18 C 137 22, 130 26, 123 31"
        stroke="#0A0A0A"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AnimatedUniqueBeaker() {
  const beakerFrames = [beakerFrame1, beakerFrame2, beakerFrame3, beakerFrame4];
  const [frame, setFrame] = React.useState(0);
  const loadedRef = React.useRef(false);

  React.useEffect(() => {
    let active = true;
    const images = beakerFrames.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    Promise.all(images.map((img) => (
      img.decode
        ? img.decode().catch(() => {})
        : new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          })
    ))).then(() => {
      if (active) loadedRef.current = true;
    });

    return () => {
      active = false;
    };
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (loadedRef.current) {
        setFrame((prev) => (prev + 1) % beakerFrames.length);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="hproc__unique-animated-beaker" aria-hidden="true">
      {beakerFrames.map((src, index) => (
        <img
          key={src}
          src={src}
          alt=""
          className={`hproc__unique-animated-frame${frame === index ? ' is-active' : ''}`}
        />
      ))}
    </span>
  );
}

function PanelUnique() {
  return (
    <div className="hproc__panel hproc__panel--center">
      <div className="hproc__panel-inner">
        <div className="hproc__unique-layout">
          <div className="hproc__unique-title">Make it unique</div>
          <div className="hproc__unique-flow" aria-hidden="true">
            <span className="hproc__unique-step hproc__unique-step--sketch hproc__unique-step--sketch1">
              <img src={beakerSketch1} alt="" className="hproc__unique-beaker-img hproc__unique-beaker-img--sketch1" />
            </span>
            <UniqueFlowArrow />
            <span className="hproc__unique-step hproc__unique-step--sketch hproc__unique-step--sketch2">
              <img src={beakerSketch2} alt="" className="hproc__unique-beaker-img hproc__unique-beaker-img--sketch2" />
            </span>
            <UniqueFlowArrow />
            <span className="hproc__unique-step hproc__unique-step--digital hproc__unique-step--sketch3">
              <img src={beakerSketch3} alt="" className="hproc__unique-beaker-img hproc__unique-beaker-img--sketch3" />
            </span>
            <UniqueFlowArrow />
            <span className="hproc__unique-step hproc__unique-step--digital hproc__unique-step--animated">
              <AnimatedUniqueBeaker />
            </span>
          </div>
          <p className="hproc__unique-body">
            Your brand is one of a kind. Your website should be too.
            We layer in custom illustrations, motion, and details that
            make visitors stop, look twice, and remember you.
          </p>
        </div>
      </div>
    </div>
  );
}
