import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Menu, Phone, Video, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: number;
  text: string;
  sender: "user" | "system";
  timestamp: string;
}

export function PhoneSimulator() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Sequence Logic
    let timeout: NodeJS.Timeout;

    const runSequence = async () => {
      if (step === 0) {
        // Initial user inquiry
        setMessages([
          { id: 1, text: "Hi, I'm interested in your services", sender: "user", timestamp: "10:00 AM" }
        ]);
        setStep(1);
      } else if (step === 1) {
        // Wait then show typing
        timeout = setTimeout(() => setIsTyping(true), 1500);
        // Send auto reply
        timeout = setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [
            ...prev, 
            { id: 2, text: "Thanks for reaching out! Here is our brochure. Can we schedule a call?", sender: "system", timestamp: "10:01 AM" }
          ]);
          setStep(2);
        }, 3000);
      } else if (step === 2) {
        // Simulate waiting for follow up
        timeout = setTimeout(() => {
           setMessages(prev => [
            ...prev,
            { id: 3, text: "Hi there! Just following up on my previous message. Any questions?", sender: "system", timestamp: "Next Day" }
          ]);
          setStep(3);
        }, 4000);
      }
    };

    runSequence();

    return () => clearTimeout(timeout);
  }, [step]);

  const handleUserReply = () => {
    setMessages(prev => [
      ...prev,
      { id: 4, text: "Yes, I'd like to book a call.", sender: "user", timestamp: "Now" }
    ]);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { id: 5, text: "Great! Automation stopped. A human agent will take over now.", sender: "system", timestamp: "Now" }
      ]);
    }, 1000);
    setStep(4); // End
  };

  return (
    <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
      <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute z-20"></div>
      <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
      <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
      
      <div className="rounded-[2rem] overflow-hidden w-full h-full bg-[#E5DDD5] relative flex flex-col">
        {/* Header */}
        <div className="bg-[#075E54] text-white p-3 pt-8 flex items-center justify-between shadow-md z-10">
          <div className="flex items-center gap-2">
            <ChevronLeft className="h-5 w-5" />
            <div className="bg-slate-200 rounded-full w-8 h-8 flex items-center justify-center text-slate-700 font-bold text-xs">
              AC
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm leading-none">Acme Corp</span>
              <span className="text-[10px] opacity-80">Business Account</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Video className="h-4 w-4" />
            <Phone className="h-4 w-4" />
            <Menu className="h-4 w-4" />
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] text-sm ${msg.sender === "user" ? "chat-bubble-sent" : "chat-bubble-received"}`}>
                  {msg.text}
                  <div className="text-[10px] text-gray-500 text-right mt-1 flex justify-end items-center gap-1">
                    {msg.timestamp}
                    {msg.sender === "user" && <span className="text-blue-500">✓✓</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
               <div className="bg-white rounded-lg rounded-tl-none px-4 py-2 shadow-sm border border-slate-100 text-xs text-gray-400">
                 typing...
               </div>
             </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-[#f0f0f0] p-2 flex items-center gap-2">
           <div className="flex-1 bg-white rounded-full px-4 py-2 text-sm text-gray-400">
             Type a message
           </div>
           <div className="bg-[#075E54] p-2 rounded-full text-white">
             <Send className="h-4 w-4" />
           </div>
        </div>

        {step === 3 && (
          <div className="absolute bottom-16 left-0 right-0 p-4 flex justify-center">
            <Button 
              onClick={handleUserReply}
              className="bg-primary hover:bg-primary/90 text-white shadow-lg animate-bounce"
            >
              Simulate Reply
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

