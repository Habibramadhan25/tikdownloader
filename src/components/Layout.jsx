import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Download, Menu } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Layout() {

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full border-b-4 border-[hsl(var(--border))] bg-[hsl(var(--background))]">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between max-w-7xl">
          <NavLink to="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter text-[hsl(var(--foreground))] hover:translate-y-0.5 hover:translate-x-0.5 transition-transform">
            <div className="w-10 h-10 border-3 border-[hsl(var(--border))] shadow-brutal-sm bg-neo-yellow flex items-center justify-center text-black">
              <Download size={22} strokeWidth={3} />
            </div>
            <span className="uppercase">TikDown</span>
          </NavLink>
          
          <nav className="hidden lg:flex items-center gap-8 text-base font-bold uppercase tracking-wide">
            <NavLink to="/" className={({isActive}) => cn("transition-transform hover:-translate-y-1 hover:text-neo-pink", isActive ? "text-[hsl(var(--foreground))] border-b-4 border-[hsl(var(--foreground))]" : "text-[hsl(var(--foreground))]")}>Home</NavLink>
            <NavLink to="/docs" className={({isActive}) => cn("transition-transform hover:-translate-y-1 hover:text-neo-cyan", isActive ? "text-[hsl(var(--foreground))] border-b-4 border-[hsl(var(--foreground))]" : "text-[hsl(var(--foreground))]")}>Documentation</NavLink>
            <NavLink to="/about" className={({isActive}) => cn("transition-transform hover:-translate-y-1 hover:text-neo-yellow", isActive ? "text-[hsl(var(--foreground))] border-b-4 border-[hsl(var(--foreground))]" : "text-[hsl(var(--foreground))]")}>About</NavLink>
          </nav>
          
          <div className="flex items-center gap-4 text-sm font-bold">
            <NavLink to="/login" className="hidden sm:block hover:underline uppercase">Login</NavLink>
            <NavLink to="/" className="hidden sm:block border-3 border-[hsl(var(--border))] shadow-brutal-sm bg-neo-pink text-white px-5 py-2 uppercase hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all active:translate-y-1 active:translate-x-1">
              Get Started
            </NavLink>
            
            <button className="lg:hidden p-2 border-3 border-[hsl(var(--border))] bg-neo-green text-black shadow-brutal-sm hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all focus:outline-none">
              <Menu size={20} strokeWidth={3} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:py-16 flex flex-col">
        <Outlet />
      </main>

      <footer className="border-t-4 border-[hsl(var(--border))] bg-neo-yellow py-12 text-center text-base font-bold text-black">
        <div className="container mx-auto max-w-7xl px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xl uppercase">© {new Date().getFullYear()} TikDown.</p>
          <div className="flex gap-6 uppercase">
            <NavLink to="/privacy" className="hover:underline hover:text-neo-pink transition-colors">Privacy Policy</NavLink>
            <NavLink to="/terms" className="hover:underline hover:text-neo-pink transition-colors">Terms of Service</NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
}
