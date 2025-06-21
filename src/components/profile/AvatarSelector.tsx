
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useFinancialData } from '@/contexts/FinancialDataContext';

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
  { id: 'nft1', locked: false, rarity: 'Legendary' },
  { id: 'nft2', locked: true, rarity: 'Epic' },
  { id: 'nft3', locked: true, rarity: 'Rare' },
  { id: 'nft4', locked: true, rarity: 'Mythic' },
  { id: 'nft5', locked: true, rarity: 'Common' },
  { id: 'nft6', locked: true, rarity: 'Uncommon' }
];

interface AvatarSelectorProps {
  nickname: string;
}

export const AvatarSelector = ({ nickname }: AvatarSelectorProps) => {
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [showNFTGallery, setShowNFTGallery] = useState(false);
  const { user } = useAuth();
  const { data, updateUserProfile } = useFinancialData();

  const handleAvatarSelect = (avatarIcon: string) => {
    updateUserProfile({ avatarIcon });
    setShowAvatarDialog(false);
  };

  const selectedAvatar = avatarOptions.find(avatar => avatar.icon === data.userProfile.avatarIcon);

  return (
    <>
      <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
        <DialogTrigger asChild>
          <Avatar className="h-16 w-16 border-2 border-border cursor-pointer hover:border-accent transition-colors">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-muted text-muted-foreground font-mono text-xl hover:bg-accent/20">
              {data.userProfile.avatarIcon || (nickname ? nickname.charAt(0).toUpperCase() : 'U')}
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
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
