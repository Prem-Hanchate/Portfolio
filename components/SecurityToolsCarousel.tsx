"use client";

import { useEffect, useRef, useState } from "react";
import { 
  SiKalilinux, SiMetasploit, SiWireshark, SiBurpsuite,
  SiPython, SiGnubash, SiDocker, SiGithub
} from "react-icons/si";
import { TbCodeDots } from "react-icons/tb";
import { GiSharkFin } from "react-icons/gi";
import { FaNetworkWired } from "react-icons/fa";

const tools = [
  { name: "Kali Linux", Icon: SiKalilinux, color: "#557C94" },
  { name: "Metasploit", Icon: SiMetasploit, color: "#2596CD" },
  { name: "Nmap", Icon: TbCodeDots, color: "#45B8F5" },
  { name: "Wireshark", Icon: SiWireshark, color: "#1679A7" },
  { name: "Burp Suite", Icon: SiBurpsuite, color: "#FF6633" },
  { name: "Python", Icon: SiPython, color: "#3776AB" },
  { name: "Bash", Icon: SiGnubash, color: "#4EAA25" },
  { name: "Docker", Icon: SiDocker, color: "#2496ED" },
];

export default function SecurityToolsCarousel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let rotation = 0;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.28;
      const innerRadius = radius * 0.6;

      rotation += 0.8;

      // Draw outer rotating circle
      ctx.strokeStyle = "rgba(255, 206, 96, 0.3)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw inner circle
      ctx.strokeStyle = "rgba(255, 132, 64, 0.2)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw connecting lines and rotating dots
      const itemCount = tools.length;
      for (let i = 0; i < itemCount; i++) {
        const angle = (i / itemCount) * Math.PI * 2 + (rotation * Math.PI / 180);
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        // Connecting line to center
        ctx.strokeStyle = `rgba(255, 206, 96, ${0.2 + Math.sin(rotation * 0.05 + i) * 0.1})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Outer glowing dot
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 12);
        gradient.addColorStop(0, "rgba(255, 206, 96, 0.4)");
        gradient.addColorStop(1, "rgba(255, 132, 64, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.fillStyle = "rgba(255, 206, 96, 0.8)";
        ctx.beginPath();
        ctx.arc(x, y, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw center rotating indicator
      const centerDotAngle = (rotation * Math.PI / 180);
      const centerDotX = centerX + innerRadius * 0.5 * Math.cos(centerDotAngle);
      const centerDotY = centerY + innerRadius * 0.5 * Math.sin(centerDotAngle);

      const centerGradient = ctx.createRadialGradient(centerDotX, centerDotY, 0, centerDotX, centerDotY, 12);
      centerGradient.addColorStop(0, "rgba(255, 132, 64, 0.6)");
      centerGradient.addColorStop(1, "rgba(255, 132, 64, 0)");
      ctx.fillStyle = centerGradient;
      ctx.beginPath();
      ctx.arc(centerDotX, centerDotY, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(255, 132, 64, 1)";
      ctx.beginPath();
      ctx.arc(centerDotX, centerDotY, 3, 0, Math.PI * 2);
      ctx.fill();

      // Center core
      ctx.fillStyle = "rgba(255, 206, 96, 0.9)";
      ctx.beginPath();
      ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
      ctx.fill();

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="relative w-full">
      <div className="relative aspect-square md:aspect-auto md:h-96 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="w-full h-full [filter:drop-shadow(0_0_40px_rgba(255,206,96,0.25))]"
        />

        {/* Floating tool labels */}
        <div className="absolute inset-0 pointer-events-none">
          {tools.map((tool, idx) => {
            const angle = (idx / tools.length) * Math.PI * 2;
            const radius = Math.min(
              typeof window !== "undefined" ? window.innerWidth : 300,
              typeof window !== "undefined" ? window.innerHeight : 300
            ) * 0.16;
            const x = Math.cos(angle) * radius * 100;
            const y = Math.sin(angle) * radius * 100;

            return (
              <div
                key={tool.name}
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-mono text-white/60 whitespace-nowrap"
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                }}
              >
                {tool.name}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
