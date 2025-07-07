
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Clock, Target, Code, Zap, Users, Bot, Building } from 'lucide-react';

const VERSION = "-12500";
const BUILD_DATE = new Date().toISOString().split('T')[0];
const APP_NAME = "Numoraq";

const features = {
  recent: [
    { version: "-12500", feature: "Enhanced user feedback system", date: "2025-01-03", icon: Users },
    { version: "-12500", feature: "Smart onboarding with demo data", date: "2025-01-03", icon: Zap },
    { version: "-12500", feature: "AI-powered data import guidance", date: "2025-01-03", icon: Bot },
    { version: "-12500", feature: "Improved error handling & recovery", date: "2025-01-03", icon: Code },
    { version: "-12500", feature: "Portfolio tracking with live prices", date: "2025-01-02", icon: CheckCircle }
  ],
  nextPhase: [
    { feature: "AI Chat Assistant (GPT integration)", status: "high-priority", icon: Bot },
    { feature: "Advanced chart interactions", status: "in-progress", icon: Target },
    { feature: "Date-based expense scheduling", status: "planned", icon: Clock },
    { feature: "Beta dashboard animations", status: "planned", icon: Zap }
  ],
  strategic: [
    { feature: "Business model pivot to freemium", status: "strategic", icon: Building },
    { feature: "Brand rebrand (Numoraq)", status: "strategic", icon: Target },
    { feature: "Wallet auto-fetch (BTC/EVM/Solana)", status: "automation", icon: Zap },
    { feature: "Google Auth integration", status: "auth", icon: Users }
  ]
};

export const VersionBadge: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-xs text-gray-500 hover:text-gray-700">
          v{VERSION}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-mono">
            <span>{APP_NAME} v{VERSION}</span>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Latest
            </Badge>
          </DialogTitle>
          <div className="text-sm text-muted-foreground font-mono">
            Built: {BUILD_DATE} • Status: Active Development
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Recent Features */}
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-3 font-mono">
              <CheckCircle className="text-green-600" size={20} />
              Recently Shipped ✨
            </h3>
            <div className="space-y-3">
              {features.recent.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <Icon className="text-green-600" size={16} />
                      <div>
                        <div className="font-medium text-green-800 font-mono">{item.feature}</div>
                        <div className="text-sm text-green-600">Version {item.version}</div>
                      </div>
                    </div>
                    <div className="text-xs text-green-600 font-mono">{item.date}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Next Phase */}
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-3 font-mono">
              <Clock className="text-blue-600" size={20} />
              Phase 2: Enhanced Analytics 🚧
            </h3>
            <div className="space-y-3">
              {features.nextPhase.map((item, index) => {
                const Icon = item.icon;
                const statusColors = {
                  'high-priority': 'bg-red-50 border-red-200 text-red-700',
                  'in-progress': 'bg-yellow-50 border-yellow-200 text-yellow-700',
                  'planned': 'bg-blue-50 border-blue-200 text-blue-700'
                };
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <Icon className="text-blue-600" size={16} />
                      <div className="font-medium text-blue-800 font-mono">{item.feature}</div>
                    </div>
                    <Badge variant="outline" className={statusColors[item.status as keyof typeof statusColors]}>
                      {item.status.replace('-', ' ')}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Strategic Roadmap */}
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-3 font-mono">
              <Target className="text-purple-600" size={20} />
              Strategic Roadmap 🎯
            </h3>
            <div className="space-y-3">
              {features.strategic.map((item, index) => {
                const Icon = item.icon;
                const statusColors = {
                  'strategic': 'bg-purple-50 border-purple-200 text-purple-700',
                  'automation': 'bg-orange-50 border-orange-200 text-orange-700',
                  'auth': 'bg-indigo-50 border-indigo-200 text-indigo-700'
                };
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-3">
                      <Icon className="text-purple-600" size={16} />
                      <div className="font-medium text-purple-800 font-mono">{item.feature}</div>
                    </div>
                    <Badge variant="outline" className={statusColors[item.status as keyof typeof statusColors]}>
                      {item.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Build Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2 font-mono">Build Information</h4>
            <div className="grid grid-cols-2 gap-2 text-sm font-mono">
              <div>
                <span className="text-gray-600">Version:</span>
                <span className="ml-2 text-gray-800">{VERSION}</span>
              </div>
              <div>
                <span className="text-gray-600">Build Date:</span>
                <span className="ml-2 text-gray-800">{BUILD_DATE}</span>
              </div>
              <div>
                <span className="text-gray-600">Environment:</span>
                <span className="ml-2 text-gray-800">{process.env.NODE_ENV}</span>
              </div>
              <div>
                <span className="text-gray-600">Platform:</span>
                <span className="ml-2 text-gray-800">Web App</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
