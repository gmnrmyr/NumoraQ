
import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send, X, MessageCircle, Crown, Loader2, Maximize2, Minimize2, Check, ArrowUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ChatGPTService } from "@/services/chatgptService";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export const AIAdvisor = () => {
  const { data } = useFinancialData();
  const { isPremiumUser } = usePremiumStatus();
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your **AI Financial Advisor** powered by ChatGPT. I have complete access to your Numoraq dashboard data including:\n\n• **Portfolio** (liquid & illiquid assets)\n• **Income & expense tracking**\n• **Debt management** progress\n• **Financial projections** & goals\n• **Savings rate** & FI timeline\n\nI can analyze your **full financial picture** and provide personalized advice on budgeting, investing, debt payoff, and wealth building strategies.\n\n💡 **Pro tip**: Click the maximize button for a better chat experience!\n\nWhat would you like to discuss about your financial journey?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedPersonality, setSelectedPersonality] = useState('professional');
  const [isLoading, setIsLoading] = useState(false);
  const [chatGPTService] = useState(() => new ChatGPTService());
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const bottomAnchorRef = useRef<HTMLDivElement | null>(null);

  const personalities = [
    { value: 'professional', label: 'Professional Advisor' },
    { value: 'friendly', label: 'Friendly Coach' },
    { value: 'aggressive', label: 'Aggressive Trader' },
    { value: 'conservative', label: 'Conservative Planner' },
  ];

  // Enhanced message formatting with markdown support
  const formatMessage = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text
      .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>') // Inline code
      .replace(/\n\n/g, '<br><br>') // Double line breaks
      .replace(/\n/g, '<br>') // Single line breaks
      .replace(/• /g, '<span class="text-accent">•</span> ') // Bullet points
      .replace(/\$([0-9,]+)/g, '<span class="text-green-400 font-mono">$$$1</span>') // Currency formatting
      .replace(/([0-9]+%)/g, '<span class="text-cyan-400 font-mono">$1</span>'); // Percentage formatting
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Check if user has premium access
    if (!isPremiumUser) {
      const demoResponse: Message = {
        id: Date.now().toString(),
        content: "🔒 AI Financial Advisor is a premium feature. Upgrade to Degen plan to get personalized financial advice powered by ChatGPT! You can still explore the demo interface.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, demoResponse]);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Extract financial context from user's dashboard data
      const financialContext = chatGPTService.extractFinancialContext(data);
      
      // Convert messages to ChatGPT format
      const chatHistory = messages.slice(1).map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));

      // Get AI response
      const aiResponseContent = await chatGPTService.sendMessage(
        inputMessage,
        chatHistory,
        selectedPersonality,
        financialContext
      );

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponseContent,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('AI Advisor Error:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm experiencing technical difficulties. Please try again in a moment. In the meantime, you can continue managing your portfolio in the dashboard.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll to bottom whenever messages or loading state changes
  useEffect(() => {
    // Prefer scrolling to an invisible anchor for consistent behavior
    if (bottomAnchorRef.current) {
      bottomAnchorRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      return;
    }
    // Fallback: scroll the container itself
    if (scrollContainerRef.current) {
      const el = scrollContainerRef.current;
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  if (!isOpen) {
    return (
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="sm"
          className="bg-card/90 backdrop-blur-sm border-accent/50 hover:bg-accent/10 rounded-full p-3 md:p-4 shadow-lg flex items-center gap-2"
          title={isPremiumUser ? 'AI (Degen active)' : 'AI (Upgrade available)'}
        >
          {isPremiumUser ? (
            <Check size={18} className="text-green-500" />
          ) : (
            <ArrowUp size={18} className="text-yellow-500" />
          )}
          <Bot size={18} />
          <span className="sr-only">Open AI Financial Advisor</span>
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed z-50 ${
      isMaximized 
        ? 'inset-2 md:inset-4' 
        : 'inset-4 md:bottom-4 md:right-4 md:top-auto md:left-auto w-auto md:w-[450px] h-auto md:h-[600px]'
    }`}>
      <Card className="brutalist-card shadow-xl h-full flex flex-col">
        <CardHeader className="pb-3 px-3 md:px-6">
          <div className="flex items-center justify-between">
            <CardTitle className="font-mono text-sm md:text-base uppercase flex items-center gap-2">
              <Bot size={16} />
              <span className="hidden sm:inline">AI Financial Advisor</span>
              <span className="sm:hidden">AI Advisor</span>
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="secondary" className="text-xs">
                <Crown size={10} className="mr-1" />
                DEGEN
              </Badge>
              <Button
                onClick={() => setIsMaximized(!isMaximized)}
                variant="outline"
                size="sm"
                className="brutalist-button"
                title={isMaximized ? 'Minimize' : 'Maximize'}
              >
                {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
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
            <SelectTrigger className="bg-input border-2 border-border font-mono text-xs md:text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-2 border-border z-50">
              {personalities.map(personality => (
                <SelectItem 
                  key={personality.value} 
                  value={personality.value} 
                  className="font-mono text-xs md:text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  {personality.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-3 md:p-4 space-y-4 min-h-0">
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 min-h-0" ref={scrollContainerRef}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-3 md:p-4 border-2 border-border font-mono text-xs md:text-sm rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-accent text-accent-foreground ml-4 md:ml-8'
                    : 'bg-muted mr-4 md:mr-8'
                } break-words`}
              >
                <div className="font-bold mb-2 text-xs md:text-sm">
                  {message.sender === 'user' ? 'YOU' : 'AI ADVISOR'}
                </div>
                <div 
                  className="whitespace-pre-wrap leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                />
              </div>
            ))}
            {isLoading && (
              <div className="bg-muted mr-4 md:mr-8 p-3 md:p-4 border-2 border-border font-mono text-xs md:text-sm rounded-lg">
                <div className="font-bold mb-2 text-xs md:text-sm">AI ADVISOR</div>
                <div className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  <span>Analyzing your financial data...</span>
                </div>
              </div>
            )}
            <div ref={bottomAnchorRef} />
          </div>
          
          <div className="flex gap-2 flex-shrink-0">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about your finances, goals, or get advice..."
              className="flex-1 bg-input border-2 border-border font-mono text-xs md:text-sm resize-none min-h-[60px] md:min-h-[80px]"
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
              className="brutalist-button self-end"
              size="sm"
              disabled={isLoading || !inputMessage.trim()}
            >
              {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            </Button>
          </div>
          
          <div className="text-xs md:text-sm text-muted-foreground font-mono text-center flex-shrink-0">
            {isPremiumUser ? 
              "🤖 Powered by ChatGPT - Full dashboard analysis enabled" : 
              "🔒 Premium feature - Upgrade to Degen for AI advice"
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
