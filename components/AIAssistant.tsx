import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { askTechnicalAssistant } from '../services/geminiService';
import { Bot, Send, User, Loader2, Info } from 'lucide-react';

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'Olá! Sou o Assistente Técnico Virtual da Célula 1.A do SENAI. Como posso ajudar você hoje com operações de usinagem, manutenção ou segurança?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    const responseText = await askTechnicalAssistant(userMsg.text);

    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col animate-fade-in bg-theme-card rounded-xl shadow-sm border border-theme-border overflow-hidden">
      {/* Chat Header */}
      <div className="bg-theme-sidebar p-4 flex items-center justify-between text-white border-b border-theme-border">
        <div className="flex items-center gap-3">
          <div className="bg-theme-accent-solid/20 p-2 rounded-full text-theme-accent-solid">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="font-bold text-theme-text-main">Assistente Técnico</h2>
            <p className="text-xs text-theme-text-muted opacity-90">Powered by Gemini AI</p>
          </div>
        </div>
        <div className="hidden md:block">
           <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider border border-green-500/30">Online</span>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-900/20 p-3 text-xs text-blue-300 flex items-start gap-2 border-b border-blue-900/30">
        <Info size={16} className="mt-0.5 flex-shrink-0" />
        <p>Este assistente fornece orientações baseadas em manuais técnicos.</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-theme-bg/50">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] md:max-w-[70%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                ${msg.role === 'user' ? 'bg-theme-input border border-theme-border' : 'bg-theme-accent-solid text-white'}
              `}>
                {msg.role === 'user' ? <User size={16} className="text-theme-text-muted" /> : <Bot size={16} />}
              </div>
              
              <div className={`
                p-4 rounded-2xl text-sm leading-relaxed shadow-sm
                ${msg.role === 'user' 
                  ? 'bg-theme-accent-solid text-white rounded-tr-none' 
                  : 'bg-theme-card text-theme-text-main rounded-tl-none border border-theme-border'}
              `}>
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div className="text-[10px] text-white/50 mt-2 text-right">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="flex max-w-[80%] gap-3">
               <div className="w-8 h-8 rounded-full bg-theme-accent-solid text-white flex items-center justify-center flex-shrink-0">
                  <Bot size={16} />
               </div>
               <div className="bg-theme-card border border-theme-border p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                 <Loader2 size={16} className="animate-spin text-theme-accent-solid" />
                 <span className="text-xs text-theme-text-muted">Consultando manuais técnicos...</span>
               </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-theme-card border-t border-theme-border">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ex: Qual o avanço para desbaste em Aço 1020 no torno CNC?"
            className="flex-1 bg-theme-input border border-theme-border text-theme-text-main text-sm rounded-lg focus:ring-1 focus:ring-theme-accent-solid block p-3 outline-none transition-colors"
          />
          <button 
            type="submit" 
            disabled={!inputValue.trim() || isLoading}
            className="bg-gradient-accent hover:brightness-110 text-white rounded-lg px-5 py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-glow"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;