const _=matchMedia("(prefers-reduced-motion: reduce)"),E=Math.PI*2,N=90,te=60,re=105,M=8*Math.PI/180,ae=`#version 300 es
in vec2 aPosition;
void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
`,oe=`#version 300 es
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
`,B=(o,r,n)=>{const u=o.createShader(r);return u?(o.shaderSource(u,n),o.compileShader(u),o.getShaderParameter(u,o.COMPILE_STATUS)?u:(o.deleteShader(u),null)):null};document.querySelectorAll("[data-panorama]").forEach(o=>{const r=o.querySelector("[data-panorama-viewport]"),n=o.querySelector("[data-panorama-canvas]"),u=o.querySelector("[data-panorama-progress]"),L=o.querySelector("[data-panorama-status]"),G=o.querySelector("[data-panorama-zoom-in]"),O=o.querySelector("[data-panorama-zoom-out]"),V=o.querySelector("[data-panorama-reset]"),A=n?.dataset.textureSrc,W=n?.dataset.textureSrcMobile;if(!r||!n||!u||!A)return;const e=n.getContext("webgl2",{alpha:!1,antialias:!0,powerPreference:"high-performance"});if(!e)return;const H=(matchMedia("(max-width: 767px)").matches||e.getParameter(e.MAX_TEXTURE_SIZE)<8192)&&W||A,v=B(e,e.VERTEX_SHADER,ae),U=B(e,e.FRAGMENT_SHADER,oe);if(!v||!U)return;const i=e.createProgram();if(!i||(e.attachShader(i,v),e.attachShader(i,U),e.linkProgram(i),!e.getProgramParameter(i,e.LINK_STATUS)))return;e.useProgram(i);const $=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,$),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),e.STATIC_DRAW);const b=e.getAttribLocation(i,"aPosition");e.enableVertexAttribArray(b),e.vertexAttribPointer(b,2,e.FLOAT,!1,0,0);const K=e.getUniformLocation(i,"uResolution"),Z=e.getUniformLocation(i,"uYaw"),j=e.getUniformLocation(i,"uPitch"),J=e.getUniformLocation(i,"uFov");let s=0,f=0,d=N,x=null,c=null,F=0,X=0,D=0,Y=0,R=0,S=0,m=0,p=0;const k=()=>(s%E+E)%E,w=()=>{L&&(L.textContent=`Направление ${Math.round(k()/E*360)} градусов, угол обзора ${Math.round(d)} градусов`)},h=()=>{e.uniform2f(K,n.width,n.height),e.uniform1f(Z,s),e.uniform1f(j,f),e.uniform1f(J,d),e.drawArrays(e.TRIANGLES,0,6),u.style.setProperty("--pan-progress",`${k()/E*100}%`)},z=()=>{const t=Math.min(2,devicePixelRatio||1),a=Math.max(1,Math.round(r.clientWidth*t)),l=Math.max(1,Math.round(r.clientHeight*t));(n.width!==a||n.height!==l)&&(n.width=a,n.height=l,e.viewport(0,0,a,l)),h()},T=()=>{cancelAnimationFrame(p),p=0},Q=()=>{if(_.matches||Math.abs(m)<3e-5)return;let t=performance.now();const a=l=>{const y=Math.min(32,l-t);t=l,m*=Math.pow(.9,y/16),s+=m*y,h(),Math.abs(m)>=3e-5?p=requestAnimationFrame(a):p=0};p=requestAnimationFrame(a)},P=(t,a=!0)=>{d=Math.min(re,Math.max(te,t)),h(),a&&w()},I=(t=!0)=>{T(),s=0,f=0,d=N,h(),t&&w()};r.addEventListener("pointerdown",t=>{!t.isPrimary||t.button!==0||t.target.closest("button")||(T(),x=t.pointerId,c=t.pointerType==="mouse"?"free":null,F=t.clientX,X=t.clientY,D=s,Y=f,R=s,S=performance.now(),m=0,c==="free"&&(r.setPointerCapture(t.pointerId),r.classList.add("is-dragging")))}),r.addEventListener("pointermove",t=>{if(t.pointerId!==x)return;const a=t.clientX-F,l=t.clientY-X;if(!c){if(Math.hypot(a,l)<10)return;c=Math.abs(a)>Math.abs(l)*1.1?"x":"y",c==="x"&&(r.setPointerCapture(t.pointerId),r.classList.add("is-dragging"))}if(c==="y")return;t.cancelable&&t.preventDefault();const y=d*Math.PI/180/Math.max(320,r.clientWidth);s=D-a*y*1.25,c==="free"&&(f=Math.max(-M,Math.min(M,Y+l*y*.45)));const q=performance.now();m=Math.max(-.006,Math.min(.006,(s-R)/Math.max(1,q-S))),R=s,S=q,h()});const C=t=>{if(t.pointerId!==x)return;const a=c==="x"||c==="free";a&&r.hasPointerCapture(t.pointerId)&&r.releasePointerCapture(t.pointerId),r.classList.remove("is-dragging"),x=null,c=null,a&&Q()};r.addEventListener("pointerup",C),r.addEventListener("pointercancel",C),r.addEventListener("keydown",t=>{if(t.target!==r)return;const a=7*Math.PI/180;if(t.key==="ArrowLeft")s-=a;else if(t.key==="ArrowRight")s+=a;else if(t.key==="ArrowUp")f=Math.min(M,f+2*Math.PI/180);else if(t.key==="ArrowDown")f=Math.max(-M,f-2*Math.PI/180);else if(t.key==="+"||t.key==="=")P(d-6,!1);else if(t.key==="-"||t.key==="_")P(d+6,!1);else if(t.key==="Home")I(!1);else return;t.preventDefault(),T(),h(),w()}),G?.addEventListener("click",()=>P(d-8)),O?.addEventListener("click",()=>P(d+8)),V?.addEventListener("click",()=>I());const ee=e.createTexture(),g=new Image;g.decoding="async",g.addEventListener("load",()=>{e.bindTexture(e.TEXTURE_2D,ee),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.REPEAT),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,g),z(),o.dataset.panoramaReady="",r.dataset.panoramaReady="",r.tabIndex=0},{once:!0}),g.src=H,new ResizeObserver(z).observe(r),_.addEventListener("change",()=>{T(),_.matches&&I(!1)})});
