
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail } from 'lucide-react';

interface EmailConfirmationSuccessProps {
  email: string;
  onTryAgain: () => void;
  onGoHome: () => void;
}

export const EmailConfirmationSuccess = ({ email, onTryAgain, onGoHome }: EmailConfirmationSuccessProps) => {
  return (
    <div className="space-y-4">
      <Alert>
        <Mail className="h-4 w-4" />
        <AlertDescription className="font-mono text-sm">
          We've sent a confirmation link to <strong>{email}</strong>
          <br /><br />
          Please check your email and click the link to activate your account.
          <br /><br />
          <strong>Don't see the email?</strong>
          <br />• Check your spam/junk folder
          <br />• Make sure {email} is correct
          <br />• Wait a few minutes and refresh your inbox
        </AlertDescription>
      </Alert>
      
      <div className="flex gap-2">
        <Button 
          onClick={onTryAgain}
          variant="outline"
          className="flex-1"
        >
          Try Again
        </Button>
        <Button 
          onClick={onGoHome}
          variant="default"
          className="flex-1"
        >
          Go Home
        </Button>
      </div>
    </div>
  );
};
