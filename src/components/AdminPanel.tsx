
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Key, X, Copy } from 'lucide-react';
import { useAdminMode } from '@/hooks/useAdminMode';
import { toast } from '@/hooks/use-toast';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const { isAdminMode, enterAdminMode, exitAdminMode, generateDegenCode } = useAdminMode();
  const [password, setPassword] = useState('');
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);

  const handleLogin = () => {
    if (enterAdminMode(password)) {
      toast({
        title: "Admin Mode Activated",
        description: "You now have admin privileges."
      });
      setPassword('');
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid admin password.",
        variant: "destructive"
      });
    }
  };

  const handleGenerateCode = () => {
    const code = generateDegenCode();
    setGeneratedCodes(prev => [code, ...prev.slice(0, 9)]);
    toast({
      title: "Degen Code Generated",
      description: `Code: ${code}`
    });
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied",
      description: "Code copied to clipboard."
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-2 border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-mono uppercase">
            <Shield size={16} className="text-accent" />
            Admin Panel
          </DialogTitle>
        </DialogHeader>

        {!isAdminMode ? (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground font-mono">
              Enter admin password to access admin features:
            </div>
            <Input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="font-mono"
            />
            <div className="flex gap-2">
              <Button onClick={handleLogin} className="brutalist-button flex-1">
                Login
              </Button>
              <Button onClick={onClose} variant="outline" className="brutalist-button">
                <X size={16} />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Card className="bg-background/50 border-2 border-green-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-green-400 flex items-center gap-2 text-sm font-mono uppercase">
                  <Key size={16} />
                  Degen Code Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleGenerateCode}
                  className="w-full brutalist-button bg-green-600 hover:bg-green-700"
                >
                  Generate Degen Code
                </Button>
                
                {generatedCodes.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground font-mono uppercase">Recent Codes:</div>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {generatedCodes.map((code, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted p-2 rounded font-mono text-xs">
                          <span>{code}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(code)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy size={12} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button 
                onClick={exitAdminMode}
                variant="outline" 
                className="brutalist-button flex-1"
              >
                Exit Admin Mode
              </Button>
              <Button onClick={onClose} variant="outline" className="brutalist-button">
                <X size={16} />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
