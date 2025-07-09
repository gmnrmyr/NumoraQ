
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, KeyRound, LogIn, UserPlus, Shield } from 'lucide-react';

interface EmailAuthFormsProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
  onResetPassword: (email: string) => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
  loading: boolean;
  defaultMode?: 'signin' | 'signup';
}

export const EmailAuthForms = ({ onSignIn, onSignUp, onResetPassword, onGoogleSignIn, loading, defaultMode = 'signin' }: EmailAuthFormsProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSignIn(email, password);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSignUp(email, password);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    await onResetPassword(resetEmail);
    setIsResetDialogOpen(false);
    setResetEmail('');
  };

  return (
    <div className="space-y-4">
      {/* Security Domain Verification Notice */}
      <Alert className="border-2 border-accent bg-accent/10">
        <Shield className="h-4 w-4 text-accent" />
        <AlertDescription className="font-mono text-xs">
          🔒 <strong>Security:</strong> Make sure you're on <span className="text-accent font-bold">numoraq.online</span> for your safety. 
          Always verify the domain before entering credentials.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue={defaultMode} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-lg border-2 border-border">
          <TabsTrigger 
            value="signin" 
            className="flex items-center gap-2 font-mono data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:border-2 data-[state=active]:border-black data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all brutalist-button"
          >
            <LogIn size={16} />
            Login
          </TabsTrigger>
          <TabsTrigger 
            value="signup" 
            className="flex items-center gap-2 font-mono data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 data-[state=active]:border data-[state=active]:border-green-500/50 transition-all"
          >
            <UserPlus size={16} />
            Register
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="signin" className="border-2 border-black rounded-lg p-4 bg-white/5 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]">
          <div className="mb-4 text-center">
            <div className="flex items-center justify-center gap-2 text-white mb-2">
              <LogIn size={20} />
              <span className="font-mono font-bold">Welcome Back!</span>
            </div>
            <p className="text-xs text-muted-foreground">Sign in to your existing account</p>
          </div>
          
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-mono">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-2 border-black bg-white/10 focus:border-white focus:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-mono">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-2 border-black bg-white/10 focus:border-white focus:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] font-mono"
              />
            </div>
            <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all font-mono brutalist-button" disabled={loading}>
              <LogIn className="w-4 h-4 mr-2" />
              {loading ? 'Logging In...' : 'Login'}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/30" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground font-mono">Or</span>
              </div>
            </div>
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full border-2 border-white/30 hover:bg-white/10 font-mono brutalist-button" 
              onClick={onGoogleSignIn}
              disabled={loading}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
            
            <div className="text-center">
              <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="link" type="button" className="text-sm text-white hover:text-gray-300 font-mono">
                    Forgot your password?
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-2 border-border">
                  <DialogHeader>
                    <DialogTitle className="font-mono uppercase">Reset Password</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">Email Address</Label>
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="your@email.com"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      <KeyRound className="w-4 h-4 mr-2" />
                      {loading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </form>
        </TabsContent>
        
        <TabsContent value="signup" className="border-2 border-green-500/20 rounded-lg p-4 bg-green-500/5">
          <div className="mb-4 text-center">
            <div className="flex items-center justify-center gap-2 text-green-400 mb-2">
              <UserPlus size={20} />
              <span className="font-mono font-bold">Join Numoraq!</span>
            </div>
            <p className="text-xs text-muted-foreground">Create your new account and start building wealth</p>
          </div>
          
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-email" className="font-mono">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-green-500/30 focus:border-green-500 font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password" className="font-mono">Password</Label>
              <Input
                id="signup-password"
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="border-green-500/30 focus:border-green-500 font-mono"
              />
            </div>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 font-mono brutalist-button" disabled={loading}>
              <UserPlus className="w-4 h-4 mr-2" />
              {loading ? 'Creating Account...' : 'Register'}
            </Button>
          </form>
          
          <div className="relative mt-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-green-500/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground font-mono">Or</span>
            </div>
          </div>
          
          <Button 
            type="button" 
            variant="outline" 
            className="w-full mt-4 border-green-500/30 hover:bg-green-500/10 font-mono brutalist-button" 
            onClick={onGoogleSignIn}
            disabled={loading}
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};
