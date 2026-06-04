"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import SecurityToolsCarousel from "./SecurityToolsCarousel";

export default function Hero() {
  const [text, setText] = useState("");
  const [stars, setStars] = useState<Array<{ left: number; top: number; delay: number; opacity: number }>>([]);
  const fullText = "Offensive thinking, Defensive acting";

  useEffect(() => {
    let index = 0;
    let isMounted = true;
    
    const timer = setInterval(() => {
      if (!isMounted) return;
      if (index <= fullText.length) {
        setText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [fullText]);

  useEffect(() => {
    // Generate stars only on client side to avoid hydration mismatch
    setStars(
      Array.from({ length: 50 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 3,
        opacity: Math.random() * 0.7 + 0.3,
      }))
    );
  }, []);

  return (
    <section className="relative min-h-screen bg-[#0a0a0a] flex items-center justify-center overflow-hidden py-20 md:py-0">
      {/* Subtle Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      {/* Animated Stars */}
      <div className="absolute inset-0">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              animationDelay: `${star.delay}s`,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>
      
      {/* Static Glowing Orbs */}
      <div className="absolute top-10 left-10 md:top-20 md:left-20 w-48 h-48 md:w-72 md:h-72 bg-green-500/20 rounded-full blur-[80px] md:blur-[100px] animate-pulse" />
      <div className="absolute bottom-10 right-10 md:bottom-20 md:right-20 w-56 h-56 md:w-96 md:h-96 bg-cyan-500/20 rounded-full blur-[90px] md:blur-[120px] animate-pulse" />

      <div className="relative z-10 text-center px-4 md:px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="text-green-400 font-mono text-xs sm:text-sm md:text-base mb-3 md:mb-4 block">
            {"$"} whoami → Prem Hanchate_
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-green-400 via-cyan-400 to-green-400 bg-clip-text text-transparent leading-tight"
        >
          PREM HANCHATE
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-lg sm:text-xl md:text-2xl text-gray-300 font-mono mb-6 md:mb-8 min-h-[2rem]"
        >
          {text}
          <span className="animate-pulse">|</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-gray-400 max-w-2xl mx-auto mb-8 md:mb-12 text-xs sm:text-sm md:text-base leading-relaxed px-2"
        >
          Network Security | OSINT Specialist | Python Automation | Security Research | Penetration Testing
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          viewport={{ once: true }}
          className="mb-12 md:mb-16 max-w-2xl mx-auto"
        >
          <SecurityToolsCarousel />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button 
            onClick={() => {
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group relative w-full sm:w-auto px-6 md:px-8 py-3 bg-green-500/10 border border-green-500/50 text-green-400 rounded-lg font-mono overflow-hidden hover:bg-green-500/20 transition-all duration-300"
          >
            <span className="relative z-10 text-sm md:text-base">View Projects</span>
            <div className="absolute inset-0 bg-green-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
          <button 
            onClick={() => {
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group relative w-full sm:w-auto px-6 md:px-8 py-3 bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 rounded-lg font-mono overflow-hidden hover:bg-cyan-500/20 transition-all duration-300"
          >
            <span className="relative z-10 text-sm md:text-base">Contact Me</span>
            <div className="absolute inset-0 bg-cyan-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
