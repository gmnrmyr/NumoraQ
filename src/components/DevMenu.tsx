
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Code, X } from "lucide-react";
import { DataManagementSection } from "./DataManagementSection";
import { UserFeedbackDialog } from "./UserFeedbackDialog";

export const DevMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="sm"
          className="brutalist-button shadow-lg"
        >
          <Code size={16} />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-[calc(100vw-2rem)] w-full sm:w-96">
      <Card className="brutalist-card shadow-xl">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-mono font-bold text-sm uppercase">Dev Tools</h3>
            <div className="flex gap-2">
              <UserFeedbackDialog />
              <Button
                onClick={() => setIsOpen(false)}
                variant="outline"
                size="sm"
                className="brutalist-button"
              >
                <X size={14} />
              </Button>
            </div>
          </div>
          <DataManagementSection />
        </CardContent>
      </Card>
    </div>
  );
};
