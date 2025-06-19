
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send, X, MessageCircle, Crown, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export const AIAdvisor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI Financial Advisor. I can help you analyze your financial data, suggest improvements, and answer questions about your portfolio. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedPersonality, setSelectedPersonality] = useState('professional');

  const personalities = [
    { value: 'professional', label: 'Professional Advisor' },
    { value: 'friendly', label: 'Friendly Coach' },
    { value: 'aggressive', label: 'Aggressive Trader' },
    { value: 'conservative', label: 'Conservative Planner' },
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate AI response (in real implementation, this would call an API)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "This is a demo response. In the full version, I would analyze your financial data and provide personalized insights based on your portfolio, expenses, and goals.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  if (isHidden) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsHidden(false)}
          variant="outline"
          size="sm"
          className="bg-card/80 backdrop-blur-sm border-accent/50 hover:bg-accent/10"
          title="Show AI Advisor"
        >
          <Bot size={16} />
        </Button>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <Button
          onClick={() => setIsHidden(true)}
          variant="outline"
          size="sm"
          className="bg-card/80 backdrop-blur-sm border-muted hover:bg-muted/20 self-end"
          title="Hide AI Advisor"
        >
          <EyeOff size={14} />
        </Button>
        <Button
          onClick={() => setIsOpen(true)}
          className="brutalist-button shadow-lg"
          size="lg"
        >
          <Bot size={20} className="mr-2" />
          AI Advisor
          <Badge variant="secondary" className="ml-2">
            <Crown size={12} className="mr-1" />
            PREMIUM
          </Badge>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[350px] h-[500px]">
      <Card className="brutalist-card shadow-xl h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-mono text-sm uppercase flex items-center gap-2">
              <Bot size={16} />
              AI Financial Advisor
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="secondary" className="text-xs">
                <Crown size={10} className="mr-1" />
                PREMIUM
              </Badge>
              <Button
                onClick={() => setIsHidden(true)}
                variant="outline"
                size="sm"
                className="brutalist-button"
                title="Hide"
              >
                <EyeOff size={12} />
              </Button>
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
          
          <Select value={selectedPersonality} onValueChange={setSelectedPersonality}>
            <SelectTrigger className="bg-input border-2 border-border font-mono text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-2 border-border z-50">
              {personalities.map(personality => (
                <SelectItem 
                  key={personality.value} 
                  value={personality.value} 
                  className="font-mono text-xs hover:bg-accent hover:text-accent-foreground"
                >
                  {personality.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-4 space-y-4">
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-2 border-2 border-border font-mono text-xs ${
                  message.sender === 'user'
                    ? 'bg-accent text-accent-foreground ml-6'
                    : 'bg-muted mr-6'
                }`}
              >
                <div className="font-bold mb-1">
                  {message.sender === 'user' ? 'YOU' : 'AI ADVISOR'}
                </div>
                <div>{message.content}</div>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about your finances..."
              className="flex-1 bg-input border-2 border-border font-mono text-xs resize-none"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              onClick={handleSendMessage}
              className="brutalist-button"
              size="sm"
            >
              <Send size={14} />
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground font-mono text-center">
            Demo mode - Premium feature for supporters
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
