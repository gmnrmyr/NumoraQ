
import { useState, useEffect } from 'react';

interface DegenCode {
  code: string;
  duration: string;
  createdAt: string;
  used: boolean;
  usedBy?: string;
}

export const useAdminMode = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [degenCodes, setDegenCodes] = useState<DegenCode[]>([]);
  const [isDegenMode, setIsDegenMode] = useState(false);
  const [degenExpiry, setDegenExpiry] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'E') {
        event.preventDefault();
        setShowAdminPanel(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    // Load stored data
    const adminMode = localStorage.getItem('adminMode');
    const storedCodes = localStorage.getItem('degenCodes');
    const storedDegenMode = localStorage.getItem('degenMode');
    const storedDegenExpiry = localStorage.getItem('degenExpiry');
    
    if (adminMode === 'true') {
      setIsAdminMode(true);
    }
    
    if (storedCodes) {
      try {
        setDegenCodes(JSON.parse(storedCodes));
      } catch (error) {
        console.error('Error parsing stored degen codes:', error);
      }
    }

    if (storedDegenMode === 'true' && storedDegenExpiry) {
      const expiryDate = new Date(storedDegenExpiry);
      if (expiryDate > new Date()) {
        setIsDegenMode(true);
        setDegenExpiry(storedDegenExpiry);
      } else {
        // Expired
        localStorage.removeItem('degenMode');
        localStorage.removeItem('degenExpiry');
      }
    }
  }, []);

  const enterAdminMode = (password: string) => {
    if (password === 'admin123') {
      setIsAdminMode(true);
      setShowAdminPanel(false);
      localStorage.setItem('adminMode', 'true');
      return true;
    }
    return false;
  };

  const exitAdminMode = () => {
    setIsAdminMode(false);
    localStorage.removeItem('adminMode');
  };

  const generateDegenCode = (duration: '1year' | '5years' | 'lifetime') => {
    const code = `DEGEN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const newCode: DegenCode = {
      code,
      duration,
      createdAt: new Date().toISOString(),
      used: false
    };
    
    const updatedCodes = [...degenCodes, newCode];
    setDegenCodes(updatedCodes);
    localStorage.setItem('degenCodes', JSON.stringify(updatedCodes));
    
    return code;
  };

  const activateDegenCode = (code: string, userEmail?: string) => {
    const foundCode = degenCodes.find(c => c.code === code && !c.used);
    if (!foundCode) return false;

    // Mark code as used
    const updatedCodes = degenCodes.map(c => 
      c.code === code ? { ...c, used: true, usedBy: userEmail } : c
    );
    setDegenCodes(updatedCodes);
    localStorage.setItem('degenCodes', JSON.stringify(updatedCodes));

    // Calculate expiry
    const now = new Date();
    let expiry: Date;
    
    switch (foundCode.duration) {
      case '1year':
        expiry = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
        break;
      case '5years':
        expiry = new Date(now.getFullYear() + 5, now.getMonth(), now.getDate());
        break;
      case 'lifetime':
        expiry = new Date(2099, 11, 31); // Far future date
        break;
      default:
        expiry = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
    }

    setIsDegenMode(true);
    setDegenExpiry(expiry.toISOString());
    localStorage.setItem('degenMode', 'true');
    localStorage.setItem('degenExpiry', expiry.toISOString());

    return true;
  };

  const getDegenTimeRemaining = () => {
    if (!degenExpiry) return null;
    
    const expiry = new Date(degenExpiry);
    const now = new Date();
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const years = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
    const days = Math.floor((diff % (365.25 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000));
    
    if (years > 50) return 'Lifetime';
    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ${days > 0 ? `${days} days` : ''}`;
    return `${days} day${days > 1 ? 's' : ''}`;
  };

  return {
    isAdminMode,
    showAdminPanel,
    setShowAdminPanel,
    enterAdminMode,
    exitAdminMode,
    generateDegenCode,
    activateDegenCode,
    degenCodes,
    isDegenMode,
    degenExpiry,
    getDegenTimeRemaining
  };
};
