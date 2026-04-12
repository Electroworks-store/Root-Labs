import { useState, useEffect, useRef } from 'react';
import useParallax from '../hooks/useParallax';
import './websites-process.css';

/**
 * WebsitesProcess Component
 * 
 * Three-step scrollable design process showcase for the Websites page:
 * 1. Vibe Picker - 4 interactive tiles (Luxury, Playful, Tech, Minimal)
 * 2. Color Bubbles - Centered heading with floating, parallax-animated bubbles
 * 3. Font Carousel - Rotating font showcase using existing project fonts
 * 
 * Features:
 * - Intersection Observer for scroll-triggered fade-ins
 * - Parallax effects on bubbles (respects prefers-reduced-motion)
 * - Font cycling without additional imports
 * - Fully accessible with semantic HTML and focus management
 * - Responsive across all screen sizes (360px-1440px+)
 */

// Hook: Cycle through font families
function useCycleFonts(fontVars, intervalMs = 1200) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % fontVars.length);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [fontVars.length, intervalMs]);

  return fontVars[currentIndex];
}

// Hook: Intersection observer for staggered fade-in
function useInView(ref, threshold = 0.2) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, threshold]);

  return isInView;
}

// Component 1: Vibe Picker — Bento Grid Layout
function VibeCard({ vibe, className, style, pill }) {
  return (
    <div className={`vibe-bento-card ${className || ''}`} style={{ background: vibe.bg, color: vibe.fg, ...style }}>
      <div className={`vibe-bento-inner${pill ? ' vibe-pill-layout' : ''}`}>
        {pill ? (
          // Pill: compact centered layout that respects the oval clip
          vibe.id === 'brutalism' ? (
            <div className="vibe-pill-content">
              <div style={{ width: '100%', height: 3, background: vibe.accent, marginBottom: 8 }} />
              <div style={{ fontSize: 22, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>AB</div>
              <div style={{ width: '70%', height: 3, background: '#000', marginTop: 8, opacity: 0.3 }} />
            </div>
          ) : (
            <div className="vibe-pill-content" style={{ position: 'relative', width: '100%', height: '100%' }}>
              <svg width="54" height="62" viewBox="0 0 54 62" style={{ position: 'absolute', left: '12%', top: '12%', opacity: 0.9, transform: 'rotate(-20deg)' }}>
                <path d="M27 2 C40 10 52 22 50 38 C48 52 34 60 27 60 C20 60 6 52 4 38 C2 22 14 10 27 2Z" fill="#A8D08D" />
                <path d="M27 10 L27 52" stroke="#1B3A2D" strokeWidth="1.5" fill="none" opacity="0.35" />
                <path d="M18 20 Q27 28 27 28" stroke="#1B3A2D" strokeWidth="1.2" fill="none" opacity="0.25" />
                <path d="M36 24 Q27 32 27 32" stroke="#1B3A2D" strokeWidth="1.2" fill="none" opacity="0.25" />
                <path d="M16 34 Q27 40 27 40" stroke="#1B3A2D" strokeWidth="1.2" fill="none" opacity="0.2" />
              </svg>
              <svg width="44" height="50" viewBox="0 0 44 50" style={{ position: 'absolute', right: '8%', bottom: '14%', opacity: 0.7, transform: 'rotate(25deg)' }}>
                <path d="M22 2 C32 8 42 18 40 30 C38 42 28 48 22 48 C16 48 6 42 4 30 C2 18 12 8 22 2Z" fill="#7CB342" />
                <path d="M22 8 L22 42" stroke="#1B3A2D" strokeWidth="1.3" fill="none" opacity="0.3" />
                <path d="M14 16 Q22 22 22 22" stroke="#1B3A2D" strokeWidth="1" fill="none" opacity="0.2" />
                <path d="M30 20 Q22 26 22 26" stroke="#1B3A2D" strokeWidth="1" fill="none" opacity="0.2" />
              </svg>
            </div>
          )
        ) : vibe.id === 'luxury' ? (
          // Luxury — gallery art space, refined typography, premium aesthetic
          <>
            {/* Gallery room mockup */}
            <div style={{ flex: 1, position: 'relative', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 55 }}>
              {/* Framed artwork — white mat with warm accent shadow */}
              <div style={{ position: 'relative', width: '65%', aspectRatio: '3/4', background: '#F5F0EB', borderRadius: 2, boxShadow: '0 12px 32px rgba(0,0,0,0.25)' }}>
                {/* Inner frame effect */}
                <div style={{ position: 'absolute', inset: '8px', background: 'linear-gradient(135deg, #E8D7C3, #D4C4A8)', borderRadius: 1 }} />\n                {/* Accent line */}\n                <div style={{ position: 'absolute', left: '20%', top: '50%', width: '60%', height: 2, background: vibe.accent, opacity: 0.6, borderRadius: 1 }} />\n              </div>\n            </div>\n            {/* Elegant text */}\n            <div style={{ textAlign: 'center', marginBottom: 8 }}>\n              <div style={{ fontSize: 11, fontWeight: 300, color: vibe.accent, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.65 }}>Collection</div>\n            </div>\n            {/* Subtle divider */}\n            <div style={{ height: 1, width: '40%', margin: '0 auto 8px', background: vibe.accent, opacity: 0.25 }} />\n            {/* Description lines */}\n            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', marginBottom: 10 }}>\n              <div style={{ height: 3, width: '55%', background: vibe.fg, opacity: 0.15, borderRadius: 1 }} />\n              <div style={{ height: 3, width: '40%', background: vibe.fg, opacity: 0.08, borderRadius: 1 }} />\n            </div>\n            {/* Bottom geometric accent */}\n            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', gap: 2 }}>\n              <div style={{ width: 6, height: 1.5, background: vibe.accent, opacity: 0.5 }} />\n              <div style={{ width: 3, height: 1.5, background: vibe.accent, opacity: 0.3 }} />\n              <div style={{ width: 6, height: 1.5, background: vibe.accent, opacity: 0.5 }} />\n            </div>\n          </>
        ) : vibe.id === 'corporate' ? (
          // Corporate — light seaside village, beige/white/navy
          <>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: vibe.fg, letterSpacing: '0.02em', lineHeight: 1 }}>Corporate</div>
              <div style={{ flex: 1 }} />
              <div style={{ display: 'flex', gap: 3 }}>
                <div style={{ width: 4, height: 4, borderRadius: 4, background: vibe.accent }} />
                <div style={{ width: 4, height: 4, borderRadius: 4, background: vibe.accent3 }} />
              </div>
            </div>
            {/* Blue circles composition */}
            <div style={{ flex: 1, borderRadius: 10, position: 'relative', overflow: 'hidden', background: '#D8D8D8', marginBottom: 10, minHeight: 60 }}>
              {/* Top-left circle */}
              <div style={{ position: 'absolute', width: '45%', height: '90%', left: '-15%', top: '-20%', borderRadius: 9999, background: '#8BB0E0' }} />
              {/* Top-right circle */}
              <div style={{ position: 'absolute', width: '40%', height: '80%', right: '-10%', top: '-15%', borderRadius: 9999, background: '#8BB0E0' }} />
              {/* Bottom-center circle */}
              <div style={{ position: 'absolute', width: '42%', height: '85%', left: '28%', bottom: '-40%', borderRadius: 9999, background: '#8BB0E0' }} />
            </div>
            {/* Text lines */}
            <div style={{ height: 5, width: '65%', borderRadius: 3, background: vibe.fg, opacity: 0.12, marginBottom: 3 }} />
            <div style={{ height: 4, width: '50%', borderRadius: 3, background: vibe.fg, opacity: 0.07 }} />
            {/* CTA */}
            <div style={{ marginTop: 'auto', paddingTop: 6 }}>
              <div style={{ width: 65, height: 20, borderRadius: 6, background: vibe.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 24, height: 2.5, borderRadius: 2, background: '#fff', opacity: 0.85 }} />
              </div>
            </div>
          </>
        ) : vibe.id === 'cosmic' ? (
          // Cosmic — deep space, stars, nebula gradients
          <>
            {/* Title integrated as constellation label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <div style={{ fontSize: 15, fontWeight: 300, color: vibe.accent, letterSpacing: '0.15em', textTransform: 'uppercase', lineHeight: 1 }}>Cosmic</div>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, ' + vibe.accent + ', transparent)', opacity: 0.3 }} />
            </div>
            {/* Nebula blob */}
            <div style={{ flex: 1, borderRadius: 12, position: 'relative', overflow: 'hidden', background: 'radial-gradient(ellipse at 30% 40%, rgba(199,125,255,0.25), transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(255,107,157,0.2), transparent 55%)', marginBottom: 10 }}>
              {/* Stars */}
              {[[12, 18], [45, 28], [78, 12], [25, 65], [60, 50], [88, 72], [35, 42], [70, 35], [15, 80], [55, 75], [90, 25], [42, 90]].map(([x, y], i) => (
                <div key={i} style={{ position: 'absolute', left: x + '%', top: y + '%', width: i % 3 === 0 ? 3 : 2, height: i % 3 === 0 ? 3 : 2, borderRadius: 9999, background: '#fff', opacity: i % 4 === 0 ? 0.9 : i % 3 === 0 ? 0.6 : 0.35, boxShadow: i % 3 === 0 ? '0 0 4px rgba(255,255,255,0.5)' : 'none' }} />
              ))}
              {/* Orbiting ring */}
              <div style={{ position: 'absolute', top: '25%', left: '15%', width: '70%', height: '50%', borderRadius: 9999, border: '1px solid rgba(199,125,255,0.15)', transform: 'rotate(-15deg)' }} />
            </div>
            {/* Text lines */}
            <div style={{ height: 5, width: '60%', borderRadius: 3, background: 'rgba(232,224,240,0.12)', marginBottom: 3 }} />
            <div style={{ height: 4, width: '45%', borderRadius: 3, background: 'rgba(232,224,240,0.07)' }} />
            {/* CTA */}
            <div style={{ marginTop: 'auto', paddingTop: 8 }}>
              <div style={{ width: 60, height: 18, borderRadius: 9999, background: 'linear-gradient(90deg, ' + vibe.accent + ', ' + vibe.accent2 + ')', opacity: 0.8, boxShadow: '0 0 14px rgba(199,125,255,0.3)' }} />
            </div>
          </>
        ) : vibe.id === 'editorial' ? (
          // Editorial — clean typography focus, masthead with name
          <>
            {/* Masthead */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid rgba(0,0,0,0.12)', paddingBottom: 8, marginBottom: 10 }}>
              <div style={{ fontSize: 18, fontWeight: 300, color: vibe.fg, letterSpacing: '0.18em', textTransform: 'uppercase', lineHeight: 1 }}>Editorial</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.1)' }} />
                <div style={{ fontSize: 6, color: vibe.accent, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Vol. 1</div>
                <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.1)' }} />
              </div>
            </div>
            {/* Two-column body */}
            <div style={{ display: 'flex', gap: 10, flex: 1 }}>
              <div style={{ flex: 1 }}>
                <div style={{ height: 7, width: '90%', borderRadius: 2, background: 'rgba(0,0,0,0.55)', marginBottom: 6 }} />
                <div style={{ height: 4, width: '100%', borderRadius: 2, background: 'rgba(0,0,0,0.1)', marginBottom: 3 }} />
                <div style={{ height: 4, width: '100%', borderRadius: 2, background: 'rgba(0,0,0,0.1)', marginBottom: 3 }} />
                <div style={{ height: 4, width: '85%', borderRadius: 2, background: 'rgba(0,0,0,0.1)', marginBottom: 3 }} />
                <div style={{ height: 4, width: '70%', borderRadius: 2, background: 'rgba(0,0,0,0.1)' }} />
              </div>
              <div style={{ width: 1, background: 'rgba(0,0,0,0.08)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: 36, borderRadius: 3, background: 'rgba(0,0,0,0.06)', marginBottom: 5 }} />
                <div style={{ height: 4, width: '90%', borderRadius: 2, background: 'rgba(0,0,0,0.1)', marginBottom: 3 }} />
                <div style={{ height: 4, width: '75%', borderRadius: 2, background: 'rgba(0,0,0,0.1)' }} />
              </div>
            </div>
            {/* Footer row */}
            <div style={{ marginTop: 'auto', paddingTop: 8, display: 'flex', gap: 6, alignItems: 'center' }}>
              <div style={{ width: 12, height: 12, borderRadius: 9999, background: vibe.accent2 }} />
              <div style={{ height: 3, width: 50, borderRadius: 2, background: 'rgba(0,0,0,0.12)' }} />
              <div style={{ flex: 1 }} />
              <div style={{ height: 3, width: 28, borderRadius: 2, background: 'rgba(0,0,0,0.08)' }} />
            </div>
          </>
        ) : vibe.id === 'brutalism' ? (
          // Brutalism — raw, sharp, high-contrast, no border-radius
          <>
            <div style={{ display: 'flex', gap: 0, marginBottom: 10 }}>
              <div style={{ flex: 1, height: 6, background: '#000' }} />
              <div style={{ width: 20, height: 6, background: vibe.accent }} />
            </div>
            <div style={{ height: '30%', background: '#000', border: '3px solid ' + vibe.accent, marginBottom: 8 }} />
            <div style={{ height: 10, width: '60%', background: '#000', marginBottom: 4 }} />
            <div style={{ height: 5, width: '80%', background: 'rgba(0,0,0,0.15)', marginBottom: 3 }} />
            <div style={{ height: 5, width: '50%', background: 'rgba(0,0,0,0.15)' }} />
            <div style={{ marginTop: 'auto', paddingTop: 8 }}>
              <div style={{ width: 65, height: 22, background: vibe.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, fontWeight: 900, color: '#FFF', letterSpacing: '0.12em', textTransform: 'uppercase' }}>CLICK</div>
            </div>
          </>
        ) : (
          // Nature — organic shapes, earthy tones
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" style={{ opacity: 0.6 }}>
                <path d="M8 1 C8 1 13 5 13 9 C13 13 8 15 8 15 C8 15 3 13 3 9 C3 5 8 1 8 1Z" fill={vibe.accent} />
              </svg>
              <div style={{ flex: 1 }} />
              <div style={{ width: 5, height: 5, borderRadius: 5, background: vibe.accent3 }} />
            </div>
            <div style={{ height: '30%', borderRadius: 12, background: 'linear-gradient(180deg, ' + vibe.accent2 + ', rgba(27,58,45,0.3))', opacity: 0.5, marginBottom: 10 }} />
            <div style={{ height: 7, width: '55%', borderRadius: 4, background: vibe.accent, opacity: 0.7, marginBottom: 5 }} />
            <div style={{ height: 4, width: '80%', borderRadius: 3, background: 'rgba(232,240,228,0.12)', marginBottom: 3 }} />
            <div style={{ height: 4, width: '60%', borderRadius: 3, background: 'rgba(232,240,228,0.08)' }} />
            <div style={{ marginTop: 'auto', paddingTop: 8 }}>
              <div style={{ width: 55, height: 20, borderRadius: 9999, background: vibe.accent, opacity: 0.75 }} />
            </div>
          </>
        )}
      </div>
      {!['corporate', 'cosmic', 'editorial'].includes(vibe.id) && (
        <div className="vibe-bento-label" style={
          vibe.id === 'brutalism' ? { fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' } : undefined
        }>{vibe.title}</div>
      )}
    </div>
  );
}

function VibePicker() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef);

  const VIBES = [
    { id: 'luxury',    title: 'Luxury',    bg: '#0A0A0A', fg: '#F5F1E8', accent: '#D4AF37', accent2: '#1A1A1A', accent3: '#8B7355' },
    { id: 'brutalism', title: 'Brutalism',  bg: '#FFFFFF', fg: '#000000', accent: '#FF0000', accent2: '#000000', accent3: '#FFFF00' },
    { id: 'nature',    title: 'Nature',     bg: '#1B3A2D', fg: '#E8F0E4', accent: '#7CB342', accent2: '#3E6B48', accent3: '#A8D08D' },
    { id: 'corporate', title: 'Corporate',  bg: '#FAF7F2', fg: '#2C3E6B', accent: '#5B7FA6', accent2: '#E8DDD0', accent3: '#8FA4C4' },
    { id: 'cosmic',    title: 'Cosmic',     bg: '#0B0B1A', fg: '#E8E0F0', accent: '#C77DFF', accent2: '#FF6B9D', accent3: '#7B2FBE' },
    { id: 'editorial', title: 'Editorial',  bg: '#F4F4F2', fg: '#1A1A1A', accent: '#7A7A7A', accent2: '#2C2C2C' }
  ];

  return (
    <section
      ref={sectionRef}
      id="vibe-pick"
      className="webproc webproc-vibe py-20 relative"
      aria-label="Choose a vibe"
    >
      <div className={`vibe-bento-grid${isInView ? ' vibe-in-view' : ''}`}>
        {/* Row 1: wide Luxury + heading + Brutalism pill */}
        <VibeCard vibe={VIBES[0]} className="vbg-wide vibe-slide-left" />
        <div className="vbg-heading vibe-slide-left">
          <h2>
            First we choose the <span className="font-accent brand-accent">vibe</span>
          </h2>
        </div>
        <VibeCard vibe={VIBES[1]} className="vbg-pill-top vibe-bento-pill vibe-slide-right" pill />

        {/* Row 2: Nature pill + Playful + Tech + Editorial */}
        <VibeCard vibe={VIBES[2]} className="vbg-pill-bot vibe-bento-pill vibe-slide-left" pill />
        <VibeCard vibe={VIBES[3]} className="vbg-sq1 vibe-slide-right" />
        <VibeCard vibe={VIBES[4]} className="vbg-sq2 vibe-slide-left" />
        <VibeCard vibe={VIBES[5]} className="vbg-sq3 vibe-slide-right" />
      </div>
    </section>
  );
}

// Component 2: Color Bubbles
function ColorBubbles() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef);
  
  const bubble1Ref = useRef(null);
  const bubble2Ref = useRef(null);
  const bubble3Ref = useRef(null);
  const bubble4Ref = useRef(null);
  const bubble5Ref = useRef(null);
  
  useParallax(bubble1Ref, { depth: 0.04 });
  useParallax(bubble2Ref, { depth: -0.03 });
  useParallax(bubble3Ref, { depth: 0.03 });
  useParallax(bubble4Ref, { depth: -0.01 });
  useParallax(bubble5Ref, { depth: -0.02 });

  return (
    <section
      ref={sectionRef}
      id="color-palette"
      className="webproc webproc-color py-24 relative"
      style={{ minHeight: '80vh' }}
    >
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="color-bubbles-canvas relative" style={{ minHeight: 350 }}>
          
          {/* Light Blue - Top Left */}
          <div
            ref={bubble1Ref}
            className="color-bubble bubble-1"
            style={{
              position: 'absolute',
              width: '160px',
              height: '160px',
              left: '5%',
              top: '15%',
              borderRadius: '9999px',
              background: '#7DD3FC',
              willChange: 'transform',
              zIndex: 0
            }}
            aria-hidden
          />

          {/* Purple - Top Center */}
          <div
            ref={bubble2Ref}
            className="color-bubble bubble-2"
            style={{
              position: 'absolute',
              width: '140px',
              height: '140px',
              left: '45%',
              top: '5%',
              borderRadius: '9999px',
              background: '#A855F7',
              willChange: 'transform',
              zIndex: 0
            }}
            aria-hidden
          />

          {/* Red - Bottom Left */}
          <div
            ref={bubble3Ref}
            className="color-bubble bubble-3"
            style={{
              position: 'absolute',
              width: '90px',
              height: '90px',
              left: '18%',
              top: '80%',
              borderRadius: '9999px',
              background: '#FF1744',
              willChange: 'transform',
              zIndex: 0
            }}
            aria-hidden
          />

          {/* Small Orange - Bottom Right */}
          <div
            ref={bubble4Ref}
            className="color-bubble bubble-4"
            style={{
              position: 'absolute',
              width: '90px',
              height: '90px',
              left: '62%',
              top: '110%',
              borderRadius: '9999px',
              background: '#FF6B35',
              willChange: 'transform',
              zIndex: 0
            }}
            aria-hidden
          />

          {/* Yellow - Right Side */}
          <div
            ref={bubble5Ref}
            className="color-bubble bubble-5"
            style={{
              position: 'absolute',
              width: '180px',
              height: '180px',
              left: '78%',
              top: '35%',
              borderRadius: '9999px',
              background: '#FFD600',
              willChange: 'transform',
              zIndex: 0
            }}
            aria-hidden
          />

          {/* Center headline - higher z-index */}
          <div className="relative z-10 text-center" style={{ paddingTop: '30vh' }}>
            <h2 className="text-5xl md:text-6xl font-bold" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", color: 'var(--text)' }}>
              Then a <span className="font-accent brand-accent">Color</span>
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}

// Bubble component with ref forwarding
// (Small, self-contained Bubble component removed - replaced by inline render in ColorBubbles)

// Component 3: Font Carousel - Clean Minimal Design (Apple-inspired)
const CAROUSEL_FONTS_URL = 'https://fonts.googleapis.com/css2?family=Sarina&family=Abril+Fatface&family=Pacifico&family=Righteous&display=swap';
let carouselFontsLoaded = false;

function FontCarouselWord() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef);
  const [activeFont, setActiveFont] = useState(0);
  const [fontsReady, setFontsReady] = useState(false);
  
  // Showcase fonts for the design process demo
  const fonts = [
    { key: 'sarina', label: 'Sarina', fam: "'Sarina', cursive" },
    { key: 'abril', label: 'Abril Fatface', fam: "'Abril Fatface', serif" },
    { key: 'pacifico', label: 'Pacifico', fam: "'Pacifico', cursive" },
    { key: 'righteous', label: 'Righteous', fam: "'Righteous', sans-serif" }
  ];

  // Lazy-load carousel fonts only when section is near viewport
  useEffect(() => {
    if (!isInView || carouselFontsLoaded) return;
    carouselFontsLoaded = true;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = CAROUSEL_FONTS_URL;
    link.onload = () => setFontsReady(true);
    document.head.appendChild(link);
  }, [isInView]);

  // Auto-cycle fonts with crossfade (respects prefers-reduced-motion)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    
    const interval = setInterval(() => {
      setActiveFont(prev => (prev + 1) % fonts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [fonts.length]);

  return (
    <section
      ref={sectionRef}
      id="font-pick"
      className="webproc webproc-font"
      style={{ 
        opacity: isInView ? 1 : 0, 
        transition: 'opacity 0.6s ease-out',
        minHeight: '50vh',
        position: 'relative',
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 1.5rem'
      }}
    >
      <h2 style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize: 'clamp(2.5rem, 6vw, 5rem)',
        fontWeight: 800,
        lineHeight: 1.1,
        textAlign: 'center'
      }}>
        And a{' '}
        <span style={{ position: 'relative', display: 'inline-block' }}>
          {fonts.map((font, i) => (
            <span
              key={font.key}
              style={{
                position: i === 0 ? 'relative' : 'absolute',
                left: i === 0 ? undefined : 0,
                top: i === 0 ? undefined : 0,
                fontFamily: font.fam,
                fontWeight: 800,
                color: 'var(--primary)',
                opacity: activeFont === i ? 1 : 0,
                transform: activeFont === i ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
                whiteSpace: 'nowrap',
                visibility: activeFont === i || i === 0 ? 'visible' : 'hidden'
              }}
              aria-hidden={activeFont !== i}
            >
              font
            </span>
          ))}
        </span>
      </h2>
    </section>
  );
}

/* ── Responsiveness Showcase ─────────────────────────────── */
function ResponsivenessShowcase() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Placeholder page content drawn inside each device */
  const MockupContent = () => (
    <div className="resp-content">
      <div className="resp-nav-bar">
        <div className="resp-nav-logo" />
        <div className="resp-nav-links">
          <span /><span /><span />
        </div>
      </div>
      <div className="resp-hero-block">
        <div className="resp-hero-title" />
        <div className="resp-hero-sub" />
        <div className="resp-hero-btn" />
      </div>
      <div className="resp-cards-row">
        <div className="resp-card" />
        <div className="resp-card" />
        <div className="resp-card" />
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} className={`resp-showcase py-24 ${visible ? 'resp-visible' : ''}`}>
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
          And finnally we make it Responsive
        </h2>
        <p className="text-lg mb-16 max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>
          Every page we build looks pixel-perfect across all screen sizes.
        </p>

        <div className="resp-devices">
          {/* Laptop */}
          <div className="resp-laptop">
            <div className="resp-laptop-body">
              <MockupContent />
            </div>
          </div>

          {/* Mobile */}
          <div className="resp-phone">
            <div className="resp-phone-notch" />
            <div className="resp-phone-screen">
              <MockupContent />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Winding Path Timeline wrapper
function WindingPath({ children, steps }) {
  const pathRef = useRef(null);
  const svgRef = useRef(null);
  const wrapperRef = useRef(null);
  const [drawLength, setDrawLength] = useState(0);
  const [totalLength, setTotalLength] = useState(0);
  const [activeStep, setActiveStep] = useState(-1);
  const nodeRefs = useRef([]);

  // Calculate SVG path based on container height
  const [pathD, setPathD] = useState('');
  const [nodePositions, setNodePositions] = useState([]);

  useEffect(() => {
    const updatePath = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const h = wrapper.offsetHeight;
      const w = Math.min(wrapper.offsetWidth, 1200);
      const cx = w / 2;
      const amplitude = Math.min(w * 0.35, 350);
      
      // Build a winding path with one S-curve per step
      const stepCount = steps.length;
      const segH = h / stepCount;
      const positions = [];
      let d = `M ${cx} 0`;
      
      for (let i = 0; i < stepCount; i++) {
        const yStart = i * segH;
        const yMid = yStart + segH * 0.5;
        const yEnd = yStart + segH;
        const dir = i % 2 === 0 ? 1 : -1;
        const xPeak = cx + amplitude * dir;
        
        // Cubic bezier for smooth S-curves
        d += ` C ${cx} ${yStart + segH * 0.15}, ${xPeak} ${yStart + segH * 0.3}, ${xPeak} ${yMid}`;
        d += ` C ${xPeak} ${yMid + segH * 0.2}, ${cx} ${yEnd - segH * 0.15}, ${cx} ${yEnd}`;
        
        // Node at the peak of each curve
        positions.push({ x: xPeak, y: yMid });
      }
      
      setPathD(d);
      setNodePositions(positions);
    };

    updatePath();
    window.addEventListener('resize', updatePath);
    return () => window.removeEventListener('resize', updatePath);
  }, [steps.length]);

  // Get total path length once path is rendered
  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      setTotalLength(len);
      setDrawLength(0);
    }
  }, [pathD]);

  // Scroll-driven draw + node activation
  useEffect(() => {
    if (!totalLength || !wrapperRef.current) return;

    const handleScroll = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      const windowH = window.innerHeight;
      
      // Progress: 0 when wrapper top hits bottom of viewport, 1 when wrapper bottom hits top
      const progress = Math.max(0, Math.min(1,
        (windowH - rect.top) / (rect.height + windowH)
      ));
      
      // Draw with slight lead so line arrives before content
      const drawProgress = Math.min(1, progress * 1.3);
      setDrawLength(drawProgress * totalLength);
      
      // Activate steps based on scroll position
      const stepProgress = progress * steps.length;
      setActiveStep(Math.floor(stepProgress - 0.2));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalLength, steps.length]);

  return (
    <div ref={wrapperRef} className="winding-path-wrapper" style={{ position: 'relative' }}>
      {/* SVG Path */}
      {pathD && (
        <svg
          ref={svgRef}
          className="winding-path-svg"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 0
          }}
          preserveAspectRatio="none"
        >
          {/* Ghost path (track) */}
          <path
            d={pathD}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="2"
          />
          {/* Drawn path (active) */}
          <path
            ref={pathRef}
            d={pathD}
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="2"
            strokeDasharray={totalLength || 0}
            strokeDashoffset={(totalLength || 0) - drawLength}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.1s linear' }}
          />
          {/* Glow version */}
          <path
            d={pathD}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="6"
            strokeDasharray={totalLength || 0}
            strokeDashoffset={(totalLength || 0) - drawLength}
            strokeLinecap="round"
            opacity="0.15"
            style={{ transition: 'stroke-dashoffset 0.1s linear', filter: 'blur(8px)' }}
          />
          <defs>
            <linearGradient id="pathGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
          {/* Nodes */}
          {nodePositions.map((pos, i) => (
            <g key={i}>
              {/* Outer glow */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r="20"
                fill="var(--primary)"
                opacity={activeStep >= i ? 0.15 : 0}
                style={{ transition: 'opacity 0.5s ease', filter: 'blur(8px)' }}
              />
              {/* Node ring */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r="8"
                fill={activeStep >= i ? 'var(--primary)' : 'transparent'}
                stroke={activeStep >= i ? 'var(--primary)' : 'rgba(255,255,255,0.15)'}
                strokeWidth="2"
                style={{ transition: 'all 0.4s ease' }}
              />
              {/* Step number */}
              <text
                x={pos.x}
                y={pos.y + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fill={activeStep >= i ? '#fff' : 'rgba(255,255,255,0.3)'}
                fontSize="9"
                fontWeight="700"
                fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
                style={{ transition: 'fill 0.4s ease' }}
              >
                {i + 1}
              </text>
            </g>
          ))}
        </svg>
      )}
      
      {/* Step content */}
      {children.map((child, i) => (
        <div
          key={i}
          className={`winding-step ${activeStep >= i ? 'winding-step-active' : ''}`}
          style={{
            position: 'relative',
            zIndex: 1,
            opacity: activeStep >= i ? 1 : 0.3,
            transform: activeStep >= i ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease'
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

// Main parent component
export default function WebsitesProcess() {
  return (
    <div className="websites-process-wrapper">
      {/* Major page heading */}
      <section className="design-process-intro text-center py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
            Design process
          </h1>
        </div>
      </section>

      <VibePicker />
      <ColorBubbles />
      <FontCarouselWord />
      <ResponsivenessShowcase />
    </div>
  );
}
