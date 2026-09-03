import { Renderer, Program, Mesh, Triangle } from "ogl";
import {
  grainientVertexShader,
  grainientFragmentShader,
  hexToRgb,
} from "./grainientShader";
import type { GrainientControl, GrainientUniforms } from "./grainientTypes";

interface GrainientScene {
  program: Program;
  cleanup: () => void;
  setSize: () => void;
  startLoop: () => void;
  stopLoop: () => void;
}

function buildProgramUniforms(uniforms: GrainientUniforms) {
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

export function mountGrainientScene(
  container: HTMLDivElement,
  uniforms: GrainientUniforms,
  shouldReduceMotion: boolean,
): GrainientScene {
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
  container.appendChild(canvas);

  const geometry = new Triangle(gl);
  const program = new Program(gl, {
    vertex: grainientVertexShader,
    fragment: grainientFragmentShader,
    uniforms: buildProgramUniforms(uniforms),
  });

  const mesh = new Mesh(gl, { geometry, program });

  const setSize = () => {
    const width = Math.max(1, Math.floor(container.clientWidth));
    const height = Math.max(1, Math.floor(container.clientHeight));
    renderer.setSize(width, height);
    const res = (program.uniforms.iResolution as { value: Float32Array }).value;
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

  (
    container as HTMLDivElement & { grainientControl?: GrainientControl }
  ).grainientControl = { startLoop, stopLoop, resize: setSize };

  const cleanup = () => {
    stopLoop();
    ro.disconnect();
    window.removeEventListener("scroll", scheduleResize);
    window.removeEventListener("resize", scheduleResize);
    if (scrollRaf !== null) {
      cancelAnimationFrame(scrollRaf);
    }
    try {
      container.removeChild(canvas);
    } catch {
      // Ignore
    }
  };

  return { program, cleanup, setSize, startLoop, stopLoop };
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
