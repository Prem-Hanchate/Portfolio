"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import RotatingEarth from "@/components/RotatingEarth";
import RibbonBackground from "@/components/RibbonBackground";

// Dynamically import heavy client-side components to avoid SSR issues
const PortalIntro = dynamic(() => import("@/components/PortalIntro"), { ssr: false });
const CursorLight = dynamic(() => import("@/components/CursorLight"), { ssr: false });

export default function Home() {
  const [portalDone, setPortalDone] = useState(false);
  const [mounted, setMounted] = useState(false);
  const handlePortalComplete = useCallback(() => {
    setPortalDone(true);
  }, []);

  useEffect(() => {
    setMounted(true);
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.body.style.overflow = portalDone ? "auto" : "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [portalDone]);

  useEffect(() => {
    if (!portalDone) return;

    const jumpHome = () => {
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    const lockWheel = (event: WheelEvent) => {
      event.preventDefault();
    };

    window.addEventListener("wheel", lockWheel, { passive: false });
    jumpHome();
    const t1 = window.setTimeout(jumpHome, 60);
    const t2 = window.setTimeout(jumpHome, 180);
    const t3 = window.setTimeout(() => {
      window.removeEventListener("wheel", lockWheel);
    }, 420);

    return () => {
      window.removeEventListener("wheel", lockWheel);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [portalDone]);

  if (!mounted) {
    return <main className="relative bg-[#0a0a0a] text-white min-h-screen overflow-x-hidden" />;
  }

  return (
    <main className="relative bg-[#0a0a0a] text-white min-h-screen overflow-x-hidden">
      <RibbonBackground
        colors={["#22c55e", "#06b6d4", "#0891b2", "#10b981"]}
        baseSpring={0.025}
        baseFriction={0.88}
        baseThickness={35}
        offsetFactor={0.08}
        maxAge={600}
        pointCount={60}
        speedMultiplier={0.55}
        enableFade
        enableShaderEffect
        effectAmplitude={1.2}
      />

      {!portalDone && <PortalIntro onComplete={handlePortalComplete} />}

      {portalDone && (
        <div>
          <CursorLight />
          <RotatingEarth fullPageBackground={true} opacity={0.44} />
          <Navbar />
          <div id="home" className="relative z-10">
            {/* Home Section - Content over earth background */}
            <section className="min-h-screen flex flex-col items-center justify-center py-20 px-4">
              <div className="text-center max-w-4xl mx-auto">
                <span className="text-green-400 font-mono text-xs sm:text-sm md:text-base mb-3 md:mb-4 block">
                  {"$"} whoami → Prem Hanchate_
                </span>
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-green-400 via-cyan-400 to-green-400 bg-clip-text text-transparent leading-tight">
                  PREM HANCHATE
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-gray-300 font-mono mb-8">
                  Offensive thinking, Defensive acting
                </p>
                <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-xs sm:text-sm md:text-base leading-relaxed">
                  Network Security | OSINT Specialist | Python Automation | Security Research | Penetration Testing
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button 
                    onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all"
                  >
                    Explore
                  </button>
                  <button 
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-8 py-3 border border-green-500 text-green-400 font-bold rounded-lg hover:bg-green-500/10 transition-all"
                  >
                    Let's Connect
                  </button>
                </div>
              </div>
            </section>
          </div>
          <div id="about" className="relative z-10">
            <About />
          </div>
          <div id="skills" className="relative z-10">
            <Skills />
          </div>
          <div id="projects" className="relative z-10">
            <Projects />
          </div>
          <div id="contact" className="relative z-10">
            <Contact />
          </div>
        </div>
      )}
    </main>
  );
}