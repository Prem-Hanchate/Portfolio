"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Terminal, Bug } from "lucide-react";
import { useEffect, useState } from "react";

export default function About() {
  const [stars, setStars] = useState<Array<{ left: number; top: number; delay: number; opacity: number }>>([]);

  useEffect(() => {
    // Generate stars only on client side to avoid hydration mismatch
    setStars(
      Array.from({ length: 40 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 3,
        opacity: Math.random() * 0.5 + 0.2,
      }))
    );
  }, []);
  const features = [
    {
      icon: Shield,
      title: "Network Security",
      description: "DNS spoofing detection, port scanning, and real-time network monitoring with automated reporting",
    },
    {
      icon: Lock,
      title: "Application Security",
      description: "Password strength analysis, encryption tools, and security testing frameworks for comprehensive protection",
    },
    {
      icon: Terminal,
      title: "Security Automation",
      description: "Python and Bash scripting for automated workflows, vulnerability scanning, and penetration testing",
    },
    {
      icon: Bug,
      title: "OSINT & Reconnaissance",
      description: "Advanced Google operators, information gathering, and open-source intelligence techniques",
    },
  ];

  return (
    <section className="relative min-h-screen bg-[#0d0d0d] py-20 overflow-hidden">
      {/* Space Background */}
      <div className="absolute inset-0">
        {/* Animated Stars */}
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
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        {/* Mouse Following Glowing Effect */}
        <div
          className="absolute pointer-events-none transition-all duration-300"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="relative">
            <div className="w-96 h-96 bg-green-500/20 rounded-full blur-[100px]" />
            <div className="absolute inset-0 w-96 h-96 bg-cyan-500/15 rounded-full blur-[100px]" />
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-green-400 font-mono text-sm">{"<about>"}</span>
          <h2 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6">
            Who Am I?
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto text-lg">
            A passionate security researcher and ethical hacker dedicated to securing the digital frontier.
            With expertise in network security, OSINT, penetration testing, and security automation,
            I focus on offensive thinking with defensive acting. My mission: Break it to make it stronger.
          </p>
          <span className="text-green-400 font-mono text-sm">{"</about>"}</span>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {[
            { number: "19+", label: "Public Repositories" },
            { number: "8+", label: "Security Projects" },
            { number: "169+", label: "GitHub Contributions" },
            { number: "2+", label: "Years Experience" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-green-500/10 to-cyan-500/10 border border-green-500/20 rounded-lg p-6 text-center backdrop-blur-sm hover:border-green-500/50 transition-all duration-300"
            >
              <div className="text-3xl md:text-4xl font-bold text-green-400 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              viewport={{ once: true }}
              className="group relative bg-[#1a1a1a] border border-green-500/20 rounded-xl p-8 hover:border-green-500/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 bg-green-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
