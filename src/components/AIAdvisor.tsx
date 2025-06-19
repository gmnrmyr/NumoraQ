
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, MessageCircle, X, Send, Sparkles, TrendingUp, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export const AIAdvisor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI Financial Advisor. I can help you analyze your portfolio, suggest optimizations, and provide insights based on your financial data. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedPersonality, setSelectedPersonality] = useState('balanced');

  const personalities = [
    { id: 'balanced', name: 'Balanced Advisor', icon: TrendingUp, description: 'Moderate risk, balanced approach' },
    { id: 'conservative', name: 'Conservative', icon: Shield, description: 'Low risk, safety first' },
    { id: 'aggressive', name: 'Growth Focused', icon: Sparkles, description: 'High risk, high reward' }
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');

    // Simulate AI response (this would be replaced with actual AI integration)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'This is a placeholder response. The AI integration will be implemented as a premium feature. Your message about "' + inputMessage + '" has been noted.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-20 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="brutalist-button shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white"
          size="lg"
        >
          <Bot size={20} className="mr-2" />
          AI Advisor
          <Badge className="ml-2 bg-yellow-500 text-black text-xs">BETA</Badge>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="brutalist-card shadow-xl bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-lg border-2 border-purple-500">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-mono uppercase text-white flex items-center gap-2">
              <Bot size={20} />
              AI Financial Advisor
              <Badge className="bg-yellow-500 text-black text-xs">BETA</Badge>
            </CardTitle>
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              size="sm"
              className="brutalist-button text-white border-white hover:bg-white hover:text-black"
            >
              <X size={14} />
            </Button>
          </div>
          
          <Select value={selectedPersonality} onValueChange={setSelectedPersonality}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white font-mono">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-2 border-border">
              {personalities.map(personality => {
                const Icon = personality.icon;
                return (
                  <SelectItem key={personality.id} value={personality.id} className="font-mono">
                    <div className="flex items-center gap-2">
                      <Icon size={14} />
                      <div>
                        <div className="font-medium">{personality.name}</div>
                        <div className="text-xs text-muted-foreground">{personality.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <ScrollArea className="h-64 bg-black/20 rounded border border-white/20 p-2">
            <div className="space-y-2">
              {messages.map(message => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-2 rounded text-xs font-mono ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white/10 text-white border border-white/20'
                  }`}>
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about your finances..."
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 font-mono text-xs"
            />
            <Button
              onClick={handleSendMessage}
              size="sm"
              className="brutalist-button bg-blue-600 text-white hover:bg-blue-700"
            >
              <Send size={14} />
            </Button>
          </div>
          
          <div className="text-xs text-white/60 font-mono bg-black/20 p-2 rounded border border-white/20">
            💎 <strong>Premium Feature Preview:</strong> Full AI integration available for supporters with advanced financial analysis and personalized recommendations.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
