
import { Github, Heart, Code } from 'lucide-react';

export const Footer = () => {
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

          {/* Open Source */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Open Source</h3>
            <div className="space-y-2">
              <p className="text-gray-600 text-sm">
                This project is and will always be open source. 
                Contributions, suggestions, and improvements are welcome!
              </p>
              <a 
                href="https://github.com/yourusername/finance-tracker" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Github size={18} />
                <span>View on GitHub</span>
              </a>
            </div>
          </div>

          {/* Legal/Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Information</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Version 1.0.0</p>
              <p>Built with React, TypeScript & Tailwind CSS</p>
              <p className="text-xs text-gray-500 mt-4">
                © 2024 FinanceTracker. Open source under MIT License.
              </p>
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
                href="https://github.com/yourusername/finance-tracker/stargazers" 
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
