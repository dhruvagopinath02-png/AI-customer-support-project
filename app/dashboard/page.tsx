'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { 
  Upload, 
  MessageSquare, 
  Send, 
  FileText, 
  LogOut, 
  User as UserIcon,
  Bot,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.text) {
        setExtractedText(data.text);
        setMessages([{
          role: 'assistant',
          content: `Knowledge base updated from "${selectedFile.name}". I'm ready to answer any questions you have about this document!`
        }]);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !extractedText || isChatting) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsChatting(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMessage,
          context: extractedText
        }),
      });

      const data = await res.json();
      if (data.text) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.error || 'Failed to get response form AI.'}` }]);
      }
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: `Network error: ${err.message}` }]);
    } finally {
      setIsChatting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] text-zinc-200 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 flex flex-col border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl">
        {/* User Profile */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center overflow-hidden">
              {user.photoURL ? (
                <img src={user.photoURL} alt="User" className="h-full w-full object-cover" />
              ) : (
                <UserIcon className="h-6 w-6 text-white" />
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate text-white">{user.displayName || 'User'}</p>
              <p className="text-xs text-zinc-500 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-xs text-zinc-500 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-3 w-3" />
            Sign Out
          </button>
        </div>

        {/* Upload Section */}
        <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4 px-1">
              Knowledge Base
            </h3>
            
            <label className="group relative flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/[0.07] hover:border-blue-500/50 transition-all cursor-pointer">
              <input type="file" className="hidden" accept=".pdf,.txt" onChange={handleFileUpload} disabled={isUploading} />
              
              <div className="rounded-full bg-blue-500/10 p-3 group-hover:scale-110 transition-transform">
                {isUploading ? (
                  <Loader2 className="h-6 w-6 text-blue-400 animate-spin" />
                ) : (
                  <Upload className="h-6 w-6 text-blue-400" />
                )}
              </div>
              
              <div className="text-center">
                <p className="text-sm font-medium text-white">Upload Document</p>
                <p className="text-xs text-zinc-500 mt-1">PDF or Plain Text</p>
              </div>
            </label>
          </div>

          {file && (
            <div className="p-4 rounded-xl border border-white/5 bg-white/5 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-indigo-500/10 p-2 mt-0.5">
                  <FileText className="h-4 w-4 text-indigo-400" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium text-white truncate">{file.name}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • Ready
                  </p>
                </div>
              </div>
            </div>
          )}

          {!file && (
            <div className="p-4 rounded-xl border border-yellow-500/10 bg-yellow-500/5 flex items-start gap-3">
              <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-500/80 leading-relaxed">
                Please upload a document to get started. The AI needs context to answer your questions.
              </p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="p-6 border-t border-white/5">
          <p className="text-[10px] text-zinc-600 text-center uppercase tracking-widest font-bold">
            Powered by Gemini 1.5 Pro
          </p>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-zinc-900/10 relative">
        {/* Header */}
        <header className="h-16 flex items-center border-b border-white/5 px-8 bg-zinc-950/20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <h2 className="text-sm font-semibold text-white">RAG Agent Active</h2>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto">
              <div className="rounded-2xl bg-blue-500/10 p-5 mb-6">
                <MessageSquare className="h-10 w-10 text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-3">AI Support Assistant</h1>
              <p className="text-zinc-500 leading-relaxed">
                Once you upload a document, I'll analyze its content and provide instant answers to your questions.
              </p>
            </div>
          ) : (
            messages.map((m, i) => (
              <div 
                key={i} 
                className={`flex gap-4 max-w-4xl ${m.role === 'assistant' ? '' : 'flex-row-reverse self-end w-full'}`}
              >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  m.role === 'assistant' 
                    ? 'bg-blue-600/20 border border-blue-500/20 text-blue-400' 
                    : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {m.role === 'assistant' ? <Bot className="h-5 w-5" /> : <UserIcon className="h-5 w-5" />}
                </div>
                
                <div className={`p-5 rounded-2xl leading-relaxed text-sm ${
                  m.role === 'assistant'
                    ? 'bg-white/5 border border-white/5 text-zinc-300'
                    : 'bg-blue-600 text-white'
                }`}>
                  {m.content}
                </div>
              </div>
            ))
          )}
          {isChatting && (
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-xl bg-blue-600/20 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 animate-pulse">
                <Bot className="h-5 w-5" />
              </div>
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex gap-1 items-center">
                <div className="h-1 w-1 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-1 w-1 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-1 w-1 bg-zinc-500 rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-8">
          <form 
            onSubmit={handleSendMessage}
            className="max-w-5xl mx-auto relative group"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={extractedText ? "Ask anything about your document..." : "Upload a document first to start chatting"}
              disabled={!extractedText || isChatting}
              className="w-full h-16 pl-6 pr-20 rounded-2xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!input.trim() || !extractedText || isChatting}
              className="absolute right-3 top-3 bottom-3 w-14 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 active:scale-95 transition-all disabled:grayscale disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
          <p className="text-[10px] text-zinc-600 text-center mt-4 uppercase tracking-wider font-medium">
            Responses are contextually restricted to the uploaded knowledge base
          </p>
        </div>
      </main>
    </div>
  );
}
