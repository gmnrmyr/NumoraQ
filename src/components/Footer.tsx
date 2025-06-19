
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from "@/contexts/TranslationContext";

export const Footer = () => {
  const { language } = useTranslation();

  return (
    <footer className="border-t-2 border-border bg-card/50 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Company Info */}
          <div className="space-y-2">
            <h3 className="font-mono font-bold text-accent uppercase">OPEN FINDASH</h3>
            <p className="text-xs text-muted-foreground font-mono">
              Advanced financial dashboard for crypto & traditional assets
            </p>
            <div className="text-xs text-muted-foreground font-mono">
              © 2024 OPEN FINDASH. All rights reserved.
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
              <Link to="/terms" className="block text-xs text-muted-foreground hover:text-accent font-mono">
                Terms of Service
              </Link>
              <Link to="/privacy" className="block text-xs text-muted-foreground hover:text-accent font-mono">
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Social & Status */}
          <div className="space-y-2">
            <h4 className="font-mono font-semibold text-foreground uppercase">Status</h4>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-muted-foreground font-mono">All systems operational</span>
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              v2.0.0 - {language || 'en'}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
