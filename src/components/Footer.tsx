
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from "@/contexts/TranslationContext";
import { useProjectSettings } from "@/hooks/useProjectSettings";
import { Github, Twitter, Coffee, Heart, ExternalLink } from 'lucide-react';

export const Footer = () => {
  const { t, language } = useTranslation();
  const { settings } = useProjectSettings();

  return (
    <footer className="border-t-2 border-border bg-card/50 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Company Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <img 
                src={settings.square_logo_url} 
                alt={`${settings.website_name} Logo`} 
                className="h-8 w-auto"
              />
              <h3 className="font-mono font-bold text-accent uppercase">{settings.website_name}</h3>
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              Advanced financial dashboard for crypto & traditional assets
            </p>
            <div className="text-xs text-muted-foreground font-mono">
              © 2024 {settings.website_name.toUpperCase()}. All rights reserved.
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-mono font-semibold text-foreground uppercase">Quick Links</h4>
            <div className="space-y-1">
              <Link to="/dashboard" className="block text-xs text-muted-foreground hover:text-accent font-mono">
                Dashboard
              </Link>
              <Link to="/" className="block text-xs text-muted-foreground hover:text-accent font-mono">
                Home
              </Link>
              <Link to="/leaderboard" className="block text-xs text-muted-foreground hover:text-accent font-mono">
                Leaderboard
              </Link>
              <Link to="/donation" className="block text-xs text-muted-foreground hover:text-accent font-mono">
                Donate
              </Link>
            </div>
          </div>

          {/* Social & Community */}
          <div className="space-y-2">
            <h4 className="font-mono font-semibold text-foreground uppercase">Community</h4>
            <div className="space-y-1">
              <a 
                href="https://github.com/openfindash" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-accent font-mono"
              >
                <Github size={12} />
                GitHub
                <ExternalLink size={10} />
              </a>
              <a 
                href="https://twitter.com/openfindash" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-accent font-mono"
              >
                <Twitter size={12} />
                Twitter
                <ExternalLink size={10} />
              </a>
              <Link 
                to="/donation"
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-accent font-mono"
              >
                <Coffee size={12} />
                Buy us a coffee
              </Link>
              <Link 
                to="/donation"
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-accent font-mono"
              >
                <Heart size={12} />
                Support the project
              </Link>
            </div>
          </div>

          {/* Status & Version */}
          <div className="space-y-2">
            <h4 className="font-mono font-semibold text-foreground uppercase">Status</h4>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-muted-foreground font-mono">All systems operational</span>
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              {settings.version} - {language || 'en'}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
