import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Database, Download, Upload, RotateCcw } from "lucide-react";

export const UsageGuideSection = () => {
  return (
    <Card className="brutalist-card">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-display brutalist-heading text-accent">
          <BookOpen className="inline-block mr-2" size={24} />
          QUICK START GUIDE
        </CardTitle>
        <p className="text-muted-foreground font-mono text-sm">
          Get up and running in minutes
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h3 className="font-mono text-accent font-bold">💪 ADVANCED MODE (Current)</h3>
            <ul className="text-sm font-mono space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-accent">→</span>
                Manual data entry for complete control
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent">→</span>
                Track portfolio, income, expenses & debts
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent">→</span>
                Set financial projections & goals
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-mono text-accent font-bold">🔄 DATA MANAGEMENT</h3>
            <ul className="text-sm font-mono space-y-2">
              <li className="flex items-center gap-2">
                <RotateCcw size={14} className="text-red-400" />
                Reset data to start fresh
              </li>
              <li className="flex items-center gap-2">
                <Download size={14} className="text-blue-400" />
                Export CSV/JSON for backup
              </li>
              <li className="flex items-center gap-2">
                <Upload size={14} className="text-green-400" />
                Import your existing data
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-accent/20 pt-4">
          <div className="bg-muted/50 p-3 rounded border border-accent/20">
            <h4 className="font-mono text-accent font-bold text-sm mb-2">🤖 PRO TIP FOR QUICK SETUP</h4>
            <p className="text-xs font-mono text-muted-foreground">
              Export demo data as CSV/JSON → Upload to Excel/Sheets → 
              Ask ChatGPT or Grok AI to customize it with your real numbers → 
              Import back to get started faster!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};