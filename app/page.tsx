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
    return <main className="relative bg-[#080b0d] text-white min-h-screen overflow-x-hidden" />;
  }

  return (
    <main className="relative bg-[#080b0d] text-white min-h-screen overflow-x-hidden">
      <RibbonBackground
        colors={["#00e5ff", "#00ff88", "#0f766e", "#14b8a6"]}
        baseSpring={0.02}
        baseFriction={0.9}
        baseThickness={28}
        offsetFactor={0.06}
        maxAge={520}
        pointCount={48}
        speedMultiplier={0.45}
        enableFade
        enableShaderEffect
        effectAmplitude={0.85}
      />

      {!portalDone && <PortalIntro onComplete={handlePortalComplete} />}

      {portalDone && (
        <div>
          <CursorLight />
          <RotatingEarth fullPageBackground={true} opacity={0.95} />
          <Navbar />
          <div id="home" className="relative z-10">
            <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-20">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,136,0.12),transparent_45%),radial-gradient(circle_at_center,rgba(0,229,255,0.08),transparent_60%)]" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/35 to-transparent" />

              <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
                <span className="mb-5 block font-mono text-[13px] tracking-[0.08em] text-[#00ff88] sm:text-sm">
                  $ whoami → Prem Hanchate_
                </span>
                <h1 className="mb-4 bg-gradient-to-r from-[#10d7ff] via-[#17f2df] to-[#00ff88] bg-clip-text text-[clamp(3.2rem,9vw,6.4rem)] font-black leading-[0.98] tracking-[-0.05em] text-transparent">
                  PREM HANCHATE
                </h1>
                <p className="mb-4 font-mono text-[clamp(1.1rem,2.6vw,1.65rem)] text-[#d6d6d6]">
                  Offensive thinking, Defensive acting
                </p>
                <p className="mb-12 max-w-3xl px-2 font-sans text-[13px] leading-7 text-[#7b7f82] sm:text-[15px]">
                  Network Security | OSINT Specialist | Python Automation | Security Research | Penetration Testing
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <button
                    onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                    className="rounded-lg bg-gradient-to-r from-[#00e5ff] to-[#00ff88] px-10 py-4 text-[15px] font-bold text-black transition-transform duration-300 hover:scale-[1.02]"
                  >
                    Explore
                  </button>
                  <button
                    onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                    className="rounded-lg border border-[#00ff88] bg-transparent px-10 py-4 text-[15px] font-semibold text-[#00ff88] transition-colors duration-300 hover:bg-[#00ff88]/8"
                  >
                    Let&apos;s Connect
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