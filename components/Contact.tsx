
"use client";

import dynamic from "next/dynamic";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Send, MapPin, MessageSquare } from "lucide-react";
import RotatingEarth from "./RotatingEarth";
const LightRays = dynamic(() => import("./LightRays"), { ssr: false });

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(null);

  const socialLinks = [
    { icon: Github, label: "GitHub", href: "https://github.com/Prem-Hanchate", color: "hover:text-gray-300" },
    { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/prem-h-036304278", color: "hover:text-blue-400" },
    { icon: MessageSquare, label: "Discord", href: "https://discord.com/users/prem07837", color: "hover:text-indigo-400" },
    { icon: Mail, label: "Email", href: "mailto:hanchateprem@gmail.com", color: "hover:text-green-400" },
  ];

  const contactInfo = [
    { icon: Mail, label: "Email", value: "hanchateprem@gmail.com" },
    { icon: MapPin, label: "Location", value: "India / Remote" },
  ];

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);
    setStatusType(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "Unable to send your message right now.");
      }

      setStatusType("success");
      setStatusMessage(result.message || "Message sent successfully. I will reply by email soon.");
      setFormData({
        name: "",
        email: "",
        subject: "Security Consultation",
        message: "",
      });
    } catch (error) {
      setStatusType("error");
      setStatusMessage(error instanceof Error ? error.message : "Something went wrong while sending your message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen bg-[#060606] py-20 overflow-hidden">
      <div className="absolute inset-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#22c55e"
          raysSpeed={0.75}
          lightSpread={1.28}
          rayLength={1.45}
          pulsating
          followMouse
          mouseInfluence={0.14}
          noiseAmount={0.012}
          distortion={0.035}
          className="opacity-55 mix-blend-screen"
        />
        <LightRays
          raysOrigin="bottom-center"
          raysColor="#0891b2"
          raysSpeed={0.75}
          lightSpread={1.28}
          rayLength={1.45}
          pulsating
          followMouse
          mouseInfluence={0.1}
          noiseAmount={0.01}
          distortion={0.03}
          className="opacity- mix-blend-screen"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.08),transparent_34%),radial-gradient(circle_at_center,rgba(6,182,212,0.07),transparent_30%),radial-gradient(circle_at_70%_20%,rgba(34,197,94,0.06),transparent_22%),linear-gradient(180deg,rgba(6,6,6,0.18),rgba(6,6,6,0.96))]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.022)_1px,transparent_1px)] bg-[size:72px_72px] opacity-16" />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-green-400 font-mono text-sm">{"<contact>"}</span>
          <h2 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6">
            Let&apos;s Connect
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto text-lg">
            Interested in security research, collaboration, or have a project in mind? Let&apos;s discuss how we can work together.
          </p>
          <span className="text-green-400 font-mono text-sm">{"</contact>"}</span>
        </motion.div>

        <div className="max-w-[1400px] mx-auto space-y-10">
          {/* Top Row: Form + Globe */}
          <div className="grid lg:grid-cols-2 gap-8 xl:gap-10 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-transparent backdrop-blur-[2px] border border-green-500/20 rounded-xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-gray-400 text-sm mb-2 font-mono">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder=""
                    required
                    className="w-full px-4 py-3 bg-[#0d0d0d] border border-green-500/30 rounded-lg text-white placeholder-gray-500 focus:border-green-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2 font-mono">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder=""
                    required
                    className="w-full px-4 py-3 bg-[#0d0d0d] border border-green-500/30 rounded-lg text-white placeholder-gray-500 focus:border-green-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2 font-mono">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder=""
                    required
                    className="w-full px-4 py-3 bg-[#0d0d0d] border border-green-500/30 rounded-lg text-white placeholder-gray-500 focus:border-green-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2 font-mono">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Tell me about your project..."
                    required
                    className="w-full px-4 py-3 bg-[#0d0d0d] border border-green-500/30 rounded-lg text-white placeholder-gray-500 focus:border-green-500 focus:outline-none transition-colors resize-none"
                  />
                </div>

                {statusMessage && (
                  <p
                    className={`rounded-lg border px-4 py-3 text-sm ${
                      statusType === "success"
                        ? "border-green-500/30 bg-green-500/10 text-green-300"
                        : "border-red-500/30 bg-red-500/10 text-red-300"
                    }`}
                  >
                    {statusMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group w-full relative px-6 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-white font-bold rounded-lg overflow-hidden hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? "Sending..." : "Send Message"}
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-transparent border-none rounded-none p-0 w-full max-w-[540px] mx-auto"
            >
              <RotatingEarth opacity={0.95} large />
            </motion.div>
          </div>

          {/* Bottom Row: Centered Remaining Cards */}
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 items-start">
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-transparent backdrop-blur-[2px] border border-green-500/20 rounded-xl p-6 hover:border-green-500/50 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                      <info.icon className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h4 className="text-gray-400 text-sm mb-1">{info.label}</h4>
                      <p className="text-white font-semibold">{info.value}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="space-y-6">
              <div className="bg-transparent backdrop-blur-[2px] border border-green-500/20 rounded-xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">Connect With Me</h3>
                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.05 }}
                      className={`flex items-center justify-center gap-3 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-lg text-gray-300 ${social.color} transition-all duration-300 group`}
                    >
                      <social.icon className="w-5 h-5" />
                      <span className="font-mono text-sm">{social.label}</span>
                    </motion.a>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="bg-transparent backdrop-blur-[2px] border border-green-500/30 rounded-xl p-6 text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400 font-bold">Open for Opportunities</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Available for security research, pentesting projects, and collaborations
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="inline-block px-6 py-3 bg-[#1a1a1a] border border-green-500/20 rounded-full">
            <p className="text-gray-400 font-mono text-sm">
              © 2026 Prem Hanchate. Offensive thinking, Defensive acting.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
