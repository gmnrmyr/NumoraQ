
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Copy, Mail } from "lucide-react";
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

    // Format feedback for email
    const emailSubject = `[NUMORAQ FEEDBACK] ${feedback.subject || feedback.type}`;
    const emailBody = `
Feedback Type: ${feedback.type}
Subject: ${feedback.subject || 'None'}
User Email: ${feedback.email || 'Not provided'}

Message:
${feedback.message}

---
Sent from Numoraq Dashboard
Timestamp: ${new Date().toLocaleString()}
    `.trim();

    // Try to open email client
    const mailtoLink = `mailto:numoraq@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    try {
      window.location.href = mailtoLink;
      
      toast({
        title: "Email Client Opened! 📧",
        description: "Your feedback has been prepared for numoraq@gmail.com. Send the email to submit your feedback.",
      });
    } catch (error) {
      // Fallback: copy to clipboard
      const feedbackText = `Subject: ${emailSubject}\n\n${emailBody}`;
      navigator.clipboard.writeText(feedbackText).then(() => {
        toast({
          title: "Feedback Copied! 📋",
          description: "Your feedback has been copied to clipboard. Email it to numoraq@gmail.com",
        });
      }).catch(() => {
        toast({
          title: "Feedback Prepared! 📝",
          description: "Please manually send your feedback to numoraq@gmail.com",
        });
      });
    }

    setFeedback({ type: '', subject: '', message: '', email: '' });
    setIsOpen(false);
  };

  const copyToClipboard = () => {
    if (!feedback.type || !feedback.message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in feedback type and message first.",
        variant: "destructive"
      });
      return;
    }

    const emailSubject = `[NUMORAQ FEEDBACK] ${feedback.subject || feedback.type}`;
    const emailBody = `
Feedback Type: ${feedback.type}
Subject: ${feedback.subject || 'None'}
User Email: ${feedback.email || 'Not provided'}

Message:
${feedback.message}

---
Sent from Numoraq Dashboard
Timestamp: ${new Date().toLocaleString()}
    `.trim();

    const feedbackText = `Subject: ${emailSubject}\n\n${emailBody}`;
    
    navigator.clipboard.writeText(feedbackText).then(() => {
      toast({
        title: "Feedback Copied! 📋",
        description: "Your feedback has been copied to clipboard. Email it to numoraq@gmail.com",
      });
    }).catch(() => {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard. Please manually copy your feedback.",
        variant: "destructive"
      });
    });
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
              <SelectItem value="Bug Report">🐛 Bug Report</SelectItem>
              <SelectItem value="Feature Request">✨ Feature Request</SelectItem>
              <SelectItem value="Improvement">⚡ Improvement</SelectItem>
              <SelectItem value="Question">❓ Question</SelectItem>
              <SelectItem value="Praise">🎉 Praise</SelectItem>
              <SelectItem value="Other">📝 Other</SelectItem>
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
              <Mail size={14} className="mr-1" />
              Send via Email
            </Button>
            <Button 
              onClick={copyToClipboard} 
              variant="outline" 
              className="border-border font-mono uppercase text-xs"
            >
              <Copy size={14} className="mr-1" />
              Copy
            </Button>
          </div>
          
          <Button 
            onClick={() => setIsOpen(false)} 
            variant="outline" 
            className="w-full border-border font-mono uppercase text-xs"
          >
            Cancel
          </Button>
          
          <div className="text-xs text-muted-foreground font-mono bg-muted p-2 border-2 border-border rounded">
            📧 <strong>Feedback goes to:</strong> numoraq@gmail.com - We read every message and respond to most within 24-48 hours! 🚀
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
