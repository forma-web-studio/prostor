const I=matchMedia("(prefers-reduced-motion: reduce)"),E=Math.PI*2,G=90,re=60,ae=105,A=8*Math.PI/180,oe=`#version 300 es
in vec2 aPosition;
void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
`,ne=`#version 300 es
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
`,O=(o,r,n)=>{const c=o.createShader(r);return c?(o.shaderSource(c,n),o.compileShader(c),o.getShaderParameter(c,o.COMPILE_STATUS)?c:(o.deleteShader(c),null)):null};document.querySelectorAll("[data-panorama]").forEach(o=>{const r=o.querySelector("[data-panorama-viewport]"),n=o.querySelector("[data-panorama-canvas]"),c=o.querySelector("[data-panorama-fallback]"),_=o.querySelector("[data-panorama-progress]"),L=o.querySelector("[data-panorama-status]"),V=o.querySelector("[data-panorama-zoom-in]"),W=o.querySelector("[data-panorama-zoom-out]"),H=o.querySelector("[data-panorama-reset]");if(!r||!n||!c||!_)return;const e=n.getContext("webgl2",{alpha:!1,antialias:!0,powerPreference:"high-performance"});if(!e)return;const v=c.currentSrc||c.src,$=matchMedia("(min-width: 1100px)").matches&&e.getParameter(e.MAX_TEXTURE_SIZE)<8192&&n.dataset.textureSrcSafe||v,U=O(e,e.VERTEX_SHADER,oe),b=O(e,e.FRAGMENT_SHADER,ne);if(!U||!b)return;const i=e.createProgram();if(!i||(e.attachShader(i,U),e.attachShader(i,b),e.linkProgram(i),!e.getProgramParameter(i,e.LINK_STATUS)))return;e.useProgram(i);const K=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,K),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),e.STATIC_DRAW);const F=e.getAttribLocation(i,"aPosition");e.enableVertexAttribArray(F),e.vertexAttribPointer(F,2,e.FLOAT,!1,0,0);const Z=e.getUniformLocation(i,"uResolution"),j=e.getUniformLocation(i,"uYaw"),J=e.getUniformLocation(i,"uPitch"),Q=e.getUniformLocation(i,"uFov");let s=0,f=0,d=G,T=null,l=null,X=0,D=0,k=0,Y=0,M=0,R=0,m=0,y=0,z=0;const C=()=>(s%E+E)%E,w=()=>{window.clearTimeout(z),z=window.setTimeout(()=>{L&&(L.textContent=`Направление ${Math.round(C()/E*360)} градусов, угол обзора ${Math.round(d)} градусов`)},140)},h=()=>{e.uniform2f(Z,n.width,n.height),e.uniform1f(j,s),e.uniform1f(J,f),e.uniform1f(Q,d),e.drawArrays(e.TRIANGLES,0,6),_.style.setProperty("--pan-progress",`${C()/E*100}%`)},q=()=>{const t=Math.min(2,devicePixelRatio||1),a=Math.max(1,Math.round(r.clientWidth*t)),u=Math.max(1,Math.round(r.clientHeight*t));(n.width!==a||n.height!==u)&&(n.width=a,n.height=u,e.viewport(0,0,a,u)),h()},P=()=>{cancelAnimationFrame(y),y=0},ee=()=>{if(I.matches||Math.abs(m)<3e-5)return;let t=performance.now();const a=u=>{const p=Math.min(32,u-t);t=u,m*=Math.pow(.9,p/16),s+=m*p,h(),Math.abs(m)>=3e-5?y=requestAnimationFrame(a):y=0};y=requestAnimationFrame(a)},g=(t,a=!0)=>{d=Math.min(ae,Math.max(re,t)),h(),a&&w()},S=(t=!0)=>{P(),s=0,f=0,d=G,h(),t&&w()};r.addEventListener("pointerdown",t=>{!t.isPrimary||t.button!==0||t.target.closest("button")||(P(),T=t.pointerId,l=t.pointerType==="mouse"?"free":null,X=t.clientX,D=t.clientY,k=s,Y=f,M=s,R=performance.now(),m=0,l==="free"&&(r.setPointerCapture(t.pointerId),r.classList.add("is-dragging")))}),r.addEventListener("pointermove",t=>{if(t.pointerId!==T)return;const a=t.clientX-X,u=t.clientY-D;if(!l){if(Math.hypot(a,u)<10)return;l=Math.abs(a)>Math.abs(u)*1.1?"x":"y",l==="x"&&(r.setPointerCapture(t.pointerId),r.classList.add("is-dragging"))}if(l==="y")return;t.cancelable&&t.preventDefault();const p=d*Math.PI/180/Math.max(320,r.clientWidth);s=k-a*p*1.25,l==="free"&&(f=Math.max(-A,Math.min(A,Y+u*p*.45)));const B=performance.now();m=Math.max(-.006,Math.min(.006,(s-M)/Math.max(1,B-R))),M=s,R=B,h()});const N=t=>{if(t.pointerId!==T)return;const a=l==="x"||l==="free";a&&r.hasPointerCapture(t.pointerId)&&r.releasePointerCapture(t.pointerId),r.classList.remove("is-dragging"),T=null,l=null,a&&ee()};r.addEventListener("pointerup",N),r.addEventListener("pointercancel",N),r.addEventListener("keydown",t=>{if(t.target!==r)return;const a=7*Math.PI/180;if(t.key==="ArrowLeft")s-=a;else if(t.key==="ArrowRight")s+=a;else if(t.key==="ArrowUp")f=Math.min(A,f+2*Math.PI/180);else if(t.key==="ArrowDown")f=Math.max(-A,f-2*Math.PI/180);else if(t.key==="+"||t.key==="=")g(d-6,!1);else if(t.key==="-"||t.key==="_")g(d+6,!1);else if(t.key==="Home")S(!1);else return;t.preventDefault(),P(),h(),w()}),V?.addEventListener("click",()=>g(d-8)),W?.addEventListener("click",()=>g(d+8)),H?.addEventListener("click",()=>S());const te=e.createTexture(),x=new Image;x.decoding="async",x.addEventListener("load",()=>{e.bindTexture(e.TEXTURE_2D,te),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.REPEAT),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,x),q(),o.dataset.panoramaReady="",r.dataset.panoramaReady="",r.tabIndex=0},{once:!0}),x.src=$,new ResizeObserver(q).observe(r),I.addEventListener("change",()=>{P(),I.matches&&S(!1)})});
