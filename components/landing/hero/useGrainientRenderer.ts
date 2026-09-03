"use client";

import { useEffect, useRef } from "react";
import type { Program } from "ogl";
import { mountGrainientScene, updateGrainientColors } from "./grainientScene";

export type { GrainientControl, GrainientUniforms } from "./grainientTypes";

export function useGrainientRenderer(
  containerRef: React.RefObject<HTMLDivElement | null>,
  uniforms: GrainientUniforms,
) {
  const programRef = useRef<Program | null>(null);
  const prefersReducedMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches,
  );

  const { color1, color2, color3 } = uniforms;

  useEffect(() => {
    const program = programRef.current;
    if (!program) return;
    updateGrainientColors(program, color1, color2, color3);
  }, [color1, color2, color3]);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = mountGrainientScene(
      containerRef.current,
      uniforms,
      prefersReducedMotion.current,
    );
    programRef.current = scene.program;

    return () => {
      scene.cleanup();
      programRef.current = null;
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
