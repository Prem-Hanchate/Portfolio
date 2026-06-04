"use client";

import { useEffect, useRef, useState } from "react";
import { Mesh, Program, Renderer as OGLRenderer, Triangle } from "ogl";

export type RaysOrigin =
  | "top-center"
  | "top-left"
  | "top-right"
  | "right"
  | "left"
  | "bottom-center"
  | "bottom-right"
  | "bottom-left";

interface LightRaysProps {
  raysOrigin?: RaysOrigin;
  raysColor?: string;
  raysSpeed?: number;
  lightSpread?: number;
  rayLength?: number;
  pulsating?: boolean;
  fadeDistance?: number;
  saturation?: number;
  followMouse?: boolean;
  mouseInfluence?: number;
  noiseAmount?: number;
  distortion?: number;
  className?: string;
}

const DEFAULT_COLOR = "#ffffff";

const hexToRgb = (hex: string): [number, number, number] => {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return match
    ? [parseInt(match[1], 16) / 255, parseInt(match[2], 16) / 255, parseInt(match[3], 16) / 255]
    : [1, 1, 1];
};

const getAnchorAndDir = (
  origin: RaysOrigin,
  width: number,
  height: number
): { anchor: [number, number]; dir: [number, number] } => {
  const outside = 0.2;

  switch (origin) {
    case "top-left":
      return { anchor: [0, -outside * height], dir: [0.7, 0.7] };
    case "top-right":
      return { anchor: [width, -outside * height], dir: [-0.7, 0.7] };
    case "left":
      return { anchor: [-outside * width, 0.5 * height], dir: [1, 0] };
    case "right":
      return { anchor: [(1 + outside) * width, 0.5 * height], dir: [-1, 0] };
    case "bottom-left":
      return { anchor: [0, (1 + outside) * height], dir: [0.7, -0.7] };
    case "bottom-center":
      return { anchor: [0.5 * width, (1 + outside) * height], dir: [0, -1] };
    case "bottom-right":
      return { anchor: [width, (1 + outside) * height], dir: [-0.7, -0.7] };
    default:
      return { anchor: [0.5 * width, -outside * height], dir: [0, 1] };
  }
};

type Vec2 = [number, number];
type Vec3 = [number, number, number];

interface Uniforms {
  iTime: { value: number };
  iResolution: { value: Vec2 };
  rayPos: { value: Vec2 };
  rayDir: { value: Vec2 };
  raysColor: { value: Vec3 };
  raysSpeed: { value: number };
  lightSpread: { value: number };
  rayLength: { value: number };
  pulsating: { value: number };
  fadeDistance: { value: number };
  saturation: { value: number };
  mousePos: { value: Vec2 };
  mouseInfluence: { value: number };
  noiseAmount: { value: number };
  distortion: { value: number };
}

export default function LightRays({
  raysOrigin = "top-center",
  raysColor = DEFAULT_COLOR,
  raysSpeed = 1,
  lightSpread = 1,
  rayLength = 2,
  pulsating = false,
  fadeDistance = 1,
  saturation = 1,
  followMouse = true,
  mouseInfluence = 0.1,
  noiseAmount = 0.02,
  distortion = 0.05,
  className = "",
}: LightRaysProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniformsRef = useRef<Uniforms | null>(null);
  const rendererRef = useRef<OGLRenderer | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });
  const animationIdRef = useRef<number | null>(null);
  const meshRef = useRef<Mesh | null>(null);
  const cleanupFunctionRef = useRef<(() => void) | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    observerRef.current = new IntersectionObserver(
      entries => {
        setIsVisible(entries[0]?.isIntersecting ?? false);
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(containerRef.current);

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!isVisible || !containerRef.current) return;

    if (cleanupFunctionRef.current) {
      cleanupFunctionRef.current();
      cleanupFunctionRef.current = null;
    }

    let cancelled = false;

    const initializeWebGL = async () => {
      if (!containerRef.current) return;

      await new Promise(resolve => setTimeout(resolve, 10));
      if (cancelled || !containerRef.current) return;

      const renderer = new OGLRenderer({
        dpr: Math.min(window.devicePixelRatio, 2),
        alpha: true,
      });
      rendererRef.current = renderer;

      const gl = renderer.gl;
      gl.canvas.style.width = "100%";
      gl.canvas.style.height = "100%";
      gl.canvas.style.display = "block";

      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
      containerRef.current.appendChild(gl.canvas);

      const vertex = `
        attribute vec2 position;
        varying vec2 vUv;

        void main() {
          vUv = position * 0.5 + 0.5;
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `;

      const fragment = `
        precision highp float;

        uniform float iTime;
        uniform vec2 iResolution;
        uniform vec2 rayPos;
        uniform vec2 rayDir;
        uniform vec3 raysColor;
        uniform float raysSpeed;
        uniform float lightSpread;
        uniform float rayLength;
        uniform float pulsating;
        uniform float fadeDistance;
        uniform float saturation;
        uniform vec2 mousePos;
        uniform float mouseInfluence;
        uniform float noiseAmount;
        uniform float distortion;

        varying vec2 vUv;

        float noise(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }

        float rayStrength(
          vec2 raySource,
          vec2 rayRefDirection,
          vec2 coord,
          float seedA,
          float seedB,
          float speed
        ) {
          vec2 sourceToCoord = coord - raySource;
          vec2 dirNorm = normalize(sourceToCoord);
          float cosAngle = dot(dirNorm, rayRefDirection);

          float wave = distortion * sin(iTime * 1.5 + length(sourceToCoord) * 0.005);
          float distortedAngle = cosAngle + wave;

          float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));
          float distance = length(sourceToCoord);
          float maxDistance = max(iResolution.x, iResolution.y) * rayLength;
          float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);

          float fadeFactor = fadeDistance * max(iResolution.x, iResolution.y);
          float fadeFalloff = clamp((fadeFactor - distance) / fadeFactor, 0.0, 1.0);

          float pulse = pulsating > 0.5 ? (0.85 + 0.15 * sin(iTime * speed * 4.0)) : 1.0;

          float baseStrength = clamp(
            (0.5 + 0.2 * sin(distortedAngle * seedA + iTime * speed)) +
            (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed * 0.8)),
            0.0,
            1.0
          );

          return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
        }

        void main() {
          vec2 coord = gl_FragCoord.xy;

          vec2 finalRayDir = normalize(rayDir);
          if (mouseInfluence > 0.0) {
            vec2 mouseScreenPos = mousePos * iResolution.xy;
            vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
            finalRayDir = normalize(mix(finalRayDir, mouseDirection, mouseInfluence));
          }

          float r1 = rayStrength(rayPos, finalRayDir, coord, 45.2, 31.4, 0.8 * raysSpeed);
          float r2 = rayStrength(rayPos, finalRayDir, coord, 28.5, 19.8, 1.2 * raysSpeed);
          float r3 = rayStrength(rayPos, finalRayDir, coord, 12.1, 56.2, 0.5 * raysSpeed);

          float combined = (r1 * 0.4 + r2 * 0.4 + r3 * 0.2);
          combined = pow(combined, 0.7);
          combined *= 1.60;

          vec3 finalColor = raysColor * combined;

          if (noiseAmount > 0.0) {
            float n = noise(coord * 0.01 + iTime * 0.05);
            finalColor *= (1.0 - noiseAmount + noiseAmount * n);
          }

          if (saturation != 1.0) {
            float gray = dot(finalColor, vec3(0.299, 0.587, 0.114));
            finalColor = mix(vec3(gray), finalColor, saturation);
          }

          gl_FragColor = vec4(finalColor, combined);
        }
      `;

      const uniforms: Uniforms = {
        iTime: { value: 0 },
        iResolution: { value: [1, 1] },
        rayPos: { value: [0, 0] },
        rayDir: { value: [0, 1] },
        raysColor: { value: hexToRgb(raysColor) },
        raysSpeed: { value: raysSpeed },
        lightSpread: { value: lightSpread },
        rayLength: { value: rayLength },
        pulsating: { value: pulsating ? 1 : 0 },
        fadeDistance: { value: fadeDistance },
        saturation: { value: saturation },
        mousePos: { value: [0.5, 0.5] },
        mouseInfluence: { value: mouseInfluence },
        noiseAmount: { value: noiseAmount },
        distortion: { value: distortion },
      };

      uniformsRef.current = uniforms;

      const geometry = new Triangle(gl);
      const program = new Program(gl, {
        vertex,
        fragment,
        uniforms,
        transparent: true,
      });
      const mesh = new Mesh(gl, { geometry, program });
      meshRef.current = mesh;

      const updatePlacement = () => {
        if (!containerRef.current || !renderer) return;

        const { clientWidth, clientHeight } = containerRef.current;
        renderer.setSize(clientWidth, clientHeight);

        const dpr = renderer.dpr;
        const width = clientWidth * dpr;
        const height = clientHeight * dpr;

        uniforms.iResolution.value = [width, height];
        const { anchor, dir } = getAnchorAndDir(raysOrigin, width, height);
        uniforms.rayPos.value = anchor;
        uniforms.rayDir.value = dir;
      };

      const loop = (time: number) => {
        if (!rendererRef.current || !uniformsRef.current || !meshRef.current) return;

        uniforms.iTime.value = time * 0.001;

        if (followMouse && mouseInfluence > 0) {
          const smoothing = 0.95;
          smoothMouseRef.current.x = smoothMouseRef.current.x * smoothing + mouseRef.current.x * (1 - smoothing);
          smoothMouseRef.current.y = smoothMouseRef.current.y * smoothing + mouseRef.current.y * (1 - smoothing);
          uniforms.mousePos.value = [smoothMouseRef.current.x, 1 - smoothMouseRef.current.y];
        }

        renderer.render({ scene: mesh });
        animationIdRef.current = requestAnimationFrame(loop);
      };

      const handleResize = () => updatePlacement();
      window.addEventListener("resize", handleResize);
      updatePlacement();
      animationIdRef.current = requestAnimationFrame(loop);

      cleanupFunctionRef.current = () => {
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
          animationIdRef.current = null;
        }

        window.removeEventListener("resize", handleResize);

        if (renderer.gl.canvas.parentNode) {
          renderer.gl.canvas.parentNode.removeChild(renderer.gl.canvas);
        }
      };
    };

    initializeWebGL();

    return () => {
      cancelled = true;
      cleanupFunctionRef.current?.();
    };
  }, [fadeDistance, followMouse, isVisible, lightSpread, mouseInfluence, noiseAmount, pulsating, rayLength, raysColor, raysOrigin, raysSpeed, saturation, distortion]);

  useEffect(() => {
    if (!followMouse) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current = {
        x: (event.clientX - rect.left) / rect.width,
        y: (event.clientY - rect.top) / rect.height,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [followMouse]);

  return <div ref={containerRef} className={`absolute inset-0 h-full w-full overflow-hidden pointer-events-none ${className}`} aria-hidden="true" />;
}