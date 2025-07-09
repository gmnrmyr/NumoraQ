import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Twitter, 
  MessageCircle, 
  HelpCircle, 
  ExternalLink,
  Clock,
  Shield,
  Zap,
  CreditCard,
  Bug,
  Lightbulb
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const SupportPage = () => {
  const contactMethods = [
    {
      icon: <Mail size={20} />,
      title: 'Email Support',
      description: 'Primary support channel for all inquiries',
      contact: 'numoraq@gmail.com',
      responseTime: '12-24 hours',
      available: true,
      action: () => window.open('mailto:numoraq@gmail.com?subject=Numoraq Support Request', '_blank')
    },
    {
      icon: <Twitter size={20} />,
      title: 'X (Twitter)',
      description: 'Quick questions and updates',
      contact: '@numoraq',
      responseTime: '2-8 hours',
      available: true,
      action: () => window.open('https://x.com/numoraq', '_blank')
    }
  ];

  const supportCategories = [
    {
      icon: <CreditCard size={16} />,
      title: 'Payment & Billing',
      topics: [
        'Crypto payment issues',
        'Premium plan activation',
        'Billing questions',
        'Refund requests',
        'Transaction verification'
      ]
    },
    {
      icon: <Shield size={16} />,
      title: 'Account & Security',
      topics: [
        'Login problems',
        'Account linking',
        'Data privacy',
        'Password reset',
        'Account deletion'
      ]
    },
    {
      icon: <Zap size={16} />,
      title: 'Features & Usage',
      topics: [
        'Dashboard navigation',
        'Portfolio tracking',
        'Data import/export',
        'Mobile app issues',
        'Feature requests'
      ]
    },
    {
      icon: <Bug size={16} />,
      title: 'Technical Issues',
      topics: [
        'Bug reports',
        'Performance problems',
        'Sync issues',
        'Browser compatibility',
        'API errors'
      ]
    }
  ];

  const faqItems = [
    {
      question: 'How do crypto payments work?',
      answer: 'Send ETH to our wallet address and your premium plan will be automatically activated based on the USD value. Minimum $9.99 for monthly access.'
    },
    {
      question: 'Why isn\'t my premium activated?',
      answer: 'Crypto payments require 3+ blockchain confirmations. Contact us at numoraq@gmail.com with your transaction hash if it\'s been over 30 minutes.'
    },
    {
      question: 'Can I get a refund?',
      answer: 'We offer refunds within 7 days of purchase for unused accounts. Contact us at numoraq@gmail.com with your request.'
    },
    {
      question: 'Is my financial data secure?',
      answer: 'Yes! We use local-first storage with optional encrypted cloud sync. We never sell your data or share it with third parties.'
    },
    {
      question: 'How do I export my data?',
      answer: 'Go to Dashboard → Data Management and use the export options (CSV, JSON, PDF). Your data is always yours to export.'
    },
    {
      question: 'What\'s the difference between donations and payments?',
      answer: 'Payments activate premium plans with features. Donations earn you badges and recognition tiers. Both support platform development.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar activeTab="" onTabChange={() => {}} />
      
      <div className="pt-20 sm:pt-32 pb-8">
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold font-mono text-accent uppercase tracking-wider">
              SUPPORT CENTER
            </h1>
            <p className="text-muted-foreground text-lg font-mono">
              Get help with Numoraq - We're here to assist you
            </p>
            <div className="flex justify-center items-center gap-4">
              <div className="w-8 h-1 bg-accent"></div>
              <HelpCircle className="text-accent" size={24} />
              <div className="w-8 h-1 bg-accent"></div>
            </div>
          </div>

          {/* Beta Notice */}
          <Card className="border-2 border-accent/30 bg-accent/5">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Clock className="text-accent mt-1" size={20} />
                <div className="space-y-2">
                  <h3 className="font-mono font-bold text-accent">BETA PLATFORM</h3>
                  <p className="text-sm font-mono text-muted-foreground">
                    Numoraq is in active beta. We're constantly improving the platform based on user feedback. 
                    Report bugs, suggest features, or ask questions - we respond quickly!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Methods */}
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="font-mono text-accent">📞 CONTACT SUPPORT</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contactMethods.map((method, index) => (
                  <div key={index} className="p-4 border border-border rounded bg-card/50">
                    <div className="flex items-start gap-3">
                      <div className="text-accent">{method.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-mono font-bold text-foreground">{method.title}</h3>
                          <Badge className="bg-green-600 text-white text-xs">Available</Badge>
                        </div>
                        <p className="text-sm font-mono text-muted-foreground mb-2">
                          {method.description}
                        </p>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="font-mono text-sm text-accent">{method.contact}</span>
                          <span className="text-xs text-muted-foreground">
                            • Response: {method.responseTime}
                          </span>
                        </div>
                        <Button
                          onClick={method.action}
                          variant="outline"
                          size="sm"
                          className="w-full font-mono"
                        >
                          Contact {method.title.split(' ')[0]}
                          <ExternalLink size={14} className="ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Support Categories */}
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="font-mono text-accent">🏷️ SUPPORT CATEGORIES</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {supportCategories.map((category, index) => (
                  <div key={index} className="p-4 border border-border rounded">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-accent">{category.icon}</div>
                      <h3 className="font-mono font-bold text-foreground">{category.title}</h3>
                    </div>
                    <ul className="space-y-1">
                      {category.topics.map((topic, topicIndex) => (
                        <li key={topicIndex} className="text-sm font-mono text-muted-foreground flex items-center gap-2">
                          <span className="text-accent">•</span>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="font-mono text-accent">❓ FREQUENTLY ASKED QUESTIONS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <div key={index} className="p-4 border border-border rounded">
                    <h3 className="font-mono font-bold text-foreground mb-2">
                      Q: {item.question}
                    </h3>
                    <p className="text-sm font-mono text-muted-foreground">
                      A: {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Self-Help Resources */}
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="font-mono text-accent">🛠️ SELF-HELP RESOURCES</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-border rounded text-center">
                  <MessageCircle className="text-accent mx-auto mb-2" size={24} />
                  <h3 className="font-mono font-bold text-foreground mb-2">User Guide</h3>
                  <p className="text-sm font-mono text-muted-foreground mb-3">
                    Learn how to use all Numoraq features
                  </p>
                  <Button variant="outline" size="sm" className="font-mono">
                    Coming Soon
                  </Button>
                </div>
                
                <div className="p-4 border border-border rounded text-center">
                  <Lightbulb className="text-accent mx-auto mb-2" size={24} />
                  <h3 className="font-mono font-bold text-foreground mb-2">Tips & Tricks</h3>
                  <p className="text-sm font-mono text-muted-foreground mb-3">
                    Get the most out of your dashboard
                  </p>
                  <Button variant="outline" size="sm" className="font-mono">
                    Coming Soon
                  </Button>
                </div>
                
                <div className="p-4 border border-border rounded text-center">
                  <Bug className="text-accent mx-auto mb-2" size={24} />
                  <h3 className="font-mono font-bold text-foreground mb-2">Known Issues</h3>
                  <p className="text-sm font-mono text-muted-foreground mb-3">
                    Current bugs and workarounds
                  </p>
                  <Button variant="outline" size="sm" className="font-mono">
                    Coming Soon
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="border-2 border-red-500/30 bg-red-500/5">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Shield className="text-red-500 mt-1" size={20} />
                <div className="space-y-2">
                  <h3 className="font-mono font-bold text-red-500">URGENT ISSUES</h3>
                  <p className="text-sm font-mono text-muted-foreground">
                    For urgent payment issues, security concerns, or data loss problems, email us immediately at 
                    <strong className="text-accent"> numoraq@gmail.com</strong> with "URGENT" in the subject line.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SupportPage; 