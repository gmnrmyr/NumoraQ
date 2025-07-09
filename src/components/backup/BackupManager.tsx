import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useBackupManager } from '@/hooks/useBackupManager';
import { Shield, ChevronDown, ChevronUp, Plus, Download, Trash2, Calendar, HardDrive, FileText, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const BackupManager = () => {
  const { data } = useFinancialData();
  const { 
    backups, 
    isLoading,
    createBackup, 
    restoreBackup, 
    deleteBackup, 
    getBackupStats, 
    formatBackupSize 
  } = useBackupManager();
  
  const [isOpen, setIsOpen] = useState(false);
  const [customBackupName, setCustomBackupName] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const stats = getBackupStats();

  const handleCreateBackup = async () => {
    const name = customBackupName.trim() || undefined;
    const result = await createBackup(data, name);
    if (result) {
      setCustomBackupName('');
      setShowCreateDialog(false);
    }
  };

  const handleRestoreBackup = (backupId: string) => {
    restoreBackup(backupId);
  };

  const handleDeleteBackup = async (backupId: string) => {
    await deleteBackup(backupId);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getBackupTypeIcon = (isAutomatic: boolean) => {
    return isAutomatic ? <HardDrive size={14} className="text-blue-500" /> : <FileText size={14} className="text-green-500" />;
  };

  const getBackupTypeBadge = (isAutomatic: boolean) => {
    return isAutomatic ? (
      <Badge variant="outline" className="text-xs bg-blue-500/20 border-blue-500 text-blue-400">
        Auto
      </Badge>
    ) : (
      <Badge variant="outline" className="text-xs bg-green-500/20 border-green-500 text-green-400">
        Manual
      </Badge>
    );
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-0 h-auto">
          <h3 className="text-sm font-mono text-muted-foreground uppercase flex items-center gap-2">
            <Shield size={14} />
            Backup Manager
            <Badge variant="outline" className="text-xs">
              {stats.totalBackups}
            </Badge>
          </h3>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-4">
        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className="text-center p-2 bg-muted/50 rounded">
            <div className="text-accent font-bold">{stats.totalBackups}</div>
            <div className="text-muted-foreground">Total</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded">
            <div className="text-green-400 font-bold">{stats.manualBackups}</div>
            <div className="text-muted-foreground">Manual</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded">
            <div className="text-blue-400 font-bold">{stats.automaticBackups}</div>
            <div className="text-muted-foreground">Auto</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded">
            <div className="text-accent font-bold">{stats.totalSize} KB</div>
            <div className="text-muted-foreground">Size</div>
          </div>
        </div>

        {/* Create Backup Button */}
        <div className="flex gap-2">
          <Button
            onClick={() => createBackup(data)}
            variant="outline"
            size="sm"
            className="brutalist-button flex-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 size={16} className="mr-1 animate-spin" />
            ) : (
              <Plus size={16} className="mr-1" />
            )}
            Quick Backup
          </Button>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="brutalist-button"
              >
                <FileText size={16} className="mr-1" />
                Custom
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-2 border-border" aria-describedby="backup-dialog-description">
              <DialogHeader>
                <DialogTitle className="font-mono">Create Custom Backup</DialogTitle>
              </DialogHeader>
              <div id="backup-dialog-description" className="sr-only">
                Create a custom backup with a personalized name for your financial data
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-mono text-muted-foreground">
                    Backup Name (optional)
                  </label>
                  <Input
                    placeholder="e.g., Before major changes"
                    value={customBackupName}
                    onChange={(e) => setCustomBackupName(e.target.value)}
                    className="font-mono"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleCreateBackup}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={16} className="mr-1 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Backup"
                    )}
                  </Button>
                  <Button
                    onClick={() => setShowCreateDialog(false)}
                    variant="outline"
                    className="flex-1"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Backup List */}
        {backups.length > 0 ? (
          <div className="border border-border rounded">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-mono text-xs">Name</TableHead>
                  <TableHead className="font-mono text-xs">Type</TableHead>
                  <TableHead className="font-mono text-xs">Created</TableHead>
                  <TableHead className="font-mono text-xs">Size</TableHead>
                  <TableHead className="font-mono text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backups.map((backup) => (
                  <TableRow key={backup.id}>
                    <TableCell className="font-mono text-xs">
                      <div className="flex items-center gap-2">
                        {getBackupTypeIcon(backup.isAutomatic)}
                        <span className="truncate max-w-[100px]" title={backup.name}>
                          {backup.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getBackupTypeBadge(backup.isAutomatic)}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar size={10} />
                        {formatTimestamp(backup.timestamp)}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {formatBackupSize(backup.size)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          onClick={() => handleRestoreBackup(backup.id)}
                          size="sm"
                          variant="outline"
                          className="text-xs"
                        >
                          <Download size={12} />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs text-red-500 hover:text-red-600"
                            >
                              <Trash2 size={12} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-card border-2 border-border">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="font-mono">Delete Backup</AlertDialogTitle>
                              <AlertDialogDescription className="font-mono text-sm">
                                Are you sure you want to delete "{backup.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="font-mono">Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteBackup(backup.id)}
                                className="bg-red-600 hover:bg-red-700 font-mono"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="text-muted-foreground font-mono text-sm">
              No backups created yet
            </div>
            <div className="text-xs text-muted-foreground font-mono mt-1">
              Create your first backup to protect your data
            </div>
          </div>
        )}

        {/* Info Note */}
        <div className="text-xs text-muted-foreground font-mono bg-muted/30 p-2 rounded">
          <strong>Info:</strong> Manual backups are kept (last 2), automatic backups are kept (last 3). 
          Backups are stored securely in the cloud and tied to your account.
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}; 