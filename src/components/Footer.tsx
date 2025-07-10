import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from "@/contexts/TranslationContext";
import { useProjectSettings } from "@/hooks/useProjectSettings";
import { FooterLogo } from "@/components/ui/logo";
import { DonationLinks } from "@/components/navbar/DonationLinks";
import { Github, Twitter, ExternalLink, Zap } from 'lucide-react';

export const Footer = () => {
  const { t, language } = useTranslation();
  const { settings } = useProjectSettings();

  return (
    <footer className="border-t-2 border-border bg-card/50 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Company Info */}
          <div className="space-y-2">
            <FooterLogo />
            <p className="text-xs text-muted-foreground font-mono">
              {t.advancedFinancialDashboard}
            </p>
            <div className="flex items-center gap-2 mb-1">
              <div className="px-2 py-1 bg-accent/20 border border-accent/30 rounded text-xs font-mono text-accent">
                {t.beta}
              </div>
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              {t.allRightsReserved}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-mono font-semibold text-foreground uppercase">{t.quickLinks}</h4>
            <div className="space-y-1">
              <Link to="/dashboard" className="block text-xs text-muted-foreground hover:text-accent font-mono">
                {t.dashboard}
              </Link>
              <Link to="/" className="block text-xs text-muted-foreground hover:text-accent font-mono">
                {t.home}
              </Link>
              <Link to="/leaderboard" className="block text-xs text-muted-foreground hover:text-accent font-mono">
                {t.leaderboard}
              </Link>
              <Link to="/upcoming-features" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-accent font-mono">
                <Zap size={10} />
                {t.upcomingFeatures}
              </Link>
            </div>
          </div>

          {/* Social & Community */}
          <div className="space-y-2">
            <h4 className="font-mono font-semibold text-foreground uppercase">{t.community}</h4>
            <div className="space-y-1">
              <a 
                href="https://github.com/numoraq" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-accent font-mono"
              >
                <Github size={12} />
                {t.github}
                <ExternalLink size={10} />
              </a>
              <a 
                href="https://x.com/numoraq" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-accent font-mono"
              >
                <Twitter size={12} />
                {t.xTwitter}
                <ExternalLink size={10} />
              </a>
              <DonationLinks />
            </div>
          </div>

          {/* Status & Version */}
          <div className="space-y-2">
            <h4 className="font-mono font-semibold text-foreground uppercase">{t.status}</h4>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-muted-foreground font-mono">{t.allSystemsOperational}</span>
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
