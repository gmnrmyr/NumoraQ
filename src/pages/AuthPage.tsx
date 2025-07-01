
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { EmailAuthForms } from '@/components/auth/EmailAuthForms';
import { EmailConfirmationSuccess } from '@/components/auth/EmailConfirmationSuccess';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmailSent, setShowEmailSent] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const { user, signInWithEmail, signUpWithEmail, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check if user was redirected after email confirmation
  const isConfirmed = searchParams.get('confirmed') === 'true';
  const isPasswordReset = searchParams.get('type') === 'recovery';

  useEffect(() => {
    if (user && !isPasswordReset) {
      navigate('/dashboard');
    }
  }, [user, navigate, isPasswordReset]);

  // Show confirmation success if user was redirected after email confirmation
  useEffect(() => {
    if (isConfirmed && !user) {
      // Clear the URL parameter
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('confirmed');
      navigate(`/auth?${newSearchParams.toString()}`, { replace: true });
    }
  }, [isConfirmed, user, navigate, searchParams]);

  const handleEmailSignIn = async (email: string, password: string) => {
    setLoading(true);
    setEmail(email);
    const { error } = await signInWithEmail(email, password);
    setLoading(false);
    
    if (!error) {
      navigate('/dashboard');
    }
  };

  const handleEmailSignUp = async (email: string, password: string) => {
    setLoading(true);
    setEmail(email);
    const { error } = await signUpWithEmail(email, password);
    setLoading(false);
    
    if (!error) {
      setShowEmailSent(true);
    }
  };

  const handleResetPassword = async (email: string) => {
    setLoading(true);
    await resetPassword(email);
    setLoading(false);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    
    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setResetError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        setResetError(error.message);
      } else {
        // Clear the URL parameters and redirect to dashboard
        navigate('/dashboard', { replace: true });
      }
    } catch (error: any) {
      setResetError('Failed to update password');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono flex flex-col">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-10">
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          size="sm"
          className="brutalist-button flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card border-2 border-accent brutalist-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-mono uppercase text-accent">
              {isPasswordReset ? 'Reset Password' : showEmailSent ? 'Check Your Email' : isConfirmed ? 'Email Confirmed!' : 'Authentication'}
            </CardTitle>
            <p className="text-sm text-muted-foreground font-mono">
              {isPasswordReset ? 'Enter your new password' : showEmailSent ? 'Confirmation link sent!' : isConfirmed ? 'Your email has been confirmed' : 'Welcome to OPEN FINDASH'}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {isPasswordReset ? (
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                {resetError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{resetError}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            ) : isConfirmed ? (
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="font-mono text-sm">
                    Your email has been confirmed successfully! You can now log in to your account.
                  </AlertDescription>
                </Alert>
                <Button 
                  onClick={() => window.location.href = '/auth'}
                  className="w-full"
                >
                  Continue to Login
                </Button>
              </div>
            ) : showEmailSent ? (
              <EmailConfirmationSuccess
                email={email}
                onTryAgain={() => setShowEmailSent(false)}
                onGoHome={() => navigate('/')}
              />
            ) : (
              <>
                {/* Login Options Info */}
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs font-mono">
                    📧 Email authentication available
                    <br />
                    🔜 Solana, Discord and other social logins coming soon!
                  </AlertDescription>
                </Alert>

                <EmailAuthForms
                  onSignIn={handleEmailSignIn}
                  onSignUp={handleEmailSignUp}
                  onResetPassword={handleResetPassword}
                  loading={loading}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
