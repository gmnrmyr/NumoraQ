import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { User, Mail, DollarSign, Globe, LogOut, Crown, Gift, Skull, Bot, Zap } from 'lucide-react';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminMode } from '@/hooks/useAdminMode';
import { EditableValue } from './ui/editable-value';

const avatarOptions = [
  { id: '1', icon: '🤖', name: 'Robot' },
  { id: '2', icon: '💀', name: 'Skull' },
  { id: '3', icon: '⚡', name: 'Lightning' },
  { id: '4', icon: '🔥', name: 'Fire' },
  { id: '5', icon: '💎', name: 'Diamond' },
  { id: '6', icon: '🚀', name: 'Rocket' },
  { id: '7', icon: '👾', name: 'Alien' },
  { id: '8', icon: '🎯', name: 'Target' },
  { id: '9', icon: '⚔️', name: 'Swords' },
  { id: '10', icon: '🛡️', name: 'Shield' },
  { id: '11', icon: '🎮', name: 'Gaming' },
  { id: '12', icon: '🔮', name: 'Crystal' }
];

export const UserProfileSection = () => {
  const {
    data,
    updateUserProfile
  } = useFinancialData();
  const {
    user,
    signOut
  } = useAuth();
  const {
    isDegenMode,
    getDegenTimeRemaining,
    activateDegenCode
  } = useAdminMode();
  const [showDegenDialog, setShowDegenDialog] = useState(false);
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [degenCode, setDegenCode] = useState('');
  
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  const handleActivateDegenCode = () => {
    if (activateDegenCode(degenCode, user?.email)) {
      setDegenCode('');
      setShowDegenDialog(false);
    } else {
      alert('Invalid or already used code');
    }
  };

  const handleAvatarSelect = (avatarIcon: string) => {
    updateUserProfile({ avatarIcon });
    setShowAvatarDialog(false);
  };

  const selectedAvatar = avatarOptions.find(avatar => avatar.icon === data.userProfile.avatarIcon);

  return <Card className="bg-card border-2 border-border brutalist-card">
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
            <DialogTrigger asChild>
              <Avatar className="h-16 w-16 border-2 border-border cursor-pointer hover:border-accent transition-colors">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-muted text-muted-foreground font-mono text-xl hover:bg-accent/20">
                  {data.userProfile.avatarIcon || (data.userProfile.name ? data.userProfile.name.charAt(0).toUpperCase() : 'U')}
                </AvatarFallback>
              </Avatar>
            </DialogTrigger>
            <DialogContent className="bg-card border-2 border-border max-w-md">
              <DialogHeader>
                <DialogTitle className="font-mono uppercase">Choose Avatar</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-4 gap-3 p-4">
                {avatarOptions.map((avatar) => (
                  <Button
                    key={avatar.id}
                    variant="outline"
                    className={`h-16 w-16 text-2xl border-2 ${
                      selectedAvatar?.id === avatar.id 
                        ? 'border-accent bg-accent/20' 
                        : 'border-border hover:border-accent/50'
                    }`}
                    onClick={() => handleAvatarSelect(avatar.icon)}
                  >
                    {avatar.icon}
                  </Button>
                ))}
              </div>
              <div className="text-xs text-muted-foreground font-mono text-center">
                Choose your degen avatar. NFT avatars coming soon! 🚀
              </div>
            </DialogContent>
          </Dialog>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <User size={14} className="text-muted-foreground" />
              <EditableValue value={data.userProfile.name} onSave={value => updateUserProfile({
              name: String(value)
            })} type="text" placeholder="Your name" className="font-medium bg-input border-2 border-border font-mono" />
            </div>
            {user && <div className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground font-mono">{user.email}</span>
                </div>
                <Button onClick={handleLogout} size="sm" variant="outline" className="brutalist-button text-xs">
                  <LogOut size={12} className="mr-1" />
                  Logout
                </Button>
              </div>}
            <div className="flex items-center gap-2">
              <DollarSign size={14} className="text-muted-foreground" />
              <EditableValue value={data.userProfile.defaultCurrency} onSave={value => updateUserProfile({
              defaultCurrency: String(value) as "BRL" | "USD" | "EUR"
            })} type="text" className="font-mono bg-input border-2 border-border" />
            </div>
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-muted-foreground" />
              <EditableValue value={data.userProfile.language} onSave={value => updateUserProfile({
              language: String(value) as "en" | "pt" | "es"
            })} type="text" className="font-mono bg-input border-2 border-border" />
            </div>
          </div>
        </div>

        {/* Degen Mode Section */}
        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown size={16} className={isDegenMode ? "text-yellow-400" : "text-muted-foreground"} />
              <span className="font-mono text-sm">Degen Mode</span>
              {isDegenMode && <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400">
                  ACTIVE
                </Badge>}
            </div>
            {!isDegenMode ? <Dialog open={showDegenDialog} onOpenChange={setShowDegenDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="text-xs font-mono">
                    <Gift size={12} className="mr-1" />
                    Activate
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-2 border-border">
                  <DialogHeader>
                    <DialogTitle className="font-mono">Activate Degen Mode</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground font-mono">
                      Enter your degen code to activate ad-free experience:
                    </p>
                    <Input placeholder="DEGEN-XXXXXX" value={degenCode} onChange={e => setDegenCode(e.target.value.toUpperCase())} className="font-mono" />
                    <Button onClick={handleActivateDegenCode} className="w-full" disabled={!degenCode.trim()}>
                      Activate
                    </Button>
                  </div>
                </DialogContent>
              </Dialog> : <div className="text-xs font-mono text-muted-foreground">
                {getDegenTimeRemaining()}
              </div>}
          </div>
          <div className="text-xs text-muted-foreground font-mono mt-2">
            {isDegenMode ? '🚀 No ads! Premium experience activated' : '📺 Future: Activate for ad-free experience'}
          </div>
        </div>

        <div className="text-xs text-muted-foreground font-mono bg-muted p-2 border-2 border-border rounded">
          👤 <strong>Profile:</strong> Customize your dashboard experience and preferences.
        </div>
      </CardContent>
    </Card>;
};
