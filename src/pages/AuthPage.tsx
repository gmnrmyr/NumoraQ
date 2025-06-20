
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, AlertCircle, Wallet, MessageCircle } from 'lucide-react';
import { EmailAuthForms } from '@/components/auth/EmailAuthForms';
import { EmailConfirmationSuccess } from '@/components/auth/EmailConfirmationSuccess';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmailSent, setShowEmailSent] = useState(false);
  const { user, signInWithEmail, signUpWithEmail, signInWithSolana, signInWithDiscord } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

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

  const handleSolanaSignIn = async () => {
    setLoading(true);
    await signInWithSolana();
    setLoading(false);
  };

  const handleDiscordSignIn = async () => {
    setLoading(true);
    await signInWithDiscord();
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
              {showEmailSent ? 'Check Your Email' : 'Authentication'}
            </CardTitle>
            <p className="text-sm text-muted-foreground font-mono">
              {showEmailSent ? 'Confirmation link sent!' : 'Welcome to OPEN FINDASH'}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {showEmailSent ? (
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
                    📧 Email, 🔗 Solana & 💬 Discord login available
                    <br />
                    🔜 More social logins coming soon!
                  </AlertDescription>
                </Alert>

                {/* Social Login Buttons */}
                <div className="space-y-2">
                  <Button 
                    onClick={handleSolanaSignIn}
                    variant="outline"
                    className="w-full"
                    disabled={loading}
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    {loading ? 'Connecting...' : 'Sign In with Solana'}
                  </Button>

                  <Button 
                    onClick={handleDiscordSignIn}
                    variant="outline"
                    className="w-full"
                    disabled={loading}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {loading ? 'Connecting...' : 'Sign In with Discord'}
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with email
                    </span>
                  </div>
                </div>

                <EmailAuthForms
                  onSignIn={handleEmailSignIn}
                  onSignUp={handleEmailSignUp}
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
