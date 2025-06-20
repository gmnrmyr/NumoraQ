
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Edit3, Save, X } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const ProfileUIDEditor = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [currentUID, setCurrentUID] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('name, user_uid')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      setName(data?.name || '');
      setCurrentUID(data?.user_uid || '');
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Invalid Name",
        description: "Please enter a valid name",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name: name.trim() })
        .eq('id', user?.id);

      if (error) throw error;

      await loadProfile(); // Reload to get the new UID
      setEditing(false);
      
      toast({
        title: "Profile Updated",
        description: "Your profile and UID have been updated successfully!"
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    loadProfile(); // Reset to original values
  };

  if (!user) {
    return null;
  }

  return (
    <Card className="brutalist-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-mono">
          <User className="text-accent" size={20} />
          YOUR PROFILE & UID
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-mono uppercase">Display Name</Label>
            {!editing && (
              <Button
                onClick={() => setEditing(true)}
                variant="outline"
                size="sm"
                className="brutalist-button"
              >
                <Edit3 size={14} className="mr-1" />
                Edit
              </Button>
            )}
          </div>

          {editing ? (
            <div className="space-y-3">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your display name"
                className="font-mono"
                maxLength={20}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="brutalist-button bg-accent text-accent-foreground flex-1"
                >
                  <Save size={14} className="mr-2" />
                  {loading ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="brutalist-button"
                >
                  <X size={14} />
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-lg font-mono">{name || 'Anonymous User'}</div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-mono uppercase">Your UID</Label>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-base px-3 py-1">
              {currentUID || 'UNKNOWN'}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground font-mono">
            UID is automatically generated from your display name. Change your name to update your UID.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
