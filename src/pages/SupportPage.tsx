
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Github, Twitter, ExternalLink, Heart, Coffee, Star, Users, MessageCircle, Mail, Zap } from "lucide-react";

const SupportPage = () => {
  return (
    <>
      <title>Support the Project - OPEN FINDASH | Help Us Grow</title>
      <meta name="description" content="Support OPEN FINDASH development through donations, social engagement, and community participation. Help us build the best financial dashboard." />
      
      <div className="min-h-screen bg-background text-foreground font-mono">
        <Navbar activeTab="support" onTabChange={() => {}} />
        <div className="pt-20 sm:pt-32 pb-8">
          <div className="max-w-4xl mx-auto space-y-6 px-2 sm:px-4">
            
            {/* Header */}
            <div className="text-center space-y-4 py-8">
              <div className="flex items-center justify-center gap-4">
                <Heart className="text-accent animate-pulse" size={32} />
                <h1 className="text-3xl font-bold font-mono text-accent uppercase tracking-wider">
                  SUPPORT THE PROJECT
                </h1>
                <Heart className="text-accent animate-pulse" size={32} />
              </div>
              <p className="text-muted-foreground font-mono uppercase tracking-wide">
                HELP US BUILD THE FUTURE // COMMUNITY DRIVEN // OPEN SOURCE
              </p>
            </div>

            {/* Donation Section */}
            <Card className="brutalist-card border-accent bg-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-mono">
                  <Coffee className="text-accent" size={20} />
                  SUPPORT DEVELOPMENT
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground font-mono text-sm">
                  Your contributions help us maintain servers, add new features, and keep the platform free for everyone.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="brutalist-card">
                    <CardContent className="p-4 text-center space-y-3">
                      <Coffee className="mx-auto text-accent" size={32} />
                      <h3 className="font-mono font-bold">BUY US A COFFEE</h3>
                      <p className="text-xs text-muted-foreground font-mono">
                        Support with a small donation
                      </p>
                      <Button className="w-full brutalist-button bg-accent text-accent-foreground">
                        <Coffee size={16} className="mr-2" />
                        Donate Coffee
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="brutalist-card">
                    <CardContent className="p-4 text-center space-y-3">
                      <Heart className="mx-auto text-accent" size={32} />
                      <h3 className="font-mono font-bold">BECOME A SPONSOR</h3>
                      <p className="text-xs text-muted-foreground font-mono">
                        Support ongoing development
                      </p>
                      <Button className="w-full brutalist-button bg-accent text-accent-foreground">
                        <Heart size={16} className="mr-2" />
                        Sponsor Project
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="text-center">
                  <Badge variant="outline" className="font-mono">
                    <Zap size={12} className="mr-1" />
                    All donations unlock Degen Mode features!
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Social & Community */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* GitHub */}
              <Card className="brutalist-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-mono">
                    <Github className="text-accent" size={20} />
                    GITHUB
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground font-mono">
                    Star our repository, contribute code, or report issues. Open source collaboration.
                  </p>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full brutalist-button justify-start"
                      onClick={() => window.open('https://github.com/openfindash', '_blank')}
                    >
                      <Star size={16} className="mr-2" />
                      Star the Repository
                      <ExternalLink size={12} className="ml-auto" />
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full brutalist-button justify-start"
                      onClick={() => window.open('https://github.com/openfindash/issues', '_blank')}
                    >
                      <MessageCircle size={16} className="mr-2" />
                      Report Issues
                      <ExternalLink size={12} className="ml-auto" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="brutalist-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-mono">
                    <Users className="text-accent" size={20} />
                    SOCIAL MEDIA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground font-mono">
                    Follow us for updates, tips, and community discussions.
                  </p>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full brutalist-button justify-start"
                      onClick={() => window.open('https://twitter.com/openfindash', '_blank')}
                    >
                      <Twitter size={16} className="mr-2" />
                      Follow on Twitter
                      <ExternalLink size={12} className="ml-auto" />
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full brutalist-button justify-start"
                      onClick={() => window.open('https://discord.gg/openfindash', '_blank')}
                    >
                      <MessageCircle size={16} className="mr-2" />
                      Join Discord
                      <ExternalLink size={12} className="ml-auto" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Community Contribution */}
            <Card className="brutalist-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-mono">
                  <Users className="text-accent" size={20} />
                  COMMUNITY CONTRIBUTIONS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center space-y-2">
                    <Star className="mx-auto text-accent" size={24} />
                    <h4 className="font-mono font-bold text-sm">SPREAD THE WORD</h4>
                    <p className="text-xs text-muted-foreground font-mono">
                      Share with friends and on social media
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <MessageCircle className="mx-auto text-accent" size={24} />
                    <h4 className="font-mono font-bold text-sm">GIVE FEEDBACK</h4>
                    <p className="text-xs text-muted-foreground font-mono">
                      Report bugs and suggest features
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <Github className="mx-auto text-accent" size={24} />
                    <h4 className="font-mono font-bold text-sm">CONTRIBUTE CODE</h4>
                    <p className="text-xs text-muted-foreground font-mono">
                      Submit pull requests and improvements
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="brutalist-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-mono">
                  <Mail className="text-accent" size={20} />
                  GET IN TOUCH
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground font-mono mb-4">
                  Have questions, suggestions, or want to collaborate? We'd love to hear from you!
                </p>
                <Button 
                  className="brutalist-button bg-accent text-accent-foreground"
                  onClick={() => window.open('mailto:hello@openfindash.com', '_blank')}
                >
                  <Mail size={16} className="mr-2" />
                  Contact Us
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default SupportPage;
