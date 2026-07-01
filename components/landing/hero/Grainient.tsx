"use client";

import React, { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import {
  grainientVertexShader,
  grainientFragmentShader,
  hexToRgb,
} from "./grainientShader";

interface GrainientProps {
  timeSpeed?: number;
  colorBalance?: number;
  warpStrength?: number;
  warpFrequency?: number;
  warpSpeed?: number;
  warpAmplitude?: number;
  blendAngle?: number;
  blendSoftness?: number;
  rotationAmount?: number;
  noiseScale?: number;
  grainAmount?: number;
  grainScale?: number;
  grainAnimated?: boolean;
  contrast?: number;
  gamma?: number;
  saturation?: number;
  centerX?: number;
  centerY?: number;
  zoom?: number;
  color1?: string;
  color2?: string;
  color3?: string;
  className?: string;
}

const Grainient: React.FC<GrainientProps> = ({
  timeSpeed = 0.25,
  colorBalance = 0.0,
  warpStrength = 1.0,
  warpFrequency = 5.0,
  warpSpeed = 2.0,
  warpAmplitude = 50.0,
  blendAngle = 0.0,
  blendSoftness = 0.05,
  rotationAmount = 500.0,
  noiseScale = 2.0,
  grainAmount = 0.1,
  grainScale = 2.0,
  grainAnimated = false,
  contrast = 1.5,
  gamma = 1.0,
  saturation = 1.0,
  centerX = 0.0,
  centerY = 0.0,
  zoom = 0.9,
  color1 = "#B0B0B0",
  color2 = "#707070",
  color3 = "#909090",
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const isRunningRef = useRef(false);
  const programRef = useRef<Program | null>(null);
  const prefersReducedMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches,
  );

  useEffect(() => {
    const program = programRef.current;
    if (!program) return;

    (program.uniforms.uColor1 as { value: Float32Array }).value =
      new Float32Array(hexToRgb(color1));
    (program.uniforms.uColor2 as { value: Float32Array }).value =
      new Float32Array(hexToRgb(color2));
    (program.uniforms.uColor3 as { value: Float32Array }).value =
      new Float32Array(hexToRgb(color3));
  }, [color1, color2, color3]);

  useEffect(() => {
    if (!containerRef.current) return;

    const shouldReduceMotion = prefersReducedMotion.current;
    const isMobile = window.innerWidth < 768;

    const renderer = new Renderer({
      webgl: 2,
      alpha: true,
      antialias: false,
      dpr: shouldReduceMotion
        ? 1
        : isMobile
          ? 1
          : Math.min(window.devicePixelRatio || 1, 1.5),
    });

    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";

    const container = containerRef.current;
    container.appendChild(canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: grainientVertexShader,
      fragment: grainientFragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uTimeSpeed: { value: timeSpeed },
        uColorBalance: { value: colorBalance },
        uWarpStrength: { value: warpStrength },
        uWarpFrequency: { value: warpFrequency },
        uWarpSpeed: { value: warpSpeed },
        uWarpAmplitude: { value: warpAmplitude },
        uBlendAngle: { value: blendAngle },
        uBlendSoftness: { value: blendSoftness },
        uRotationAmount: { value: rotationAmount },
        uNoiseScale: { value: noiseScale },
        uGrainAmount: { value: grainAmount },
        uGrainScale: { value: grainScale },
        uGrainAnimated: { value: grainAnimated ? 1.0 : 0.0 },
        uContrast: { value: contrast },
        uGamma: { value: gamma },
        uSaturation: { value: saturation },
        uCenterOffset: { value: new Float32Array([centerX, centerY]) },
        uZoom: { value: zoom },
        uColor1: { value: new Float32Array(hexToRgb(color1)) },
        uColor2: { value: new Float32Array(hexToRgb(color2)) },
        uColor3: { value: new Float32Array(hexToRgb(color3)) },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    programRef.current = program;

    const setSize = () => {
      const width = Math.max(1, Math.floor(container.clientWidth));
      const height = Math.max(1, Math.floor(container.clientHeight));
      renderer.setSize(width, height);
      const res = (program.uniforms.iResolution as { value: Float32Array })
        .value;
      res[0] = gl.drawingBufferWidth;
      res[1] = gl.drawingBufferHeight;
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(container);
    setSize();

    let scrollRaf: number | null = null;
    const scheduleResize = () => {
      if (scrollRaf !== null) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = null;
        setSize();
      });
    };
    window.addEventListener("scroll", scheduleResize, { passive: true });
    window.addEventListener("resize", scheduleResize);

    const t0 = performance.now();
    const loop = (t: number) => {
      if (!isRunningRef.current) {
        rafRef.current = null;
        return;
      }
      (program.uniforms.iTime as { value: number }).value = (t - t0) * 0.001;
      renderer.render({ scene: mesh });
      rafRef.current = requestAnimationFrame(loop);
    };

    const startLoop = () => {
      if (!isRunningRef.current) {
        isRunningRef.current = true;
        rafRef.current = requestAnimationFrame(loop);
      }
    };

    const stopLoop = () => {
      isRunningRef.current = false;
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    if (!shouldReduceMotion) {
      startLoop();
    }

    if (containerRef.current) {
      (
        containerRef.current as HTMLDivElement & {
          grainientControl?: {
            startLoop: () => void;
            stopLoop: () => void;
            resize: () => void;
          };
        }
      ).grainientControl = { startLoop, stopLoop, resize: setSize };
    }

    return () => {
      stopLoop();
      ro.disconnect();
      window.removeEventListener("scroll", scheduleResize);
      window.removeEventListener("resize", scheduleResize);
      if (scrollRaf !== null) {
        cancelAnimationFrame(scrollRaf);
      }
      programRef.current = null;
      try {
        container.removeChild(canvas);
      } catch {
        // Ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- colors updated in separate effect
  }, [
    timeSpeed,
    colorBalance,
    warpStrength,
    warpFrequency,
    warpSpeed,
    warpAmplitude,
    blendAngle,
    blendSoftness,
    rotationAmount,
    noiseScale,
    grainAmount,
    grainScale,
    grainAnimated,
    contrast,
    gamma,
    saturation,
    centerX,
    centerY,
    zoom,
  ]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden grainient-container ${className}`.trim()}
    />
  );
};

export default Grainient;
