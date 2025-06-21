
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, Eye, UserPlus } from "lucide-react";

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
  return (
    <div className="text-center space-y-8">
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
      
      {/* Onboarding Choice Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
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
