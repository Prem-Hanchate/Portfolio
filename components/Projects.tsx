"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, Shield, Eye, Lock, Terminal, Search, FileKey } from "lucide-react";
import { useEffect, useState } from "react";

export default function Projects() {
  const [stars, setStars] = useState<Array<{ left: number; top: number; delay: number; opacity: number }>>([]);

  useEffect(() => {
    // Generate stars only on client side to avoid hydration mismatch
    setStars(
      Array.from({ length: 45 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 3,
        opacity: Math.random() * 0.6 + 0.3,
      }))
    );
  }, []);
  const projects = [
    {
      title: "DNS Spoofing Detection Tool",
      description: "Real-time DNS traffic monitoring system that detects spoofing attacks with trusted DNS verification. Built with Python and Scapy for comprehensive network security.",
      tags: ["Python", "Scapy", "dnspython", "Network Security"],
      icon: Shield,
      gradient: "from-green-500 to-emerald-500",
      side: "left",
      link: "https://github.com/Prem-Hanchate",
    },
    {
      title: "Port Scanning Tool",
      description: "Advanced network reconnaissance tool featuring host discovery, OS detection, and comprehensive port scanning with automated report generation capabilities.",
      tags: ["Python", "Bash", "nmap", "Automation"],
      icon: Terminal,
      gradient: "from-cyan-500 to-blue-500",
      side: "right",
      link: "https://github.com/Prem-Hanchate/Port_Scanning",
    },
    {
      title: "Advanced Google Operators",
      description: "Powerful OSINT tool leveraging Google dorking techniques for advanced reconnaissance and information gathering operations.",
      tags: ["Python", "OSINT", "Reconnaissance"],
      icon: Search,
      gradient: "from-purple-500 to-pink-500",
      side: "left",
      link: "https://github.com/Prem-Hanchate/Advanced-Google-Operators",
    },
    {
      title: "PassGuardian",
      description: "Interactive password strength analyzer featuring real-time security validation, breach checking, and improvement suggestions with beautiful UI.",
      tags: ["HTML", "CSS", "JavaScript", "Security"],
      icon: Lock,
      gradient: "from-orange-500 to-red-500",
      side: "right",
      link: "https://github.com/Prem-Hanchate/PassGuardian",
    },
    {
      title: "Encryption & Decryption Tool",
      description: "Advanced AES encryption and decryption utility for secure text and file processing with strong cryptographic algorithms.",
      tags: ["Python", "Cryptography", "AES"],
      icon: FileKey,
      gradient: "from-yellow-500 to-orange-500",
      side: "left",
      link: "https://github.com/Prem-Hanchate",
    },
    {
      title: "OSINT Framework",
      description: "Comprehensive information gathering toolkit for open-source intelligence operations and digital footprint analysis.",
      tags: ["Shell", "OSINT", "Automation"],
      icon: Eye,
      gradient: "from-blue-500 to-indigo-500",
      side: "right",
      link: "https://github.com/Prem-Hanchate/OSINT",
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
            className="absolute w-1 h-1 bg-green-300 rounded-full animate-twinkle"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              animationDelay: `${star.delay}s`,
              opacity: star.opacity,
            }}
          />
        ))}
        {/* Nebula Effects */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '5s' }} />
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
          className="text-center mb-20"
        >
          <span className="text-green-400 font-mono text-sm">{"<projects>"}</span>
          <h2 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6">
            Security Arsenal
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto text-lg">
            Real-world security projects and tools for penetration testing and vulnerability research
          </p>
          <span className="text-green-400 font-mono text-sm">{"</projects>"}</span>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative max-w-7xl mx-auto">
          {/* Center Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-green-500 via-cyan-500 to-green-500 hidden md:block">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-cyan-500 rounded-full animate-pulse" />
          </div>

          {/* Projects */}
          <div className="space-y-12 md:space-y-24">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ 
                  opacity: 0, 
                  x: project.side === "left" ? -100 : 100,
                  scale: 0.8
                }}
                whileInView={{ 
                  opacity: 1, 
                  x: 0,
                  scale: 1
                }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.2,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true, margin: "-100px" }}
                className={`relative flex items-center ${
                  project.side === "left" 
                    ? "md:justify-start" 
                    : "md:justify-end"
                } justify-center`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-green-500 to-cyan-500 rounded-full border-4 border-[#0d0d0d] z-10 hidden md:block">
                  <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
                </div>

                {/* Project Card */}
                <div className={`w-full md:w-[45%] ${project.side === "right" ? "md:ml-auto" : ""}`}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="group relative bg-[#1a1a1a] border border-green-500/20 rounded-xl overflow-hidden hover:border-green-500/50 transition-all duration-300"
                  >
                    {/* Gradient Background on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    
                    <div className="relative p-8">
                      {/* Icon */}
                      <div className={`w-16 h-16 bg-gradient-to-br ${project.gradient} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <project.icon className="w-8 h-8 text-white" />
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
                        {project.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                        {project.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-xs font-mono"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Links */}
                      <div className="flex gap-3">
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg text-sm hover:bg-green-500/20 transition-all duration-300"
                        >
                          <Github className="w-4 h-4" />
                          View Code
                        </a>
                        <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg text-sm hover:bg-cyan-500/20 transition-all duration-300">
                          <ExternalLink className="w-4 h-4" />
                          Details
                        </button>
                      </div>
                    </div>

                    {/* Animated Corner */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                </div>

                {/* Connecting Line to Timeline (hidden on mobile) */}
                <div className={`absolute top-1/2 w-12 h-1 bg-gradient-to-r ${
                  project.side === "left" 
                    ? "right-1/2 from-green-500 to-transparent" 
                    : "left-1/2 from-transparent to-cyan-500"
                } hidden md:block`} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <a
            href="https://github.com/Prem-Hanchate"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500/50 text-green-400 rounded-lg font-mono overflow-hidden hover:border-green-500 transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-2">
              View All 19+ Repositories
              <Github className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-cyan-500/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
