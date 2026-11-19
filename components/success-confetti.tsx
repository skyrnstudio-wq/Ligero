"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  tiltAngle: number;
  tiltSpeed: number;
  swayPhase: number;
  swaySpeed: number;
  shape: "ribbon" | "diamond" | "dot";
  opacity: number;
  gravity: number;
  drag: number;
}

const CONFETTI_COLORS = [
  "#15803d", // botanical emerald
  "#16a34a", // vibrant leaf green
  "#22c55e", // crisp spring green
  "#4ade80", // luminous mint
  "#86efac", // soft celadon
  "#d4af37", // atelier gold
  "#e6c76e", // champagne brass
  "#f4f9f5", // silk ivory
];

const MAX_DURATION_MS = 4400;
const FADE_START_MS = 3100;

export default function SuccessConfetti({ triggerKey = 0 }: { triggerKey?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = [];
    const shapes: Particle["shape"][] = ["ribbon", "ribbon", "diamond", "dot"];

    const spawnBurst = (
      originX: number,
      originY: number,
      angleDeg: number,
      spreadDeg: number,
      count: number,
      speedMin: number,
      speedMax: number
    ) => {
      for (let i = 0; i < count; i++) {
        const angle =
          ((angleDeg + (Math.random() - 0.5) * spreadDeg) * Math.PI) / 180;
        const speed = speedMin + Math.random() * (speedMax - speedMin);
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const baseSize = shape === "dot" ? 4 + Math.random() * 3.5 : 6 + Math.random() * 5.5;

        particles.push({
          x: originX + (Math.random() - 0.5) * 18,
          y: originY + (Math.random() - 0.5) * 14,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          width: baseSize,
          height: shape === "ribbon" ? baseSize * (1.7 + Math.random() * 0.9) : baseSize,
          color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.22,
          tiltAngle: Math.random() * Math.PI * 2,
          tiltSpeed: 0.08 + Math.random() * 0.14,
          swayPhase: Math.random() * Math.PI * 2,
          swaySpeed: 0.04 + Math.random() * 0.05,
          shape,
          opacity: 1,
          gravity: 0.22 + Math.random() * 0.1,
          drag: 0.982 + Math.random() * 0.01,
        });
      }
    };

    const isCompact = width < 640;
    const sideCount = isCompact ? 34 : 52;
    const crownCount = isCompact ? 26 : 40;

    // Wave 1: twin side celebratory cannons + center crown burst
    const launchWaveOne = () => {
      spawnBurst(width * 0.08, height * 0.42, -58, 44, sideCount, 9, 17);
      spawnBurst(width * 0.92, height * 0.42, -122, 44, sideCount, 9, 17);
      spawnBurst(width * 0.5, height * 0.24, -90, 120, crownCount, 5, 12);
    };

    // Wave 2: soft cascading top-shower shimmer
    const waveTwoTimeout = window.setTimeout(() => {
      if (motionQuery.matches) return;
      spawnBurst(width * 0.28, height * 0.12, 85, 60, isCompact ? 16 : 24, 2.5, 6.5);
      spawnBurst(width * 0.72, height * 0.12, 95, 60, isCompact ? 16 : 24, 2.5, 6.5);
    }, 380);

    launchWaveOne();

    let rafId = 0;
    let startTime = performance.now();
    let lastTime = startTime;

    const render = (now: number) => {
      const elapsed = now - startTime;
      const dt = Math.min((now - lastTime) / 16.667, 2.2);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      const globalFade =
        elapsed > FADE_START_MS
          ? Math.max(0, 1 - (elapsed - FADE_START_MS) / (MAX_DURATION_MS - FADE_START_MS))
          : 1;

      let activeCount = 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.vx *= Math.pow(p.drag, dt);
        p.vy = p.vy * Math.pow(p.drag, dt) + p.gravity * dt;
        p.swayPhase += p.swaySpeed * dt;
        p.x += (p.vx + Math.sin(p.swayPhase) * 0.7) * dt;
        p.y += p.vy * dt;
        p.rotation += p.rotationSpeed * dt;
        p.tiltAngle += p.tiltSpeed * dt;

        const alpha = p.opacity * globalFade;
        if (alpha <= 0.01 || p.y > height + 40) continue;

        activeCount++;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        // 3D paper-flutter tumble
        ctx.scale(1, Math.max(0.22, Math.abs(Math.cos(p.tiltAngle))));
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;

        if (p.shape === "dot") {
          ctx.beginPath();
          ctx.arc(0, 0, p.width * 0.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "diamond") {
          ctx.beginPath();
          ctx.moveTo(0, -p.height * 0.6);
          ctx.lineTo(p.width * 0.55, 0);
          ctx.lineTo(0, p.height * 0.6);
          ctx.lineTo(-p.width * 0.55, 0);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
        }

        ctx.restore();
      }

      if (elapsed < MAX_DURATION_MS && activeCount > 0 && !motionQuery.matches) {
        rafId = window.requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    rafId = window.requestAnimationFrame(render);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        window.cancelAnimationFrame(rafId);
        ctx.clearRect(0, 0, width, height);
      }
    };

    motionQuery.addEventListener("change", handleMotionChange);

    return () => {
      window.clearTimeout(waveTwoTimeout);
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      motionQuery.removeEventListener("change", handleMotionChange);
      ctx.clearRect(0, 0, width, height);
    };
  }, [triggerKey]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="no-print pointer-events-none fixed inset-0 z-40 h-full w-full"
    />
  );
}
