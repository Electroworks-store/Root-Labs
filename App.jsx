import { useState, useEffect, useRef } from 'react';
import { Check, ArrowRight, ArrowLeft, X, Circle } from 'lucide-react';
import { generatePath, SvgShape } from 'react-svg-shape';
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

    // Helper: Submit lead via server API
    async function submitLead(lead) {
      // Track if available
      if (window.track && typeof window.track === 'function') {
        try {
          window.track('lead_submitted', lead);
        } catch (e) {
          console.warn('Tracking failed:', e);
        }
      }

      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lead),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Failed to submit lead.');
      }

      return { success: true, via: 'api', data };
    }

    // Floating Navigation
    function FloatingNav() {
      const [scrolled, setScrolled] = useState(false);
      const [lang, setLang] = useState('EN');
      
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
          <nav className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${scrolled ? 'scale-95' : 'scale-100'}`}>
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--success)' }} />
                <span className="text-xs font-medium">{data.badge}</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                {data.title1}
                <span className="block mt-2" style={{ color: 'var(--primary)' }}>
                  {data.title2}
                </span>
              </h1>

              <p className="text-lg leading-relaxed max-w-lg" style={{ color: 'var(--muted)' }}>
                {data.subtitle}
              </p>

              <div className="flex gap-4 pt-2">
                <a href="#work" className="glow-on-hover relative px-7 py-3.5 rounded-full text-white font-semibold text-base overflow-hidden group focus:outline-none focus:ring-4 focus:ring-opacity-50 inline-flex items-center transition-all duration-300 hover:scale-105"
                        style={{ 
                          background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-blue) 100%)',
                          boxShadow: '0 8px 24px rgba(138, 61, 230, 0.3)'
                        }}>
                  <span className="relative z-10">{data.btnPrimary}</span>
                </a>
                <a href="#pricing" className="btn-glass px-7 py-3.5 text-base inline-flex items-center transition-all duration-300 hover:scale-105">
                  {data.btnSecondary}
                </a>
              </div>
            </div>

            {/* Right: Animated Mesh Gradient Card */}
            <div 
              className="relative h-[400px] rounded-3xl mesh-gradient liquid-glass stagger-item"
              style={{ 
                animationDelay: '0.2s',
                transform: `perspective(1000px) rotateY(${mousePos.x * 0.5}deg) rotateX(${-mousePos.y * 0.5}deg)`
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-3 p-8">
                  <div className="text-6xl font-bold opacity-10">{data.cardNumber}</div>
                  <div className="text-xl font-semibold" style={{ color: 'var(--primary)' }}>
                    {data.cardSubtitle}
                  </div>
                  <div className="text-base" style={{ color: 'var(--muted)' }}>
                    {data.cardText}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }

    // Bento Grid Portfolio
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
                    className={`portfolio-row ${isEven ? 'row-normal' : 'row-reversed'}`}
                    style={{ animationDelay: `${idx * 0.15}s` }}
                  >
                    {/* Text Content */}
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
                            background: `linear-gradient(135deg, ${project.color} 0%, ${project.color}dd 100%)` 
                          }}
                        >
                          Visit Website</a>
                      </div>
                    </div>

                    {/* Image */}
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

    // About Section with Organic Blob Shapes
    function About() {
      const [scrollY, setScrollY] = useState(0);
      const [blobPath1] = useState(() => generatePath({ complexity: 12, contrast: 3 }));
      const [blobPath2] = useState(() => generatePath({ complexity: 14, contrast: 4 }));
      const [blobPath3] = useState(() => generatePath({ complexity: 16, contrast: 5 }));
      const [blobPath4] = useState(() => generatePath({ complexity: 10, contrast: 3 }));
      const [blobPath5] = useState(() => generatePath({ complexity: 11, contrast: 4 }));
      const [blobPath6] = useState(() => generatePath({ complexity: 13, contrast: 3 }));
      const sectionRef = useRef(null);

      useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
      }, []);

      const getSectionScroll = () => {
        if (!sectionRef.current) return 0;
        const rect = sectionRef.current.getBoundingClientRect();
        const sectionTop = rect.top + scrollY;
        return Math.max(0, scrollY - sectionTop + window.innerHeight / 2);
      };

      const sectionScroll = getSectionScroll();

      return (
        <section ref={sectionRef} id="about" className="relative overflow-hidden" style={{ background: 'var(--bg)', paddingTop: '4rem', paddingBottom: '4rem' }}>
          
          {/* Organic Blob Backgrounds with Images */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Removed cutoff blob - keeping only bottom blob */}
            
            {/* Green blob with image - bottom left */}
            <div className="absolute bottom-60 left-32" style={{ transform: `translateY(${-sectionScroll * 0.08}px) rotate(${sectionScroll * 0.01}deg)` }}>
              <div className="relative w-[550px] h-[550px]">
                <svg width="550" height="550" viewBox="0 0 600 600" className="absolute inset-0">
                  <defs>
                    <clipPath id="blobClip3">
                      <path d={blobPath3} transform="scale(1) translate(0, 0)" />
                    </clipPath>
                  </defs>
                  <image
                    href="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80"
                    width="600"
                    height="600"
                    clipPath="url(#blobClip3)"
                    preserveAspectRatio="xMidYMid slice"
                    opacity="0.3"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Hero Section - Organic Layout */}
          <div className="relative min-h-screen flex items-center px-8 md:px-12 lg:px-20 py-32">
            <div className="max-w-7xl mx-auto w-full relative z-10">
              
              {/* Intro Label */}
              <p className="text-xs font-bold mb-8 tracking-[0.3em]" style={{ color: 'var(--primary)' }}>
                ABOUT ROOT LABS
              </p>

              {/* Main Content Grid */}
              <div className="grid lg:grid-cols-2 gap-20 items-center">
                
                {/* Left: Floating Team Avatars */}
                <div className="relative flex items-center justify-center" style={{ transform: `translateY(${sectionScroll * 0.05}px)` }}>
                  
                  {/* Three avatars stacked vertically with middle one offset right */}
                  <div className="relative w-full max-w-md" style={{ height: '600px' }}>
                    {/* Avatar 1 - Top (Light Blue) */}
                    <div 
                      className="absolute left-0 top-8"
                      style={{ 
                        transform: `translateY(${sectionScroll * 0.08}px) rotate(${-sectionScroll * 0.01}deg)`,
                      }}
                    >
                      <div className="w-56 h-56 rounded-full flex items-center justify-center"
                        style={{
                          background: 'rgba(200, 230, 255, 0.5)',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
                        }}
                      >
                        <img 
                          src="/img/Adrian-avatar.png.png" 
                          alt="Adrian"
                          className="w-52 h-52 object-cover rounded-full"
                        />
                      </div>
                    </div>
                    
                    {/* Avatar 2 - Middle (Purple) - Offset to right */}
                    <div 
                      className="absolute left-32 top-1/2 -translate-y-1/2"
                      style={{ 
                        transform: `translateY(calc(-50% + ${sectionScroll * 0.06}px)) rotate(${sectionScroll * 0.015}deg)`,
                      }}
                    >
                      <div className="w-56 h-56 rounded-full flex items-center justify-center"
                        style={{
                          background: 'rgba(220, 210, 255, 0.5)',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
                        }}
                      >
                        <img 
                          src="/img/Nepik-avatar.png.png" 
                          alt="Nepik"
                          className="w-52 h-52 object-cover rounded-full"
                        />
                      </div>
                    </div>
                    
                    {/* Avatar 3 - Bottom (Purple) */}
                    <div 
                      className="absolute left-0 bottom-8"
                      style={{ 
                        transform: `translateY(${sectionScroll * 0.07}px) rotate(${-sectionScroll * 0.02}deg)`,
                      }}
                    >
                      <div className="w-56 h-56 rounded-full flex items-center justify-center"
                        style={{
                          background: 'rgba(210, 200, 255, 0.5)',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
                        }}
                      >
                        <img 
                          src="/img/Viky-avatar.jpg.jpg" 
                          alt="Viky"
                          className="w-52 h-52 object-cover rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Text Content */}
                <div className="space-y-8">
                  <h2 
                    className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1]" 
                    style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text)' }}
                  >
                    Three teenagers
                    <span className="block mt-3" style={{ 
                      background: 'linear-gradient(120deg, var(--primary) 0%, var(--accent-blue) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      building the future
                    </span>
                  </h2>

                  <div className="space-y-6 text-xl md:text-2xl leading-relaxed">
                    <p style={{ color: '#000000' }}>
                      Competing with agencies charging <span style={{ color: 'var(--text)', fontWeight: 700 }}>10x more</span>. 
                      Delivering <span style={{ color: 'var(--primary)', fontWeight: 700 }}>50+ projects</span> in 
                      just <span style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>7 days</span> average.
                    </p>
                  </div>

                  {/* Stats with BLOB shapes instead of boxes */}
                  <div className="grid grid-cols-3 gap-6 pt-8">
                    {[
                      { value: '15', label: 'Years Old', color: 'var(--primary)', blobPath: blobPath4 },
                      { value: '50+', label: 'Projects', color: 'var(--accent-blue)', blobPath: blobPath5 },
                      { value: '7d', label: 'Avg Time', color: 'var(--success)', blobPath: blobPath6 }
                    ].map((stat, idx) => (
                      <div key={idx} className="relative flex items-center justify-center">
                        {/* Blob background */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-30">
                          <SvgShape width={140} height={140}>
                            <SvgShape.Path 
                              svgPath={stat.blobPath} 
                              colors={[stat.color, stat.color]} 
                            />
                          </SvgShape>
                        </div>
                        {/* Content on top of blob */}
                        <div className="relative z-10 text-center py-6">
                          <div 
                            className="text-3xl md:text-4xl font-bold mb-1"
                            style={{ 
                              fontFamily: "'Space Grotesk', sans-serif",
                              color: 'var(--text)'
                            }}
                          >
                            {stat.value}
                          </div>
                          <p className="text-xs font-semibold tracking-wider" style={{ color: '#000000' }}>
                            {stat.label}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-base pt-6" style={{ color: '#000000' }}>
                    Brno, Czech Republic  •  Est. 2024
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* Mission Section with Organic Background */}
          <div className="relative px-8 md:px-12 lg:px-20 py-32">
            <div className="max-w-6xl mx-auto relative">
              
              {/* Large organic blob background - moved inward to prevent cutoff */}
              <div 
                className="absolute top-0 right-20 opacity-15 pointer-events-none"
                style={{ transform: `rotate(${sectionScroll * 0.01}deg)` }}
              >
                <SvgShape width={700} height={700}>
                  <SvgShape.Path 
                    svgPath={blobPath2} 
                    colors={['var(--accent-blue)', 'var(--primary)']} 
                  />
                </SvgShape>
              </div>

              <div className="relative z-10">
                <p className="text-xs font-bold mb-8 tracking-[0.3em]" style={{ color: 'var(--primary)' }}>
                  OUR MISSION
                </p>
                
                <h3 
                  className="text-3xl md:text-5xl lg:text-6xl font-bold mb-12 max-w-4xl leading-tight"
                  style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text)' }}
                >
                  Making professional web design accessible to everyone
                </h3>

                <div className="grid md:grid-cols-2 gap-12 max-w-5xl">
                  <div className="space-y-4 text-lg leading-relaxed">
                    <p style={{ color: '#000000' }}>
                      We believe great design shouldn't cost a fortune or take months to deliver. 
                      That's why we've built a system that combines cutting-edge AI with human creativity.
                    </p>
                  </div>
                  <div className="space-y-4 text-lg leading-relaxed">
                    <p style={{ color: '#000000' }}>
                      Fast turnarounds. Premium quality. Prices that make sense. 
                      That's the Root Labs promise.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Section with Organic Accents - Kept */}
          <div className="relative px-8 md:px-12 lg:px-20 py-32">
            <div className="max-w-5xl mx-auto relative">
              
              {/* Organic blob accent - moved inward to prevent cutoff */}
              <div 
                className="absolute left-10 top-20 opacity-10 pointer-events-none"
                style={{ transform: `translateY(${sectionScroll * 0.08}px) rotate(${-sectionScroll * 0.015}deg)` }}
              >
                <SvgShape width={400} height={400}>
                  <SvgShape.Path 
                    svgPath={blobPath3} 
                    colors={['var(--success)', 'var(--primary)']} 
                  />
                </SvgShape>
              </div>

              <div className="relative z-10">
                <div className="mb-20">
                  <p className="text-xs font-bold mb-6 tracking-[0.3em]" style={{ color: 'var(--primary)' }}>
                    THE TEAM
                  </p>
                  <h3 className="text-4xl md:text-6xl font-bold" style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text)' }}>
                    Meet the crew
                  </h3>
                </div>

                <div className="space-y-1">
                  {[
                    { name: 'Adrian', role: 'Full-Stack Developer', desc: 'Clean code, modern architecture, zero bloat', color: 'var(--primary)' },
                    { name: 'Viktor', role: 'Lead Designer', desc: 'Pixels that matter', color: 'var(--accent-blue)' },
                    { name: 'Štěpán', role: 'Growth & Strategy', desc: 'From first call to final launch', color: 'var(--success)' }
                  ].map((member, idx) => (
                    <div 
                      key={idx}
                      className="group py-10 border-b transition-all duration-500 hover:pl-8"
                      style={{ 
                        borderColor: 'var(--glass-border)',
                        opacity: 0,
                        animation: 'fadeInUp 0.6s ease-out forwards',
                        animationDelay: `${0.4 + idx * 0.1}s`
                      }}
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex items-baseline gap-8">
                          <span 
                            className="text-7xl md:text-9xl font-bold opacity-8 transition-all duration-500 group-hover:opacity-20 group-hover:scale-110" 
                            style={{ 
                              fontFamily: "'Space Grotesk', sans-serif",
                              color: member.color
                            }}
                          >
                            {(idx + 1).toString().padStart(2, '0')}
                          </span>
                          <div>
                            <h4 
                              className="text-4xl md:text-5xl font-bold mb-3 transition-all duration-300 group-hover:translate-x-4" 
                              style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text)' }}
                            >
                              {member.name}
                            </h4>
                            <p className="text-base font-semibold" style={{ color: member.color }}>
                              {member.role}
                            </p>
                          </div>
                        </div>
                        <p 
                          className="text-lg md:text-right md:max-w-sm opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700" 
                          style={{ color: '#000000' }}
                        >
                          {member.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA with Organic Shape */}
          <div className="relative px-8 md:px-12 lg:px-20 py-40">
            <div className="max-w-4xl mx-auto text-center relative z-10">
              
              {/* Organic blob background - contained within section */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none"
                style={{ transform: `translate(-50%, -50%) scale(${0.9 + sectionScroll * 0.00005})` }}
              >
                <SvgShape width={1000} height={700}>
                  <SvgShape.Path 
                    svgPath={blobPath1} 
                    colors={['var(--primary)', 'var(--success)']} 
                  />
                </SvgShape>
              </div>

              <h3 
                className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight"
                style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text)' }}
              >
                Ready to build something amazing?
              </h3>
              <p className="text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto" style={{ color: '#000000' }}>
                Quality websites at a fraction of the cost and time.
              </p>
            </div>
          </div>

        </section>
      );
    }

    // Services Section - Alternating Layout with Numbers
    function Services() {
      const servicesData = document.getElementById('services-data');
      const heading = servicesData?.dataset.heading || '';
      const subheading = servicesData?.dataset.subheading || '';

      // Get individual service data
      const websitesData = document.getElementById('websites-data');
      const aiData = document.getElementById('ai-data');
      const socialData = document.getElementById('social-data');

      const [hoveredIndex, setHoveredIndex] = useState(null);

      const allServices = [
        {
          id: 'websites',
          number: '01',
          title: 'Website Redesign',
          description: websitesData?.dataset.subheading || '',
          color: '#8A3DE6',
          accentColor: '#38bdf8',
          link: '/websites',
          stats: [
            { label: 'Starting at', value: '$499' },
            { label: 'Delivery', value: '7 Days' },
            { label: 'Results', value: '3x ROI' }
          ],
          features: ['Responsive Design', 'Speed Optimization', 'Modern UI/UX', 'SEO-Friendly', 'Custom Animations', 'Performance Audit'],
          align: 'left'
        },
        {
          id: 'ai',
          number: '02',
          title: 'AI Agents',
          description: aiData?.dataset.subheading || '',
          color: '#38bdf8',
          accentColor: '#8A3DE6',
          link: '/ai',
          stats: [
            { label: 'Starting at', value: '$299/mo' },
            { label: 'Response', value: '<1 Second' },
            { label: 'Uptime', value: '24/7' }
          ],
          features: ['Customer Support', 'Lead Qualification', 'Multi-Channel Deploy', 'Custom Training', 'CRM Integration', 'Real-time Analytics'],
          align: 'right'
        },
        {
          id: 'social',
          number: '03',
          title: 'Social Media',
          description: socialData?.dataset.subheading || '',
          color: '#FF7A2D',
          accentColor: '#8A3DE6',
          link: '/social',
          stats: [
            { label: 'Starting at', value: '$499/mo' },
            { label: 'Reach', value: '10K+' },
            { label: 'Content', value: 'Daily Posts' }
          ],
          features: ['Content Creation', 'Community Management', 'Growth Strategy', 'Analytics Reports', 'Influencer Outreach', '3+ Platforms'],
          align: 'left'
        }
      ];

      return (
        <section id="services" className="py-32 relative overflow-hidden" style={{ background: 'var(--bg)' }}>
          {/* Subtle background elements */}
          <div className="absolute top-1/4 left-0 w-96 h-96 rounded-full blur-3xl opacity-[0.03] pointer-events-none" 
               style={{ background: '#8A3DE6' }} />
          <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full blur-3xl opacity-[0.03] pointer-events-none" 
               style={{ background: '#38bdf8' }} />

          <div className="max-w-6xl mx-auto px-8 md:px-12 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-32 stagger-item">
              <h2 className="text-5xl md:text-7xl font-bold mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>
                {heading}
              </h2>
              <p className="text-xl" style={{ color: 'var(--muted)' }}>
                {subheading}
              </p>
            </div>

            {/* Alternating Services */}
            <div className="space-y-32">
              {allServices.map((service, idx) => (
                <div 
                  key={service.id}
                  className="stagger-item group"
                  style={{ animationDelay: `${idx * 0.15}s` }}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Hover glow */}
                  <div 
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none blur-3xl"
                    style={{ background: `${service.color}08` }}
                  />

                  {/* Content Grid - Alternating */}
                  <div className={`grid md:grid-cols-2 gap-16 items-center relative ${service.align === 'right' ? 'md:flex-row-reverse' : ''}`}>
                    {/* Number Side */}
                    <div className={`flex ${service.align === 'right' ? 'md:order-2 md:justify-end' : 'md:order-1 md:justify-start'} justify-center`}>
                      <div className="relative">
                        {/* Background gradient that shows through text */}
                        <div 
                          className="absolute inset-0 flex items-center justify-center"
                          style={{ 
                            background: `radial-gradient(circle, ${service.color} 0%, ${service.accentColor} 100%)`,
                            filter: 'blur(30px)',
                            opacity: 0,
                            transition: 'opacity 0.7s'
                          }}
                          ref={(el) => {
                            if (el && el.parentElement) {
                              const parent = el.parentElement.parentElement.parentElement;
                              if (parent.classList.contains('group')) {
                                parent.addEventListener('mouseenter', () => el.style.opacity = '0.15');
                                parent.addEventListener('mouseleave', () => el.style.opacity = '0');
                              }
                            }
                          }}
                        >
                          <div style={{ width: '80%', height: '80%' }} />
                        </div>
                        
                        {/* Large Readable Number - Outlined with gradient fill */}
                        <div 
                          className="relative text-[10rem] md:text-[14rem] font-bold leading-none select-none transition-all group-hover:scale-105"
                          style={{ 
                            fontFamily: "'Space Grotesk', sans-serif",
                            WebkitTextStroke: `2.5px ${service.color}`,
                            WebkitTextFillColor: 'transparent',
                            backgroundImage: `radial-gradient(circle, ${service.color}20 0%, ${service.accentColor}15 100%)`,
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent'
                          }}
                        >
                          {service.number}
                        </div>
                      </div>
                    </div>

                    {/* Content Side */}
                    <div className={`${service.align === 'right' ? 'md:order-1 md:text-right' : 'md:order-2 md:text-left'} text-center md:text-left space-y-6`}>
                      {/* Title */}
                      <h3 
                        className="text-4xl md:text-6xl font-bold transition-all" 
                        style={{ 
                          fontFamily: "'Syne', sans-serif",
                          color: service.color
                        }}
                      >
                        {service.title}
                      </h3>
                      
                      {/* Description */}
                      <p 
                        className="text-lg md:text-xl leading-relaxed max-w-xl" 
                        style={{ color: 'var(--muted)' }}
                      >
                        {service.description}
                      </p>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-4 py-4">
                        {service.stats.map((stat, i) => (
                          <div key={i} className="text-center md:text-left">
                            <div 
                              className="text-2xl md:text-3xl font-bold mb-1"
                              style={{ 
                                color: service.color,
                                fontFamily: "'Space Grotesk', sans-serif"
                              }}
                            >
                              {stat.value}
                            </div>
                            <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--muted)', opacity: 0.7 }}>
                              {stat.label}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Features List */}
                      <div className={`grid grid-cols-2 gap-x-4 gap-y-3 py-4 ${service.align === 'right' ? 'md:justify-items-end' : ''}`}>
                        {service.features.map((feature, i) => (
                          <div 
                            key={i}
                            className="flex items-center gap-2 text-sm"
                          >
                            <div 
                              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ background: service.color }}
                            />
                            <span style={{ color: 'var(--text)' }}>{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA Button - Always pill-shaped */}
                      <div className={`pt-4 ${service.align === 'right' ? 'md:flex md:justify-end' : ''}`}>
                        <a 
                          href={service.link}
                          onClick={(e) => { e.preventDefault(); navigate(service.link); }}
                          className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-base transition-all hover:scale-105 hover:shadow-2xl"
                          style={{ 
                            background: `linear-gradient(135deg, ${service.color} 0%, ${service.accentColor} 100%)`,
                            color: 'white',
                            boxShadow: `0 8px 32px ${service.color}40`
                          }}
                        >
                          Explore {service.title}
                          <ArrowRight className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Connecting Line (except last) */}
                  {idx < allServices.length - 1 && (
                    <div 
                      className="h-24 w-px mx-auto mt-24 opacity-20"
                      style={{ background: `linear-gradient(to bottom, ${service.color}, ${allServices[idx + 1].color})` }}
                    />
                  )}
                </div>
              ))}
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
        emailLink: contactData?.dataset.emaillink || 'hello@rootlabs.studio',
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

        // Bot protection: check honeypot field
        const honeypot = form.querySelector('[name="website_url_hp"]')?.value;
        if (honeypot) {
          // Silently reject bot submissions
          console.warn('Bot submission detected');
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
            <div className="max-w-4xl mx-auto">
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
                  <h3 className="text-3xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>
                    Thank You!
                  </h3>
                  <p className="text-lg" style={{ color: 'var(--muted)' }}>
                    We've received your message and will get back to you within 1 business day.
                  </p>
                  <div className="flex gap-4 justify-center pt-4">
                    <a 
                      href="#pricing" 
                      className="px-6 py-3 rounded-full font-semibold transition-all hover:scale-105"
                      style={{ 
                        background: 'linear-gradient(135deg, var(--primary), var(--accent-blue))',
                        color: 'white'
                      }}
                    >
                      View Pricing
                    </a>
                    <button 
                      onClick={() => setSubmitStatus(null)}
                      className="px-6 py-3 rounded-full font-semibold transition-all hover:scale-105"
                      style={{ 
                        background: 'var(--glass-bg-dark)',
                        border: '1px solid var(--glass-border)',
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
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="contact-hero text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
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

                  {/* Honeypot field for bot protection - hidden from real users */}
                  <input
                    type="text"
                    name="website_url_hp"
                    defaultValue=""
                    autoComplete="new-password"
                    tabIndex={-1}
                    style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, pointerEvents: 'none' }}
                    aria-hidden="true"
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
                        : 'linear-gradient(135deg, var(--primary) 0%, var(--accent-blue) 100%)',
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
                </div>
              </form>
            </div>

            {/* Email Fallback */}
            <p className="text-center mt-8" style={{ color: 'var(--muted)' }}>
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
        { name: 'Instagram', url: 'https://instagram.com/rootlabs', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' }
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
        '#FF7A2D', // Orange
        '#7A9B76'  // Green
      ];

      return (
        <section ref={sectionRef} className="stats-section py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8">
              {stats.map((stat, idx) => {
                const color = statColors[idx % statColors.length];
                return (
                  <div 
                    key={idx} 
                    className="group relative"
                  >
                    {/* Decorative line on top */}
                    <div 
                      className="h-1 w-16 mb-6 rounded-full transition-all duration-500 group-hover:w-full"
                      style={{ background: color }}
                    />
                    
                    {/* Number */}
                    <div 
                      className="text-6xl md:text-7xl font-bold mb-3 transition-all duration-300 group-hover:scale-105"
                      style={{ 
                        color: color,
                        fontFamily: "'Space Grotesk', sans-serif"
                      }}
                    >
                      {counts[idx]}{stat.suffix}
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

    // Spotlight Stack Section
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
              <h2 className="journey-main-heading">{heading}</h2>
              {subheading && <p className="journey-subheading">{subheading}</p>}
            </header>

            <div className="journey-timeline-track">
              {/* Background line */}
              <div 
                className="timeline-line timeline-line-bg" 
                aria-hidden="true"
              ></div>
              {/* Progress fill */}
              <div 
                className="timeline-line timeline-line-progress" 
                style={{ 
                  height: `${scrollProgress * 100}%`
                }}
                aria-hidden="true"
              ></div>
              
              {journeySteps.map((step, idx) => (
                <div 
                  key={idx} 
                  ref={el => stepRefs.current[idx] = el}
                  className={`journey-step journey-step--${step.side} ${activeStep === idx ? 'journey-step--active' : ''}`}
                  role="listitem"
                  aria-label={`Step ${idx + 1}: ${step.phase}`}
                >
                  <div className="journey-content">
                    <span className="journey-phase">{step.phase}</span>
                    <h3 className="journey-title">{step.title}</h3>
                    <p className="journey-desc">{step.desc}</p>
                    
                    <div className="journey-metric" data-animated={hasAnimated[idx]}>
                      <div className="journey-metric-value">
                        {hasAnimated[idx] && counters[idx] > 0 ? (
                          <>
                            {counters[idx]}{step.unit}
                          </>
                        ) : (
                          <>
                            {step.metricText}{step.unit}
                          </>
                        )}
                      </div>
                      <div className="journey-metric-label">{step.metricLabel}</div>
                    </div>
                  </div>

                  <div className={`timeline-dot ${activeStep === idx ? 'timeline-dot--active' : ''}`} aria-hidden="true">
                    <div className="dot-inner"></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="journey-cta">
              <p className="journey-cta-text">Ready to start?</p>
              <a href="#pricing" className="journey-cta-button">
                Get Started
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
          
          {/* Hero Section */}
          <section ref={heroRef} className="service-page-hero min-h-screen flex items-center relative overflow-hidden pt-24">
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="blob absolute w-96 h-96 rounded-full" 
                   style={{ background: 'var(--mesh-tint)', top: '15%', left: '5%' }} />
              <div className="blob absolute w-80 h-80 rounded-full" 
                   style={{ background: 'var(--mesh-secondary)', bottom: '10%', right: '10%', animationDelay: '2s' }} />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="grid md:grid-cols-2 gap-12 items-center">

                <div className="space-y-8 stagger-item">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent-blue)' }} />
                    <span className="text-sm font-medium">AI-Powered Design</span>
                  </div>

                  <h1 className="text-5xl md:text-7xl font-bold leading-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                    Website
                    <span className="block mt-2" style={{ color: 'var(--primary)' }}>
                      Redesign
                    </span>
                  </h1>

                  <p className="text-xl leading-relaxed max-w-lg" style={{ color: 'var(--muted)' }}>
                    {subheading}
                  </p>

                  <div className="flex gap-4">
                    <a 
                      href="#pricing"
                      className="glow-on-hover relative px-8 py-4 rounded-full text-white font-semibold text-lg inline-flex items-center transition-all duration-300 hover:scale-105"
                      style={{ 
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-blue) 100%)',
                        boxShadow: '0 8px 24px rgba(138, 61, 230, 0.3)'
                      }}
                    >
                      View Pricing
                    </a>
                    <a href="#contact" className="btn-glass px-8 py-4 text-lg inline-flex items-center transition-all duration-300 hover:scale-105">
                      Contact Us
                    </a>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-6 pt-8">
                    <div className="text-center stagger-item" style={{ animationDelay: '0.3s' }}>
                      <div className="text-3xl font-bold" style={{ color: 'var(--primary)', fontFamily: "'Space Grotesk', sans-serif" }}>1-2</div>
                      <div className="text-sm" style={{ color: 'var(--muted)' }}>weeks delivery</div>
                    </div>
                    <div className="text-center stagger-item" style={{ animationDelay: '0.4s' }}>
                      <div className="text-3xl font-bold" style={{ color: 'var(--primary)', fontFamily: "'Space Grotesk', sans-serif" }}>50+</div>
                      <div className="text-sm" style={{ color: 'var(--muted)' }}>sites built</div>
                    </div>
                    <div className="text-center stagger-item" style={{ animationDelay: '0.5s' }}>
                      <div className="text-3xl font-bold" style={{ color: 'var(--primary)', fontFamily: "'Space Grotesk', sans-serif" }}>3x</div>
                      <div className="text-sm" style={{ color: 'var(--muted)' }}>conversions</div>
                    </div>
                  </div>
                </div>

                {/* Right: Layered Card Design */}
                <div 
                  className="relative h-[500px] rounded-3xl liquid-glass stagger-item hidden md:block"
                  style={{ 
                    animationDelay: '0.2s',
                    transform: `perspective(1000px) rotateY(${mousePos.x * 0.3}deg) rotateX(${-mousePos.y * 0.3}deg)`,
                    background: 'linear-gradient(135deg, rgba(138, 61, 230, 0.08) 0%, rgba(56, 189, 248, 0.08) 100%)'
                  }}
                >
                  <div className="absolute inset-0 p-12 flex flex-col justify-between">
                    {/* Layered grid mockup */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-3 rounded-full" style={{ background: 'linear-gradient(90deg, var(--primary) 0%, var(--accent-blue) 100%)' }}></div>
                      <div className="h-3 rounded-full col-span-2" style={{ background: 'rgba(255,255,255,0.1)' }}></div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-24 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-16 rounded-xl" style={{ background: 'rgba(138, 61, 230, 0.1)' }}></div>
                        <div className="h-16 rounded-xl" style={{ background: 'rgba(56, 189, 248, 0.1)' }}></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }}></div>
                      <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }}></div>
                      <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }}></div>
                      <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section - Alternating Layout */}
          <section className="py-24" style={{ background: 'var(--bg)' }}>
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
                  What You Get
                </h2>
                <p className="text-xl" style={{ color: 'var(--muted)' }}>
                  Everything you need to launch a stunning website
                </p>
              </div>

              {/* Alternating Feature Rows */}
              <div className="space-y-24">
                {/* Row 1 - Image Right */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="stagger-item">
                    <div className="inline-block px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(138, 61, 230, 0.1)', color: 'var(--primary)', fontSize: '0.875rem', fontWeight: '600' }}>
                      Speed & Performance
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>
                      Lightning Fast Delivery
                    </h3>
                    <p style={{ color: 'var(--muted)', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                      Most projects completed in 1-2 weeks. We use AI to accelerate design and development without compromising quality.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                        <span style={{ color: 'var(--text)' }}>AI-accelerated design process</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                        <span style={{ color: 'var(--text)' }}>Rapid prototyping and iteration</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                        <span style={{ color: 'var(--text)' }}>Fast loading speeds optimized</span>
                      </li>
                    </ul>
                  </div>
                  <div className="liquid-card p-8 stagger-item" style={{ animationDelay: '0.1s', height: '300px', background: 'linear-gradient(135deg, rgba(138, 61, 230, 0.05) 0%, rgba(56, 189, 248, 0.05) 100%)' }}>
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="text-6xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--primary)' }}>1-2</div>
                        <div style={{ color: 'var(--muted)' }}>weeks delivery</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 2 - Image Left */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="liquid-card p-8 stagger-item md:order-1 order-2" style={{ animationDelay: '0.2s', height: '300px', background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.05) 0%, rgba(138, 61, 230, 0.05) 100%)' }}>
                    <div className="h-full grid grid-cols-2 gap-4">
                      <div className="rounded-2xl" style={{ background: 'rgba(138, 61, 230, 0.1)' }}></div>
                      <div className="rounded-2xl" style={{ background: 'rgba(56, 189, 248, 0.1)' }}></div>
                      <div className="rounded-2xl col-span-2" style={{ background: 'rgba(138, 61, 230, 0.05)' }}></div>
                    </div>
                  </div>
                  <div className="stagger-item md:order-2 order-1" style={{ animationDelay: '0.15s' }}>
                    <div className="inline-block px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-blue)', fontSize: '0.875rem', fontWeight: '600' }}>
                      Design & Experience
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>
                      Modern Clean Design
                    </h3>
                    <p style={{ color: 'var(--muted)', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                      Clean, readable layouts that convert. We strip away clutter and focus on what matters: your message and your users.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5" style={{ color: 'var(--accent-blue)' }} />
                        <span style={{ color: 'var(--text)' }}>Conversion-focused layouts</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5" style={{ color: 'var(--accent-blue)' }} />
                        <span style={{ color: 'var(--text)' }}>Mobile-first responsive design</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5" style={{ color: 'var(--accent-blue)' }} />
                        <span style={{ color: 'var(--text)' }}>Smooth micro-interactions</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Row 3 - Image Right */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="stagger-item" style={{ animationDelay: '0.25s' }}>
                    <div className="inline-block px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(138, 61, 230, 0.1)', color: 'var(--primary)', fontSize: '0.875rem', fontWeight: '600' }}>
                      Results & Growth
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>
                      Conversion Focused
                    </h3>
                    <p style={{ color: 'var(--muted)', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                      Strategic CTAs and user flows designed to turn visitors into customers. Data-driven design that delivers results.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                        <span style={{ color: 'var(--text)' }}>Strategic call-to-action placement</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                        <span style={{ color: 'var(--text)' }}>SEO-optimized for search engines</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                        <span style={{ color: 'var(--text)' }}>Analytics integration included</span>
                      </li>
                    </ul>
                  </div>
                  <div className="liquid-card p-8 stagger-item" style={{ animationDelay: '0.3s', height: '300px', background: 'linear-gradient(135deg, rgba(138, 61, 230, 0.05) 0%, rgba(56, 189, 248, 0.05) 100%)' }}>
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="text-6xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--primary)' }}>3x</div>
                        <div style={{ color: 'var(--muted)' }}>avg. conversion increase</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Design Process Showcase */}
          <WebsitesProcess />

          {/* Pricing Preview */}
          <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(138, 61, 230, 0.05) 0%, rgba(56, 189, 248, 0.05) 100%)' }}></div>
            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
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
                    <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>{plan.name}</h3>
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
                        background: plan.popular ? 'linear-gradient(135deg, var(--primary) 0%, var(--accent-blue) 100%)' : 'rgba(138, 61, 230, 0.1)',
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
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent-blue)' }} />
                    <span className="text-sm font-medium">24/7 Automation</span>
                  </div>

                  <h1 className="text-5xl md:text-7xl font-bold leading-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
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
                      className="glow-on-hover relative px-8 py-4 rounded-full text-white font-semibold text-lg inline-flex items-center transition-all duration-300 hover:scale-105"
                      style={{ 
                        background: 'linear-gradient(135deg, var(--accent-blue) 0%, var(--primary) 100%)',
                        boxShadow: '0 8px 24px rgba(56, 189, 248, 0.3)'
                      }}
                    >
                      View Pricing
                    </a>
                    <a href="#contact" className="btn-glass px-8 py-4 text-lg inline-flex items-center transition-all duration-300 hover:scale-105">
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

                {/* Right: Animated Card */}
                <div 
                  className="relative h-[500px] rounded-3xl liquid-glass stagger-item hidden md:block"
                  style={{ 
                    animationDelay: '0.2s',
                    transform: `perspective(1000px) rotateY(${mousePos.x * 0.3}deg) rotateX(${-mousePos.y * 0.3}deg)`,
                    background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(138, 61, 230, 0.1) 100%)'
                  }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-12 gap-8">
                    {/* Animated Gradient Orbs */}
                    <div className="relative w-32 h-32">
                      <div className="absolute inset-0 rounded-full opacity-60 blur-2xl" 
                           style={{ background: 'radial-gradient(circle, var(--accent-blue) 0%, transparent 70%)', animation: 'pulse 3s ease-in-out infinite' }} />
                      <div className="absolute inset-4 rounded-full opacity-80 blur-xl" 
                           style={{ background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)', animation: 'pulse 3s ease-in-out infinite 0.5s' }} />
                      <div className="absolute inset-8 rounded-full" 
                           style={{ background: 'linear-gradient(135deg, var(--accent-blue) 0%, var(--primary) 100%)', boxShadow: '0 8px 32px rgba(56, 189, 248, 0.4)' }} />
                    </div>
                    <div className="text-center space-y-4">
                      <div className="text-3xl font-bold" style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text)' }}>
                        Intelligent Automation
                      </div>
                      <div className="text-lg" style={{ color: 'var(--muted)' }}>
                        AI that works 24/7 for you
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section - Bento Grid Layout */}
          <section className="py-32 relative overflow-hidden" style={{ background: 'var(--bg)' }}>
            {/* Ambient background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-3xl" 
                   style={{ background: 'radial-gradient(circle, var(--accent-blue) 0%, transparent 70%)' }} />
              <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-3xl" 
                   style={{ background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)' }} />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
              {/* Section Header */}
              <div className="text-center mb-16 stagger-item">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" 
                     style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent-blue)' }} />
                  <span className="text-sm font-semibold" style={{ color: 'var(--accent-blue)' }}>Intelligent Automation</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>
                  What Your AI Can Do
                </h2>
                <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>
                  From customer support to data analysisâ€”powerful capabilities that work 24/7
                </p>
              </div>

              {/* Bento Grid */}
              <div className="grid md:grid-cols-12 gap-6 mb-12">
                {/* Large Feature - Customer Support (spans 7 columns, 2 rows) */}
                <div 
                  className="md:col-span-7 md:row-span-2 rounded-3xl p-10 stagger-item relative overflow-hidden group"
                  style={{ 
                    animationDelay: '0.1s',
                    background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.08) 0%, rgba(138, 61, 230, 0.08) 100%)',
                    border: '1px solid rgba(56, 189, 248, 0.1)',
                    minHeight: '400px'
                  }}
                >
                  <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20 blur-3xl group-hover:opacity-30 transition-all" 
                       style={{ background: 'var(--accent-blue)' }} />
                  
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="mb-6">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" 
                           style={{ background: 'linear-gradient(135deg, var(--accent-blue) 0%, var(--primary) 100%)', opacity: 0.9 }}>
                        <div className="w-6 h-6 rounded-lg" style={{ background: 'rgba(255,255,255,0.95)' }} />
                      </div>
                      <h3 className="text-3xl font-bold mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>
                        Customer Support AI
                      </h3>
                      <p className="text-lg" style={{ color: 'var(--muted)', lineHeight: '1.7' }}>
                        Handle unlimited support tickets simultaneously. Answer FAQs, route complex issues, and maintain context across conversations.
                      </p>
                    </div>

                    <div className="mt-auto space-y-3">
                      <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text)' }}>
                        <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-blue)' }} />
                        <span>Instant 24/7 responses</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text)' }}>
                        <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-blue)' }} />
                        <span>Multi-language support</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text)' }}>
                        <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-blue)' }} />
                        <span>Sentiment analysis & escalation</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stat Card - Top Right (spans 5 columns) */}
                <div 
                  className="md:col-span-5 rounded-3xl p-8 stagger-item relative overflow-hidden group"
                  style={{ 
                    animationDelay: '0.2s',
                    background: 'linear-gradient(135deg, rgba(138, 61, 230, 0.08) 0%, rgba(56, 189, 248, 0.08) 100%)',
                    border: '1px solid rgba(138, 61, 230, 0.1)'
                  }}
                >
                  <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full opacity-20 blur-2xl group-hover:opacity-30 transition-all" 
                       style={{ background: 'var(--primary)' }} />
                  
                  <div className="relative z-10">
                    <div className="text-6xl font-bold mb-3" style={{ color: 'var(--accent-blue)', fontFamily: "'Space Grotesk', sans-serif" }}>
                      95%
                    </div>
                    <p className="text-lg font-semibold mb-2">Accuracy Rate</p>
                    <p className="text-sm" style={{ color: 'var(--muted)' }}>
                      Enterprise-grade AI with continuous learning
                    </p>
                  </div>
                </div>

                {/* Lead Qualification Card (spans 5 columns) */}
                <div 
                  className="md:col-span-5 rounded-3xl p-8 stagger-item relative overflow-hidden group"
                  style={{ 
                    animationDelay: '0.3s',
                    background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.05) 0%, rgba(138, 61, 230, 0.05) 100%)',
                    border: '1px solid rgba(56, 189, 248, 0.1)'
                  }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" 
                       style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-blue) 100%)', opacity: 0.9 }}>
                    <div className="w-5 h-5 rounded-full" style={{ background: 'rgba(255,255,255,0.95)' }} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>
                    Lead Qualification
                  </h3>
                  <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>
                    Score and route leads automatically. Integrate with your CRM and schedule meetings with qualified prospects.
                  </p>
                </div>

                {/* Data Analysis Card (spans 4 columns) */}
                <div 
                  className="md:col-span-4 rounded-3xl p-8 stagger-item relative overflow-hidden group"
                  style={{ 
                    animationDelay: '0.4s',
                    background: 'linear-gradient(135deg, rgba(138, 61, 230, 0.08) 0%, rgba(56, 189, 248, 0.08) 100%)',
                    border: '1px solid rgba(138, 61, 230, 0.1)'
                  }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" 
                       style={{ background: 'linear-gradient(135deg, var(--accent-blue) 0%, var(--primary) 100%)', opacity: 0.9 }}>
                    <div className="w-5 h-5" style={{ background: 'rgba(255,255,255,0.95)', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>
                    Data Analysis
                  </h3>
                  <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>
                    Ask questions in natural language. Get instant insights from your data.
                  </p>
                </div>

                {/* Performance Card (spans 4 columns) */}
                <div 
                  className="md:col-span-4 rounded-3xl p-8 stagger-item relative overflow-hidden"
                  style={{ 
                    animationDelay: '0.5s',
                    background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.05) 0%, rgba(138, 61, 230, 0.05) 100%)',
                    border: '1px solid rgba(56, 189, 248, 0.1)'
                  }}
                >
                  <div className="text-5xl font-bold mb-3" style={{ color: 'var(--primary)', fontFamily: "'Space Grotesk', sans-serif" }}>
                    &lt;1s
                  </div>
                  <p className="text-lg font-semibold mb-2">Response Time</p>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>
                    Lightning-fast answers, every time
                  </p>
                </div>

                {/* Multi-Channel Card (spans 4 columns) */}
                <div 
                  className="md:col-span-4 rounded-3xl p-8 stagger-item relative overflow-hidden group"
                  style={{ 
                    animationDelay: '0.6s',
                    background: 'linear-gradient(135deg, rgba(138, 61, 230, 0.05) 0%, rgba(56, 189, 248, 0.05) 100%)',
                    border: '1px solid rgba(138, 61, 230, 0.1)'
                  }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" 
                       style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-blue) 100%)', opacity: 0.9 }}>
                    <div className="w-5 h-5 rounded" style={{ background: 'rgba(255,255,255,0.95)' }} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>
                    Multi-Channel
                  </h3>
                  <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>
                    Deploy on web, Slack, email, SMSâ€”wherever your customers are.
                  </p>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="text-center stagger-item" style={{ animationDelay: '0.7s' }}>
                <a 
                  href="#pricing"
                  className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:scale-105"
                  style={{ 
                    background: 'linear-gradient(135deg, var(--accent-blue) 0%, var(--primary) 100%)', 
                    color: 'white',
                    boxShadow: '0 8px 32px rgba(56, 189, 248, 0.3)'
                  }}
                >
                  Build Your AI Agent
                  <ArrowRight className="w-6 h-6" />
                </a>
                <p className="mt-4 text-sm" style={{ color: 'var(--muted)' }}>
                  Start with a free consultation • No commitment required
                </p>
              </div>
            </div>
          </section>

          {/* Pricing Preview */}
          <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.05) 0%, rgba(138, 61, 230, 0.05) 100%)' }}></div>
            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
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
                    <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>{plan.name}</h3>
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
                        background: plan.popular ? 'linear-gradient(135deg, var(--accent-blue) 0%, var(--primary) 100%)' : 'rgba(56, 189, 248, 0.1)',
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
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#FF7A2D' }} />
                    <span className="text-sm font-medium">Full-Service Management</span>
                  </div>

                  <h1 className="text-5xl md:text-7xl font-bold leading-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
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
                      className="glow-on-hover relative px-8 py-4 rounded-full text-white font-semibold text-lg inline-flex items-center transition-all duration-300 hover:scale-105"
                      style={{ 
                        background: 'linear-gradient(135deg, #FF7A2D 0%, var(--primary) 100%)',
                        boxShadow: '0 8px 24px rgba(255, 122, 45, 0.3)'
                      }}
                    >
                      View Pricing
                    </a>
                    <a href="#contact" className="btn-glass px-8 py-4 text-lg inline-flex items-center transition-all duration-300 hover:scale-105">
                      Get Started
                    </a>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-6 pt-8">
                    <div className="text-center stagger-item" style={{ animationDelay: '0.3s' }}>
                      <div className="text-3xl font-bold" style={{ color: '#FF7A2D', fontFamily: "'Space Grotesk', sans-serif" }}>10K+</div>
                      <div className="text-sm" style={{ color: 'var(--muted)' }}>followers</div>
                    </div>
                    <div className="text-center stagger-item" style={{ animationDelay: '0.4s' }}>
                      <div className="text-3xl font-bold" style={{ color: '#FF7A2D', fontFamily: "'Space Grotesk', sans-serif" }}>24</div>
                      <div className="text-sm" style={{ color: 'var(--muted)' }}>posts/month</div>
                    </div>
                    <div className="text-center stagger-item" style={{ animationDelay: '0.5s' }}>
                      <div className="text-3xl font-bold" style={{ color: '#FF7A2D', fontFamily: "'Space Grotesk', sans-serif" }}>5x</div>
                      <div className="text-sm" style={{ color: 'var(--muted)' }}>engagement</div>
                    </div>
                  </div>
                </div>

                {/* Right: Fluid Organic Card */}
                <div 
                  className="relative h-[500px] rounded-3xl liquid-glass stagger-item hidden md:block"
                  style={{ 
                    animationDelay: '0.2s',
                    transform: `perspective(1000px) rotateY(${mousePos.x * 0.3}deg) rotateX(${-mousePos.y * 0.3}deg)`,
                    background: 'linear-gradient(135deg, rgba(255, 122, 45, 0.08) 0%, rgba(138, 61, 230, 0.08) 100%)'
                  }}
                >
                  <div className="absolute inset-0 p-12 flex flex-col items-center justify-center gap-12">
                    <div className="text-center space-y-4">
                      <div className="text-3xl font-bold" style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text)' }}>
                        Community Growth
                      </div>
                      <div className="text-lg" style={{ color: 'var(--muted)' }}>
                        Strategic engagement that scales
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section - Flowing Wave Layout */}
          <section className="py-32 relative overflow-hidden" style={{ background: 'var(--bg)' }}>
            <div className="max-w-6xl mx-auto px-6 relative z-10">
              {/* Hero Text */}
              <div className="text-center mb-24 stagger-item">
                <h2 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>
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
                    <h3 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>
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
                    <h3 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>
                      Build real relationships
                    </h3>
                    <p className="text-xl leading-relaxed" style={{ color: 'var(--muted)' }}>
                      We don't just post and ghost. We actively engage with your audienceâ€”responding to comments, DMs, and mentions. Building a loyal community that actually cares about your brand.
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
                    <h3 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>
                      Track what matters
                    </h3>
                    <p className="text-xl leading-relaxed mb-10" style={{ color: 'var(--muted)' }}>
                      Data-driven decisions, not guesswork. Monthly performance reports show exactly how your social presence is growingâ€”follower count, engagement rates, and actual business impact.
                    </p>
                    <div className="grid grid-cols-3 gap-8">
                      <div>
                        <div className="text-5xl font-bold mb-2" style={{ color: '#FF7A2D', fontFamily: "'Space Grotesk', sans-serif" }}>10K+</div>
                        <div style={{ color: 'var(--muted)' }}>Avg. Reach</div>
                      </div>
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
                    className="px-10 py-5 rounded-2xl font-bold text-lg inline-flex items-center gap-3 hover-elastic"
                    style={{ background: 'linear-gradient(135deg, #FF7A2D 0%, var(--primary) 100%)', color: 'white' }}
                  >
                    View Pricing Plans
                    <ArrowRight className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Preview */}
          <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255, 122, 45, 0.05) 0%, rgba(138, 61, 230, 0.05) 100%)' }}></div>
            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
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
                    <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>{plan.name}</h3>
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
                        background: plan.popular ? 'linear-gradient(135deg, #FF7A2D 0%, var(--primary) 100%)' : 'rgba(255, 122, 45, 0.1)',
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
          <SpotlightStack />
          <WhyUsPricing />
          <BentoPortfolio />
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
        { name: "Croissant au Beurre", price: "â‚¬3.50", description: "Buttery, flaky layers baked to golden perfection", image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500" },
        { name: "Pain de Campagne", price: "â‚¬5.20", description: "Rustic country bread with a crispy crust", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500" },
        { name: "Tarte aux Pommes", price: "â‚¬4.80", description: "Classic apple tart with vanilla glaze", image: "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=500" },
        { name: "Pain au Chocolat", price: "â‚¬3.80", description: "Dark chocolate wrapped in tender pastry", image: "https://images.unsplash.com/photo-1623334044303-241021148842?w=500" },
        { name: "Baguette Tradition", price: "â‚¬2.90", description: "Traditional French baguette, made daily", image: "https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=500" },
        { name: "Ã‰clair au CafÃ©", price: "â‚¬4.20", description: "Coffee cream filled choux with espresso glaze", image: "https://images.unsplash.com/photo-1612201142855-c7a22f14e0a9?w=500" }
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
              }, menuOpen ? 'âœ•' : 'â˜°')
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
                  'For three generations, our family has been perfecting the art of traditional French baking. Every loaf, every pastry, every delicate Ã©clair is crafted with the same care and dedication that our grandmother brought to her first bakery in the heart of Provence.'
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
                    ['ðŸ“', 'Address', '12 Rue de la Boulangerie\n06140 Provence, France'],
                    ['ðŸ•', 'Hours', 'Tuesday - Saturday: 6:00 AM - 7:00 PM\nSunday: 7:00 AM - 2:00 PM\nMonday: Closed'],
                    ['ðŸ“ž', 'Phone', '+33 4 93 12 34 56']
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
                      React.createElement('div', { style: { fontSize: '3rem', marginBottom: '0.5rem' } }, 'ðŸ“'),
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
            React.createElement('p', { style: { fontSize: '0.875rem', opacity: 0.7, margin: 0 } }, 'Â© 2025 Boulangerie Maison Â· A Rooted Labs Showcase'),
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
              <h1 className="text-6xl font-bold mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
                ðŸ’» Tech Haven
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
              <h1 className="text-6xl font-bold mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
                ðŸ½ï¸ Culinary Delight
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

