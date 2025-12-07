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

// Component 1: Vibe Picker
function VibePicker() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef);
  const VIBES = [
    { id: 'luxury', title: 'Luxury', bg: '#0A0A0A', fg: '#F5F1E8', accent: '#D4AF37', accent2: '#1A1A1A', accent3: '#8B7355' },
    { id: 'playful', title: 'Playful', bg: '#FF6B9D', fg: '#FFF5E1', accent: '#FFD93D', accent2: '#FF8C42' },
    { id: 'tech', title: 'Tech', bg: '#000814', fg: '#E8F4F8', accent: '#00D9FF', accent2: '#0066FF', accent3: '#6C63FF' },
    { id: 'editorial', title: 'Editorial', bg: '#F4F4F2', fg: '#1A1A1A', accent: '#7A7A7A', accent2: '#2C2C2C' }
  ];

  /* Predefined offsets for deterministic 'random' placement per card.
     Mobile/tablet/desktop positions avoid runtime layout shifts. */
  const initialPositions = [
    { top: '4%', left: '6%', md: { top: '6%', left: '4%' }, lg: { top: '2%', left: '4%' } },
    { top: '20%', left: '58%', md: { top: '18%', left: '56%' }, lg: { top: '12%', left: '58%' } },
    { top: '46%', left: '18%', md: { top: '46%', left: '20%' }, lg: { top: '42%', left: '22%' } },
    { top: '38%', left: '70%', md: { top: '36%', left: '72%' }, lg: { top: '34%', left: '74%' } }
  ];

  // State for draggable positions (in pixels)
  const [cardPositions, setCardPositions] = useState(() => 
    initialPositions.map(pos => ({ x: 0, y: 0, isDragging: false }))
  );
  const [draggedCard, setDraggedCard] = useState(null);
  const dragStart = useRef({ x: 0, y: 0, cardX: 0, cardY: 0 });
  const canvasRef = useRef(null);

  // Handle drag start
  const handleDragStart = (e, index) => {
    e.preventDefault();
    const isTouch = e.type === 'touchstart';
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;

    setDraggedCard(index);
    dragStart.current = {
      x: clientX,
      y: clientY,
      cardX: cardPositions[index].x,
      cardY: cardPositions[index].y
    };

    setCardPositions(prev => prev.map((pos, i) => 
      i === index ? { ...pos, isDragging: true } : pos
    ));
  };

  // Handle drag move
  const handleDragMove = (e) => {
    if (draggedCard === null) return;
    
    const isTouch = e.type === 'touchmove';
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - dragStart.current.x;
    const deltaY = clientY - dragStart.current.y;

    setCardPositions(prev => prev.map((pos, i) => 
      i === draggedCard 
        ? { ...pos, x: dragStart.current.cardX + deltaX, y: dragStart.current.cardY + deltaY }
        : pos
    ));
  };

  // Handle drag end
  const handleDragEnd = () => {
    if (draggedCard === null) return;
    
    setCardPositions(prev => prev.map((pos, i) => 
      i === draggedCard ? { ...pos, isDragging: false } : pos
    ));
    setDraggedCard(null);
  };

  // Add global event listeners for drag
  useEffect(() => {
    const handleMouseMove = (e) => handleDragMove(e);
    const handleMouseUp = () => handleDragEnd();
    const handleTouchMove = (e) => handleDragMove(e);
    const handleTouchEnd = () => handleDragEnd();

    if (draggedCard !== null) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [draggedCard, cardPositions]);

  return (
    <section
      ref={sectionRef}
      id="vibe-pick"
      className="webproc webproc-vibe py-20 relative"
      aria-label="Choose a vibe"
    >
      <div className="max-w-7xl mx-auto px-6 relative" style={{ minHeight: 420 }}>
        <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: "'Syne', sans-serif", textAlign: 'left' }}>
          First we choose the <span className="brand-accent" style={{ color: 'var(--primary)' }}>vibe</span>
        </h2>

        <div ref={canvasRef} className="vibe-canvas relative" style={{ height: 340 }}>
          {VIBES.map((vibe, i) => {
            const pos = initialPositions[i];
            const ref = useRef(null);
            const currentPos = cardPositions[i];
            
            // Disable parallax when dragging
            useParallax(ref, { depth: currentPos.isDragging ? 0 : (i % 3) * 0.03 + 0.01 });

            const baseStyle = {
              position: 'absolute',
              width: 240,
              minWidth: 220,
              height: 240,
              borderRadius: 20,
              boxShadow: currentPos.isDragging 
                ? '0 20px 60px rgba(14,14,14,0.25)' 
                : '0 12px 40px rgba(14,14,14,0.08)',
              transformOrigin: 'center',
              transition: currentPos.isDragging 
                ? 'box-shadow 200ms ease' 
                : 'transform 350ms cubic-bezier(.22,.9,.35,1), box-shadow 350ms ease',
              top: `calc(${pos.top} + ${currentPos.y}px)`,
              left: `calc(${pos.left} + ${currentPos.x}px)`,
              overflow: 'hidden',
              background: vibe.bg,
              color: vibe.fg,
              cursor: currentPos.isDragging ? 'grabbing' : 'grab',
              zIndex: currentPos.isDragging ? 1000 : i,
              userSelect: 'none',
              touchAction: 'none'
            };

            return (
              <div
                key={vibe.id}
                ref={ref}
                className={`float-card hover-elastic web-vibe-card vibe-${vibe.id}`}
                style={baseStyle}
                role="img"
                aria-label={vibe.title}
                tabIndex={0}
                onMouseDown={(e) => handleDragStart(e, i)}
                onTouchStart={(e) => handleDragStart(e, i)}
                onMouseEnter={e => !currentPos.isDragging && (e.currentTarget.style.transform = 'translateY(-6px) rotate(-2deg) scale(1.03)')}
                onMouseLeave={e => !currentPos.isDragging && (e.currentTarget.style.transform = '')}
              >
                <div style={{ padding: 12 }}>
                  {/* tiny header */}
                  <div className="mock-header" style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
                    <div style={{ width: 42, height: 8, borderRadius: 6, background: vibe.id === 'playful' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.08)' }} />
                    <div style={{ flex: 1, height: 8, borderRadius: 6, background: vibe.id === 'playful' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.04)' }} />
                    <div style={{ width: 8, height: 8, borderRadius: 8, background: vibe.accent }} />
                  </div>

                  {/* content block */}
                  {vibe.id === 'luxury' ? (
                    <>
                      {/* Gold accent line at top */}
                      <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${vibe.accent}, transparent)`, marginBottom: 10, opacity: 0.5 }} />
                      
                      <div className="mock-card" style={{ marginTop: 6, borderRadius: 8, padding: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.15)', marginBottom: 8 }}>
                        {/* Luxury image placeholder with gold border */}
                        <div style={{ height: 65, borderRadius: 6, background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)', marginBottom: 10, border: '1px solid rgba(212,175,55,0.2)', position: 'relative', overflow: 'hidden' }}>
                          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 40, height: 40, borderRadius: '50%', background: vibe.accent, opacity: 0.2 }} />
                        </div>
                        
                        {/* Gold title bar */}
                        <div style={{ height: 18, width: '75%', borderRadius: 4, background: `linear-gradient(90deg, ${vibe.accent}, ${vibe.accent3})`, marginBottom: 6, opacity: 0.9 }} />
                        <div style={{ height: 8, width: '90%', borderRadius: 3, background: 'rgba(245,241,232,0.15)', marginBottom: 5 }} />
                        <div style={{ height: 8, width: '65%', borderRadius: 3, background: 'rgba(245,241,232,0.1)' }} />
                      </div>
                      
                      {/* Elegant button with gold accent */}
                      <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                        <div style={{ width: 100, height: 28, borderRadius: 4, background: vibe.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(212,175,55,0.3)' }}>
                          <div style={{ width: 60, height: 2, background: 'rgba(0,0,0,0.3)' }} />
                        </div>
                        <div style={{ width: 28, height: 28, borderRadius: 4, border: '1px solid rgba(212,175,55,0.3)', background: 'rgba(255,255,255,0.02)' }} />
                      </div>
                    </>
                  ) : vibe.id === 'tech' ? (
                    <>
                      {/* Neon glow accent line */}
                      <div style={{ height: 2, background: `linear-gradient(90deg, ${vibe.accent2}, ${vibe.accent}, ${vibe.accent3})`, marginBottom: 8, boxShadow: `0 0 8px ${vibe.accent}`, borderRadius: 2 }} />
                      
                      <div className="mock-card" style={{ marginTop: 6, borderRadius: 12, padding: 10, background: 'rgba(0,217,255,0.03)', border: '1px solid rgba(0,217,255,0.15)', position: 'relative', marginBottom: 8 }}>
                        {/* Tech grid background */}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(rgba(0,217,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,217,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.3, borderRadius: 12 }} />
                        
                        {/* Dashboard elements */}
                        <div style={{ position: 'relative', display: 'flex', gap: 8, marginBottom: 8 }}>
                          <div style={{ width: 55, height: 55, borderRadius: 8, background: `linear-gradient(135deg, ${vibe.accent} 0%, ${vibe.accent2} 100%)`, boxShadow: `0 4px 16px ${vibe.accent}40`, border: '1px solid rgba(0,217,255,0.3)' }} />
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                            <div style={{ height: 11, borderRadius: 4, background: vibe.accent, opacity: 0.8, boxShadow: `0 0 8px ${vibe.accent}60` }} />
                            <div style={{ height: 7, width: '70%', borderRadius: 3, background: 'rgba(232,244,248,0.2)' }} />
                            <div style={{ height: 7, width: '50%', borderRadius: 3, background: vibe.accent3, opacity: 0.6 }} />
                          </div>
                        </div>
                        
                        {/* Data visualization bars */}
                        <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 35, marginTop: 6 }}>
                          <div style={{ flex: 1, height: '60%', background: vibe.accent2, borderRadius: '3px 3px 0 0', boxShadow: `0 0 6px ${vibe.accent2}40` }} />
                          <div style={{ flex: 1, height: '85%', background: vibe.accent, borderRadius: '3px 3px 0 0', boxShadow: `0 0 8px ${vibe.accent}60` }} />
                          <div style={{ flex: 1, height: '50%', background: vibe.accent3, borderRadius: '3px 3px 0 0', boxShadow: `0 0 6px ${vibe.accent3}40` }} />
                          <div style={{ flex: 1, height: '70%', background: vibe.accent2, borderRadius: '3px 3px 0 0' }} />
                        </div>
                      </div>
                      
                      {/* Tech buttons */}
                      <div style={{ marginTop: 10, display: 'flex', gap: 8, marginBottom: 28 }}>
                        <div style={{ flex: 1, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${vibe.accent} 0%, ${vibe.accent2} 100%)`, boxShadow: `0 4px 12px ${vibe.accent}40`, border: '1px solid rgba(0,217,255,0.4)' }} />
                        <div style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${vibe.accent}`, background: 'rgba(0,217,255,0.05)' }} />
                      </div>
                    </>
                  ) : vibe.id === 'playful' ? (
                    <>
                      <div className="mock-card" style={{ marginTop: 6, borderRadius: 16, padding: 12, background: 'rgba(255,255,255,0.25)', boxShadow: '0 4px 12px rgba(255,107,157,0.15)' }}>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                          <div style={{ width: 48, height: 48, borderRadius: 12, background: vibe.accent }} />
                          <div style={{ width: 48, height: 48, borderRadius: 12, background: vibe.accent2 }} />
                          <div style={{ width: 48, height: 48, borderRadius: 12, background: '#FF6B9D' }} />
                        </div>
                        <div style={{ height: 22, borderRadius: 8, background: 'rgba(255,255,255,0.5)', marginBottom: 8 }} />
                        <div style={{ height: 14, width: '85%', borderRadius: 6, background: 'rgba(255,255,255,0.35)' }} />
                      </div>
                      <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'space-between', marginBottom: 28 }}>
                        <div style={{ width: 90, height: 32, borderRadius: 9999, background: vibe.accent, boxShadow: '0 4px 12px rgba(255,217,61,0.4)' }} />
                        <div style={{ width: 32, height: 32, borderRadius: 9999, background: vibe.accent2 }} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ marginTop: 8, marginBottom: 8 }}>
                        <div style={{ height: 52, borderRadius: 6, background: 'rgba(0,0,0,0.08)', marginBottom: 8, border: '1px solid rgba(0,0,0,0.06)' }} />
                        <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                          <div style={{ flex: 1, height: 12, borderRadius: 4, background: 'rgba(0,0,0,0.75)' }} />
                          <div style={{ width: 60, height: 12, borderRadius: 4, background: 'rgba(0,0,0,0.15)' }} />
                        </div>
                        <div style={{ height: 8, width: '90%', borderRadius: 4, background: 'rgba(0,0,0,0.12)', marginBottom: 4 }} />
                        <div style={{ height: 8, width: '78%', borderRadius: 4, background: 'rgba(0,0,0,0.12)', marginBottom: 4 }} />
                        <div style={{ height: 8, width: '65%', borderRadius: 4, background: 'rgba(0,0,0,0.12)' }} />
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 10 }}>
                        <div style={{ width: 18, height: 18, borderRadius: 9999, background: vibe.accent2 }} />
                        <div style={{ height: 6, width: 80, borderRadius: 4, background: 'rgba(0,0,0,0.2)' }} />
                      </div>
                    </>
                  )}
                </div>
                <div className="vibe-caption" style={{ position: 'absolute', bottom: 8, left: 12, fontSize: 12, opacity: 0.85, fontWeight: 600, textShadow: vibe.id === 'playful' ? '0 1px 3px rgba(0,0,0,0.15)' : 'none' }}>{vibe.title}</div>
              </div>
            );
          })}
        </div>
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
      style={{ minHeight: '100vh' }}
    >
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="color-bubbles-canvas relative" style={{ minHeight: 300 }}>
          
          {/* Light Blue - Top Left */}
          <div
            ref={bubble1Ref}
            className="color-bubble bubble-1"
            style={{
              position: 'absolute',
              width: '180px',
              height: '180px',
              left: '10%',
              top: '18%',
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
              width: '160px',
              height: '160px',
              left: '48%',
              top: '8%',
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
              width: '100px',
              height: '100px',
              left: '20%',
              top: '110%',
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
              width: '100px',
              height: '100px',
              left: '58%',
              top: '125%',
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
              width: '220px',
              height: '220px',
              left: '78%',
              top: '45%',
              borderRadius: '9999px',
              background: '#FFD600',
              willChange: 'transform',
              zIndex: 0
            }}
            aria-hidden
          />

          {/* Center headline - higher z-index */}
          <div className="relative z-10 text-center" style={{ paddingTop: '40vh' }}>
            <h2 className="text-5xl md:text-6xl font-bold" style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text)' }}>
              Then a <span className="brand-accent" style={{ color: 'var(--primary)' }}>Color</span>
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}

// Bubble component with ref forwarding
// (Small, self-contained Bubble component removed - replaced by inline render in ColorBubbles)

// Component 3: Font Carousel - Creative Measuring Design
function FontCarouselWord() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef);
  const fonts = [
    { key: 'playfair', label: 'Playfair Display', fam: "'Playfair Display', serif" },
    { key: 'gulf', label: 'Gulf Display', fam: "'Gulf Display', sans-serif" },
    { key: 'inter', label: 'Inter', fam: "'Inter', sans-serif" }
  ];

  // Triple the fonts array for seamless infinite scroll
  const repeatedFonts = [...fonts, ...fonts, ...fonts];

  return (
    <section
      ref={sectionRef}
      id="font-pick"
      className="webproc webproc-font py-20"
      style={{ 
        opacity: isInView ? 1 : 0, 
        transition: 'opacity 0.6s ease-out',
        minHeight: '100vh',
        position: 'relative',
        background: 'var(--bg)',
        overflow: 'hidden'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 relative" style={{ height: '100vh', paddingTop: '4rem', paddingBottom: '4rem' }}>
        {/* Header in top left corner */}
        <div style={{ position: 'absolute', top: '3rem', left: '3rem', textAlign: 'left', zIndex: 10 }}>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>
            Typography
          </h2>
        </div>

        {/* Grid lines background */}
        <div style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          right: '2rem',
          bottom: '2rem',
          backgroundImage: `
            linear-gradient(to right, rgba(138, 61, 230, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(138, 61, 230, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          opacity: 0.4,
          pointerEvents: 'none'
        }} />

        {/* Central font display area */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          width: 'calc(100% - 8rem)',
          maxWidth: '700px'
        }}>
          {/* Vertical ruler marks on left of carousel */}
          <div style={{
            position: 'absolute',
            left: '-40px',
            top: '50%',
            transform: 'translateY(-50%)',
            height: '120px',
            width: '2px',
            background: 'var(--muted)',
            opacity: 0.3
          }}>
            {[0, 25, 50, 75, 100].map(num => (
              <div key={num} style={{
                position: 'absolute',
                top: `${num}%`,
                left: '-8px',
                width: '18px',
                height: '2px',
                background: 'var(--muted)',
                opacity: 0.4
              }}>
                <span style={{
                  position: 'absolute',
                  left: '-42px',
                  top: '-9px',
                  fontSize: '13px',
                  color: 'var(--text)',
                  fontWeight: 600,
                  fontFamily: 'monospace',
                  opacity: 0.8,
                  letterSpacing: '-0.5px'
                }}>{num}</span>
              </div>
            ))}
          </div>

          {/* Vertical ruler marks on right of carousel */}
          <div style={{
            position: 'absolute',
            right: '-40px',
            top: '50%',
            transform: 'translateY(-50%)',
            height: '120px',
            width: '2px',
            background: 'var(--muted)',
            opacity: 0.3
          }}>
            {[0, 25, 50, 75, 100].map(num => (
              <div key={num} style={{
                position: 'absolute',
                top: `${num}%`,
                right: '-8px',
                width: '18px',
                height: '2px',
                background: 'var(--muted)',
                opacity: 0.4
              }}>
                <span style={{
                  position: 'absolute',
                  right: '-42px',
                  top: '-9px',
                  fontSize: '13px',
                  color: 'var(--text)',
                  fontWeight: 600,
                  fontFamily: 'monospace',
                  opacity: 0.8,
                  letterSpacing: '-0.5px'
                }}>{num}</span>
              </div>
            ))}
          </div>

          {/* Measurement annotations */}
          <div style={{
            marginBottom: '5px',
            fontSize: '13px',
            color: 'var(--text)',
            fontFamily: 'monospace',
            display: 'flex',
            gap: '24px',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            fontWeight: 600,
            opacity: 0.7,
            position: 'relative',
            zIndex: 10
          }}>
            <span>Weight: <strong>400-700</strong></span>
            <span>•</span>
            <span>Size: <strong>48-96px</strong></span>
            <span>•</span>
            <span>Line: <strong>1.2</strong></span>
          </div>

          {/* Font carousel - fade in/out */}
          <div className="font-carousel">
            {repeatedFonts.map((f, i) => (
              <div
                key={`${f.key}-${i}`}
                className="font-item"
                style={{ fontFamily: f.fam }}
              >
                {f.label}
              </div>
            ))}
          </div>

          {/* Dimension arrows */}
          <div style={{
            position: 'absolute',
            bottom: '-50px',
            left: '0',
            right: '0',
            height: '2px',
            background: 'var(--muted)',
            opacity: 0.3
          }}>
            <div style={{
              position: 'absolute',
              left: '0',
              top: '-4px',
              width: '0',
              height: '0',
              borderTop: '5px solid transparent',
              borderBottom: '5px solid transparent',
              borderRight: `8px solid var(--muted)`,
              opacity: 0.5
            }} />
            <div style={{
              position: 'absolute',
              right: '0',
              top: '-4px',
              width: '0',
              height: '0',
              borderTop: '5px solid transparent',
              borderBottom: '5px solid transparent',
              borderLeft: `8px solid var(--muted)`,
              opacity: 0.5
            }} />
            <span style={{
              position: 'absolute',
              top: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '12px',
              color: 'var(--text)',
              fontFamily: 'monospace',
              background: 'var(--bg)',
              padding: '3px 10px',
              whiteSpace: 'nowrap',
              fontWeight: 700,
              opacity: 1
            }}>580px</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// Main parent component
export default function WebsitesProcess() {
  return (
    <div className="websites-process-wrapper">
      {/* Major page heading */}
      <section className="design-process-intro text-center py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold" style={{ fontFamily: "'Syne', sans-serif" }}>
            Design process
          </h1>
        </div>
      </section>

      <VibePicker />
      <ColorBubbles />
      <FontCarouselWord />
    </div>
  );
}
