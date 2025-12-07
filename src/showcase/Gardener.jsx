import React, { useState, useEffect, useRef } from 'react';
import { Leaf, Sprout, TreeDeciduous, Calendar, Mail, Phone, MapPin, ChevronDown, CheckCircle } from 'lucide-react';

const GardenerWebsite = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const [isVisible, setIsVisible] = useState({});
  const observerRefs = useRef([]);

  // Smooth scroll tracking for parallax effects
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    observerRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Form state management
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = () => {
    if (formData.name && formData.email && formData.message) {
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({ name: '', email: '', message: '' });
      }, 3000);
    }
  };

  // Services data
  const services = [
    {
      icon: <Leaf className="w-12 h-12" />,
      title: "Garden Design",
      description: "Bespoke landscape designs that harmonize with your space and lifestyle, creating outdoor sanctuaries."
    },
    {
      icon: <Sprout className="w-12 h-12" />,
      title: "Maintenance",
      description: "Regular care and nurturing to keep your garden thriving through every season."
    },
    {
      icon: <TreeDeciduous className="w-12 h-12" />,
      title: "Tree Planting",
      description: "Strategic tree selection and planting for shade, beauty, and environmental impact."
    },
    {
      icon: <Calendar className="w-12 h-12" />,
      title: "Seasonal Care",
      description: "Expert seasonal preparations, from spring blooms to winter protection strategies."
    }
  ];

  // Project gallery data
  const projects = [
    {
      title: "Urban Oasis",
      description: "Transforming a city courtyard into a lush retreat",
      image: "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800&q=80"
    },
    {
      title: "Courtyard Renewal",
      description: "Modern minimalist garden with native plants",
      image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80"
    },
    {
      title: "Meadow Garden",
      description: "Wildflower paradise for pollinators",
      image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80"
    },
    {
      title: "Zen Sanctuary",
      description: "Japanese-inspired meditation space",
      image: "https://images.unsplash.com/photo-1591958911259-bee2173bdccc?w=800&q=80"
    },
    {
      title: "Rooftop Haven",
      description: "Elevated urban garden with city views",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80"
    },
    {
      title: "Cottage Garden",
      description: "Traditional English garden revival",
      image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&q=80"
    }
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "They transformed our bare yard into a thriving ecosystem. Every plant has a purpose, and it feels like nature itself designed it.",
      author: "Sarah Mitchell",
      role: "Homeowner"
    },
    {
      quote: "Professional, knowledgeable, and deeply passionate. Our garden has never looked better, and maintenance is surprisingly manageable.",
      author: "David Chen",
      role: "Restaurant Owner"
    }
  ];

  return (
    <div className="font-sans text-gray-800 overflow-x-hidden">
      {/* 
        ======================
        HERO SECTION 
        ======================
        Full-screen immersive introduction with parallax scrolling effect.
        Background image moves slower than foreground content for depth.
      */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1920&q=80')",
            transform: `translateY(${scrollY * 0.5}px)`,
            filter: 'brightness(0.7)'
          }}
        />
        
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        
        {/* Hero content */}
        <div className="relative z-10 text-center px-4 max-w-4xl">
          {/* Logo with organic animation */}
          <div className="mb-6 flex justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-6 border-2 border-white/30">
              <Leaf className="w-16 h-16 text-white animate-pulse" />
            </div>
          </div>
          
          {/* Main heading with decorative font */}
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Root & Bloom
          </h1>
          
          {/* Tagline */}
          <p className="text-2xl md:text-3xl text-white/90 mb-4 font-light">
            Crafting gardens that grow with you
          </p>
          
          {/* Subtext */}
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Sustainable, personalized gardening and landscape design
          </p>
          
          {/* Call-to-action button with hover effect */}
          <button 
            onClick={() => document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' })}
            className="bg-[#A3B18A] hover:bg-[#708C69] text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            View Our Work
          </button>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/70" />
        </div>
      </section>

      {/* 
        ======================
        ABOUT SECTION 
        ======================
        Split layout introducing the philosophy and approach.
        Paper texture background for organic feel.
      */}
      <section 
        id="about"
        ref={(el) => (observerRefs.current[0] = el)}
        className={`py-20 px-4 bg-[#F4F1ED] transition-all duration-1000 ${
          isVisible.about ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image side with subtle shadow */}
            <div className="relative">
              <div className="absolute inset-0 bg-[#A3B18A]/20 rounded-3xl transform rotate-3" />
              <img 
                src="https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=800&q=80"
                alt="Gardener at work"
                className="relative rounded-3xl shadow-2xl w-full h-96 object-cover"
              />
            </div>
            
            {/* Content side */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#344E41] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Growing with Purpose
              </h2>
              
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>
                  At Root & Bloom, we believe every garden tells a story. Our approach combines 
                  traditional craftsmanship with sustainable practices, creating landscapes that 
                  not only beautify but also nurture local ecosystems.
                </p>
                
                <p>
                  With over a decade of experience, we've learned that the best gardens are born 
                  from patience, attention to soil health, and a deep respect for the natural 
                  rhythms of growth. We don't just plant gardens—we cultivate relationships 
                  between people and the earth beneath their feet.
                </p>
                
                <p className="font-medium text-[#708C69]">
                  Every project is a collaboration, every plant has a purpose, and every garden 
                  becomes a living legacy.
                </p>
              </div>
              
              {/* Stats with organic icons */}
              <div className="grid grid-cols-3 gap-6 mt-10">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#936639]">12+</div>
                  <div className="text-sm text-gray-600 mt-1">Years Growing</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#936639]">200+</div>
                  <div className="text-sm text-gray-600 mt-1">Gardens Created</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#936639]">500+</div>
                  <div className="text-sm text-gray-600 mt-1">Trees Planted</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ======================
        SERVICES SECTION 
        ======================
        Card-based layout with hover interactions.
        Each service has an icon, title, and description.
      */}
      <section 
        id="services"
        ref={(el) => (observerRefs.current[1] = el)}
        className={`py-20 px-4 bg-white transition-all duration-1000 ${
          isVisible.services ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#344E41] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive gardening solutions tailored to your unique outdoor space
            </p>
          </div>
          
          {/* Services grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, idx) => (
              <div 
                key={idx}
                className="bg-[#F4F1ED] rounded-2xl p-8 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-white group cursor-pointer"
              >
                {/* Icon with color transition on hover */}
                <div className="inline-flex items-center justify-center mb-6 text-[#708C69] group-hover:text-[#A3B18A] transition-colors duration-300">
                  {service.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-[#344E41] mb-3">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
                
                {/* Decorative accent line */}
                <div className="mt-6 w-16 h-1 bg-[#A3B18A] mx-auto rounded-full group-hover:w-24 transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
        ======================
        PROJECT GALLERY 
        ======================
        Masonry-style grid with hover overlays.
        Images fade in on scroll for smooth UX.
      */}
      <section 
        id="gallery"
        ref={(el) => (observerRefs.current[2] = el)}
        className={`py-20 px-4 bg-gradient-to-b from-white to-[#F4F1ED] transition-all duration-1000 ${
          isVisible.gallery ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#344E41] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Recent Projects
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From intimate courtyards to expansive estates, each project reflects our commitment to natural beauty
            </p>
          </div>
          
          {/* Gallery grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, idx) => (
              <div 
                key={idx}
                className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer h-80"
                style={{ 
                  animationDelay: `${idx * 100}ms`,
                  animation: isVisible.gallery ? 'fadeInUp 0.6s ease-out forwards' : 'none'
                }}
              >
                {/* Project image */}
                <img 
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay with gradient and text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-white/90">
                    {project.description}
                  </p>
                </div>
                
                {/* Corner accent */}
                <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
        ======================
        TESTIMONIALS & VALUES 
        ======================
        Centered testimonial carousel with sustainability promise.
      */}
      <section 
        id="testimonials"
        ref={(el) => (observerRefs.current[3] = el)}
        className={`py-20 px-4 bg-[#344E41] text-white transition-all duration-1000 ${
          isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Voices from the Garden
            </h2>
            <p className="text-xl text-white/80">
              What our clients say about working with us
            </p>
          </div>
          
          {/* Testimonials */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {testimonials.map((testimonial, idx) => (
              <div 
                key={idx}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
              >
                <div className="text-5xl text-[#A3B18A] mb-4">"</div>
                <p className="text-lg leading-relaxed mb-6 italic">
                  {testimonial.quote}
                </p>
                <div className="border-t border-white/20 pt-4">
                  <div className="font-bold">{testimonial.author}</div>
                  <div className="text-white/70 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Sustainability promise */}
          <div className="bg-[#A3B18A]/20 rounded-2xl p-10 border border-[#A3B18A]/30">
            <h3 className="text-3xl font-bold mb-6 text-center">Our Sustainability Promise</h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <CheckCircle className="w-10 h-10 mx-auto mb-3 text-[#A3B18A]" />
                <h4 className="font-bold mb-2">Native Plants First</h4>
                <p className="text-white/80 text-sm">Supporting local ecosystems and biodiversity</p>
              </div>
              <div>
                <CheckCircle className="w-10 h-10 mx-auto mb-3 text-[#A3B18A]" />
                <h4 className="font-bold mb-2">Water Conservation</h4>
                <p className="text-white/80 text-sm">Smart irrigation and drought-tolerant design</p>
              </div>
              <div>
                <CheckCircle className="w-10 h-10 mx-auto mb-3 text-[#A3B18A]" />
                <h4 className="font-bold mb-2">Organic Practices</h4>
                <p className="text-white/80 text-sm">Chemical-free care for healthier soil and plants</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ======================
        CONTACT / CTA SECTION 
        ======================
        Final call-to-action with contact form.
        Gradient background for visual warmth.
      */}
      <section 
        id="contact"
        ref={(el) => (observerRefs.current[4] = el)}
        className={`py-20 px-4 bg-gradient-to-br from-[#344E41] via-[#708C69] to-[#A3B18A] text-white transition-all duration-1000 ${
          isVisible.contact ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Let's Grow Together
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Ready to transform your outdoor space? Share your vision with us and let's cultivate something beautiful.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact form */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              {!formSubmitted ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Name</label>
                    <input 
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#A3B18A]"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <input 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#A3B18A]"
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Vision</label>
                    <textarea 
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      rows="5"
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#A3B18A] resize-none"
                      placeholder="Tell us about your garden dreams..."
                    />
                  </div>
                  
                  <button 
                    onClick={handleSubmit}
                    className="w-full bg-white text-[#344E41] py-4 rounded-lg font-bold text-lg hover:bg-[#F4F1ED] transition-colors duration-300"
                  >
                    Send Message
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-12">
                  <CheckCircle className="w-20 h-20 text-[#A3B18A] mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Message Received!</h3>
                  <p className="text-white/80 text-center">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                </div>
              )}
            </div>
            
            {/* Contact information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <Mail className="w-6 h-6 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Email Us</div>
                      <a href="mailto:hello@rootandbloom.com" className="text-white/80 hover:text-white transition-colors">
                        hello@rootandbloom.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Phone className="w-6 h-6 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Call Us</div>
                      <a href="tel:+15551234567" className="text-white/80 hover:text-white transition-colors">
                        (555) 123-4567
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Visit Us</div>
                      <p className="text-white/80">
                        123 Garden Lane<br />
                        Green Valley, CA 94000
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Business hours */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h4 className="font-bold mb-3">Business Hours</h4>
                <div className="space-y-2 text-white/80">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>8am - 6pm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>9am - 4pm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ======================
        FOOTER 
        ======================
        Simple footer with branding and credits.
      */}
      <footer className="bg-[#344E41] text-white py-8 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Leaf className="w-6 h-6 text-[#A3B18A]" />
            <span className="text-xl font-bold">Root & Bloom</span>
          </div>
          <p className="text-white/60 text-sm mb-2">
            Crafting gardens that grow with you since 2013
          </p>
          <p className="text-white/40 text-xs">
            © 2025 Rooted Labs Showcase – Gardener Demo Website
          </p>
        </div>
      </footer>

      {/* CSS for animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Poppins:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Poppins', sans-serif;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: #F4F1ED;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #A3B18A;
          border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #708C69;
        }
      `}</style>
    </div>
  );
};

export default GardenerWebsite;