'use client';

import { useAuth } from './context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Bot, Shield, Zap, ArrowRight } from 'lucide-react';

export default function Home() {
  const { user, signInWithGoogle, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-white px-6">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-blue-900/20 blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-indigo-900/20 blur-[120px]"></div>

      <main className="relative z-10 flex flex-col items-center max-w-4xl text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 px-4 backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
          <span className="text-sm font-medium text-white/80">Next-Gen Customer Support AI</span>
        </div>

        {/* Hero Title */}
        <h1 className="mb-6 text-6xl font-bold tracking-tight md:text-7xl">
          Turn your Documents into <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Interactive Intelligence
          </span>
        </h1>

        {/* Hero Description */}
        <p className="mb-12 max-w-2xl text-lg text-zinc-400 md:text-xl">
          Transform static PDFs and documentation into a dynamic AI customer support agent. 
          Powered by Gemini 1.5 Pro and Retrieval-Augmented Generation (RAG).
        </p>

        {/* CTA Button */}
        <button 
          onClick={signInWithGoogle}
          className="group relative flex items-center justify-center gap-3 overflow-hidden rounded-xl bg-white px-8 py-4 text-lg font-bold text-black transition-all hover:scale-105 active:scale-95"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 transition-opacity group-hover:opacity-100"></div>
          <span className="relative z-10 flex items-center gap-3">
            Get Started Free
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </span>
        </button>

        {/* Features Preview */}
        <div className="mt-24 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col items-center gap-4 p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm">
            <div className="rounded-full bg-blue-500/20 p-3">
              <Zap className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold">Instant Retrieval</h3>
            <p className="text-sm text-zinc-500">Access information from your documents in milliseconds with intelligent indexing.</p>
          </div>
          <div className="flex flex-col items-center gap-4 p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm">
            <div className="rounded-full bg-purple-500/20 p-3">
              <Shield className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold">Secure Context</h3>
            <p className="text-sm text-zinc-500">AI responses are strictly grounded in your provided documentation, reducing hallucinations.</p>
          </div>
          <div className="flex flex-col items-center gap-4 p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm">
            <div className="rounded-full bg-indigo-500/20 p-3">
              <Bot className="h-6 w-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold">Pro Integration</h3>
            <p className="text-sm text-zinc-500">Leverage the logic and reasoning capabilities of Gemini 1.5 Pro's massive context window.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
