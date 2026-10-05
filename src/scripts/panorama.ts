const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const TAU = Math.PI * 2;
const DEFAULT_FOV = 90;
const MIN_FOV = 60;
const MAX_FOV = 105;
const MAX_PITCH = 8 * Math.PI / 180;

const vertexShaderSource = `#version 300 es
in vec2 aPosition;
void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
`;

const fragmentShaderSource = `#version 300 es
precision highp float;
uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform float uYaw;
uniform float uPitch;
uniform float uFov;
out vec4 outColor;
const float PI = 3.141592653589793;
void main() {
  vec2 screen = (gl_FragCoord.xy / uResolution) * 2.0 - 1.0;
  float aspect = uResolution.x / uResolution.y;
  float lens = tan(radians(uFov) * 0.5);
  vec3 ray = normalize(vec3(screen.x * aspect * lens, screen.y * lens, -1.0));
  float cp = cos(uPitch);
  float sp = sin(uPitch);
  ray = vec3(ray.x, cp * ray.y - sp * ray.z, sp * ray.y + cp * ray.z);
  float cy = cos(uYaw);
  float sy = sin(uYaw);
  ray = vec3(cy * ray.x - sy * ray.z, ray.y, sy * ray.x + cy * ray.z);
  float horizontal = max(length(ray.xz), 0.0001);
  float longitude = atan(ray.x, -ray.z);
  float u = fract(longitude / (2.0 * PI) + 0.5);
  float cylinderY = ray.y / horizontal;
  float v = clamp(0.5 - cylinderY / (2.0 * 1.04719755), 0.001, 0.999);
  outColor = texture(uTexture, vec2(u, v));
}
`;

const compileShader = (gl: WebGL2RenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

document.querySelectorAll<HTMLElement>('[data-panorama]').forEach((panorama) => {
  const viewport = panorama.querySelector<HTMLElement>('[data-panorama-viewport]');
  const canvas = panorama.querySelector<HTMLCanvasElement>('[data-panorama-canvas]');
  const progress = panorama.querySelector<HTMLElement>('[data-panorama-progress]');
  const status = panorama.querySelector<HTMLElement>('[data-panorama-status]');
  const zoomIn = panorama.querySelector<HTMLButtonElement>('[data-panorama-zoom-in]');
  const zoomOut = panorama.querySelector<HTMLButtonElement>('[data-panorama-zoom-out]');
  const reset = panorama.querySelector<HTMLButtonElement>('[data-panorama-reset]');
  const desktopTextureSource = canvas?.dataset.textureSrc;
  const mobileTextureSource = canvas?.dataset.textureSrcMobile;
  if (!viewport || !canvas || !progress || !desktopTextureSource) return;

  const gl = canvas.getContext('webgl2', { alpha:false, antialias:true, powerPreference:'high-performance' });
  if (!gl) return;
  const useHighResolutionTexture = matchMedia('(min-width: 1100px)').matches && gl.getParameter(gl.MAX_TEXTURE_SIZE) >= 8192;
  const textureSource = useHighResolutionTexture ? desktopTextureSource : mobileTextureSource || desktopTextureSource;
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  if (!vertexShader || !fragmentShader) return;
  const program = gl.createProgram();
  if (!program) return;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const resolutionUniform = gl.getUniformLocation(program, 'uResolution');
  const yawUniform = gl.getUniformLocation(program, 'uYaw');
  const pitchUniform = gl.getUniformLocation(program, 'uPitch');
  const fovUniform = gl.getUniformLocation(program, 'uFov');

  let yaw = 0;
  let pitch = 0;
  let fov = DEFAULT_FOV;
  let pointerId: number | null = null;
  let axis: 'x' | 'y' | 'free' | null = null;
  let startX = 0;
  let startY = 0;
  let startYaw = 0;
  let startPitch = 0;
  let lastYaw = 0;
  let lastTime = 0;
  let velocity = 0;
  let inertiaFrame = 0;
  let announceTimer = 0;

  const normalizedYaw = () => ((yaw % TAU) + TAU) % TAU;
  const announce = () => {
    window.clearTimeout(announceTimer);
    announceTimer = window.setTimeout(() => {
      if (status) status.textContent = `Направление ${Math.round(normalizedYaw() / TAU * 360)} градусов, угол обзора ${Math.round(fov)} градусов`;
    }, 140);
  };
  const draw = () => {
    gl.uniform2f(resolutionUniform, canvas.width, canvas.height);
    gl.uniform1f(yawUniform, yaw);
    gl.uniform1f(pitchUniform, pitch);
    gl.uniform1f(fovUniform, fov);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    progress.style.setProperty('--pan-progress', `${normalizedYaw() / TAU * 100}%`);
  };
  const resize = () => {
    const ratio = Math.min(2, devicePixelRatio || 1);
    const width = Math.max(1, Math.round(viewport.clientWidth * ratio));
    const height = Math.max(1, Math.round(viewport.clientHeight * ratio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
    draw();
  };
  const stopInertia = () => {
    cancelAnimationFrame(inertiaFrame);
    inertiaFrame = 0;
  };
  const startInertia = () => {
    if (reduceMotion.matches || Math.abs(velocity) < .00003) return;
    let previous = performance.now();
    const tick = (time: number) => {
      const elapsed = Math.min(32, time - previous);
      previous = time;
      velocity *= Math.pow(.9, elapsed / 16);
      yaw += velocity * elapsed;
      draw();
      if (Math.abs(velocity) >= .00003) inertiaFrame = requestAnimationFrame(tick);
      else inertiaFrame = 0;
    };
    inertiaFrame = requestAnimationFrame(tick);
  };
  const setFov = (value: number, shouldAnnounce = true) => {
    fov = Math.min(MAX_FOV, Math.max(MIN_FOV, value));
    draw();
    if (shouldAnnounce) announce();
  };
  const resetView = (shouldAnnounce = true) => {
    stopInertia();
    yaw = 0;
    pitch = 0;
    fov = DEFAULT_FOV;
    draw();
    if (shouldAnnounce) announce();
  };

  viewport.addEventListener('pointerdown', (event) => {
    if (!event.isPrimary || event.button !== 0 || (event.target as HTMLElement).closest('button')) return;
    stopInertia();
    pointerId = event.pointerId;
    axis = event.pointerType === 'mouse' ? 'free' : null;
    startX = event.clientX;
    startY = event.clientY;
    startYaw = yaw;
    startPitch = pitch;
    lastYaw = yaw;
    lastTime = performance.now();
    velocity = 0;
    if (axis === 'free') {
      viewport.setPointerCapture(event.pointerId);
      viewport.classList.add('is-dragging');
    }
  });
  viewport.addEventListener('pointermove', (event) => {
    if (event.pointerId !== pointerId) return;
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    if (!axis) {
      if (Math.hypot(deltaX, deltaY) < 10) return;
      axis = Math.abs(deltaX) > Math.abs(deltaY) * 1.1 ? 'x' : 'y';
      if (axis === 'x') {
        viewport.setPointerCapture(event.pointerId);
        viewport.classList.add('is-dragging');
      }
    }
    if (axis === 'y') return;
    if (event.cancelable) event.preventDefault();
    const radiansPerPixel = (fov * Math.PI / 180) / Math.max(320, viewport.clientWidth);
    yaw = startYaw - deltaX * radiansPerPixel * 1.25;
    if (axis === 'free') pitch = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, startPitch + deltaY * radiansPerPixel * .45));
    const now = performance.now();
    velocity = Math.max(-.006, Math.min(.006, (yaw - lastYaw) / Math.max(1, now - lastTime)));
    lastYaw = yaw;
    lastTime = now;
    draw();
  });
  const finishPointer = (event: PointerEvent) => {
    if (event.pointerId !== pointerId) return;
    const moved = axis === 'x' || axis === 'free';
    if (moved && viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
    viewport.classList.remove('is-dragging');
    pointerId = null;
    axis = null;
    if (moved) startInertia();
  };
  viewport.addEventListener('pointerup', finishPointer);
  viewport.addEventListener('pointercancel', finishPointer);
  viewport.addEventListener('keydown', (event) => {
    if (event.target !== viewport) return;
    const rotationStep = 7 * Math.PI / 180;
    if (event.key === 'ArrowLeft') yaw -= rotationStep;
    else if (event.key === 'ArrowRight') yaw += rotationStep;
    else if (event.key === 'ArrowUp') pitch = Math.min(MAX_PITCH, pitch + 2 * Math.PI / 180);
    else if (event.key === 'ArrowDown') pitch = Math.max(-MAX_PITCH, pitch - 2 * Math.PI / 180);
    else if (event.key === '+' || event.key === '=') setFov(fov - 6, false);
    else if (event.key === '-' || event.key === '_') setFov(fov + 6, false);
    else if (event.key === 'Home') resetView(false);
    else return;
    event.preventDefault();
    stopInertia();
    draw();
    announce();
  });
  zoomIn?.addEventListener('click', () => setFov(fov - 8));
  zoomOut?.addEventListener('click', () => setFov(fov + 8));
  reset?.addEventListener('click', () => resetView());

  const texture = gl.createTexture();
  const image = new Image();
  image.decoding = 'async';
  image.addEventListener('load', () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    resize();
    panorama.dataset.panoramaReady = '';
    viewport.dataset.panoramaReady = '';
    viewport.tabIndex = 0;
  }, { once:true });
  image.src = textureSource;

  const observer = new ResizeObserver(resize);
  observer.observe(viewport);
  reduceMotion.addEventListener('change', () => {
    stopInertia();
    if (reduceMotion.matches) resetView(false);
  });
});
