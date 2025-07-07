import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { AlertTriangle, RefreshCw, MessageSquare, Home } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-2 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700 font-mono">
                <AlertTriangle size={20} />
                Oops! Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-red-600 font-mono">
                <p>We encountered an unexpected error. This has been logged for our team to investigate.</p>
                
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mt-4 p-2 bg-red-100 border border-red-200 rounded">
                    <summary className="cursor-pointer font-semibold">Error Details (Dev Mode)</summary>
                    <pre className="text-xs mt-2 overflow-auto">
                      {this.state.error.toString()}
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </details>
                )}
              </div>
              
              <div className="flex flex-col gap-2">
                <Button
                  onClick={this.resetError}
                  className="bg-red-600 hover:bg-red-700 text-white font-mono"
                >
                  <RefreshCw size={16} className="mr-2" />
                  Try Again
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="border-red-300 text-red-700 font-mono"
                >
                  <RefreshCw size={16} className="mr-2" />
                  Reload Page
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/'}
                  className="border-red-300 text-red-700 font-mono"
                >
                  <Home size={16} className="mr-2" />
                  Go Home
                </Button>
              </div>
              
              <div className="text-xs text-red-500 font-mono text-center">
                <p>If this keeps happening, please use the feedback button to report it.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export const useErrorHandler = () => {
  const handleError = (error: Error, errorInfo?: string) => {
    console.error('Error handled by useErrorHandler:', error, errorInfo);
    
    // In a real app, you might want to send this to an error reporting service
    // For now, we'll just log it and show a toast
    
    return {
      error: error.message,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
  };

  return { handleError };
};

// Async error boundary for handling promise rejections
export const AsyncErrorBoundary: React.FC<{
  children: React.ReactNode;
  onError?: (error: Error) => void;
}> = ({ children, onError }) => {
  React.useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
      console.error('Unhandled promise rejection:', error);
      
      if (onError) {
        onError(error);
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [onError]);

  return <>{children}</>;
}; 