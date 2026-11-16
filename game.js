(function(){
var CX=240,CY=320,K=.04,TOTAL=8,AR0=3750;
var wrap=document.getElementById('wrap'),ov=document.getElementById('ov'),leftEl=document.getElementById('left'),winsEl=document.getElementById('wins'),dashB=document.getElementById('dash'),radar=document.getElementById('radar'),rx=radar.getContext('2d');
var wins=0;try{wins=+localStorage.getItem('rr-wins')||0}catch(e){}
winsEl.textContent=wins;
var snapC=true,DM=[.8,1,1.35],diff=0,kos=0,slow=0,pw=0,orb=null,orbT=5,AC=null,kosEl=document.getElementById('kos'),popEl=document.getElementById('pop');
try{kos=+localStorage.getItem('rr-kos')||0}catch(e){}kosEl.textContent=kos;
function snd(f,d,ty,v){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();var o=AC.createOscillator(),g=AC.createGain(),n=AC.currentTime;o.type=ty||'square';o.frequency.setValueAtTime(f,n);o.frequency.exponentialRampToValueAtTime(Math.max(30,f*.4),n+d);g.gain.setValueAtTime(v||.08,n);g.gain.exponentialRampToValueAtTime(.001,n+d);o.connect(g);g.connect(AC.destination);o.start();o.stop(n+d)}catch(e){}}
function pop(t){popEl.textContent=t;popEl.classList.remove('on');void popEl.offsetWidth;popEl.classList.add('on')}
function grab(ty){snd(ty?220:520,.4,'sawtooth',.1);pop(ty?'QUAKE!':'MEGA ROCK!');var p=R[0];
 if(ty){R.forEach(function(r){if(r===p||!r.alive||r.fall)return;var dx=r.x-p.x,dy=r.y-p.y,d=Math.hypot(dx,dy)||1;if(d<1400){var k=1400*(1-d/1400)+300;r.vx+=dx/d*k;r.vy+=dy/d*k;r.lh=p}});shake=10;for(var i=0;i<30;i++)burst(p.x,p.y,0xff6a2b,1)}
 else{pw=8;p.g.scale.setScalar(1.6);p.r=42;p.bm=p.r*p.r/576*PM}}
var ROCKS=[{n:'Pebble Pal',c:0xffcf70,p:0,mass:1,spd:1,dsh:1,gl:0,d:'Balanced'},{n:'Obsidian',c:0x30304a,p:40,mass:1.3,spd:1,dsh:1,gl:0,d:'+30% weight'},{n:'Crystal',c:0x6fe3ff,p:80,mass:1,spd:1.25,dsh:1,gl:.15,d:'+25% speed'},{n:'Magma',c:0xff5a14,p:150,mass:1.1,spd:1,dsh:1.35,gl:.5,d:'+35% dash force, glows'},{n:'Cosmic',c:0xb070ff,p:300,mass:1.25,spd:1.2,dsh:1.25,gl:.6,d:'Best of everything'}];
var UPS=[['dash','Dash power','+25% ram force per level',5,15],['cool','Dash recharge','12% faster per level',5,15],['spd','Speed','+10% speed per level',5,10],['arm','Armor','+12% weight per level',5,20],['hook','Grapple hook','Press G or Hook: reels in the nearest rival. More range and faster recharge per level',5,30],['rev','Phoenix','Survive a fall, once per level each match',3,50]];
var sv={pts:0,own:[0],sel:0,up:{}};
try{var q=JSON.parse(localStorage.getItem('rr-save'));if(q)sv=Object.assign(sv,q)}catch(e){}
sv.up=Object.assign({dash:0,cool:0,spd:0,arm:0,hook:0,rev:0},sv.up);
var up=sv.up,rk=ROCKS[sv.sel]||ROCKS[0],PM=1,revs=0,hk={t:0,r:null},hkCd=0,earned=0,shopEl=document.getElementById('shop'),hookB=document.getElementById('hook');
function save(){try{localStorage.setItem('rr-save',JSON.stringify(sv))}catch(e){}}
function upd(){document.getElementById('ptsP').textContent='Points: '+sv.pts}
function shop(){var h='<h1>Shop</h1><p>Points: <b style="color:#ffb347">'+sv.pts+'</b></p><div class="sh"><h3>Rocks</h3>';
 ROCKS.forEach(function(r,i){var own=sv.own.indexOf(i)>=0;h+='<div class="it"><span><b>'+r.n+'</b><br><small>'+r.d+'</small></span><button data-r="'+i+'">'+(sv.sel===i?'Equipped':own?'Equip':'Buy '+r.p)+'</button></div>'});
 h+='<h3>Upgrades</h3>';UPS.forEach(function(u,i){var l=sv.up[u[0]],mx=l>=u[3];h+='<div class="it"><span><b>'+u[1]+'</b> '+'●'.repeat(l)+'○'.repeat(u[3]-l)+'<br><small>'+u[2]+'</small></span><button data-u="'+i+'"'+(mx?' disabled':'')+'>'+(mx?'Maxed':'Buy '+u[4]*(l+1))+'</button></div>'});
 shopEl.innerHTML=h+'</div><button id="back">Back</button>'}
function doHook(){var p=R[0];if(!run||!up.hook||hkCd>0||!p.alive||p.fall)return;var best=null,bd=1e9;
 R.forEach(function(r){if(r===p||!r.alive||r.fall)return;var d=Math.hypot(r.x-p.x,r.y-p.y);if(d<bd){bd=d;best=r}});
 if(!best||bd>900+500*up.hook){snd(100,.1,'square',.05);return}
 best.lh=p;hk={t:.35,r:best};hkCd=Math.max(1.2,5-.7*up.hook);snd(500,.25,'sawtooth',.08)}
if(!window.THREE){document.getElementById('msg').textContent='The 3D engine could not load. Check your connection and reload.';document.getElementById('go').classList.add('hide');return}
var COLS=[0xc9b79c,0x9fb4c7,0xb79fc7,0xa6c79f,0xc79f9f,0xc7c09f];
var THEMES=[
 {bg:0x2a0d06,base:'#b82a0c',g1:'rgba(255,190,60,.9)',g0:'rgba(255,90,20,0)',light:0xff5a14,stone:'#7b6f65'},
 {bg:0x07200f,base:'#0c6a2a',g1:'rgba(170,255,80,.9)',g0:'rgba(40,200,60,0)',light:0x5aff3c,stone:'#6b7566'},
 {bg:0x1a0a2e,base:'#3a0c6a',g1:'rgba(220,130,255,.9)',g0:'rgba(150,60,255,0)',light:0xb45aff,stone:'#6e6478'}];
var scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(60,.75,.1,400);
var ren=new THREE.WebGLRenderer({antialias:true});ren.shadowMap.enabled=true;ren.shadowMap.type=THREE.PCFSoftShadowMap;
ren.domElement.className='gl';wrap.insertBefore(ren.domElement,wrap.firstChild);
function size(){var w=wrap.clientWidth,h=wrap.clientHeight;ren.setPixelRatio(Math.min(devicePixelRatio||1,2));ren.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}
addEventListener('resize',size);size();
scene.add(new THREE.AmbientLight(0xffd9b0,.6));
var sun=new THREE.DirectionalLight(0xfff0dd,.95);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
var sc=sun.shadow.camera;sc.left=-24;sc.right=24;sc.top=24;sc.bottom=-24;sc.near=1;sc.far=70;scene.add(sun,sun.target);
var glowL=new THREE.PointLight(0xff5a14,1.6,60);scene.add(glowL);
function tex(w,fn){var c=document.createElement('canvas');c.width=c.height=w;fn(c.getContext('2d'),w);return new THREE.CanvasTexture(c)}
var lava=new THREE.Mesh(new THREE.PlaneGeometry(700,700),new THREE.MeshBasicMaterial());lava.rotation.x=-Math.PI/2;lava.position.y=-4;scene.add(lava);
var arena=new THREE.Mesh(new THREE.CylinderGeometry(1,.8,3,48),[new THREE.MeshStandardMaterial({color:0x4a413a,flatShading:true}),new THREE.MeshStandardMaterial(),new THREE.MeshStandardMaterial({color:0x2a2420})]);
arena.position.y=-1.5;arena.receiveShadow=true;scene.add(arena);
var rg=new THREE.Group(),og=new THREE.Group();scene.add(rg,og);
var hLine=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,1,6).rotateX(Math.PI/2),new THREE.MeshBasicMaterial({color:0x7fd6ff}));hLine.visible=false;scene.add(hLine);
var eyeG=new THREE.SphereGeometry(1,12,10),whiteM=new THREE.MeshStandardMaterial({color:0xffffff}),blackM=new THREE.MeshStandardMaterial({color:0x111111}),browM=new THREE.MeshStandardMaterial({color:0x222222});
var ringM=new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.DoubleSide});
var rockG=new THREE.IcosahedronGeometry(1,1);
function hash(v){var s=Math.sin(v.x*12.9898+v.y*78.233+v.z*37.719)*43758.5453;return s-Math.floor(s)}
(function(){var p=rockG.attributes.position,v=new THREE.Vector3();for(var i=0;i<p.count;i++){v.fromBufferAttribute(p,i);var s=.82+.34*hash(v.clone().normalize().multiplyScalar(3));p.setXYZ(i,v.x*s,v.y*s*.88,v.z*s)}rockG.computeVertexNormals()})();
var R,obs=[],parts=[],t,run,arenaR,shake,keys={},nx0=0,ny0=0,hasPtr=false,out,last=0,camH=Math.PI,camT=new THREE.Vector3(),N=48,NX=[],NY=[],COSP=1,theme;
var rc=new THREE.Raycaster(),gp=new THREE.Plane(new THREE.Vector3(0,1,0),0),v2=new THREE.Vector2(),hit=new THREE.Vector3();
function buildMap(){
 theme=THEMES[Math.floor(Math.random()*3)];
 N=[48,6,8,5,4][Math.floor(Math.random()*5)];COSP=Math.cos(Math.PI/N);AR0=3750/COSP;NX=[];NY=[];
 for(var k=0;k<N;k++){var a=(k+.5)*6.2832/N;NX.push(Math.sin(a));NY.push(Math.cos(a))}
 arena.geometry.dispose();arena.geometry=new THREE.CylinderGeometry(1,.8,3,N);
 var old=lava.material.map,oldT=arena.material[1].map;
 lava.material.map=tex(256,function(g,w){g.fillStyle=theme.base;g.fillRect(0,0,w,w);for(var i=0;i<60;i++){var x=Math.random()*w,y=Math.random()*w,r=10+Math.random()*30,gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,theme.g1);gr.addColorStop(1,theme.g0);g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2)}});
 lava.material.map.wrapS=lava.material.map.wrapT=THREE.RepeatWrapping;lava.material.map.repeat.set(10,10);lava.material.needsUpdate=true;
 arena.material[1].map=tex(256,function(g,w){g.fillStyle=theme.stone;g.fillRect(0,0,w,w);g.strokeStyle='rgba(0,0,0,.22)';g.lineWidth=2;for(var i=0;i<22;i++){g.beginPath();var x=Math.random()*w,y=Math.random()*w;g.moveTo(x,y);g.lineTo(x+(Math.random()-.5)*80,y+(Math.random()-.5)*80);g.stroke()}});
 arena.material[1].needsUpdate=true;if(old)old.dispose();if(oldT)oldT.dispose();
 scene.background=new THREE.Color(theme.bg);scene.fog=new THREE.Fog(theme.bg,45,140);glowL.color.setHex(theme.light);
 while(og.children.length)og.remove(og.children[0]);obs=[];
 var ap0=AR0*COSP,cnt=4+Math.floor(Math.random()*7);
 for(var i=0;i<cnt;i++)for(var tries=0;tries<12;tries++){
  var a=Math.random()*6.28,d=300+Math.random()*(.5*ap0-300),rad=60+Math.random()*60,px=CX+Math.cos(a)*d,py=CY+Math.sin(a)*d,ok=true;
  obs.forEach(function(o){if(Math.hypot(o.x-px,o.y-py)<o.r+rad+30)ok=false});
  if(!ok)continue;
  var m=new THREE.Mesh(new THREE.CylinderGeometry(1,1.15,1,10),new THREE.MeshStandardMaterial({color:0x5a4f47,flatShading:true}));
  m.scale.set(rad*K,5,rad*K);m.position.set((px-CX)*K,2.5,(py-CY)*K);m.castShadow=true;m.receiveShadow=true;og.add(m);obs.push({x:px,y:py,r:rad});break}
}
function edge(x,y){var ax=x-CX,ay=y-CY,m=-1e9;for(var k=0;k<N;k++){var d=ax*NX[k]+ay*NY[k];if(d>m)m=d}return m-arenaR*COSP}
function mk(i,you,ring){var a=you?Math.PI/2:(i-1)/(TOTAL-1)*6.283-.4,r=you?26:22,rr=r*K,g=new THREE.Group();
 var mat=new THREE.MeshStandardMaterial({color:you?rk.c:COLS[i%COLS.length],flatShading:true,roughness:.9,emissive:0xff8a20,emissiveIntensity:0});
 var body=new THREE.Mesh(rockG,mat);body.scale.set(rr,rr,rr);body.castShadow=true;g.add(body);
 var face=new THREE.Group();g.add(face);
 [-1,1].forEach(function(s){var w=new THREE.Mesh(eyeG,whiteM);w.scale.setScalar(rr*.3);w.position.set(s*rr*.38,rr*.28,rr*.82);face.add(w);
  var b=new THREE.Mesh(eyeG,blackM);b.scale.setScalar(rr*.15);b.position.set(s*rr*.38,rr*.28,rr*1.07);face.add(b);
  var br=new THREE.Mesh(new THREE.BoxGeometry(rr*.5,rr*.08,rr*.08),browM);br.position.set(s*rr*.38,rr*.62,rr*.85);br.rotation.z=-s*.45;face.add(br)});
 if(you){var rg2=new THREE.Mesh(new THREE.RingGeometry(rr*1.25,rr*1.5,32),ringM);rg2.rotation.x=-Math.PI/2;rg2.position.y=-rr*.72;g.add(rg2)}
 rg.add(g);var bm=r*r/576*(you?PM:1);
 return{x:CX+Math.cos(a)*ring,y:CY+Math.sin(a)*ring,vx:0,vy:0,r:r,bm:bm,m:bm,you:you,dash:0,cd:0,fall:0,alive:true,rot:Math.random()*6,aiT:2+Math.random()*3,dx:0,dy:-1,g:g,body:body,face:face,mat:mat,rr:rr}}
function reset(){earned=0;rk=ROCKS[sv.sel];PM=(1+.12*up.arm)*rk.mass;revs=up.rev;hkCd=0;hk={t:0,r:null};while(rg.children.length)rg.remove(rg.children[0]);parts.forEach(function(p){scene.remove(p.m)});parts=[];if(orb){scene.remove(orb.m);orb=null}pw=0;orbT=5;slow=0;
 buildMap();arenaR=AR0;var ring=arenaR*COSP*.6;
 R=[];for(var i=0;i<TOTAL;i++)R.push(mk(i,i===0,ring));
 t=0;shake=0;out=0;camH=Math.PI;hasPtr=false;snapC=true;render();count()}
function count(){var n=0;R.forEach(function(r){if(r.alive&&!r.fall)n++});leftEl.textContent=n;return n}
function pt(e){var b=ren.domElement.getBoundingClientRect();nx0=(e.clientX-b.left)/b.width*2-1;ny0=-((e.clientY-b.top)/b.height)*2+1;hasPtr=true}
wrap.addEventListener('pointermove',pt);wrap.addEventListener('pointerdown',pt);
function doDash(r,dx,dy){if(r.cd>0||r.fall)return;if(!r.you){var j=(Math.random()-.5)*.7,c=Math.cos(j),s=Math.sin(j),nx=dx*c-dy*s;dy=dx*s+dy*c;dx=nx}
 var l=Math.hypot(dx,dy)||1,imp=r.you?1500*(1+.25*up.dash)*rk.dsh:700*DM[diff];r.vx+=dx/l*imp;r.vy+=dy/l*imp;r.dash=r.you?.35:.28;r.cd=r.you?.9*Math.pow(.88,up.cool):1.8/DM[diff];r.m=r.bm*(r.you?4:2.6);burst(r.x,r.y,0xffb347,8);snd(r.you?340:260,.2,'sawtooth',.07)}
dashB.addEventListener('pointerdown',function(e){e.stopPropagation();var p=R[0];doDash(p,p.dx,p.dy)});
addEventListener('keydown',function(e){keys[e.key]=1;if(e.key===' '&&run){e.preventDefault();var p=R[0];doDash(p,p.dx,p.dy)}if(e.key==='Enter'&&!run&&shopEl.classList.contains('hide'))start();if((e.key==='g'||e.key==='G')&&run)doHook()});
addEventListener('keyup',function(e){keys[e.key]=0});
var pg=new THREE.TetrahedronGeometry(.16);
function burst(px,py,c,n){for(var i=0;i<n&&parts.length<90;i++){var a=Math.random()*6.28,s=(40+Math.random()*140)*K;
 var m=new THREE.Mesh(pg,new THREE.MeshBasicMaterial({color:c}));m.position.set((px-CX)*K,.8,(py-CY)*K);scene.add(m);
 parts.push({m:m,vx:Math.cos(a)*s,vz:Math.sin(a)*s,vy:2+Math.random()*4,l:.7})}}
function step(dt){
 t+=dt;shake=Math.max(0,shake-dt*30);
 if(t>12)arenaR=Math.max(AR0*.35,AR0-(t-12)*AR0/110);
 var alive=R.filter(function(r){return r.alive&&!r.fall});
 var fx=Math.sin(camH),fy=Math.cos(camH);
 R.forEach(function(r){
  if(!r.alive)return;
  r.cd=Math.max(0,r.cd-dt);r.dash=Math.max(0,r.dash-dt);if(r.dash<=0)r.m=r.bm;else burst(r.x,r.y,0xffb347,1);
  if(r.fall>0){r.fall+=dt;r.x+=r.vx*dt*.3;r.y+=r.vy*dt*.3;if(r.fall>.9){r.alive=false;if(r.you)out=alive.length+1;burst(r.x,r.y,0xff6a2b,14);count()}return}
  var ax=0,ay=0,acc=700*DM[diff];
  if(r.you){acc=1100*(1+.1*up.spd)*rk.spd;
   var fw=(keys.ArrowUp||keys.w?1:0)-(keys.ArrowDown||keys.s?1:0),rt=(keys.ArrowRight||keys.d?1:0)-(keys.ArrowLeft||keys.a?1:0);
   if(fw||rt){ax=fw*fx-rt*fy;ay=fw*fy+rt*fx;var l0=Math.hypot(ax,ay);ax/=l0;ay/=l0}
   else if(hasPtr){v2.set(nx0,ny0);rc.setFromCamera(v2,cam);
    if(rc.ray.intersectPlane(gp,hit)){var px=hit.x/K+CX-r.x,py=hit.z/K+CY-r.y,pl=Math.hypot(px,py);if(pl>16){ax=px/pl;ay=py/pl}}
    else{ax=fx;ay=fy}}
   if(ax||ay){var l=Math.hypot(ax,ay);r.dx=ax/l;r.dy=ay/l}
  }else{
   var best=null,bd=1e9;alive.forEach(function(o){if(o!==r){var d=Math.hypot(o.x-r.x,o.y-r.y);if(d<bd){bd=d;best=o}}});
   if(best){var px=best.x-r.x,py=best.y-r.y,pl=bd||1;ax=px/pl;ay=py/pl;r.dx=ax;r.dy=ay;
    var ed=edge(r.x,r.y);
    if(ed>-90){var cx=CX-r.x,cy=CY-r.y,cl=Math.hypot(cx,cy)||1;ax=cx/cl;ay=cy/cl}
    r.aiT-=dt;if(bd<100&&r.aiT<=0&&ed<-70){doDash(r,px/pl,py/pl);r.aiT=(2.5+Math.random()*2.5)/DM[diff]}}
  }
  r.vx+=ax*acc*dt;r.vy+=ay*acc*dt;
  var f=Math.exp(-2.2*dt);r.vx*=f;r.vy*=f;r.x+=r.vx*dt;r.y+=r.vy*dt;
  r.rot+=(r.vx+r.vy)*dt*.01;
  if(edge(r.x,r.y)>r.r*.4){if(r.you&&revs>0){revs--;r.x=CX;r.y=CY;r.vx=r.vy=0;pop('PHOENIX REVIVE!');snd(700,.5,'triangle',.12);shake=8;for(var q2=0;q2<20;q2++)burst(r.x,r.y,0xffd24a,1)}else{r.fall=.001;if(!r.you){snd(160,.5,'sawtooth',.1);if(r.lh===R[0]&&R[0].alive){kos++;kosEl.textContent=kos;try{localStorage.setItem('rr-kos',kos)}catch(e){}pop(['KO!','SMASHED!','BONK!','ROCKED!'][Math.floor(Math.random()*4)]+' +5');sv.pts+=5;earned+=5;save();slow=.4}}}}
 });
 hkCd=Math.max(0,hkCd-dt);
 if(hk.t>0){hk.t-=dt;var hp=R[0],hq=hk.r;if(hq&&hq.alive&&!hq.fall&&hp.alive){var hx=hq.x-hp.x,hy=hq.y-hp.y,hd=Math.hypot(hx,hy)||1,gx=hp.x+hx/hd*(hp.r+hq.r+8),gy=hp.y+hy/hd*(hp.r+hq.r+8),hf=1-Math.exp(-14*dt);hq.x+=(gx-hq.x)*hf;hq.y+=(gy-hq.y)*hf;hq.vx=hq.vy=0}}
 for(var i=0;i<R.length;i++){var a=R[i];if(!a.alive||a.fall)continue;
  for(var j=i+1;j<R.length;j++){var b=R[j];if(!b.alive||b.fall)continue;
   var dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy),mr=a.r+b.r;
   if(d<mr&&d>0){var nx=dx/d,ny=dy/d,ov2=mr-d,tm=a.m+b.m;
    a.x-=nx*ov2*b.m/tm;a.y-=ny*ov2*b.m/tm;b.x+=nx*ov2*a.m/tm;b.y+=ny*ov2*a.m/tm;
    var vn=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;
    if(vn<0){var jj=-(1.25)*vn/(1/a.m+1/b.m);a.vx-=jj*nx/a.m;a.vy-=jj*ny/a.m;b.vx+=jj*nx/b.m;b.vy+=jj*ny/b.m;
     if(-vn>60){a.lh=b;b.lh=a}if(-vn>150){shake=Math.min(8,-vn/60);burst((a.x+b.x)/2,(a.y+b.y)/2,0xfff1c9,6);snd(110+Math.random()*60,.15,'square',.1);if(-vn>380)slow=.12}}}}
  obs.forEach(function(o){var dx=a.x-o.x,dy=a.y-o.y,d=Math.hypot(dx,dy),mr=a.r+o.r;
   if(d<mr&&d>0){var nx=dx/d,ny=dy/d;a.x=o.x+nx*mr;a.y=o.y+ny*mr;var vn=a.vx*nx+a.vy*ny;if(vn<0){a.vx-=1.8*vn*nx;a.vy-=1.8*vn*ny;if(-vn>150)burst(a.x,a.y,0xcfc4b8,4)}}})}
 for(i=parts.length-1;i>=0;i--){var p=parts[i];p.m.position.x+=p.vx*dt;p.m.position.z+=p.vz*dt;p.vy-=14*dt;p.m.position.y+=p.vy*dt;p.m.rotation.x+=dt*8;p.l-=dt;if(p.l<=0){scene.remove(p.m);parts.splice(i,1)}}
 if(Math.random()<dt*14&&parts.length<80){var ea=Math.random()*6.28,ed2=(arenaR+200+Math.random()*1500)*K,em=new THREE.Mesh(pg,new THREE.MeshBasicMaterial({color:theme.light}));em.position.set(Math.cos(ea)*ed2,-3.5,Math.sin(ea)*ed2);scene.add(em);parts.push({m:em,vx:0,vz:0,vy:5+Math.random()*7,l:1.6})}
 var pr=R[0];camH+=((keys.e?1:0)-(keys.q?1:0))*1.8*dt;
 if(pw>0){pw-=dt;if(pw<=0){pr.g.scale.setScalar(1);pr.r=26;pr.bm=676/576*PM}}
 orbT-=dt;if(!orb&&orbT<=0&&pr.alive){var oa=Math.random()*6.28,od=Math.random()*arenaR*COSP*.55,ox=CX+Math.cos(oa)*od,oy=CY+Math.sin(oa)*od,okk=true;obs.forEach(function(o){if(Math.hypot(o.x-ox,o.y-oy)<o.r+30)okk=false});
  if(okk){var ty2=Math.random()<.5?0:1,om=new THREE.Mesh(new THREE.OctahedronGeometry(.9),new THREE.MeshBasicMaterial({color:ty2?0xff3c3c:0xc060ff}));om.position.set((ox-CX)*K,1.2,(oy-CY)*K);scene.add(om);orb={m:om,x:ox,y:oy,t:ty2,life:25}}orbT=4}
 if(orb){orb.life-=dt;orb.m.rotation.y+=dt*3;orb.m.position.y=1.2+Math.sin(t*4)*.25;
  if(pr.alive&&!pr.fall&&Math.hypot(pr.x-orb.x,pr.y-orb.y)<pr.r+70){grab(orb.t);scene.remove(orb.m);orb=null}
  else if(orb.life<=0||edge(orb.x,orb.y)>-40){scene.remove(orb.m);orb=null}}
 var n=count();
 if(!pr.alive){finish(false)}else if(n<=1&&!pr.fall){finish(true)}
}
function drawRadar(){
 rx.clearRect(0,0,192,192);var sc2=88/AR0,fx=Math.sin(camH),fy=Math.cos(camH),cx=96,cy=96;
 function map(x,y){var wx=x-CX,wz=y-CY;return[cx+(wx*-fy+wz*fx)*sc2,cy-(wx*fx+wz*fy)*sc2]}
 rx.strokeStyle='rgba(255,255,255,.55)';rx.lineWidth=2;rx.beginPath();
 for(var k=0;k<=N;k++){var a=k*6.2832/N,p=map(CX+Math.sin(a)*arenaR,CY+Math.cos(a)*arenaR);k?rx.lineTo(p[0],p[1]):rx.moveTo(p[0],p[1])}rx.stroke();
 rx.fillStyle='#8a7d72';obs.forEach(function(o){var p=map(o.x,o.y);rx.beginPath();rx.arc(p[0],p[1],o.r*sc2,0,6.28);rx.fill()});
 R.forEach(function(r){if(!r.alive||r.fall)return;var p=map(r.x,r.y);rx.fillStyle=r.you?'#ffcf70':'#ff6a6a';rx.beginPath();rx.arc(p[0],p[1],r.you?7:5,0,6.28);rx.fill()});
}
function render(){
 var s=arenaR*K;arena.scale.set(s,1,s);
 lava.material.map.offset.x=t*.02;lava.material.map.offset.y=t*.012;glowL.intensity=1.5+.3*Math.sin(t*5);
 R.forEach(function(r){var g=r.g;if(!r.alive){g.visible=false;return}
  var f=r.fall;g.position.set((r.x-CX)*K,r.rr*.8*g.scale.x-f*f*7,(r.y-CY)*K);g.rotation.z=f*1.4;g.rotation.x=f*.8;
  r.body.rotation.y=r.rot;r.body.rotation.x=r.rot*.6;
  r.face.rotation.y=Math.atan2(r.dx,r.dy);
  r.mat.emissiveIntensity=r.dash>0?.9:(r.you?rk.gl:0)});
 var p0=R[0].g.position;if(snapC){camT.set(p0.x,0,p0.z);snapC=false}else{camT.x+=(p0.x-camT.x)*.12;camT.z+=(p0.z-camT.z)*.12}
 var fx=Math.sin(camH),fz=Math.cos(camH),sx=shake?(Math.random()-.5)*shake*.06:0;
 cam.position.set(camT.x-fx*11+sx,9.5,camT.z-fz*11);cam.lookAt(camT.x+fx*1.5,0,camT.z+fz*1.5);cam.updateMatrixWorld();
 cam.fov+=((R[0].dash>0?80:60)-cam.fov)*.2;cam.updateProjectionMatrix();
 sun.position.set(camT.x+8,22,camT.z+8);sun.target.position.set(camT.x,0,camT.z);glowL.position.set(camT.x,-2.5,camT.z);
 if(R[0].alive)dashB.classList.toggle('cd',R[0].cd>0);hookB.classList.toggle('cd',hkCd>0);
 if(hk.t>0&&hk.r&&hk.r.alive){var A=R[0].g.position,B=hk.r.g.position;hLine.visible=true;hLine.position.set((A.x+B.x)/2,(A.y+B.y)/2,(A.z+B.z)/2);hLine.lookAt(B);hLine.scale.z=A.distanceTo(B)}else hLine.visible=false;
 drawRadar();ren.render(scene,cam)}
function loop(ts){if(!run)return;var dt=Math.min(.05,(ts-last)/1000);last=ts;if(slow>0){slow-=dt;dt*=.25}step(dt);render();if(run)requestAnimationFrame(loop)}
function start(){snd(400,.1,'triangle',.05);reset();ov.classList.add('hide');dashB.classList.remove('hide');radar.classList.remove('hide');if(up.hook)hookB.classList.remove('hide');run=true;last=performance.now();requestAnimationFrame(loop)}
function finish(win){run=false;dashB.classList.add('hide');radar.classList.add('hide');hookB.classList.add('hide');
 snd(win?660:90,.6,'triangle',.12);if(win){sv.pts+=10;earned+=10;wins++;winsEl.textContent=wins;try{localStorage.setItem('rr-wins',wins)}catch(e){}}
 document.getElementById('ttl').textContent=win?'Last rock standing!':'Into the lava!';
 document.getElementById('msg').textContent=win?'You knocked out every rival. Take a bow, boulder.':'You finished '+(out||2)+' of '+TOTAL+'. Dash at rivals when they’re near the edge.';
 document.getElementById('sub').textContent='Earned '+earned+' points this match. Wins: '+wins+'.';save();upd();
 document.getElementById('go').textContent=win?'Rumble again':'Try again';ov.classList.remove('hide');render()}
document.getElementById('go').addEventListener('click',start);
document.getElementById('dif').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;diff=+b.dataset.d;[].forEach.call(this.children,function(c){c.classList.toggle('sel',c===b)})});
shopEl.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
 if(b.id==='back'){shopEl.classList.add('hide');ov.classList.remove('hide');upd();return}
 if(b.dataset.r!==undefined){var i=+b.dataset.r,r=ROCKS[i];if(sv.own.indexOf(i)<0){if(sv.pts<r.p){snd(100,.2,'square',.08);return}sv.pts-=r.p;sv.own.push(i)}sv.sel=i}
 else if(b.dataset.u!==undefined){var u=UPS[+b.dataset.u],l=sv.up[u[0]],c=u[4]*(l+1);if(l>=u[3]||sv.pts<c){snd(100,.2,'square',.08);return}sv.pts-=c;sv.up[u[0]]++}
 snd(600,.15,'triangle',.08);save();shop()});
document.getElementById('shopB').addEventListener('click',function(){ov.classList.add('hide');shopEl.classList.remove('hide');shop()});
hookB.addEventListener('pointerdown',function(e){e.stopPropagation();doHook()});
upd();
reset();
})();
