
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Code, BarChart3, Globe, Palette } from "lucide-react";
import { CodeManagementTab } from "./CodeManagementTab";
import { AnalyticsTab } from "./AnalyticsTab";
import { SiteConfigTab } from "./SiteConfigTab";
import { ThemeManagementTab } from "./ThemeManagementTab";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-3 border-border max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-mono uppercase flex items-center gap-2">
            <Settings size={20} />
            CMS / Admin Control Panel
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="codes" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="codes" className="flex items-center gap-1">
              <Code size={14} />
              Codes
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1">
              <BarChart3 size={14} />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="site" className="flex items-center gap-1">
              <Globe size={14} />
              Site Config
            </TabsTrigger>
            <TabsTrigger value="themes" className="flex items-center gap-1">
              <Palette size={14} />
              Themes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="codes">
            <CodeManagementTab />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>

          <TabsContent value="site">
            <SiteConfigTab />
          </TabsContent>

          <TabsContent value="themes">
            <ThemeManagementTab />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
