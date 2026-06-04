"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  SiKalilinux, SiMetasploit, SiWireshark, SiBurpsuite,
  SiPython, SiJavascript, SiHtml5, SiMysql, SiCplusplus, SiGnubash
} from "react-icons/si";
import { TbCodeDots } from "react-icons/tb";
import { GiSharkFin } from "react-icons/gi";
import { 
  FaNetworkWired, FaSearch, FaRobot, FaLock, FaMicroscope, FaKey
} from "react-icons/fa";

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState("tools");
  const [stars, setStars] = useState<Array<{ left: number; top: number; delay: number; opacity: number }>>([]);

  useEffect(() => {
    // Generate stars only on client side to avoid hydration mismatch
    setStars(
      Array.from({ length: 35 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 3,
        opacity: Math.random() * 0.6 + 0.2,
      }))
    );
  }, []);

  const skills = {
    tools: [
      { name: "Kali Linux", icon: SiKalilinux, color: "#557C94" },
      { name: "Metasploit", icon: SiMetasploit, color: "#2596CD" },
      { name: "Nmap", icon: TbCodeDots, color: "#45B8F5" },
      { name: "Wireshark", icon: SiWireshark, color: "#1679A7" },
      { name: "Burp Suite", icon: SiBurpsuite, color: "#FF6633" },
      { name: "Scapy", icon: GiSharkFin, color: "#00D9FF" },
    ],
    languages: [
      { name: "Python", icon: SiPython, color: "#3776AB" },
      { name: "Bash/Shell", icon: SiGnubash, color: "#4EAA25" },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
      { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
      { name: "SQL", icon: SiMysql, color: "#4479A1" },
      { name: "C/C++", icon: SiCplusplus, color: "#00599C" },
    ],
    expertise: [
      { name: "Network Security", icon: FaNetworkWired, color: "#10B981" },
      { name: "OSINT", icon: FaSearch, color: "#06B6D4" },
      { name: "Penetration Testing", icon: FaLock, color: "#8B5CF6" },
      { name: "Security Automation", icon: FaRobot, color: "#F59E0B" },
      { name: "Vulnerability Research", icon: FaMicroscope, color: "#EF4444" },
      { name: "Cryptography", icon: FaKey, color: "#3B82F6" },
    ],
  };

  return (
    <section className="relative min-h-screen bg-[#0a0a0a] py-20 overflow-hidden">
      {/* Space Background */}
      <div className="absolute inset-0">
        {/* Animated Stars */}
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-300 rounded-full animate-twinkle"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              animationDelay: `${star.delay}s`,
              opacity: star.opacity,
            }}
          />
        ))}
        {/* Nebula Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 via-transparent to-cyan-500/5" />
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
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
            <div className="w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]" />
            <div className="absolute inset-0 w-96 h-96 bg-green-500/15 rounded-full blur-[100px]" />
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
          <span className="text-green-400 font-mono text-sm">{"<skills>"}</span>
          <h2 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6">
            Arsenal & Expertise
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto text-lg">
            A comprehensive toolkit and skillset for modern cybersecurity challenges
          </p>
          <span className="text-green-400 font-mono text-sm">{"</skills>"}</span>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex justify-center gap-4 mb-12 flex-wrap"
        >
          {Object.keys(skills).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-lg font-mono text-sm transition-all duration-300 ${
                activeCategory === category
                  ? "bg-green-500/20 border-2 border-green-500 text-green-400"
                  : "bg-gray-800/50 border border-gray-700 text-gray-400 hover:border-green-500/50"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Skills Icon Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto mb-20"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
            {skills[activeCategory as keyof typeof skills].map((skill, index) => {
              const IconComponent = skill.icon;
              return (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.08,
                    type: "spring",
                    stiffness: 200
                  }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1, y: -10 }}
                  className="group relative"
                >
                  <div className="p-4 md:p-6 cursor-pointer flex flex-col items-center justify-center transition-all duration-300">
                    {/* Icon Container with hover effect */}
                    <div className="mb-2 md:mb-3 relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20">
                      {/* White icon (default) */}
                      <IconComponent className="w-full h-full text-white group-hover:opacity-0 transition-all duration-300 absolute top-0 left-0" />
                      {/* Colored icon (on hover) */}
                      <IconComponent 
                        className="w-full h-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 absolute top-0 left-0"
                        style={{ color: skill.color }}
                      />
                    </div>
                    {/* Skill Name */}
                    <span className="text-gray-400 font-semibold text-center text-xs sm:text-sm md:text-base leading-tight group-hover:text-white transition-colors duration-300">
                      {skill.name}
                    </span>
                    {/* Glow Effect on Hover */}
                    <div 
                      className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 blur-2xl pointer-events-none -z-10"
                      style={{
                        background: `radial-gradient(circle, ${skill.color}30 0%, transparent 70%)`,
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Additional Expertise */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 grid md:grid-cols-3 gap-6"
        >
          {[
            { title: "Network Security", desc: "DNS spoofing detection, port scanning, and traffic monitoring" },
            { title: "OSINT Techniques", desc: "Advanced Google operators, information gathering, and reconnaissance" },
            { title: "Security Automation", desc: "Python scripting for automated vulnerability scanning and testing" },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-green-500/5 to-cyan-500/5 border border-green-500/20 rounded-xl p-6 hover:border-green-500/50 transition-all duration-300"
            >
              <h4 className="text-xl font-bold text-green-400 mb-3">{item.title}</h4>
              <p className="text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
