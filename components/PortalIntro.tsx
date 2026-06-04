"use client";

import { useMemo, useRef, useState, useEffect } from "react";

type PortalIntroProps = {
  onComplete: () => void;
};

type DotPoint = {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  size: number;
  shade: number;
  phase: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function PortalIntro({ onComplete }: PortalIntroProps) {
  const [progress, setProgress] = useState(0);
  const [autoAdvancing, setAutoAdvancing] = useState(false);
  const [hidden, setHidden] = useState(false);

  const rafRef = useRef<number | null>(null);
  const autoStartRef = useRef<{ time: number; startProgress: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<DotPoint[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const touchStartRef = useRef<{ x: number; y: number; progress: number } | null>(null);
  const frameRef = useRef(0);
  const progressRef = useRef(0);
  const completionTriggeredRef = useRef(false);
  const handoffTriggeredRef = useRef(false);

  const easingCubic = (t: number) => {
    if (t < 0.5) return 4 * t * t * t;
    return 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const maskScale = useMemo(() => {
    const minScale = 1;
    const maxScale = 220;
    return minScale * Math.pow(maxScale / minScale, progress);
  }, [progress]);

  const fullNameFade = 1 - clamp((progress - 0.3) / 0.22, 0, 1);
  const fullNameScale = 1 + clamp((progress - 0.12) / 0.5, 0, 1) * 0.58;
  const fullNameLift = 0;
  const letterFade = clamp((progress - 0.32) / 0.14, 0, 1);
  const letterScale = 1 + Math.pow(clamp((progress - 0.34) / 0.62, 0, 1), 2.2) * 105;
  const portalTitleFont = '"Cabinet Grotesk", "Satoshi", "Arial Black", sans-serif';
  const portalHintFont = '"Satoshi", "Cabinet Grotesk", sans-serif';

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    if (progress >= 1) {
      if (completionTriggeredRef.current) return;
      completionTriggeredRef.current = true;
      const hideTimer = window.setTimeout(() => {
        setHidden(true);
        if (!handoffTriggeredRef.current) {
          handoffTriggeredRef.current = true;
          onComplete();
        }
      }, 650);
      return () => window.clearTimeout(hideTimer);
    }
  }, [progress, onComplete]);

  useEffect(() => {
    const wheelHandler = (event: WheelEvent) => {
      event.preventDefault();
      if (autoAdvancing) return;

      const step = clamp(Math.abs(event.deltaY) / 2500, 0.008, 0.08);
      const direction = event.deltaY >= 0 ? 1 : -1;

      setProgress((prev) => {
        const next = clamp(prev + direction * step, 0, 1);
        if (next >= 0.3 && next < 1) {
          setAutoAdvancing(true);
          autoStartRef.current = { time: performance.now(), startProgress: next };
        }
        return next;
      });
    };

    const keyHandler = (event: KeyboardEvent) => {
      if (autoAdvancing) return;
      if (!["ArrowDown", "ArrowUp", "PageDown", "PageUp"].includes(event.key)) return;
      event.preventDefault();

      const direction = event.key === "ArrowUp" || event.key === "PageUp" ? -1 : 1;
      const step = 0.045;

      setProgress((prev) => {
        const next = clamp(prev + direction * step, 0, 1);
        if (next >= 0.3 && next < 1) {
          setAutoAdvancing(true);
          autoStartRef.current = { time: performance.now(), startProgress: next };
        }
        return next;
      });
    };

    const touchStartHandler = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;

      const touch = event.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        progress: progressRef.current,
      };
    };

    const touchMoveHandler = (event: TouchEvent) => {
      if (autoAdvancing || !touchStartRef.current || event.touches.length !== 1) return;

      event.preventDefault();

      const touch = event.touches[0];
      const deltaY = touchStartRef.current.y - touch.clientY;
      const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);

      if (deltaX > 24 && Math.abs(deltaY) < 12) {
        return;
      }

      const step = clamp(Math.abs(deltaY) / 1200, 0.008, 0.08);
      const direction = deltaY >= 0 ? 1 : -1;

      setProgress((prev) => {
        const next = clamp(touchStartRef.current!.progress + direction * step, 0, 1);
        if (next >= 0.3 && next < 1) {
          setAutoAdvancing(true);
          autoStartRef.current = { time: performance.now(), startProgress: next };
        }
        return next;
      });
    };

    const touchEndHandler = () => {
      touchStartRef.current = null;
    };

    window.addEventListener("wheel", wheelHandler, { passive: false });
    window.addEventListener("keydown", keyHandler);
    window.addEventListener("touchstart", touchStartHandler, { passive: true });
    window.addEventListener("touchmove", touchMoveHandler, { passive: false });
    window.addEventListener("touchend", touchEndHandler);
    window.addEventListener("touchcancel", touchEndHandler);

    return () => {
      window.removeEventListener("wheel", wheelHandler);
      window.removeEventListener("keydown", keyHandler);
      window.removeEventListener("touchstart", touchStartHandler);
      window.removeEventListener("touchmove", touchMoveHandler);
      window.removeEventListener("touchend", touchEndHandler);
      window.removeEventListener("touchcancel", touchEndHandler);
    };
  }, [autoAdvancing]);

  useEffect(() => {
    if (!autoAdvancing) return;

    const step = (now: number) => {
      if (!autoStartRef.current) return;
      const elapsed = now - autoStartRef.current.time;
      const t = clamp(elapsed / 3600, 0, 1);
      const eased = easingCubic(t);

      setProgress((prev) => {
        const next = clamp(autoStartRef.current!.startProgress + (1 - autoStartRef.current!.startProgress) * eased, 0, 1);
        return Math.abs(next - prev) < 0.0015 ? prev : next;
      });

      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setAutoAdvancing(false);
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [autoAdvancing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isMounted = true;

    const config = {
      minStroke: 1.1,
      maxStroke: 2.2,
      radius: 240,
      forceStrength: 14,
      friction: 0.9,
      restoreSpeed: 0.05
    };

    const regenDots = () => {
      if (!isMounted) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      const isLargeScreen = width * height > 1600 * 900;
      const spacing = isLargeScreen ? 18 : 14;
      const density = isLargeScreen ? 0.42 : 0.5;
      const maxDots = isLargeScreen ? 1800 : 2600;

      const points: DotPoint[] = [];

      for (let y = 0; y < height; y += spacing) {
        for (let x = 0; x < width; x += spacing) {
          if (Math.random() > density) continue;
          const jitter = spacing * 0.24;
          const px = x + (Math.random() * 2 - 1) * jitter;
          const py = y + (Math.random() * 2 - 1) * jitter;
          points.push({
            x: px,
            y: py,
            ox: px,
            oy: py,
            vx: 0,
            vy: 0,
            size: config.minStroke + Math.random() * (config.maxStroke - config.minStroke),
            shade: 36 + Math.random() * 56,
            phase: Math.random() * Math.PI * 2
          });

          if (points.length >= maxDots) break;
        }
        if (points.length >= maxDots) break;
      }

      dotsRef.current = points;
      mouseRef.current = {
        x: width * 0.5,
        y: height * 0.5,
        tx: width * 0.5,
        ty: height * 0.5
      };
    };

    const moveHandler = (event: MouseEvent) => {
      if (isMounted) {
        mouseRef.current.tx = event.clientX;
        mouseRef.current.ty = event.clientY;
      }
    };

    regenDots();
    window.addEventListener("resize", regenDots);
    window.addEventListener("mousemove", moveHandler, { passive: true });

    let loopId = 0;
    let lastFrameAt = 0;
    const targetFrameMs = 1000 / 30;
    const radiusSq = config.radius * config.radius;

    const render = (now: number) => {
      if (!isMounted) return;
      if (progressRef.current >= 0.68) {
        return;
      }
      
      if (now - lastFrameAt < targetFrameMs) {
        loopId = requestAnimationFrame(render);
        return;
      }
      lastFrameAt = now;

      frameRef.current += 1;

      const dots = dotsRef.current;
      const mouse = mouseRef.current;
      mouse.x += (mouse.tx - mouse.x) * 0.14;
      mouse.y += (mouse.ty - mouse.y) * 0.14;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const glowRadius = config.radius * 1.35;
      const glow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, glowRadius);
      glow.addColorStop(0, "rgba(255, 206, 96, 0.16)");
      glow.addColorStop(0.45, "rgba(255, 142, 66, 0.13)");
      glow.addColorStop(1, "rgba(255, 142, 66, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, glowRadius, 0, Math.PI * 2);
      ctx.fill();

      for (const dot of dots) {
        const dx = dot.x - mouse.x;
        const dy = dot.y - mouse.y;
        const distanceSq = dx * dx + dy * dy;

        if (distanceSq < radiusSq) {
          const distance = Math.sqrt(distanceSq);
          const inv = Math.max(1, distance);
          const scale = config.forceStrength / inv;
          dot.vx += (dx / inv) * scale;
          dot.vy += (dy / inv) * scale;
        }

        dot.vx *= config.friction;
        dot.vy *= config.friction;
        dot.vx += (dot.ox - dot.x) * config.restoreSpeed;
        dot.vy += (dot.oy - dot.y) * config.restoreSpeed;

        dot.x += dot.vx;
        dot.y += dot.vy;

        const distanceRatio = Math.min(1, Math.sqrt(distanceSq) / config.radius);
        const grow = distanceSq < radiusSq ? 1 + (1 - distanceRatio) * 1.55 : 1;
        const twinkle = 0.78 + 0.22 * Math.sin(frameRef.current * 0.035 + dot.phase);
        const alpha = (distanceSq < radiusSq ? 1 - distanceRatio * 0.36 : 0.54) * twinkle;

        const dotSize = dot.size * grow;
        ctx.fillStyle = `rgba(255, 186, 122, ${(alpha * (dot.shade / 90)).toFixed(3)})`;
        ctx.fillRect(dot.x - dotSize * 0.5, dot.y - dotSize * 0.5, dotSize, dotSize);
      }

      loopId = requestAnimationFrame(render);
    };

    loopId = requestAnimationFrame(render);

    return () => {
      isMounted = false;
      cancelAnimationFrame(loopId);
      window.removeEventListener("resize", regenDots);
      window.removeEventListener("mousemove", moveHandler);
    };
  }, []);

  if (hidden) {
    return null;
  }

  const introProgress = clamp(progress / 0.2, 0, 1);
  const curtainFade = progress >= 0.85 ? 0 : 1;
  const fieldFade = 1 - clamp((progress - 0.58) / 0.28, 0, 1);

  return (
    <div className="fixed inset-0 z-[60]" style={{ touchAction: "none" }}>
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: fieldFade,
          visibility: progress >= 0.92 ? "hidden" : "visible",
          background:
            "radial-gradient(circle at 20% 20%, rgba(14,20,34,0.38), transparent 38%), radial-gradient(circle at 80% 80%, rgba(18,24,38,0.24), transparent 42%), #050505"
        }}
      >
        <canvas ref={canvasRef} className="w-full h-full [filter:saturate(1)_contrast(1.24)_brightness(1.08)]" />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <mask id="portal-mask" maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox">
              <rect width="1" height="1" fill="white" />
              <g transform={`translate(0.5 0.5) scale(${maskScale}) translate(-0.5 -0.5)`}>
                <circle cx="0.5" cy="0.53" r="0.035" fill="black" />
              </g>
            </mask>
          </defs>

          <rect width="100%" height="100%" fill="#050505" fillOpacity="0.82" mask="url(#portal-mask)" style={{ opacity: curtainFade }} />
        </svg>
      </div>

      <div className="absolute inset-0 z-[63] pointer-events-none grid place-items-center">
        <div className="relative w-full grid place-items-center">
          <h1
            className="text-center uppercase font-black tracking-[-0.05em] leading-none px-3"
            style={{
              fontFamily: portalTitleFont,
              fontSize: "clamp(46px, 9.2vw, 162px)",
              backgroundImage: "linear-gradient(90deg, #fbbf24 0%, #f97316 55%, #fb7185 100%)",
              color: "transparent",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              textShadow: "0 0 18px rgba(249,115,22,0.22)",
              opacity: fullNameFade,
              transform: `translateY(${fullNameLift}px) scale(${fullNameScale})`,
              transition: "opacity 180ms linear"
            }}
          >
            PREM HANCHATE
          </h1>
          <h2
            className="absolute uppercase font-black tracking-[-0.05em] leading-none"
            style={{
              fontFamily: portalTitleFont,
              fontSize: "clamp(76px, 12vw, 230px)",
              backgroundImage: "linear-gradient(90deg, #fbbf24 0%, #f97316 55%, #fb7185 100%)",
              color: "transparent",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              textShadow: "0 0 24px rgba(251,113,133,0.25)",
              opacity: letterFade,
              transform: `scale(${letterScale})`
            }}
          >
            A
          </h2>
        </div>
      </div>

      <div
        className="pointer-events-none fixed left-0 right-0 bottom-14 z-[62] flex justify-center transition-all duration-500"
        style={{
          opacity: 1 - introProgress,
          transform: `translateY(${16 - 42 * introProgress}px)`,
          visibility: progress >= 0.2 ? "hidden" : "visible"
        }}
      >
        <div className="grid place-items-center">
          <div className="h-11 w-7 rounded-[20px] border border-white/70 grid justify-items-center pt-2 portal-bounce">
            <span className="h-2 w-[3px] rounded-full bg-white/90" />
          </div>
          <p className="mt-3 text-[10px] uppercase tracking-[0.4em] text-white/80" style={{ fontFamily: portalHintFont }}>
            Scroll to unveil
          </p>
        </div>
      </div>

      <div className="fixed left-0 right-0 bottom-0 z-[65] h-1 bg-white/[0.05]">
        <div className="h-full bg-white" style={{ width: `${(progress * 100).toFixed(2)}%` }} />
      </div>
    </div>
  );
}
