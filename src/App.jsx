import { useState, useEffect, useRef } from 'react';
import { Check, ArrowRight, ArrowLeft, X, Circle, Zap, PenTool, MessageCircle, BarChart3, Heart, Share2, Send } from 'lucide-react';
import heroLogo from '../img/Rootlabs-logo-xbg.png';
import sakura1 from '../img/sakura1.webp';
import sakura2 from '../img/sakura2.webp';
import sakura3 from '../img/sakura3.webp';
import sakura4 from '../img/sakura4.webp';
import beakerImg from '../img/beaker.webp';
import beaker1 from '../img/beaker1.webp';
import beaker2 from '../img/beaker2.webp';
import beaker3 from '../img/beaker3.webp';
import beaker4 from '../img/beaker4.webp';
import GardenerWebsite from './showcase/Gardener';
import TechStore from './showcase/TechStore';
import Restaurant from './showcase/Restaurant';
import WebsitesProcess from './components/WebsitesProcess';

// Navigation helper for client-side routing
function navigate(path) {
  window.location.hash = path;
}

// Helper: Serialize form data to object
    function serializeForm(form) {
      const formData = new FormData(form);
      const data = {};
      for (const [key, value] of formData.entries()) {
        if (key.endsWith('[]')) {
          const arrayKey = key.slice(0, -2);
          data[arrayKey] = data[arrayKey] || [];
          data[arrayKey].push(value);
        } else {
          data[key] = value;
        }
      }
      return data;
    }

    // Helper: Format lead for mailto fallback
    function formatLeadForMailto(lead) {
      const lines = [
        `Name: ${lead.name || 'N/A'}`,
        `Email: ${lead.email || 'N/A'}`,
        `Services: ${(lead.services || []).join(', ') || 'None selected'}`,
        lead.budget ? `Budget: ${lead.budget}` : '',
        lead.timeline ? `Timeline: ${lead.timeline}` : '',
        lead.contactMethod ? `Preferred Contact: ${lead.contactMethod}` : '',
        lead.pricingCall ? `Wants pricing call: Yes` : '',
        `\nMessage:\n${lead.message || 'N/A'}`
      ].filter(Boolean);
      return lines.join('\n');
    }

    // Helper: Submit lead - local success (no server endpoint)
    async function submitLead(lead) {
      // Track if available
      if (window.track && typeof window.track === 'function') {
        try {
          window.track('lead_submitted', lead);
        } catch (e) {
          console.warn('Tracking failed:', e);
        }
      }

      // Log the lead data for debugging purposes
      console.log('Lead submitted:', lead);

      // Return success - in production, this would send to a real backend or EmailJS
      return { success: true, via: 'local', data: lead };
    }

    // Floating Navigation
    function FloatingNav() {
      const [scrolled, setScrolled] = useState(false);
      const [lang, setLang] = useState('EN');
      const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
      
      const navData = document.getElementById('nav-data');
      const brand = navData?.dataset.brand || '';
      const items = navData ? JSON.parse(navData.dataset.items || '[]') : [];

      // Load language preference on mount
      useEffect(() => {
        const savedLang = localStorage.getItem('lang') || 'EN';
        setLang(savedLang);
      }, []);

      useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 100);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
      }, []);

      const getHref = (item) => {
        const lower = item.toLowerCase();
        if (lower === 'about') return '/#about';
        if (lower === 'home') return '/';
        if (lower === 'websites') return '/websites';
        if (lower === 'ai') return '/ai';
        if (lower === 'social') return '/social';
        if (lower === 'contact') return '#contact';
        return `#${lower}`;
      };

      const handleClick = (e, item) => {
        const href = getHref(item);
        const lower = item.toLowerCase();
        
        // Special handling for About - always navigate with hash
        if (lower === 'about') {
          e.preventDefault();
          window.location.href = '/#about';
          return;
        }
        
        if (href.startsWith('/')) {
          e.preventDefault();
          navigate(href);
        }
      };

      const handleBrandClick = (e) => {
        e.preventDefault();
        window.location.href = '/';
      };

      const toggleLanguage = () => {
        const newLang = lang === 'EN' ? 'CZ' : 'EN';
        setLang(newLang);
        localStorage.setItem('lang', newLang);
      };

      return (
        <>
          {/* Main Navigation - Centered */}
          <nav className={`fixed top-6 inset-x-0 flex justify-center z-50 transition-all duration-500 ${scrolled ? 'scale-95' : 'scale-100'}`}>
            <div className="glass-premium rounded-full px-8 py-4 flex items-center gap-8 shadow-2xl">
              <a 
                href="#hero"
                onClick={handleBrandClick}
                className="text-xl font-bold hover:opacity-80 transition-opacity"
                style={{ color: 'var(--primary)' }}
              >
                {brand}
              </a>
              <div className="hidden md:flex gap-6 text-sm font-medium">
                {items.map((item) => (
                  <a 
                    key={item}
                    href={getHref(item)} 
                    onClick={(e) => handleClick(e, item)}
                    className="hover:opacity-80 transition-opacity relative group focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md px-2 py-1"
                    style={{ color: 'var(--text)', outlineColor: 'var(--focus-ring)' }}
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full" style={{ background: 'var(--primary)' }} />
                  </a>
                ))}
              </div>
            </div>
          </nav>

          {/* Language Switch Bubble - Right Aligned */}
          <button
            onClick={toggleLanguage}
            className={`lang-switch glass-premium rounded-full px-4 py-3 shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none ${scrolled ? 'scale-95' : 'scale-100'}`}
            style={{ 
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              position: 'fixed',
              top: '1.5rem',
              right: '1.5rem',
              zIndex: 50
            }}
            aria-label="Toggle language"
          >
            <div className="flex items-center gap-2">
              <span 
                className={`lang-option transition-all duration-300 px-2 py-1 rounded-full ${lang === 'EN' ? 'lang-active' : ''}`}
                style={{ color: 'var(--text)' }}
              >
                EN
              </span>
              <span style={{ color: 'var(--muted)' }}>/</span>
              <span 
                className={`lang-option transition-all duration-300 px-2 py-1 rounded-full ${lang === 'CZ' ? 'lang-active' : ''}`}
                style={{ color: 'var(--text)' }}
              >
                CZ
              </span>
            </div>
          </button>

          {/* Mobile Navigation */}
          <div className="mobile-nav-bar md:hidden">
            <a
              href="#hero"
              onClick={handleBrandClick}
              className="mobile-nav-bubble"
            >
              <img src={heroLogo} alt="Root Labs" className="mobile-nav-logo" />
            </a>
            <button
              className="mobile-nav-bubble"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text)' }}>
                {mobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="7" x2="21" y2="7" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="17" x2="21" y2="17" />
                  </>
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="mobile-menu-dropdown md:hidden">
              {items.map((item) => (
                <a
                  key={item}
                  href={getHref(item)}
                  onClick={(e) => { handleClick(e, item); setMobileMenuOpen(false); }}
                  className="mobile-menu-item"
                >
                  {item}
                </a>
              ))}
              <button
                onClick={() => { toggleLanguage(); setMobileMenuOpen(false); }}
                className="mobile-menu-item"
                style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}
              >
                {lang === 'EN' ? 'Switch to CZ' : 'Switch to EN'}
              </button>
            </div>
          )}
        </>
      );
    }

    // Animated Hero Section
    function Hero() {
      const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
      const heroRef = useRef(null);
      const heroData = document.getElementById('hero-data');
      const data = {
        badge: heroData?.dataset.badge || '',
        title1: heroData?.dataset.title1 || '',
        title2: heroData?.dataset.title2 || '',
        subtitle: heroData?.dataset.subtitle || '',
        btnPrimary: heroData?.dataset.btnprimary || '',
        btnSecondary: heroData?.dataset.btnsecondary || '',
        cardNumber: heroData?.dataset.cardnumber || '',
        cardSubtitle: heroData?.dataset.cardsubtitle || '',
        cardText: heroData?.dataset.cardtext || ''
      };

      useEffect(() => {
        const handleMove = (e) => {
          if (heroRef.current) {
            const rect = heroRef.current.getBoundingClientRect();
            setMousePos({
              x: ((e.clientX - rect.left) / rect.width - 0.5) * 30,
              y: ((e.clientY - rect.top) / rect.height - 0.5) * 30
            });
          }
        };
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
      }, []);

      return (
        <section ref={heroRef} className="min-h-screen flex items-center relative overflow-hidden pt-32 pb-20">
          {/* Animated Background Blobs */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="blob absolute w-96 h-96 rounded-full" 
                 style={{ background: 'var(--mesh-tint)', top: '10%', left: '10%' }} />
            <div className="blob absolute w-80 h-80 rounded-full" 
                 style={{ background: 'var(--mesh-secondary)', bottom: '20%', right: '15%', animationDelay: '2s' }} />
          </div>
          
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
            {/* Left: Text Content */}
            <div className="space-y-6 stagger-item">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight" style={{ fontFamily: "'Geist', sans-serif" }}>
                {data.title1}
                <span className="block mt-2" style={{ color: 'var(--primary)' }}>
                  {data.title2}
                </span>
              </h1>

              <p className="text-lg leading-relaxed max-w-lg" style={{ color: 'var(--muted)' }}>
                {data.subtitle}
              </p>

              <div className="flex gap-4 pt-2">
                <a href="#work" className="glow-on-hover relative px-7 py-4 rounded-full text-white font-semibold text-base inline-flex items-center transition-all duration-300 hover:translate-y-[-1px]"
                        style={{ 
                          background: 'var(--primary)',
                          boxShadow: 'inset 0 0 0 5px rgba(255, 255, 255, 0.18)'
                        }}>
                  <span className="relative z-10">{data.btnPrimary}</span>
                </a>
                    <a href="#pricing" className="btn-glass px-7 py-4 text-base inline-flex items-center transition-all duration-300 hover:translate-y-[-1px]">
                  {data.btnSecondary}
                </a>
              </div>
            </div>
            
            {/* Right: Hero visual */}
            <div className="relative flex items-center justify-center hero-logo-column" style={{ minHeight: 420 }}>
              <img
                src={`${import.meta.env.BASE_URL}img/hero-right.png`}
                alt=""
                className="hero-right-img"
              />
            </div>
          </div>
        </section>
      );
    }

    // Bento Grid Portfolio - COMMENTED OUT (can be restored later)
    /*
    function BentoPortfolio() {
      const portfolioData = document.getElementById('portfolio-data');
      const heading = portfolioData?.dataset.heading || '';
      const subheading = portfolioData?.dataset.subheading || '';
      const projects = portfolioData ? JSON.parse(portfolioData.dataset.projects || '[]') : [];

      return (
        <section id="work" className="py-24 px-6" style={{ background: 'var(--bg)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="mb-16 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-3">{heading}</h2>
              <p className="text-lg" style={{ color: 'var(--muted)' }}>{subheading}</p>
            </div>

            <div className="portfolio-rows">
              {projects.map((project, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <div 
                    key={idx}
                    className={'portfolio-row ' + (isEven ? 'row-normal' : 'row-reversed')}
                    style={{ animationDelay: (idx * 0.15) + 's' }}
                  >
                    <div className="portfolio-content">
                      <div className="content-inner">
                        <div 
                          className="project-tag" 
                          style={{ color: project.color }}
                        >
                          {project.tag}
                        </div>
                        <h3 className="project-title">{project.title}</h3>
                        <p className="project-description">{project.description}</p>
                        <a 
                          href={project.url || "#"} 
                          className="project-cta"
                          style={{ 
                            background: 'linear-gradient(135deg, ' + project.color + ' 0%, ' + project.color + 'dd 100%)' 
                          }}
                        >
                          Visit Website</a>
                      </div>
                    </div>
                    <div className="portfolio-image">
                      <img 
                        src={project.img} 
                        alt={project.title}
                        className="portfolio-img"
                      />
                      <div className="image-overlay"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );
    }
    */

    // Labs & Experiments Section - HackMe Lab
    function LabsSection() {
      return (
        <section id="labs" className="py-24 px-6" style={{ background: 'var(--surface)' }}>
          <div className="max-w-6xl mx-auto">
            {/* Section Header - Left Aligned */}
            <div className="mb-16 text-left">
              <p className="text-xs font-bold mb-4 tracking-[0.3em]" style={{ color: 'var(--primary)' }}>
                LABS & EXPERIMENTS
              </p>
              <h2 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Geist', sans-serif", color: 'var(--text)' }}>
                What we're building
              </h2>
              <p className="text-lg" style={{ color: 'var(--muted)' }}>
                Internal projects and experiments that showcase our technical expertise
              </p>
            </div>

            {/* Project Cards Container */}
            <div className="space-y-20">
              
              {/* HackMe Lab Card */}
              <div className="labs-project-card">
                {/* Project Name - Centered, Big & Bold */}
                <div className="text-center mb-6">
                  <span className="project-pill project-pill-lg">
                    <span style={{ color: '#000000' }}>Hack</span>
                    <span style={{ color: '#28c840' }}>Me</span>
                  </span>
                </div>

                {/* Apple-style Window - Centered */}
                <div className="max-w-4xl mx-auto">
                  <div className="hackme-window group">
                    {/* macOS Traffic Light Dots */}
                    <div className="hackme-window-header">
                      <div className="traffic-lights">
                        <span className="dot dot-red"></span>
                        <span className="dot dot-yellow"></span>
                        <span className="dot dot-green"></span>
                      </div>
                      <div className="window-title">
                        <span className="window-title-text">hackme-lab</span>
                      </div>
                    </div>

                    {/* Window Content */}
                    <div className="hackme-window-content">
                      {/* Terminal-style Background Visual */}
                      <div className="hackme-visual">
                        <div className="terminal-lines">
                          <span className="terminal-prompt">$</span>
                          <span className="terminal-command">./start-challenge --level beginner</span>
                        </div>
                        <div className="terminal-lines">
                          <span className="terminal-output">Loading SQL Injection challenge...</span>
                        </div>
                        <div className="terminal-lines">
                          <span className="terminal-output success">? Challenge ready. Good luck, hacker!</span>
                        </div>
                        <div className="terminal-cursor"></div>
                      </div>

                      {/* Content */}
                      <div className="hackme-info">
                        <h3 className="hackme-title">
                          Learn to hack. Learn to build.
                        </h3>

                        <p className="hackme-description">
                          An interactive, beginner-friendly platform teaching web fundamentals and cybersecurity through safe, simulated challenges. Explore SQLi, XSS, IDOR and more in a safe sandbox environment.
                        </p>

                        <a 
                          href="https://electroworks-store.github.io/HackMe/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hackme-cta"
                        >
                          <span>Open HackMe Lab</span>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Teamster Card */}
              <div className="labs-project-card">
                {/* Project Name - Centered, Big & Bold */}
                <div className="text-center mb-6">
                  <span className="project-pill project-pill-lg">
                    <span style={{ color: '#0070F3' }}>Teamster</span>
                  </span>
                </div>

                {/* Apple-style Window - Centered */}
                <div className="max-w-4xl mx-auto">
                  <div className="teamster-window group">
                    {/* macOS Traffic Light Dots */}
                    <div className="teamster-window-header">
                      <div className="traffic-lights">
                        <span className="dot dot-red"></span>
                        <span className="dot dot-yellow"></span>
                        <span className="dot dot-green"></span>
                      </div>
                      <div className="window-title">
                        <span className="teamster-window-title-text">teamster - workspace</span>
                      </div>
                    </div>

                    {/* Window Content */}
                    <div className="teamster-window-content">
                      {/* Screenshot Preview */}
                      <div className="teamster-preview">
                        <img 
                          src={`${import.meta.env.BASE_URL}img/teamster.png`}
                          alt="Teamster Workspace" 
                          className="teamster-screenshot"
                        />
                      </div>

                      {/* Info Content */}
                      <div className="teamster-info">
                        <h3 className="teamster-title">
                          Your team's command center
                        </h3>

                        <p className="teamster-description">
                          A unified workspace designed for growing teams. Sheets, metrics, chat, and calendar — all in one beautifully simple interface.
                        </p>

                        <a 
                          href="https://electroworks-store.github.io/Teamsterx/index.html" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="teamster-cta"
                        >
                          <span>Open Teamster</span>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      );
    }

    // Animated beaker that cycles through 4 frames
    function AnimatedBeakerLabs() {
      const beakerFrames = [beaker1, beaker2, beaker3, beaker4];
      const [frame, setFrame] = useState(0);
      const loadedRef = useRef(false);

      // Preload all beaker images into browser cache before starting animation
      useEffect(() => {
        const images = beakerFrames.map(src => {
          const img = new Image();
          img.src = src;
          return img;
        });
        Promise.all(images.map(img => img.decode ? img.decode() : new Promise(r => { img.onload = r; }))).then(() => {
          loadedRef.current = true;
        });
      }, []);

      useEffect(() => {
        const interval = setInterval(() => {
          if (loadedRef.current) {
            setFrame(prev => (prev + 1) % beakerFrames.length);
          }
        }, 400);
        return () => clearInterval(interval);
      }, []);

      return (
        <h2 className="font-bold tracking-tight select-none" style={{ fontFamily: "'Geist', sans-serif", color: 'var(--text)', lineHeight: 1, fontSize: 'clamp(6rem, 11vw, 10rem)', display: 'inline-flex', alignItems: 'flex-end', whiteSpace: 'nowrap' }}>
          <span>L</span>
          <span style={{ display: 'inline-block', width: '0.7em', height: '1em', position: 'relative', zIndex: 10, flexShrink: 0 }}>
            {beakerFrames.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                style={{
                  width: '8em',
                  height: '8em',
                  objectFit: 'contain',
                  objectPosition: 'center bottom',
                  position: 'absolute',
                  bottom: '2.52em',
                  left: '50%',
                  transform: 'translateX(-50%) scale(1.6)',
                  visibility: frame === i ? 'visible' : 'hidden',
                  zIndex: 100
                }}
              />
            ))}
          </span>
          <span>bs</span>
        </h2>
      );
    }

    // Labs Headline Section — big "Labs" with flask icon
    function LabsHeadline() {
      return (
        <section className="py-32 px-6" style={{ background: 'var(--bg)' }}>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center labs-headline-grid">
            {/* Left: Description */}
            <div className="labs-headline-text">
              <p className="text-lg md:text-xl leading-relaxed" style={{ color: 'var(--muted)' }}>
                We're a small team that loves to experiment. We mix cutting-edge AI with raw human creativity to build things that feel fresh, fast, and a little unexpected.
              </p>
            </div>
            {/* Right: Big "Labs" with beaker image */}
            <div className="flex items-center justify-center md:justify-end labs-headline-beaker">
              <AnimatedBeakerLabs />
            </div>
          </div>
        </section>
      );
    }

    // Sakura Gallery — scroll-hijacked showcase
    function SakuraGallery() {
      const containerRef = useRef(null);
      const [activeIndex, setActiveIndex] = useState(0);
      const [isLocked, setIsLocked] = useState(false);
      const isTransitioning = useRef(false);
      const lastScrollTime = useRef(0);
      const accumulatedDelta = useRef(0);
      const SCROLL_THRESHOLD = 120; // pixels of scroll needed to trigger a slide change

      const slides = [
        { img: sakura1, name: 'Idea Stage', description: 'Every great project starts with a spark. We brainstorm, sketch, and explore all creative directions before committing to a path forward.' },
        { img: sakura2, name: 'Research', description: 'Deep dive into the problem space. We study the market, analyze competitors, and gather the insights needed to make informed design decisions.' },
        { img: sakura3, name: 'Working', description: 'Heads down, hands on. Our team builds, iterates, and refines, turning research and concepts into a polished, functional product.' },
        { img: sakura4, name: 'Final Product', description: 'The finished result, tested, refined, and ready to ship. A product that looks stunning and performs beautifully in the real world.' },
      ];

      useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new IntersectionObserver(
          ([entry]) => {
            const locked = entry.isIntersecting && entry.intersectionRatio > 0.8;
            setIsLocked(locked);
            if (!locked) accumulatedDelta.current = 0;
          },
          { threshold: [0.8, 1] }
        );
        observer.observe(container);
        return () => observer.disconnect();
      }, []);

      useEffect(() => {
        if (!isLocked) return;

        const handleWheel = (e) => {
          const direction = e.deltaY > 0 ? 1 : -1;
          const nextIndex = activeIndex + direction;

          // At boundaries, let page scroll naturally
          if (nextIndex < 0 || nextIndex > slides.length - 1) {
            accumulatedDelta.current = 0;
            return;
          }

          // Always prevent default when inside the gallery range
          e.preventDefault();

          if (isTransitioning.current) return;

          // Accumulate scroll delta for intentional feel
          accumulatedDelta.current += Math.abs(e.deltaY);

          if (accumulatedDelta.current >= SCROLL_THRESHOLD) {
            accumulatedDelta.current = 0;
            isTransitioning.current = true;
            lastScrollTime.current = Date.now();
            setActiveIndex(nextIndex);
            setTimeout(() => { isTransitioning.current = false; }, 700);
          }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        return () => window.removeEventListener('wheel', handleWheel);
      }, [isLocked, activeIndex, slides.length]);

      // Touch support
      const touchStart = useRef(0);
      useEffect(() => {
        if (!isLocked) return;

        const handleTouchStart = (e) => { touchStart.current = e.touches[0].clientY; };
        const handleTouchEnd = (e) => {
          if (isTransitioning.current) return;

          const delta = touchStart.current - e.changedTouches[0].clientY;
          if (Math.abs(delta) < 50) return;

          const direction = delta > 0 ? 1 : -1;
          const nextIndex = activeIndex + direction;
          if (nextIndex < 0 || nextIndex > slides.length - 1) return;

          lastScrollTime.current = Date.now();
          isTransitioning.current = true;
          setActiveIndex(nextIndex);
          setTimeout(() => { isTransitioning.current = false; }, 700);
        };

        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchend', handleTouchEnd, { passive: true });
        return () => {
          window.removeEventListener('touchstart', handleTouchStart);
          window.removeEventListener('touchend', handleTouchEnd);
        };
      }, [isLocked, activeIndex, slides.length]);

      return (
        <section
          ref={containerRef}
          className="sakura-gallery"
          style={{
            height: '100vh',
            position: 'sticky',
            top: 0,
            overflow: 'hidden',
            background: 'var(--bg)'
          }}
        >
          <div className="max-w-7xl mx-auto px-6 h-full flex items-center">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center w-full">
              {/* Left: Image */}
              <div className="relative" style={{ height: '70vh', borderRadius: 20, overflow: 'hidden' }}>
                {slides.map((slide, i) => (
                    <img
                      key={i}
                      src={slide.img}
                      alt={slide.name}
                      className="absolute object-contain"
                      style={{
                        width: '100%',
                        height: '100%',
                        top: '-5%',
                        left: 0,
                        opacity: activeIndex === i ? 1 : 0,
                        transform: activeIndex === i ? 'scale(1)' : 'scale(1.05)',
                        transition: 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)',
                        borderRadius: 20
                      }}
                    />
                  ))}
              </div>

              {/* Right: Text + progress */}
              <div className="flex flex-col justify-center" style={{ minHeight: '50vh' }}>
                {/* Progress dots */}
                <div className="flex gap-2 mb-8">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { if (!isTransitioning.current) { setActiveIndex(i); isTransitioning.current = true; setTimeout(() => { isTransitioning.current = false; }, 700); } }}
                      className="transition-all duration-300"
                      style={{
                        width: activeIndex === i ? 32 : 8,
                        height: 8,
                        borderRadius: 9999,
                        background: activeIndex === i ? 'var(--primary)' : 'rgba(138, 61, 230, 0.15)',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0
                      }}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>

                {/* Slide counter */}
                <p className="text-xs font-bold tracking-[0.3em] mb-4" style={{ color: 'var(--primary)' }}>
                  {String(activeIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                </p>

                {/* Title */}
                <div style={{ position: 'relative', minHeight: 80 }}>
                  {slides.map((slide, i) => (
                    <h3
                      key={i}
                      className="text-4xl md:text-5xl lg:text-6xl font-bold"
                      style={{
                        fontFamily: "'Geist', sans-serif",
                        position: i === 0 ? 'relative' : 'absolute',
                        top: 0,
                        left: 0,
                        opacity: activeIndex === i ? 1 : 0,
                        transform: activeIndex === i ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'opacity 0.5s ease, transform 0.5s ease',
                        pointerEvents: activeIndex === i ? 'auto' : 'none'
                      }}
                    >
                      {slide.name}
                    </h3>
                  ))}
                </div>

                {/* Description */}
                <div style={{ position: 'relative', minHeight: 80, marginTop: '1.5rem' }}>
                  {slides.map((slide, i) => (
                    <p
                      key={i}
                      className="text-lg leading-relaxed"
                      style={{
                        color: 'var(--muted)',
                        position: i === 0 ? 'relative' : 'absolute',
                        top: 0,
                        left: 0,
                        maxWidth: 480,
                        opacity: activeIndex === i ? 1 : 0,
                        transform: activeIndex === i ? 'translateY(0)' : 'translateY(16px)',
                        transition: 'opacity 0.5s ease 0.05s, transform 0.5s ease 0.05s',
                        pointerEvents: activeIndex === i ? 'auto' : 'none'
                      }}
                    >
                      {slide.description}
                    </p>
                  ))}
                </div>


              </div>
            </div>
          </div>
        </section>
      );
    }

    // Sakura Gallery wrapper — provides scroll-lock spacing
    function SakuraGalleryWrapper() {
      return (
        <div style={{ height: '200vh', position: 'relative' }}>
          <SakuraGallery />
        </div>
      );
    }

    // About Section
    function About() {
      // Half-circle wave layers: semicircles centered at x=0, only right half visible
      const waveRadii = [440, 380, 320, 270, 220, 175, 140, 105];
      const waveColors = [
        'rgba(138, 61, 230, 0.045)',
        'rgba(138, 61, 230, 0.08)',
        'rgba(138, 61, 230, 0.13)',
        'rgba(138, 61, 230, 0.19)',
        'rgba(138, 61, 230, 0.27)',
        'rgba(138, 61, 230, 0.36)',
        'rgba(138, 61, 230, 0.48)',
        'rgba(138, 61, 230, 0.62)',
      ];

      // Wavy half-circle centered at (0, 400) in SVG, arcs rightward
      function wavyHalfCircle(r, seed) {
        const cx = 0, cy = 400;
        const points = [];
        const steps = 64;
        for (let i = 0; i <= steps; i++) {
          const angle = -Math.PI / 2 + (Math.PI * i) / steps;
          const wobble = Math.sin(angle * 6 + seed) * (r * 0.06) + Math.cos(angle * 4 - seed * 1.3) * (r * 0.04);
          const rx = r + wobble;
          const x = cx + Math.cos(angle) * rx;
          const y = cy + Math.sin(angle) * rx;
          points.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`);
        }
        // Close back along the flat left edge (x=0)
        points.push(`L0 ${(cy + r + 20).toFixed(1)}`);
        points.push(`L0 ${(cy - r - 20).toFixed(1)}`);
        points.push('Z');
        return points.join(' ');
      }



      const wavesRef = useRef(null);
      const [wavesVisible, setWavesVisible] = useState(false);

      useEffect(() => {
        const el = wavesRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
          ([entry]) => { if (entry.isIntersecting) { setWavesVisible(true); obs.disconnect(); } },
          { threshold: 0.15 }
        );
        obs.observe(el);
        return () => obs.disconnect();
      }, []);

      return (
        <section id="about" className="relative" style={{ background: 'var(--bg)', paddingTop: '4rem', paddingBottom: '4rem' }}>

          {/* Hero Section - Wave Half-Circle + Text */}
          <div ref={wavesRef} className="relative min-h-screen flex items-center py-32" style={{ overflow: 'visible' }}>

            {/* Purple half-circle waves flush to left edge */}
            <div
              className={`about-waves-anchor ${wavesVisible ? 'about-waves-entered' : ''}`}
              style={{
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 560,
                height: 800,
                zIndex: 1,
                pointerEvents: 'none',
              }}
            >
              <svg
                viewBox="0 0 560 800"
                preserveAspectRatio="xMinYMid meet"
                style={{ display: 'block', position: 'absolute', left: -30, top: 0, width: 'calc(100% + 30px)', height: '100%' }}
                aria-hidden="true"
              >
                {waveRadii.map((r, i) => (
                  <path
                    key={i}
                    d={wavyHalfCircle(r, i * 1.7 + 0.5)}
                    fill={waveColors[i]}
                    className="about-wave-ring"
                    style={{ animationDelay: `${i * 0.08}s` }}
                  />
                ))}
              </svg>



            </div>

            {/* Content - offset to clear waves */}
            <div className="relative z-10 px-8 md:px-12 lg:px-20 about-content-block" style={{ marginLeft: 'min(35vw, 500px)' }}>
                <div className="space-y-6 max-w-3xl">
                  <p className="text-xs font-bold tracking-[0.3em]" style={{ color: 'var(--primary)' }}>
                    ABOUT ROOT LABS
                  </p>

                  <h2
                    className="text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.05]"
                    style={{ fontFamily: "'Geist', sans-serif", color: 'var(--text)' }}
                  >
                    We build websites
                    <br />
                    <span style={{ color: 'var(--primary)' }}>that stand out.</span>
                  </h2>

                  <p className="text-lg md:text-xl leading-relaxed" style={{ color: 'var(--muted)' }}>
                    Three students from Brno combining AI with human creativity to ship in days, not months.
                  </p>
                </div>
            </div>
          </div>

          {/* Mission Section — Venn Diagram */}
          {(() => {
            const vennRef = useRef(null);
            const [vennVisible, setVennVisible] = useState(false);

            useEffect(() => {
              const el = vennRef.current;
              if (!el) return;
              const obs = new IntersectionObserver(
                ([entry]) => { if (entry.isIntersecting) { setVennVisible(true); obs.disconnect(); } },
                { threshold: 0.2 }
              );
              obs.observe(el);
              return () => obs.disconnect();
            }, []);

            // Circle geometry: 3 circles in classic Venn layout
            // Canvas: 520 x 480, circles r=140
            const r = 140;
            const cx = 260, cy = 220; // center of the diagram
            const spread = 90; // distance from center to each circle's center
            const circles = [
              { cx: cx - spread * 0.87, cy: cy - spread * 0.5, label: 'Creativity', lx: -68, ly: -55, color: [138, 61, 230] },   // purple
              { cx: cx + spread * 0.87, cy: cy - spread * 0.5, label: 'Quality', lx: 68, ly: -55, color: [56, 132, 248] },     // blue
              { cx: cx, cy: cy + spread, label: 'Speed', lx: 0, ly: 85, color: [20, 184, 166] },                               // teal
            ];

            return (
              <div ref={vennRef} className="relative px-8 md:px-12 lg:px-20 py-32">
                <div className="max-w-6xl mx-auto text-center">
                  <p
                    className="text-xs font-bold mb-16 tracking-[0.3em]"
                    style={{
                      color: 'var(--primary)',
                      opacity: vennVisible ? 1 : 0,
                      transform: vennVisible ? 'translateY(0)' : 'translateY(16px)',
                      transition: 'opacity 0.6s ease, transform 0.6s ease',
                    }}
                  >
                    OUR MISSION
                  </p>

                  {/* SVG Venn Diagram */}
                  <div
                    className="relative mx-auto"
                    style={{ width: '100%', maxWidth: 520, aspectRatio: '520 / 480' }}
                  >
                    <svg
                      viewBox="0 0 520 480"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ width: '100%', height: '100%', display: 'block' }}
                      aria-hidden="true"
                    >
                      <defs>
                        {/* Radial gradients for each circle — unique colors */}
                        {circles.map((c, i) => (
                          <radialGradient key={`grad-${i}`} id={`vennGrad${i + 1}`} cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor={`rgba(${c.color.join(',')}, 0.14)`} />
                            <stop offset="100%" stopColor={`rgba(${c.color.join(',')}, 0.03)`} />
                          </radialGradient>
                        ))}
                      </defs>

                      {/* Three main circles — layered so overlaps naturally darken */}
                      {circles.map((c, i) => (
                        <g key={i}>
                          <circle
                            cx={c.cx}
                            cy={c.cy}
                            r={r}
                            fill={`url(#vennGrad${i + 1})`}
                            stroke={`rgba(${c.color.join(',')}, 0.22)`}
                            strokeWidth="1.5"
                            style={{
                              opacity: vennVisible ? 1 : 0,
                              transform: vennVisible
                                ? 'scale(1)'
                                : `translate(${c.lx * 0.4}px, ${c.ly * 0.4}px) scale(0.7)`,
                              transformOrigin: `${c.cx}px ${c.cy}px`,
                              transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.15 + i * 0.12}s, transform 1s cubic-bezier(0.16, 1, 0.3, 1) ${0.15 + i * 0.12}s`,
                            }}
                          />
                        </g>
                      ))}

                      {/* Overlap enhancement: draw circles again with lighter fill for stacking effect */}
                      {circles.map((c, i) => (
                        <circle
                          key={`overlap-${i}`}
                          cx={c.cx}
                          cy={c.cy}
                          r={r}
                          fill={`rgba(${c.color.join(',')}, 0.04)`}
                          style={{
                            opacity: vennVisible ? 1 : 0,
                            transition: `opacity 1.2s ease ${0.5 + i * 0.1}s`,
                          }}
                        />
                      ))}

                      {/* Labels */}
                      {circles.map((c, i) => (
                        <text
                          key={`label-${i}`}
                          x={c.cx + c.lx}
                          y={c.cy + c.ly}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill={`rgb(${c.color.join(',')})`}
                          fontFamily="'Geist', sans-serif"
                          fontWeight="700"
                          fontSize="15"
                          letterSpacing="0.04em"
                          style={{
                            opacity: vennVisible ? 1 : 0,
                            transform: vennVisible ? 'translateY(0)' : 'translateY(10px)',
                            transition: `opacity 0.6s ease ${0.6 + i * 0.15}s, transform 0.6s ease ${0.6 + i * 0.15}s`,
                          }}
                        >
                          {c.label}
                        </text>
                      ))}
                    </svg>

                    {/* Center logo — floating above SVG at the triple intersection */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '46%',
                        left: '50%',
                        transform: vennVisible
                          ? 'translate(-50%, -50%) scale(1)'
                          : 'translate(-50%, -50%) scale(0)',
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        background: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 24px rgba(138, 61, 230, 0.15), 0 0 0 4px rgba(138, 61, 230, 0.06)',
                        zIndex: 5,
                        transition: 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.7s',
                      }}
                    >
                      <img
                        src={`${import.meta.env.BASE_URL}img/rootlabs-favicon.png`}
                        alt="Root Labs"
                        style={{ width: '70%', height: '70%', objectFit: 'contain' }}
                      />
                    </div>
                  </div>

                  <p
                    className="text-lg md:text-xl leading-relaxed mt-14 max-w-2xl mx-auto"
                    style={{
                      color: 'var(--muted)',
                      opacity: vennVisible ? 1 : 0,
                      transform: vennVisible ? 'translateY(0)' : 'translateY(20px)',
                      transition: 'opacity 0.8s ease 0.9s, transform 0.8s ease 0.9s',
                    }}
                  >
                    Where creativity, quality, and speed overlap, that's where we work.
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Team Section - Meet the crew */}
          <div className="relative px-8 md:px-12 lg:px-20 py-32">
            <div className="max-w-5xl mx-auto">

              <div className="mb-20">
                <p className="text-xs font-bold mb-6 tracking-[0.3em]" style={{ color: 'var(--primary)' }}>
                  THE TEAM
                </p>
                <h3 className="text-4xl md:text-6xl font-bold" style={{ fontFamily: "'Geist', sans-serif", color: 'var(--text)' }}>
                  Meet the crew
                </h3>
              </div>

              <div className="space-y-0">
                {[
                  { name: 'Adrian', role: 'Full stack dev', tagline: '"Builds different"', color: 'var(--primary)', avatar: `${import.meta.env.BASE_URL}img/Adrian_avatar.png` },
                  { name: 'Viktor', role: 'Design & brand', tagline: '"Made it look good"', color: 'var(--primary)', avatar: `${import.meta.env.BASE_URL}img/Viky_avatar.png` },
                  { name: 'Štěpán', role: 'Growth & strategy', tagline: '"Kept it from falling apart"', color: 'var(--primary)', avatar: `${import.meta.env.BASE_URL}img/Nepik_avatar.png`}
                ].map((member, idx) => (
                  <div 
                    key={idx}
                    className="group py-8 md:py-10 border-b cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-transparent hover:via-[rgba(138,61,230,0.03)] hover:to-transparent"
                    style={{ 
                      borderColor: 'var(--glass-border)',
                      opacity: 0,
                      animation: 'fadeInUp 0.6s ease-out forwards',
                      animationDelay: `${0.4 + idx * 0.1}s`
                    }}
                  >
                    <div className="flex items-center justify-between gap-4 md:gap-8">
                      {/* Left side: Name + Role (always visible) */}
                      <div className="flex items-center gap-4 md:gap-6 transition-transform duration-300 group-hover:translate-x-2">
                        <div>
                          <h4 
                            className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1" 
                            style={{ fontFamily: "'Geist', sans-serif", color: 'var(--text)' }}
                          >
                            {member.name}
                          </h4>
                          <p className="text-sm md:text-base font-semibold" style={{ color: 'var(--primary)' }}>
                            {member.role}
                          </p>
                        </div>
                      </div>

                      {/* Right side: Avatar + Tagline (hidden by default, slides in on hover) */}
                      <div className="hidden md:flex items-center gap-4 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out">
                        <p 
                          className="text-sm lg:text-base text-right max-w-[200px] lg:max-w-xs italic" 
                          style={{ color: 'var(--muted)' }}
                        >
                          {member.tagline}
                        </p>
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-14 h-14 lg:w-16 lg:h-16 rounded-full object-cover flex-shrink-0"
                          style={{
                            border: '2px solid var(--glass-border)'
                          }}
                        />
                      </div>
                    </div>

                    {/* Mobile: Avatar + Tagline (stacked, hidden by default) */}
                    <div className="md:hidden flex items-center gap-3 mt-4 opacity-0 max-h-0 overflow-hidden group-hover:opacity-100 group-hover:max-h-24 transition-all duration-300">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                        style={{
                          border: '2px solid var(--glass-border)'
                        }}
                      />
                      <p 
                        className="text-sm italic" 
                        style={{ color: 'var(--muted)' }}
                      >
                        {member.tagline}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </section>
      );
    }

    // Services Section - Scroll Wheel + Dynamic Content
    function Services() {
      const servicesData = document.getElementById('services-data');
      const heading = servicesData?.dataset.heading || '';
      const subheading = servicesData?.dataset.subheading || '';

      const websitesData = document.getElementById('websites-data');
      const aiData = document.getElementById('ai-data');
      const socialData = document.getElementById('social-data');

      const sectionRef = useRef(null);
      const [activeIndex, setActiveIndex] = useState(0);
      const [wheelRotation, setWheelRotation] = useState(0);
      const [contentVisible, setContentVisible] = useState(true);
      const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
      const prevIndex = useRef(0);

      const allServices = [
        {
          id: 'websites',
          number: '01',
          title: 'Custom Websites',
          price: '$499',
          timeline: '7 days',
          description: websitesData?.dataset.subheading || '',
          color: '#8A3DE6',
          link: '/websites',
          features: ['Responsive Design', 'Speed Optimization', 'Modern UI/UX', 'SEO-Friendly', 'Custom Animations', 'Performance Audit'],
        },
        {
          id: 'ai',
          number: '02',
          title: 'AI Agents',
          price: '$299/mo',
          timeline: '<1s response',
          description: aiData?.dataset.subheading || '',
          color: '#38bdf8',
          link: '/ai',
          features: ['Customer Support', 'Lead Qualification', 'Multi-Channel Deploy', 'Custom Training', 'CRM Integration', 'Real-time Analytics'],
        },
        {
          id: 'social',
          number: '03',
          title: 'Social Media',
          price: '$879/mo',
          timeline: '10 posts/mo',
          description: socialData?.dataset.subheading || '',
          color: '#FF7A2D',
          link: '/social',
          features: ['Content Creation', 'Community Management', 'Growth Strategy', 'Analytics Reports', 'Influencer Outreach', '3+ Platforms'],
        }
      ];

      // Scroll-driven wheel rotation
      useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const handleScroll = () => {
          const rect = el.getBoundingClientRect();
          const vh = window.innerHeight;
          const scrolled = -rect.top;
          const totalScroll = el.offsetHeight - vh;
          const progress = Math.max(0, Math.min(1, scrolled / totalScroll));
          
          // Map progress to 0–2 (3 sections) and snap to nearest
          const rawIndex = progress * (allServices.length - 1);
          const snappedIndex = Math.round(rawIndex);
          const clampedIndex = Math.max(0, Math.min(allServices.length - 1, snappedIndex));
          
          // Snap rotation to exact 120deg increments
          setWheelRotation(clampedIndex * 120);

          if (clampedIndex !== prevIndex.current) {
            setContentVisible(false);
            setTimeout(() => {
              setActiveIndex(clampedIndex);
              setContentVisible(true);
              prevIndex.current = clampedIndex;
            }, 200);
          }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
      }, []);

      // Track viewport width for mobile rotation offset
      useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
      }, []);

      // Click handler to jump to a specific service
      const jumpToService = (idx) => {
        setWheelRotation(idx * 120);
        setContentVisible(false);
        setTimeout(() => {
          setActiveIndex(idx);
          setContentVisible(true);
          prevIndex.current = idx;
        }, 200);
      };

      const service = allServices[activeIndex];

      // Wheel SVG constants — donut ring, full circle
      const outerR = 320;
      const innerR = 150;
      const wheelCx = 350;
      const wheelCy = 350;
      const sectorAngle = 120;
      const gapWidth = 8; // constant-width gap in SVG units

      return (
        <section
          id="services"
          ref={sectionRef}
          className="relative"
          style={{ height: '250vh', background: 'var(--bg)' }}
        >
          <div
            className="sticky top-0 overflow-hidden"
            style={{ height: '100vh' }}
          >
            {/* Section Header */}
            <div className="absolute top-8 left-0 right-0 text-center z-10 px-8">
              <p className="text-xs font-bold tracking-[0.3em] mb-2" style={{ color: 'var(--primary)' }}>
                OUR SERVICES
              </p>
              <p className="text-base" style={{ color: 'var(--muted)' }}>Three services, limitless results</p>
            </div>

            <div className="wheel-layout">
              {/* Left Column — Wheel */}
              <div className="wheel-col-left">
                <div className="wheel-container">
                  <svg
                    viewBox="0 0 700 700"
                    className="wheel-svg"
                    style={{
                      transform: `rotate(${(isMobile ? 0 : 90) - wheelRotation}deg)`,
                      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    {allServices.map((s, i) => {
                      // Full sector angles (no gap subtracted from the arcs)
                      const startDeg = i * sectorAngle - 90 - sectorAngle / 2;
                      const endDeg = i * sectorAngle - 90 + sectorAngle / 2;
                      const startRad = startDeg * (Math.PI / 180);
                      const endRad = endDeg * (Math.PI / 180);

                      // Outer arc points
                      const ox1 = wheelCx + outerR * Math.cos(startRad);
                      const oy1 = wheelCy + outerR * Math.sin(startRad);
                      const ox2 = wheelCx + outerR * Math.cos(endRad);
                      const oy2 = wheelCy + outerR * Math.sin(endRad);
                      // Inner arc points
                      const ix1 = wheelCx + innerR * Math.cos(endRad);
                      const iy1 = wheelCy + innerR * Math.sin(endRad);
                      const ix2 = wheelCx + innerR * Math.cos(startRad);
                      const iy2 = wheelCy + innerR * Math.sin(startRad);

                      const d = [
                        `M ${ox1} ${oy1}`,
                        `A ${outerR} ${outerR} 0 0 1 ${ox2} ${oy2}`,
                        `L ${ix1} ${iy1}`,
                        `A ${innerR} ${innerR} 0 0 0 ${ix2} ${iy2}`,
                        'Z',
                      ].join(' ');

                      // Label position
                      const midDeg = (startDeg + endDeg) / 2;
                      const midRad = midDeg * (Math.PI / 180);
                      const labelR = (outerR + innerR) / 2;
                      const lx = wheelCx + labelR * Math.cos(midRad);
                      const ly = wheelCy + labelR * Math.sin(midRad);
                      const isActive = i === activeIndex;

                      // Counter-rotate labels to keep them horizontal to the viewer
                      const svgRotation = (isMobile ? 0 : 90) - wheelRotation;
                      const labelRotation = -svgRotation;

                      return (
                        <g key={s.id} style={{ cursor: 'pointer' }} onClick={() => jumpToService(i)}>
                          <path
                            d={d}
                            fill={s.color}
                            opacity={isActive ? 1 : 0.65}
                            style={{ transition: 'opacity 0.5s' }}
                          />
                          <text
                            x={lx}
                            y={ly}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontFamily="'Space Grotesk', sans-serif"
                            fontWeight="800"
                            fontSize={isActive ? '52' : '40'}
                            fill="white"
                            pointerEvents="none"
                            style={{
                              transition: 'font-size 0.5s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                              transform: `rotate(${labelRotation}deg)`,
                              transformOrigin: `${lx}px ${ly}px`,
                            }}
                          >
                            {s.number}
                          </text>
                        </g>
                      );
                    })}
                    {/* Constant-width gap lines between sectors */}
                    {allServices.map((_, i) => {
                      const dividerDeg = i * sectorAngle - 90 - sectorAngle / 2;
                      const dividerRad = dividerDeg * (Math.PI / 180);
                      const x1 = wheelCx + (innerR - 2) * Math.cos(dividerRad);
                      const y1 = wheelCy + (innerR - 2) * Math.sin(dividerRad);
                      const x2 = wheelCx + (outerR + 2) * Math.cos(dividerRad);
                      const y2 = wheelCy + (outerR + 2) * Math.sin(dividerRad);
                      return (
                        <line
                          key={`gap-${i}`}
                          x1={x1} y1={y1} x2={x2} y2={y2}
                          stroke="var(--bg, #f5f5f7)"
                          strokeWidth={gapWidth}
                          pointerEvents="none"
                        />
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Right Column — Content */}
              <div
                className="wheel-col-right"
                style={{
                  opacity: contentVisible ? 1 : 0,
                  transform: contentVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition: 'opacity 0.35s ease, transform 0.45s ease',
                }}
              >
                {/* Service title */}
                <h3
                  className="wheel-service-title"
                  style={{ color: service.color }}
                >
                  {service.title}
                </h3>

                {/* Price & timeline */}
                <div className="wheel-meta">
                  <span className="wheel-meta-value">{service.price}</span>
                  <span className="wheel-meta-sep">|</span>
                  <span className="wheel-meta-value">{service.timeline}</span>
                </div>

                {/* Description */}
                {service.description && (
                  <p className="wheel-description">{service.description}</p>
                )}

                {/* Features grid */}
                <div className="wheel-features">
                  {service.features.map((f, i) => (
                    <div key={i} className="wheel-feature-item">
                      <div
                        className="wheel-feature-dot"
                        style={{ background: service.color }}
                      />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="wheel-cta-wrap">
                  <a
                    href={service.link}
                    onClick={(e) => { e.preventDefault(); navigate(service.link); }}
                    className="wheel-cta-btn"
                    style={{
                      background: service.color,
                      boxShadow: 'inset 0 0 0 5px rgba(255, 255, 255, 0.18)',
                    }}
                  >
                    Explore {service.title}
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </div>


              </div>
            </div>
          </div>
        </section>
      );
    }

    // Pricing Section
    function Pricing() {
      const pricingData = document.getElementById('pricing-data');
      const topline = pricingData?.dataset.topline || '';
      const heading1 = pricingData?.dataset.heading1 || '';
      const heading2 = pricingData?.dataset.heading2 || '';
      const subheading = pricingData?.dataset.subheading || '';
      const guarantee = pricingData?.dataset.guarantee || '';
      const plans = pricingData ? JSON.parse(pricingData.dataset.plans || '[]') : [];

      const formatPrice = (amount) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(amount);
      };

      return (
        <section id="pricing" className="pricing-section">
          <div className="pricing-container">
            {topline && <div className="pricing-topline">{topline}</div>}
            
            <div className="pricing-header">
              <h2 className="pricing-heading">
                {heading1}{' '}
                <span className="pricing-accent-text">{heading2}</span>
              </h2>
              <p className="pricing-subheading">{subheading}</p>
            </div>

            <div id="pricing-grid" className="pricing-grid">
              {plans.map((plan, idx) => {
                const setupPrice = formatPrice(plan.setup);
                const monthlyPrice = formatPrice(plan.monthly);
                
                return (
                  <article 
                    key={idx}
                    className={`pricing-card ${plan.popular ? 'pricing-card--popular' : ''}`}
                    role="region"
                    aria-labelledby={`plan-${idx}-title`}
                  >
                    {plan.popular && (
                      <div className="pricing-badge" aria-label="Recommended plan">
                        Most Popular
                      </div>
                    )}
                    
                    <h3 id={`plan-${idx}-title`} className="pricing-card-name">
                      {plan.name}
                    </h3>
                    
                    <div className="price-wrap">
                      <div className="price-number" aria-label={`${setupPrice} one-time setup`}>
                        {setupPrice}
                      </div>
                      <div className="price-small">one-time setup</div>
                      <div className="price-monthly">
                        + {monthlyPrice}<span className="price-monthly-label">/month</span>
                      </div>
                    </div>

                    <ul className="pricing-features">
                      {plan.features.map((feature, fIdx) => (
                        <li key={fIdx}>{feature}</li>
                      ))}
                    </ul>

                    <a 
                      href="#contact"
                      className="pricing-cta"
                      aria-label={`Choose ${plan.name} plan at ${setupPrice} setup plus ${monthlyPrice} per month`}
                    >
                      {plan.cta || 'Get started'}
                    </a>
                    
                    <a 
                      href="#"
                      className="pricing-secondary"
                      aria-label={`Learn more about ${plan.name} plan`}
                    >
                      Learn more
                    </a>
                  </article>
                );
              })}
            </div>

            {guarantee && (
              <div className="pricing-footnote" role="contentinfo">
                {guarantee}
              </div>
            )}
          </div>
        </section>
      );
    }

    // Custom Dropdown Component
    function CustomSelect({ id, name, value, onChange, options, placeholder = 'Select...' }) {
      const [isOpen, setIsOpen] = useState(false);
      const [selectedValue, setSelectedValue] = useState(value || '');
      const dropdownRef = useRef(null);

      // Close dropdown when clicking outside
      useEffect(() => {
        const handleClickOutside = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }, []);

      const handleSelect = (optValue) => {
        setSelectedValue(optValue);
        setIsOpen(false);
        if (onChange) onChange(optValue);
      };

      const selectedLabel = options.find(opt => opt.value === selectedValue)?.label || placeholder;

      return (
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            id={id}
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-6 py-4 rounded-full outline-none transition-all text-left flex items-center justify-between"
            style={{ 
              background: 'var(--glass-bg-dark)',
              border: isOpen ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
              color: selectedValue ? 'var(--text)' : 'var(--muted)'
            }}
          >
            <span>{selectedLabel}</span>
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 16 16" 
              fill="none"
              style={{ 
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }}
            >
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          {isOpen && (
            <div 
              className="absolute z-50 w-full mt-2 rounded-2xl overflow-hidden"
              style={{ 
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
              }}
            >
              {options.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className="w-full px-6 py-3 text-left transition-all"
                  style={{ 
                    background: selectedValue === opt.value ? 'rgba(138, 61, 230, 0.12)' : 'transparent',
                    color: '#0a0a14',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedValue !== opt.value) {
                      e.target.style.background = 'rgba(138, 61, 230, 0.06)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedValue !== opt.value) {
                      e.target.style.background = 'transparent';
                    }
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
          
          {/* Hidden input for form submission */}
          <input type="hidden" name={name} value={selectedValue} />
        </div>
      );
    }

    // Contact Section - Enhanced with Multi-Select Services
    function Contact() {
      const contactData = document.getElementById('contact-data');
      const data = {
        heading: contactData?.dataset.heading || 'Ready to Reimagine Your Site?',
        subheading: contactData?.dataset.subheading || "Let's chat about transforming your online presence into something remarkable",
        namePlaceholder: contactData?.dataset.nameplaceholder || 'Your Name',
        emailPlaceholder: contactData?.dataset.emailplaceholder || 'Email Address',
        messagePlaceholder: contactData?.dataset.messageplaceholder || 'Tell us about your project...',
        buttonText: contactData?.dataset.buttontext || 'Send Message',
        emailText: contactData?.dataset.emailtext || 'Or email us directly at',
        emailLink: contactData?.dataset.emaillink || 'rootlabs0@gmail.com',
        scheduleUrl: contactData?.dataset.scheduleurl || ''
      };

      const [selectedServices, setSelectedServices] = useState([]);
      const [budget, setBudget] = useState('');
      const [timeline, setTimeline] = useState('');
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [submitStatus, setSubmitStatus] = useState(null); // null | 'success' | 'error'
      const [errorMessage, setErrorMessage] = useState('');      const formRef = useRef(null);
      const successRef = useRef(null);

      const services = [
        { id: 'websites', label: 'Custom Websites', color: '#8A3DE6' },
        { id: 'ai', label: 'AI Automations', color: '#38bdf8' },
        { id: 'social', label: 'Social Media Management', color: '#FF7A2D' }
      ];

      const budgetOptions = [
        { value: '', label: 'Select Budget' },
        { value: '<$500', label: 'Under $500' },
        { value: '$500-$999', label: '$500 - $999' },
        { value: '$1k-$5k', label: '$1,000 - $5,000' },
        { value: '$5k+', label: '$5,000+' }
      ];

      const timelineOptions = [
        { value: '', label: 'Select Timeline' },
        { value: 'urgent', label: 'ASAP (1-2 weeks)' },
        { value: 'soon', label: 'Soon (2-4 weeks)' },
        { value: 'flexible', label: 'Flexible (1-3 months)' },
        { value: 'planning', label: 'Just Planning' }
      ];

      const toggleService = (serviceId) => {
        setSelectedServices(prev => 
          prev.includes(serviceId) 
            ? prev.filter(id => id !== serviceId)
            : [...prev, serviceId]
        );
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (isSubmitting) return;

        const form = formRef.current;
        if (!form) return;

        // Honeypot check - if filled, silently reject (bot detected)
        const honeypot = form.querySelector('[name="website_url_hp"]')?.value;
        if (honeypot) {
          console.warn('Bot detected via honeypot');
          // Silently fail - don't give bots feedback
          return;
        }

        // Validate required fields
        const name = form.querySelector('[name="name"]')?.value.trim();
        const email = form.querySelector('[name="email"]')?.value.trim();
        const message = form.querySelector('[name="message"]')?.value.trim();

        if (!name || !email || !message) {
          setErrorMessage('Please fill in all required fields.');
          return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
          setErrorMessage('Please enter a valid email address.');
          return;
        }

        setIsSubmitting(true);
        setErrorMessage('');

        try {
          const formData = serializeForm(form);
          const lead = {
            name,
            email,
            message,
            services: selectedServices,
            budget: formData.budget || undefined,
            timeline: formData.timeline || undefined,
            timestamp: new Date().toISOString()
          };

          const result = await submitLead(lead);

          if (result.success) {
            setSubmitStatus('success');
            form.reset();
            setSelectedServices([]);
            setBudget('');
            setTimeline('');
            
            // Focus on success message
            setTimeout(() => {
              successRef.current?.focus();
            }, 100);
          }
        } catch (error) {
          console.error('Submit error:', error);
          setErrorMessage(
            error.message || 'Failed to send message. Please try again or email us directly at ' + data.emailLink
          );
        } finally {
          setIsSubmitting(false);
        }
      };

      if (submitStatus === 'success') {
        return (
          <section id="contact" className="contact-section py-32 px-6" style={{ background: 'var(--surface)' }}>
            {/* Decorative Wave Background - 3 soft curved layers */}
            <div className="contact-waves-bg" aria-hidden="true">
              <svg className="wave-svg wave-svg--light" viewBox="0 0 1440 320" preserveAspectRatio="none">
                <path d="M0,160 C180,220 360,100 540,160 C720,220 900,100 1080,160 C1260,220 1350,140 1440,180 L1440,320 L0,320 Z" />
              </svg>
              <svg className="wave-svg wave-svg--mid" viewBox="0 0 1440 320" preserveAspectRatio="none">
                <path d="M0,200 C240,140 360,260 600,180 C840,100 960,240 1200,160 C1320,120 1400,200 1440,160 L1440,320 L0,320 Z" />
              </svg>
              <svg className="wave-svg wave-svg--dark" viewBox="0 0 1440 320" preserveAspectRatio="none">
                <path d="M0,220 C200,160 400,280 640,200 C880,120 1040,260 1280,180 C1360,150 1420,220 1440,200 L1440,320 L0,320 Z" />
              </svg>
            </div>
            
            <div className="max-w-4xl mx-auto" style={{ position: 'relative', zIndex: 1 }}>
              <div className="contact-card liquid-card" style={{ padding: '48px', textAlign: 'center' }}>
                <div 
                  ref={successRef}
                  tabIndex={-1}
                  role="status"
                  aria-live="polite"
                  className="space-y-6"
                  style={{ outline: 'none' }}
                >
                  <div className="flex justify-center"><Check className="w-16 h-16" style={{ color: 'var(--success)' }} /></div>
                  <h3 className="text-3xl font-bold" style={{ fontFamily: "'Geist', sans-serif" }}>
                    Thank You!
                  </h3>
                  <p className="text-lg" style={{ color: 'var(--muted)' }}>
                    We've received your message and will get back to you within 1 business day.
                  </p>
                  <div className="flex gap-4 justify-center pt-4">
                    <a 
                      href="#pricing" 
                      className="px-6 py-3 rounded-full font-semibold transition-all hover:translate-y-[-1px]"
                      style={{ 
                        background: 'var(--primary)',
                        color: 'white',
                        boxShadow: 'inset 0 0 0 4px rgba(255, 255, 255, 0.18)'
                      }}
                    >
                      View Pricing
                    </a>
                    <button 
                      onClick={() => setSubmitStatus(null)}
                      className="px-6 py-3 rounded-full font-semibold transition-all hover:translate-y-[-1px]"
                      style={{ 
                        background: 'transparent',
                        boxShadow: 'inset 0 0 0 2px rgba(138, 61, 230, 0.18)',
                        color: 'var(--text)'
                      }}
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      }

      return (
        <section id="contact" className="contact-section py-24 px-6" style={{ background: 'var(--surface)' }}>
          {/* Decorative Wave Background - 3 soft curved layers */}
          <div className="contact-waves-bg" aria-hidden="true">
            <svg className="wave-svg wave-svg--light" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path d="M0,160 C180,220 360,100 540,160 C720,220 900,100 1080,160 C1260,220 1350,140 1440,180 L1440,320 L0,320 Z" />
            </svg>
            <svg className="wave-svg wave-svg--mid" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path d="M0,200 C240,140 360,260 600,180 C840,100 960,240 1200,160 C1320,120 1400,200 1440,160 L1440,320 L0,320 Z" />
            </svg>
            <svg className="wave-svg wave-svg--dark" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path d="M0,220 C200,160 400,280 640,200 C880,120 1040,260 1280,180 C1360,150 1420,220 1440,200 L1440,320 L0,320 Z" />
            </svg>
          </div>
          
          <div className="max-w-5xl mx-auto" style={{ position: 'relative', zIndex: 1 }}>
            {/* Header */}
            <div className="contact-hero text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Geist', sans-serif" }}>
                {data.heading}
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>
                {data.subheading}
              </p>
            </div>

            {/* Form Card */}
            <div className="contact-card liquid-card max-w-2xl mx-auto" style={{ padding: '40px' }}>
              <form ref={formRef} onSubmit={handleSubmit} noValidate>
                <div className="space-y-6">
                  {/* Service Selector */}
                  <div>
                    <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>
                      I'm interested in: <span style={{ color: 'var(--muted)', fontWeight: 'normal' }}>(select all that apply)</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {services.map(service => (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => toggleService(service.id)}
                          onKeyDown={(e) => {
                            if (e.key === ' ' || e.key === 'Enter') {
                              e.preventDefault();
                              toggleService(service.id);
                            }
                          }}
                          className={`service-chip ${selectedServices.includes(service.id) ? 'service-chip--active' : ''}`}
                          style={{
                            padding: '12px 24px',
                            borderRadius: '24px',
                            border: selectedServices.includes(service.id) 
                              ? `2px solid ${service.color}`
                              : '2px solid var(--glass-border)',
                            background: selectedServices.includes(service.id)
                              ? `${service.color}15`
                              : 'var(--glass-bg-dark)',
                            color: selectedServices.includes(service.id) ? service.color : 'var(--text)',
                            fontWeight: selectedServices.includes(service.id) ? '600' : '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            transform: selectedServices.includes(service.id) ? 'translateY(-2px)' : 'none'
                          }}
                          aria-pressed={selectedServices.includes(service.id)}
                        >
                          {selectedServices.includes(service.id) && <Check className="w-4 h-4 inline-block mr-1" />}
                          {service.label}
                        </button>
                      ))}
                    </div>
                    {/* Hidden inputs for form submission */}
                    {selectedServices.map(serviceId => (
                      <input key={serviceId} type="hidden" name="services[]" value={serviceId} />
                    ))}
                  </div>

                  {/* Name & Email Row */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>
                        Name <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input 
                        id="contact-name"
                        name="name"
                        type="text" 
                        required
                        placeholder={data.namePlaceholder}
                        className="w-full px-6 py-4 rounded-full outline-none transition-all"
                        style={{ 
                          background: 'var(--glass-bg-dark)',
                          border: '1px solid var(--glass-border)',
                          color: 'var(--text)'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>
                        Email <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input 
                        id="contact-email"
                        name="email"
                        type="email" 
                        required
                        placeholder={data.emailPlaceholder}
                        className="w-full px-6 py-4 rounded-full outline-none transition-all"
                        style={{ 
                          background: 'var(--glass-bg-dark)',
                          border: '1px solid var(--glass-border)',
                          color: 'var(--text)'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                      />
                    </div>
                  </div>

                  {/* Honeypot field - hidden from real users, catches bots */}
                  <input
                    type="text"
                    name="website_url_hp"
                    defaultValue=""
                    autoComplete="new-password"
                    tabIndex={-1}
                    aria-hidden="true"
                    style={{ 
                      position: 'absolute',
                      left: '-9999px',
                      width: '1px',
                      height: '1px',
                      opacity: 0,
                      pointerEvents: 'none'
                    }}
                  />

                  {/* Budget & Timeline Row */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-budget" className="block text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>
                        Budget <span style={{ color: 'var(--muted)', fontWeight: 'normal' }}>(optional)</span>
                      </label>
                      <CustomSelect
                        id="contact-budget"
                        name="budget"
                        value={budget}
                        onChange={setBudget}
                        options={budgetOptions}
                        placeholder="Select budget range"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-timeline" className="block text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>
                        Timeline <span style={{ color: 'var(--muted)', fontWeight: 'normal' }}>(optional)</span>
                      </label>
                      <CustomSelect
                        id="contact-timeline"
                        name="timeline"
                        value={timeline}
                        onChange={setTimeline}
                        options={timelineOptions}
                        placeholder="Select timeline"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>
                      Message <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <textarea 
                      id="contact-message"
                      name="message"
                      required
                      placeholder={data.messagePlaceholder}
                      rows="5"
                      className="w-full px-6 py-4 rounded-3xl outline-none transition-all resize-none"
                      style={{ 
                        background: 'var(--glass-bg-dark)',
                        border: '1px solid var(--glass-border)',
                        color: 'var(--text)'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                    />
                  </div>

                  {/* Error Message */}
                  {errorMessage && (
                    <div 
                      role="alert"
                      className="p-4 rounded-2xl text-sm"
                      style={{ background: '#ef444415', border: '1px solid #ef4444', color: '#ef4444' }}
                    >
                      {errorMessage}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-full text-white font-semibold text-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    style={{ 
                      background: isSubmitting 
                        ? 'var(--muted)'
                        : 'var(--primary)',
                      boxShadow: isSubmitting ? 'none' : '0 4px 16px rgba(138, 61, 230, 0.24)'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="submit-spinner"></span>
                        Sending...
                      </>
                    ) : (
                      data.buttonText
                    )}
                  </button>

                  {/* Email Fallback - Inside card */}
                  <p className="text-center text-sm pt-4" style={{ color: 'var(--muted)' }}>
                    {data.emailText}{' '}
                    <a 
                      href={`mailto:${data.emailLink}`} 
                      className="font-semibold transition-opacity hover:opacity-70"
                      style={{ color: 'var(--primary)' }}
                    >
                      {data.emailLink}
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>
      );
    }

    // Footer
    function Footer() {
      const footerData = document.getElementById('footer-data');
      const brand = footerData?.dataset.brand || '';
      const copyright = footerData?.dataset.copyright || '';

      const socials = [
        { name: 'YouTube', url: 'https://youtube.com/@rootlabs', icon: 'M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z' },
        { name: 'Instagram', url: 'https://instagram.com/rootlabs.studio', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' }
      ];

      return (
        <footer className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
                {brand}
              </div>
              
              {/* Social Links */}
              <div className="flex gap-6">
                {socials.map(social => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-all hover:scale-110"
                    style={{ color: 'var(--muted)' }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--muted)'}
                    aria-label={social.name}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d={social.icon} />
                    </svg>
                  </a>
                ))}
              </div>
              
              <div className="text-sm max-w-md" style={{ color: 'var(--muted)' }}>
                {copyright}
              </div>
            </div>
          </div>
        </footer>
      );
    }

    // Product Cards Section
    function ProductCards() {
      const mockupData = document.getElementById('mockup-a-data');
      const cards = mockupData ? JSON.parse(mockupData.dataset.cards || '[]') : [];

      return (
        <section className="product-cards-section">
          <div className="product-cards-grid">
            {cards.map((card, idx) => (
              <article 
                key={idx}
                className="product-card liquid-card stagger-item"
                style={{ animationDelay: `${idx * 0.12}s` }}
              >
                <img 
                  src={card.img} 
                  alt={card.title}
                  className="product-card-img"
                />
                <div className="product-card-body">
                  <h3 className="product-card-title">{card.title}</h3>
                  <p className="product-card-desc">{card.desc}</p>
                  <a 
                    href="#contact"
                    className="btn-pill-purple"
                    aria-label={`Book a demo for ${card.title}`}
                  >
                    {card.cta}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      );
    }

    // Stats Counter Section
    function Stats() {
      const statsData = document.getElementById('stats-data');
      const stats = statsData ? JSON.parse(statsData.dataset.stats || '[]') : [];
      const [hasAnimated, setHasAnimated] = useState(false);
      const [counts, setCounts] = useState(stats.map(() => 0));
      const sectionRef = useRef(null);

      useEffect(() => {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && !hasAnimated) {
                setHasAnimated(true);
                // Animate all counters
                stats.forEach((stat, index) => {
                  animateCount(index, stat.number);
                });
              }
            });
          },
          { threshold: 0.3 }
        );

        if (sectionRef.current) {
          observer.observe(sectionRef.current);
        }

        return () => {
          if (sectionRef.current) {
            observer.unobserve(sectionRef.current);
          }
        };
      }, [hasAnimated]);

      const animateCount = (index, target) => {
        const duration = 2000; // 2 seconds
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
          step++;
          current = Math.min(current + increment, target);
          
          setCounts(prev => {
            const newCounts = [...prev];
            newCounts[index] = Math.floor(current);
            return newCounts;
          });

          if (step >= steps || current >= target) {
            setCounts(prev => {
              const newCounts = [...prev];
              newCounts[index] = target;
              return newCounts;
            });
            clearInterval(timer);
          }
        }, duration / steps);
      };

      const statColors = [
        '#8A3DE6', // Purple
        '#38bdf8', // Blue
        '#8A3DE6', // Purple
        '#38bdf8'  // Blue (was green)
      ];

      return (
        <section ref={sectionRef} className="stats-section py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 gap-8 justify-items-center max-w-3xl mx-auto">
              {stats.map((stat, idx) => {
                const color = statColors[idx % statColors.length];
                return (
                  <div 
                    key={idx} 
                    className="group relative text-center"
                  >
                    {/* Number container with line centered over number only */}
                    <div className="relative inline-block mb-8">
                      {/* Decorative line on top - centered over the number */}
                      <div 
                        className="h-1 w-16 mb-6 mx-auto rounded-full transition-all duration-500 group-hover:w-full"
                        style={{ background: color }}
                      />
                      
                      {/* Number - Outlined style matching process numbers */}
                      <div className="relative inline-flex justify-center">
                        <div 
                          className="text-[5rem] md:text-[7rem] font-bold leading-none transition-all duration-300 group-hover:scale-105"
                          style={{ 
                            fontFamily: "'Space Grotesk', sans-serif",
                            WebkitTextStroke: `2.5px ${color}`,
                            WebkitTextFillColor: 'transparent',
                            backgroundImage: `radial-gradient(circle, ${color}20 0%, ${color}15 100%)`,
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent'
                          }}
                        >
                          {counts[idx]}
                        </div>
                        {stat.suffix && (
                          <div 
                            className="absolute left-full bottom-2 text-[2rem] md:text-[2.5rem] font-bold leading-none ml-1 transition-all duration-300 group-hover:scale-105"
                            style={{ 
                              fontFamily: "'Space Grotesk', sans-serif",
                              WebkitTextStroke: `1.5px ${color}`,
                              WebkitTextFillColor: 'transparent',
                              backgroundImage: `radial-gradient(circle, ${color}20 0%, ${color}15 100%)`,
                              WebkitBackgroundClip: 'text',
                              backgroundClip: 'text',
                              color: 'transparent'
                            }}
                          >
                            {stat.suffix}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Label */}
                    <div 
                      className="text-sm uppercase tracking-wider font-medium"
                      style={{ color: 'var(--muted)' }}
                    >
                      {stat.label}
                    </div>
                    
                    {/* Hover glow effect */}
                    <div 
                      className="absolute -inset-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"
                      style={{
                        background: `radial-gradient(circle at center, ${color}08 0%, transparent 70%)`,
                        filter: 'blur(20px)'
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    // Spotlight Stack Section - COMMENTED OUT (can be restored later)
    /*
    function SpotlightStack() {
      const [isFlipped, setIsFlipped] = useState(false);
      
      const mockupData = document.getElementById('mockup-b-data');
      const heading = mockupData?.dataset.heading || 'Speed Meets Quality';
      const body = mockupData?.dataset.body || 'We deliver agency-level designs in days, not months.';
      const image = mockupData?.dataset.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80';
      const imageAlt = mockupData?.dataset.imagealt || 'Featured image';

      const handleStackClick = () => {
        setIsFlipped(!isFlipped);
      };

      const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsFlipped(!isFlipped);
        }
      };

      return (
        <section className="spotlight-stack">
          <div className="stack-text-block">
            <h2>{heading}</h2>
            <p>{body}</p>
          </div>
          <div 
            className="stack-wrap"
            onClick={handleStackClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label="Click to flip cards"
          >
            <div 
              className={`stack-back ${isFlipped ? 'is-top' : ''}`}
              aria-hidden="true" 
            />
            <div 
              className={`stack-front ${isFlipped ? 'is-bottom' : ''} hover-elastic`}
              role="img"
              aria-label={imageAlt}
            >
              <img 
                src={image} 
                alt={imageAlt}
                className="stack-image"
              />
            </div>
          </div>
        </section>
      );
    }
    */

    // Why Us Pricing Section
    function WhyUsPricing() {
      const [scrollProgress, setScrollProgress] = useState(0);
      const [activeStep, setActiveStep] = useState(0);
      const [counters, setCounters] = useState([0, 0, 0]);
      const [hasAnimated, setHasAnimated] = useState([false, false, false]);
      const sectionRef = useRef(null);
      const stepRefs = useRef([]);

      const mockupData = document.getElementById('mockup-c-data');
      const heading = mockupData?.dataset.heading || 'Your Journey';
      const subheading = mockupData?.dataset.subheading || 'From problem to success';
      const cards = mockupData ? JSON.parse(mockupData.dataset.cards || '[]') : [];

      const journeySteps = [
        { phase: 'Problem', title: cards[0]?.title || 'Slow turnarounds', desc: cards[0]?.desc || 'Traditional agencies take months', metricText: '3-6', unit: ' months', metricLabel: 'typical timeline', side: 'left', targetNumber: 6 },
        { phase: 'Our approach', title: cards[1]?.title || 'AI-enhanced workflow', desc: cards[1]?.desc || 'Smart automation meets human expertise', metricText: '5-7', unit: ' days', metricLabel: 'our delivery', side: 'right', targetNumber: 7 },
        { phase: 'Outcome', title: cards[2]?.title || 'Launch faster', desc: cards[2]?.desc || 'Get to market while competitors plan', metricText: '80', unit: '% faster', metricLabel: 'time savings', side: 'left', targetNumber: 80 }
      ];
      const journeyLabels = ['Problem', 'Our Approach', 'Outcome'];

      // Scroll progress and active step detection
      useEffect(() => {
        const handleScroll = () => {
          if (!sectionRef.current) return;

          const section = sectionRef.current;
          const rect = section.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const windowCenter = windowHeight / 2;

          // Calculate how much of the timeline should be filled
          // Fill line up to the center of the screen
          const sectionTop = rect.top;
          const sectionBottom = rect.bottom;
          const sectionHeight = rect.height;
          
          // Distance from top of section to center of viewport
          const distanceToCenterFromTop = windowCenter - sectionTop;
          
          // Progress as percentage of total section height
          const progress = Math.max(0, Math.min(1, distanceToCenterFromTop / sectionHeight));
          
          setScrollProgress(progress);

          // Detect active step
          stepRefs.current.forEach((stepRef, idx) => {
            if (stepRef) {
              const stepRect = stepRef.getBoundingClientRect();
              const stepCenter = stepRect.top + stepRect.height / 2;
              
              if (stepCenter >= windowHeight * 0.3 && stepCenter <= windowHeight * 0.7) {
                setActiveStep(idx);
              }
            }
          });
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
        
        return () => window.removeEventListener('scroll', handleScroll);
      }, []);

      // Animated counters using Intersection Observer
      useEffect(() => {
        const observers = stepRefs.current.map((stepRef, idx) => {
          if (!stepRef) return null;

          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting && !hasAnimated[idx]) {
                  // Mark as animated
                  setHasAnimated(prev => {
                    const newState = [...prev];
                    newState[idx] = true;
                    return newState;
                  });

                  // Animate counter
                  const targetNumber = journeySteps[idx].targetNumber;
                  const duration = 1500; // 1.5 seconds
                  const steps = 60;
                  const increment = targetNumber / steps;
                  let current = 0;

                  const timer = setInterval(() => {
                    current += increment;
                    if (current >= targetNumber) {
                      current = targetNumber;
                      clearInterval(timer);
                    }
                    setCounters(prev => {
                      const newCounters = [...prev];
                      newCounters[idx] = Math.floor(current);
                      return newCounters;
                    });
                  }, duration / steps);
                }
              });
            },
            { threshold: 0.5 }
          );

          observer.observe(stepRef);
          return observer;
        });

        return () => {
          observers.forEach(observer => observer?.disconnect());
        };
      }, [hasAnimated, journeySteps]);

      return (
        <section id="whyus-journey" className="journey-timeline-section" ref={sectionRef}>
          <div className="journey-container">
            <header className="journey-header">
              <span className="journey-label">Our Process</span>
              <h2 className="journey-main-heading">{heading}</h2>
              {subheading && <p className="journey-subheading">{subheading}</p>}
            </header>

            <div className="journey-timeline-track">
              {/* Minimal progress line */}
              <div 
                className="timeline-line-minimal" 
                style={{ 
                  '--progress': `${scrollProgress * 100}%`
                }}
                aria-hidden="true"
              />
              
              {journeySteps.map((step, idx) => (
                <div 
                  key={idx} 
                  ref={el => stepRefs.current[idx] = el}
                  className={`journey-step journey-step--${step.side} ${activeStep === idx ? 'journey-step--active' : ''}`}
                  role="listitem"
                  aria-label={`Step ${idx + 1}: ${step.phase}`}
                >
                  <div className="journey-content">
                    <span className="journey-step-number">{journeyLabels[idx] || String(idx + 1).padStart(2, '0')}</span>
                    <h3 className="journey-title">{step.title}</h3>
                    <p className="journey-desc">{step.desc}</p>
                    
                    <div className="journey-metric" data-animated={hasAnimated[idx]}>
                      <div className="journey-metric-value">
                        {hasAnimated[idx] && counters[idx] > 0 ? (
                          <>{counters[idx]}{step.unit}</>
                        ) : (
                          <>{step.metricText}{step.unit}</>
                        )}
                      </div>
                      <div className="journey-metric-label">{step.metricLabel}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="journey-cta">
              <a href="#contact" className="journey-cta-button">
                Get Started
                <span className="cta-arrow">→</span>
              </a>
            </div>
          </div>
        </section>
      );
    }

    // Pricing Modal Component
    function PricingModal({ plans, onClose, serviceName = 'Service' }) {
      const modalRef = useRef(null);
      const [currency] = useState('USD');

      useEffect(() => {
        const handleEscape = (e) => {
          if (e.key === 'Escape') onClose();
        };
        
        const handleClickOutside = (e) => {
          if (modalRef.current && e.target === modalRef.current) onClose();
        };

        document.addEventListener('keydown', handleEscape);
        document.addEventListener('click', handleClickOutside);
        
        // Focus trap
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements?.length) {
          focusableElements[0].focus();
        }

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        return () => {
          document.removeEventListener('keydown', handleEscape);
          document.removeEventListener('click', handleClickOutside);
          document.body.style.overflow = '';
        };
      }, [onClose]);

      const formatPrice = (amount) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(amount);
      };

      return (
        <div ref={modalRef} className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="pricing-modal liquid-glass">
            <button 
              onClick={onClose}
              className="modal-close"
              aria-label="Close pricing modal"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 id="modal-title" className="modal-title">{serviceName} Pricing</h2>
            <p className="modal-subtitle">Choose the plan that fits your needs</p>

            <div className="modal-plans-grid">
              {plans.map((plan, idx) => (
                <article key={idx} className={`modal-plan-card liquid-card ${plan.popular ? 'plan-popular' : ''}`}>
                  {plan.popular && <div className="plan-badge">Most Popular</div>}
                  
                  <h3 className="plan-name">{plan.name}</h3>
                  
                  <div className="plan-pricing">
                    {plan.setup > 0 && (
                      <div className="plan-setup">
                        {formatPrice(plan.setup)} <span className="price-label">setup</span>
                      </div>
                    )}
                    <div className="plan-monthly">
                      {formatPrice(plan.monthly)} <span className="price-label">/month</span>
                    </div>
                    {plan.annual && (
                      <div className="plan-annual">
                        or {formatPrice(plan.annual)}/year <span className="savings">(save {Math.round((1 - plan.annual / (plan.monthly * 12)) * 100)}%)</span>
                      </div>
                    )}
                  </div>

                  <ul className="plan-features">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2"><Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--primary)' }} /><span>{feature}</span></li>
                    ))}
                  </ul>

                  <a 
                    href="#contact"
                    onClick={(e) => {
                      if (window.track) window.track('pricing_cta_click', { plan: plan.name, service: serviceName });
                      onClose();
                    }}
                    className="plan-cta-button"
                  >
                    {plan.cta || 'Get started'}
                  </a>
                </article>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Websites Service Page
    // Website Redesign Service Page - Clean & Structured
    function WebsitesPage() {
      const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
      const heroRef = useRef(null);
      const data = document.getElementById('websites-data');
      const heading = data?.dataset.heading || 'Website Redesign';
      const subheading = data?.dataset.subheading || '';
      const plans = data ? JSON.parse(data.dataset.plans || '[]') : [];

      useEffect(() => {
        const handleMove = (e) => {
          if (heroRef.current) {
            const rect = heroRef.current.getBoundingClientRect();
            setMousePos({
              x: ((e.clientX - rect.left) / rect.width - 0.5) * 25,
              y: ((e.clientY - rect.top) / rect.height - 0.5) * 25
            });
          }
        };
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
      }, []);

      return (
        <div className="min-h-screen">
          <FloatingNav />
          
          {/* Hero Section — Centered headline + carousel */}
          <section ref={heroRef} className="service-page-hero relative overflow-hidden pt-32 pb-16">
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="blob absolute w-96 h-96 rounded-full" 
                   style={{ background: 'var(--mesh-tint)', top: '15%', left: '5%' }} />
              <div className="blob absolute w-80 h-80 rounded-full" 
                   style={{ background: 'var(--mesh-secondary)', bottom: '10%', right: '10%', animationDelay: '2s' }} />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
              {/* Centered headline */}
              <div className="text-center space-y-6 stagger-item mb-16">
                <h1 className="text-5xl md:text-7xl font-bold leading-tight" style={{ fontFamily: "'Geist', sans-serif" }}>
                  Your Brand,
                  <span className="block mt-2" style={{ color: 'var(--primary)' }}>
                    Online
                  </span>
                </h1>

                <p className="text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>
                  {subheading}
                </p>

                <div className="flex gap-4 justify-center pt-2">
                  <a 
                    href="#pricing"
                    className="glow-on-hover relative px-8 py-4 rounded-full text-white font-semibold text-lg inline-flex items-center transition-all duration-300 hover:translate-y-[-1px]"
                    style={{ 
                      background: 'var(--primary)',
                      boxShadow: 'inset 0 0 0 5px rgba(255, 255, 255, 0.18)'
                    }}
                  >
                    View Pricing
                  </a>
                  <a href="#contact" className="btn-glass px-8 py-4 text-lg inline-flex items-center transition-all duration-300 hover:translate-y-[-1px]">
                    Contact Us
                  </a>
                </div>
              </div>

              {/* 3D Cylindrical Carousel */}
              <div className="cylinder-wrap">
                <div className="cylinder-scene">
                  <div className="cylinder-ring">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i, idx) => (
                      <div key={idx} className="cylinder-card" style={{ '--i': idx }}>
                        <div className="cf-phone">
                          <div className="cf-phone-notch" />
                          <div className="cf-screen">
                            <div className="cf-nav"><div className="cf-hamburger" /><div className="cf-logo-dot" /></div>
                            <div className="cf-hero-img" />
                            <div className="cf-body">
                              <div className="cf-title-line" />
                              <div className="cf-sub-line" />
                              <div className="cf-cta-pill" />
                            </div>
                            <div className="cf-cards-row"><div className="cf-mini-card" /><div className="cf-mini-card" /></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* What You Get */}
          <section className="py-28 relative overflow-hidden" style={{ background: 'var(--bg)' }}>
            <div className="max-w-6xl mx-auto px-6 relative z-10">
              
              {/* Two-column layout: left text, right mockup visual */}
              <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
                {/* Left: message */}
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--primary)' }}>
                    What you get
                  </p>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Geist', sans-serif" }}>
                    A website that actually
                    <span className="block" style={{ color: 'var(--primary)' }}>represents you</span>
                  </h2>
                  <p className="text-lg mb-4" style={{ color: 'var(--muted)', lineHeight: '1.7' }}>
                    Not a template with your logo slapped on. A custom-built space where people come to see your brand, understand your story, and trust what you offer.
                  </p>
                  <p className="text-lg" style={{ color: 'var(--muted)', lineHeight: '1.7' }}>
                    Every detail is intentional. The colors, the layout, the flow. All designed to feel like <em>you</em>.
                  </p>
                </div>

                {/* Right: browser mockup */}
                <div className="wyg-brand-visual">
                  <div className="wyg-brand-browser">
                    <div className="wyg-brand-browser-bar">
                      <span className="wdot wdot-r" /><span className="wdot wdot-y" /><span className="wdot wdot-g" />
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

              {/* Three value points */}
              <div className="grid md:grid-cols-3 gap-10">
                <div className="wyg-value-card">
                  <div className="wyg-value-num" style={{ color: 'var(--primary)' }}>01</div>
                  <h3 className="text-lg font-semibold mb-2">Designed for your brand</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    Every layout, color, and interaction starts from who you are. No recycled templates, no generic pages.
                  </p>
                </div>
                <div className="wyg-value-card">
                  <div className="wyg-value-num" style={{ color: 'var(--primary)' }}>02</div>
                  <h3 className="text-lg font-semibold mb-2">Built to be visited</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    Fast, smooth, and structured so people actually enjoy being on your site and keep coming back.
                  </p>
                </div>
                <div className="wyg-value-card">
                  <div className="wyg-value-num" style={{ color: 'var(--primary)' }}>03</div>
                  <h3 className="text-lg font-semibold mb-2">Yours to keep</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    Clean code, full ownership, no page-builder lock-in. A site that grows with your business.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Design Process Showcase */}
          <WebsitesProcess />

          {/* Pricing Preview - Websites Page */}
          <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(138, 61, 230, 0.05) 0%, rgba(56, 189, 248, 0.05) 100%)' }}></div>
            {/* Masked Grid Patch - Purple accent */}
            <div className="masked-grid masked-grid-purple masked-grid-top-right" aria-hidden="true"></div>
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Geist', sans-serif" }}>
                  Simple, Transparent Pricing
                </h2>
                <p className="text-xl" style={{ color: 'var(--muted)' }}>
                  Choose the plan that fits your needs
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {plans.map((plan, idx) => (
                  <div key={idx} className={`liquid-card p-8 hover-elastic ${plan.popular ? 'plan-popular-inline' : ''}`} style={{ position: 'relative', overflow: 'visible' }}>
                    {plan.popular && (
                      <div 
                        className="pricing-badge"
                        style={{ 
                          position: 'absolute',
                          top: '0px',
                          left: '50%',
                          transform: 'translateX(-50%) translateY(-50%)',
                          background: 'linear-gradient(135deg, #8A3DE6, #38bdf8)',
                          color: 'white',
                          padding: '0.35rem 1rem',
                          borderRadius: '16px',
                          fontSize: '0.6875rem',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          whiteSpace: 'nowrap',
                          boxShadow: '0 2px 8px rgba(138, 61, 230, 0.3)'
                        }}
                        aria-label="Recommended plan"
                      >
                        Most Popular
                      </div>
                    )}
                    <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Geist', sans-serif" }}>{plan.name}</h3>
                    <div className="mb-6">
                      <div className="text-4xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--primary)' }}>
                        ${plan.monthly}
                        <span className="text-lg font-normal" style={{ color: 'var(--muted)' }}>/mo</span>
                      </div>
                      {plan.setup > 0 && (
                        <div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                          ${plan.setup} setup
                        </div>
                      )}
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.slice(0, 3).map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2" style={{ color: 'var(--text)' }}>
                          <Check className="w-5 h-5" style={{ color: 'var(--success)' }} />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <a 
                      href="#contact"
                      className="w-full py-3 rounded-full font-semibold transition-all inline-flex items-center justify-center"
                      style={{ 
                        background: plan.popular ? 'var(--primary)' : 'rgba(138, 61, 230, 0.1)',
                        color: plan.popular ? 'white' : 'var(--primary)',
                        border: plan.popular ? 'none' : '1px solid var(--glass-border)'
                      }}
                    >
                      Get Started
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <Contact />
          <Footer />
        </div>
      );
    }

    // AI Agents Service Page - Futuristic & Dynamic
    function AIAgentsPage() {
      const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
      const heroRef = useRef(null);
      const data = document.getElementById('ai-data');
      const heading = data?.dataset.heading || 'AI Agent Development';
      const subheading = data?.dataset.subheading || '';
      const plans = data ? JSON.parse(data.dataset.plans || '[]') : [];

      useEffect(() => {
        const handleMove = (e) => {
          if (heroRef.current) {
            const rect = heroRef.current.getBoundingClientRect();
            setMousePos({
              x: ((e.clientX - rect.left) / rect.width - 0.5) * 30,
              y: ((e.clientY - rect.top) / rect.height - 0.5) * 30
            });
          }
        };
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
      }, []);

      return (
        <div className="min-h-screen">
          <FloatingNav />
          
          {/* Hero Section */}
          <section ref={heroRef} className="service-page-hero min-h-screen flex items-center relative overflow-hidden pt-24">
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="blob absolute w-96 h-96 rounded-full" 
                   style={{ background: 'var(--accent-blue)', top: '10%', right: '5%', opacity: '0.3' }} />
              <div className="blob absolute w-80 h-80 rounded-full" 
                   style={{ background: 'var(--mesh-tint)', bottom: '15%', left: '10%', animationDelay: '2s' }} />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Left: Content */}
                <div className="space-y-8 stagger-item">
                  <h1 className="text-5xl md:text-7xl font-bold leading-tight" style={{ fontFamily: "'Geist', sans-serif" }}>
                    AI Agent
                    <span className="block mt-2" style={{ color: 'var(--accent-blue)' }}>
                      Development
                    </span>
                  </h1>

                  <p className="text-xl leading-relaxed max-w-lg" style={{ color: 'var(--muted)' }}>
                    {subheading}
                  </p>

                  <div className="flex gap-4">
                    <a 
                      href="#pricing"
                      className="glow-on-hover relative px-8 py-4 rounded-full text-white font-semibold text-lg inline-flex items-center transition-all duration-300 hover:translate-y-[-1px]"
                      style={{ 
                        background: 'var(--primary)',
                        boxShadow: 'inset 0 0 0 5px rgba(255, 255, 255, 0.18)'
                      }}
                    >
                      View Pricing
                    </a>
                    <a href="#contact" className="btn-glass px-8 py-4 text-lg inline-flex items-center transition-all duration-300 hover:translate-y-[-1px]">
                      Book Demo
                    </a>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-6 pt-8">
                    <div className="text-center stagger-item" style={{ animationDelay: '0.3s' }}>
                      <div className="text-3xl font-bold" style={{ color: 'var(--accent-blue)', fontFamily: "'Space Grotesk', sans-serif" }}>24/7</div>
                      <div className="text-sm" style={{ color: 'var(--muted)' }}>uptime</div>
                    </div>
                    <div className="text-center stagger-item" style={{ animationDelay: '0.4s' }}>
                      <div className="text-3xl font-bold" style={{ color: 'var(--accent-blue)', fontFamily: "'Space Grotesk', sans-serif" }}>10K+</div>
                      <div className="text-sm" style={{ color: 'var(--muted)' }}>queries/day</div>
                    </div>
                    <div className="text-center stagger-item" style={{ animationDelay: '0.5s' }}>
                      <div className="text-3xl font-bold" style={{ color: 'var(--accent-blue)', fontFamily: "'Space Grotesk', sans-serif" }}>95%</div>
                      <div className="text-sm" style={{ color: 'var(--muted)' }}>accuracy</div>
                    </div>
                  </div>
                </div>

                {/* Right: AI Flow Visual */}
                <div className="stagger-item hidden md:flex items-center justify-center" style={{ animationDelay: '0.15s' }}>
                  <AIHeroFlowVisual />
                </div>
              </div>
            </div>
          </section>

          {/* Features Section - Orb + Floating Cards */}
          <section className="relative overflow-hidden" style={{ background: 'var(--bg)' }}>
            {/* Ambient background blobs */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl" 
                   style={{ background: 'radial-gradient(circle, var(--accent-blue) 0%, transparent 70%)' }} />
              <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl" 
                   style={{ background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)' }} />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
              {/* Section Header */}
              <div className="text-center pt-24 pb-8 stagger-item">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" 
                     style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent-blue)' }} />
                  <span className="text-sm font-semibold" style={{ color: 'var(--accent-blue)' }}>Intelligent Automation</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: "'Geist', sans-serif" }}>
                  What Your AI Can Do
                </h2>
                <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>
                  From customer support to data analysis?powerful capabilities that work 24/7
                </p>
              </div>

              {/* Orb + Orbit Cards Layout */}
              <div className="ai-orb-section">
                {/* Dot Grid Background - sits behind everything */}
                <div className="ai-dot-grid" aria-hidden="true"></div>
                
                {/* Central Fluid Orb */}
                <div className="ai-fluid-orb" aria-hidden="true"></div>

                {/* Orbit Cards - inline icon + metric bubble design */}
                <div className="ai-orb-cards">
                  <div className="ai-orb-card">
                    <div className="ai-orb-card-header">
                      <Zap className="ai-orb-card-icon" />
                      <h3>Automate Workflows</h3>
                    </div>
                    <p>Let your AI handle repetitive tasks so you can focus on what matters.</p>
                    <div className="ai-orb-metric-bubble">
                      <span className="ai-orb-metric-value">12h</span>
                      <span className="ai-orb-metric-label">saved / week</span>
                    </div>
                  </div>

                  <div className="ai-orb-card">
                    <div className="ai-orb-card-header">
                      <PenTool className="ai-orb-card-icon" />
                      <h3>Generate Content</h3>
                    </div>
                    <p>Draft posts, emails, and ideas in seconds instead of hours.</p>
                    <div className="ai-orb-metric-bubble">
                      <span className="ai-orb-metric-value">3x</span>
                      <span className="ai-orb-metric-label">faster</span>
                    </div>
                  </div>

                  <div className="ai-orb-card">
                    <div className="ai-orb-card-header">
                      <MessageCircle className="ai-orb-card-icon" />
                      <h3>Respond to Clients</h3>
                    </div>
                    <p>Instantly answer common questions with a personalized AI agent.</p>
                    <div className="ai-orb-metric-bubble">
                      <span className="ai-orb-metric-value">95%</span>
                      <span className="ai-orb-metric-label">FAQs auto</span>
                    </div>
                  </div>

                  <div className="ai-orb-card">
                    <div className="ai-orb-card-header">
                      <BarChart3 className="ai-orb-card-icon" />
                      <h3>Understand Data</h3>
                    </div>
                    <p>Summarize, explain, and explore your data conversationally.</p>
                    <div className="ai-orb-metric-bubble">
                      <span className="ai-orb-metric-value">5x</span>
                      <span className="ai-orb-metric-label">faster insights</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom CTA - Pill shaped */}
              <div className="text-center pb-24 stagger-item" style={{ animationDelay: '0.7s' }}>
                <a 
                  href="#pricing"
                  className="inline-flex items-center gap-3 px-10 py-5 font-bold text-lg transition-all hover:translate-y-[-1px]"
                  style={{ 
                    background: 'linear-gradient(135deg, var(--accent-blue) 0%, var(--primary) 100%)', 
                    color: 'white',
                    boxShadow: 'inset 0 0 0 5px rgba(255, 255, 255, 0.18)',
                    borderRadius: '9999px'
                  }}
                >
                  Build Your AI Agent
                  <ArrowRight className="w-6 h-6" />
                </a>
                <p className="mt-4 text-sm" style={{ color: 'var(--muted)' }}>
                  Start with a free consultation ? No commitment required
                </p>
              </div>
            </div>
          </section>

          {/* Pricing Preview - AI Page */}
          <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.05) 0%, rgba(138, 61, 230, 0.05) 100%)' }}></div>
            {/* Masked Grid Patch - Blue accent */}
            <div className="masked-grid masked-grid-blue masked-grid-bottom-left" aria-hidden="true"></div>
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Geist', sans-serif" }}>
                  Flexible AI Pricing
                </h2>
                <p className="text-xl" style={{ color: 'var(--muted)' }}>
                  Scale as you grow with transparent pricing
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {plans.map((plan, idx) => (
                  <div key={idx} className={`liquid-card p-8 hover-elastic ${plan.popular ? 'plan-popular-inline' : ''}`} style={{ position: 'relative', overflow: 'visible' }}>
                    {plan.popular && (
                      <div 
                        className="pricing-badge"
                        style={{ 
                          position: 'absolute',
                          top: '0px',
                          left: '50%',
                          transform: 'translateX(-50%) translateY(-50%)',
                          background: 'linear-gradient(135deg, #38bdf8, #8A3DE6)',
                          color: 'white',
                          padding: '0.35rem 1rem',
                          borderRadius: '16px',
                          fontSize: '0.6875rem',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          whiteSpace: 'nowrap',
                          boxShadow: '0 2px 8px rgba(56, 189, 248, 0.3)'
                        }}
                        aria-label="Recommended plan"
                      >
                        Most Popular
                      </div>
                    )}
                    <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Geist', sans-serif" }}>{plan.name}</h3>
                    <div className="mb-6">
                      <div className="text-4xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--accent-blue)' }}>
                        ${plan.monthly}
                        <span className="text-lg font-normal" style={{ color: 'var(--muted)' }}>/mo</span>
                      </div>
                      {plan.setup > 0 && (
                        <div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                          ${plan.setup} setup
                        </div>
                      )}
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.slice(0, 3).map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2" style={{ color: 'var(--text)' }}>
                          <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--success)' }} />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <a 
                      href="#contact"
                      className="w-full py-3 rounded-full font-semibold transition-all inline-flex items-center justify-center"
                      style={{ 
                        background: plan.popular ? 'var(--primary)' : 'rgba(56, 189, 248, 0.1)',
                        color: plan.popular ? 'white' : 'var(--accent-blue)',
                        border: plan.popular ? 'none' : '1px solid var(--glass-border)'
                      }}
                    >
                      Get Started
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <Contact />
          <Footer />
        </div>
      );
    }

    // Social Showcase Carousel - 3D Horizontal Reel Display
    function SocialShowcaseCarousel() {
      const trackRef = useRef(null);
      const [centerIndex, setCenterIndex] = useState(0);
      const [isDragging, setIsDragging] = useState(false);
      const dragStartX = useRef(0);
      const dragStartY = useRef(0);
      const scrollStartX = useRef(0);
      const isHorizontalDrag = useRef(false);

      // Placeholder reels data - replace with real content later
      const reels = [
        { id: 1, platform: 'TikTok', username: '@rootlabs', caption: 'How we redesigned this website in 48 hours ??', likes: '12.4K', comments: '234' },
        { id: 2, platform: 'Instagram', username: '@rootlabs.studio', caption: 'Behind the scenes of our AI workflow ?', likes: '8.7K', comments: '156' },
        { id: 3, platform: 'TikTok', username: '@rootlabs', caption: 'Client reaction to their new site ??', likes: '24.1K', comments: '412' },
        { id: 4, platform: 'Instagram', username: '@rootlabs.studio', caption: 'Design trends you need to know in 2025', likes: '15.2K', comments: '287' },
        { id: 5, platform: 'TikTok', username: '@rootlabs', caption: 'POV: Your website finally converts ??', likes: '31.8K', comments: '523' },
        { id: 6, platform: 'Instagram', username: '@rootlabs.studio', caption: 'Speed run: Landing page in 2 hours', likes: '19.6K', comments: '341' },
        { id: 7, platform: 'TikTok', username: '@rootlabs', caption: 'Why your website is losing customers', likes: '42.3K', comments: '678' },
        { id: 8, platform: 'Instagram', username: '@rootlabs.studio', caption: 'The secret to 10x engagement ??', likes: '11.9K', comments: '198' },
      ];

      // Calculate 3D transforms based on position relative to center
      const getCardTransform = (index) => {
        const offset = index - centerIndex;
        const absOffset = Math.abs(offset);
        
        // Rotation: cards rotate toward/away from viewer - gentler
        const rotateY = offset * -6;
        
        // Scale: center slightly larger, sides smaller
        const scale = absOffset === 0 ? 1.02 : Math.max(0.88, 1 - absOffset * 0.05);
        
        // Vertical curve: subtle arc effect
        const translateY = absOffset * absOffset * 3;
        
        // Z-depth for 3D effect
        const translateZ = absOffset === 0 ? 10 : -absOffset * 10;
        
        // Opacity: gentle fade for distant cards
        const opacity = Math.max(0.6, 1 - absOffset * 0.12);

        return {
          transform: `
            perspective(1200px)
            rotateY(${rotateY}deg)
            scale(${scale})
            translateY(${translateY}px)
            translateZ(${translateZ}px)
          `,
          opacity,
          zIndex: 10 - absOffset,
        };
      };

      // Update center card on scroll
      useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const updateCenterCard = () => {
          const cards = track.querySelectorAll('.social-reel-card');
          const trackRect = track.getBoundingClientRect();
          const trackCenter = trackRect.left + trackRect.width / 2;

          let closestIndex = 0;
          let closestDistance = Infinity;

          cards.forEach((card, index) => {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.left + cardRect.width / 2;
            const distance = Math.abs(cardCenter - trackCenter);

            if (distance < closestDistance) {
              closestDistance = distance;
              closestIndex = index;
            }
          });

          setCenterIndex(closestIndex);
        };

        track.addEventListener('scroll', updateCenterCard, { passive: true });
        updateCenterCard();

        return () => track.removeEventListener('scroll', updateCenterCard);
      }, []);

      // Arrow navigation
      const scrollToIndex = (index) => {
        const track = trackRef.current;
        if (!track) return;
        const cards = track.querySelectorAll('.social-reel-card');
        const targetIndex = Math.max(0, Math.min(index, cards.length - 1));
        if (cards[targetIndex]) {
          cards[targetIndex].scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest'
          });
        }
      };

      const handlePrev = () => scrollToIndex(centerIndex - 1);
      const handleNext = () => scrollToIndex(centerIndex + 1);

      // Mouse drag handling - only horizontal
      const handleMouseDown = (e) => {
        setIsDragging(true);
        isHorizontalDrag.current = false;
        dragStartX.current = e.clientX;
        dragStartY.current = e.clientY;
        scrollStartX.current = trackRef.current?.scrollLeft || 0;
      };

      const handleMouseMove = (e) => {
        if (!isDragging || !trackRef.current) return;
        
        const dx = e.clientX - dragStartX.current;
        const dy = e.clientY - dragStartY.current;
        
        // Determine drag direction on first significant move
        if (!isHorizontalDrag.current && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
          isHorizontalDrag.current = Math.abs(dx) > Math.abs(dy);
        }
        
        // Only scroll horizontally if it's a horizontal drag
        if (isHorizontalDrag.current) {
          trackRef.current.scrollLeft = scrollStartX.current - dx;
        }
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        isHorizontalDrag.current = false;
      };

      useEffect(() => {
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseleave', handleMouseUp);
        return () => {
          document.removeEventListener('mouseup', handleMouseUp);
          document.removeEventListener('mouseleave', handleMouseUp);
        };
      }, []);

      return (
        <section className="social-carousel-section" aria-label="Social media showcase carousel">
          <div className="social-carousel-header">
            <h2 className="social-carousel-title">Our Content in Action</h2>
            <p className="social-carousel-subtitle">See what we create for brands like yours</p>
          </div>

          <div className="social-carousel-wrapper">
            {/* Edge Fades */}
            <div className="social-carousel-fade-left" aria-hidden="true" />
            <div className="social-carousel-fade-right" aria-hidden="true" />

            {/* Arrow Controls */}
            <button 
              className="social-carousel-arrow social-carousel-arrow-left"
              onClick={handlePrev}
              aria-label="Previous reel"
              disabled={centerIndex === 0}
              style={{ opacity: centerIndex === 0 ? 0.3 : undefined }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button 
              className="social-carousel-arrow social-carousel-arrow-right"
              onClick={handleNext}
              aria-label="Next reel"
              disabled={centerIndex === reels.length - 1}
              style={{ opacity: centerIndex === reels.length - 1 ? 0.3 : undefined }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Carousel Track */}
            <div
              ref={trackRef}
              className="social-carousel-track"
              role="region"
              aria-label="Scrollable content carousel"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
            >
              {reels.map((reel, index) => {
                const isCenter = index === centerIndex;
                const style = getCardTransform(index);

                return (
                  <article
                    key={reel.id}
                    className={`social-reel-card ${isCenter ? 'is-center' : ''}`}
                    style={style}
                    aria-label={`${reel.platform} reel by ${reel.username}`}
                  >
                    <div className="social-reel-card-inner">
                      <div className="social-reel-content">
                        {/* Clean Minimal Placeholder */}
                        <div className="social-reel-placeholder" aria-hidden="true">
                          {/* Subtle play icon in center */}
                          <div style={{
                            position: 'absolute',
                            top: '45%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            opacity: 0.15
                          }}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                          {/* "Reel Preview" text */}
                          <div style={{
                            position: 'absolute',
                            top: '55%',
                            left: '50%',
                            transform: 'translate(-50%, 0)',
                            fontSize: '0.625rem',
                            fontWeight: 500,
                            color: 'rgba(255, 255, 255, 0.25)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em'
                          }}>
                            Reel Preview
                          </div>
                        </div>

                        {/* Platform Badge */}
                        <div className="social-reel-platform">{reel.platform}</div>

                        {/* Play Indicator (shown when not center) */}
                        <div className="social-reel-play-indicator" aria-hidden="true">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>

                        {/* Overlay with user info */}
                        <div className="social-reel-overlay">
                          <div className="social-reel-username">{reel.username}</div>
                          <div className="social-reel-caption">{reel.caption}</div>
                        </div>

                        {/* Side Action Buttons */}
                        <div className="social-reel-actions" aria-hidden="true">
                          <div>
                            <button className="social-reel-action-btn" tabIndex={-1}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                              </svg>
                            </button>
                            <div className="social-reel-action-count">{reel.likes}</div>
                          </div>
                          <div>
                            <button className="social-reel-action-btn" tabIndex={-1}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"/>
                              </svg>
                            </button>
                            <div className="social-reel-action-count">{reel.comments}</div>
                          </div>
                          <div>
                            <button className="social-reel-action-btn" tabIndex={-1}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    // AI Hero Flow Visual Component - Input -> AI -> Output
    function AIHeroFlowVisual() {
      return (
        <div className="ai-hero-flow" aria-label="AI transforms messy input into clean output">
          {/* SVG Connector Lines */}
          <svg className="ai-hero-flow-connector" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="connectorGrad1" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#8A3DE6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.6" />
              </linearGradient>
              <linearGradient id="connectorGrad2" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#8A3DE6" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            {/* Left to Center connector */}
            <path 
              className="ai-connector-path ai-connector-path--1"
              d="M 60 100 Q 110 80, 160 100" 
              fill="none" 
              stroke="url(#connectorGrad1)" 
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Center to Right connector */}
            <path 
              className="ai-connector-path ai-connector-path--2"
              d="M 240 100 Q 290 120, 340 100" 
              fill="none" 
              stroke="url(#connectorGrad2)" 
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          <div className="ai-hero-flow-nodes">
            {/* Left Node: Raw Input (Tangled Yarn) */}
            <div className="ai-hero-flow-node ai-hero-flow-node--input">
              <svg className="ai-yarn" viewBox="0 0 60 60" fill="none">
                <path d="M10 30 Q25 10, 40 25 T55 30" stroke="#8A3DE6" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
                <path d="M15 25 Q30 40, 45 20" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                <path d="M8 35 Q20 45, 35 30 T50 35" stroke="#8A3DE6" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
                <path d="M12 40 Q28 20, 48 40" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
                <path d="M20 15 Q35 35, 50 20" stroke="#8A3DE6" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                <path d="M5 28 Q22 50, 42 28" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
                <path d="M18 45 Q33 25, 52 42" stroke="#8A3DE6" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
                <path d="M25 12 Q40 30, 55 18" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
                <path d="M8 22 Q25 38, 45 22" stroke="#8A3DE6" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                <path d="M30 48 Q45 30, 58 45" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
              </svg>
            </div>

            {/* Center Node: AI Pulse Orb */}
            <div className="ai-hero-flow-node ai-hero-flow-node--ai">
              <div className="ai-pulse-orb">
                <div className="ai-pulse-orb__ring ai-pulse-orb__ring--1"></div>
                <div className="ai-pulse-orb__ring ai-pulse-orb__ring--2"></div>
                <div className="ai-pulse-orb__core"></div>
              </div>
            </div>

            {/* Right Node: Clean Output (Bullet Lines) */}
            <div className="ai-hero-flow-node ai-hero-flow-node--output">
              <div className="ai-output-lines">
                <div className="ai-output-line ai-output-line--1">
                  <span className="ai-output-bullet"></span>
                  <span className="ai-output-bar"></span>
                </div>
                <div className="ai-output-line ai-output-line--2">
                  <span className="ai-output-bullet"></span>
                  <span className="ai-output-bar ai-output-bar--accent"></span>
                </div>
                <div className="ai-output-line ai-output-line--3">
                  <span className="ai-output-bullet"></span>
                  <span className="ai-output-bar"></span>
                </div>
                <div className="ai-output-line ai-output-line--4">
                  <span className="ai-output-bullet"></span>
                  <span className="ai-output-bar"></span>
                </div>
                <div className="ai-output-line ai-output-line--5">
                  <span className="ai-output-bullet"></span>
                  <span className="ai-output-bar ai-output-bar--short"></span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: Simple arrows between stacked nodes */}
          <div className="ai-hero-flow-mobile-arrows">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </div>
      );
    }

    // Engagement Tiles Component
    function EngagementTiles() {
      const [isLiked, setIsLiked] = useState(false);
      const [pulseHeart, setPulseHeart] = useState(false);
      const [neighborReact, setNeighborReact] = useState(false);
      const [flashComment, setFlashComment] = useState(false);
      const [flashSend, setFlashSend] = useState(false);

      const tiles = [
        { id: 'like', icon: Heart, label: 'Like' },
        { id: 'comment', icon: MessageCircle, label: 'Comment' },
        { id: 'send', icon: Send, label: 'Send' }
      ];

      const handleLikeClick = () => {
        const newLiked = !isLiked;
        setIsLiked(newLiked);
        if (newLiked) {
          setPulseHeart(true);
          setNeighborReact(true);
          setTimeout(() => setPulseHeart(false), 350);
          setTimeout(() => setNeighborReact(false), 250);
        }
      };

      const handleCommentClick = () => {
        setFlashComment(true);
        setTimeout(() => setFlashComment(false), 300);
      };

      const handleSendClick = () => {
        setFlashSend(true);
        setTimeout(() => setFlashSend(false), 300);
      };

      const getClickHandler = (id) => {
        if (id === 'like') return handleLikeClick;
        if (id === 'comment') return handleCommentClick;
        return handleSendClick;
      };

      return (
        <div className="engagement-tiles" aria-label="Engagement actions">
          {tiles.map((tile, idx) => {
            const Icon = tile.icon;
            const isLikeTile = tile.id === 'like';
            const isActive = isLikeTile && isLiked;
            const isNeighbor = idx === 1 || idx === 2;
            const shouldReact = isNeighbor && neighborReact;
            const shouldFlash = (tile.id === 'comment' && flashComment) || (tile.id === 'send' && flashSend);
            
            const wrapClass = `engagement-tile-wrap engagement-tile-wrap--${tile.id}${shouldReact ? ' is-reacting' : ''}`;
            const tileClass = `engagement-tile engagement-tile--${tile.id}${pulseHeart && isLikeTile ? ' is-pulsing' : ''}${shouldFlash ? ' is-flashing' : ''}`;
            
            return (
              <div key={tile.id} className={wrapClass}>
                <button
                  type="button"
                  className={tileClass}
                  onClick={getClickHandler(tile.id)}
                  aria-label={tile.label}
                  aria-pressed={isLikeTile ? isLiked : undefined}
                >
                  <Icon
                    size={36}
                    className={`engagement-tile__icon${isActive ? ' is-active' : ''}`}
                    strokeWidth={2}
                  />
                </button>
              </div>
            );
          })}
        </div>
      );
    }

    // Social Media Service Page - Fluid & Organic
    function SocialPage() {
      const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
      const heroRef = useRef(null);
      const data = document.getElementById('social-data');
      
      if (!data) {
        return <div style={{ padding: '100px', textAlign: 'center' }}>
          <h1>Loading...</h1>
        </div>;
      }
      
      const heading = data?.dataset.heading || 'Social Media Management';
      const subheading = data?.dataset.subheading || '';
      
      let plans = [];
      try {
        plans = JSON.parse(data.dataset.plans || '[]');
      } catch (error) {
        console.error('Error parsing plans:', error);
      }

      useEffect(() => {
        const handleMove = (e) => {
          if (heroRef.current) {
            const rect = heroRef.current.getBoundingClientRect();
            setMousePos({
              x: ((e.clientX - rect.left) / rect.width - 0.5) * 35,
              y: ((e.clientY - rect.top) / rect.height - 0.5) * 35
            });
          }
        };
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
      }, []);

      return (
        <div className="min-h-screen">
          <FloatingNav />
          
          {/* Hero Section */}
          <section ref={heroRef} className="service-page-hero min-h-screen flex items-center relative overflow-hidden pt-24">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Left: Content */}
                <div className="space-y-8 stagger-item">
                  <h1 className="text-5xl md:text-7xl font-bold leading-tight" style={{ fontFamily: "'Geist', sans-serif" }}>
                    Social Media
                    <span className="block mt-2" style={{ color: '#FF7A2D' }}>
                      Management
                    </span>
                  </h1>

                  <p className="text-xl leading-relaxed max-w-lg" style={{ color: 'var(--muted)' }}>
                    {subheading}
                  </p>

                  <div className="flex gap-4">
                    <a 
                      href="#pricing"
                      className="glow-on-hover relative px-8 py-4 rounded-full text-white font-semibold text-lg inline-flex items-center transition-all duration-300 hover:translate-y-[-1px]"
                      style={{ 
                        background: 'linear-gradient(135deg, #FF7A2D 0%, var(--primary) 100%)',
                        boxShadow: 'inset 0 0 0 5px rgba(255, 255, 255, 0.18)'
                      }}
                    >
                      View Pricing
                    </a>
                    <a href="#contact" className="btn-glass px-8 py-4 text-lg inline-flex items-center transition-all duration-300 hover:translate-y-[-1px]">
                      Get Started
                    </a>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-6 pt-8">
                    <div className="text-center stagger-item" style={{ animationDelay: '0.3s' }}>
                      <div className="text-3xl font-bold" style={{ color: '#FF7A2D', fontFamily: "'Space Grotesk', sans-serif" }}>2</div>
                      <div className="text-sm" style={{ color: 'var(--muted)' }}>videos/month</div>
                    </div>
                    <div className="text-center stagger-item" style={{ animationDelay: '0.4s' }}>
                      <div className="text-3xl font-bold" style={{ color: '#FF7A2D', fontFamily: "'Space Grotesk', sans-serif" }}>8</div>
                      <div className="text-sm" style={{ color: 'var(--muted)' }}>posts/month</div>
                    </div>
                    <div className="text-center stagger-item" style={{ animationDelay: '0.5s' }}>
                      <div className="text-3xl font-bold" style={{ color: '#FF7A2D', fontFamily: "'Space Grotesk', sans-serif" }}>24/7</div>
                      <div className="text-sm" style={{ color: 'var(--muted)' }}>support</div>
                    </div>
                  </div>
                </div>

                {/* Right: Engagement Tiles */}
                <div className="relative flex items-center justify-center stagger-item hidden md:flex" style={{ animationDelay: '0.2s' }}>
                  <EngagementTiles />
                </div>
              </div>
            </div>
          </section>

          {/* Social Showcase Carousel - 3D Reel Display */}
          <SocialShowcaseCarousel />

          {/* Features Section - Flowing Wave Layout */}
          <section className="py-32 relative overflow-hidden" style={{ background: 'var(--bg)' }}>
            {/* Localized Masked Grid Patches - Orange accent */}
            <div className="masked-grid masked-grid-orange masked-grid-top-right" aria-hidden="true"></div>
            <div className="masked-grid masked-grid-orange masked-grid-bottom-left" aria-hidden="true"></div>
            
            <div className="max-w-6xl mx-auto px-6 relative z-10">
              {/* Hero Text */}
              <div className="text-center mb-24 stagger-item">
                <h2 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: "'Geist', sans-serif" }}>
                  Social Media That<br />Actually Works
                </h2>
                <p className="text-2xl max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>
                  Real engagement. Real growth. Real results.
                </p>
              </div>

              {/* Flowing Content Sections */}
              <div className="space-y-32">
                {/* Section 1 - Content Creation */}
                <div className="stagger-item" style={{ animationDelay: '0.1s' }}>
                  <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8" 
                         style={{ background: 'rgba(255, 122, 45, 0.15)', color: '#FF7A2D', fontSize: '0.875rem', fontWeight: '600' }}>
                      <div className="w-2 h-2 rounded-full" style={{ background: '#FF7A2D' }} />
                      Content Creation
                    </div>
                    <h3 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "'Geist', sans-serif" }}>
                      Posts that stop the scroll
                    </h3>
                    <p className="text-xl leading-relaxed mb-8" style={{ color: 'var(--muted)' }}>
                      We create content that resonates. Every post, story, and reel is designed to drive engagement and build your brand. From strategy to execution, we handle it all.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <span className="px-5 py-2 rounded-full text-sm" style={{ background: 'rgba(255, 122, 45, 0.1)', color: 'var(--text)' }}>
                        Instagram & TikTok
                      </span>
                      <span className="px-5 py-2 rounded-full text-sm" style={{ background: 'rgba(255, 122, 45, 0.1)', color: 'var(--text)' }}>
                        LinkedIn & Twitter
                      </span>
                      <span className="px-5 py-2 rounded-full text-sm" style={{ background: 'rgba(255, 122, 45, 0.1)', color: 'var(--text)' }}>
                        Stories & Reels
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section 2 - Community Building (Right-aligned) */}
                <div className="stagger-item flex justify-end" style={{ animationDelay: '0.2s' }}>
                  <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8" 
                         style={{ background: 'rgba(138, 61, 230, 0.15)', color: 'var(--primary)', fontSize: '0.875rem', fontWeight: '600' }}>
                      <div className="w-2 h-2 rounded-full" style={{ background: 'var(--primary)' }} />
                      Community Management
                    </div>
                    <h3 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "'Geist', sans-serif" }}>
                      Build real relationships
                    </h3>
                    <p className="text-xl leading-relaxed" style={{ color: 'var(--muted)' }}>
                      We don't just post and ghost. We actively engage with your audience?responding to comments, DMs, and mentions. Building a loyal community that actually cares about your brand.
                    </p>
                  </div>
                </div>

                {/* Section 3 - Growth & Analytics */}
                <div className="stagger-item" style={{ animationDelay: '0.3s' }}>
                  <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8" 
                         style={{ background: 'rgba(255, 122, 45, 0.15)', color: '#FF7A2D', fontSize: '0.875rem', fontWeight: '600' }}>
                      <div className="w-2 h-2 rounded-full" style={{ background: '#FF7A2D' }} />
                      Growth Strategy
                    </div>
                    <h3 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "'Geist', sans-serif" }}>
                      Track what matters
                    </h3>
                    <p className="text-xl leading-relaxed mb-10" style={{ color: 'var(--muted)' }}>
                      Data-driven decisions, not guesswork. Monthly performance reports show exactly how your social presence is growing?follower count, engagement rates, and actual business impact.
                    </p>
                    <div className="grid grid-cols-3 gap-8">
                      <div>
                        <div className="text-5xl font-bold mb-2" style={{ color: 'var(--primary)', fontFamily: "'Space Grotesk', sans-serif" }}>5x</div>
                        <div style={{ color: 'var(--muted)' }}>Growth</div>
                      </div>
                      <div>
                        <div className="text-5xl font-bold mb-2" style={{ color: '#FF7A2D', fontFamily: "'Space Grotesk', sans-serif" }}>24/7</div>
                        <div style={{ color: 'var(--muted)' }}>Support</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Section */}
                <div className="text-center stagger-item py-16" style={{ animationDelay: '0.4s' }}>
                  <a 
                    href="#pricing" 
                    className="px-10 py-5 font-bold text-lg inline-flex items-center gap-3 transition-all hover:translate-y-[-1px]"
                    style={{ 
                      background: 'linear-gradient(135deg, #FF7A2D 0%, var(--primary) 100%)', 
                      color: 'white',
                      borderRadius: '9999px',
                      boxShadow: 'inset 0 0 0 5px rgba(255, 255, 255, 0.18)'
                    }}
                  >
                    View Pricing Plans
                    <ArrowRight className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Preview - Social Page */}
          <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255, 122, 45, 0.05) 0%, rgba(138, 61, 230, 0.05) 100%)' }}></div>
            {/* Masked Grid Patch - Orange accent */}
            <div className="masked-grid masked-grid-orange masked-grid-top-right" aria-hidden="true"></div>
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Geist', sans-serif" }}>
                  Grow Your Social Presence
                </h2>
                <p className="text-xl" style={{ color: 'var(--muted)' }}>
                  Plans designed to scale with your business
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {plans.map((plan, idx) => (
                  <div key={idx} className={`liquid-card p-8 hover-elastic ${plan.popular ? 'plan-popular-inline' : ''}`} style={{ position: 'relative', overflow: 'visible' }}>
                    {plan.popular && (
                      <div 
                        className="pricing-badge"
                        style={{ 
                          position: 'absolute',
                          top: '0px',
                          left: '50%',
                          transform: 'translateX(-50%) translateY(-50%)',
                          background: 'linear-gradient(135deg, #8A3DE6, #FF7A2D)',
                          color: 'white',
                          padding: '0.35rem 1rem',
                          borderRadius: '16px',
                          fontSize: '0.6875rem',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          whiteSpace: 'nowrap',
                          boxShadow: '0 2px 8px rgba(138, 61, 230, 0.3)'
                        }}
                        aria-label="Recommended plan"
                      >
                        Most Popular
                      </div>
                    )}
                    <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Geist', sans-serif" }}>{plan.name}</h3>
                    <div className="mb-6">
                      <div className="text-4xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#FF7A2D' }}>
                        ${plan.monthly}
                        <span className="text-lg font-normal" style={{ color: 'var(--muted)' }}>/mo</span>
                      </div>
                      {plan.setup > 0 && (
                        <div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                          ${plan.setup} setup
                        </div>
                      )}
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.slice(0, 3).map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2" style={{ color: 'var(--text)' }}>
                          <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--success)' }} />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <a 
                      href="#contact"
                      className="w-full py-3 rounded-full font-semibold transition-all inline-flex items-center justify-center"
                      style={{ 
                        background: plan.popular ? '#FF7A2D' : 'rgba(255, 122, 45, 0.1)',
                        color: plan.popular ? 'white' : '#FF7A2D',
                        border: plan.popular ? 'none' : '1px solid var(--glass-border)'
                      }}
                    >
                      Get Started
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <Contact />
          <Footer />
        </div>
      );
    }

    // Home Page (existing content)
    function HomePage() {
      return (
        <div className="min-h-screen">
          <FloatingNav />
          <Hero />
          <Stats />
          {/* <SpotlightStack /> */}
          <WhyUsPricing />
          {/* <BentoPortfolio /> */}
          <LabsSection />
          <LabsHeadline />
          <SakuraGalleryWrapper />
          <About />
          <Services />
          <Contact />
          <Footer />
        </div>
      );
    }

    // ========================================
    // SHOWCASE SECTION
    // ========================================

    // Bakery Showcase Page - Full Implementation
    function BakeryShowcase() {
      const [scrollY, setScrollY] = useState(0);
      const [menuOpen, setMenuOpen] = useState(false);

      useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
      }, []);

      const navigate = (path) => {
        window.history.pushState({}, '', `#${path}`);
        window.dispatchEvent(new PopStateEvent('popstate'));
      };

      const products = [
        { name: "Croissant au Beurre", price: "�3.50", description: "Buttery, flaky layers baked to golden perfection", image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500" },
        { name: "Pain de Campagne", price: "�5.20", description: "Rustic country bread with a crispy crust", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500" },
        { name: "Tarte aux Pommes", price: "�4.80", description: "Classic apple tart with vanilla glaze", image: "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=500" },
        { name: "Pain au Chocolat", price: "�3.80", description: "Dark chocolate wrapped in tender pastry", image: "https://images.unsplash.com/photo-1623334044303-241021148842?w=500" },
        { name: "Baguette Tradition", price: "�2.90", description: "Traditional French baguette, made daily", image: "https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=500" },
        { name: "�clair au Caf�", price: "�4.20", description: "Coffee cream filled choux with espresso glaze", image: "https://images.unsplash.com/photo-1612201142855-c7a22f14e0a9?w=500" }
      ];

      const galleryImages = [
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600",
        "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=600",
        "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600",
        "https://images.unsplash.com/photo-1608198399988-841b435d8e31?w=600",
        "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600",
        "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600"
      ];

      const bakeryStyles = `
        .bakery-showcase { background: #FFF8F0; font-family: system-ui, -apple-system, sans-serif; }
        .bakery-nav { position: fixed; top: 0; width: 100%; background: rgba(255, 248, 240, 0.95); backdrop-filter: blur(8px); z-index: 50; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .bakery-hero-bg { position: absolute; inset: 0; background-size: cover; background-position: center; }
        .bakery-gradient { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(140, 90, 62, 0.4), transparent, rgba(243, 233, 220, 0.6)); }
        .bakery-card { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: all 0.3s; }
        .bakery-card:hover { box-shadow: 0 20px 25px rgba(0,0,0,0.2); transform: translateY(-8px); }
        .bakery-badge { position: absolute; top: 1rem; right: 1rem; background: #E6C084; color: #8C5A3E; padding: 0.5rem 1rem; border-radius: 9999px; font-weight: 600; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .bakery-img-hover { transition: transform 0.5s; }
        .bakery-card:hover .bakery-img-hover { transform: scale(1.1); }
        @media (max-width: 768px) { .bakery-mobile-menu { display: block; } .bakery-desktop-nav { display: none; } }
      `;

      return React.createElement('div', { className: 'bakery-showcase' },
        React.createElement('style', null, bakeryStyles),
        
        // Back Button - Subtle bottom-left
        React.createElement('div', { 
          style: { position: 'fixed', bottom: '1.5rem', left: '1.5rem', zIndex: 100 }
        },
          React.createElement('button', {
            onClick: () => navigate('/'),
            style: {
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 0.75rem',
              background: 'rgba(140, 90, 62, 0.08)',
              backdropFilter: 'blur(10px)',
              borderRadius: '9999px',
              border: '1px solid rgba(140, 90, 62, 0.15)',
              color: '#8C5A3E',
              fontWeight: 400,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              opacity: 0.6
            },
            onMouseEnter: (e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.background = 'rgba(140, 90, 62, 0.12)'; },
            onMouseLeave: (e) => { e.currentTarget.style.opacity = '0.6'; e.currentTarget.style.background = 'rgba(140, 90, 62, 0.08)'; }
          },
            React.createElement(ArrowLeft, { className: "w-4 h-4 inline", style: { marginRight: '0.25rem' } }),
            'Back'
          )
        ),

        // Navigation
        React.createElement('nav', { className: 'bakery-nav' },
          React.createElement('div', { style: { maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' } },
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '5rem' } },
              React.createElement('h1', { style: { fontSize: '1.5rem', fontFamily: 'serif', color: '#8C5A3E', fontStyle: 'italic' } }, 
                'Boulangerie Maison'
              ),
              React.createElement('div', { className: 'bakery-desktop-nav', style: { display: 'flex', gap: '2rem' } },
                ['about', 'menu', 'gallery', 'visit'].map(item =>
                  React.createElement('button', {
                    key: item,
                    onClick: (e) => {
                      e.preventDefault();
                      const section = document.getElementById(item);
                      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    },
                    style: { color: '#8C5A3E', textDecoration: 'none', transition: 'color 0.2s', background: 'none', border: 'none', fontSize: '1rem', cursor: 'pointer', fontFamily: 'inherit' },
                    onMouseEnter: (e) => { e.target.style.color = '#D9A282'; },
                    onMouseLeave: (e) => { e.target.style.color = '#8C5A3E'; }
                  }, item.charAt(0).toUpperCase() + item.slice(1))
                )
              ),
              React.createElement('button', {
                className: 'bakery-mobile-menu',
                onClick: () => setMenuOpen(!menuOpen),
                style: { color: '#8C5A3E', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }
              }, menuOpen ? '?' : '?')
            )
          ),
          menuOpen && React.createElement('div', { style: { background: '#F3E9DC', padding: '1rem' } },
            ['about', 'menu', 'gallery', 'visit'].map(item =>
              React.createElement('button', {
                key: item,
                onClick: (e) => {
                  e.preventDefault();
                  setMenuOpen(false);
                  const section = document.getElementById(item);
                  if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                },
                style: { display: 'block', width: '100%', textAlign: 'left', padding: '0.5rem', color: '#8C5A3E', background: 'none', border: 'none', fontSize: '1rem', cursor: 'pointer', fontFamily: 'inherit' }
              }, item.charAt(0).toUpperCase() + item.slice(1))
            )
          )
        ),

        // Hero Section
        React.createElement('section', { style: { position: 'relative', height: '100vh', overflow: 'hidden', marginTop: '5rem' } },
          React.createElement('div', {
            className: 'bakery-hero-bg',
            style: {
              backgroundImage: "url('https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1920')",
              transform: `translateY(${scrollY * 0.5}px)`
            }
          }),
          React.createElement('div', { className: 'bakery-gradient' }),
          React.createElement('div', { style: { position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '1rem' } },
            React.createElement('div', null,
              React.createElement('div', { style: { marginBottom: '1.5rem' } },
                React.createElement('div', { style: { display: 'inline-block', padding: '1rem', background: 'rgba(255,255,255,0.9)', borderRadius: '9999px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' } },
                  React.createElement('h2', { style: { fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontFamily: 'serif', color: '#8C5A3E', fontStyle: 'italic', margin: 0 } }, 
                    'Boulangerie Maison'
                  )
                )
              ),
              React.createElement('p', { style: { fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', color: 'white', fontWeight: 300, letterSpacing: '0.05em', marginBottom: '2rem', background: 'rgba(140, 90, 62, 0.7)', padding: '0.75rem 1.5rem', borderRadius: '9999px', display: 'inline-block' } },
                'Freshly baked by hand, every morning'
              ),
              React.createElement('button', {
                onClick: (e) => {
                  e.preventDefault();
                  const section = document.getElementById('menu');
                  if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                },
                style: { display: 'inline-block', background: '#E6C084', color: '#8C5A3E', padding: '0.75rem 2rem', borderRadius: '9999px', border: 'none', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', fontWeight: 500, fontSize: '1rem', fontFamily: 'inherit' },
                onMouseEnter: (e) => { e.target.style.background = '#D9A282'; e.target.style.transform = 'scale(1.05)'; },
                onMouseLeave: (e) => { e.target.style.background = '#E6C084'; e.target.style.transform = 'scale(1)'; }
              }, 'View Menu')
            )
          )
        ),

        // About Section
        React.createElement('section', { id: 'about', style: { padding: '5rem 1rem', background: 'rgba(243, 233, 220, 0.3)', position: 'relative' } },
          React.createElement('div', { style: { maxWidth: '72rem', margin: '0 auto' } },
            React.createElement('div', { style: { display: 'grid', gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr', gap: '3rem', alignItems: 'center' } },
              React.createElement('div', { style: { position: 'relative' } },
                React.createElement('div', { style: { transform: 'rotate(1deg)', boxShadow: '0 20px 25px rgba(0,0,0,0.2)', borderRadius: '8px', overflow: 'hidden' } },
                  React.createElement('img', { src: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=800', alt: 'Baker at work', style: { width: '100%', height: '24rem', objectFit: 'cover' } })
                )
              ),
              React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '1.5rem' } },
                React.createElement('h2', { style: { fontSize: 'clamp(2rem, 5vw, 3rem)', fontFamily: 'serif', color: '#8C5A3E', fontStyle: 'italic' } }, 'A Family Tradition'),
                React.createElement('div', { style: { width: '4rem', height: '0.25rem', background: '#D9A282' } }),
                React.createElement('p', { style: { fontSize: '1.125rem', color: 'rgba(140, 90, 62, 0.8)', lineHeight: '1.7' } },
                  'For three generations, our family has been perfecting the art of traditional French baking. Every loaf, every pastry, every delicate �clair is crafted with the same care and dedication that our grandmother brought to her first bakery in the heart of Provence.'
                ),
                React.createElement('p', { style: { fontSize: '1.125rem', color: 'rgba(140, 90, 62, 0.8)', lineHeight: '1.7' } },
                  'We rise before dawn to ensure that when you step into our bakery, you are greeted by the warm aroma of bread fresh from the oven and the promise of something made with love.'
                ),
                React.createElement('div', { style: { display: 'flex', gap: '2rem', paddingTop: '1rem' } },
                  [['80+', 'Years'], ['50+', 'Recipes'], ['100%', 'Handmade']].map(([num, label]) =>
                    React.createElement('div', { key: label, style: { textAlign: 'center' } },
                      React.createElement('p', { style: { fontSize: '1.875rem', fontFamily: 'serif', color: '#D9A282', margin: 0 } }, num),
                      React.createElement('p', { style: { fontSize: '0.875rem', color: '#8C5A3E', margin: 0 } }, label)
                    )
                  )
                )
              )
            )
          )
        ),

        // Menu Section
        React.createElement('section', { id: 'menu', style: { padding: '5rem 1rem', background: '#FFF8F0' } },
          React.createElement('div', { style: { maxWidth: '80rem', margin: '0 auto' } },
            React.createElement('div', { style: { textAlign: 'center', marginBottom: '4rem' } },
              React.createElement('h2', { style: { fontSize: 'clamp(2rem, 5vw, 3rem)', fontFamily: 'serif', color: '#8C5A3E', fontStyle: 'italic', marginBottom: '1rem' } }, 'Our Daily Bakes'),
              React.createElement('div', { style: { width: '6rem', height: '0.25rem', background: '#D9A282', margin: '0 auto 1.5rem' } }),
              React.createElement('p', { style: { fontSize: '1.125rem', color: 'rgba(140, 90, 62, 0.7)' } }, 'Prepared fresh each morning with the finest ingredients')
            ),
            React.createElement('div', { style: { display: 'grid', gridTemplateColumns: window.innerWidth > 1024 ? '1fr 1fr 1fr' : window.innerWidth > 640 ? '1fr 1fr' : '1fr', gap: '2rem' } },
              products.map((product, idx) =>
                React.createElement('div', { key: idx, className: 'bakery-card' },
                  React.createElement('div', { style: { position: 'relative', overflow: 'hidden', height: '16rem' } },
                    React.createElement('img', { src: product.image, alt: product.name, className: 'bakery-img-hover', style: { width: '100%', height: '100%', objectFit: 'cover' } }),
                    React.createElement('div', { className: 'bakery-badge' }, product.price)
                  ),
                  React.createElement('div', { style: { padding: '1.5rem' } },
                    React.createElement('h3', { style: { fontSize: '1.25rem', fontFamily: 'serif', color: '#8C5A3E', marginBottom: '0.5rem' } }, product.name),
                    React.createElement('p', { style: { color: 'rgba(140, 90, 62, 0.7)' } }, product.description)
                  )
                )
              )
            )
          )
        ),

        // Gallery Section
        React.createElement('section', { id: 'gallery', style: { padding: '5rem 1rem', background: 'rgba(243, 233, 220, 0.3)' } },
          React.createElement('div', { style: { maxWidth: '80rem', margin: '0 auto' } },
            React.createElement('div', { style: { textAlign: 'center', marginBottom: '4rem' } },
              React.createElement('h2', { style: { fontSize: 'clamp(2rem, 5vw, 3rem)', fontFamily: 'serif', color: '#8C5A3E', fontStyle: 'italic', marginBottom: '1rem' } }, 'From Our Kitchen'),
              React.createElement('div', { style: { width: '6rem', height: '0.25rem', background: '#D9A282', margin: '0 auto' } })
            ),
            React.createElement('div', { style: { display: 'grid', gridTemplateColumns: window.innerWidth > 1024 ? '1fr 1fr 1fr' : window.innerWidth > 640 ? '1fr 1fr' : '1fr', gap: '1rem' } },
              galleryImages.map((img, idx) =>
                React.createElement('div', {
                  key: idx,
                  style: {
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    height: idx % 3 === 0 ? '300px' : '250px',
                    cursor: 'pointer'
                  }
                },
                  React.createElement('img', { src: img, alt: `Bakery ${idx + 1}`, className: 'bakery-img-hover', style: { width: '100%', height: '100%', objectFit: 'cover' } })
                )
              )
            )
          )
        ),

        // Visit Section
        React.createElement('section', { id: 'visit', style: { padding: '5rem 1rem', background: '#FFF8F0' } },
          React.createElement('div', { style: { maxWidth: '72rem', margin: '0 auto' } },
            React.createElement('div', { style: { display: 'grid', gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr', gap: '3rem' } },
              React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '2rem' } },
                React.createElement('div', null,
                  React.createElement('h2', { style: { fontSize: 'clamp(2rem, 5vw, 3rem)', fontFamily: 'serif', color: '#8C5A3E', fontStyle: 'italic', marginBottom: '1rem' } }, 'Visit Our Bakery'),
                  React.createElement('div', { style: { width: '6rem', height: '0.25rem', background: '#D9A282', marginBottom: '1.5rem' } }),
                  React.createElement('p', { style: { fontSize: '1.125rem', color: 'rgba(140, 90, 62, 0.7)', marginBottom: '2rem' } },
                    'Come experience the warmth and aroma of fresh-baked traditions. We are waiting to welcome you with a smile and a warm croissant.'
                  )
                ),
                React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '1.5rem' } },
                  [
                    ['??', 'Address', '12 Rue de la Boulangerie\n06140 Provence, France'],
                    ['??', 'Hours', 'Tuesday - Saturday: 6:00 AM - 7:00 PM\nSunday: 7:00 AM - 2:00 PM\nMonday: Closed'],
                    ['??', 'Phone', '+33 4 93 12 34 56']
                  ].map(([icon, title, text]) =>
                    React.createElement('div', { key: title, style: { display: 'flex', gap: '1rem' } },
                      React.createElement('div', { style: { fontSize: '1.5rem' } }, icon),
                      React.createElement('div', null,
                        React.createElement('h3', { style: { fontWeight: 600, color: '#8C5A3E', marginBottom: '0.25rem' } }, title),
                        React.createElement('p', { style: { color: 'rgba(140, 90, 62, 0.7)', whiteSpace: 'pre-line' } }, text)
                      )
                    )
                  )
                ),
                React.createElement('button', {
                  style: { background: '#8C5A3E', color: '#FFF8F0', padding: '1rem 2rem', borderRadius: '9999px', border: 'none', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', fontWeight: 500, fontSize: '1rem' },
                  onMouseEnter: (e) => { e.target.style.background = '#D9A282'; e.target.style.transform = 'scale(1.05)'; },
                  onMouseLeave: (e) => { e.target.style.background = '#8C5A3E'; e.target.style.transform = 'scale(1)'; }
                }, 'Get Directions')
              ),
              React.createElement('div', { style: { position: 'relative' } },
                React.createElement('div', { style: { background: '#F3E9DC', borderRadius: '8px', height: '24rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'hidden', position: 'relative' } },
                  React.createElement('img', { src: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', alt: 'Bakery location', style: { width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 } }),
                  React.createElement('div', { style: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
                    React.createElement('div', { style: { background: 'rgba(255,255,255,0.9)', padding: '2rem', borderRadius: '8px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' } },
                      React.createElement('div', { style: { fontSize: '3rem', marginBottom: '0.5rem' } }, '??'),
                      React.createElement('p', { style: { color: '#8C5A3E', fontWeight: 600 } }, 'Find us in the heart of Provence')
                    )
                  )
                )
              )
            )
          )
        ),

        // Footer
        React.createElement('footer', { style: { background: '#8C5A3E', color: '#FFF8F0', padding: '3rem 1rem', textAlign: 'center' } },
          React.createElement('div', { style: { maxWidth: '72rem', margin: '0 auto' } },
            React.createElement('button', {
              onClick: () => {
                navigate('/');
                setTimeout(() => {
                  const section = document.getElementById('work');
                  if (section) section.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              },
              style: {
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '9999px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFF8F0',
                fontWeight: 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                marginBottom: '2rem'
              },
              onMouseEnter: (e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'; },
              onMouseLeave: (e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; }
            }, React.createElement(ArrowLeft, { className: "w-4 h-4 inline mr-1" }), ' Back to Recent Transformations'),
            React.createElement('p', { style: { fontSize: '0.875rem', opacity: 0.7, margin: 0 } }, '� 2025 Boulangerie Maison � A Rooted Labs Showcase'),
            React.createElement('p', { style: { fontSize: '0.75rem', opacity: 0.5, marginTop: '0.5rem' } }, 'This is a design demonstration, not a real business')
          )
        )
      );
    }

    // Tech Store Showcase Page
    function TechStoreShowcase() {
      const navigate = (path) => {
        window.history.pushState({}, '', `#${path}`);
        window.dispatchEvent(new PopStateEvent('popstate'));
      };

      return (
        <div className="techstore-showcase">
          <div style={{ position: 'fixed', bottom: '1.5rem', left: '1.5rem', zIndex: 100 }}>
            <button
              onClick={() => navigate('/')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.75rem',
                background: 'rgba(56, 189, 248, 0.08)',
                backdropFilter: 'blur(10px)',
                borderRadius: '9999px',
                border: '1px solid rgba(56, 189, 248, 0.15)',
                color: 'var(--accent-blue)',
                fontWeight: 400,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                opacity: 0.6
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.background = 'rgba(56, 189, 248, 0.12)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.6'; e.currentTarget.style.background = 'rgba(56, 189, 248, 0.08)'; }}
            >
              <ArrowLeft className="w-4 h-4 inline mr-1" /> Back
            </button>
          </div>

          <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
            <div className="text-center max-w-2xl px-6">
              <h1 className="text-6xl font-bold mb-4" style={{ fontFamily: "'Geist', sans-serif" }}>
                 Tech Haven
              </h1>
              <p className="text-xl mb-6" style={{ color: 'var(--muted)' }}>
                Full tech store website will be implemented here
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" 
                   style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-blue)' }}>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent-blue)' }} />
                <span className="text-sm font-medium">Template Ready for Implementation</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Restaurant Showcase Page
    function RestaurantShowcase() {
      const navigate = (path) => {
        window.history.pushState({}, '', `#${path}`);
        window.dispatchEvent(new PopStateEvent('popstate'));
      };

      return (
        <div className="restaurant-showcase">
          <div style={{ position: 'fixed', bottom: '1.5rem', left: '1.5rem', zIndex: 100 }}>
            <button
              onClick={() => navigate('/')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.75rem',
                background: 'rgba(255, 122, 45, 0.08)',
                backdropFilter: 'blur(10px)',
                borderRadius: '9999px',
                border: '1px solid rgba(255, 122, 45, 0.15)',
                color: '#FF7A2D',
                fontWeight: 400,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                opacity: 0.6
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.background = 'rgba(255, 122, 45, 0.12)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.6'; e.currentTarget.style.background = 'rgba(255, 122, 45, 0.08)'; }}
            >
              <ArrowLeft className="w-4 h-4 inline mr-1" /> Back
            </button>
          </div>

          <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
            <div className="text-center max-w-2xl px-6">
              <h1 className="text-6xl font-bold mb-4" style={{ fontFamily: "'Geist', sans-serif" }}>
                 Culinary Delight
              </h1>
              <p className="text-xl mb-6" style={{ color: 'var(--muted)' }}>
                Full restaurant website will be implemented here
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" 
                   style={{ background: 'rgba(255, 122, 45, 0.1)', color: '#FF7A2D' }}>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#FF7A2D' }} />
                <span className="text-sm font-medium">Template Ready for Implementation</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Router Component
    function Router() {
      const [path, setPath] = useState(() => {
        // Support both /path and #/path formats for compatibility
        const pathname = window.location.pathname;
        const hash = window.location.hash;
        
        // If we have a hash route, use that (for file:// protocol)
        if (hash.startsWith('#/')) {
          return hash.substring(1); // Remove the #
        }
        
        // Otherwise use pathname (for http:// protocol)
        return pathname;
      });

      useEffect(() => {
        // Handle scrolling to hash on initial load
        const handleHashScroll = () => {
          const hash = window.location.hash;
          if (hash && !hash.startsWith('#/')) {
            // It's a section anchor like #about
            setTimeout(() => {
              const element = document.getElementById(hash.substring(1));
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }, 300); // Wait for page to render
          }
        };

        handleHashScroll();
      }, [path]);

      useEffect(() => {
        const handlePopState = () => {
          const pathname = window.location.pathname;
          const hash = window.location.hash;
          
          if (hash.startsWith('#/')) {
            setPath(hash.substring(1));
          } else {
            setPath(pathname);
          }
          window.scrollTo(0, 0);
        };

        const handleHashChange = () => {
          const hash = window.location.hash;
          if (hash.startsWith('#/')) {
            setPath(hash.substring(1));
            window.scrollTo(0, 0);
          } else if (hash) {
            // Handle section scrolling
            const element = document.getElementById(hash.substring(1));
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }
        };

        window.addEventListener('popstate', handlePopState);
        window.addEventListener('hashchange', handleHashChange);
        
        return () => {
          window.removeEventListener('popstate', handlePopState);
          window.removeEventListener('hashchange', handleHashChange);
        };
      }, []);

      if (path === '/websites') return <WebsitesPage />;
      if (path === '/ai') return <AIAgentsPage />;
      if (path === '/social') return <SocialPage />;
      if (path === '/showcase/gardener') return <GardenerWebsite />;
      if (path === '/showcase/techstore') return <TechStore />;
      if (path === '/showcase/restaurant') return <Restaurant />;
      return <HomePage />;
    }

    // Main App
    function App() {
      return <Router />;
    }

    export default App;



