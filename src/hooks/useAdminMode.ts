
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

export const useAdminMode = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [codes, setCodes] = useState<DegenCode[]>([]);

  useEffect(() => {
    // Load codes from localStorage
    const savedCodes = localStorage.getItem('adminGeneratedCodes');
    if (savedCodes) {
      setCodes(JSON.parse(savedCodes));
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
    codes,
    getActiveCodeStats
  };
};
