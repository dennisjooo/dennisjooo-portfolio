import { Renderer, Program, Mesh, Triangle } from "ogl";
import {
  grainientVertexShader,
  grainientFragmentShader,
} from "./grainientShader";
import type { GrainientControl, GrainientUniforms } from "./grainientTypes";
import {
  buildProgramUniforms,
  createGrainientAnimationLoop,
} from "./grainientUniforms";

export { updateGrainientColors } from "./grainientUniforms";

interface GrainientScene {
  program: Program;
  cleanup: () => void;
  setSize: () => void;
  startLoop: () => void;
  stopLoop: () => void;
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

  const { startLoop, stopLoop } = createGrainientAnimationLoop(
    renderer,
    mesh,
    program,
    shouldReduceMotion,
  );

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
