import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';
import { useEffect, useRef, useMemo } from 'react';

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uColor;
uniform vec3 uResolution;
uniform vec2 uMouse;
uniform float uAmplitude;
uniform float uSpeed;

varying vec2 vUv;

void main() {
  float mr = min(uResolution.x, uResolution.y);
  vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;

  uv += (uMouse - vec2(0.5)) * uAmplitude;

  float d = -uTime * 0.5 * uSpeed;
  float a = 0.0;
  for (float i = 0.0; i < 8.0; ++i) {
    a += cos(i - d - a * uv.x);
    d += sin(uv.y * i + a);
  }
  d += uTime * 0.5 * uSpeed;
  vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
  col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5) * uColor;
  gl_FragColor = vec4(col, 1.0);
}
`;

interface IridescenceProps {
  color?: [number, number, number];
  speed?: number;
  amplitude?: number;
  mouseReact?: boolean;
  onReady?: () => void;
  showFallbackGradient?: boolean;
}

export default function Iridescence({
  color = [1, 1, 1],
  speed = 1.0,
  amplitude = 0.1,
  mouseReact = true,
  onReady,
  showFallbackGradient = true,
  ...rest
}: IridescenceProps) {
  const ctnDom = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });

  // Convert normalized RGB (0-1) to 0-255 range and create gradient colors
  const gradientStyle = useMemo(() => {
    const r = Math.round(color[0] * 255);
    const g = Math.round(color[1] * 255);
    const b = Math.round(color[2] * 255);

    // Create gradient stops: start (shifted towards indigo), middle (main color), end (shifted towards blue)
    const startR = Math.round(Math.min(255, r * 0.6 + 99 * 0.4));
    const startG = Math.round(Math.min(255, g * 0.6 + 102 * 0.4));
    const startB = Math.round(Math.min(255, b * 0.6 + 241 * 0.4));

    const endR = Math.round(Math.min(255, r * 0.6 + 59 * 0.4));
    const endG = Math.round(Math.min(255, g * 0.6 + 130 * 0.4));
    const endB = Math.round(Math.min(255, b * 0.6 + 246 * 0.4));

    return {
      background: `linear-gradient(135deg, rgba(${startR}, ${startG}, ${startB}, 0.3) 0%, rgba(${r}, ${g}, ${b}, 0.4) 50%, rgba(${endR}, ${endG}, ${endB}, 0.3) 100%)`
    };
  }, [color]);

  useEffect(() => {
    if (!ctnDom.current) return;
    const ctn = ctnDom.current;
    const dpr = Math.min(window.devicePixelRatio, 1.5);
    const renderer = new Renderer({ dpr });
    const gl = renderer.gl;
    gl.clearColor(1, 1, 1, 1);

    let program: Program;

    function resize() {
      const scale = 1;
      // Cap DPR to 1.5 for performance on high-res screens
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      
      renderer.setSize(ctn.offsetWidth * scale, ctn.offsetHeight * scale);
      
      // Manually set canvas width/height to account for capped DPR if OGL doesn't handle it with setSize
      // Checking OGL docs/source, setSize usually sets canvas width/height based on dpr if provided in constructor,
      // or we can set it manually. 
      // The current implementation uses gl.canvas.width which is set by setSize.
      // Let's set the dpr on the renderer if possible, or manually scale.
      renderer.dpr = dpr; 
      renderer.setSize(ctn.offsetWidth * scale, ctn.offsetHeight * scale);

      if (program) {
        program.uniforms.uResolution.value = new Color(
          gl.canvas.width,
          gl.canvas.height,
          gl.canvas.width / gl.canvas.height
        );
      }
    }
    window.addEventListener('resize', resize, false);
    resize();

    const geometry = new Triangle(gl);
    program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color(...color) },
        uResolution: {
          value: new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height)
        },
        uMouse: { value: new Float32Array([mousePos.current.x, mousePos.current.y]) },
        uAmplitude: { value: amplitude },
        uSpeed: { value: speed }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });
    let animateId: number;
    let hasCalledReady = false;

    function update(t: number) {
      animateId = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;
      renderer.render({ scene: mesh });
      
      // Call onReady after first successful render
      if (!hasCalledReady) {
        hasCalledReady = true;
        onReady?.();
      }
    }
    animateId = requestAnimationFrame(update);
    // Canvas renders at full opacity - parent wrapper handles the fade-in transition
    gl.canvas.style.cssText = 'display: block; width: 100%; height: 100%;';
    ctn.appendChild(gl.canvas);

    function handleMouseMove(e: MouseEvent) {
      const rect = ctn.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      mousePos.current = { x, y };
      program.uniforms.uMouse.value[0] = x;
      program.uniforms.uMouse.value[1] = y;
    }
    if (mouseReact) {
      ctn.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener('resize', resize);
      if (mouseReact) {
        ctn.removeEventListener('mousemove', handleMouseMove);
      }
      ctn.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [color, speed, amplitude, mouseReact, onReady]);

  return <div ref={ctnDom} className="w-full h-full backface-hidden transform-gpu" style={showFallbackGradient ? gradientStyle : undefined} {...rest} />;
}
