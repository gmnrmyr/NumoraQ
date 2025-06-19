
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAdminMode } from '@/hooks/useAdminMode';

interface DonationContextType {
  projectWallet: string;
  cryptoEnabled: boolean;
  paypalEnabled: boolean;
  donationGoal?: number;
  totalRaised: number;
  updateTotalRaised: (amount: number) => void;
}

const DonationContext = createContext<DonationContextType | undefined>(undefined);

export const DonationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { projectSettings } = useAdminMode();
  const [totalRaised, setTotalRaised] = useState(0);

  useEffect(() => {
    // Load total raised from localStorage
    const saved = localStorage.getItem('totalDonationsRaised');
    if (saved) {
      setTotalRaised(Number(saved));
    }
  }, []);

  const updateTotalRaised = (amount: number) => {
    const newTotal = totalRaised + amount;
    setTotalRaised(newTotal);
    localStorage.setItem('totalDonationsRaised', newTotal.toString());
  };

  return (
    <DonationContext.Provider value={{
      projectWallet: projectSettings.walletAddress,
      cryptoEnabled: projectSettings.enableCryptoDonations,
      paypalEnabled: projectSettings.enablePayPalDonations,
      donationGoal: projectSettings.donationGoal,
      totalRaised,
      updateTotalRaised
    }}>
      {children}
    </DonationContext.Provider>
  );
};

export const useDonation = () => {
  const context = useContext(DonationContext);
  if (!context) {
    throw new Error('useDonation must be used within a DonationProvider');
  }
  return context;
};
