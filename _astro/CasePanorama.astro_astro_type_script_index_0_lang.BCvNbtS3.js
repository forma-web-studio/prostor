const _=matchMedia("(prefers-reduced-motion: reduce)"),E=Math.PI*2,G=90,ae=60,oe=105,S=8*Math.PI/180,ne=`#version 300 es
in vec2 aPosition;
void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
`,ie=`#version 300 es
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
`,O=(o,r,n)=>{const c=o.createShader(r);return c?(o.shaderSource(c,n),o.compileShader(c),o.getShaderParameter(c,o.COMPILE_STATUS)?c:(o.deleteShader(c),null)):null};document.querySelectorAll("[data-panorama]").forEach(o=>{const r=o.querySelector("[data-panorama-viewport]"),n=o.querySelector("[data-panorama-canvas]"),c=o.querySelector("[data-panorama-fallback]"),L=o.querySelector("[data-panorama-progress]"),v=o.querySelector("[data-panorama-status]"),W=o.querySelector("[data-panorama-zoom-in]"),V=o.querySelector("[data-panorama-zoom-out]"),H=o.querySelector("[data-panorama-reset]");if(!r||!n||!c||!L)return;const e=n.getContext("webgl2",{alpha:!1,antialias:!0,powerPreference:"high-performance"});if(!e)return;const A=c.currentSrc||c.src,$=A.includes(".avif")?n.dataset.textureSrcSafeAvif:n.dataset.textureSrcSafeWebp,K=matchMedia("(min-width: 1100px)").matches&&e.getParameter(e.MAX_TEXTURE_SIZE)<8192&&$||A,U=O(e,e.VERTEX_SHADER,ne),b=O(e,e.FRAGMENT_SHADER,ie);if(!U||!b)return;const i=e.createProgram();if(!i||(e.attachShader(i,U),e.attachShader(i,b),e.linkProgram(i),!e.getProgramParameter(i,e.LINK_STATUS)))return;e.useProgram(i);const Z=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,Z),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),e.STATIC_DRAW);const F=e.getAttribLocation(i,"aPosition");e.enableVertexAttribArray(F),e.vertexAttribPointer(F,2,e.FLOAT,!1,0,0);const j=e.getUniformLocation(i,"uResolution"),J=e.getUniformLocation(i,"uYaw"),Q=e.getUniformLocation(i,"uPitch"),ee=e.getUniformLocation(i,"uFov");let s=0,d=0,f=G,T=null,l=null,X=0,D=0,k=0,Y=0,M=0,R=0,m=0,p=0,z=0;const C=()=>(s%E+E)%E,w=()=>{window.clearTimeout(z),z=window.setTimeout(()=>{v&&(v.textContent=`Направление ${Math.round(C()/E*360)} градусов, угол обзора ${Math.round(f)} градусов`)},140)},h=()=>{e.uniform2f(j,n.width,n.height),e.uniform1f(J,s),e.uniform1f(Q,d),e.uniform1f(ee,f),e.drawArrays(e.TRIANGLES,0,6),L.style.setProperty("--pan-progress",`${C()/E*100}%`)},q=()=>{const t=Math.min(2,devicePixelRatio||1),a=Math.max(1,Math.round(r.clientWidth*t)),u=Math.max(1,Math.round(r.clientHeight*t));(n.width!==a||n.height!==u)&&(n.width=a,n.height=u,e.viewport(0,0,a,u)),h()},x=()=>{cancelAnimationFrame(p),p=0},te=()=>{if(_.matches||Math.abs(m)<3e-5)return;let t=performance.now();const a=u=>{const y=Math.min(32,u-t);t=u,m*=Math.pow(.9,y/16),s+=m*y,h(),Math.abs(m)>=3e-5?p=requestAnimationFrame(a):p=0};p=requestAnimationFrame(a)},P=(t,a=!0)=>{f=Math.min(oe,Math.max(ae,t)),h(),a&&w()},I=(t=!0)=>{x(),s=0,d=0,f=G,h(),t&&w()};r.addEventListener("pointerdown",t=>{!t.isPrimary||t.button!==0||t.target.closest("button")||(x(),T=t.pointerId,l=t.pointerType==="mouse"?"free":null,X=t.clientX,D=t.clientY,k=s,Y=d,M=s,R=performance.now(),m=0,l==="free"&&(r.setPointerCapture(t.pointerId),r.classList.add("is-dragging")))}),r.addEventListener("pointermove",t=>{if(t.pointerId!==T)return;const a=t.clientX-X,u=t.clientY-D;if(!l){if(Math.hypot(a,u)<10)return;l=Math.abs(a)>Math.abs(u)*1.1?"x":"y",l==="x"&&(r.setPointerCapture(t.pointerId),r.classList.add("is-dragging"))}if(l==="y")return;t.cancelable&&t.preventDefault();const y=f*Math.PI/180/Math.max(320,r.clientWidth);s=k-a*y*1.25,l==="free"&&(d=Math.max(-S,Math.min(S,Y+u*y*.45)));const B=performance.now();m=Math.max(-.006,Math.min(.006,(s-M)/Math.max(1,B-R))),M=s,R=B,h()});const N=t=>{if(t.pointerId!==T)return;const a=l==="x"||l==="free";a&&r.hasPointerCapture(t.pointerId)&&r.releasePointerCapture(t.pointerId),r.classList.remove("is-dragging"),T=null,l=null,a&&te()};r.addEventListener("pointerup",N),r.addEventListener("pointercancel",N),r.addEventListener("keydown",t=>{if(t.target!==r)return;const a=7*Math.PI/180;if(t.key==="ArrowLeft")s-=a;else if(t.key==="ArrowRight")s+=a;else if(t.key==="ArrowUp")d=Math.min(S,d+2*Math.PI/180);else if(t.key==="ArrowDown")d=Math.max(-S,d-2*Math.PI/180);else if(t.key==="+"||t.key==="=")P(f-6,!1);else if(t.key==="-"||t.key==="_")P(f+6,!1);else if(t.key==="Home")I(!1);else return;t.preventDefault(),x(),h(),w()}),W?.addEventListener("click",()=>P(f-8)),V?.addEventListener("click",()=>P(f+8)),H?.addEventListener("click",()=>I());const re=e.createTexture(),g=new Image;g.decoding="async",g.addEventListener("load",()=>{e.bindTexture(e.TEXTURE_2D,re),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.REPEAT),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,g),q(),o.dataset.panoramaReady="",r.dataset.panoramaReady="",r.tabIndex=0},{once:!0}),g.src=K,new ResizeObserver(q).observe(r),_.addEventListener("change",()=>{x(),_.matches&&I(!1)})});
