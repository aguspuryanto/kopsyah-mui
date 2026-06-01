import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Send, Phone, Video, MoreVertical, CheckCheck, Smile } from 'lucide-react';
import { User } from '../types';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  time: string;
}

interface AssistantViewProps {
  user: User;
  onBack: () => void;
}

export function AssistantView({ user, onBack }: AssistantViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      text: `Ahlan wa sahlan, ${user.name}! Saya Asisten AI Koperasi SPPS. Ada yang bisa saya bantu hari ini terkait layanan, simpanan, atau pembiayaan syariah Anda?`,
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: newUserMsg.text,
          history: messages,
          userContext: JSON.stringify(user, null, 2)
        })
      });
      
      const data = await response.json();
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply || data.error || 'Maaf, terjadi kesalahan atau layanan sedang sibuk.',
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Maaf, gagal terhubung ke asisten koperasi. Silakan periksa koneksi Anda.',
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute inset-0 z-[100] bg-[#efeae2] flex flex-col h-full overflow-hidden"
      style={{ backgroundImage: 'radial-gradient(circle at center, #ece5dd 0%, #efeae2 100%)' }} // WhatsApp web-like background illusion
    >
      {/* WhatsApp-like Header */}
      <div className="bg-[#008069] text-white px-4 pt-12 pb-4 flex items-center gap-3 shrink-0 relative z-20 shadow-md">
        <button onClick={onBack} className="p-1 -ml-1 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="relative">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center overflow-hidden border border-white/30">
             <span className="text-xl font-bold font-heading">AI</span>
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#008069] rounded-full"></div>
        </div>
        <div className="flex-1">
          <h1 className="font-semibold text-lg leading-tight">Asisten SPPS</h1>
          <p className="text-[11px] text-white/80 font-medium">Melayani dengan ihsan • Online</p>
        </div>
        <div className="flex items-center gap-3">
          <Video className="w-5 h-5 text-white/80" />
          <Phone className="w-5 h-5 text-white/80" />
          <MoreVertical className="w-5 h-5 text-white/80" />
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4 relative z-10">
        {/* Date capsule */}
        <div className="flex justify-center mb-2">
            <span className="bg-white/80 text-gray-500 text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full shadow-sm backdrop-blur-sm">
                Hari Ini
            </span>
        </div>

        {/* Security message */}
        <div className="flex justify-center mb-4">
            <div className="bg-amber-100/80 text-amber-800 text-[10px] text-center font-medium px-4 py-2 rounded-xl shadow-sm max-w-[85%] backdrop-blur-sm">
                🔒 Pesan dan panggilan terenkripsi secara end-to-end. Asisten AI ini terintegrasi langsung dengan data real-time koperasi Anda.
            </div>
        </div>

        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                layout
                className={`flex flex-col max-w-[80%] ${isBot ? 'items-start self-start' : 'items-end self-end'}`}
              >
                <div 
                    className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm overflow-hidden relative ${
                        isBot 
                        ? 'bg-white text-gray-800 rounded-tl-sm' 
                        : 'bg-[#dcf8c6] text-gray-900 rounded-tr-sm'
                    }`}
                >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <div className="flex items-center justify-end gap-1 mt-1 -mb-1">
                        <span className="text-[10px] text-gray-400 font-medium">{msg.time}</span>
                        {!isBot && <CheckCheck className="w-3.5 h-3.5 text-blue-500" />}
                    </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start max-w-[80%] self-start"
          >
            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-3 py-3 bg-transparent pb-8 shrink-0">
        <div className="flex items-end gap-2">
            <div className="flex-1 bg-white rounded-3xl shrink-0 shadow-sm flex items-end pl-3 pr-2 py-1 border border-transparent focus-within:border-[#008069] transition-colors">
                <button className="p-2 text-gray-400 hover:text-gray-600 mb-0.5 shrink-0">
                    <Smile className="w-6 h-6" />
                </button>
                <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    placeholder="Ketik pesan..."
                    rows={1}
                    className="flex-1 bg-transparent border-none outline-none resize-none py-2.5 px-2 max-h-32 min-h-[44px] text-sm text-gray-900"
                    style={{ overflowY: 'auto' }}
                />
            </div>
            
            {inputValue.trim() ? (
                <button 
                    onClick={handleSend}
                    className="w-12 h-12 rounded-full bg-[#008069] shrink-0 text-white flex items-center justify-center shadow-md active:scale-95 transition-all text-center mb-0.5"
                >
                    <Send className="w-5 h-5 ml-1" />
                </button>
            ) : (
                <button 
                    className="w-12 h-12 rounded-full bg-[#008069] shrink-0 text-white flex items-center justify-center shadow-md active:scale-95 transition-all mb-0.5"
                >
                    <Phone className="w-5 h-5" />
                </button>
            )}
        </div>
      </div>
    </motion.div>
  );
}
