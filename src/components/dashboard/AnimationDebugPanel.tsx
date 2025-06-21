
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, RotateCcw, AlertTriangle } from 'lucide-react';

interface AnimationDebugPanelProps {
  animationType: 'black-hole' | 'dark-dither';
  projectId: string;
  isReady: boolean;
  isLoaded: boolean;
  isPaused: boolean;
  error: string | null;
  userTitle: string;
  userLevel: number;
  onTogglePause: () => void;
  onRetry: () => void;
  isChampionUser: boolean;
  isWhalesUser: boolean;
  themeActive: boolean;
  animationEnabled: boolean;
}

export const AnimationDebugPanel = ({
  animationType,
  projectId,
  isReady,
  isLoaded,
  isPaused,
  error,
  userTitle,
  userLevel,
  onTogglePause,
  onRetry,
  isChampionUser,
  isWhalesUser,
  themeActive,
  animationEnabled
}: AnimationDebugPanelProps) => {
  if (process.env.NODE_ENV !== 'development') return null;

  const statusColor = error ? 'text-red-400' : isReady ? 'text-green-400' : 'text-yellow-400';
  const statusText = error ? 'ERROR' : isReady ? 'READY' : 'LOADING';

  return (
    <Card className="fixed top-4 left-4 z-50 p-4 bg-black/90 border border-white/20 text-white text-xs max-w-sm">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-bold text-accent uppercase">
            🎬 {animationType.replace('-', '_')}_DEBUG
          </div>
          <div className={`font-mono ${statusColor}`}>
            {statusText}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>Project ID:</div>
          <div className="font-mono text-accent">{projectId}</div>
          
          <div>User Title:</div>
          <div className="font-mono text-purple-400">{userTitle}</div>
          
          <div>User Level:</div>
          <div className="font-mono text-blue-400">{userLevel}</div>
          
          <div>Champion+:</div>
          <div className={isChampionUser ? 'text-green-400' : 'text-red-400'}>
            {isChampionUser ? '✅' : '❌'}
          </div>
          
          <div>Whales+:</div>
          <div className={isWhalesUser ? 'text-green-400' : 'text-red-400'}>
            {isWhalesUser ? '✅' : '❌'}
          </div>
          
          <div>Theme Active:</div>
          <div className={themeActive ? 'text-green-400' : 'text-red-400'}>
            {themeActive ? '✅' : '❌'}
          </div>
          
          <div>Anim Enabled:</div>
          <div className={animationEnabled ? 'text-green-400' : 'text-red-400'}>
            {animationEnabled ? '✅' : '❌'}
          </div>
          
          <div>Script Ready:</div>
          <div className={isReady ? 'text-green-400' : 'text-red-400'}>
            {isReady ? '✅' : '❌'}
          </div>
          
          <div>UnicornStudio:</div>
          <div className={typeof window !== 'undefined' && window.UnicornStudio ? 'text-green-400' : 'text-red-400'}>
            {typeof window !== 'undefined' && window.UnicornStudio ? '✅' : '❌'}
          </div>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 p-2 rounded">
            <div className="flex items-center gap-1 text-red-400 mb-1">
              <AlertTriangle size={12} />
              Error Details:
            </div>
            <div className="text-red-300 text-xs break-words">
              {error}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {isReady && (
            <Button
              onClick={onTogglePause}
              size="sm"
              variant="outline"
              className="flex-1 h-8 text-xs"
            >
              {isPaused ? <Play size={12} /> : <Pause size={12} />}
              {isPaused ? 'Play' : 'Pause'}
            </Button>
          )}
          
          <Button
            onClick={onRetry}
            size="sm"
            variant="outline"
            className="flex-1 h-8 text-xs"
          >
            <RotateCcw size={12} />
            Retry
          </Button>
        </div>

        <div className="text-xs text-gray-400 border-t border-white/10 pt-2">
          Dev Mode Only - Will not show in production
        </div>
      </div>
    </Card>
  );
};
