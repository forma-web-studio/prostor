const w=matchMedia("(prefers-reduced-motion: reduce)"),E=Math.PI*2,q=68,Z=48,ee=78,A=8*Math.PI/180,te=`#version 300 es
in vec2 aPosition;
void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
`,re=`#version 300 es
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
`,B=(o,r,n)=>{const u=o.createShader(r);return u?(o.shaderSource(u,n),o.compileShader(u),o.getShaderParameter(u,o.COMPILE_STATUS)?u:(o.deleteShader(u),null)):null};document.querySelectorAll("[data-panorama]").forEach(o=>{const r=o.querySelector("[data-panorama-viewport]"),n=o.querySelector("[data-panorama-canvas]"),u=o.querySelector("[data-panorama-progress]"),S=o.querySelector("[data-panorama-status]"),G=o.querySelector("[data-panorama-zoom-in]"),O=o.querySelector("[data-panorama-zoom-out]"),V=o.querySelector("[data-panorama-reset]"),L=n?.dataset.textureSrc;if(!r||!n||!u||!L)return;const e=n.getContext("webgl2",{alpha:!1,antialias:!0,powerPreference:"high-performance"});if(!e)return;const v=B(e,e.VERTEX_SHADER,te),U=B(e,e.FRAGMENT_SHADER,re);if(!v||!U)return;const i=e.createProgram();if(!i||(e.attachShader(i,v),e.attachShader(i,U),e.linkProgram(i),!e.getProgramParameter(i,e.LINK_STATUS)))return;e.useProgram(i);const W=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,W),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),e.STATIC_DRAW);const F=e.getAttribLocation(i,"aPosition");e.enableVertexAttribArray(F),e.vertexAttribPointer(F,2,e.FLOAT,!1,0,0);const H=e.getUniformLocation(i,"uResolution"),$=e.getUniformLocation(i,"uYaw"),K=e.getUniformLocation(i,"uPitch"),j=e.getUniformLocation(i,"uFov");let s=0,d=0,f=q,P=null,c=null,b=0,D=0,X=0,Y=0,M=0,R=0,m=0,p=0;const z=()=>(s%E+E)%E,I=()=>{S&&(S.textContent=`Направление ${Math.round(z()/E*360)} градусов, угол обзора ${Math.round(f)} градусов`)},h=()=>{e.uniform2f(H,n.width,n.height),e.uniform1f($,s),e.uniform1f(K,d),e.uniform1f(j,f),e.drawArrays(e.TRIANGLES,0,6),u.style.setProperty("--pan-progress",`${z()/E*100}%`)},k=()=>{const t=Math.min(2,devicePixelRatio||1),a=Math.max(1,Math.round(r.clientWidth*t)),l=Math.max(1,Math.round(r.clientHeight*t));(n.width!==a||n.height!==l)&&(n.width=a,n.height=l,e.viewport(0,0,a,l)),h()},T=()=>{cancelAnimationFrame(p),p=0},J=()=>{if(w.matches||Math.abs(m)<3e-5)return;let t=performance.now();const a=l=>{const y=Math.min(32,l-t);t=l,m*=Math.pow(.9,y/16),s+=m*y,h(),Math.abs(m)>=3e-5?p=requestAnimationFrame(a):p=0};p=requestAnimationFrame(a)},g=(t,a=!0)=>{f=Math.min(ee,Math.max(Z,t)),h(),a&&I()},_=(t=!0)=>{T(),s=0,d=0,f=q,h(),t&&I()};r.addEventListener("pointerdown",t=>{!t.isPrimary||t.button!==0||t.target.closest("button")||(T(),P=t.pointerId,c=t.pointerType==="mouse"?"free":null,b=t.clientX,D=t.clientY,X=s,Y=d,M=s,R=performance.now(),m=0,c==="free"&&(r.setPointerCapture(t.pointerId),r.classList.add("is-dragging")))}),r.addEventListener("pointermove",t=>{if(t.pointerId!==P)return;const a=t.clientX-b,l=t.clientY-D;if(!c){if(Math.hypot(a,l)<10)return;c=Math.abs(a)>Math.abs(l)*1.1?"x":"y",c==="x"&&(r.setPointerCapture(t.pointerId),r.classList.add("is-dragging"))}if(c==="y")return;t.cancelable&&t.preventDefault();const y=f*Math.PI/180/Math.max(320,r.clientWidth);s=X-a*y*1.25,c==="free"&&(d=Math.max(-A,Math.min(A,Y+l*y*.45)));const N=performance.now();m=Math.max(-.006,Math.min(.006,(s-M)/Math.max(1,N-R))),M=s,R=N,h()});const C=t=>{if(t.pointerId!==P)return;const a=c==="x"||c==="free";a&&r.hasPointerCapture(t.pointerId)&&r.releasePointerCapture(t.pointerId),r.classList.remove("is-dragging"),P=null,c=null,a&&J()};r.addEventListener("pointerup",C),r.addEventListener("pointercancel",C),r.addEventListener("keydown",t=>{if(t.target!==r)return;const a=7*Math.PI/180;if(t.key==="ArrowLeft")s-=a;else if(t.key==="ArrowRight")s+=a;else if(t.key==="ArrowUp")d=Math.min(A,d+2*Math.PI/180);else if(t.key==="ArrowDown")d=Math.max(-A,d-2*Math.PI/180);else if(t.key==="+"||t.key==="=")g(f-6,!1);else if(t.key==="-"||t.key==="_")g(f+6,!1);else if(t.key==="Home")_(!1);else return;t.preventDefault(),T(),h(),I()}),G?.addEventListener("click",()=>g(f-8)),O?.addEventListener("click",()=>g(f+8)),V?.addEventListener("click",()=>_());const Q=e.createTexture(),x=new Image;x.decoding="async",x.addEventListener("load",()=>{e.bindTexture(e.TEXTURE_2D,Q),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.REPEAT),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,x),e.generateMipmap(e.TEXTURE_2D),k(),o.dataset.panoramaReady="",r.dataset.panoramaReady="",r.tabIndex=0},{once:!0}),x.src=L,new ResizeObserver(k).observe(r),w.addEventListener("change",()=>{T(),w.matches&&_(!1)})});
