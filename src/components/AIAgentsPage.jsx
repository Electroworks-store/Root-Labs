import { useState, useEffect, useRef } from 'react';
import { Check, ArrowRight, Zap, PenTool, MessageCircle, BarChart3 } from 'lucide-react';
import logoClean from '../../img/Rootlabs-logo-xbg.png';

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

// AI Agents Service Page (disconnected - for future use)
// To re-enable, import this component in App.jsx and add route: if (path === '/ai') return <AIAgentsPage />;
// Requires FloatingNav, Contact, and Footer components to be passed as props or imported.
export default function AIAgentsPage({ FloatingNav, Contact, Footer }) {
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
              From customer support to data analysis—powerful capabilities that work 24/7
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
              Start with a free consultation — No commitment required
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Preview - AI Page */}
      <section className="rl-pricing-section">
        <div className="rl-pricing-container">
          <div className="rl-pricing-header">
            <div className="rl-pricing-eyebrow">Packages</div>
            <h2 className="rl-pricing-title">Pick your <em>agent</em>.</h2>
            <p className="rl-pricing-subtitle">Scale as you grow with transparent pricing.</p>
          </div>

          <div className="rl-pricing-grid">
            {plans.map((plan, idx) => (
              <article
                key={idx}
                className={`rl-pricing-card ${plan.popular ? 'rl-pricing-card--featured' : ''}`}
                style={{ '--i': idx }}
                onClick={(ev) => {
                  const grid = ev.currentTarget.parentElement;
                  if (!grid || !grid.classList.contains('is-flipped')) return;
                  if (ev.target.closest('a, button')) return;
                  ev.currentTarget.classList.toggle('is-face-down');
                }}
              >
                <div className="rl-pricing-card-inner">
                <div className="rl-pricing-card-back" aria-hidden="true">
                  <span className="rl-pricing-card-back-flourish rl-fl-tl" />
                  <span className="rl-pricing-card-back-flourish rl-fl-tr" />
                  <span className="rl-pricing-card-back-flourish rl-fl-bl" />
                  <span className="rl-pricing-card-back-flourish rl-fl-br" />
                  <span className="rl-pricing-card-back-medallion">R</span>
                </div>
                <div className="rl-pricing-card-front">
                <h3 className="rl-pricing-name">{plan.name}</h3>

                <div className="rl-pricing-price-row">
                  <span className="rl-pricing-price">${plan.monthly.toLocaleString()}</span>
                  <span className="rl-pricing-suffix">/ month</span>
                </div>
                <p className="rl-pricing-tagline">
                  {plan.setup > 0
                    ? `+ $${plan.setup.toLocaleString()} one-time setup.`
                    : 'No setup fees. Cancel anytime.'}
                </p>

                <hr className="rl-pricing-divider" />

                <ul className="rl-pricing-features">
                  {plan.features.slice(0, 4).map((feature, fIdx) => (
                    <li key={fIdx}>{feature}</li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={`rl-pricing-cta ${plan.popular ? 'rl-pricing-cta--dark' : ''}`}
                >
                  {plan.cta || 'Start now'}
                </a>
                </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Contact />
      <Footer />
    </div>
  );
}
