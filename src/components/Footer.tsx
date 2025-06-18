
import { Github, Heart, Code, DollarSign, MessageCircle, Twitter } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export const Footer = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here if needed
  };

  return (
    <footer className="bg-card border-t-2 border-border mt-16">
      {/* Ad Space Placeholder */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-muted border-2 border-dashed border-border p-8 text-center">
          <p className="text-muted-foreground text-sm font-mono uppercase tracking-wide">Advertisement Space</p>
          <p className="text-xs text-muted-foreground mt-1 font-mono">Google AdSense integration ready</p>
        </div>
      </div>

      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Project Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Code className="text-accent" size={24} />
              <span className="text-lg font-display font-bold uppercase tracking-wide">OPEN FINDASH</span>
            </div>
            <p className="text-muted-foreground text-sm font-mono">
              Open source personal finance management tool. 
              Track your income, expenses, assets, and financial goals with ease.
            </p>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground font-mono">
              <span>Made with</span>
              <Heart size={14} className="text-red-500" />
              <span>for the community</span>
            </div>
          </div>

          {/* Open Source & Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-display font-bold uppercase tracking-wide">Open Source</h3>
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm font-mono">
                This project is and will always be open source. 
                Contributions, suggestions, and improvements are welcome!
              </p>
              <div className="flex flex-col space-y-2">
                <a 
                  href="https://github.com/gmnrmyr/wealth-dashboard-flow" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-accent hover:text-accent-foreground transition-colors font-mono uppercase text-sm"
                >
                  <Github size={18} />
                  <span>View on GitHub</span>
                </a>
                
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <button className="inline-flex items-center space-x-2 text-accent hover:text-accent-foreground transition-colors font-mono uppercase text-sm">
                      <DollarSign size={18} />
                      <span>Support with Crypto</span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-card border-2 border-border">
                    <DialogHeader>
                      <DialogTitle className="font-display uppercase">Support This Project</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground font-mono">
                        Support this project and the continuation of its development, pay me a coffee or support me and my family living in Brazil.
                      </p>
                      <div className="space-y-3">
                        <div className="bg-muted p-3 border-2 border-border">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-mono font-bold uppercase">EVM Address</p>
                              <p className="text-xs text-muted-foreground font-mono">Ethereum, Polygon, BSC, etc.</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard('0x6c21bb0ef4b7d037ab6b124f372ae7705c6d74ad')}
                              className="brutalist-button"
                            >
                              Copy
                            </Button>
                          </div>
                          <p className="text-xs font-mono mt-2 break-all bg-background p-2 border border-border">
                            0x6c21bb0ef4b7d037ab6b124f372ae7705c6d74ad
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground text-center font-mono">
                          Bitcoin and other networks coming soon!
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {/* Community & Social */}
          <div className="space-y-4">
            <h3 className="text-lg font-display font-bold uppercase tracking-wide">Community</h3>
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm font-mono">
                Connect with us and stay updated on the latest developments.
              </p>
              <div className="flex flex-col space-y-2">
                <a 
                  href="#" 
                  className="inline-flex items-center space-x-2 text-accent hover:text-accent-foreground transition-colors font-mono uppercase text-sm"
                >
                  <MessageCircle size={18} />
                  <span>Discord (Coming Soon)</span>
                </a>
                <a 
                  href="#" 
                  className="inline-flex items-center space-x-2 text-accent hover:text-accent-foreground transition-colors font-mono uppercase text-sm"
                >
                  <Twitter size={18} />
                  <span>Twitter (Coming Soon)</span>
                </a>
              </div>
              <div className="text-sm text-muted-foreground mt-4 font-mono">
                <p>Version 1.0.0</p>
                <p>Built with React, TypeScript & Tailwind CSS</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-muted border-t-2 border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wide">
              Forever open source • Community driven • Privacy focused
            </p>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground font-mono">
              <span className="uppercase">Support this project</span>
              <a 
                href="https://github.com/gmnrmyr/wealth-dashboard-flow/stargazers" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors uppercase"
              >
                Star on GitHub ⭐
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
