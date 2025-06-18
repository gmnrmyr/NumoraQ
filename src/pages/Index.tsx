
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Home, 
  Target,
  BarChart3,
  PieChart,
  Calendar,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Users,
  Shield,
  Download,
  Bot,
  FileJson,
  Github,
  Zap,
  Brain,
  Rocket,
  Eye,
  UserPlus
} from "lucide-react";

const Index = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [onboardingChoice, setOnboardingChoice] = useState<string | null>(null);

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

  const quickStartSteps = [
    {
      step: 1,
      title: "SET YOUR IDENTITY",
      description: "Click 'User' in the navbar. Set your name and currency (BRL/USD/EUR). Basic but essential.",
      icon: <Users size={20} />
    },
    {
      step: 2,
      title: "INPUT INCOME STREAMS",
      description: "Add every income source. Salary, side hustles, crypto yields, whatever brings in the cash.",
      icon: <TrendingUp size={20} />
    },
    {
      step: 3,
      title: "MAP YOUR EXPENSES",
      description: "Track where your money bleeds. Fixed costs, variables, subscriptions - map it all out.",
      icon: <TrendingDown size={20} />
    },
    {
      step: 4,
      title: "ASSET INVENTORY",
      description: "Input your holdings. Savings, investments, crypto bags, real estate - the complete picture.",
      icon: <Home size={20} />
    },
    {
      step: 5,
      title: "MONITOR & OPTIMIZE",
      description: "Use the dashboard to track your financial health. Make data-driven decisions like a pro.",
      icon: <Target size={20} />
    }
  ];

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

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-md border-b-2 border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <BarChart3 className="text-accent" size={28} />
              <span className="text-2xl font-display font-bold uppercase tracking-wide">OPEN FINDASH</span>
            </div>
            <div className="flex items-center gap-4">
              {onboardingOptions.map((option) => (
                <Link key={option.id} to={option.action}>
                  <Button className="brutalist-button">
                    {option.icon}
                    <span className="hidden sm:inline ml-2">{option.title}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* Hero Section */}
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

        {/* Key Features Grid */}
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

        {/* Quick Start Guide */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-display font-bold text-foreground mb-4 brutalist-heading">
              QUICK START PROTOCOL
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-mono">
              Get up and running in just a few minutes. <span className="text-accent">No bullshit, just pure efficiency.</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {quickStartSteps.map((step, index) => (
              <Card key={index} className="brutalist-card relative">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-accent text-background rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold font-mono">
                      {step.step}
                    </div>
                    {step.icon}
                  </div>
                  <CardTitle className="text-base font-display brutalist-heading">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm font-mono">{step.description}</p>
                </CardContent>
                {index < quickStartSteps.length - 1 && (
                  <div className="hidden lg:block absolute -right-2 top-1/2 transform -translate-y-1/2">
                    <ArrowRight className="text-border" size={20} />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* AI Integration & Import/Export Section */}
        <div className="bg-card border-2 border-border p-8 brutalist-card">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-display font-bold text-foreground mb-4 flex items-center justify-center gap-3 brutalist-heading">
              <Bot className="text-accent" size={32} />
              AI-POWERED DATA MANIPULATION
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-mono">
              Leverage AI to quickly set up and <span className="text-accent">customize your financial data like a pro.</span>
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="brutalist-card border-accent/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-accent font-display brutalist-heading">
                  <FileJson size={24} />
                  SMART JSON IMPORT
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground font-mono">
                  Use AI to generate your financial data in the correct format:
                </p>
                <div className="bg-background p-4 border-2 border-border space-y-2 text-sm">
                  <p className="font-mono"><strong className="text-accent">1.</strong> Export your current data from the dashboard</p>
                  <p className="font-mono"><strong className="text-accent">2.</strong> Ask ChatGPT, Claude, or Grok:</p>
                  <div className="bg-muted p-3 border border-border italic text-xs font-mono">
                    "Please modify this financial JSON data according to my needs: [paste your requirements]. 
                    Return only the JSON in the same format."
                  </div>
                  <p className="font-mono"><strong className="text-accent">3.</strong> Import the AI-generated JSON back into FinanceTracker</p>
                </div>
              </CardContent>
            </Card>

            <Card className="brutalist-card border-accent/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-accent font-display brutalist-heading">
                  <Download size={24} />
                  OFFLINE DOMINATION
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground font-mono">
                  Download and run FinanceTracker on your own machine:
                </p>
                <div className="bg-background p-4 border-2 border-border space-y-2 text-sm">
                  <p className="font-mono"><strong className="text-accent">1.</strong> Visit our GitHub repository</p>
                  <p className="font-mono"><strong className="text-accent">2.</strong> Clone or download the source code</p>
                  <p className="font-mono"><strong className="text-accent">3.</strong> Run <code className="bg-muted px-1 border border-border font-mono">npm install && npm run dev</code></p>
                  <p className="font-mono"><strong className="text-accent">4.</strong> Access at <code className="bg-muted px-1 border border-border font-mono">localhost:5173</code></p>
                  <p className="text-xs text-muted-foreground mt-2 font-mono">
                    Perfect for offline use or when the website is unavailable!
                  </p>
                </div>
                <a 
                  href="https://github.com/gmnrmyr/wealth-dashboard-flow" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-accent hover:text-accent/80 text-sm font-mono"
                >
                  <Github size={16} />
                  View on GitHub
                </a>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="bg-card border-2 border-border p-8 brutalist-card">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-display font-bold text-foreground mb-4 brutalist-heading">WHY CHOOSE OPEN FINDASH?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="bg-accent/20 border-2 border-accent w-16 h-16 flex items-center justify-center mx-auto">
                <CheckCircle className="text-accent" size={32} />
              </div>
              <h3 className="text-xl font-display font-bold text-foreground brutalist-heading">COMPLETE PRIVACY</h3>
              <p className="text-muted-foreground font-mono">
                All your financial data stays with you. No cloud storage, no data mining, <span className="text-accent">complete privacy control.</span>
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="bg-accent/20 border-2 border-accent w-16 h-16 flex items-center justify-center mx-auto">
                <Brain className="text-accent" size={32} />
              </div>
              <h3 className="text-xl font-display font-bold text-foreground brutalist-heading">SMART INSIGHTS</h3>
              <p className="text-muted-foreground font-mono">
                Get intelligent projections and analytics to make <span className="text-accent">informed financial decisions</span> for your future.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="bg-accent/20 border-2 border-accent w-16 h-16 flex items-center justify-center mx-auto">
                <Zap className="text-accent" size={32} />
              </div>
              <h3 className="text-xl font-display font-bold text-foreground brutalist-heading">COMPREHENSIVE TRACKING</h3>
              <p className="text-muted-foreground font-mono">
                Track everything from daily expenses to long-term investments in <span className="text-accent">one unified dashboard.</span>
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6 py-12">
          <h2 className="text-4xl font-display font-bold text-foreground brutalist-heading">READY TO DOMINATE YOUR FINANCES?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-mono">
            Join the community of users who have taken <span className="text-accent">complete control</span> of their financial future.
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="brutalist-button text-lg px-12 py-4">
              <Rocket size={20} className="mr-2" />
              GET STARTED NOW - IT'S FREE!
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
