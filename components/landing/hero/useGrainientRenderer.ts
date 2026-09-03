"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import {
  grainientVertexShader,
  grainientFragmentShader,
  hexToRgb,
} from "./grainientShader";

export interface GrainientUniforms {
  timeSpeed: number;
  colorBalance: number;
  warpStrength: number;
  warpFrequency: number;
  warpSpeed: number;
  warpAmplitude: number;
  blendAngle: number;
  blendSoftness: number;
  rotationAmount: number;
  noiseScale: number;
  grainAmount: number;
  grainScale: number;
  grainAnimated: boolean;
  contrast: number;
  gamma: number;
  saturation: number;
  centerX: number;
  centerY: number;
  zoom: number;
  color1: string;
  color2: string;
  color3: string;
}

export interface GrainientControl {
  startLoop: () => void;
  stopLoop: () => void;
  resize: () => void;
}

export function useGrainientRenderer(
  containerRef: React.RefObject<HTMLDivElement | null>,
  uniforms: GrainientUniforms,
) {
  const rafRef = useRef<number | null>(null);
  const isRunningRef = useRef(false);
  const programRef = useRef<Program | null>(null);
  const prefersReducedMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches,
  );

  const { color1, color2, color3 } = uniforms;

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
        uTimeSpeed: { value: uniforms.timeSpeed },
        uColorBalance: { value: uniforms.colorBalance },
        uWarpStrength: { value: uniforms.warpStrength },
        uWarpFrequency: { value: uniforms.warpFrequency },
        uWarpSpeed: { value: uniforms.warpSpeed },
        uWarpAmplitude: { value: uniforms.warpAmplitude },
        uBlendAngle: { value: uniforms.blendAngle },
        uBlendSoftness: { value: uniforms.blendSoftness },
        uRotationAmount: { value: uniforms.rotationAmount },
        uNoiseScale: { value: uniforms.noiseScale },
        uGrainAmount: { value: uniforms.grainAmount },
        uGrainScale: { value: uniforms.grainScale },
        uGrainAnimated: { value: uniforms.grainAnimated ? 1.0 : 0.0 },
        uContrast: { value: uniforms.contrast },
        uGamma: { value: uniforms.gamma },
        uSaturation: { value: uniforms.saturation },
        uCenterOffset: {
          value: new Float32Array([uniforms.centerX, uniforms.centerY]),
        },
        uZoom: { value: uniforms.zoom },
        uColor1: { value: new Float32Array(hexToRgb(uniforms.color1)) },
        uColor2: { value: new Float32Array(hexToRgb(uniforms.color2)) },
        uColor3: { value: new Float32Array(hexToRgb(uniforms.color3)) },
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
          grainientControl?: GrainientControl;
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
    containerRef,
    uniforms.timeSpeed,
    uniforms.colorBalance,
    uniforms.warpStrength,
    uniforms.warpFrequency,
    uniforms.warpSpeed,
    uniforms.warpAmplitude,
    uniforms.blendAngle,
    uniforms.blendSoftness,
    uniforms.rotationAmount,
    uniforms.noiseScale,
    uniforms.grainAmount,
    uniforms.grainScale,
    uniforms.grainAnimated,
    uniforms.contrast,
    uniforms.gamma,
    uniforms.saturation,
    uniforms.centerX,
    uniforms.centerY,
    uniforms.zoom,
  ]);
}
