for(let i=0;i<TM.length;i++)if(!S[i])S[i]=()=>{sky('#333');return t=>{renderer.clear();ui.innerHTML=`<div class="chip">장면 ${i} 준비 중</div>`;caption(i,t)}};
let curUpd=null,cur=-1;
window.renderFrame=(si,t)=>{if(si!==cur){ui.innerHTML='';fx.innerHTML='';fx.style.background='';curUpd=S[si]();cur=si}curUpd(t)};
document.fonts.load(`900 60px ${FONT}`).then(()=>document.fonts.load(`500 40px ${FONT}`)).then(()=>{window.ready=true});
</script></body></html>
