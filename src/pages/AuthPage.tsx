
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { EmailAuthForms } from '@/components/auth/EmailAuthForms';
import { EmailConfirmationSuccess } from '@/components/auth/EmailConfirmationSuccess';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmailSent, setShowEmailSent] = useState(false);
  const { user, signInWithEmail, signUpWithEmail, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check if user was redirected after email confirmation
  const isConfirmed = searchParams.get('confirmed') === 'true';

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

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
              {showEmailSent ? 'Check Your Email' : isConfirmed ? 'Email Confirmed!' : 'Authentication'}
            </CardTitle>
            <p className="text-sm text-muted-foreground font-mono">
              {showEmailSent ? 'Confirmation link sent!' : isConfirmed ? 'Your email has been confirmed' : 'Welcome to OPEN FINDASH'}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {isConfirmed ? (
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
