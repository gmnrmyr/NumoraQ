
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
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      {/* Ad Space Placeholder */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500 text-sm">Advertisement Space</p>
          <p className="text-xs text-gray-400 mt-1">Google AdSense integration ready</p>
        </div>
      </div>

      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Project Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Code className="text-blue-600" size={24} />
              <span className="text-lg font-semibold text-gray-800">FinanceTracker</span>
            </div>
            <p className="text-gray-600 text-sm">
              Open source personal finance management tool. 
              Track your income, expenses, assets, and financial goals with ease.
            </p>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <span>Made with</span>
              <Heart size={14} className="text-red-500" />
              <span>for the community</span>
            </div>
          </div>

          {/* Open Source & Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Open Source</h3>
            <div className="space-y-2">
              <p className="text-gray-600 text-sm">
                This project is and will always be open source. 
                Contributions, suggestions, and improvements are welcome!
              </p>
              <div className="flex flex-col space-y-2">
                <a 
                  href="https://github.com/gmnrmyr/wealth-dashboard-flow" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Github size={18} />
                  <span>View on GitHub</span>
                </a>
                
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <button className="inline-flex items-center space-x-2 text-green-600 hover:text-green-800 transition-colors">
                      <DollarSign size={18} />
                      <span>Support with Crypto</span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Support This Project</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        Support this project and the continuation of its development, pay me a coffee or support me and my family living in Brazil.
                      </p>
                      <div className="space-y-3">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium">EVM Address</p>
                              <p className="text-xs text-gray-500">Ethereum, Polygon, BSC, etc.</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard('0x6c21bb0ef4b7d037ab6b124f372ae7705c6d74ad')}
                            >
                              Copy
                            </Button>
                          </div>
                          <p className="text-xs font-mono mt-2 break-all">
                            0x6c21bb0ef4b7d037ab6b124f372ae7705c6d74ad
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 text-center">
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
            <h3 className="text-lg font-semibold text-gray-800">Community</h3>
            <div className="space-y-2">
              <p className="text-gray-600 text-sm">
                Connect with us and stay updated on the latest developments.
              </p>
              <div className="flex flex-col space-y-2">
                <a 
                  href="#" 
                  className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <MessageCircle size={18} />
                  <span>Discord (Coming Soon)</span>
                </a>
                <a 
                  href="#" 
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Twitter size={18} />
                  <span>Twitter (Coming Soon)</span>
                </a>
              </div>
              <div className="text-sm text-gray-600 mt-4">
                <p>Version 1.0.0</p>
                <p>Built with React, TypeScript & Tailwind CSS</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-xs text-gray-500">
              Forever open source • Community driven • Privacy focused
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>Support this project</span>
              <a 
                href="https://github.com/gmnrmyr/wealth-dashboard-flow/stargazers" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-gray-700 transition-colors"
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
