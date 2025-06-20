import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp, Shield, Zap, Menu, X, Github, Twitter, Linkedin, Play, Pause } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAnimationToggle } from '@/hooks/useAnimationToggle';
const LandingPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    isAnimationEnabled,
    toggleAnimation,
    showToggle
  } = useAnimationToggle();
  const animationInitRef = useRef<boolean>(false);
  useEffect(() => {
    const timer = setInterval(() => {
      const elements = document.querySelectorAll('.ascii-animation');
      elements.forEach(el => {
        el.classList.toggle('animate-pulse');
      });
    }, 2000);

    // Enhanced Unicorn Studio initialization with navigation fix
    const initializeAnimation = () => {
      // Reset animation state on each page load
      animationInitRef.current = false;
      if (!window.UnicornStudio) {
        window.UnicornStudio = {
          isInitialized: false,
          init: () => {}
        };
      }

      // Force reinitialize if already exists
      if (window.UnicornStudio.isInitialized) {
        window.UnicornStudio.isInitialized = false;
      }
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.25/dist/unicornStudio.umd.js";
      script.onload = function () {
        if (!animationInitRef.current) {
          try {
            window.UnicornStudio.init();
            window.UnicornStudio.isInitialized = true;
            animationInitRef.current = true;
          } catch (error) {
            console.log('Animation initialization skipped');
          }
        }
      };

      // Remove existing script if present
      const existingScript = document.querySelector('script[src*="unicornStudio"]');
      if (existingScript) {
        existingScript.remove();
      }
      (document.head || document.body).appendChild(script);
    };

    // Initialize animation with a small delay to ensure DOM is ready
    const initTimer = setTimeout(initializeAnimation, 100);
    return () => {
      clearInterval(timer);
      clearTimeout(initTimer);
    };
  }, []); // Empty dependency array ensures this runs on every mount

  // Additional effect to handle animation state changes
  useEffect(() => {
    if (isAnimationEnabled && !animationInitRef.current) {
      // Re-attempt initialization if animation is enabled but not initialized
      const retryTimer = setTimeout(() => {
        if (window.UnicornStudio && !animationInitRef.current) {
          try {
            window.UnicornStudio.init();
            animationInitRef.current = true;
          } catch (error) {
            console.log('Animation retry failed, but continuing');
          }
        }
      }, 500);
      return () => clearTimeout(retryTimer);
    }
  }, [isAnimationEnabled]);
  const features = [{
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Portfolio Tracking",
    description: "Track your crypto, stocks, and liquid assets in real-time with beautiful visualizations."
  }, {
    icon: <Shield className="h-6 w-6" />,
    title: "Privacy First",
    description: "Your data stays local. Optional cloud sync with end-to-end encryption for peace of mind."
  }, {
    icon: <Zap className="h-6 w-6" />,
    title: "Lightning Fast",
    description: "Built for speed with modern web technologies. No lag, just pure performance."
  }];
  return (
    <>
      {/* SEO Meta Tags */}
      <title>OPEN FINDASH | Free Financial Dashboard & Crypto Portfolio Tracker</title>
      <meta name="description" content="Free, open-source financial dashboard for tracking crypto, assets, income & expenses. Privacy-first with optional cloud sync. Start building wealth today!" />
      <meta name="keywords" content="financial dashboard, crypto tracker, portfolio management, open source, privacy-first, wealth tracking, free finance app" />
      
      <div className="min-h-screen bg-background text-foreground font-mono overflow-x-hidden">
        {/* Navigation - Made sticky with backdrop blur */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <img 
                  src="/lovable-uploads/a9b55d65-1fdb-426f-b462-5b057df47bd9.png" 
                  alt="Open Findash Logo" 
                  className="h-4 w-auto"
                />
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-6">
                <a href="#features" className="hover:text-accent transition-colors">Features</a>
                <a href="#about" className="hover:text-accent transition-colors">About</a>
                <Button onClick={() => navigate('/auth')} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Get Started <ArrowRight size={16} className="ml-1" />
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && <div className="md:hidden border-t border-border bg-card/90 backdrop-blur-sm">
                <div className="px-4 py-4 space-y-3">
                  <a href="#features" className="block py-2 hover:text-accent transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Features
                  </a>
                  <a href="#about" className="block py-2 hover:text-accent transition-colors" onClick={() => setIsMenuOpen(false)}>
                    About
                  </a>
                  <Button onClick={() => navigate('/auth')} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 mt-2">
                    Get Started <ArrowRight size={16} className="ml-1" />
                  </Button>
                </div>
              </div>}
          </div>
        </nav>

        {/* Hero Section - Added top padding for fixed navbar */}
        <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          {/* Animation Toggle for All Devices with Tooltip */}
          {showToggle && (
            <div className="fixed top-20 right-4 z-40">
              <Button 
                onClick={toggleAnimation} 
                variant="outline" 
                size="sm" 
                className="bg-card/80 backdrop-blur-sm border-accent/50 hover:bg-accent/10 px-3 py-2 group relative" 
                title={isAnimationEnabled ? 'Pause Animation' : 'Play Animation (Heavy GPU)'}
              >
                {isAnimationEnabled ? <Pause size={16} /> : <Play size={16} />}
                {/* Tooltip on hover */}
                <div className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  {isAnimationEnabled ? 'Pause Animation' : 'Play Anim (Heavy GPU)'}
                </div>
              </Button>
            </div>
          )}

          {/* Enhanced Unicorn Studio Background with improved mobile handling */}
          {isAnimationEnabled && (
            <div className="absolute inset-0 -mx-8 -mt-8 overflow-hidden z-0" style={{
              background: 'linear-gradient(to bottom, transparent 0%, transparent 80%, rgba(var(--background)) 100%)'
            }}>
              {/* Desktop Animation */}
              <div 
                data-us-project="PZSV1Zb8lHQjhdLRBsQN" 
                className="hidden lg:block w-full h-full min-w-[120vw] min-h-[120vh] -ml-[10vw] -mt-[10vh]" 
                style={{
                  width: 'max(1440px, 120vw)',
                  height: 'max(900px, 120vh)',
                  transform: 'scale(1.1)'
                }} 
                key={`desktop-${animationInitRef.current}`}
              />
              
              {/* Mobile & Tablet Animation */}
              <div 
                data-us-project="Jmp7i20rUQsDyxKJ0OWM" 
                className="lg:hidden w-full h-full min-w-[120vw] min-h-[120vh] -ml-[10vw] -mt-[10vh]" 
                style={{
                  width: 'max(768px, 120vw)',
                  height: 'max(1024px, 120vh)',
                  transform: 'scale(1.1)'
                }} 
                key={`mobile-${animationInitRef.current}`}
              />
            </div>
          )}
          
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <Badge variant="outline" className="mb-6 text-accent border-accent font-mono bg-background/80 backdrop-blur-sm">
              100% Free & Open Source
            </Badge>
            
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Your Money,<br />
              <span className="text-accent ascii-animation">Your Dashboard</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">Track crypto, manage expenses, and build wealth with the most privacy-focused financial dashboard. No tracking, just pure financial clarity.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" onClick={() => navigate('/auth')} className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-3">
                Start Building Wealth <ArrowRight size={20} className="ml-2" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/dashboard')} className="w-full sm:w-auto border-accent text-accent hover:bg-accent hover:text-accent-foreground text-lg px-8 py-3">
                View Demo
              </Button>
            </div>

            {/* ASCII Art Dashboard Preview */}
            <div className="bg-card/90 border-2 border-border p-4 sm:p-6 rounded-lg max-w-4xl mx-auto font-mono text-xs sm:text-sm overflow-hidden backdrop-blur-sm">
              <div className="ascii-animation space-y-2">
                <div className="text-accent">┌─ PORTFOLIO OVERVIEW ─────────────────────┐</div>
                <div>│ ₿ Bitcoin        $45,230   📈 +12.5%    │</div>
                <div>│ 💰 Cash          $12,500   💼 Liquid    │</div>
                <div>│ 🏠 Real Estate   $250K     🔒 Illiquid  │</div>
                <div className="text-accent">├─ INCOME vs EXPENSES ─────────────────────┤</div>
                <div>│ 💸 Monthly In:   $8,500   ✅ Active    │</div>
                <div>│ 💳 Monthly Out:  $4,200   📊 Tracking  │</div>
                <div>│ 📈 Net Growth:   $4,300   🚀 Bullish   │</div>
                <div className="text-accent">└──────────────────────────────────────────┘</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12">
              Everything You Need to <span className="text-accent">Thrive</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {features.map((feature, index) => <Card key={index} className="brutalist-card hover:border-accent transition-colors group">
                  <CardHeader>
                    <div className="text-accent mb-3 group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm sm:text-base">{feature.description}</p>
                  </CardContent>
                </Card>)}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8">
              Built by <span className="text-accent">Degens</span>, for <span className="text-accent">Degens</span>
            </h2>
            
            <p className="text-base sm:text-lg text-muted-foreground mb-8">
              We're tired of financial apps that sell your data, charge monthly fees, and don't understand crypto. 
              So we built something better. Open source, privacy-first, and actually useful.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              <Card className="brutalist-card">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-accent mb-2">100%</div>
                  <div className="text-sm sm:text-base text-muted-foreground">Free Forever</div>
                </CardContent>
              </Card>
              <Card className="brutalist-card">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-accent mb-2">0</div>
                  <div className="text-sm sm:text-base text-muted-foreground">Data Tracking</div>
                </CardContent>
              </Card>
            </div>
            
            <Button size="lg" onClick={() => navigate('/auth')} className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-3">
              Join the Revolution <ArrowRight size={20} className="ml-2" />
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-card/50 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <img 
                  src="/lovable-uploads/a9b55d65-1fdb-426f-b462-5b057df47bd9.png" 
                  alt="Open Findash Logo" 
                  className="h-4 w-auto"
                />
                <span className="text-xs text-muted-foreground">© 2024</span>
              </div>
              
              <div className="flex gap-4 text-sm">
                <Button variant="ghost" size="sm" onClick={() => navigate('/privacy')} className="text-muted-foreground hover:text-foreground">
                  Privacy
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate('/terms')} className="text-muted-foreground hover:text-foreground">
                  Terms
                </Button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
