
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { User, Mail, DollarSign, Globe, LogOut, Crown, Gift, Skull, Bot, Zap, Lock } from 'lucide-react';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminMode } from '@/hooks/useAdminMode';
import { EditableValue } from './ui/editable-value';
import { UserTitleBadge } from './dashboard/UserTitleBadge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

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

const nftPlaceholders = [
  { id: 'nft1', name: 'Crypto Punk #1337', locked: false, rarity: 'Legendary' },
  { id: 'nft2', name: 'Bored Ape #4269', locked: true, rarity: 'Epic' },
  { id: 'nft3', name: 'CoolCat #888', locked: true, rarity: 'Rare' },
  { id: 'nft4', name: 'Degen #0001', locked: true, rarity: 'Mythic' },
  { id: 'nft5', name: 'OpenSea #999', locked: true, rarity: 'Common' },
  { id: 'nft6', name: 'PixelPunk #42', locked: true, rarity: 'Uncommon' }
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
    activatePremiumCode
  } = useAdminMode();
  const [showDegenDialog, setShowDegenDialog] = useState(false);
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [showNFTGallery, setShowNFTGallery] = useState(false);
  const [degenCode, setDegenCode] = useState('');
  
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  const handleActivateDegenCode = async () => {
    const success = await activatePremiumCode(degenCode, user?.email);
    if (success) {
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

  const truncateEmail = (email: string) => {
    if (email.length <= 16) return email;
    return email.substring(0, 13) + '...';
  };

  const selectedAvatar = avatarOptions.find(avatar => avatar.icon === data.userProfile.avatarIcon);

  // Simple premium status check - we'll enhance this later with the backend
  const isDegenMode = false; // Placeholder until backend integration
  const getDegenTimeRemaining = () => "No active premium"; // Placeholder

  return (
    <Card className="bg-card border-2 border-border brutalist-card">
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
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-mono text-sm mb-3">Standard Avatars</h4>
                  <div className="grid grid-cols-4 gap-3">
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
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-mono text-sm">My NFTs</h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowNFTGallery(true)}
                      className="text-xs font-mono"
                    >
                      View Gallery
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {nftPlaceholders.slice(0, 3).map((nft) => (
                      <div
                        key={nft.id}
                        className={`relative aspect-square border-2 rounded-lg flex items-center justify-center text-xs font-mono ${
                          nft.locked 
                            ? 'border-muted bg-muted/20 text-muted-foreground' 
                            : 'border-accent bg-accent/10 text-accent cursor-pointer hover:bg-accent/20'
                        }`}
                      >
                        {nft.locked && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Lock size={20} className="text-muted-foreground" />
                          </div>
                        )}
                        {!nft.locked && (
                          <div className="text-center">
                            <div>🖼️</div>
                            <div className="text-xs">{nft.rarity}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground font-mono text-center">
                NFT avatars unlock with donations. More coming soon! 🚀
              </div>
            </DialogContent>
          </Dialog>

          {/* NFT Gallery Dialog */}
          <Dialog open={showNFTGallery} onOpenChange={setShowNFTGallery}>
            <DialogContent className="bg-card border-2 border-border max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-mono uppercase">NFT Avatar Gallery</DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-3 gap-4">
                {nftPlaceholders.map((nft) => (
                  <div
                    key={nft.id}
                    className={`relative aspect-square border-2 rounded-lg p-4 ${
                      nft.locked 
                        ? 'border-muted bg-muted/20' 
                        : 'border-accent bg-accent/10 cursor-pointer hover:bg-accent/20'
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      {nft.locked ? (
                        <>
                          <Lock size={32} className="text-muted-foreground mb-2" />
                          <div className="text-xs font-mono text-muted-foreground">LOCKED</div>
                        </>
                      ) : (
                        <>
                          <div className="text-3xl mb-2">🖼️</div>
                          <div className="text-xs font-mono font-bold">{nft.rarity}</div>
                        </>
                      )}
                    </div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="text-xs font-mono truncate">{nft.name}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <div className="text-sm font-mono text-muted-foreground mb-2">
                  Unlock NFT avatars by supporting the project!
                </div>
                <div className="text-xs font-mono text-accent">
                  💎 Donate $100+ to unlock premium avatars
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <User size={14} className="text-muted-foreground" />
              <EditableValue 
                value={data.userProfile.name} 
                onSave={value => updateUserProfile({ name: String(value) })} 
                type="text" 
                placeholder="Your name" 
                className="font-medium bg-input border-2 border-border font-mono" 
              />
              <UserTitleBadge />
            </div>
            {user && (
              <div className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Mail size={14} className="text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-muted-foreground font-mono truncate">
                    {truncateEmail(user.email)}
                  </span>
                </div>
                <Button 
                  onClick={handleLogout} 
                  size="sm" 
                  variant="outline" 
                  className="brutalist-button text-xs flex-shrink-0"
                >
                  <LogOut size={12} className="sm:mr-1" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <DollarSign size={14} className="text-muted-foreground" />
              <Select 
                value={data.userProfile.defaultCurrency} 
                onValueChange={(value) => updateUserProfile({ defaultCurrency: value as "BRL" | "USD" | "EUR" })}
              >
                <SelectTrigger className="w-32 bg-input border-2 border-border font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">🇧🇷 BRL</SelectItem>
                  <SelectItem value="USD">🇺🇸 USD</SelectItem>
                  <SelectItem value="EUR">🇪🇺 EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-muted-foreground" />
              <Select 
                value={data.userProfile.language} 
                onValueChange={(value) => updateUserProfile({ language: value as "en" | "pt" | "es" })}
              >
                <SelectTrigger className="w-32 bg-input border-2 border-border font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">🇺🇸 EN</SelectItem>
                  <SelectItem value="pt">🇧🇷 PT</SelectItem>
                  <SelectItem value="es">🇪🇸 ES</SelectItem>
                </SelectContent>
              </Select>
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
    </Card>
  );
};
