import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, Eye, UserPlus, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

const onboardingOptions = [
  {
    id: 'login',
    title: 'SIGN IN',
    description: 'Already have an account? Jump right back into your financial matrix.',
    icon: <UserPlus className="text-accent" size={24} />,
    action: '/auth'
  },
  {
    id: 'browse',
    title: "I'M JUST BROWSING",
    description: 'Check out the features first. No commitment, just pure exploration.',
    icon: <Eye className="text-blue-400" size={24} />,
    action: '/dashboard'
  },
  {
    id: 'first-time',
    title: 'FIRST TIME HERE',
    description: 'New to the game? Let me show you around this financial playground.',
    icon: <Rocket className="text-purple-400" size={24} />,
    action: '/dashboard'
  }
];

export const HeroSection = () => {
  const [isAnimationPaused, setIsAnimationPaused] = React.useState(true); // Start paused
  const animationInitialized = useRef(false);

  useEffect(() => {
    if (!animationInitialized.current) {
      // Initialize UnicornStudio but keep animation paused
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.innerHTML = `
        !function(){
          if(!window.UnicornStudio){
            window.UnicornStudio={isInitialized:!1};
            var i=document.createElement("script");
            i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.25/dist/unicornStudio.umd.js";
            i.onload=function(){
              if(!window.UnicornStudio.isInitialized){
                UnicornStudio.init();
                window.UnicornStudio.isInitialized=!0;
                console.log('🎬 Landing page animation initialized (paused)');
              }
            };
            (document.head || document.body).appendChild(i);
          }
        }();
      `;
      document.head.appendChild(script);
      animationInitialized.current = true;
    }
  }, []);

  const toggleAnimation = () => {
    setIsAnimationPaused(!isAnimationPaused);
  };

  return (
    <div className="text-center space-y-8">
      {/* Animation Control for Desktop */}
      <div className="hidden md:block absolute top-4 right-4 z-50">
        <Button
          onClick={toggleAnimation}
          variant="outline"
          size="sm"
          className="bg-card/80 backdrop-blur-sm border-accent/50 hover:bg-accent/10"
          title={isAnimationPaused ? 'Play Background Animation' : 'Pause Background Animation'}
        >
          {isAnimationPaused ? <Play size={16} /> : <Pause size={16} />}
        </Button>
      </div>

      <div className="space-y-6">
        <h1 className="text-6xl font-display font-bold text-foreground leading-tight brutalist-heading">
          HEY HOMIE!
          <span className="text-accent block">ARE YOU A FINANCE</span>
          <span className="text-accent block">ANALYSIS FREAK?</span>
        </h1>
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-xl text-muted-foreground font-mono">
            This is your place to be! Here you don't just plan your next goal -
            <span className="text-accent font-bold"> you get into the MATRIX of it!</span>
          </p>
          <p className="text-lg text-muted-foreground font-mono">
            Well, I guess you also like to track your crypto. 
            <span className="text-accent font-bold"> We're here for you, degen.</span>
          </p>
        </div>
      </div>
      
      {/* Background Animation - Hidden when paused on desktop */}
      <div 
        className={`absolute inset-0 pointer-events-none ${isAnimationPaused ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
        style={{ zIndex: -1 }}
      >
        <div 
          data-us-project="db3DaP9gWVnnnr7ZevK7" 
          style={{ width: '2000px', height: '900px', margin: '0 auto' }}
        />
      </div>
      
      {/* Onboarding Choice Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto relative z-10">
        {onboardingOptions.map((option) => (
          <Link key={option.id} to={option.action}>
            <Card className="brutalist-card hover:bg-accent/10 transition-all duration-200 cursor-pointer h-full">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-3">
                  {option.icon}
                </div>
                <CardTitle className="text-lg font-display brutalist-heading">
                  {option.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm font-mono text-center">
                  {option.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
