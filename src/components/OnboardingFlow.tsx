
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  ArrowLeft,
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Home, 
  Target,
  BarChart3,
  CheckCircle,
  Rocket,
  Brain,
  Zap
} from "lucide-react";

const onboardingSteps = [
  {
    title: "WELCOME TO THE MATRIX",
    subtitle: "Financial Domination Awaits",
    content: "You're about to enter the most comprehensive financial tracking system ever built. No bullshit, just pure data control.",
    icon: <Brain className="text-accent" size={48} />,
    features: [
      "Track every penny like a machine",
      "Crypto, stocks, real estate - everything",
      "AI-powered projections and insights",
      "Complete privacy - your data stays with you"
    ]
  },
  {
    title: "WHAT YOU'LL TRACK",
    subtitle: "Every Financial Stream",
    content: "From your salary to that random NFT you bought at 3 AM - we track it all with military precision.",
    icon: <DollarSign className="text-accent" size={48} />,
    features: [
      "Active Income: Salary, freelance, side hustles",
      "Passive Income: Rent, dividends, crypto yields", 
      "Liquid Assets: Cash, crypto, stocks, savings",
      "Illiquid Assets: Real estate, cars, collectibles"
    ]
  },
  {
    title: "EXPENSE DOMINATION",
    subtitle: "Where Your Money Really Goes",
    content: "No more wondering where your money disappeared. Track every expense category with brutal honesty.",
    icon: <TrendingDown className="text-red-500" size={48} />,
    features: [
      "Fixed expenses: Rent, insurance, subscriptions",
      "Variable costs: Food, entertainment, impulse buys",
      "Debt tracking: Credit cards, loans, IOUs",
      "Future planning: Goals, savings targets"
    ]
  },
  {
    title: "PROJECTIONS & ANALYTICS",
    subtitle: "See Your Financial Future",
    content: "Get intelligent insights that would make Wall Street analysts jealous. Data-driven decisions only.",
    icon: <BarChart3 className="text-accent" size={48} />,
    features: [
      "Net worth projections over time",
      "Debt payoff timelines and strategies", 
      "Investment growth simulations",
      "Cash flow optimization recommendations"
    ]
  },
  {
    title: "READY TO DOMINATE?",
    subtitle: "Your Financial Empire Starts Now",
    content: "Time to take complete control. Set up your profile and start building your financial empire.",
    icon: <Rocket className="text-accent" size={48} />,
    features: [
      "5-minute setup process",
      "Import data from existing tools",
      "Start with demo data or build from scratch",
      "Join the community of financial freedom seekers"
    ]
  }
];

export const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = onboardingSteps[currentStep];

  return (
    <div className="min-h-screen bg-background text-foreground font-mono flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-mono text-muted-foreground uppercase">
              STEP {currentStep + 1} OF {onboardingSteps.length}
            </span>
            <span className="text-sm font-mono text-accent uppercase">
              {Math.round(((currentStep + 1) / onboardingSteps.length) * 100)}% COMPLETE
            </span>
          </div>
          <div className="w-full bg-border h-2 border-2 border-border">
            <div 
              className="bg-accent h-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <Card className="brutalist-card">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              {currentStepData.icon}
            </div>
            <CardTitle className="text-3xl font-display brutalist-heading mb-2">
              {currentStepData.title}
            </CardTitle>
            <p className="text-xl text-accent font-mono">
              {currentStepData.subtitle}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-muted-foreground font-mono text-center max-w-2xl mx-auto">
              {currentStepData.content}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentStepData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-muted border-2 border-border">
                  <CheckCircle className="text-accent flex-shrink-0" size={20} />
                  <span className="font-mono text-sm">{feature}</span>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6">
              <Button
                onClick={prevStep}
                disabled={currentStep === 0}
                variant="outline"
                className="brutalist-button"
              >
                <ArrowLeft size={16} className="mr-2" />
                BACK
              </Button>

              <div className="flex space-x-2">
                {onboardingSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 border-2 border-border ${
                      index <= currentStep ? 'bg-accent' : 'bg-background'
                    }`}
                  />
                ))}
              </div>

              {currentStep < onboardingSteps.length - 1 ? (
                <Button
                  onClick={nextStep}
                  className="brutalist-button"
                >
                  NEXT
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              ) : (
                <Link to="/dashboard">
                  <Button className="brutalist-button">
                    START DOMINATING
                    <Rocket size={16} className="ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
