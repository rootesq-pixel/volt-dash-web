const C=window.VOLT||{};
const $=id=>document.getElementById(id);
$('ver').textContent=C.version||'';
['dl-hero','dl-gofile','dl-sticky'].forEach(i=>{if(C.gofile){$(i).href=C.gofile;$(i).target='_blank';$(i).rel='noopener'}});
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
