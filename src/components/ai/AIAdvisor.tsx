
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Minimize2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

export const AIAdvisor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const isMobile = useIsMobile();

  if (isHidden) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsHidden(false)}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg"
        >
          <MessageCircle size={16} />
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Chat Button - Reduced size */}
      <div className={`fixed ${isMobile ? 'bottom-16 right-3' : 'bottom-6 right-6'} z-50`}>
        <div className="flex flex-col items-end gap-2">
          {/* Hide/Minimize button */}
          <Button
            onClick={() => setIsHidden(true)}
            size="sm"
            variant="outline"
            className="bg-white/90 backdrop-blur-sm border-gray-300 p-1 rounded-full shadow-md"
          >
            <Minimize2 size={12} />
          </Button>
          
          {/* Main chat button - smaller */}
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className={`bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 ${
              isMobile ? 'p-2' : 'p-3'
            }`}
          >
            <MessageCircle size={isMobile ? 18 : 20} />
          </Button>
        </div>
      </div>

      {/* Chat Interface */}
      {isOpen && (
        <div className={`fixed ${isMobile ? 'bottom-32 right-3 left-3' : 'bottom-24 right-6'} z-50`}>
          <Card className={`bg-card/95 backdrop-blur-md border-2 border-blue-600 shadow-xl ${
            isMobile ? 'w-full max-w-sm' : 'w-80'
          }`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-blue-400 text-sm font-mono uppercase">AI Financial Advisor</CardTitle>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="sm"
                className="text-blue-400 hover:text-blue-300 p-1"
              >
                <X size={16} />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs text-muted-foreground font-mono bg-blue-50 p-2 rounded border border-blue-200">
                💡 AI advisor coming soon! Get personalized financial insights, spending analysis, and investment recommendations.
              </div>
              <div className="space-y-2">
                <Button size="sm" variant="outline" className="w-full text-xs">
                  📊 Analyze Spending
                </Button>
                <Button size="sm" variant="outline" className="w-full text-xs">
                  💰 Investment Tips
                </Button>
                <Button size="sm" variant="outline" className="w-full text-xs">
                  🎯 Goal Setting
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};
