import React, { useState, useEffect, useRef } from 'react';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { 
  Send, 
  Bot, 
  User as UserIcon, 
  FileText, 
  Search,
  ChevronDown,
  Loader2,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  Building2,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  excerpts?: { filename: string; content: string }[];
}

const Assistant = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get('/api/patients/');
        setPatients(res.data);
        if (res.data.length > 0) {
          if (user?.role === 'patient') {
            setSelectedPatientId(user.patient_profile_id || res.data[0].id);
          } else {
            setSelectedPatientId(res.data[0].id);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPatients();
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedPatientId || isLoading) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await api.post('/api/chat/message', {
        patient_id: selectedPatientId,
        message: input
      });
      
      const assistantMsg: Message = {
        role: 'assistant',
        content: res.data.answer,
        excerpts: res.data.excerpts
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I encountered an error querying the clinical context. Please verify practitioner permissions and clinical AI consent for this patient chart.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] mx-2 my-2 md:m-4 bg-surface rounded-2xl border border-border-main overflow-hidden shadow-sm relative z-10 pb-20 md:pb-0">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-border-main flex items-center justify-between bg-surface/70 backdrop-blur-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white border border-[#d9ddda] rounded-xl flex items-center justify-center p-1.5 shadow-xs">
            <img 
              src="/shellbiotech_logo.png" 
              alt="Shell Biotech Logo" 
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-black text-sm text-text-main">Shell Biotech Assistant</span>
              <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-[9px] font-bold rounded-md uppercase tracking-wider border border-secondary/20">
                RAG Engine
              </span>
            </div>
            <p className="text-[10px] text-text-muted font-medium">Multimodal Context & Pharmaceutical Retrieval</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <label className="hidden sm:block text-[10px] font-bold text-text-muted uppercase tracking-wider">Patient Chart:</label>
          <div className="relative group/dropdown">
            <button
               onClick={() => user?.role !== 'patient' && setIsDropdownOpen(!isDropdownOpen)}
               className={cn(
                 "bg-background border border-border-main rounded-xl px-3 py-2 pr-8 text-xs text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all font-medium flex items-center gap-2 min-w-[140px]",
                 user?.role === 'patient' ? "opacity-60 cursor-not-allowed" : "hover:border-secondary/40 cursor-pointer"
               )}
            >
              <span className="truncate max-w-[110px] sm:max-w-none">
                {selectedPatient ? selectedPatient.full_name : "Select Patient"}
              </span>
              <ChevronDown className={cn("absolute right-2.5 top-2.5 text-text-muted transition-transform", isDropdownOpen && "rotate-180")} size={15} />
            </button>
            
            <AnimatePresence>
              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    className="absolute right-0 top-full mt-1.5 w-60 bg-surface border border-border-main rounded-xl shadow-xl overflow-hidden z-50 py-1.5"
                  >
                    <div className="max-h-56 overflow-y-auto">
                      {patients.map(p => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setSelectedPatientId(p.id);
                            setIsDropdownOpen(false);
                          }}
                          className={cn(
                            "w-full text-left px-3.5 py-2 text-xs transition-colors flex flex-col cursor-pointer",
                            selectedPatientId === p.id 
                              ? "bg-[#0b1f33] text-white dark:bg-secondary" 
                              : "text-text-main hover:bg-secondary/10"
                          )}
                        >
                          <span className="font-bold">{p.full_name}</span>
                          <span className={cn("text-[9px] font-mono", selectedPatientId === p.id ? "text-white/70" : "text-text-muted")}>
                            MRN: {p.external_id}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-5 py-12">
            <div className="w-16 h-16 bg-white border border-[#d9ddda] rounded-2xl flex items-center justify-center p-2 shadow-sm">
              <img 
                src="/shellbiotech_logo.png" 
                alt="Shell Biotech" 
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-text-main">
                Clinical Context Assistant
              </h3>
              <p className="text-text-muted max-w-md mx-auto mt-1 text-xs font-medium">
                Inquire about {selectedPatient?.full_name ? `${selectedPatient.full_name}'s` : "the patient's"} medical history, laboratory observations, clinical formulations, or imaging studies.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 max-w-md w-full pt-2">
              {[
                'Summarize clinical history',
                'Check laboratory parameters',
                'Recent medications & dosage',
                'Diagnostic scan interpretation'
              ].map(q => (
                <button 
                  key={q}
                  onClick={() => setInput(q)}
                  className="px-3.5 py-2.5 bg-surface border border-border-main hover:border-secondary/40 hover:bg-secondary/5 rounded-xl text-xs font-semibold text-text-main text-left transition-all shadow-xs cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-3 max-w-2xl",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white shadow-xs",
                msg.role === 'user' ? "bg-[#0b1f33] dark:bg-secondary" : "bg-secondary"
              )}>
                {msg.role === 'user' ? <UserIcon size={16} /> : <Bot size={16} />}
              </div>
              <div className="space-y-2 text-sm">
                <div className={cn(
                  "p-4 rounded-xl leading-relaxed shadow-xs",
                  msg.role === 'user' 
                    ? "bg-[#0b1f33] text-white rounded-tr-none dark:bg-secondary" 
                    : "bg-surface border border-border-main text-text-main rounded-tl-none"
                )}>
                  {msg.content}
                </div>
                
                {msg.excerpts && msg.excerpts.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                      <FileText size={11} /> Referenced Document Sources:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {msg.excerpts.map((exc, j) => (
                        <div key={j} className="bg-background border border-border-main rounded-lg p-2.5 text-[10px] text-text-muted max-w-[240px]">
                          <span className="font-bold text-secondary block truncate mb-0.5">{exc.filename}</span>
                          <span className="line-clamp-2 italic">"{exc.content}"</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <div className="flex gap-3 max-w-2xl">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 text-white shadow-xs">
              <Bot size={16} />
            </div>
            <div className="bg-surface border border-border-main p-4 rounded-xl rounded-tl-none flex items-center gap-2.5 shadow-xs">
              <Loader2 className="animate-spin text-secondary" size={16} />
              <span className="text-xs text-text-muted font-medium italic">Analyzing patient telemetry and retrieved chunks...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-border-main bg-surface">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask Shell Biotech Assistant regarding ${selectedPatient?.full_name || 'selected patient'}...`}
            className="flex-1 bg-background border border-border-main rounded-xl px-4 py-3 text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all font-medium text-xs sm:text-sm placeholder:text-text-muted/40 shadow-xs"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim() || !selectedPatientId}
            className="bg-[#0b1f33] hover:bg-[#16324f] dark:bg-secondary dark:hover:bg-secondary-light text-white px-5 rounded-xl transition-all disabled:opacity-40 flex items-center justify-center cursor-pointer shadow-xs"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Assistant;
