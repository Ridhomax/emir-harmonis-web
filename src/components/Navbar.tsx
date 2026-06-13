"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<{name: string, email: string} | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => {
        if(res.ok) return res.json();
        throw new Error("Not logged in");
      })
      .then(data => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  return (
    <div className={`fixed left-0 right-0 z-50 flex justify-center px-4 pointer-events-none transition-all duration-500 ${isScrolled ? "top-4" : "top-6"}`}>
      <header 
        className={`pointer-events-auto bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-full flex items-center justify-between transition-all duration-500 hover:shadow-blue-900/20 ${
          isScrolled 
            ? "w-full max-w-3xl px-4 md:px-6 py-2 shadow-blue-900/5" 
            : "w-full max-w-5xl px-4 md:px-8 py-3 shadow-blue-900/10"
        }`}
      >
        <div className="flex items-center gap-3 w-full md:w-1/3">
          <div className="relative group overflow-hidden rounded-lg">
             <img src="/logo.png" alt="Emir Harmonis Logo" className={`w-auto rounded-lg shadow-sm group-hover:scale-110 transition-all duration-500 ${isScrolled ? "h-7" : "h-9"}`} />
          </div>
          <div className={`font-black tracking-tight bg-gradient-to-r from-blue-700 to-indigo-500 bg-clip-text text-transparent transition-all duration-500 ${isScrolled ? "text-lg" : "text-xl"}`}>
            Emir Harmonis
          </div>
        </div>
        
        {/* Centered Navigation */}
        <nav className={`hidden md:flex w-1/3 justify-center items-center gap-8 font-medium text-slate-600 transition-all duration-500 ${isScrolled ? "text-sm gap-6" : "text-base gap-8"}`}>
          <Link href="/#services" className="group relative px-2 py-1">
            <span className="group-hover:text-blue-700 transition-colors duration-300">Layanan</span>
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full rounded-full opacity-0 group-hover:opacity-100"></span>
          </Link>
          <Link href="/#booking" className="group relative px-2 py-1">
            <span className="group-hover:text-blue-700 transition-colors duration-300">Booking</span>
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full rounded-full opacity-0 group-hover:opacity-100"></span>
          </Link>
          <Link href="/#reviews" className="group relative px-2 py-1">
            <span className="group-hover:text-blue-700 transition-colors duration-300">Testimoni</span>
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full rounded-full opacity-0 group-hover:opacity-100"></span>
          </Link>
          <Link href="/register" className="group relative px-2 py-1">
            <span className="group-hover:text-blue-700 transition-colors duration-300">Daftar Member</span>
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full rounded-full opacity-0 group-hover:opacity-100"></span>
          </Link>
        </nav>
        
        <div className="w-full md:w-1/3 flex justify-end">
          <Link href="/cek-booking" className={`hidden md:flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full font-medium hover:bg-blue-100 transition-all duration-300 ${isScrolled ? "px-4 py-2 text-sm" : "px-5 py-2.5"}`}>
            <span>Cek Pesanan</span>
          </Link>
        </div>
      </header>
    </div>
  );
}
