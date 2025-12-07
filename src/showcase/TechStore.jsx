import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Zap, Leaf, Cpu, ShoppingCart, Star, Users, Package, ArrowRight, Mail, MapPin, Plus, Minus, Trash2, Check } from 'lucide-react';

export default function TechStore() {
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [devicesSold, setDevicesSold] = useState(0);
  const [projects, setProjects] = useState(0);
  const [rating, setRating] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState(null);
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const heroRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse tracking for hero parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll handler for parallax effects
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection observer for stats animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !statsVisible) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [statsVisible]);

  // Animated counters
  useEffect(() => {
    if (!statsVisible) return;

    const duration = 2000;
    const fps = 60;
    const frames = (duration / 1000) * fps;

    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      const progress = frame / frames;

      setDevicesSold(Math.floor(progress * 50000));
      setProjects(Math.floor(progress * 1200));
      setRating(Math.min(progress * 4.9, 4.9));

      if (frame >= frames) clearInterval(interval);
    }, 1000 / fps);

    return () => clearInterval(interval);
  }, [statsVisible]);

  // Shopping cart functions
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.name === product.name);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.name === product.name 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    // Show notification
    setNotification(`Added ${product.name} to cart`);
    setTimeout(() => setNotification(null), 3000);
  };

  const updateQuantity = (productName, change) => {
    setCart(cart.map(item => {
      if (item.name === productName) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productName) => {
    setCart(cart.filter(item => item.name !== productName));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price.replace('$', '').replace(',', ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Product data
  const products = [
    {
      name: "NexBook Pro 16",
      category: "Laptop",
      price: "$2,499",
      description: "M3 Ultra chip, 32GB RAM, 1TB SSD",
      specs: ["16-inch Retina Display", "20-hour battery", "Thunderbolt 4"],
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
      gradient: "from-blue-500/20 to-purple-500/20"
    },
    {
      name: "AeroSound Elite",
      category: "Headphones",
      price: "$349",
      description: "Active noise cancellation, 40hr battery",
      specs: ["Spatial Audio", "Premium leather", "USB-C charging"],
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
      gradient: "from-cyan-500/20 to-blue-500/20"
    },
    {
      name: "PulseWatch Ultra",
      category: "Smartwatch",
      price: "$599",
      description: "Health tracking, GPS, waterproof",
      specs: ["ECG monitoring", "Blood oxygen", "50m water resistant"],
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
      gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
      name: "MechKey Pro",
      category: "Keyboard",
      price: "$189",
      description: "Mechanical switches, RGB backlight",
      specs: ["Hot-swappable", "Wireless/Wired", "Programmable keys"],
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
      gradient: "from-green-500/20 to-cyan-500/20"
    }
  ];

  // Innovation features
  const innovations = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Ultra Fast",
      description: "Next-gen processors delivering 3x performance",
      stat: "3x faster"
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Sustainably Built",
      description: "100% recycled materials, carbon neutral",
      stat: "100% green"
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "Smart AI Integration",
      description: "Adaptive learning for personalized experience",
      stat: "AI-powered"
    }
  ];

  return (
    <div className="bg-[#0F0F10] text-white font-sans overflow-x-hidden">
      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes ping-slower {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes slide-in {
          from { transform: translateX(400px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-gradient-x { animation: gradient-x 3s ease infinite; background-size: 200% 200%; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
        .animate-ping-slow { animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animate-ping-slower { animation: ping-slower 4s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-24 right-4 z-50 bg-gradient-to-r from-[#00AEEF] to-blue-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-in">
          <Check className="w-5 h-5" />
          <span className="font-semibold">{notification}</span>
        </div>
      )}

      {/* Shopping Cart Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-[#1C1C1E] z-50 transform transition-transform duration-300 ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        } border-l border-[#00AEEF]/30 overflow-y-auto`}
      >
        <div className="p-6">
          {/* Cart Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#00AEEF]/20">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-[#00AEEF]" />
              Your Cart
            </h3>
            <button 
              onClick={() => setCartOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#00AEEF]/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items */}
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-[#C0C0C0]/30" />
              <p className="text-[#C0C0C0]">Your cart is empty</p>
              <p className="text-sm text-[#C0C0C0]/60 mt-2">Add some products to get started</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cart.map((item, idx) => (
                  <div key={idx} className="bg-[#0F0F10] rounded-xl p-4 border border-[#00AEEF]/20">
                    <div className="flex gap-4">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{item.name}</h4>
                        <p className="text-sm text-[#C0C0C0] mb-2">{item.category}</p>
                        <p className="text-[#00AEEF] font-bold">{item.price}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.name)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#00AEEF]/10">
                      <span className="text-sm text-[#C0C0C0]">Quantity</span>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => updateQuantity(item.name, -1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#00AEEF]/10 hover:bg-[#00AEEF]/20 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.name, 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#00AEEF]/10 hover:bg-[#00AEEF]/20 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Total */}
              <div className="border-t border-[#00AEEF]/20 pt-6 space-y-4">
                <div className="flex justify-between text-lg">
                  <span className="text-[#C0C0C0]">Subtotal</span>
                  <span className="font-bold">${getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#C0C0C0]">Shipping</span>
                  <span className="text-[#00AEEF]">Free</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t border-[#00AEEF]/20 pt-4">
                  <span>Total</span>
                  <span className="text-[#00AEEF]">${getTotalPrice().toLocaleString()}</span>
                </div>
                <button className="w-full py-4 bg-gradient-to-r from-[#00AEEF] to-blue-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#00AEEF]/50 transition-all">
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Cart overlay backdrop */}
      {cartOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#0F0F10]/95 backdrop-blur-xl z-40 border-b border-[#00AEEF]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-[#00AEEF] to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-[#00AEEF]/30">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="absolute inset-0 bg-[#00AEEF] rounded-xl blur-lg opacity-30" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  NEX<span className="text-[#00AEEF]">TECH</span>
                </h1>
                <p className="text-xs text-[#C0C0C0]">Future Tech Store</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#products" className="text-[#C0C0C0] hover:text-[#00AEEF] transition-colors relative group">
                Products
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00AEEF] group-hover:w-full transition-all" />
              </a>
              <a href="#innovations" className="text-[#C0C0C0] hover:text-[#00AEEF] transition-colors relative group">
                Innovation
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00AEEF] group-hover:w-full transition-all" />
              </a>
              <a href="#experience" className="text-[#C0C0C0] hover:text-[#00AEEF] transition-colors relative group">
                Experience
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00AEEF] group-hover:w-full transition-all" />
              </a>
              <a href="#contact" className="text-[#C0C0C0] hover:text-[#00AEEF] transition-colors relative group">
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00AEEF] group-hover:w-full transition-all" />
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setCartOpen(true)}
                className="relative text-[#C0C0C0] hover:text-white transition-colors group"
              >
                <ShoppingCart size={24} />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-[#00AEEF] to-blue-600 rounded-full text-xs flex items-center justify-center font-bold shadow-lg">
                    {getTotalItems()}
                  </span>
                )}
              </button>
              
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden text-white"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden bg-[#1C1C1E] border-t border-[#00AEEF]/10">
            <div className="px-4 py-4 space-y-3">
              <a href="#products" className="block text-[#C0C0C0] hover:text-[#00AEEF] py-2" onClick={() => setMenuOpen(false)}>Products</a>
              <a href="#innovations" className="block text-[#C0C0C0] hover:text-[#00AEEF] py-2" onClick={() => setMenuOpen(false)}>Innovation</a>
              <a href="#experience" className="block text-[#C0C0C0] hover:text-[#00AEEF] py-2" onClick={() => setMenuOpen(false)}>Experience</a>
              <a href="#contact" className="block text-[#C0C0C0] hover:text-[#00AEEF] py-2" onClick={() => setMenuOpen(false)}>Contact</a>
            </div>
          </div>
        )}
      </nav>

      {/* Revolutionary Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      >
        {/* Layered background effects */}
        <div className="absolute inset-0">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F0F10] via-[#1C1C1E] to-[#0F0F10]" />
          
          {/* Animated mesh gradient */}
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              background: `radial-gradient(circle at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%, #00AEEF 0%, transparent 50%),
                           radial-gradient(circle at ${30 + mousePosition.x * 15}% ${70 + mousePosition.y * 15}%, #0066ff 0%, transparent 50%)`,
              filter: 'blur(80px)'
            }}
          />
          
          {/* Geometric grid overlay */}
          <div className="absolute inset-0">
            <svg className="w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00AEEF" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          {/* Floating orbs */}
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#00AEEF]/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-float-slow" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00AEEF]/10 border border-[#00AEEF]/30 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-[#00AEEF] rounded-full animate-pulse" />
                <span className="text-sm text-[#00AEEF] font-semibold">Now Available</span>
              </div>

              {/* Main heading with gradient text */}
              <div>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                  The Future
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00AEEF] via-blue-400 to-purple-400 animate-gradient-x">
                    in Your Hands
                  </span>
                </h1>
                <p className="text-xl text-[#C0C0C0] leading-relaxed max-w-xl">
                  Experience cutting-edge technology that adapts to your life. Designed for creators, built for innovators.
                </p>
              </div>

              {/* Feature highlights */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#1C1C1E]/60 backdrop-blur-sm p-4 rounded-xl border border-[#00AEEF]/20">
                  <div className="text-2xl font-bold text-[#00AEEF] mb-1">3x</div>
                  <div className="text-xs text-[#C0C0C0]">Faster Performance</div>
                </div>
                <div className="bg-[#1C1C1E]/60 backdrop-blur-sm p-4 rounded-xl border border-[#00AEEF]/20">
                  <div className="text-2xl font-bold text-[#00AEEF] mb-1">24/7</div>
                  <div className="text-xs text-[#C0C0C0]">Expert Support</div>
                </div>
                <div className="bg-[#1C1C1E]/60 backdrop-blur-sm p-4 rounded-xl border border-[#00AEEF]/20">
                  <div className="text-2xl font-bold text-[#00AEEF] mb-1">100%</div>
                  <div className="text-xs text-[#C0C0C0]">Carbon Neutral</div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="#products"
                  className="group relative px-8 py-4 bg-gradient-to-r from-[#00AEEF] to-blue-600 rounded-xl font-semibold overflow-hidden shadow-xl shadow-[#00AEEF]/30 hover:shadow-2xl hover:shadow-[#00AEEF]/50 transition-all"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Explore Products
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                </a>
                
                <a 
                  href="#innovations"
                  className="px-8 py-4 border-2 border-[#00AEEF] rounded-xl font-semibold hover:bg-[#00AEEF]/10 transition-all backdrop-blur-sm text-center"
                >
                  Learn More
                </a>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00AEEF] to-blue-600 border-2 border-[#0F0F10] flex items-center justify-center text-xs font-bold">
                      {i}K
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#00AEEF] text-[#00AEEF]" />
                    ))}
                  </div>
                  <p className="text-sm text-[#C0C0C0]">Trusted by 50,000+ customers</p>
                </div>
              </div>
            </div>

            {/* Right: Product showcase with 3D effect */}
            <div className="relative lg:h-[600px] flex items-center justify-center">
              {/* Glow rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-[500px] h-[500px] border border-[#00AEEF]/20 rounded-full animate-ping-slow" />
                <div className="absolute w-[400px] h-[400px] border border-[#00AEEF]/30 rounded-full animate-ping-slower" />
                <div className="absolute w-[300px] h-[300px] border border-[#00AEEF]/40 rounded-full" />
              </div>

              {/* Main product image with mouse parallax */}
              <div 
                className="relative z-10 transform transition-transform duration-300 ease-out"
                style={{
                  transform: `
                    perspective(1000px) 
                    rotateY(${mousePosition.x * 10}deg) 
                    rotateX(${-mousePosition.y * 10}deg)
                    translateZ(50px)
                  `
                }}
              >
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1468436139062-f60a71c5c892?w=800"
                    alt="Featured Device"
                    className="w-full max-w-md rounded-2xl shadow-2xl"
                  />
                  
                  {/* Holographic overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#00AEEF]/20 via-transparent to-purple-500/20 rounded-2xl opacity-60" />
                  
                  {/* Reflection effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent rounded-2xl" />
                </div>

                {/* Floating spec cards */}
                <div 
                  className="absolute -left-12 top-1/4 bg-[#1C1C1E]/90 backdrop-blur-lg p-4 rounded-xl border border-[#00AEEF]/30 shadow-xl max-w-[150px]"
                  style={{
                    transform: `translateZ(100px) translateX(${mousePosition.x * 20}px)`
                  }}
                >
                  <Cpu className="w-6 h-6 text-[#00AEEF] mb-2" />
                  <div className="text-xs font-semibold mb-1">M3 Ultra</div>
                  <div className="text-xs text-[#C0C0C0]">Next-gen processing</div>
                </div>

                <div 
                  className="absolute -right-12 bottom-1/4 bg-[#1C1C1E]/90 backdrop-blur-lg p-4 rounded-xl border border-[#00AEEF]/30 shadow-xl max-w-[150px]"
                  style={{
                    transform: `translateZ(100px) translateX(${mousePosition.x * -20}px)`
                  }}
                >
                  <Zap className="w-6 h-6 text-[#00AEEF] mb-2" />
                  <div className="text-xs font-semibold mb-1">All-Day Battery</div>
                  <div className="text-xs text-[#C0C0C0]">Up to 24 hours</div>
                </div>
              </div>

              {/* Ambient light effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#00AEEF]/10 via-transparent to-purple-500/10 blur-3xl" />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-6 h-10 border-2 border-[#00AEEF]/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-[#00AEEF] rounded-full" />
          </div>
          <span className="text-xs text-[#C0C0C0]">Scroll</span>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Featured <span className="text-[#00AEEF]">Products</span>
            </h2>
            <p className="text-[#C0C0C0] text-lg">Experience the cutting edge of technology</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredProduct(idx)}
                onMouseLeave={() => setHoveredProduct(null)}
                className="group relative bg-[#1C1C1E] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2"
              >
                {/* Glowing border on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />
                
                <div className="relative bg-[#1C1C1E] rounded-2xl overflow-hidden border border-transparent group-hover:border-[#00AEEF]/50 transition-colors">
                  {/* Product image */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E] to-transparent" />
                    
                    {/* Category badge */}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-[#00AEEF]/20 backdrop-blur-sm border border-[#00AEEF]/30 rounded-full text-xs text-[#00AEEF] font-semibold">
                      {product.category}
                    </div>
                  </div>

                  {/* Product info */}
                  <div className="relative p-6">
                    <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                    <p className="text-[#C0C0C0] text-sm mb-4">{product.description}</p>
                    
                    {/* Specs list */}
                    <div className="space-y-1 mb-4">
                      {product.specs.map((spec, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-[#C0C0C0]">
                          <div className="w-1 h-1 bg-[#00AEEF] rounded-full" />
                          {spec}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-[#00AEEF]">{product.price}</span>
                      <button 
                        onClick={() => addToCart(product)}
                        className="w-10 h-10 bg-[#00AEEF] rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors transform group-hover:scale-110"
                      >
                        <ShoppingCart size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Hidden details on hover */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#00AEEF]/95 to-transparent p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <button 
                      onClick={() => addToCart(product)}
                      className="w-full py-3 bg-white text-[#0F0F10] rounded-lg font-semibold hover:bg-[#C0C0C0] transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={18} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Specs / Innovations */}
      <section id="innovations" className="relative py-20 px-4 bg-[#1C1C1E]/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Built for <span className="text-[#00AEEF]">Tomorrow</span>
            </h2>
            <p className="text-[#C0C0C0] text-lg">Innovation that sets new standards</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {innovations.map((innovation, idx) => (
              <div
                key={idx}
                className="group relative bg-[#1C1C1E] rounded-2xl p-8 border border-[#00AEEF]/20 hover:border-[#00AEEF] transition-all duration-500 hover:-translate-y-2"
              >
                {/* Icon with glow effect */}
                <div className="mb-6 relative inline-block">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#00AEEF] to-blue-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    {innovation.icon}
                  </div>
                  <div className="absolute inset-0 bg-[#00AEEF] blur-xl opacity-0 group-hover:opacity-50 transition-opacity rounded-xl" />
                </div>

                <div className="inline-block px-3 py-1 bg-[#00AEEF]/10 border border-[#00AEEF]/30 rounded-full text-xs text-[#00AEEF] font-semibold mb-4">
                  {innovation.stat}
                </div>

                <h3 className="text-2xl font-bold mb-3">{innovation.title}</h3>
                <p className="text-[#C0C0C0]">{innovation.description}</p>

                {/* Animated corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-[#00AEEF] rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Experience Section */}
      <section id="experience" className="relative py-20 px-4" ref={statsRef}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image side */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800"
                  alt="Tech Store Interior"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#00AEEF]/30 to-transparent" />
              </div>
              {/* Floating glow accent */}
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#00AEEF]/20 rounded-full blur-3xl" />
            </div>

            {/* Content side */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Why Choose <span className="text-[#00AEEF]">NexTech</span>
                </h2>
                <p className="text-[#C0C0C0] text-lg leading-relaxed">
                  We're not just selling devices — we're delivering experiences. Every product is carefully 
                  curated to meet the demands of modern creators, professionals, and tech enthusiasts.
                </p>
              </div>

              {/* Animated stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#00AEEF] mb-2">
                    {devicesSold.toLocaleString()}+
                  </div>
                  <p className="text-[#C0C0C0] text-sm flex items-center justify-center gap-1">
                    <Package size={16} />
                    Devices Sold
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#00AEEF] mb-2">
                    {projects.toLocaleString()}+
                  </div>
                  <p className="text-[#C0C0C0] text-sm flex items-center justify-center gap-1">
                    <Users size={16} />
                    Projects
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#00AEEF] mb-2">
                    {rating.toFixed(1)}
                  </div>
                  <p className="text-[#C0C0C0] text-sm flex items-center justify-center gap-1">
                    <Star size={16} />
                    Avg Rating
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-[#1C1C1E] rounded-lg border border-[#00AEEF]/20">
                  <div className="w-10 h-10 bg-[#00AEEF]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-[#00AEEF]" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Fast Delivery</h4>
                    <p className="text-[#C0C0C0] text-sm">Same-day delivery available in major cities</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-[#1C1C1E] rounded-lg border border-[#00AEEF]/20">
                  <div className="w-10 h-10 bg-[#00AEEF]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-[#00AEEF]" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Expert Support</h4>
                    <p className="text-[#C0C0C0] text-sm">24/7 technical assistance from certified professionals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-20 px-4 bg-[#1C1C1E]/30">
        {/* Neon line effects */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#00AEEF] to-transparent" />
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#00AEEF] to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Visit Our <span className="text-[#00AEEF]">Flagship Store</span>
            </h2>
            <p className="text-[#C0C0C0] text-lg">Experience the future of technology in person</p>
          </div>

          <div className="bg-[#1C1C1E] rounded-2xl p-8 md:p-12 border border-[#00AEEF]/30 relative overflow-hidden">
            {/* Glow effect */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#00AEEF]/10 rounded-full blur-3xl" />
            
            <div className="relative space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#00AEEF]/20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-[#00AEEF]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#C0C0C0]">Address</p>
                    <p className="font-semibold">1234 Tech Boulevard, Silicon Valley, CA 94025</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#00AEEF]/20 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-[#00AEEF]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#C0C0C0]">Email</p>
                    <p className="font-semibold">hello@nextech.store</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button className="w-full py-4 bg-gradient-to-r from-[#00AEEF] to-blue-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-[#00AEEF]/50 transition-all group">
                  <span className="flex items-center justify-center gap-2">
                    Get Directions
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 border-t border-[#1C1C1E]">
        <div className="max-w-7xl mx-auto text-center">
          <a
            href="/#work"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1C1C1E] border border-[#00AEEF]/30 text-white font-medium text-sm transition-all hover:bg-[#00AEEF]/10 hover:border-[#00AEEF] mb-8"
          >
            ← Back to Recent Transformations
          </a>
          <p className="text-[#C0C0C0] text-sm">
            © 2025 NexTech Store · A Root Labs Showcase
          </p>
          <p className="text-[#C0C0C0]/50 text-xs mt-2">
            This is a design demonstration, not a real business
          </p>
        </div>
      </footer>
    </div>
  );
}