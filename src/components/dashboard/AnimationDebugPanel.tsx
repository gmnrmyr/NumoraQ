
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, RotateCcw, AlertTriangle, Move, Settings } from 'lucide-react';

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
  projectId: originalProjectId,
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
  const [expanded, setExpanded] = useState(false);
  const [testProjectId, setTestProjectId] = useState(originalProjectId);
  const [testWidth, setTestWidth] = useState('2000');
  const [testHeight, setTestHeight] = useState('900');
  const [testX, setTestX] = useState('50');
  const [testY, setTestY] = useState('80');
  const [testZ, setTestZ] = useState('0');
  const [testPosition, setTestPosition] = useState('fixed');
  const [forceShow, setForceShow] = useState(false);

  if (process.env.NODE_ENV !== 'development') return null;

  const statusColor = error ? 'text-red-400' : isReady ? 'text-green-400' : 'text-yellow-400';
  const statusText = error ? 'ERROR' : isReady ? 'READY' : 'LOADING';

  // Test project IDs
  const testProjects = [
    { id: 'db3DaP9gWVnnnr7ZevK7', name: 'Black Hole (Original)' },
    { id: 'h49sb4lMLFG1hJLyIzdq', name: 'Dark Dither' },
    { id: 'test-123', name: 'Test ID 1' },
    { id: 'random-456', name: 'Test ID 2' }
  ];

  const applyTestAnimation = () => {
    // Remove existing test animations
    document.querySelectorAll('.debug-test-animation').forEach(el => el.remove());
    
    // Create new test animation
    const testDiv = document.createElement('div');
    testDiv.className = 'debug-test-animation';
    testDiv.setAttribute('data-us-project', testProjectId);
    testDiv.style.cssText = `
      position: ${testPosition};
      left: ${testX}%;
      top: ${testY}px;
      z-index: ${testZ};
      width: ${testWidth}px;
      height: ${testHeight}px;
      border: 2px solid #ff0000;
      pointer-events: none;
      transform: translateX(-50%);
    `;
    
    document.body.appendChild(testDiv);
    
    // Force UnicornStudio to reinitialize
    setTimeout(() => {
      if (window.UnicornStudio && window.UnicornStudio.init) {
        try {
          window.UnicornStudio.init();
          console.log('🎬 DEBUG: Test animation applied', { testProjectId, testWidth, testHeight, testX, testY, testZ });
        } catch (e) {
          console.error('🎬 DEBUG: Failed to init test animation', e);
        }
      }
    }, 100);
  };

  const randomizePosition = () => {
    setTestX(String(Math.floor(Math.random() * 100)));
    setTestY(String(Math.floor(Math.random() * 200) + 80));
    setTestZ(String(Math.floor(Math.random() * 50)));
  };

  const clearTestAnimations = () => {
    document.querySelectorAll('.debug-test-animation').forEach(el => el.remove());
  };

  const forceReinitialize = () => {
    // Clear everything
    clearTestAnimations();
    document.querySelectorAll('[data-us-project]').forEach(el => {
      if (!el.classList.contains('debug-test-animation')) {
        el.innerHTML = '';
      }
    });
    
    // Remove and re-add script
    document.querySelectorAll('script[src*="unicornstudio"]').forEach(script => script.remove());
    
    setTimeout(() => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.innerHTML = `
        !function(){
          if(window.UnicornStudio) delete window.UnicornStudio;
          window.UnicornStudio={isInitialized:!1};
          var i=document.createElement("script");
          i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.25/dist/unicornStudio.umd.js";
          i.onload=function(){
            if(!window.UnicornStudio.isInitialized){
              UnicornStudio.init();
              window.UnicornStudio.isInitialized=!0;
              console.log('🎬 DEBUG: Force reinitialized UnicornStudio');
            }
          };
          (document.head || document.body).appendChild(i);
        }();
      `;
      document.head.appendChild(script);
    }, 200);
  };

  return (
    <Card className="fixed top-4 left-4 z-50 p-4 bg-black/95 border border-white/20 text-white text-xs max-w-sm">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-bold text-accent uppercase">
            🎬 {animationType.replace('-', '_')}_DEBUG
          </div>
          <div className="flex gap-2">
            <div className={`font-mono ${statusColor}`}>
              {statusText}
            </div>
            <Button
              onClick={() => setExpanded(!expanded)}
              size="sm"
              variant="outline"
              className="h-6 w-6 p-0"
            >
              <Settings size={10} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>Original ID:</div>
          <div className="font-mono text-accent">{originalProjectId}</div>
          
          <div>User Title:</div>
          <div className="font-mono text-purple-400">{userTitle}</div>
          
          <div>User Level:</div>
          <div className="font-mono text-blue-400">{userLevel}</div>
          
          <div>Champion+:</div>
          <div className={isChampionUser ? 'text-green-400' : 'text-red-400'}>
            {isChampionUser ? '✅' : '❌'}
          </div>
          
          <div>Theme Active:</div>
          <div className={themeActive ? 'text-green-400' : 'text-red-400'}>
            {themeActive ? '✅' : '❌'}
          </div>
          
          <div>UnicornStudio:</div>
          <div className={typeof window !== 'undefined' && window.UnicornStudio ? 'text-green-400' : 'text-red-400'}>
            {typeof window !== 'undefined' && window.UnicornStudio ? '✅' : '❌'}
          </div>
        </div>

        {expanded && (
          <div className="space-y-3 border-t border-white/20 pt-3">
            <div className="text-yellow-400 font-bold">ADVANCED TESTING</div>
            
            <div className="space-y-2">
              <div>Test Project ID:</div>
              <Select value={testProjectId} onValueChange={setTestProjectId}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {testProjects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <div>Width:</div>
                <Input 
                  value={testWidth} 
                  onChange={(e) => setTestWidth(e.target.value)}
                  className="h-6 text-xs"
                />
              </div>
              <div>
                <div>Height:</div>
                <Input 
                  value={testHeight} 
                  onChange={(e) => setTestHeight(e.target.value)}
                  className="h-6 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <div>X%:</div>
                <Input 
                  value={testX} 
                  onChange={(e) => setTestX(e.target.value)}
                  className="h-6 text-xs"
                />
              </div>
              <div>
                <div>Y px:</div>
                <Input 
                  value={testY} 
                  onChange={(e) => setTestY(e.target.value)}
                  className="h-6 text-xs"
                />
              </div>
              <div>
                <div>Z:</div>
                <Input 
                  value={testZ} 
                  onChange={(e) => setTestZ(e.target.value)}
                  className="h-6 text-xs"
                />
              </div>
            </div>

            <div>
              <div>Position:</div>
              <Select value={testPosition} onValueChange={setTestPosition}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="absolute">Absolute</SelectItem>
                  <SelectItem value="relative">Relative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={randomizePosition}
                size="sm"
                variant="outline"
                className="flex-1 h-6 text-xs"
              >
                <Move size={10} />
                Random
              </Button>
              
              <Button
                onClick={applyTestAnimation}
                size="sm"
                variant="outline"
                className="flex-1 h-6 text-xs bg-green-900"
              >
                Test
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={clearTestAnimations}
                size="sm"
                variant="outline"
                className="flex-1 h-6 text-xs"
              >
                Clear
              </Button>
              
              <Button
                onClick={forceReinitialize}
                size="sm"
                variant="outline"
                className="flex-1 h-6 text-xs bg-red-900"
              >
                Force Init
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={forceShow} 
                onChange={(e) => setForceShow(e.target.checked)}
                className="w-3 h-3"
              />
              <div className="text-xs">Force Show (Ignore restrictions)</div>
            </div>
          </div>
        )}

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
          Dev Mode Only - Enhanced Debug Controls
        </div>
      </div>
    </Card>
  );
};
