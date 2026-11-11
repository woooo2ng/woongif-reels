// ---------- ISTP 전용 소품 ----------
function earbuds(p,col=0xffffff){const h=p.userData.head;const ebs=[];
  for(const s of[-1,1]){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.SphereGeometry(0.055,10,8),lamb(col));g.add(b);
    const st=new THREE.Mesh(new THREE.BoxGeometry(0.03,0.11,0.03),lamb(col));st.position.set(0,-0.07,0.02);g.add(st);
    g.position.set(s*0.265,0.19,0.02);h.add(g);ebs.push(g)}
  p.userData.ebs=ebs;return p}
function brows(p,k=0.32){const h=p.userData.head;
  for(const s of[-1,1]){const b=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.025,0.02),lamb(0x1a1a1a));b.position.set(s*0.095,0.33,0.238);b.rotation.z=s*k;h.add(b)}return p}
function istp(r,side){const p=brows(earbuds(soldier(r,side)));setFace(p,false);return p}
function bob(p,t,k=1,sp=2.9){const u=p.userData;u.head.rotation.x=(Math.sin(t*Math.PI*sp)*0.09+0.02)*k;u.head.rotation.z=Math.sin(t*Math.PI*sp*0.5)*0.04*k}
function notes(scene,n,r,sz=0.0045){const a=[];for(let i=0;i<n;i++){const s=textSprite(i%2?'♪':'♫',90,i%3?'#ffd56b':'#ffffff',sz);scene.add(s);a.push({s,ph:r(),dx:(r()-0.5)*0.5})}return a}
function updNotes(a,t,anchor,on=1){a.forEach((q,i)=>{const lt=((t*0.6+q.ph)%1);const k=Math.sin(lt*Math.PI)*on;q.s.visible=k>0.02;
  q.s.position.set(anchor.x+q.dx+(i%2?0.38:-0.38),anchor.y+lt*0.9,anchor.z);q.s.scale.set(q.s.userData.base[0]*k,q.s.userData.base[1]*k,1)})}
function dragRifle(p){const a=p.userData.arms[1];if(!p.userData.drag){const R=rifle();a.add(R);R.position.set(0,-0.82,-0.32);R.rotation.x=2.62;p.userData.drag=R}p.userData.drag.visible=true}
function slump(p,k=1){const u=p.userData;u.head.rotation.x=0.38*k;u.hip.rotation.x=0.12*k;u.arms[0].rotation.z=-0.05;u.arms[1].rotation.z=0.05}
function trudge(p,t,k=1){walkPose(p,t*4.2,0.32*k);p.userData.arms[1].rotation.x=0.12;slump(p,k)}
function puff(scene,x,y,z,s=1){const g=new THREE.Group();g.position.set(x,y,z);scene.add(g);const ps=[];const r=rng(Math.round(x*100+z*7));
  for(let i=0;i<7;i++){const m=new THREE.Mesh(new THREE.IcosahedronGeometry(0.5,0),new THREE.MeshLambertMaterial({color:i<2?0xffc46b:0x9a968f,flatShading:true,transparent:true}));
    m.position.set((r()-0.5)*1.2,r()*0.8,(r()-0.5)*1.2);g.add(m);ps.push(m)}
  const fl=glowSprite('rgba(255,190,90,1)',3*s);g.add(fl);g.userData={ps,fl,s};g.visible=false;return g}
function updPuff(g,t,t0){const lt=t-t0;g.visible=lt>0&&lt<1.6;if(!g.visible)return;const s=g.userData.s;
  g.userData.ps.forEach((m,i)=>{const k=ease(lt/0.5);m.scale.setScalar(s*(0.3+k*(1.2+i*0.1)));m.position.y+=0.004;m.material.opacity=clamp01(1-(lt-0.6)/1.0)});
  g.userData.fl.material.opacity=clamp01(1-lt/0.3)}
function field(scene,r,o={}){
  ground(scene,o.g??0x9cb97a,300);
  const mud=new THREE.Mesh(new THREE.PlaneGeometry(80,7),lamb(0xa8946e));mud.rotation.x=-Math.PI/2;mud.position.set(0,0.01,o.mz??-1);scene.add(mud);
  for(let i=0;i<14;i++){const x=(i-6.5)*3.1+r()*0.6;const post=new THREE.Mesh(new THREE.BoxGeometry(0.09,0.9,0.09),lamb(0x5d4e3e));post.position.set(x,0.45,(o.mz??-1)+(i%2?0.4:-0.4));post.rotation.z=(r()-0.5)*0.3;scene.add(post)}
  for(const y of[0.35,0.7]){const w=new THREE.Mesh(new THREE.BoxGeometry(44,0.02,0.02),lamb(0x7d7d84));w.position.set(0,y,o.mz??-1);scene.add(w)}
  for(let i=0;i<9;i++){const h=new THREE.Mesh(new THREE.ConeGeometry(9+r()*6,5+r()*5,6),lamb(pick(r,[0x86a874,0x7d9f6c,0x93b07e])));h.position.set((i-4)*13+r()*4,0,-40-r()*12);scene.add(h)}
  for(let i=0;i<12;i++)tree(scene,(i-5.5)*4.4+r()*2,-18-r()*6,1.1,0x76a866);
}
function setSky(a,b){bgEl.style.background=`linear-gradient(${a},${b})`}
function lerpCol(c1,c2,k){const a=new THREE.Color(c1),b=new THREE.Color(c2);return '#'+a.lerp(b,clamp01(k)).getHexString()}
function sbub(scene,text,x,o={}){const b=makeBubble(text,{bg:o.bg,fg:o.fg,fs:64,size:o.size||0.0026});b.position.set(x,o.y??2.25,o.z??0);scene.add(b);scaleBubble(b,0);return b}
function sayBub(b,t,t0,t1,o){scaleBubble(b,t>=t0&&t<t1?pop((t-t0)/0.25):0)}

// ===== 0. 선전포고 (타이틀) =====
S[0]=()=>{
  setSky('#a9bccf','#e3eaf0 70%');
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xd9e2ea,30,95);addLights(scene,{hemi:1.5});
  const r=rng(11);field(scene,r,{mz:-1.2});
  const allies=[];for(let row=0;row<4;row++)for(let c=0;c<7;c++){const p=istp(r,ALLY);p.position.set((c-3)*1.25+(row%2)*0.3,0,1.6+row*1.5);p.rotation.y=Math.PI;scene.add(p);allies.push({p,ph:r()*6})}
  const foes=[];for(let row=0;row<3;row++)for(let c=0;c<7;c++){const p=istp(r,FOE);p.position.set((c-3)*1.3+0.4,0,-13.5-row*1.5);scene.add(p);foes.push({p,ph:r()*6})}
  const mound=sandbags(scene,0,-4.2,2.4,2);
  const EJ=brows(general(r,ENEMYG));EJ.position.set(0,0.55,-4.6);scene.add(EJ);setFace(EJ,true);
  const mega=new THREE.Mesh(new THREE.ConeGeometry(0.22,0.5,10,1,true),new THREE.MeshLambertMaterial({color:0xf0f0f0,side:THREE.DoubleSide,flatShading:true}));
  mega.rotation.x=-Math.PI/2;EJ.userData.hip.add(mega);
  const bE=bub(EJ,'전쟁을 선포한다!!',{y:2.3,bg:'#e4e0ff',fg:'#2d2766',size:0.0028});
  const hero=allies[3].p;const nts=notes(scene,6,r,0.0024);
  const C=cam(50);const CUT=EV(0).cut;
  const ch=chip('선전포고 청취율 0%');
  ui.insertAdjacentHTML('beforeend',`<div class="tag">ISTP × 전쟁편</div><div class="title1 out">온 세상이</div><div class="title2 out" style="color:${C_T}">ISTP인데</div><div class="title3 out">전쟁이 난다면?</div>`);
  const tag=ui.querySelector('.tag'),t1=ui.querySelector('.title1'),t2=ui.querySelector('.title2'),t3=ui.querySelector('.title3');
  const flash=div('flash');flash.style.background='#fff';
  const hv=new THREE.Vector3();
  return t=>{
    allies.forEach(q=>{standPose(q.p);bob(q.p,t+q.ph)});foes.forEach(q=>{standPose(q.p);bob(q.p,t+q.ph)});
    standPose(EJ);const sw=t>at(0,'e1')-0.3&&t<CUT;const sh=sw?Math.sin(t*22)*0.05:0;
    EJ.userData.arms[1].rotation.x=-1.75*(sw?1:ease((t-at(0,'e1')+0.6)/0.3));EJ.userData.arms[0].rotation.x=sw?-2.6:0;EJ.userData.arms[0].rotation.z=sw?-0.5+Math.sin(t*9)*0.25:0;
    EJ.userData.head.rotation.x=-0.15+sh;mega.position.set(0,0.95,0.42);
    scaleBubble(bE,0);
    if(t<CUT){const k=ease(t/CUT);C.position.set(-1.4+k*0.3,3.6-k*0.4,-11.4+k*1.8);C.lookAt(0.6,2.3,2.5)}
    else{hero.updateMatrixWorld(true);hero.userData.head.getWorldPosition(hv);const k=ease((t-CUT)/2.5);
      C.position.set(hv.x+0.75-k*0.1,hv.y+0.2,hv.z-1.6+k*0.2);C.lookAt(hv.x+0.08,hv.y+0.7,hv.z)}
    updNotes(nts,t,new THREE.Vector3(hv.x,hv.y+0.55,hv.z),t>CUT?1:0);
    const TE=at(0,'e1'),TC=endOf(0,'e1',-0.25);
    chipPop(ch,t,TC);ch.style.opacity=t<CUT?clamp01((t-TC)/0.08):0;
    flash.style.opacity=t>=CUT?clamp01(1-(t-CUT)/0.25)*0.7:0;
    const T0=0.05,out=clamp01((t-TE+0.15)/0.25),os=1-out;
    tag.style.transform=`translateX(-50%) scale(${pop((t-T0)/0.3)*os})`;tag.style.opacity=os;
    t1.style.transform=`scale(${pop((t-T0-0.1)/0.35)*os})`;t1.style.opacity=clamp01((t-T0-0.1)/0.1)*os;
    t2.style.transform=`scale(${pop((t-T0-0.35)/0.4)*os})`;t2.style.opacity=clamp01((t-T0-0.35)/0.1)*os;
    t3.style.transform=`scale(${pop((t-T0-0.65)/0.4)*os})`;t3.style.opacity=clamp01((t-T0-0.65)/0.1)*os;
    caption(0,t);renderer.render(scene,C);
  };
};

// ===== 1. 옆에서 포탄 '퉁' =====
S[1]=()=>{
  setSky('#a9bccf','#e3eaf0 70%');
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xdde5ec,30,95);addLights(scene,{hemi:1.5});
  const r=rng(21);field(scene,r,{mz:-1.2});
  const allies=[];for(let row=0;row<4;row++)for(let c=0;c<7;c++){const p=istp(r,ALLY);p.position.set((c-3)*1.25+(row%2)*0.3,0,1.6+row*1.5);p.rotation.y=Math.PI;scene.add(p);allies.push({p,ph:r()*6})}
  const foes=[];for(let row=0;row<3;row++)for(let c=0;c<7;c++){const p=istp(r,FOE);p.position.set((c-3)*1.3+0.4,0,-5.5-row*1.5);scene.add(p);foes.push({p,ph:r()*6})}
  const hero=allies[3].p;
  const B=EV(1).booms;const P1=puff(scene,hero.position.x+1.6,0,hero.position.z-0.6,1.0),P2=puff(scene,1.5,0,-1.2,1.6);
  const tung=[textSprite('퉁',60,'#e9e9e9',0.004),textSprite('퉁',60,'#e9e9e9',0.004)];tung.forEach(s=>scene.add(s));
  const nts=notes(scene,8,r,0.003);const C=cam(50);
  const ch=chip('노이즈캔슬링 착용률 100%');
  const hv=new THREE.Vector3();
  return t=>{
    allies.forEach(q=>{standPose(q.p);bob(q.p,t+q.ph)});foes.forEach(q=>{standPose(q.p);bob(q.p,t+q.ph)});
    updPuff(P1,t,B[0]);updPuff(P2,t,B[1]);
    tung[0].position.set(P1.position.x,1.6+(t-B[0])*0.3,P1.position.z);tung[0].visible=t>B[0]+0.05&&t<B[0]+1.3;
    tung[1].position.set(P2.position.x,2.4+(t-B[1])*0.3,P2.position.z);tung[1].visible=t>B[1]+0.05&&t<B[1]+1.3;
    hero.updateMatrixWorld(true);hero.userData.head.getWorldPosition(hv);
    const k=ease((t-2.3)/2.2);
    const a=new THREE.Vector3(hv.x+0.45,hv.y+0.55,hv.z-2.4),b=new THREE.Vector3(5.5,7.5,-14);
    C.position.copy(a.lerp(b,k));C.lookAt(new THREE.Vector3(hv.x+0.4,hv.y+0.25,hv.z).lerp(new THREE.Vector3(0.5,0.6,0),k));
    updNotes(nts,t,new THREE.Vector3(hv.x,hv.y+0.55,hv.z),1-k);
    // 멀리서 보면 모두 머리 위 ♪
    chipPop(ch,t,3.7);
    caption(1,t);renderer.render(scene,C);
  };
};
// 원경 ♪ (전원) — S[1]에서 k가 커지면 보이게 하려고 별도 스프라이트 대신 작게 붙임

// ===== 2. 이어폰 쏙 → "아 왜요." =====
S[2]=()=>{
  setSky('#a9bccf','#e3eaf0 70%');
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xdde5ec,25,90);addLights(scene,{hemi:1.5});
  const r=rng(31);field(scene,r,{mz:-6});
  const hero=istp(r,ALLY);hero.position.set(0,0,0);hero.rotation.y=0.35;scene.add(hero);
  const G=brows(general(r,GEN),0.15);G.position.set(0.55,0,1.25);G.rotation.y=Math.PI+0.5;scene.add(G);
  const crowd=[];for(let i=0;i<10;i++){const p=istp(r,ALLY);p.position.set(-5+i*1.3+r()*0.4,0,-2.6-r()*1.4);p.rotation.y=Math.PI/2;scene.add(p);crowd.push({p,ph:r()*6})}
  const held=new THREE.Mesh(new THREE.SphereGeometry(0.06,10,8),lamb(0xffffff));G.userData.arms[1].children[1].add(held);held.position.set(0,-0.06,0.04);held.visible=false;
  const nts=notes(scene,4,r,0.003);
  const bH=bub(hero,'…아 왜요.',{y:2.25,bg:'#ffe7c2',fg:'#5a3300',size:0.004}),bG=sbub(scene,'전쟁 났다고.',0.15,{y:2.55,z:1.0,bg:'#f2ffd0',fg:'#2b3a10',size:0.003}),bS=bub(hero,'…하.',{y:2.25,bg:'#ffe7c2',fg:'#5a3300',size:0.004});
  const sigh=textSprite('~',90,'#ffffff',0.004);scene.add(sigh);
  const P=EV(2).pull,TW=at(2,'n3',0.1);const C=cam(46);
  const ch=chip('출전 의지 3%');
  const hv=new THREE.Vector3();
  return t=>{
    standPose(hero);standPose(G);
    // 장군 손이 귀로
    const reach=ease(t/P),back=ease((t-P-0.1)/0.5);
    const g=G.userData;g.arms[1].rotation.x=-2.3*reach*(1-back*0.6);g.arms[1].rotation.z=0.55*reach*(1-back);
    hero.userData.ebs[1].visible=t<P;held.visible=t>=P;
    if(t<P)bob(hero,t);
    else{hero.userData.head.rotation.set(0,0,0);if(t<TW){hero.userData.head.rotation.x=t>at(2,'s2')?0.25:0}}
    // 짜증 → 한숨 → 터덜터덜
    if(t>=TW){const k=t-TW;hero.rotation.y=0.35+(Math.PI/2-0.35-0.0)*ease(k/0.6)*1;hero.position.x=Math.max(0,k-0.6)*0.85;trudge(hero,k);dragRifle(hero);
      G.rotation.y=Math.PI+0.5+ease(k/0.8)*0.6}
    crowd.forEach(q=>{if(t>TW+0.4){const k=t-TW-0.4;q.p.position.x+=0;trudge(q.p,k+q.ph);dragRifle(q.p);q.p.position.x=q.p.userData.x0+(k*0.8)}else{standPose(q.p);bob(q.p,t+q.ph);if(q.p.userData.x0==null)q.p.userData.x0=q.p.position.x}});
    hero.updateMatrixWorld(true);hero.userData.head.getWorldPosition(hv);
    updNotes(nts,t,new THREE.Vector3(hv.x,hv.y+0.5,hv.z),t<P?1:0);
    sayBub(bH,t,at(2,'s1'),at(2,'g1'));sayBub(bG,t,at(2,'g1'),at(2,'s2'));sayBub(bS,t,at(2,'s2'),TW+0.4);
    sigh.visible=t>at(2,'s2',0.2)&&t<at(2,'s2',1.3);sigh.position.set(hv.x+0.1,hv.y+0.05-(t-at(2,'s2'))*0.1,hv.z+0.45);
    if(t<TW){const k=ease(t/3);C.position.set(-3.3+k*0.4,2.25,4.9-k*0.5);C.lookAt(0.35,1.55,0.4)}
    else{const k=ease((t-TW)/1.2);C.position.set(hero.position.x-2.6-k*1.0,2.3+k*0.6,3.6+k*2.0);C.lookAt(hero.position.x+0.6,1.4,0)}
    chipPop(ch,t,TW+0.5);
    caption(2,t);renderer.render(scene,C);
  };
};

// ===== 3. "화났어요?" "원래 이래요." =====
S[3]=()=>{
  setSky('#b2c4d4','#e6edf2 70%');
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xe2e9ef,25,90);addLights(scene,{hemi:1.5});
  const r=rng(41);field(scene,r,{mz:-2.2});
  const A=istp(r,ALLY),F=istp(r,FOE);A.ebs=A.userData.ebs;scene.add(A);scene.add(F);A.userData.ebs[1].visible=false;
  const V3=window.S3V||'C';
  const bub2=(p,txt,mine)=>V3==='0'?sbub(scene,txt,mine?-0.35:0.35,{y:2.25,bg:mine?'#ffe7c2':'#e4e0ff',fg:mine?'#5a3300':'#2d2766'})
    :bub(p,txt,{y:V3==='C'?2.42:2.3,bg:mine?'#dff5c4':'#e4e0ff',fg:mine?'#24400f':'#2d2766',size:V3==='B'?0.0019:0.0028});
  const sideTags=V3==='C'?[[A,'아군','#5b8a3a'],[F,'적군','#6d62ad']].map(([p,tx,c])=>{const s=labelSprite(tx,{fs:44,bg:c,fg:'#fff',size:0.0036});s.position.y=2.1;p.add(s);return s}):[];
  const L=[['f1',F,'…화났어요?',0],['s3',A,'아뇨.',1],['f2',F,'표정이 화났는데.',0],['s4',A,'원래 이래요.',1],['f3',F,'아 저도긴 해요.',0]].map(([nm,p,tx,m])=>({nm,b:bub2(p,tx,m)}));
  const tags=[-1,1].map(sx=>{const s=labelSprite('원래 얼굴',{fs:46,bg:'#3b3466',fg:'#fff',size:0.0024});s.position.set(sx*0.5,2.15,0);scene.add(s);s.visible=false;return s});
  const C=cam(44);const ARR=1.1;
  const T3=at(3,'n4')+LN(3,'n4')[1]*0.62;
  return t=>{
    const k=ease(t/ARR);
    A.position.set(-3.2+2.55*k,0,0);F.position.set(3.2-2.55*k,0,0);
    if(t<ARR){A.rotation.y=Math.PI/2;F.rotation.y=-Math.PI/2;trudge(A,t);trudge(F,t+0.7);dragRifle(A);dragRifle(F)}
    else{[A,F].forEach(p=>{standPose(p);p.userData.hip.rotation.x=0;p.userData.head.rotation.set(0,0,0);p.userData.arms[1].rotation.x=0.05});
      A.rotation.y=Math.PI/2-0.25;F.rotation.y=-Math.PI/2+0.25}
    let cur=-1;L.forEach((q,i)=>{const t0=at(3,q.nm),t1=i<L.length-1?at(3,L[i+1].nm):at(3,'n4');sayBub(q.b,t,t0,t1);if(t>=t0&&t<t1)cur=i});
    const spk=cur<0?null:(L[cur].nm[0]==='s'?A:F);
    if(V3!=='0'&&spk&&t>=ARR){const lt=t-at(3,L[cur].nm);spk.userData.hip.position.y=0.8+Math.max(0,Math.sin(Math.min(lt,0.3)/0.3*Math.PI))*0.08;spk.userData.head.rotation.x=-0.08}
    if(V3==='C'){const ce=ui.querySelector('.cap');if(ce)ce.style.color=spk===A?'#a8f070':spk===F?'#c4b4ff':'#fff'}
    sideTags.forEach(s=>s.visible=t<T3-0.1);
    tags.forEach(s=>{s.visible=t>T3;const kk=pop((t-T3)/0.3);s.scale.set(s.userData.base[0]*kk,s.userData.base[1]*kk,1)});
    const z=ease((t-at(3,'n4'))/2.5);
    if(V3==='B'&&spk&&t<at(3,'n4')){const o=spk===A?F:A,sx=Math.sign(spk.position.x);C.position.set(o.position.x-sx*0.85,2.05,1.25);C.lookAt(spk.position.x,1.85,0)}
    else{C.position.set(0,1.85,6.6-z*2.8);C.lookAt(0,1.45+z*0.25,0)}
    caption(3,t);renderer.render(scene,C);
  };
};

// ===== 4. 일부러 빗나가게 =====
S[4]=()=>{
  setSky('#b2c4d4','#e6edf2 70%');
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xe2e9ef,25,90);addLights(scene,{hemi:1.5});
  const r=rng(51);field(scene,r,{mz:-3.5});
  const A=istp(r,ALLY),F=istp(r,FOE);A.position.set(-1.45,0,0);A.rotation.y=Math.PI/2;F.position.set(1.45,0,0);F.rotation.y=-Math.PI/2;scene.add(A);scene.add(F);
  A.userData.ebs[1].visible=false;
  {const s1=sandbags(scene,-0.85,0,1.4,1);s1.rotation.y=Math.PI/2;const s2=sandbags(scene,0.85,0,1.4,1);s2.rotation.y=Math.PI/2}
  const SH=EV(4).shots.map(x=>x);const tr=SH.map((s,i)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.04,0.04),basic(0xffe27a));scene.add(m);return m});
  const fl=SH.map(()=>{const s=glowSprite('rgba(255,220,120,1)',0.9);scene.add(s);return s});
  const bA=sbub(scene,'맞히면 보고서 써야 돼서.',-0.4,{bg:'#ffe7c2',fg:'#5a3300',y:2.3}),bF1=sbub(scene,'…일부러 빗나가게 쐈죠?',0.4,{bg:'#e4e0ff',fg:'#2d2766',y:2.3}),bF2=sbub(scene,'아 저도긴 해요.',0.4,{bg:'#e4e0ff',fg:'#2d2766',y:2.3});
  const miss=SH.map(()=>{const s=textSprite('빗나감',44,'#ffffff',0.004);scene.add(s);return s});
  const C=cam(48);const ch=chip('명중률 0%');
  return t=>{
    standPose(A);standPose(F);aim(A);aim(F);
    const done=t>SH[SH.length-1]+0.5;
    if(done){[A,F].forEach(p=>{p.userData.arms[0].rotation.x=-0.9;p.userData.arms[1].rotation.x=-1.0})}
    SH.forEach((s,i)=>{const fromA=i%2==0;const lt=t-s;const m=tr[i];m.visible=lt>0&&lt<0.35;
      const x0=fromA?-0.9:0.9,dir=fromA?1:-1;const zoff=(i%3==0?1:-1);
      m.position.set(x0+dir*lt*9,1.45+lt*1.6,lt*zoff*5);m.rotation.y=-Math.atan2(zoff*5,dir*9);m.rotation.z=dir*0.17;
      fl[i].visible=lt>0&&lt<0.08;fl[i].position.set(x0,1.5,0.1);
      miss[i].visible=lt>0.12&&lt<0.7;miss[i].position.set(fromA?1.3:-1.3,2.05+lt*0.4,zoff*0.6)});
    sayBub(bF1,t,at(4,'f4'),at(4,'s5'));sayBub(bA,t,at(4,'s5'),at(4,'f5'));sayBub(bF2,t,at(4,'f5'),99);
    const k=ease((t-1.8)/2);C.position.set(0,2.2-k*0.2,7.6-k*1.6);C.lookAt(0,1.35+k*0.2,0);
    chipPop(ch,t,1.3);
    caption(4,t);renderer.render(scene,C);
  };
};

// ===== 5. 몇 티어예요? → 듀오 =====
S[5]=()=>{
  const scene=new THREE.Scene();addLights(scene,{hemi:1.5});
  const r=rng(61);field(scene,r,{mz:-3});
  const sb=sandbags(scene,0,0.2,3.2,2);
  const A=istp(r,ALLY),F=istp(r,FOE);A.position.set(-0.55,0.32,0.55);F.position.set(0.55,0.32,0.55);scene.add(A);scene.add(F);A.userData.ebs[1].visible=false;
  const rifles=[rifle(),rifle()];rifles.forEach((R,i)=>{R.rotation.set(-1.25,0,0);R.position.set(i?1.9:-1.9,0.45,0.2);scene.add(R)});
  const gameTex=canvasTex(140,260,(x,w,h)=>{const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#3a2a7a');g.addColorStop(1,'#1d5f8a');x.fillStyle=g;x.fillRect(0,0,w,h);
    x.fillStyle='#ffd84d';x.beginPath();x.arc(45,80,16,0,7);x.fill();x.fillStyle='#ff5a7a';x.beginPath();x.arc(95,150,16,0,7);x.fill();x.fillStyle='#7cf0ff';x.fillRect(20,200,100,14);x.fillStyle='#fff';x.font='900 26px sans-serif';x.fillText('◆ 다이아',18,40)});
  const sun=glowSprite('rgba(255,170,90,1)',9);scene.add(sun);
  const sparks=[0,1].map(i=>{const s=textSprite('✦',70,'#fff27a',0.004);scene.add(s);return s});
  const bA1=sbub(scene,'…그거 몇 티어예요?',-0.35,{bg:'#ffe7c2',fg:'#5a3300',y:2.45,z:0.55}),bF=sbub(scene,'◆ 다이아요.',0.4,{bg:'#e4e0ff',fg:'#2d2766',y:2.45,z:0.55}),bA2=sbub(scene,'…듀오 할래요?',-0.35,{bg:'#ffe7c2',fg:'#5a3300',y:2.45,z:0.55});
  const C=cam(46);const ch=chip('교전 0회 · 듀오 1판');
  const tS=at(5,'s6'),tD=at(5,'n5');
  const hv=new THREE.Vector3();
  return t=>{
    [A,F].forEach(p=>{standPose(p);sitPose(p);p.userData.hip.rotation.set(0,0,0)});
    // 적 병사 폰 게임 중
    phoneUp(F,1,1);F.userData.phone.children[1].material=new THREE.MeshBasicMaterial({map:gameTex});
    const both=t>at(5,'s7')+0.5;
    if(both){phoneUp(A,0,1);A.userData.phone.children[1].material=F.userData.phone.children[1].material}
    else if(A.userData.phone)A.userData.phone.visible=false;
    // 고개: 처음엔 멍 → 폰 쪽으로 휙
    const look=t>tS-0.2;A.userData.head.rotation.y=look&&!both?-0.75:0;A.userData.head.rotation.x=look?0.35:0;F.userData.head.rotation.x=0.4;
    A.updateMatrixWorld(true);A.userData.head.getWorldPosition(hv);
    sparks.forEach((s,i)=>{const on=t>tS&&t<at(5,'s7')+0.8;s.visible=on;const kk=on?0.8+Math.sin(t*12+i*2)*0.3:0;s.scale.set(s.userData.base[0]*kk,s.userData.base[1]*kk,1);s.position.set(hv.x+(i?0.12:-0.12),hv.y+0.33,hv.z+0.35)});
    sayBub(bA1,t,tS,at(5,'f6'));sayBub(bF,t,at(5,'f6'),at(5,'s7'));sayBub(bA2,t,at(5,'s7'),tD+0.3);
    // 노을 타임랩스
    const d=ease((t-tD)/3.2);
    setSky(lerpCol('#b8cfe2','#ff9e6b',d),lerpCol('#eef3f6','#ffd9a0',d)+' 70%');
    scene.children.forEach(o=>{if(o.isHemisphereLight)o.color.set(lerpCol('#ffffff','#ffd2b0',d))});
    sun.position.set(-6,9-d*6.5,-30);sun.visible=t>tD;
    const n=t<tD?1:1+Math.floor(ease((t-tD)/3.4)*11);ch.textContent=`교전 0회 · 듀오 ${n}판`;chipPop(ch,t,at(5,'s7')+0.4);
    const k=ease((t-tD)/3);C.position.set(0.15-k*0.3,1.85+k*0.6,5.0+k*2.4);C.lookAt(0,1.45,0.4);
    caption(5,t);renderer.render(scene,C);
  };
};

// ===== 6. 작전 단톡방 =====
function kchat(title,cnt,col){const ph=div('kphone',`<div class="screen"><div style="height:70px"></div><div class="head" style="background:${col}"><span>${title}</span><small>${cnt}</small></div><div class="msgs"></div><div class="inp"><div class="box"></div><div class="sd">전송</div></div></div>`);
  return {ph,msgs:ph.querySelector('.msgs'),box:ph.querySelector('.box')}}
function kmsg(K,text,o={}){const row=document.createElement('div');row.className='row'+(o.me?' me':'');
  if(o.me)row.innerHTML=`<div class="meta"><span class="un">${o.un??''}</span><span class="tm">${o.tm||''}</span></div><div class="b">${text}</div>`;
  else row.innerHTML=`<div class="av" style="background:${o.av||'#6d62ad'}">${o.who?o.who[0]:''}</div><div><div class="who">${o.who||''}</div><div class="b">${text}</div></div>`;
  K.msgs.appendChild(row);row.style.display='none';return row}
S[6]=()=>{
  const scene=new THREE.Scene();addLights(scene,{hemi:1.5});
  const r=rng(71);field(scene,r,{mz:-8});
  const vill=[];for(let i=0;i<9;i++){const h=makeHouse(r,{});h.position.set((i-4)*4.2+r()*1.5,0,-26-r()*5);h.scale.setScalar(1.3);scene.add(h);vill.push(h)}
  const runners=[];for(let i=0;i<24;i++){const p=istp(r,ALLY);const pk=new THREE.Mesh(new THREE.BoxGeometry(0.42,0.5,0.25),lamb(0x8a7a5a));pk.position.set(0,0.35,-0.25);p.userData.hip.add(pk);
    p.position.set((r()-0.5)*14,0,4+r()*8);p.rotation.y=Math.PI;scene.add(p);runners.push({p,ph:r()*6,z0:p.position.z,sp:4+r()*2})}
  const E=EV(6);
  const K=kchat('전군 작전방','3,000','rgba(255,255,255,.4)');
  const m1=kmsg(K,'[공지] 내일 05:00 전군 돌격.<br>1소대 좌측, 2소대 우측, 3소대는…',{me:1,un:'3000',tm:'AM 2:00'});
  const m2=kmsg(K,'읽으면 답장 좀',{me:1,un:'3000',tm:'AM 5:00'}),m3=kmsg(K,'제발',{me:1,un:'3000',tm:'AM 5:01'}),m4=kmsg(K,'오늘 전쟁 일찍 끝남',{me:1,un:'3000',tm:'AM 5:02'}),m5=kmsg(K,'아니 그게 아니라',{me:1,un:'3000',tm:'AM 5:03'});
  const ms=[m1,m2,m3,m4,m5];
  const ch=chip('3시간 경과',55);const ch2=chip('귀가 소요 시간 3초');const cutL=div('cut','같은 시각 · 적군');
  const big=div('stamp2','');big.style.top='520px';big.style.borderColor='#ffb800';big.style.color='#e09a00';
  const C=cam(50);
  const tStr='오늘 전쟁 일찍 끝남',tStr2='아니 그게 아니라';
  const P3=[E.leave+0.15,E.oops-1.0];
  return t=>{
    const in3=t>=P3[0]&&t<P3[1];
    K.ph.style.display=in3?'none':'block';
    const foe=t>=E.foe;
    K.ph.querySelector('.head span').textContent=foe?'적군 작전방':'전군 작전방';K.ph.querySelector('.head').style.background=foe?'#b9b0ee':'rgba(255,255,255,.4)';
    K.ph.querySelector('.screen').style.background=foe?'#c9c2ea':'#b2c7da';
    m1.style.display=t>=E.post?'flex':'none';m2.style.display=t>=E.req1?'flex':'none';m3.style.display=t>=E.req2?'flex':'none';m4.style.display=t>=E.send?'flex':'none';m5.style.display=t>=E.oops?'flex':'none';
    const z=t>=E.zero&&t<E.oops;
    [m1,m2,m3,m4].forEach(m=>{const u=m.querySelector('.un');u.textContent=z||t>=E.oops?'':'3000'});
    // 입력창 타이핑
    let s='';if(t>=E.type&&t<E.send)s=tStr.slice(0,Math.ceil((t-E.type)/(E.send-E.type-0.05)*tStr.length));
    if(t>=E.oops-0.75&&t<E.oops)s=tStr2.slice(0,Math.ceil((t-E.oops+0.75)/0.7*tStr2.length));K.box.textContent=s;
    // '3000' 강조
    const u5=m5.querySelector('.un');const pul=t>=E.back?1+0.35*Math.abs(Math.sin((t-E.back)*6))*clamp01(1-(t-E.back)/1.5):1;u5.style.display='inline-block';u5.style.transform=`scale(${pul*(t>=E.back?1.6:1)})`;
    big.textContent=t<E.oops?'읽음 0':'안 읽음 3000';big.style.opacity=(t>=E.zero&&t<E.leave+0.15)||(t>=E.back&&t<E.foe)?1:0;
    big.style.transform=`translateX(-50%) rotate(-12deg) scale(${pop((t-(t<E.oops?E.zero:E.back))/0.25)})`;
    chipPop(ch,t,2.3);ch.style.opacity=t>=2.3&&t<E.req1+0.3&&!in3?1:0;
    cutL.style.opacity=foe?1:0;
    // 3D: 전원 귀가
    ch2.style.opacity=in3&&t>P3[0]+0.6?1:0;if(in3)chipPop(ch2,t,P3[0]+0.6);
    if(in3){const lt=t-P3[0];runners.forEach(q=>{walkPose(q.p,(lt+q.ph)*11,0.75);q.p.position.z=q.z0-lt*q.sp*2.2;});
      setSky('#9fc6ee','#e4f1ff 70%');C.position.set(0,3.2,15);C.lookAt(0,1.4,-6);renderer.render(scene,C)}
    else{setSky('#6f86a8','#c3cfe0');renderer.clear()}
    caption(6,t);
  };
};

// ===== 7. 집이 좋아서 끝난 전쟁 =====
S[7]=()=>{
  const scene=new THREE.Scene();addLights(scene,{hemi:1.1,sun:0xffd2a8,dir:0.9});
  const r=rng(81);ground(scene,0x6f8a68,300);
  const road=new THREE.Mesh(new THREE.PlaneGeometry(4,200),lamb(0x6a6a72));road.rotation.x=-Math.PI/2;road.position.y=0.01;scene.add(road);
  const houses=[];for(let row=0;row<4;row++)for(let i=0;i<5;i++){for(const s of[-1,1]){const h=makeHouse(r,{});h.position.set(s*(4+i*0+r()*0.5)+s*(i%2)*3.5,0,-row*6-(i%2)*3);h.rotation.y=s>0?-Math.PI/2:Math.PI/2;scene.add(h);houses.push(h)}}
  const st=stars(scene,160,r,{w:120,y0:10,h:40,z:-60});
  // 침실 세트(멀리 떨어진 곳)
  const BR=new THREE.Group();BR.position.x=200;scene.add(BR);
  {const fl=new THREE.Mesh(new THREE.PlaneGeometry(14,14),lamb(0xcaa57e));fl.rotation.x=-Math.PI/2;BR.add(fl);
   const fr=new THREE.Mesh(new THREE.BoxGeometry(2.2,0.5,3.2),lamb(0x8a6a4a));fr.position.set(0,0.25,0);BR.add(fr);
   const mt=new THREE.Mesh(new THREE.BoxGeometry(2.0,0.25,3.0),lamb(0xf4f1ea));mt.position.set(0,0.62,0);BR.add(mt);
   const pl=new THREE.Mesh(new THREE.BoxGeometry(1.0,0.2,0.55),lamb(0xffffff));pl.position.set(0,0.82,-1.15);BR.add(pl);
   const rug=new THREE.Mesh(new THREE.PlaneGeometry(3,2),lamb(0x9db6d6));rug.rotation.x=-Math.PI/2;rug.position.set(2.4,0.01,0.5);BR.add(rug);
   const lamp=glowSprite('rgba(255,210,140,1)',3);lamp.position.set(-1.6,1.2,-1.4);BR.add(lamp)}
  const G=brows(general(r,GEN),0.2);G.rotation.x=-Math.PI/2;G.position.set(0,0.78,-1.55);BR.add(G);G.scale.setScalar(1.0);
  const blanket=new THREE.Mesh(new THREE.BoxGeometry(2.05,0.3,1.9),lamb(0x7f9fd0));blanket.position.set(0,0.95,0.45);BR.add(blanket);
  const E=EV(7);
  const K=kchat('적장','','rgba(255,255,255,.45)');K.ph.style.transform='scale(.86)';K.ph.style.transformOrigin='50% 0';K.ph.style.top='120px';
  const c1=kmsg(K,'종전 서명… 국경에서 만날까요?',{who:'적장',av:'#6d62ad'}),c2=kmsg(K,'굳이?',{me:1,un:'',tm:'PM 9:12'}),c3=kmsg(K,'아 저도긴 해요',{who:'적장',av:'#6d62ad'});
  const doc=div('doc',`<h1>종전 협정서</h1><div class="ln"></div><p>제1조. 전쟁을 끝낸다.</p><p>제2조. 서로 연락하지 않는다.</p><div class="why">종전 사유<br><b>양국 모두 집이 더 좋아서</b></div><div class="sg"><div>아군 장군<span class="s1"></span></div><div>적군 장군<span class="s2"></span></div></div>`);
  const stp=div('stamp2','종전');
  const ch=chip('외출 인원 0명');const e1=div('end1 out','다음 전쟁편은?'),e2=div('end2 out','신청소에서 골라 주세요');
  const C=cam(50);
  const T1=at(7,'e2',-1.0),T2=E.stamp-0.9,T3=at(7,'n9',2.3),TE=VOICE[7]+0.25+0.45+0.3;
  return t=>{
    const bed=t>=T1&&t<T2;const night=t>=T3;
    // 마을
    const dk=night?1:ease(t/3);
    setSky(lerpCol('#e9a27a','#141a3a',dk*0.85+ (night?0.15:0)),lerpCol('#ffd9a8','#3b3f6b',dk));
    st.visible=night||t>2;
    if(!bed){const k=night?ease((t-T3)/4):ease(t/3.5);
      if(night){C.position.set(0,6+k*4,8+k*6);C.lookAt(0,1,-12)}else{C.position.set(0,2.2+k*1.2,6-k*3);C.lookAt(0,1.4,-14)}}
    else{const k=ease((t-T1)/1.0);C.position.set(200+0.4,5.4-k*0.6,1.4-k*0.4);C.lookAt(200,0.6,-0.4);
      G.userData.arms[1].rotation.x=-1.55;G.userData.arms[0].rotation.x=-1.55;phoneUp(G,1,0);if(G.userData.phone){G.userData.phone.visible=true;G.userData.phone.position.set(0.15,0.95,0.55);G.userData.phone.rotation.set(-Math.PI/2+0.3,0,0)}}
    const showPhone=t>=T1+0.8&&t<T2;K.ph.style.display=showPhone?'block':'none';
    K.ph.style.transform=`scale(.86) translateY(${(1-ease((t-T1-0.8)/0.35))*300}px)`;
    c1.style.display=t>=at(7,'e2',-0.15)?'flex':'none';c2.style.display=t>=at(7,'g3',-0.1)?'flex':'none';c3.style.display=t>=at(7,'e3',-0.1)?'flex':'none';
    const showDoc=t>=T2&&t<T3;doc.style.display=showDoc?'block':'none';doc.style.transform=`scale(${pop((t-T2)/0.3)})`;
    doc.querySelector('.s1').textContent=t>E.stamp-0.6?'ㅇㅇ':'';doc.querySelector('.s2').textContent=t>E.stamp-0.35?'ㅇㅇ':'';
    stp.style.display=showDoc&&t>=E.stamp?'block':'none';const sk=1+2*(1-ease((t-E.stamp)/0.12));stp.style.transform=`translateX(-50%) rotate(-12deg) scale(${sk})`;stp.style.top='830px';stp.style.left='62%';
    houses.forEach(h=>h.children.forEach(c=>{if(c.geometry&&c.geometry.type==='PlaneGeometry')c.material.color.set(night||t>1.2?0xffe39a:0x3a3f5a)}));
    chipPop(ch,t,1.0);ch.style.opacity=t>1.0&&t<T1?1:0;
    e1.style.opacity=t>TE-2.6?1:0;e2.style.opacity=t>TE-2.4?1:0;popEl(e1,t,TE-2.6);popEl(e2,t,TE-2.4);
    if(showDoc){renderer.clear();setSky('#3a3550','#5b5478')}else renderer.render(scene,C);
    caption(7,t);
  };
};

let curUpd=null,cur=-1;
window.renderFrame=(si,t)=>{if(si!==cur){ui.innerHTML='';renderer.setScissorTest(false);renderer.setViewport(0,0,W,H);curUpd=S[si]();cur=si}curUpd(t)};
document.fonts.load(`900 60px ${FONT}`).then(()=>document.fonts.load(`500 40px ${FONT}`)).then(()=>{window.ready=true});
</script></body></html>
