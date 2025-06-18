import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useFinancialData } from '@/contexts/FinancialDataContext';

const avatarOptions = [
  {
    id: 'woman-laptop',
    src: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop&crop=face',
    alt: 'Woman with laptop'
  },
  {
    id: 'woman-professional',
    src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop&crop=face',
    alt: 'Professional woman'
  },
  {
    id: 'man-office',
    src: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=150&h=150&fit=crop&crop=face',
    alt: 'Man in office'
  },
  {
    id: 'cat-cute',
    src: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=150&h=150&fit=crop&crop=face',
    alt: 'Cute cat'
  },
  {
    id: 'monkey-fun',
    src: 'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=150&h=150&fit=crop&crop=face',
    alt: 'Fun monkey'
  }
];

export const UserAvatarSection: React.FC = () => {
  const { user } = useAuth();
  const { data, updateUserProfile } = useFinancialData();
  const [selectedAvatar, setSelectedAvatar] = useState<string>(data.userProfile.avatar || '');

  const handleAvatarSelect = (avatarId: string) => {
    const avatar = avatarOptions.find(a => a.id === avatarId);
    if (avatar) {
      setSelectedAvatar(avatarId);
      updateUserProfile({ avatar: avatar.src });
    }
  };

  const generateRandomAvatar = () => {
    const randomAvatar = avatarOptions[Math.floor(Math.random() * avatarOptions.length)];
    setSelectedAvatar(randomAvatar.id);
    updateUserProfile({ avatar: randomAvatar.src });
  };

  if (!user) return null;

  return (
    <Card className="brutalist-card">
      <CardHeader>
        <CardTitle className="brutalist-heading flex items-center gap-2">
          <User size={20} />
          USER AVATAR
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 border-2 border-border">
            <AvatarImage 
              src={data.userProfile.avatar} 
              alt={data.userProfile.name || 'User'} 
            />
            <AvatarFallback className="bg-muted border-2 border-border font-mono text-lg">
              {(data.userProfile.name || user.email || 'U').charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-mono font-bold">{data.userProfile.name || user.email}</h3>
            <p className="text-sm text-muted-foreground font-mono">
              {data.userProfile.avatar ? 'Custom avatar selected' : 'Using default avatar'}
            </p>
          </div>
          <Button
            onClick={generateRandomAvatar}
            variant="outline"
            size="sm"
            className="brutalist-button"
          >
            <RefreshCw size={16} />
            <span className="hidden sm:inline ml-2">Random</span>
          </Button>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-mono font-bold uppercase text-muted-foreground">
            Choose Avatar:
          </h4>
          <div className="grid grid-cols-5 gap-3">
            {avatarOptions.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => handleAvatarSelect(avatar.id)}
                className={`relative group ${
                  selectedAvatar === avatar.id ? 'ring-2 ring-accent' : ''
                }`}
              >
                <Avatar className="w-12 h-12 border-2 border-border hover:border-accent transition-colors">
                  <AvatarImage src={avatar.src} alt={avatar.alt} />
                  <AvatarFallback className="bg-muted text-xs font-mono">
                    {avatar.id.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {selectedAvatar === avatar.id && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent border-2 border-background rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-muted-foreground font-mono bg-muted p-3 border-2 border-border">
          <p><strong>PRO TIP:</strong> These are placeholder avatars. You can upload custom ones later!</p>
        </div>
      </CardContent>
    </Card>
  );
};
