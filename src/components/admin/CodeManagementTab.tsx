
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Calendar, User, TrendingUp } from "lucide-react";
import { useAdminMode } from "@/hooks/useAdminMode";
import { toast } from "@/hooks/use-toast";

export const CodeManagementTab: React.FC = () => {
  const { generateDegenCode, codes, getActiveCodeStats } = useAdminMode();
  const [selectedDuration, setSelectedDuration] = useState<'1year' | '5years' | 'lifetime'>('1year');
  const stats = getActiveCodeStats();

  const handleGenerateCode = () => {
    const newCode = generateDegenCode(selectedDuration);
    navigator.clipboard.writeText(newCode);
    toast({
      title: "Code Generated!",
      description: `${newCode} copied to clipboard`,
    });
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    });
  };

  const getStatusBadge = (code: any) => {
    const now = new Date();
    const expires = new Date(code.expiresAt);
    
    if (code.usedBy) {
      return <Badge className="bg-blue-100 text-blue-800">Used</Badge>;
    } else if (expires <= now) {
      return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-muted p-3 border-2 border-border">
          <div className="text-sm font-mono text-muted-foreground">Total Codes</div>
          <div className="text-2xl font-bold font-mono">{stats.total}</div>
        </div>
        <div className="bg-muted p-3 border-2 border-border">
          <div className="text-sm font-mono text-muted-foreground">Active</div>
          <div className="text-2xl font-bold font-mono text-green-600">{stats.active}</div>
        </div>
        <div className="bg-muted p-3 border-2 border-border">
          <div className="text-sm font-mono text-muted-foreground">Used</div>
          <div className="text-2xl font-bold font-mono text-blue-600">{stats.used}</div>
        </div>
        <div className="bg-muted p-3 border-2 border-border">
          <div className="text-sm font-mono text-muted-foreground">Expired</div>
          <div className="text-2xl font-bold font-mono text-red-600">{stats.expired}</div>
        </div>
      </div>

      {/* Code Generation */}
      <div className="bg-muted p-4 border-2 border-border">
        <h3 className="font-mono font-bold mb-3">Generate New Code</h3>
        <div className="flex gap-3">
          <Select value={selectedDuration} onValueChange={(value: any) => setSelectedDuration(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1year">1 Year</SelectItem>
              <SelectItem value="5years">5 Years</SelectItem>
              <SelectItem value="lifetime">Lifetime</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleGenerateCode} className="brutalist-button">
            Generate & Copy Code
          </Button>
        </div>
      </div>

      {/* Codes List */}
      <div className="space-y-3">
        <h3 className="font-mono font-bold">Generated Codes</h3>
        <div className="max-h-64 overflow-y-auto space-y-2">
          {codes.map((code) => (
            <div key={code.code} className="flex items-center justify-between p-3 bg-background border-2 border-border">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold">{code.code}</span>
                  {getStatusBadge(code)}
                  <Badge variant="outline" className="text-xs">
                    {code.duration}
                  </Badge>
                  {code.grantedVia && (
                    <Badge variant="outline" className="text-xs">
                      {code.grantedVia}
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground font-mono mt-1">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      Expires: {new Date(code.expiresAt).toLocaleDateString()}
                    </span>
                    {code.usedBy && (
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        Used by: {code.usedBy.substring(0, 20)}...
                      </span>
                    )}
                    {code.usedAt && (
                      <span>Used: {new Date(code.usedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>
              <Button
                onClick={() => copyCode(code.code)}
                variant="outline"
                size="sm"
                className="ml-3"
              >
                <Copy size={14} />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
