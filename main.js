const C=window.VOLT||{};
const $=id=>document.getElementById(id);
$('ver').textContent=C.version||'';
['dl-hero','dl-gofile'].forEach(i=>{if(C.gofile){$(i).href=C.gofile;$(i).target='_blank';$(i).rel='noopener'}});
document.querySelectorAll('[data-go]').forEach(a=>a.href=C.gofile||'#descargar');
if(C.apkLocal){$('dl-local').href=C.apkLocal;$('dl-local').hidden=false}
if(C.size)$('size').textContent=C.size;
// galería
const shots=[["1-menu","Menú principal"],["6-juego","En juego"],["14-carrusel","Selector de niveles"],["11-practica","Modo práctica"],["10-skins","Skins"],["5-ranking","Ranking"]];
const th=$('thumbs');
function pick(i){const [f,t]=shots[i];$('big').src=`assets/shots/${f}.png`;$('big').alt=t;$('cap').textContent=t;[...th.children].forEach((b,j)=>b.classList.toggle('on',j===i));cur=i}
let cur=0;
shots.forEach(([f,t],i)=>{const b=document.createElement('button');b.innerHTML=`<img loading="lazy" src="assets/shots/${f}.png" alt="${t}">`;b.onclick=()=>{pick(i);clearInterval(tm)};th.appendChild(b)});
pick(0);let tm=setInterval(()=>pick((cur+1)%shots.length),4000);
// reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.rv').forEach((el,i)=>{el.style.transitionDelay=(i%4)*70+'ms';io.observe(el)});
// fondo: rejilla en perspectiva + partículas
const cv=$('fx'),g=cv.getContext('2d');let W,H,P=[];
function rs(){W=cv.width=innerWidth;H=cv.height=innerHeight;P=Array.from({length:Math.min(70,W/18|0)},()=>({x:Math.random()*W,y:Math.random()*H,s:Math.random()*1.6+.4,v:Math.random()*.4+.1}))}
rs();addEventListener('resize',rs);
let t=0;const calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
function draw(){g.clearRect(0,0,W,H);const hz=H*.62;
 g.strokeStyle='rgba(0,240,255,.16)';g.lineWidth=1;
 for(let i=-20;i<=20;i++){g.beginPath();g.moveTo(W/2+i*20,hz);g.lineTo(W/2+i*W*.14,H);g.stroke()}
 for(let k=0;k<14;k++){const z=((k+t*.02)%14)/14,y=hz+(H-hz)*z*z;g.globalAlpha=.25+z*.6;g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke()}
 g.globalAlpha=1;g.fillStyle='#00f0ff';
 P.forEach(p=>{p.y-=p.v;if(p.y<0){p.y=H;p.x=Math.random()*W}g.globalAlpha=.15+p.s/3;g.beginPath();g.arc(p.x,p.y,p.s,0,7);g.fill()});
 g.globalAlpha=1;t++;if(!calm)requestAnimationFrame(draw)}
draw();

// minijuego interactivo
(()=>{
const box=$('runner'),cv=$('game'),x=cv.getContext('2d'),msg=$('g-msg');
const GH=130,GR=34,S=30,GRAV=2600,JV=-570;
let W=0,dpr=1,state='idle',tries=0,score=0,sp,spikes,cy,vy,rot,dist,lock=0,last=0,vis=true,raf=0,shake=0;
function size(){dpr=Math.min(devicePixelRatio||1,2);W=box.clientWidth;cv.width=W*dpr;cv.height=GH*dpr;x.setTransform(dpr,0,0,dpr,0,0)}
function reset(){spikes=[];sp=300;cy=0;vy=0;rot=0;dist=0;score=0;shake=0;nextAt=W+200;$('g-score').textContent=0}
let nextAt=0;
function spawn(){const n=Math.random()<.25?2:1;spikes.push({x:W+40,n,p:false});nextAt=dist+Math.max(sp*.62,230)+Math.random()*sp*.55+(n-1)*40}
function jump(){if(cy===0){vy=JV;}}
function start(){reset();state='run';tries++;$('g-tries').textContent=tries;msg.style.display='none'}
function die(){state='dead';shake=.25; lock=performance.now()+220;msg.innerHTML='💥 Puntos: <b>'+score+'</b> · Toca para reintentar';msg.style.display='block'}
function act(){if(state==='run')jump();else if(performance.now()>=lock){start();jump()}}
box.addEventListener('pointerdown',e=>{e.preventDefault();act()});
box.addEventListener('keydown',e=>{if(e.code==='Space'||e.code==='ArrowUp'||e.code==='Enter'){e.preventDefault();act()}});
addEventListener('keydown',e=>{if((e.code==='Space'||e.code==='ArrowUp')&&vis&&!e.repeat&&!/^(INPUT|TEXTAREA|BUTTON|A|SUMMARY)$/.test(document.activeElement.tagName)&&document.activeElement!==box){e.preventDefault();act()}});
function step(dt){
 if(state==='run'){sp=Math.min(300+score*9,540);dist+=sp*dt;
  vy+=GRAV*dt;cy-=vy*dt;if(cy<=0){cy=0;vy=0;rot=Math.round(rot/(Math.PI/2))*(Math.PI/2)}else rot+=dt*Math.PI*2.1;
  if(dist>=nextAt)spawn();
  const cx=W*.18;
  spikes.forEach(s=>{s.x-=sp*dt;const sw=32*s.n;
   if(!s.p&&s.x+sw<cx){s.p=true;score+=1;$('g-score').textContent=score}
   if(cx+S-6>s.x+5&&cx+6<s.x+sw-5&&cy<GR*.55-2&&state==='run'){die()}});
  spikes=spikes.filter(s=>s.x>-100)}
 else if(state==='idle'){dist+=120*dt;if(!spikes||!spikes.length)reset();}
 if(shake>0)shake-=dt}
function draw(){
 x.clearRect(0,0,W,GH);x.save();if(shake>0)x.translate((Math.random()-.5)*8,(Math.random()-.5)*8);
 const gy=GH-GR;
 // suelo
 const gr=x.createLinearGradient(0,gy,0,GH);gr.addColorStop(0,'rgba(0,240,255,.22)');gr.addColorStop(1,'rgba(0,240,255,.03)');
 x.fillStyle=gr;x.fillRect(0,gy,W,GR);
 x.strokeStyle='rgba(0,240,255,.25)';x.lineWidth=2;const off=dist%44;
 for(let i=-off;i<W;i+=44){x.beginPath();x.moveTo(i,gy);x.lineTo(i,GH);x.stroke()}
 x.shadowColor='#00f0ff';x.shadowBlur=18;x.strokeStyle='#00f0ff';x.lineWidth=3;x.beginPath();x.moveTo(0,gy);x.lineTo(W,gy);x.stroke();
 // pinchos
 x.fillStyle='#00f0ff';x.shadowBlur=10;
 (spikes||[]).forEach(s=>{for(let k=0;k<s.n;k++){const px=s.x+k*32;x.beginPath();x.moveTo(px,gy);x.lineTo(px+16,gy-34);x.lineTo(px+32,gy);x.closePath();x.fill()}});
 // cubo
 if(state!=='dead'||true){const cx=W*.18;x.save();x.translate(cx+S/2,gy-cy-S/2);x.rotate(rot);
  x.shadowBlur=18;x.fillStyle=state==='dead'?'#ff4d6d':'#5ffbff';x.fillRect(-S/2,-S/2,S,S);
  x.shadowBlur=0;x.strokeStyle='#e6ffff';x.lineWidth=3;x.strokeRect(-S/2+1.5,-S/2+1.5,S-3,S-3);
  x.fillStyle='#021018';x.fillRect(-7,-6,4,5);x.fillRect(4,-6,4,5);x.restore()}
 x.restore()}
function loop(t){raf=0;if(!vis)return;const dt=Math.min((t-last)/1000||0,.05);last=t;
 if(state==='idle'&&!spikes.length)reset();
 if(state==='idle'){ // demo suave: pinchos desplazándose, sin colisión
  if(dist>=nextAt)spawn();spikes.forEach(s=>s.x-=120*dt);spikes=spikes.filter(s=>s.x>-100);dist+=120*dt}
 else step(dt);
 draw();raf=requestAnimationFrame(loop)}
function kick(){if(!raf){last=performance.now();raf=requestAnimationFrame(loop)}}
new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis)kick()}).observe(box);
addEventListener('resize',()=>{size();draw()});
size();reset();draw();kick();
})();
