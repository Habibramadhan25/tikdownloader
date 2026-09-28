import React from 'react';
import { Info, Shield, Zap, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="w-full max-w-3xl mx-auto animate-in prose dark:prose-invert">
      <h1 className="text-4xl font-bold mb-6">About TikDown</h1>
      
      <p className="text-lg text-[hsl(var(--muted-foreground))] mb-8">
        TikDown is a modern, fast, and completely free tool designed to help you download TikTok videos for offline viewing or personal use.
      </p>

      <div className="grid sm:grid-cols-2 gap-6 mb-12">
        <div className="p-6 rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
          <div className="w-10 h-10 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center mb-4">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold mb-2">Lightning Fast</h3>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">Our optimized servers ensure that your videos are processed and ready to download in seconds.</p>
        </div>
        
        <div className="p-6 rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
          <div className="w-10 h-10 bg-pink-500/10 text-pink-500 rounded-xl flex items-center justify-center mb-4">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold mb-2">Private & Secure</h3>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">We don't require any login details and we don't store your downloaded videos on our servers.</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">How it works</h2>
      <p className="mb-4 text-[hsl(var(--muted-foreground))]">
        When you paste a link into TikDown, our system connects to the TikTok servers to retrieve the public information about the video, including the title, thumbnail, and the direct media URLs. We then provide these direct links to you, allowing you to download the content directly to your device without any watermarks.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8">Our Mission</h2>
      <p className="mb-4 text-[hsl(var(--muted-foreground))]">
        We built TikDown because we believe accessing media you have the rights to use should be simple, beautiful, and ad-free. We strive to provide the best user experience possible while respecting user privacy and content creators' rights.
      </p>

      <div className="mt-12 p-6 rounded-2xl bg-[hsl(var(--muted))] text-center">
        <Heart className="w-8 h-8 text-pink-500 mx-auto mb-3" />
        <p className="font-medium text-[hsl(var(--foreground))]">Made with love for creators and viewers.</p>
      </div>
    </div>
  );
}
