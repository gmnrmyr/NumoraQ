
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Crown, Sparkles, Lock } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { toast } from "@/hooks/use-toast";

// Basic avatar options
const BASIC_AVATARS = [
  { id: 'User', icon: User, name: 'Default User', locked: false },
  { id: 'Crown', icon: Crown, name: 'Crown', locked: false },
  { id: 'Sparkles', icon: Sparkles, name: 'Sparkles', locked: false }
];

// Premium NFT avatars (locked for now)
const NFT_AVATARS = [
  { id: 'nft1', name: 'Locked NFT', locked: true },
  { id: 'nft2', name: 'Locked NFT', locked: true },
  { id: 'nft3', name: 'Locked NFT', locked: true },
  { id: 'nft4', name: 'Locked NFT', locked: true },
  { id: 'nft5', name: 'Locked NFT', locked: true },
  { id: 'nft6', name: 'Locked NFT', locked: true },
];

export const AvatarSelector = () => {
  const { data, updateUserProfile } = useFinancialData();
  const [selectedAvatar, setSelectedAvatar] = useState(data.userProfile.avatarIcon || 'User');

  const handleAvatarSelect = (avatarId: string) => {
    // Only allow selection of unlocked avatars
    const isBasicAvatar = BASIC_AVATARS.find(avatar => avatar.id === avatarId && !avatar.locked);
    
    if (isBasicAvatar) {
      setSelectedAvatar(avatarId);
      updateUserProfile({ avatarIcon: avatarId });
      toast({
        title: "Avatar Updated",
        description: "Your avatar has been changed successfully!"
      });
    } else {
      toast({
        title: "Avatar Locked",
        description: "This avatar is not available yet.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="brutalist-card">
      <CardHeader>
        <CardTitle className="font-mono uppercase text-accent text-sm">
          Choose Avatar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="basic" className="font-mono text-xs">Basic</TabsTrigger>
            <TabsTrigger value="nfts" className="font-mono text-xs">NFT Gallery</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <div className="grid grid-cols-3 gap-3">
              {BASIC_AVATARS.map((avatar) => {
                const IconComponent = avatar.icon;
                const isSelected = selectedAvatar === avatar.id;
                
                return (
                  <Button
                    key={avatar.id}
                    variant={isSelected ? "default" : "outline"}
                    className={`h-20 flex flex-col gap-2 brutalist-button ${
                      isSelected ? 'bg-accent text-accent-foreground' : ''
                    }`}
                    onClick={() => handleAvatarSelect(avatar.id)}
                    disabled={avatar.locked}
                  >
                    <IconComponent size={24} />
                    <span className="text-xs font-mono">{avatar.name}</span>
                  </Button>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="nfts">
            <div className="grid grid-cols-3 gap-3">
              {NFT_AVATARS.map((avatar, index) => (
                <Button
                  key={avatar.id}
                  variant="outline"
                  className="h-20 flex flex-col gap-2 brutalist-button opacity-50 cursor-not-allowed"
                  disabled={true}
                >
                  <Lock size={24} className="text-muted-foreground" />
                  <span className="text-xs font-mono text-muted-foreground">
                    {avatar.name}
                  </span>
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
