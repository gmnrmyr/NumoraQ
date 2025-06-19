
import { useState, useEffect } from 'react';

interface DegenCode {
  code: string;
  duration: '1year' | '5years' | 'lifetime';
  createdAt: string;
  expiresAt: string;
  usedBy?: string;
  usedAt?: string;
  grantedVia?: 'admin' | 'payment' | 'donation';
}

interface ActiveDegenCode {
  code: string;
  expiresAt: string;
  activatedBy?: string;
}

export const useAdminMode = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [codes, setCodes] = useState<DegenCode[]>([]);
  const [activeDegenCode, setActiveDegenCode] = useState<ActiveDegenCode | null>(null);

  useEffect(() => {
    // Load codes from localStorage
    const savedCodes = localStorage.getItem('adminGeneratedCodes');
    if (savedCodes) {
      setCodes(JSON.parse(savedCodes));
    }

    // Load active degen code
    const savedActiveCode = localStorage.getItem('activeDegenCode');
    if (savedActiveCode) {
      const parsedCode = JSON.parse(savedActiveCode);
      // Check if code is still valid
      if (new Date(parsedCode.expiresAt) > new Date()) {
        setActiveDegenCode(parsedCode);
      } else {
        localStorage.removeItem('activeDegenCode');
      }
    }
  }, []);

  const enterAdminMode = (password: string): boolean => {
    // Simple password check - in production, this should be more secure
    if (password === 'admin123' || password === 'lovable2024') {
      setIsAdminMode(true);
      return true;
    }
    return false;
  };

  const exitAdminMode = () => {
    setIsAdminMode(false);
  };

  const generateDegenCode = (duration: '1year' | '5years' | 'lifetime'): string => {
    const prefix = duration === 'lifetime' ? 'LIFE' : duration === '5years' ? '5YR' : '1YR';
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    const code = `${prefix}-${randomString}`;
    
    const now = new Date();
    let expiresAt: string;
    
    switch (duration) {
      case '1year':
        expiresAt = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()).toISOString();
        break;
      case '5years':
        expiresAt = new Date(now.getFullYear() + 5, now.getMonth(), now.getDate()).toISOString();
        break;
      case 'lifetime':
        expiresAt = new Date(2099, 11, 31).toISOString();
        break;
    }

    const newCode: DegenCode = {
      code,
      duration,
      createdAt: now.toISOString(),
      expiresAt,
      grantedVia: 'admin'
    };

    const updatedCodes = [newCode, ...codes];
    setCodes(updatedCodes);
    localStorage.setItem('adminGeneratedCodes', JSON.stringify(updatedCodes));
    
    return code;
  };

  const addDonationCode = (walletAddress: string, amount: number): string => {
    let duration: '1year' | '5years' | 'lifetime';
    
    if (amount >= 1000) {
      duration = 'lifetime';
    } else if (amount >= 500) {
      duration = '5years';
    } else {
      duration = '1year';
    }

    const code = generateDegenCode(duration);
    
    // Update the code to mark it as donation-granted
    const updatedCodes = codes.map(c => 
      c.code === code 
        ? { ...c, grantedVia: 'donation' as const, usedBy: walletAddress }
        : c
    );
    
    setCodes(updatedCodes);
    localStorage.setItem('adminGeneratedCodes', JSON.stringify(updatedCodes));
    
    return code;
  };

  const activateDegenCode = (code: string, userIdentifier?: string): boolean => {
    const foundCode = codes.find(c => c.code === code && !c.usedBy);
    
    if (foundCode && new Date(foundCode.expiresAt) > new Date()) {
      // Mark code as used
      const updatedCodes = codes.map(c => 
        c.code === code 
          ? { ...c, usedBy: userIdentifier || 'unknown', usedAt: new Date().toISOString() }
          : c
      );
      setCodes(updatedCodes);
      localStorage.setItem('adminGeneratedCodes', JSON.stringify(updatedCodes));

      // Set active degen code
      const activeCode: ActiveDegenCode = {
        code: foundCode.code,
        expiresAt: foundCode.expiresAt,
        activatedBy: userIdentifier
      };
      setActiveDegenCode(activeCode);
      localStorage.setItem('activeDegenCode', JSON.stringify(activeCode));
      
      return true;
    }
    
    return false;
  };

  const isDegenMode = activeDegenCode !== null && new Date(activeDegenCode.expiresAt) > new Date();

  const getDegenTimeRemaining = (): string => {
    if (!activeDegenCode) return '';
    
    const now = new Date();
    const expires = new Date(activeDegenCode.expiresAt);
    const diff = expires.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24));
    
    if (years > 0) return `${years}y ${days}d remaining`;
    if (days > 0) return `${days} days remaining`;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `${hours} hours remaining`;
  };

  const getActiveCodeStats = () => {
    const now = new Date();
    const activeCodes = codes.filter(code => new Date(code.expiresAt) > now);
    const expiredCodes = codes.filter(code => new Date(code.expiresAt) <= now);
    const usedCodes = codes.filter(code => code.usedBy);

    return {
      total: codes.length,
      active: activeCodes.length,
      expired: expiredCodes.length,
      used: usedCodes.length,
      byDuration: {
        lifetime: codes.filter(c => c.duration === 'lifetime').length,
        fiveYears: codes.filter(c => c.duration === '5years').length,
        oneYear: codes.filter(c => c.duration === '1year').length
      },
      bySource: {
        admin: codes.filter(c => c.grantedVia === 'admin').length,
        donation: codes.filter(c => c.grantedVia === 'donation').length,
        payment: codes.filter(c => c.grantedVia === 'payment').length
      }
    };
  };

  return {
    isAdminMode,
    enterAdminMode,
    exitAdminMode,
    generateDegenCode,
    addDonationCode,
    activateDegenCode,
    isDegenMode,
    getDegenTimeRemaining,
    showAdminPanel,
    setShowAdminPanel,
    codes,
    getActiveCodeStats
  };
};
