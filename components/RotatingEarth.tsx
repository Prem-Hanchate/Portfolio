"use client";

import { useEffect, useRef } from "react";

interface RotatingEarthProps {
  fullPageBackground?: boolean;
  opacity?: number;
  large?: boolean;
}

export default function RotatingEarth({ fullPageBackground = false, opacity = 0.15, large = false }: RotatingEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const resizeCanvas = () => {
      if (fullPageBackground) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      } else {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }
    };

    const getRadius = () => {
      if (!fullPageBackground) {
        return large ? 290 : 260;
      }

      const viewportWidth = window.innerWidth;
      if (viewportWidth >= 1440) return 420;
      if (viewportWidth >= 1280) return 395;
      if (viewportWidth >= 1024) return 360;
      return 310;
    };

    resizeCanvas();
    const handleResize = () => resizeCanvas();
    window.addEventListener("resize", handleResize);

    const TAU = Math.PI * 2;
    let R = getRadius();
    const LAT = 10;
    const LON = 14;
    const DOTS = 55;

    const dots = Array.from({ length: DOTS }, () => {
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.random() * TAU;
      return { theta, phi, size: 1.2 + Math.random() * 2, phase: Math.random() * TAU };
    });

    const flashes: Array<{
      a: (typeof dots)[number];
      b: (typeof dots)[number];
      life: number;
      decay: number;
    }> = [];

    let rotationY = 0;
    let rotationX = 0;
    let wobbleTimer = 0;
    let wobbleCurrent = 0;
    let wobbleTarget = 0;
    let wobbleActive = false;
    let wobbleDuration = 0;
    let wobbleElapsed = 0;
    let nextWobble = 120 + Math.random() * 180;
    let frame = 0;
    let flashTimer = 0;

    const project = (theta: number, phi: number, cx: number, cy: number) => {
      const x0 = Math.sin(theta) * Math.cos(phi);
      const y0 = Math.cos(theta);
      const z0 = Math.sin(theta) * Math.sin(phi);

      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const x1 = x0 * cosY - z0 * sinY;
      const z1 = x0 * sinY + z0 * cosY;

      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);
      const y2 = y0 * cosX - z1 * sinX;
      const z2 = y0 * sinX + z1 * cosX;

      return {
        sx: cx + x1 * R,
        sy: cy + y2 * R,
        z: z2,
        visible: z2 > -0.05,
      };
    };

    const spawnFlash = () => {
      const a = dots[Math.floor(Math.random() * DOTS)];
      const b = dots[Math.floor(Math.random() * DOTS)];
      if (a === b) return;
      flashes.push({ a, b, life: 1.0, decay: 0.018 + Math.random() * 0.028 });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = opacity;

      const centerX = canvas.width / 2;
      const centerY = fullPageBackground ? canvas.height / 2 + 20 : canvas.height / 2;

      R = getRadius();
      const bg = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, R * 1.4);
      bg.addColorStop(0, "rgba(0,60,40,0.22)");
      bg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const step = TAU / 100;

      for (let i = 1; i < LAT; i++) {
        const theta = (Math.PI / LAT) * i;
        ctx.beginPath();
        let first = true;
        for (let phi = 0; phi <= TAU + step; phi += step) {
          const point = project(theta, phi, centerX, centerY);
          if (!point.visible) {
            first = true;
            continue;
          }
          if (first) {
            ctx.moveTo(point.sx, point.sy);
            first = false;
          } else {
            ctx.lineTo(point.sx, point.sy);
          }
        }
        ctx.strokeStyle = "rgba(0,220,130,0.32)";
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }

      for (let i = 0; i < LON; i++) {
        const phi = (TAU / LON) * i;
        ctx.beginPath();
        let first = true;
        for (let theta = 0; theta <= Math.PI + step; theta += step) {
          const point = project(theta, phi, centerX, centerY);
          if (!point.visible) {
            first = true;
            continue;
          }
          if (first) {
            ctx.moveTo(point.sx, point.sy);
            first = false;
          } else {
            ctx.lineTo(point.sx, point.sy);
          }
        }
        ctx.strokeStyle = "rgba(0,220,130,0.32)";
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }

      for (let i = flashes.length - 1; i >= 0; i--) {
        const flash = flashes[i];
        const pa = project(flash.a.theta, flash.a.phi, centerX, centerY);
        const pb = project(flash.b.theta, flash.b.phi, centerX, centerY);
        if (pa.visible && pb.visible) {
          const life = flash.life;
          ctx.beginPath();
          ctx.moveTo(pa.sx, pa.sy);
          ctx.lineTo(pb.sx, pb.sy);
          ctx.strokeStyle = `rgba(255,220,0,${life * 0.9})`;
          ctx.lineWidth = 1.4;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(pa.sx, pa.sy, 3.5, 0, TAU);
          ctx.fillStyle = `rgba(255,235,0,${life})`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(pb.sx, pb.sy, 3.5, 0, TAU);
          ctx.fillStyle = `rgba(255,235,0,${life})`;
          ctx.fill();
        }
        flash.life -= flash.decay;
        if (flash.life <= 0) flashes.splice(i, 1);
      }

      dots.forEach((dot) => {
        const point = project(dot.theta, dot.phi, centerX, centerY);
        if (!point.visible) return;

        const bright = 0.4 + 0.6 * ((point.z + 1) / 2);
        const pulse = 0.7 + 0.3 * Math.sin(frame * 0.03 + dot.phase);

        const dotGlow = ctx.createRadialGradient(point.sx, point.sy, 0, point.sx, point.sy, dot.size * 3.5);
        dotGlow.addColorStop(0, `rgba(255,190,0,${bright * pulse * 0.7})`);
        dotGlow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.arc(point.sx, point.sy, dot.size * 3.5, 0, TAU);
        ctx.fillStyle = dotGlow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(point.sx, point.sy, dot.size, 0, TAU);
        ctx.fillStyle = `rgba(255,210,60,${bright * pulse})`;
        ctx.fill();
      });

      wobbleTimer++;
      if (!wobbleActive && wobbleTimer >= nextWobble) {
        wobbleActive = true;
        wobbleTimer = 0;
        wobbleDuration = 20 + Math.random() * 30;
        wobbleElapsed = 0;
        wobbleTarget = (Math.random() > 0.5 ? 1 : -1) * (0.002 + Math.random() * 0.004);
        nextWobble = 120 + Math.random() * 220;
      }

      if (wobbleActive) {
        wobbleCurrent += (wobbleTarget - wobbleCurrent) * 0.12;
        rotationX += wobbleCurrent;
        wobbleElapsed++;
        if (wobbleElapsed > wobbleDuration) {
          wobbleCurrent += (0 - wobbleCurrent) * 0.1;
          if (Math.abs(wobbleCurrent) < 0.00008) {
            wobbleActive = false;
            wobbleCurrent = 0;
          }
        }
      } else {
        rotationX *= 0.97;
      }

      rotationY += 0.0018;

      flashTimer++;
      if (flashTimer >= 35 + Math.floor(Math.random() * 50)) {
        spawnFlash();
        flashTimer = 0;
      }

      frame++;

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [fullPageBackground, opacity, large]);

  if (fullPageBackground) {
    return (
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0, opacity }}
      />
    );
  }

  return (
    <div className={`relative w-full ${large ? "aspect-square max-h-[28rem]" : "h-80 md:h-96"} flex items-center justify-center`}>
      <canvas
        ref={canvasRef}
        className={`w-full h-full ${large ? "[filter:drop-shadow(0_0_52px_rgba(0,220,130,0.32))]" : "[filter:drop-shadow(0_0_40px_rgba(0,220,130,0.22))]"}`}
        style={{ opacity }}
      />
    </div>
  );
}
