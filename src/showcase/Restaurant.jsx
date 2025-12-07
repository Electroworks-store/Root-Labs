import React, { useState, useEffect } from 'react';
import { ChefHat, Wine, Calendar, Users, Phone, MapPin, Star } from 'lucide-react';

const Restaurant = () => {
  const [scrollY, setScrollY] = useState(0);
  const [visible, setVisible] = useState({});
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Parallax scroll effect
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
            setVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Form state management
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    guests: '2',
    phone: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you ${formData.name}! Your reservation request has been received.`);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Carousel images and content
  const carouselImages = [
    {
      url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1600&q=80',
      title: 'The Dining Room',
      subtitle: 'Where elegance meets comfort'
    },
    {
      url: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=1600&q=80',
      title: 'Our Wine Collection',
      subtitle: 'Over 500 carefully curated bottles'
    },
    {
      url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600&q=80',
      title: 'The Open Kitchen',
      subtitle: 'Watch culinary artistry unfold'
    },
    {
      url: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=1600&q=80',
      title: 'Private Dining',
      subtitle: 'Intimate spaces for special occasions'
    }
  ];

  // Experience Carousel Component
  const ExperienceCarousel = () => (
    <div className="relative h-[600px] rounded-2xl overflow-hidden group">
      {/* Carousel Images */}
      {carouselImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === carouselIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img 
            src={image.url}
            alt={image.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Carousel Content */}
          <div className="absolute bottom-0 left-0 right-0 p-12">
            <h3 className="font-serif text-5xl text-[#FAF8F3] mb-4 transform transition-all duration-700" 
                style={{ 
                  fontFamily: 'Playfair Display, serif',
                  opacity: index === carouselIndex ? 1 : 0,
                  transform: index === carouselIndex ? 'translateY(0)' : 'translateY(20px)'
                }}>
              {image.title}
            </h3>
            <p className="text-xl text-[#FAF8F3]/80 transform transition-all duration-700 delay-100"
               style={{
                 opacity: index === carouselIndex ? 1 : 0,
                 transform: index === carouselIndex ? 'translateY(0)' : 'translateY(20px)'
               }}>
              {image.subtitle}
            </p>
          </div>
        </div>
      ))}
      
      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCarouselIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === carouselIndex 
                ? 'bg-[#D4AF37] w-8' 
                : 'bg-[#FAF8F3]/40 hover:bg-[#FAF8F3]/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Navigation Arrows */}
      <button
        onClick={() => setCarouselIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-[#1E2D2F]/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#D4AF37] hover:text-[#1E2D2F]"
        aria-label="Previous slide"
      >
        ←
      </button>
      <button
        onClick={() => setCarouselIndex((prev) => (prev + 1) % carouselImages.length)}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-[#1E2D2F]/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#D4AF37] hover:text-[#1E2D2F]"
        aria-label="Next slide"
      >
        →
      </button>
    </div>
  );

  return (
    <div className="bg-[#1E2D2F] text-[#FAF8F3] font-sans overflow-x-hidden">
      
      {/* ========== HERO SECTION ========== */}
      {/* Full-screen hero with parallax background effect and animated logo/tagline */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80')",
            transform: `translateY(${scrollY * 0.5}px)`,
            filter: 'brightness(0.4)'
          }}
        />
        
        {/* Gradient Overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#1E2D2F]" />
        
        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 animate-fade-in">
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <ChefHat className="w-16 h-16 text-[#D4AF37]" strokeWidth={1.5} />
          </div>
          
          {/* Restaurant Name - Elegant Serif */}
          <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl mb-4 text-[#FAF8F3] tracking-wide" 
              style={{ fontFamily: 'Playfair Display, serif' }}>
            Maison Vert
          </h1>
          
          {/* Decorative Gold Divider */}
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-6" />
          
          {/* Tagline */}
          <p className="text-2xl md:text-3xl text-[#D4AF37] mb-4 font-light tracking-widest">
            Where Craft Meets Cuisine
          </p>
          
          {/* Subtext */}
          <p className="text-lg md:text-xl text-[#FAF8F3]/80 max-w-2xl mx-auto font-light leading-relaxed">
            An unforgettable dining experience, rooted in taste and tradition
          </p>
        </div>
        
      </section>

      {/* ========== ABOUT THE CHEF / PHILOSOPHY ========== */}
      {/* Two-column layout with portrait and story, featuring gold dividers */}
      <section 
        id="about" 
        data-animate
        className={`py-24 px-4 md:px-8 bg-gradient-to-b from-[#1E2D2F] to-[#2B2B2B] transition-opacity duration-1000 ${visible.about ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Chef Portrait */}
            <div className="relative group">
              <div className="absolute inset-0 bg-[#D4AF37]/20 transform rotate-3 rounded-lg transition-transform group-hover:rotate-6" />
              <img 
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&q=80" 
                alt="Executive Chef"
                className="relative rounded-lg shadow-2xl w-full h-[600px] object-cover transform transition-transform group-hover:scale-[1.02]"
              />
              {/* Gold Corner Accent */}
              <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-[#D4AF37]" />
              <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-[#D4AF37]" />
            </div>
            
            {/* Chef Story & Philosophy */}
            <div className="space-y-6">
              <h2 className="font-serif text-5xl md:text-6xl text-[#D4AF37] mb-6" 
                  style={{ fontFamily: 'Playfair Display, serif' }}>
                Our Philosophy
              </h2>
              
              <div className="w-24 h-1 bg-gradient-to-r from-[#D4AF37] to-transparent mb-8" />
              
              <p className="text-lg text-[#FAF8F3]/90 leading-relaxed">
                At Maison Vert, we believe that dining is an art form—a symphony of flavors, textures, and stories woven together on every plate. Our culinary philosophy is rooted in seasonality, sustainability, and the relentless pursuit of perfection.
              </p>
              
              <p className="text-lg text-[#FAF8F3]/90 leading-relaxed">
                Executive Chef Alexandre Beaumont brings over two decades of Michelin-starred experience, combining classical French techniques with modern innovation. Each dish is a testament to his passion for sourcing the finest ingredients and honoring their natural essence.
              </p>
              
              <p className="text-lg text-[#FAF8F3]/90 leading-relaxed">
                We invite you to join us on a gastronomic journey where every course tells a story, and every bite creates a memory.
              </p>
              
              {/* Chef Signature */}
              <div className="pt-8">
                <p className="font-serif text-2xl text-[#D4AF37] italic" style={{ fontFamily: 'Playfair Display, serif' }}>
                  — Chef Alexandre Beaumont
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SIGNATURE DISHES ========== */}
      {/* Asymmetric grid layout with featured hero dish and staggered cards */}
      <section 
        id="menu" 
        data-animate
        className={`py-24 px-4 md:px-8 bg-[#1E2D2F] transition-opacity duration-1000 ${visible.menu ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-serif text-5xl md:text-6xl text-[#D4AF37] mb-4" 
                style={{ fontFamily: 'Playfair Display, serif' }}>
              Culinary Journey
            </h2>
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-6" />
            <p className="text-lg text-[#FAF8F3]/80 max-w-2xl mx-auto">
              Each course is a chapter in an unforgettable story
            </p>
          </div>
          
          {/* FEATURED HERO DISH - Full Width Spotlight */}
          <div className="mb-20 group relative overflow-hidden rounded-2xl shadow-2xl">
            <div className="grid md:grid-cols-2 gap-0 bg-[#2B2B2B]">
              
              {/* Image Side */}
              <div className="relative h-[400px] md:h-[500px] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80" 
                  alt="Beef Wellington"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute top-6 left-6 bg-[#D4AF37] text-[#1E2D2F] px-6 py-2 rounded-full font-semibold text-sm tracking-widest">
                  CHEF'S SIGNATURE
                </div>
                {/* Animated corner accents */}
                <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              
              {/* Content Side */}
              <div className="p-8 md:p-12 flex flex-col justify-center relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl" />
                
                <h3 className="font-serif text-4xl md:text-5xl text-[#FAF8F3] mb-4" 
                    style={{ fontFamily: 'Playfair Display, serif' }}>
                  Beef Wellington
                </h3>
                
                <div className="w-16 h-1 bg-[#D4AF37] mb-6" />
                
                <p className="text-[#FAF8F3]/80 text-lg mb-6 leading-relaxed">
                  Our most celebrated dish—Prime Angus tenderloin wrapped in wild mushroom duxelles 
                  and silky chicken liver pâté, encased in golden puff pastry. Served with roasted 
                  root vegetables and a decadent black truffle jus.
                </p>
                
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="text-[#D4AF37] font-serif text-4xl">$68</div>
                    <div className="text-[#FAF8F3]/50 text-sm">per person</div>
                  </div>
                  <Wine className="w-8 h-8 text-[#D4AF37]/60" />
                </div>
                
                <div className="bg-[#1E2D2F]/50 rounded-lg p-4 border-l-4 border-[#D4AF37]">
                  <p className="text-[#FAF8F3]/70 text-sm italic">
                    "A masterpiece that takes 48 hours to prepare. Each layer tells a story of patience, 
                    precision, and passion." — Chef Alexandre
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* APPETIZERS SECTION */}
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/30" />
              <h3 className="px-6 font-serif text-3xl text-[#D4AF37]" style={{ fontFamily: 'Playfair Display, serif' }}>
                First Course
              </h3>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/30" />
            </div>
            
            {/* Asymmetric Grid for Appetizers */}
            <div className="grid md:grid-cols-12 gap-6">
              
              {/* Card 1 - Takes 7 columns (larger) */}
              <div className="md:col-span-7 group relative bg-[#2B2B2B] rounded-xl overflow-hidden shadow-xl hover:shadow-[#D4AF37]/30 transition-all duration-500">
                <div className="md:flex">
                  <div className="relative md:w-1/2 h-64 md:h-auto overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80" 
                      alt="Seared Scallops"
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6 md:w-1/2 flex flex-col justify-center">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-serif text-2xl text-[#FAF8F3]" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Seared Scallops
                      </h4>
                      <div className="bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-1 rounded-full text-sm font-semibold ml-2">
                        $42
                      </div>
                    </div>
                    <p className="text-[#FAF8F3]/70 text-sm leading-relaxed mb-4">
                      Pan-seared diver scallops, cauliflower purée, crispy pancetta, brown butter emulsion, microgreens
                    </p>
                    <div className="flex items-center space-x-3 text-[#FAF8F3]/50 text-xs">
                      <span>🌊 Ocean Fresh</span>
                      <span>•</span>
                      <span>⭐ Guest Favorite</span>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#D4AF37]/40 rounded-xl transition-all duration-500 pointer-events-none" />
              </div>
              
              {/* Card 2 - Takes 5 columns (smaller) */}
              <div className="md:col-span-5 group relative bg-[#2B2B2B] rounded-xl overflow-hidden shadow-xl hover:shadow-[#D4AF37]/30 transition-all duration-500">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&q=80" 
                    alt="Foie Gras"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B] via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-serif text-xl text-[#FAF8F3]" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Foie Gras Torchon
                    </h4>
                    <div className="bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-1 rounded-full text-sm font-semibold ml-2">
                      $38
                    </div>
                  </div>
                  <p className="text-[#FAF8F3]/70 text-sm leading-relaxed">
                    Cognac-cured foie gras, brioche, fig compote, aged balsamic
                  </p>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#D4AF37]/40 rounded-xl transition-all duration-500 pointer-events-none" />
              </div>
            </div>
          </div>
          
          {/* MAIN COURSES SECTION */}
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/30" />
              <h3 className="px-6 font-serif text-3xl text-[#D4AF37]" style={{ fontFamily: 'Playfair Display, serif' }}>
                Main Event
              </h3>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/30" />
            </div>
            
            {/* Staggered 3-Column Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              
              {/* Card 1 - Standard height */}
              <div className="group relative bg-[#2B2B2B] rounded-xl overflow-hidden shadow-xl hover:shadow-[#D4AF37]/30 transition-all duration-500">
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80" 
                    alt="Lobster"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B] via-transparent to-transparent" />
                  <div className="absolute top-4 right-4 bg-[#5A2E2E] text-[#FAF8F3] px-4 py-1 rounded-full text-xs font-semibold">
                    LIMITED
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-serif text-2xl text-[#FAF8F3]" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Lobster Thermidor
                    </h4>
                    <div className="text-[#D4AF37] font-serif text-xl ml-2">$58</div>
                  </div>
                  <p className="text-[#FAF8F3]/70 text-sm leading-relaxed mb-3">
                    Atlantic lobster, cognac béchamel, gruyère, tarragon, brioche
                  </p>
                  <div className="pt-3 border-t border-[#D4AF37]/20">
                    <div className="flex items-center justify-between text-xs text-[#FAF8F3]/50">
                      <span>🦞 Sustainable Catch</span>
                      <Wine className="w-4 h-4 text-[#D4AF37]/60" />
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#D4AF37]/40 rounded-xl transition-all duration-500 pointer-events-none" />
              </div>
              
              {/* Card 2 - Taller (mt-6 creates stagger) */}
              <div className="md:mt-6 group relative bg-[#2B2B2B] rounded-xl overflow-hidden shadow-xl hover:shadow-[#D4AF37]/30 transition-all duration-500">
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1559311019-6781419cf96c?w=600&q=80" 
                    alt="Duck"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B] via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-serif text-2xl text-[#FAF8F3]" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Duck Confit
                    </h4>
                    <div className="text-[#D4AF37] font-serif text-xl ml-2">$46</div>
                  </div>
                  <p className="text-[#FAF8F3]/70 text-sm leading-relaxed mb-3">
                    Slow-cooked duck leg, fingerling potatoes, cherry gastrique, greens
                  </p>
                  <div className="pt-3 border-t border-[#D4AF37]/20">
                    <div className="flex items-center justify-between text-xs text-[#FAF8F3]/50">
                      <span className="flex items-center gap-1.5">
                        <Wine className="w-3.5 h-3.5 text-[#D4AF37]/60" />
                        Pairs with Pinot Noir
                      </span>
                      <Wine className="w-4 h-4 text-[#D4AF37]/60" />
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#D4AF37]/40 rounded-xl transition-all duration-500 pointer-events-none" />
              </div>
              
              {/* Card 3 - Standard height */}
              <div className="group relative bg-[#2B2B2B] rounded-xl overflow-hidden shadow-xl hover:shadow-[#D4AF37]/30 transition-all duration-500">
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600&q=80" 
                    alt="Risotto"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B] via-transparent to-transparent" />
                  <div className="absolute top-4 right-4 bg-[#1E2D2F] text-[#D4AF37] px-4 py-1 rounded-full text-xs font-semibold border border-[#D4AF37]/30">
                    VEGETARIAN
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-serif text-2xl text-[#FAF8F3]" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Truffle Risotto
                    </h4>
                    <div className="text-[#D4AF37] font-serif text-xl ml-2">$52</div>
                  </div>
                  <p className="text-[#FAF8F3]/70 text-sm leading-relaxed mb-3">
                    Carnaroli rice, Périgord truffle, parmesan, white wine, thyme
                  </p>
                  <div className="pt-3 border-t border-[#D4AF37]/20">
                    <div className="flex items-center justify-between text-xs text-[#FAF8F3]/50">
                      <span>🌱 Farm to Table</span>
                      <Wine className="w-4 h-4 text-[#D4AF37]/60" />
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#D4AF37]/40 rounded-xl transition-all duration-500 pointer-events-none" />
              </div>
            </div>
          </div>
          
          {/* DESSERTS SECTION */}
          <div>
            <div className="flex items-center mb-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/30" />
              <h3 className="px-6 font-serif text-3xl text-[#D4AF37]" style={{ fontFamily: 'Playfair Display, serif' }}>
                Sweet Finale
              </h3>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/30" />
            </div>
            
            {/* Horizontal Scroll Cards for Desserts */}
            <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scrollbar-hide">
              
              {/* Dessert Card 1 */}
              <div className="flex-shrink-0 w-80 snap-center group relative bg-[#2B2B2B] rounded-xl overflow-hidden shadow-xl hover:shadow-[#D4AF37]/30 transition-all duration-500">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80" 
                    alt="Chocolate Soufflé"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B] to-transparent" />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-serif text-xl text-[#FAF8F3]" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Chocolate Soufflé
                    </h4>
                    <div className="text-[#D4AF37] font-serif text-lg ml-2">$18</div>
                  </div>
                  <p className="text-[#FAF8F3]/70 text-sm leading-relaxed">
                    Valrhona dark chocolate, Grand Marnier, vanilla ice cream, gold leaf
                  </p>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#D4AF37]/40 rounded-xl transition-all duration-500 pointer-events-none" />
              </div>
              
              {/* Dessert Card 2 */}
              <div className="flex-shrink-0 w-80 snap-center group relative bg-[#2B2B2B] rounded-xl overflow-hidden shadow-xl hover:shadow-[#D4AF37]/30 transition-all duration-500">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80" 
                    alt="Crème Brûlée"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B] to-transparent" />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-serif text-xl text-[#FAF8F3]" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Crème Brûlée
                    </h4>
                    <div className="text-[#D4AF37] font-serif text-lg ml-2">$14</div>
                  </div>
                  <p className="text-[#FAF8F3]/70 text-sm leading-relaxed">
                    Classic vanilla custard, caramelized sugar, fresh berries
                  </p>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#D4AF37]/40 rounded-xl transition-all duration-500 pointer-events-none" />
              </div>
              
              {/* Dessert Card 3 */}
              <div className="flex-shrink-0 w-80 snap-center group relative bg-[#2B2B2B] rounded-xl overflow-hidden shadow-xl hover:shadow-[#D4AF37]/30 transition-all duration-500">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600&q=80" 
                    alt="Tarte Tatin"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B] to-transparent" />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-serif text-xl text-[#FAF8F3]" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Tarte Tatin
                    </h4>
                    <div className="text-[#D4AF37] font-serif text-lg ml-2">$16</div>
                  </div>
                  <p className="text-[#FAF8F3]/70 text-sm leading-relaxed">
                    Caramelized apple, puff pastry, crème fraîche, cinnamon
                  </p>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#D4AF37]/40 rounded-xl transition-all duration-500 pointer-events-none" />
              </div>
              
              {/* Dessert Card 4 */}
              <div className="flex-shrink-0 w-80 snap-center group relative bg-[#2B2B2B] rounded-xl overflow-hidden shadow-xl hover:shadow-[#D4AF37]/30 transition-all duration-500">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80" 
                    alt="Opera Cake"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B] to-transparent" />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-serif text-xl text-[#FAF8F3]" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Opera Cake
                    </h4>
                    <div className="text-[#D4AF37] font-serif text-lg ml-2">$15</div>
                  </div>
                  <p className="text-[#FAF8F3]/70 text-sm leading-relaxed">
                    Almond sponge, coffee buttercream, chocolate ganache
                  </p>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#D4AF37]/40 rounded-xl transition-all duration-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== EXPERIENCE SECTION - COMPLETELY REDESIGNED ========== */}
      {/* Immersive cinematic experience with carousel, testimonials, and interactive elements */}
      <section 
        id="gallery" 
        data-animate
        className={`py-24 px-4 md:px-8 bg-gradient-to-b from-[#2B2B2B] to-[#1E2D2F] transition-opacity duration-1000 ${visible.gallery ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-serif text-5xl md:text-6xl text-[#D4AF37] mb-4" 
                style={{ fontFamily: 'Playfair Display, serif' }}>
              The Maison Vert Experience
            </h2>
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-6" />
            <p className="text-lg text-[#FAF8F3]/80 max-w-2xl mx-auto">
              Step into an evening where every detail is orchestrated to perfection
            </p>
          </div>
          
          {/* FULL-WIDTH CINEMATIC CAROUSEL */}
          <ExperienceCarousel />
          
          {/* SPLIT-SCREEN PARALLAX SECTION */}
          <div className="mt-20 grid md:grid-cols-2 gap-8 mb-20">
            
            {/* Left Side - The Ambiance */}
            <div className="relative group overflow-hidden rounded-2xl h-[500px]">
              <div 
                className="absolute inset-0 bg-cover bg-center transform transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80')",
                  transform: `translateY(${scrollY * 0.1}px)`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E2D2F] via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="font-serif text-4xl text-[#FAF8F3] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  The Ambiance
                </h3>
                <p className="text-[#FAF8F3]/80 leading-relaxed">
                  Intimate lighting, hand-selected music, and architecture that whispers elegance. 
                  Every corner of Maison Vert is designed to transport you.
                </p>
              </div>
              {/* Decorative gold corners */}
              <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            
            {/* Right Side - The Craft */}
            <div className="relative group overflow-hidden rounded-2xl h-[500px]">
              <div 
                className="absolute inset-0 bg-cover bg-center transform transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=1200&q=80')",
                  transform: `translateY(${scrollY * -0.1}px)`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E2D2F] via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="font-serif text-4xl text-[#FAF8F3] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  The Craft
                </h3>
                <p className="text-[#FAF8F3]/80 leading-relaxed">
                  Watch our culinary artists at work in the open kitchen. Every plate is a 
                  performance, every technique honed over decades of dedication.
                </p>
              </div>
              <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
          
          {/* TESTIMONIALS SECTION */}
          <div className="relative py-20">
            {/* Decorative background elements */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10">
              <h3 className="font-serif text-4xl text-center text-[#D4AF37] mb-16" 
                  style={{ fontFamily: 'Playfair Display, serif' }}>
                What Our Guests Say
              </h3>
              
              <div className="grid md:grid-cols-3 gap-8">
                
                {/* Testimonial 1 */}
                <div className="bg-[#2B2B2B]/50 backdrop-blur-sm rounded-2xl p-8 border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all duration-500 hover:transform hover:scale-105">
                  <div className="flex items-center mb-6">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-[#D4AF37] text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-[#FAF8F3]/80 italic leading-relaxed mb-6">
                    "An absolutely transcendent experience. The beef wellington was a masterpiece, 
                    and the service made us feel like royalty. We'll be back for every anniversary."
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                      <span className="text-[#D4AF37] font-serif text-xl">J</span>
                    </div>
                    <div>
                      <p className="text-[#FAF8F3] font-semibold">James Patterson</p>
                      <p className="text-[#FAF8F3]/50 text-sm">New York, NY</p>
                    </div>
                  </div>
                </div>
                
                {/* Testimonial 2 */}
                <div className="bg-[#2B2B2B]/50 backdrop-blur-sm rounded-2xl p-8 border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all duration-500 hover:transform hover:scale-105">
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]" />
                    ))}
                  </div>
                  <p className="text-[#FAF8F3]/80 italic leading-relaxed mb-6">
                    "Chef Alexandre's creativity knows no bounds. Each course was a revelation. 
                    The wine pairings were perfection. This is fine dining at its absolute finest."
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                      <span className="text-[#D4AF37] font-serif text-xl">M</span>
                    </div>
                    <div>
                      <p className="text-[#FAF8F3] font-semibold">Maria Gonzalez</p>
                      <p className="text-[#FAF8F3]/50 text-sm">San Francisco, CA</p>
                    </div>
                  </div>
                </div>
                
                {/* Testimonial 3 */}
                <div className="bg-[#2B2B2B]/50 backdrop-blur-sm rounded-2xl p-8 border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all duration-500 hover:transform hover:scale-105">
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]" />
                    ))}
                  </div>
                  <p className="text-[#FAF8F3]/80 italic leading-relaxed mb-6">
                    "From the moment we walked in, we knew this would be special. The attention 
                    to detail, the flavors, the atmosphere—everything was impeccable. A must-visit."
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                      <span className="text-[#D4AF37] font-serif text-xl">R</span>
                    </div>
                    <div>
                      <p className="text-[#FAF8F3] font-semibold">Robert Chen</p>
                      <p className="text-[#FAF8F3]/50 text-sm">Chicago, IL</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* AN EVENING AT MAISON VERT - Timeline */}
          <div className="mt-24">
            <h3 className="font-serif text-4xl text-center text-[#D4AF37] mb-16" 
                style={{ fontFamily: 'Playfair Display, serif' }}>
              An Evening at Maison Vert
            </h3>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-gradient-to-b from-[#D4AF37] via-[#D4AF37]/50 to-transparent hidden md:block" />
              
              {/* Timeline Items */}
              <div className="space-y-16">
                
                {/* Timeline Item 1 - Left */}
                <div className="relative grid md:grid-cols-2 gap-8 items-center">
                  <div className="md:text-right">
                    <div className="bg-[#2B2B2B]/70 backdrop-blur-sm rounded-xl p-6 border border-[#D4AF37]/20 inline-block">
                      <h4 className="font-serif text-2xl text-[#D4AF37] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                        5:30 PM • Arrival
                      </h4>
                      <p className="text-[#FAF8F3]/80 leading-relaxed">
                        You're greeted with a glass of champagne as you're escorted to your table. 
                        Candlelight dances across white linen.
                      </p>
                    </div>
                  </div>
                  <div className="relative h-64 rounded-xl overflow-hidden group">
                    <img 
                      src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80" 
                      alt="Arrival"
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#D4AF37] rounded-full border-4 border-[#1E2D2F] hidden md:block" />
                </div>
                
                {/* Timeline Item 2 - Right */}
                <div className="relative grid md:grid-cols-2 gap-8 items-center">
                  <div className="md:order-2">
                    <div className="bg-[#2B2B2B]/70 backdrop-blur-sm rounded-xl p-6 border border-[#D4AF37]/20 inline-block">
                      <h4 className="font-serif text-2xl text-[#D4AF37] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                        6:00 PM • Amuse-Bouche
                      </h4>
                      <p className="text-[#FAF8F3]/80 leading-relaxed">
                        A surprise from the chef—a single perfect bite that awakens your palate 
                        and sets the tone for the evening ahead.
                      </p>
                    </div>
                  </div>
                  <div className="relative h-64 rounded-xl overflow-hidden group md:order-1">
                    <img 
                      src="https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800&q=80" 
                      alt="Amuse-Bouche"
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#D4AF37] rounded-full border-4 border-[#1E2D2F] hidden md:block" />
                </div>
                
                {/* Timeline Item 3 - Left */}
                <div className="relative grid md:grid-cols-2 gap-8 items-center">
                  <div className="md:text-right">
                    <div className="bg-[#2B2B2B]/70 backdrop-blur-sm rounded-xl p-6 border border-[#D4AF37]/20 inline-block">
                      <h4 className="font-serif text-2xl text-[#D4AF37] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                        7:00 PM • The Main Event
                      </h4>
                      <p className="text-[#FAF8F3]/80 leading-relaxed">
                        Your entrée arrives—a work of art on a plate. Every element is intentional, 
                        every flavor balanced to perfection.
                      </p>
                    </div>
                  </div>
                  <div className="relative h-64 rounded-xl overflow-hidden group">
                    <img 
                      src="https://images.unsplash.com/photo-1559311019-6781419cf96c?w=800&q=80" 
                      alt="Main Course"
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#D4AF37] rounded-full border-4 border-[#1E2D2F] hidden md:block" />
                </div>
                
                {/* Timeline Item 4 - Right */}
                <div className="relative grid md:grid-cols-2 gap-8 items-center">
                  <div className="md:order-2">
                    <div className="bg-[#2B2B2B]/70 backdrop-blur-sm rounded-xl p-6 border border-[#D4AF37]/20 inline-block">
                      <h4 className="font-serif text-2xl text-[#D4AF37] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                        8:30 PM • The Finale
                      </h4>
                      <p className="text-[#FAF8F3]/80 leading-relaxed">
                        Dessert arrives with theatrical flair—perhaps a soufflé that rises before 
                        your eyes, or a delicate creation that melts on your tongue.
                      </p>
                    </div>
                  </div>
                  <div className="relative h-64 rounded-xl overflow-hidden group md:order-1">
                    <img 
                      src="https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80" 
                      alt="Dessert"
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#D4AF37] rounded-full border-4 border-[#1E2D2F] hidden md:block" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== RESERVATION SECTION ========== */}
      {/* Booking form with glass-morphism design and golden CTA button */}
      <section 
        id="reservation" 
        data-animate
        className={`py-24 px-4 md:px-8 relative overflow-hidden transition-opacity duration-1000 ${visible.reservation ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Blurred Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1600&q=80')",
            filter: 'blur(8px) brightness(0.3)'
          }}
        />
        
        <div className="relative z-10 max-w-3xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="font-serif text-5xl md:text-6xl text-[#D4AF37] mb-4" 
                style={{ fontFamily: 'Playfair Display, serif' }}>
              Reserve Your Table
            </h2>
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-6" />
            <p className="text-lg text-[#FAF8F3]/90">
              Join us for an evening of exceptional cuisine and unforgettable moments
            </p>
          </div>
          
          {/* Glass-morphism Form Container */}
          <div className="bg-[#1E2D2F]/80 backdrop-blur-lg rounded-2xl p-8 md:p-12 shadow-2xl border border-[#D4AF37]/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Name Input */}
              <div>
                <label className="block text-[#FAF8F3]/80 text-sm mb-2 tracking-wide">Your Name</label>
                <input 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#2B2B2B]/50 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-[#FAF8F3] placeholder-[#FAF8F3]/40 focus:outline-none focus:border-[#D4AF37] transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
              
              {/* Date and Guests Row */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Date Input */}
                <div>
                  <label className="block text-[#FAF8F3]/80 text-sm mb-2 tracking-wide">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#D4AF37]/60" />
                    <input 
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#2B2B2B]/50 border border-[#D4AF37]/30 rounded-lg pl-12 pr-4 py-3 text-[#FAF8F3] focus:outline-none focus:border-[#D4AF37] transition-colors"
                    />
                  </div>
                </div>
                
                {/* Guests Input */}
                <div>
                  <label className="block text-[#FAF8F3]/80 text-sm mb-2 tracking-wide">Number of Guests</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#D4AF37]/60" />
                    <select 
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      className="w-full bg-[#2B2B2B]/50 border border-[#D4AF37]/30 rounded-lg pl-12 pr-4 py-3 text-[#FAF8F3] focus:outline-none focus:border-[#D4AF37] transition-colors appearance-none cursor-pointer"
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="5">5 Guests</option>
                      <option value="6">6 Guests</option>
                      <option value="7+">7+ Guests</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Phone Input */}
              <div>
                <label className="block text-[#FAF8F3]/80 text-sm mb-2 tracking-wide">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#D4AF37]/60" />
                  <input 
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#2B2B2B]/50 border border-[#D4AF37]/30 rounded-lg pl-12 pr-4 py-3 text-[#FAF8F3] placeholder-[#FAF8F3]/40 focus:outline-none focus:border-[#D4AF37] transition-colors"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              
              {/* Submit Button with Gold Gradient */}
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-[#1E2D2F] font-semibold py-4 rounded-lg hover:shadow-lg hover:shadow-[#D4AF37]/50 transform hover:scale-[1.02] transition-all duration-300 tracking-wide text-lg"
              >
                Book Your Table
              </button>
              
              {/* Additional Info */}
              <p className="text-center text-[#FAF8F3]/60 text-sm mt-6">
                For parties of 8 or more, please call us directly at <span className="text-[#D4AF37]">(555) 123-4567</span>
              </p>
            </form>
          </div>
          
          {/* Contact Information Cards */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            
            {/* Location Card */}
            <div className="bg-[#1E2D2F]/60 backdrop-blur-lg rounded-lg p-6 border border-[#D4AF37]/20 flex items-start space-x-4">
              <MapPin className="w-6 h-6 text-[#D4AF37] flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-[#D4AF37] font-serif text-xl mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Location
                </h3>
                <p className="text-[#FAF8F3]/80 text-sm leading-relaxed">
                  123 Culinary Boulevard<br />
                  Downtown District<br />
                  Metropolitan City, 10001
                </p>
              </div>
            </div>
            
            {/* Hours Card */}
            <div className="bg-[#1E2D2F]/60 backdrop-blur-lg rounded-lg p-6 border border-[#D4AF37]/20 flex items-start space-x-4">
              <Phone className="w-6 h-6 text-[#D4AF37] flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-[#D4AF37] font-serif text-xl mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Hours
                </h3>
                <p className="text-[#FAF8F3]/80 text-sm leading-relaxed">
                  Tuesday - Saturday<br />
                  5:30 PM - 11:00 PM<br />
                  <span className="text-[#FAF8F3]/60">Closed Sunday & Monday</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      {/* Simple elegant footer with copyright and Rooted Labs credit */}
      <footer className="bg-[#1E2D2F] border-t border-[#D4AF37]/20 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Footer Content Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            
            {/* Brand Column */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <ChefHat className="w-8 h-8 text-[#D4AF37]" strokeWidth={1.5} />
                <h3 className="font-serif text-2xl text-[#D4AF37]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Maison Vert
                </h3>
              </div>
              <p className="text-[#FAF8F3]/60 text-sm leading-relaxed">
                Where craft meets cuisine. An unforgettable dining experience rooted in taste and tradition.
              </p>
            </div>
            
            {/* Quick Links Column */}
            <div>
              <h4 className="text-[#D4AF37] font-semibold mb-4 tracking-wide">Quick Links</h4>
              <ul className="space-y-2 text-[#FAF8F3]/60 text-sm">
                <li><a href="#about" className="hover:text-[#D4AF37] transition-colors">About Us</a></li>
                <li><a href="#menu" className="hover:text-[#D4AF37] transition-colors">Menu</a></li>
                <li><a href="#gallery" className="hover:text-[#D4AF37] transition-colors">Gallery</a></li>
                <li><a href="#reservation" className="hover:text-[#D4AF37] transition-colors">Reservations</a></li>
              </ul>
            </div>
            
            {/* Connect Column */}
            <div>
              <h4 className="text-[#D4AF37] font-semibold mb-4 tracking-wide">Connect</h4>
              <ul className="space-y-2 text-[#FAF8F3]/60 text-sm">
                <li>Email: info@maisonvert.com</li>
                <li>Phone: (555) 123-4567</li>
                <li className="pt-2">
                  <div className="flex space-x-4">
                    <a href="#" className="text-[#FAF8F3]/60 hover:text-[#D4AF37] transition-colors">Instagram</a>
                    <a href="#" className="text-[#FAF8F3]/60 hover:text-[#D4AF37] transition-colors">Facebook</a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent mb-8" />
          
          {/* Back Button */}
          <div className="text-center mb-8">
            <a
              href="/#work"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1E2D2F]/50 backdrop-blur-sm border border-[#D4AF37]/30 text-[#FAF8F3] font-medium text-sm transition-all hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]"
            >
              ← Back to Recent Transformations
            </a>
          </div>
          
          {/* Copyright & Credit */}
          <div className="text-center text-[#FAF8F3]/50 text-sm">
            <p>© 2025 Maison Vert. All rights reserved.</p>
            <p className="mt-2 flex items-center justify-center gap-2">
              <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
              <span>Root Labs Showcase – Restaurant Demo</span>
              <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
            </p>
          </div>
        </div>
      </footer>

      {/* ========== CUSTOM CSS ANIMATIONS ========== */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap');
        
        body {
          font-family: 'Lato', sans-serif;
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1.5s ease-out;
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
          background: #1E2D2F;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #D4AF37;
          border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #B8941F;
        }
        
        /* Hide scrollbar for horizontal scroll desserts */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Restaurant;