
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageSquare, Send, X, Bot, Sparkles } from 'lucide-react';

const GeminiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Olá! Sou o assistente virtual da F&G. Como posso te ajudar com Seguro Garantia hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    try {
      // Always initialize with process.env.API_KEY directly per guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: `Você é o consultor virtual da F&G Corretora de Seguros. 
          Seu objetivo é explicar de forma simples e profissional o que é Seguro Garantia. 
          As modalidades principais são: Licitante, Executante, Judicial, Imobiliária e Aduaneira. 
          Sempre seja educado, técnico mas acessível, e incentive o usuário a pedir uma cotação formal com nossos corretores humanos. 
          Responda em Português do Brasil. Mantenha um tom de seriedade e confiança.`,
        },
      });

      // Extract text output from response.text property
      const botText = response.text || "Desculpe, tive um problema técnico. Pode tentar novamente?";
      setMessages(prev => [...prev, { role: 'bot', text: botText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Houve um erro ao processar sua pergunta. Por favor, tente novamente mais tarde.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div className="w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden animate-fade-in-up">
          <div className="bg-fg-navy p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-fg-gold rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-fg-navy" />
              </div>
              <div>
                <h4 className="text-white font-bold">Assistente F&G</h4>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-slate-300 uppercase">Online Agora</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' 
                  ? 'bg-fg-navy text-white rounded-tr-none' 
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite sua dúvida..."
              className="flex-1 bg-slate-100 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-fg-gold focus:outline-none"
            />
            <button 
              onClick={handleSend}
              className="bg-fg-gold text-fg-navy p-2 rounded-lg hover:bg-opacity-90 transition-all active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="p-2 bg-slate-100 text-[9px] text-slate-400 flex items-center justify-center gap-1 uppercase tracking-widest font-bold">
            <span className="flex items-center gap-1"><Sparkles className="w-2.5 h-2.5" /> Powered by Gemini AI</span>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-fg-gold rounded-full shadow-2xl flex items-center justify-center text-fg-navy hover:scale-110 active:scale-95 transition-all animate-float"
        >
          <MessageSquare className="w-8 h-8" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">1</span>
        </button>
      )}
    </div>
  );
};

export default GeminiAssistant;
