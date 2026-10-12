const AG=[["El Mero Mero","#e6b422",120,110],["Correo","#3a7bd5",320,110],["Reuniones","#3cb371",520,110],
["Fractalito","#ff8c1a",120,330],["Claude","#9b59b6",320,330],["CoinMarketCap","#4fc3f7",520,330]];
const LUG={Sebastian:[700,470]};const A={};
AG.forEach(([n,col,x,y])=>{A[n]={n,col,dx:x,dy:y+84,x,y:y+84,q:[],estado:"Trabajando",bub:null,bt:0};LUG[n]=[x,y+84]});
const c=document.getElementById("c"),g=c.getContext("2d");let t=0,vistos=new Set(),demo=[],modo="";
function chile(ts){return new Date(ts).toLocaleString("es-CL",{timeZone:"America/Santiago",day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}
function escena(){g.fillStyle="#c9b48a";g.fillRect(0,0,800,520);
 for(let i=0;i<800;i+=20)for(let j=0;j<520;j+=20)if((i+j)/20%2){g.fillStyle="#bfa97f";g.fillRect(i,j,20,20)}
 g.fillStyle="#555";g.fillRect(0,0,800,30);g.fillStyle="#8fd3ff";for(let i=40;i<800;i+=120)g.fillRect(i,6,60,18);
 // sala de reuniones
 g.fillStyle="#6b8e6b";g.fillRect(640,50,150,170);g.fillStyle="#7a4b2a";g.fillRect(675,100,80,60);
 g.fillStyle="#fff";g.font="10px monospace";g.fillText("SALA DE REUNIONES",650,64);
 // oficina Sebastian
 g.fillStyle="#3b2a4a";g.fillRect(640,400,150,110);g.fillStyle="#7a4b2a";g.fillRect(690,440,40,64);
 g.fillStyle="#ffd54a";g.fillRect(722,470,4,4);g.fillStyle="#fff";g.fillText("SEBASTIAN",680,420);
 AG.forEach(([n,col,x,y])=>{g.fillStyle="#7a4b2a";g.fillRect(x-40,y,80,26);g.fillStyle="#5a3518";g.fillRect(x-40,y+26,80,4);
  g.fillStyle="#222";g.fillRect(x-12,y-14,24,16);g.fillStyle=(t>>4)%2?"#6f6":"#4c4";g.fillRect(x-10,y-12,20,12);
  g.fillStyle=col;g.fillRect(x-40,y+30,80,12);g.fillStyle="#000";g.font="9px monospace";g.textAlign="center";g.fillText(n,x,y+39);g.textAlign="left"})}
function avatar(a){const bob=a.mov?((t>>3)%2)*2:Math.sin(t/15+a.dx)*1;const x=a.x|0,y=(a.y+bob)|0;
 g.fillStyle="rgba(0,0,0,.25)";g.fillRect(x-8,a.y+14,16,4);g.fillStyle=a.col;g.fillRect(x-7,y-2,14,14);
 g.fillStyle="#f1c27d";g.fillRect(x-6,y-14,12,12);g.fillStyle="#000";g.fillRect(x-3,y-10,2,2);g.fillRect(x+2,y-10,2,2);
 g.fillStyle="#333";g.fillRect(x-6,y+12,5,4);g.fillRect(x+1,y+12,5,4);
 if(a.n=="El Mero Mero"){g.fillStyle="#ffd700";g.fillRect(x-6,y-18,12,4)}
 g.font="bold 10px monospace";g.textAlign="center";g.fillStyle="#000";g.fillText(a.n,x+1,y-21);g.fillStyle="#fff";g.fillText(a.n,x,y-22);g.textAlign="left";
 if(a.bub){g.font="11px monospace";const w=Math.min(260,g.measureText(a.bub).width+12);const bx=Math.max(4,Math.min(796-w,x-w/2)),by=y-58;
  g.fillStyle="#fff";g.fillRect(bx,by,w,22);g.fillRect(x-3,by+22,6,5);g.strokeStyle="#000";g.strokeRect(bx,by,w,22);g.fillStyle="#000";g.fillText(a.bub.slice(0,40),bx+6,by+15)}}
function paso(a){if(!a.q.length){a.mov=false;return}const s=a.q[0];
 if(s.k=="ir"){const dx=s.x-a.x,dy=s.y-a.y,d=Math.hypot(dx,dy);a.mov=true;if(d<2){a.x=s.x;a.y=s.y;a.q.shift()}else{a.x+=dx/d*2;a.y+=dy/d*2}}
 else if(s.k=="hablar"){a.mov=false;a.bub=s.txt;if(!s.t0)s.t0=t;if(t-s.t0>150){a.bub=null;a.q.shift()}}
 else if(s.k=="fin"){a.estado="Trabajando";a.q.shift();estado()}}
function animar(e){const a=A[e.de];if(!a)return;const [x,y]=LUG[e.para]||LUG["El Mero Mero"];
 a.estado=(e.tipo=="pide"?"Pidiendo a ":"Llevando a ")+e.para;a.q.push({k:"ir",x:x+30,y:y},{k:"hablar",txt:e.texto},{k:"ir",x:a.dx,y:a.dy},{k:"fin"});estado()}
function logear(e){const d=document.createElement("div");d.className="ev";d.innerHTML=`<span>${chile(e.ts)}</span> <b>${e.de} → ${e.para}</b><br>${e.texto}`;const L=document.getElementById("log");L.prepend(d);while(L.children.length>60)L.lastChild.remove()}
function estado(){document.getElementById("estado").innerHTML=Object.values(A).map(a=>`<div class="ag"><span class="dot" style="background:${a.col}"></span>${a.n}: <i>${a.estado}</i></div>`).join("")}
async function cargar(){let E;try{E=await (await fetch("eventos.json?"+Date.now())).json()}catch(x){E=window.EVENTOS_RESPALDO||[]}
 E.sort((a,b)=>a.ts<b.ts?-1:1);const nuevo=E.filter(e=>!vistos.has(e.ts+e.de+e.texto));const primero=!vistos.size;
 nuevo.forEach(e=>{vistos.add(e.ts+e.de+e.texto);logear(e)});
 const reciente=E.filter(e=>Date.now()-new Date(e.ts)<10*60e3);
 if(!primero)nuevo.forEach(animar);
 demo=(primero&&!reciente.length)||(!reciente.length&&!nuevo.length)?E.slice(-10):[];
 if(primero)reciente.forEach(animar);modo=demo.length?"(demo en bucle)":"(en vivo)";document.getElementById("modo").textContent=modo}
let di=0;setInterval(()=>{if(demo.length&&Object.values(A).every(a=>!a.q.length)){animar(demo[di++%demo.length])}},1500);
function loop(){t++;escena();Object.values(A).forEach(paso);Object.values(A).sort((a,b)=>a.y-b.y).forEach(avatar)}
estado();cargar();setInterval(cargar,60000);setInterval(loop,33);
if(location.search.includes("captura")){const a=A["Correo"];a.q=[];a.x=160;a.y=194;a.bub="Resumen Outlook listo";a.estado="Llevando a El Mero Mero";estado()}
