
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Home, 
  Target,
  BarChart3,
  AlertCircle,
  Calendar
} from "lucide-react";

const features = [
  {
    icon: <DollarSign className="text-accent" size={24} />,
    title: "INCOME MATRIX",
    description: "Track both active and passive income streams. From your 9-5 to that crypto yield farming - we see it all."
  },
  {
    icon: <TrendingDown className="text-red-500" size={24} />,
    title: "EXPENSE ANALYZER", 
    description: "Monitor every satoshi spent. Recurring subscriptions, variable costs, those late-night DoorDash orders - track it all."
  },
  {
    icon: <Home className="text-blue-400" size={24} />,
    title: "ASSET PORTFOLIO",
    description: "Liquid and illiquid assets, crypto, real estate, NFTs. Track your entire wealth empire with real-time valuations."
  },
  {
    icon: <AlertCircle className="text-orange-500" size={24} />,
    title: "DEBT TERMINATOR",
    description: "Kill your debts systematically. Payment schedules, progress tracking - achieve financial freedom like a machine."
  },
  {
    icon: <Calendar className="text-purple-400" size={24} />,
    title: "FINANCIAL TASKS",
    description: "Set goals, deadlines, and financial missions. Stay on top of your money game with military precision."
  },
  {
    icon: <BarChart3 className="text-accent" size={24} />,
    title: "PROJECTIONS & ANALYTICS",
    description: "Deep dive into your financial future. Projections, analytics, and insights that would make a hedge fund jealous."
  }
];

export const FeaturesGrid = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-display font-bold text-foreground mb-4 brutalist-heading">
          COMPREHENSIVE FINANCIAL DOMINATION
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto font-mono">
          Everything you need to understand and <span className="text-accent">optimize</span> your financial situation in one brutal interface.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card 
            key={index}
            className={`brutalist-card cursor-pointer transition-all duration-300 hover:bg-accent/10 ${
              activeFeature === index ? 'bg-accent/20 border-accent' : ''
            }`}
            onClick={() => setActiveFeature(index)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                {feature.icon}
                <CardTitle className="text-lg font-display brutalist-heading">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm font-mono">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
