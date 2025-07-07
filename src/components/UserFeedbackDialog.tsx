
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const UserFeedbackDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState({
    type: '',
    subject: '',
    message: '',
    email: ''
  });

  const handleSubmit = () => {
    if (!feedback.type || !feedback.message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a feedback type and enter your message.",
        variant: "destructive"
      });
      return;
    }

    // For now, we'll just log to console and show success
    console.log('Feedback submitted:', feedback);
    
    toast({
      title: "Feedback Submitted! 🚀",
      description: "Thanks for helping us improve Numoraq! We'll review your feedback soon.",
    });

    setFeedback({ type: '', subject: '', message: '', email: '' });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="brutalist-button text-xs">
          <MessageSquare size={14} />
          <span className="hidden sm:inline ml-1">Feedback</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-accent border-2 mx-2 max-w-[95vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono uppercase text-foreground flex items-center gap-2">
            <MessageSquare size={16} />
            Share Your Feedback
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select value={feedback.type} onValueChange={(value) => setFeedback({...feedback, type: value})}>
            <SelectTrigger className="bg-input border-border border-2 font-mono">
              <SelectValue placeholder="Select feedback type" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border border-2">
              <SelectItem value="bug">🐛 Bug Report</SelectItem>
              <SelectItem value="feature">✨ Feature Request</SelectItem>
              <SelectItem value="improvement">⚡ Improvement</SelectItem>
              <SelectItem value="question">❓ Question</SelectItem>
              <SelectItem value="praise">🎉 Praise</SelectItem>
              <SelectItem value="other">📝 Other</SelectItem>
            </SelectContent>
          </Select>
          
          <Input
            placeholder="Subject (optional)"
            value={feedback.subject}
            onChange={(e) => setFeedback({...feedback, subject: e.target.value})}
            className="bg-input border-border border-2 font-mono text-sm"
          />
          
          <Textarea
            placeholder="Tell us what's on your mind... we're listening! 🎧"
            value={feedback.message}
            onChange={(e) => setFeedback({...feedback, message: e.target.value})}
            className="bg-input border-border border-2 font-mono text-sm min-h-[100px]"
          />
          
          <Input
            type="email"
            placeholder="Your email (optional - for follow-up)"
            value={feedback.email}
            onChange={(e) => setFeedback({...feedback, email: e.target.value})}
            className="bg-input border-border border-2 font-mono text-sm"
          />
          
          <div className="flex gap-2">
            <Button 
              onClick={handleSubmit} 
              className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 font-mono uppercase text-xs"
            >
              <Send size={14} className="mr-1" />
              Send Feedback
            </Button>
            <Button 
              onClick={() => setIsOpen(false)} 
              variant="outline" 
              className="border-border font-mono uppercase text-xs"
            >
              Cancel
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground font-mono bg-muted p-2 border-2 border-border rounded">
            💡 <strong>Pro tip:</strong> Your feedback helps us build better features. Thanks for being awesome! 🚀
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
