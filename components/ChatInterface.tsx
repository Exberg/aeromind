import React, { useRef, useEffect, useState } from "react";
import { ChatMessage, Flight } from "../aeromindTypes";
import {
  Send,
  Bot,
  User,
  Sparkles,
  ChevronRight,
  Mic,
  Lock,
  Signal,
  Zap,
} from "lucide-react";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  selectedFlight: Flight | undefined;
  onSendMessage: (text: string) => void;
  onActionClick: (actionId: string, label: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  selectedFlight,
  onSendMessage,
  onActionClick,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedFlight]); // Scroll when messages change OR flight changes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-col h-full w-full relative overflow-hidden bg-zinc-950">
      {/* Header */}
      <div className="h-12 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-4 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-6 h-6 bg-zinc-100 rounded-sm">
            <Bot className="w-4 h-4 text-black" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm text-white tracking-wider">
                {selectedFlight ? selectedFlight.code : "SELECT FLIGHT"}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            </div>
            <span className="font-mono text-[9px] text-zinc-500 tracking-widest uppercase">
              {selectedFlight ? "LINK ESTABLISHED" : "STANDBY"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Signal className="w-3 h-3 text-zinc-600" />
          <span className="font-mono text-[10px] text-zinc-600">ENCRYPTED</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth min-h-0 relative z-0 scrollbar-thin scrollbar-thumb-zinc-800">
        {/* Decorative Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5 h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(#27272a 1px, transparent 1px), linear-gradient(90deg, #27272a 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        ></div>

        {!selectedFlight && (
          <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-4 opacity-50">
            <Lock className="w-8 h-8" />
            <span className="font-mono text-xs uppercase tracking-widest">
              Select a flight to access secure comms
            </span>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === "user" ? "items-end" : "items-start"
            } animate-fade-in`}
          >
            {/* Sender Label */}
            <div className="flex items-center gap-2 mb-1 opacity-50">
              {msg.sender === "ai" ? (
                <Bot className="w-3 h-3 text-white" />
              ) : (
                <User className="w-3 h-3 text-zinc-400" />
              )}
              <span className="font-mono text-[10px] tracking-wider uppercase text-zinc-500">
                {msg.sender === "ai" ? "AeroMind" : "Operator"}
              </span>
              <span className="text-[10px] text-zinc-700">{msg.timestamp}</span>
            </div>

            {/* Content Bubble */}
            <div
              className={`max-w-[95%] relative group ${
                msg.sender === "user"
                  ? "bg-zinc-800 border border-zinc-700 text-white rounded-tr-none rounded-lg p-3"
                  : "bg-transparent"
              }`}
            >
              {/* Special AI Message Formatting */}
              {msg.sender === "ai" ? (
                <div className="w-full">
                  {/* Standard Text */}
                  {msg.type === "text" && (
                    <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-tl-none rounded-lg text-sm font-mono text-zinc-300">
                      <span className="text-zinc-500 mr-2">{">"}</span>
                      {msg.content}
                    </div>
                  )}

                  {/* Insight Card (The "Action Block") - MONOCHROME */}
                  {msg.type === "insight" && (
                    <div className="bg-zinc-950 border border-zinc-700 rounded-lg overflow-hidden shadow-sm">
                      {/* Card Header */}
                      <div className="bg-zinc-900 border-b border-zinc-800 p-2 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-3 h-3 text-white" />
                          <span className="font-mono text-[10px] text-white font-bold uppercase tracking-wider">
                            {msg.meta?.title || "INSIGHT DETECTED"}
                          </span>
                        </div>
                        {msg.meta?.profit && (
                          <span className="font-mono text-[10px] text-black bg-white px-2 py-0.5 font-bold">
                            {msg.meta.profit}
                          </span>
                        )}
                      </div>

                      {/* Card Body */}
                      <div className="p-3">
                        <p className="text-xs font-mono text-zinc-400 leading-relaxed mb-3">
                          {msg.content}
                        </p>

                        {/* Action Buttons */}
                        {msg.actions && (
                          <div className="grid grid-cols-1 gap-2 mt-2">
                            {msg.actions.map((action, idx) => (
                              <button
                                key={idx}
                                onClick={() =>
                                  onActionClick(action.actionId, action.label)
                                }
                                className={`group relative flex items-center justify-between px-3 py-2 text-xs font-mono uppercase tracking-wide transition-all border ${
                                  action.type === "primary"
                                    ? "bg-white border-white text-black hover:bg-zinc-200"
                                    : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {action.type === "primary" && (
                                    <Zap className="w-3 h-3" />
                                  )}
                                  {action.label}
                                </div>
                                <ChevronRight
                                  className={`w-3 h-3 ${
                                    action.type === "primary"
                                      ? "opacity-100"
                                      : "opacity-0 group-hover:opacity-100"
                                  } transition-opacity`}
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs font-sans text-white leading-relaxed">
                  {msg.content}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div
        className={`p-4 bg-zinc-900 border-t border-zinc-800 z-10 shrink-0 transition-opacity ${
          !selectedFlight ? "opacity-50 pointer-events-none" : "opacity-100"
        }`}
      >
        <form onSubmit={handleSubmit} className="relative group">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={!selectedFlight}
            placeholder={
              selectedFlight
                ? `Message Agent (${selectedFlight.code})...`
                : "Select a flight..."
            }
            className="w-full bg-zinc-950 border border-zinc-700 text-white text-xs font-mono p-3 pr-10 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all placeholder:text-zinc-600 rounded-sm"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {!inputValue && (
              <Mic className="w-4 h-4 text-zinc-600 hover:text-white cursor-pointer transition-colors" />
            )}
            {inputValue && (
              <button
                type="submit"
                className="text-white hover:text-zinc-300 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
