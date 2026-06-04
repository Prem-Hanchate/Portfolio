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
    let rotation = 0;

    const resizeCanvas = () => {
      if (fullPageBackground) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      } else {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }
    };

    resizeCanvas();
    const handleResize = () => resizeCanvas();
    window.addEventListener("resize", handleResize);

    // Simplified continent coordinates (lat/lng paths)
    const continents = [
      // North America
      { points: [[50, -120], [45, -100], [40, -90], [35, -95], [30, -97], [25, -80], [40, -75], [50, -120]] },
      // South America
      { points: [[12, -60], [0, -70], [-15, -75], [-30, -65], [-20, -50], [12, -60]] },
      // Europe
      { points: [[55, 0], [50, 10], [45, 15], [40, 5], [43, 0], [55, 0]] },
      // Africa
      { points: [[37, 10], [20, 30], [10, 40], [0, 35], [-10, 30], [-20, 20], [-30, 25], [-25, 35], [10, 45], [30, 50], [37, 30], [37, 10]] },
      // Asia
      { points: [[60, 60], [50, 80], [40, 100], [30, 110], [25, 95], [35, 70], [45, 60], [60, 60]] },
      // Australia
      { points: [[-10, 130], [-20, 145], [-35, 150], [-40, 140], [-25, 120], [-10, 130]] },
      // Greenland
      { points: [[80, -60], [75, -40], [70, -50], [80, -60]] },
    ];

    const generateConnectivityPoints = () => {
      const points: Array<{ lat: number; lng: number }> = [];
      
      // Add random connectivity points around the globe
      for (let i = 0; i < 52; i++) {
        points.push({
          lat: Math.random() * 180 - 90,
          lng: Math.random() * 360 - 180
        });
      }
      
      return points;
    };

    const connectivityPoints = generateConnectivityPoints();

    const latLngToXY = (
      lat: number,
      lng: number,
      centerX: number,
      centerY: number,
      radius: number,
      rotationOffset: number
    ) => {
      const adjustedLng = lng + rotationOffset;
      const phi = ((90 - lat) * Math.PI) / 180;
      const theta = ((adjustedLng + 180) * Math.PI) / 180;

      const x = centerX + radius * Math.sin(phi) * Math.cos(theta);
      const y = centerY + radius * Math.cos(phi);

      return { x, y, phi, theta };
    };

    const isPointVisible = (phi: number, theta: number) => {
      // Only draw points on the front side of the globe
      return Math.cos(phi) * Math.cos(theta) > 0;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = opacity;
      rotation += 0.3;

      const centerX = canvas.width / 2;
      const centerY = fullPageBackground ? canvas.height * 0.5 : canvas.height / 2;
      const radius = fullPageBackground 
        ? Math.min(canvas.width, canvas.height) * 0.50
        : Math.min(canvas.width, canvas.height) * (large ? 0.35 : 0.34);

      // Draw globe base circle with glow
      const glowGradient = ctx.createRadialGradient(centerX, centerY, radius * 0.8, centerX, centerY, radius * 1.2);
      glowGradient.addColorStop(0, "rgba(200, 180, 100, 0.1)");
      glowGradient.addColorStop(1, "rgba(200, 180, 100, 0)");
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Draw continents
      continents.forEach((continent) => {
        ctx.fillStyle = fullPageBackground ? "rgba(150, 150, 150, 0.82)" : "rgba(165, 165, 165, 0.78)";
        ctx.strokeStyle = fullPageBackground ? "rgba(190, 190, 190, 0.6)" : "rgba(200, 200, 200, 0.62)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();

        let isFirst = true;
        continent.points.forEach((point) => {
          const { x, y, phi, theta } = latLngToXY(point[0], point[1], centerX, centerY, radius, rotation);
          
          if (isPointVisible(phi, theta)) {
            if (isFirst) {
              ctx.moveTo(x, y);
              isFirst = false;
            } else {
              ctx.lineTo(x, y);
            }
          }
        });

        try {
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } catch (e) {
          // Handle path errors silently
        }
      });

      // Draw connectivity lines between random points
      connectivityPoints.forEach((point, idx) => {
        const { x, y, phi, theta } = latLngToXY(point.lat, point.lng, centerX, centerY, radius * 1.15, rotation);
        
        if (isPointVisible(phi, theta)) {
          // Connect to nearby points
          connectivityPoints.slice(idx + 1).forEach((otherPoint) => {
            const latDiff = Math.abs(point.lat - otherPoint.lat);
            const lngDiff = Math.abs(point.lng - otherPoint.lng);
            const distance = Math.hypot(latDiff, lngDiff);

            if (distance < 25) {
              const { x: otherX, y: otherY, phi: otherPhi, theta: otherTheta } = latLngToXY(
                otherPoint.lat,
                otherPoint.lng,
                centerX,
                centerY,
                radius * 1.15,
                rotation
              );

              if (isPointVisible(otherPhi, otherTheta)) {
                const alpha = Math.max(0, 1 - distance / 25) * 0.3;
                const boostedAlpha = fullPageBackground ? Math.min(1, alpha * 1.9) : alpha;
                ctx.strokeStyle = `rgba(255, 180, 100, ${boostedAlpha})`;
                ctx.lineWidth = 0.6;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(otherX, otherY);
                ctx.stroke();
              }
            }
          });
        }
      });

      // Draw connectivity dots
      connectivityPoints.forEach((point) => {
        const { x, y, phi, theta } = latLngToXY(point.lat, point.lng, centerX, centerY, radius * 1.15, rotation);
        
        if (isPointVisible(phi, theta)) {
          // Outer glow
          const dotGradient = ctx.createRadialGradient(x, y, 0, x, y, fullPageBackground ? 11 : 8);
          dotGradient.addColorStop(0, fullPageBackground ? "rgba(255, 170, 38, 0.78)" : "rgba(255, 190, 72, 0.5)");
          dotGradient.addColorStop(1, "rgba(255, 180, 100, 0)");
          ctx.fillStyle = dotGradient;
          ctx.beginPath();
          ctx.arc(x, y, fullPageBackground ? 11 : 8, 0, Math.PI * 2);
          ctx.fill();

          // Core dot
          ctx.fillStyle = fullPageBackground ? "rgba(255, 166, 24, 1)" : "rgba(255, 186, 52, 0.9)";
          ctx.beginPath();
          ctx.arc(x, y, fullPageBackground ? 4.2 : 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw outer rings
      const ringScales = [1, 1.1, 1.2, 1.3, 1.4, 1.5];
      const ringAlphaFull = [0.84, 0.72, 0.62, 0.52, 0.42, 0.34];
      const ringAlphaNormal = [0.56, 0.49, 0.42, 0.36, 0.31, 0.27];
      const ringWidthsFull = [2.2, 1.9, 1.7, 1.5, 1.35, 1.2];
      const ringWidthsNormal = [1.5, 1.4, 1.3, 1.2, 1.1, 1];

      ringScales.forEach((scale, index) => {
        const alpha = fullPageBackground ? ringAlphaFull[index] : ringAlphaNormal[index];
        const width = fullPageBackground ? ringWidthsFull[index] : ringWidthsNormal[index];
        const red = fullPageBackground ? 255 : 255;
        const green = fullPageBackground ? 186 - index * 6 : 206 - index * 4;
        const blue = fullPageBackground ? 52 - index * 2 : 96;

        ctx.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * scale, 0, Math.PI * 2);
        ctx.stroke();
      });

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
        style={{ zIndex: 0 }}
      />
    );
  }

  return (
    <div className={`relative w-full ${large ? "aspect-square max-h-[28rem]" : "h-80 md:h-96"} flex items-center justify-center`}>
      <canvas
        ref={canvasRef}
        className={`w-full h-full ${large ? "[filter:drop-shadow(0_0_52px_rgba(255,186,52,0.42))]" : "[filter:drop-shadow(0_0_40px_rgba(255,206,96,0.25))]"}`}
      />
    </div>
  );
}
