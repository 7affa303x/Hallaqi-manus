import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Paperclip,
  Phone,
  ChevronRight,
  Check,
  CheckCheck,
} from 'lucide-react';
import Layout from '@/components/Layout';
import { mockConversations, quickReplies } from '@/data/mockChats';
import type { ChatMessage, MessageStatus } from '@/data/mockChats';

/* ─── Check Marks Component ─── */
function MessageStatusIcon({ status }: { status?: MessageStatus }) {
  if (status === 'read') {
    return <CheckCheck className="w-3 h-3 text-primary-500" strokeWidth={2.5} />;
  }
  if (status === 'delivered') {
    return <CheckCheck className="w-3 h-3 text-white/60" strokeWidth={2.5} />;
  }
  return <Check className="w-3 h-3 text-white/60" strokeWidth={2.5} />;
}

/* ─── Typing Indicator ─── */
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="flex justify-end mb-1"
    >
      <div className="bg-bg-elevated rounded-[16px_16px_16px_4px] px-4 py-3">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-text-tertiary"
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                duration: 0.4,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Date Separator ─── */
function DateSeparator({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center my-4"
    >
      <span className="px-4 py-1 bg-bg-elevated rounded-full text-[10px] font-bold text-text-tertiary font-arabic">
        {label}
      </span>
    </motion.div>
  );
}

/* ─── Quick Reply Chips ─── */
function QuickReplyChips({ onSend }: { onSend: (text: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="px-4 pb-2 pt-1"
    >
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {quickReplies.map((reply) => (
          <motion.button
            key={reply}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSend(reply)}
            className="flex-shrink-0 px-3 py-1.5 bg-primary-50 text-primary-500 rounded-lg text-xs font-bold font-arabic whitespace-nowrap"
          >
            {reply}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Appointment Context Bar ─── */
function AppointmentContextBar({
  date,
  time,
  service,
  price,
}: {
  date: string;
  time: string;
  service: string;
  price: number;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="mx-4 mt-3"
    >
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-primary-50 rounded-xl p-3 mb-3 overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold font-arabic text-text-primary">
                  موعد يوم {date} الساعة {time}
                </p>
                <p className="text-xs text-text-secondary mt-0.5 font-arabic">
                  {service} · {price.toLocaleString()} دج
                </p>
              </div>
              <button
                onClick={() => setExpanded(false)}
                className="text-primary-500 text-xs font-bold font-arabic flex-shrink-0 mr-2"
              >
                تفاصيل
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!expanded && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setExpanded(true)}
          className="text-xs text-primary-500 font-bold font-arabic mb-2"
        >
          عرض تفاصيل الموعد
        </motion.button>
      )}
    </motion.div>
  );
}

/* ─── Message Bubble ─── */
function MessageBubble({
  message,
  index,
}: {
  message: ChatMessage;
  index: number;
}) {
  const isUser = message.sender === 'user';

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: isUser ? -30 : 30,
        scale: 0.95,
      }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{
        duration: 0.3,
        delay: index < 5 ? index * 0.05 : 0,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
      className={`flex mb-1 ${isUser ? 'justify-start' : 'justify-end'}`}
    >
      <div
        className={`max-w-[75%] px-3.5 py-2.5 ${
          isUser
            ? 'bg-primary-500 text-white rounded-[16px_16px_4px_16px]'
            : 'bg-bg-elevated text-text-primary rounded-[16px_16px_16px_4px]'
        }`}
      >
        <p className="text-sm leading-relaxed font-arabic whitespace-pre-wrap">
          {message.text}
        </p>
        <div className={`flex items-center gap-1 mt-1 ${isUser ? 'justify-start' : 'justify-end'}`}>
          <span
            className={`text-[10px] ${
              isUser ? 'text-white/60' : 'text-text-tertiary'
            }`}
          >
            {message.time}
          </span>
          {isUser && <MessageStatusIcon status={message.status} />}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Chat Header (custom, inline) ─── */
function ChatHeader({
  name,
  avatar,
  isOnline,
  lastSeen,
  onBack,
}: {
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
  onBack: () => void;
}) {
  return (
    <div className="sticky top-0 z-50 bg-bg-card border-b border-border-subtle">
      <div className="flex items-center justify-between h-navbar px-2">
        {/* Left: Back + Avatar + Info */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-bg-elevated transition-colors flex-shrink-0"
          >
            <ChevronRight className="w-6 h-6 text-text-primary rtl-flip" />
          </motion.button>

          <div className="relative flex-shrink-0">
            <img src={avatar} alt={name} className="w-9 h-9 rounded-full object-cover" />
            {isOnline && (
              <motion.span
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-bg-card rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="w-2 h-2 bg-success rounded-full" />
              </motion.span>
            )}
          </div>

          <div className="min-w-0">
            <h2 className="text-base font-semibold font-arabic text-text-primary truncate leading-tight">
              {name}
            </h2>
            <p className="text-[10px] text-text-tertiary font-arabic leading-tight">
              {isOnline ? (
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-success rounded-full inline-block" />
                  متصل
                </span>
              ) : (
                lastSeen ?? 'غير متصل'
              )}
            </p>
          </div>
        </div>

        {/* Right: Call */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-bg-elevated transition-colors"
        >
          <Phone className="w-5 h-5 text-text-secondary" />
        </motion.button>
      </div>
    </div>
  );
}

/* ─── Main Chat Page ─── */
export default function Chat() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Find conversation or use first as default
  const conversation = mockConversations.find((c) => c.barberId === id) ?? mockConversations[0];

  const [messages, setMessages] = useState<ChatMessage[]>(conversation.messages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Simulate barber typing after user sends message
  const simulateReply = useCallback(() => {
    setIsTyping(true);
    setShowQuickReplies(false);

    setTimeout(() => {
      setIsTyping(false);
      const replies = [
        'تمام! راح نجهز كل شيء.',
        'ممتاز! نشوفك في الموعد.',
        'شكراً على تواصلك! أي خدمة أخرى تحتاجها؟',
        'تمام، تم التسجيل.',
      ];
      const replyText = replies[Math.floor(Math.random() * replies.length)];
      const newMsg: ChatMessage = {
        id: Date.now().toString(),
        text: replyText,
        sender: 'barber',
        time: new Date().toLocaleTimeString('ar-DZ', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, newMsg]);
    }, 2000);
  }, []);

  const handleSend = useCallback(
    (text?: string) => {
      const messageText = text ?? input.trim();
      if (!messageText) return;

      const newMsg: ChatMessage = {
        id: Date.now().toString(),
        text: messageText,
        sender: 'user',
        time: new Date().toLocaleTimeString('ar-DZ', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'sent',
      };

      setMessages((prev) => [...prev, newMsg]);
      setInput('');

      // Auto-resize textarea
      if (inputRef.current) {
        inputRef.current.style.height = '40px';
      }

      // Update status to delivered then read
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) => (m.id === newMsg.id ? { ...m, status: 'delivered' as MessageStatus } : m))
        );
      }, 500);

      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) => (m.id === newMsg.id ? { ...m, status: 'read' as MessageStatus } : m))
        );
      }, 1200);

      simulateReply();
    },
    [input, simulateReply]
  );

  const handleQuickSend = useCallback(
    (text: string) => {
      handleSend(text);
    },
    [handleSend]
  );

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = '40px';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  // Handle enter key (send on Enter, new line on Shift+Enter)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasInput = input.trim().length > 0;

  return (
    <Layout showFooter={false} showNavbar={false}>
      <div className="flex flex-col h-[100dvh] bg-bg-base">
        {/* Custom Chat Header */}
        <ChatHeader
          name={conversation.barberName}
          avatar={conversation.barberAvatar}
          isOnline={conversation.isOnline}
          lastSeen={conversation.lastSeen}
          onBack={() => navigate(-1)}
        />

        {/* Appointment Context Bar */}
        {conversation.appointmentContext && (
          <AppointmentContextBar
            date={conversation.appointmentContext.date}
            time={conversation.appointmentContext.time}
            service={conversation.appointmentContext.service}
            price={conversation.appointmentContext.price}
          />
        )}

        {/* Messages Area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-1"
        >
          <DateSeparator label="اليوم" />

          <AnimatePresence>
            {messages.map((msg, index) => (
              <MessageBubble key={msg.id} message={msg} index={index} />
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>{isTyping && <TypingIndicator />}</AnimatePresence>

          {/* Quick Reply Chips */}
          <AnimatePresence>
            {showQuickReplies && !isTyping && (
              <QuickReplyChips onSend={handleQuickSend} />
            )}
          </AnimatePresence>
        </div>

        {/* Input Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="shrink-0 bg-bg-card border-t border-border-subtle px-4 py-3"
        >
          <div className="flex items-end gap-2">
            {/* Attachment Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full flex items-center justify-center text-text-tertiary hover:bg-bg-elevated transition-colors flex-shrink-0"
            >
              <Paperclip className="w-5 h-5" />
            </motion.button>

            {/* Text Input */}
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowQuickReplies(true)}
                placeholder="اكتب رسالة..."
                rows={1}
                className="w-full min-h-[40px] max-h-[120px] bg-bg-elevated text-text-primary placeholder:text-text-tertiary rounded-[20px] px-4 py-2.5 text-sm font-arabic resize-none outline-none focus:ring-2 focus:ring-primary-500/30 transition-shadow"
                dir="rtl"
              />
            </div>

            {/* Send Button */}
            <AnimatePresence>
              {hasInput && (
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSend()}
                  className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-button flex-shrink-0"
                >
                  <Send className="w-5 h-5 -rotate-90" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
