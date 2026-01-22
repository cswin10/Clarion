'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatContext {
  property: {
    name: string;
    address: string;
    city: string;
    propertyType: string;
    size: number;
    yearBuilt: number;
  };
  inputs: unknown;
  scenarios: unknown;
}

interface Props {
  context: ChatContext;
}

const SUGGESTED_QUESTIONS = [
  'Why is this scenario recommended?',
  'What are the biggest risks?',
  'What if we kept it as office space?',
  'When do we need to hit EPC C?',
  'How does this compare to market averages?',
];

export function ChatPanel({ context }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const text = messageText || input;
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, context }),
      });

      if (!response.ok) throw new Error('Chat request failed');

      const data = await response.json();
      setMessages([...newMessages, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isExpanded) {
    return (
      <Card variant="elevated" className="overflow-hidden">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center justify-between p-6 hover:bg-charcoal/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-gold" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-text-primary">Ask Clarion</h3>
              <p className="text-sm text-text-secondary">
                Ask questions about your analysis
              </p>
            </div>
          </div>
          <MessageCircle className="w-5 h-5 text-gold" />
        </button>
      </Card>
    );
  }

  return (
    <Card variant="elevated" className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-gold" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">Ask Clarion</h3>
            <p className="text-xs text-text-secondary">
              AI-powered analysis assistant
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-text-muted hover:text-text-secondary transition-colors text-sm"
        >
          Minimize
        </button>
      </div>

      {/* Messages */}
      <div className="h-80 overflow-y-auto p-6 space-y-4 scrollbar-hide">
        {messages.length === 0 && (
          <div className="text-center py-4">
            <p className="text-text-secondary mb-4">Try asking:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTED_QUESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSend(suggestion)}
                  className="px-3 py-2 rounded-button bg-charcoal hover:bg-slate/50 transition-colors text-sm text-text-secondary hover:text-text-primary"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[85%] rounded-card px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-gold text-navy'
                  : 'bg-charcoal text-text-primary'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-charcoal rounded-card px-4 py-3">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-gold rounded-full animate-bounce" />
                <span
                  className="w-2 h-2 bg-gold rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                />
                <span
                  className="w-2 h-2 bg-gold rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-slate/20">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask a question..."
            disabled={isLoading}
            className="flex-1 bg-charcoal border border-slate/30 rounded-button px-4 py-2.5 text-text-primary placeholder-text-muted focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all disabled:opacity-50"
          />
          <Button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            size="md"
            className="px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
