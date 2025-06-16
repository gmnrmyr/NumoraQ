
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Clock, Target } from 'lucide-react';

const VERSION = "1.01";

const features = {
  recent: [
    { version: "1.01", feature: "Cloud sync with proper timestamps", date: "2025-06-16" },
    { version: "1.00", feature: "Real-time financial dashboard", date: "2025-06-15" },
    { version: "1.00", feature: "Multi-currency support (BRL, USD, EUR)", date: "2025-06-15" },
    { version: "1.00", feature: "Live crypto price updates", date: "2025-06-15" },
    { version: "1.00", feature: "Task management with priorities", date: "2025-06-15" }
  ],
  upcoming: [
    { feature: "Mobile app companion", status: "planned" },
    { feature: "Advanced reporting & analytics", status: "planned" },
    { feature: "Budget forecasting AI", status: "desired" },
    { feature: "Investment portfolio tracking", status: "desired" },
    { feature: "Expense categorization AI", status: "desired" }
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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>FinanceTracker v{VERSION}</span>
            <Badge variant="outline">Latest</Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Recent Features */}
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
              <CheckCircle className="text-green-600" size={20} />
              Recently Added Features
            </h3>
            <div className="space-y-3">
              {features.recent.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div>
                    <div className="font-medium text-green-800">{item.feature}</div>
                    <div className="text-sm text-green-600">Version {item.version}</div>
                  </div>
                  <div className="text-xs text-green-600">{item.date}</div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Upcoming Features */}
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
              <Clock className="text-blue-600" size={20} />
              Upcoming Features
            </h3>
            <div className="space-y-3">
              {features.upcoming.filter(item => item.status === 'planned').map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="font-medium text-blue-800">{item.feature}</div>
                  <Badge variant="outline" className="text-blue-600 border-blue-300">In Development</Badge>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Desired Features */}
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
              <Target className="text-purple-600" size={20} />
              Desired Features
            </h3>
            <div className="space-y-3">
              {features.upcoming.filter(item => item.status === 'desired').map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="font-medium text-purple-800">{item.feature}</div>
                  <Badge variant="outline" className="text-purple-600 border-purple-300">Roadmap</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
