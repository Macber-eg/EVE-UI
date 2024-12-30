import { useState, useRef, useEffect } from 'react';
import { Send, Brain, AlertTriangle, Paperclip, X } from 'lucide-react';
import { EVE } from '../../../types/eve';
import { useEVECommunication } from '../../../hooks/useEVECommunication';
import { useDropzone } from 'react-dropzone';

interface EVECommunicationPanelProps {
  eve: EVE;
  className?: string;
}

export default function EVECommunicationPanel({ eve, className = '' }: EVECommunicationPanelProps) {
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, loading, error } = useEVECommunication(eve.id);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    onDrop: acceptedFiles => {
      setFiles(prev => [...prev, ...acceptedFiles]);
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if ((!input.trim() && files.length === 0) || loading) return;

    try {
      // Convert files to base64
      const fileAttachments = await Promise.all(
        files.map(async file => ({
          filename: file.name,
          content: await fileToBase64(file),
          contentType: file.type
        }))
      );

      await sendMessage(eve.id, input, {
        type: 'direct',
        priority: 'medium',
        metadata: {
          attachments: fileAttachments
        }
      });

      setInput('');
      setFiles([]);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Messages Area */}
      <div 
        className={`flex-1 overflow-y-auto p-4 space-y-4 ${
          isDragActive ? 'bg-[#72f68e]/10' : ''
        }`}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.from_eve_id === eve.id ? 'justify-end' : 'justify-start'}`}
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
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              
              {/* Attachments */}
              {message.metadata?.attachments?.length > 0 && (
                <div className="mt-2 space-y-1">
                  {message.metadata.attachments.map((attachment: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 text-xs bg-black/20 rounded px-2 py-1"
                    >
                      <Paperclip className="h-3 w-3" />
                      <span>{attachment.filename}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-1 flex items-center justify-between text-xs opacity-75">
                <span>
                  {new Date(message.created_at).toLocaleTimeString()}
                </span>
                <span className="ml-2">{message.status}</span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* File Preview */}
      {files.length > 0 && (
        <div className="border-t border-white/10 p-2">
          <div className="flex flex-wrap gap-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-white/5 rounded px-2 py-1"
              >
                <Paperclip className="h-4 w-4 text-[#72f68e]" />
                <span className="text-sm text-gray-300">{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Message ${eve.name}...`}
            className="flex-1 bg-white/5 text-white placeholder-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#72f68e] border border-white/10"
          />
          <button
            onClick={handleSend}
            disabled={(!input.trim() && files.length === 0) || loading}
            className="p-2 bg-[#72f68e]/20 text-[#72f68e] rounded-full hover:bg-[#72f68e]/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}