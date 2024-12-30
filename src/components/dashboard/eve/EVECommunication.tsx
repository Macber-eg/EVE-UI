import React, { useState, useRef, useEffect } from 'react';
import { useEVECommunication } from '../../../hooks/useEVECommunication';
import { EVE } from '../../../types/eve';
import { Send, Brain, AlertTriangle, Clock } from 'lucide-react';

interface EVECommunicationProps {
  eve: EVE;
  className?: string;
}

export default function EVECommunication({ eve, className = '' }: EVECommunicationProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, updateMessageStatus, loading, error } = useEVECommunication(eve.id);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      await sendMessage(eve.id, input, {
        type: 'direct',
        priority: 'medium'
      });
      setInput('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-400 animate-spin" />
              <span className="text-gray-400">Loading messages...</span>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Brain className="h-8 w-8 mb-2" />
            <p>No messages yet</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.from_eve_id === eve.id ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.from_eve_id !== eve.id && (
                <div className="w-8 h-8 rounded-full bg-[#72f68e]/20 flex items-center justify-center mr-2">
                  <Brain className="h-4 w-4 text-[#72f68e]" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.from_eve_id === eve.id
                    ? 'bg-[#72f68e] text-[#040707]'
                    : 'bg-white/5 text-gray-200'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <div className="mt-1 flex items-center justify-between text-xs opacity-75">
                  <span>
                    {new Date(message.created_at).toLocaleTimeString()}
                  </span>
                  <span className="ml-2">{message.status}</span>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-white/5 text-white placeholder-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#72f68e] border border-white/10"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2 bg-[#72f68e]/20 text-[#72f68e] rounded-full hover:bg-[#72f68e]/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}