
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
  Github
} from "lucide-react";

const LandingPage = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <DollarSign className="text-green-600" size={24} />,
      title: "Income Tracking",
      description: "Track both active and passive income sources with detailed categorization and status management."
    },
    {
      icon: <TrendingDown className="text-red-600" size={24} />,
      title: "Expense Management", 
      description: "Monitor recurring and variable expenses to understand your spending patterns and optimize your budget."
    },
    {
      icon: <Home className="text-blue-600" size={24} />,
      title: "Asset Portfolio",
      description: "Manage liquid and illiquid assets including crypto, real estate, and investments with real-time valuations."
    },
    {
      icon: <AlertCircle className="text-orange-600" size={24} />,
      title: "Debt Tracking",
      description: "Keep track of all debts with payment schedules and progress monitoring to achieve financial freedom."
    },
    {
      icon: <Calendar className="text-purple-600" size={24} />,
      title: "Financial Tasks",
      description: "Set and track financial goals, deadlines, and important tasks to stay on top of your finances."
    },
    {
      icon: <BarChart3 className="text-indigo-600" size={24} />,
      title: "Projections & Analytics",
      description: "View detailed financial projections and analytics to make informed decisions about your future."
    }
  ];

  const quickStartSteps = [
    {
      step: 1,
      title: "Set Your Profile",
      description: "Click on 'User' in the navbar to set your name and preferred currency (BRL/USD).",
      icon: <Users size={20} />
    },
    {
      step: 2,
      title: "Add Your Income",
      description: "Start by adding your active and passive income sources in the Income tab.",
      icon: <TrendingUp size={20} />
    },
    {
      step: 3,
      title: "Track Expenses",
      description: "Add your recurring monthly expenses and variable costs to understand your spending.",
      icon: <TrendingDown size={20} />
    },
    {
      step: 4,
      title: "Manage Assets",
      description: "Input your assets including savings, investments, and crypto holdings.",
      icon: <Home size={20} />
    },
    {
      step: 5,
      title: "Monitor Progress",
      description: "Use the dashboard overview to track your financial health and projections.",
      icon: <Target size={20} />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <BarChart3 className="text-blue-600" size={28} />
              <span className="text-2xl font-bold text-gray-800">FinanceTracker</span>
            </div>
            <Link to="/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Go to Dashboard
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-slate-800 leading-tight">
              Take Control of Your
              <span className="text-blue-600 block">Financial Future</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              A comprehensive, open-source personal finance management tool that helps you track income, 
              expenses, assets, and financial goals with ease.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                Start Managing Your Finances
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Shield size={16} />
              <span>100% Open Source • Privacy Focused</span>
            </div>
          </div>
        </div>

        {/* Key Features Grid */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Comprehensive Financial Management</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Everything you need to understand and improve your financial situation in one place.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  activeFeature === index ? 'ring-2 ring-blue-500 shadow-lg' : ''
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    {feature.icon}
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Quick Start Guide</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Get up and running in just a few minutes with these simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {quickStartSteps.map((step, index) => (
              <Card key={index} className="relative">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                    {step.icon}
                  </div>
                  <CardTitle className="text-base">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm">{step.description}</p>
                </CardContent>
                {index < quickStartSteps.length - 1 && (
                  <div className="hidden lg:block absolute -right-2 top-1/2 transform -translate-y-1/2">
                    <ArrowRight className="text-slate-300" size={20} />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* AI Integration & Import/Export Section */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-4 flex items-center justify-center gap-3">
              <Bot className="text-emerald-600" size={32} />
              AI-Powered Data Management
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Leverage AI to quickly set up and customize your financial data.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-emerald-800">
                  <FileJson size={24} />
                  Smart JSON Import
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600">
                  Use AI to generate your financial data in the correct format:
                </p>
                <div className="bg-white p-4 rounded-lg border space-y-2 text-sm">
                  <p><strong>1.</strong> Export your current data from the dashboard</p>
                  <p><strong>2.</strong> Ask ChatGPT, Claude, or Grok:</p>
                  <div className="bg-gray-50 p-3 rounded italic text-xs">
                    "Please modify this financial JSON data according to my needs: [paste your requirements]. 
                    Return only the JSON in the same format."
                  </div>
                  <p><strong>3.</strong> Import the AI-generated JSON back into FinanceTracker</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-teal-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-teal-800">
                  <Download size={24} />
                  Offline Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600">
                  Download and run FinanceTracker on your own machine:
                </p>
                <div className="bg-white p-4 rounded-lg border space-y-2 text-sm">
                  <p><strong>1.</strong> Visit our GitHub repository</p>
                  <p><strong>2.</strong> Clone or download the source code</p>
                  <p><strong>3.</strong> Run <code className="bg-gray-100 px-1 rounded">npm install && npm run dev</code></p>
                  <p><strong>4.</strong> Access at <code className="bg-gray-100 px-1 rounded">localhost:5173</code></p>
                  <p className="text-xs text-gray-500 mt-2">
                    Perfect for offline use or when the website is unavailable!
                  </p>
                </div>
                <a 
                  href="https://github.com/gmnrmyr/wealth-dashboard-flow" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <Github size={16} />
                  View on GitHub
                </a>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Why Choose FinanceTracker?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800">Complete Privacy</h3>
              <p className="text-slate-600">
                All your financial data stays with you. No cloud storage, no data mining, complete privacy control.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Lightbulb className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800">Smart Insights</h3>
              <p className="text-slate-600">
                Get intelligent projections and analytics to make informed financial decisions for your future.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <PieChart className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800">Comprehensive Tracking</h3>
              <p className="text-slate-600">
                Track everything from daily expenses to long-term investments in one unified dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6 py-12">
          <h2 className="text-3xl font-bold text-slate-800">Ready to Transform Your Finances?</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Join thousands of users who have taken control of their financial future with FinanceTracker.
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-12 py-4">
              Get Started Now - It's Free!
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
