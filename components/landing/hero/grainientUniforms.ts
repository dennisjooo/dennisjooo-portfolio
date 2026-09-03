import type { Program, Renderer, Mesh } from "ogl";
import { hexToRgb } from "./grainientShader";
import type { GrainientUniforms } from "./grainientTypes";

export function buildProgramUniforms(uniforms: GrainientUniforms) {
  return {
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
  };
}

export function updateGrainientColors(
  program: Program,
  color1: string,
  color2: string,
  color3: string,
) {
  (program.uniforms.uColor1 as { value: Float32Array }).value =
    new Float32Array(hexToRgb(color1));
  (program.uniforms.uColor2 as { value: Float32Array }).value =
    new Float32Array(hexToRgb(color2));
  (program.uniforms.uColor3 as { value: Float32Array }).value =
    new Float32Array(hexToRgb(color3));
}

interface GrainientAnimationLoop {
  startLoop: () => void;
  stopLoop: () => void;
}

export function createGrainientAnimationLoop(
  renderer: Renderer,
  mesh: Mesh,
  program: Program,
  shouldReduceMotion: boolean,
): GrainientAnimationLoop {
  let rafRef: number | null = null;
  let isRunning = false;
  const t0 = performance.now();

  const loop = (t: number) => {
    if (!isRunning) {
      rafRef = null;
      return;
    }
    (program.uniforms.iTime as { value: number }).value = (t - t0) * 0.001;
    renderer.render({ scene: mesh });
    rafRef = requestAnimationFrame(loop);
  };

  const startLoop = () => {
    if (!isRunning) {
      isRunning = true;
      rafRef = requestAnimationFrame(loop);
    }
  };

  const stopLoop = () => {
    isRunning = false;
    if (rafRef !== null) {
      cancelAnimationFrame(rafRef);
      rafRef = null;
    }
  };

  if (!shouldReduceMotion) {
    startLoop();
  }

  return { startLoop, stopLoop };
}
