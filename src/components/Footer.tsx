
import React from 'react';
import { Link } from 'react-router-dom';
import { useProjectSettings } from '@/hooks/useProjectSettings';
import { Heart, Github, Coffee } from "lucide-react";

export const Footer = () => {
  const { settings } = useProjectSettings();

  return (
    <footer className="bg-card border-t-2 border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-display font-bold text-foreground brutalist-heading">
              {settings.project_name}
            </h3>
            <p className="text-muted-foreground text-sm font-mono">
              {settings.project_description}
            </p>
            <div className="text-xs text-muted-foreground font-mono">
              Version {settings.website_version}
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-display font-bold text-foreground brutalist-heading text-sm">
              NAVIGATION
            </h4>
            <div className="space-y-2 text-sm font-mono">
              <Link to="/dashboard" className="block text-muted-foreground hover:text-accent transition-colors">
                Dashboard
              </Link>
              <Link to="/leaderboard" className="block text-muted-foreground hover:text-accent transition-colors">
                Leaderboard
              </Link>
              <Link to="/upcoming-features" className="block text-muted-foreground hover:text-accent transition-colors">
                Upcoming Features
              </Link>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-display font-bold text-foreground brutalist-heading text-sm">
              SUPPORT
            </h4>
            <div className="space-y-2 text-sm font-mono">
              <Link to="/donation" className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors">
                <Coffee size={14} />
                Buy us a coffee
              </Link>
              <Link to="/donation" className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors">
                <Heart size={14} />
                Support the project
              </Link>
              <a 
                href="https://github.com/gmnrmyr/wealth-dashboard-flow"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
              >
                <Github size={14} />
                GitHub
              </a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-display font-bold text-foreground brutalist-heading text-sm">
              LEGAL
            </h4>
            <div className="space-y-2 text-sm font-mono">
              <Link to="/privacy" className="block text-muted-foreground hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="block text-muted-foreground hover:text-accent transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted-foreground text-sm font-mono">
              © 2024 {settings.project_name}. Built with ❤️ for the community.
            </p>
            <div className="flex items-center space-x-4">
              <Link to="/donation" className="text-accent hover:text-accent/80 text-sm font-mono transition-colors">
                Donate
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
