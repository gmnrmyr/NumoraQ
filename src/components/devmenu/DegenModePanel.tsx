
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Zap, CreditCard } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

interface DegenModePanelProps {
  activatePremiumCode: (code: string, userName: string) => Promise<boolean>;
  userName: string;
}

export const DegenModePanel = ({ activatePremiumCode, userName }: DegenModePanelProps) => {
  const [degenCode, setDegenCode] = useState('');
  const navigate = useNavigate();

  const handleActivateDegenCode = async () => {
    const success = await activatePremiumCode(degenCode, userName);
    if (success) {
      toast({
        title: "Degen Mode Activated!",
        description: "You now have access to premium features."
      });
      setDegenCode('');
    } else {
      toast({
        title: "Invalid Code",
        description: "The code you entered is invalid or already used.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground font-mono">
        Activate premium features:
      </div>
      
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Enter degen code"
          value={degenCode}
          onChange={(e) => setDegenCode(e.target.value)}
          className="w-full p-2 bg-input border-2 border-border font-mono text-sm"
        />
        
        <Button 
          onClick={handleActivateDegenCode}
          className="w-full brutalist-button"
          disabled={!degenCode.trim()}
        >
          <Zap size={16} className="mr-2" />
          Activate Code
        </Button>
        
        <div className="text-center text-xs text-muted-foreground font-mono">
          OR
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={() => navigate('/payment')}
            className="w-full brutalist-button bg-orange-600 hover:bg-orange-700"
          >
            <CreditCard size={16} className="mr-2" />
            Buy Degen Plan
          </Button>
          
          <Button 
            onClick={() => navigate('/donate')}
            className="w-full brutalist-button bg-blue-600 hover:bg-blue-700"
          >
            Support Platform
          </Button>
        </div>
      </div>
    </div>
  );
};
