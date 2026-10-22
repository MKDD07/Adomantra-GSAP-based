/* Adomantra | continuous scene director. Config-driven, scroll-linked, reversible. */
(()=>{"use strict";const G=window.gsap,S=window.ScrollTrigger;if(!G||!S||matchMedia("(prefers-reduced-motion: reduce)").matches)return;G.registerPlugin(S);
const cfg=[
["hero","zoom",1.1],["intro","rise",1],["statement","mask",1.15],["expertise","slide",1],["projects","stack",1.1],["journey","native",1],["achievements","native",1],["marquee","native",1],["showcase","native",1],["services-intro","rise",1],["approach","native",1],["service-details","slide",1],["window","native",1],["banner","mask",1],["testimonials","stack",1],["insights","slide",1],["horizontal","native",1],["faq","rise",1]
],map=Object.fromEntries(cfg.map(([id,type,power])=>[id,{type,power}])),scenes=[...document.querySelectorAll("[data-ado-scene]")].filter(e=>!e.parentElement?.closest("[data-ado-scene]")),mobile=matchMedia("(max-width:767px)").matches;
if(!scenes.length)return;
const el=(tag,cls,html="")=>{const n=document.createElement(tag);n.className=cls;n.innerHTML=html;return n},ui=el("div","ado-director-ui",'<div class="ado-director-progress"></div><div class="ado-director-counter"><b>01</b><i></i><span>18</span></div><div class="ado-director-next"><small>UP NEXT</small><strong></strong></div>'),wipe=el("div","ado-director-wipe",'<div class="ado-director-wipe-inner"><span></span></div>');document.body.append(ui,wipe);
const bar=ui.querySelector(".ado-director-progress"),counter=ui.querySelector("b"),next=ui.querySelector("strong"),wi=wipe.firstElementChild,wiText=wi.firstElementChild,tl=G.timeline({paused:true}),clean=s=>s.replace(/-/g," ").replace(/\b\w/g,c=>c.toUpperCase()),sceneName=s=>clean(s.dataset.adoScene||"");
G.to(bar,{scaleX:1,ease:"none",scrollTrigger:{start:0,end:"max",scrub:.4}});
const active=scenes.filter(s=>s.getBoundingClientRect().height>20);
active.forEach((s,i)=>{
 const key=s.dataset.adoScene,config=map[key]||{type:"rise",power:1},native=config.type==="native",h=[...s.querySelectorAll("h1,h2")].filter(x=>!x.closest(".swiper,.accordion,[data-ado-scene]:not(:scope)")).slice(0,2),copy=[...s.querySelectorAll("p")].filter(x=>!x.closest(".swiper,.accordion,form")).slice(0,2),cards=[...s.querySelectorAll(".features-card,.service-card,.project-card")].filter(x=>!x.closest(".swiper,.accordion")).slice(0,5);
 // One scrubbed timeline per scene; each transition is reversible with scrolling.
 if(!native){
  const targets=[...h,...copy],t=G.timeline({scrollTrigger:{trigger:s,start:"top 95%",end:"top 22%",scrub:mobile?.7:1.15,invalidateOnRefresh:true}});
  if(targets.length){const from={rise:{y:mobile?24:75,opacity:.15},slide:{x:mobile?-24:-100,opacity:.15},mask:{clipPath:"inset(0 0 100% 0)",y:25},stack:{y:95,scale:.92,opacity:.15},zoom:{scale:1.12,y:45,opacity:.1}}[config.type]||{y:45,opacity:.1};t.fromTo(targets,from,{x:0,y:0,scale:1,opacity:1,clipPath:"inset(0 0 0% 0)",stagger:.08,ease:"none",duration:1},0)}
  if(cards.length&&key!=="hero")t.fromTo(cards,{y:mobile?18:60,scale:.96,opacity:.4},{y:0,scale:1,opacity:1,stagger:.09,ease:"none",duration:.9},.15);
  // Section outgoing motion links to next section's incoming motion.
  if(i<active.length-1&&h.length)G.to(h,{y:mobile?-12:-42,opacity:.75,ease:"none",scrollTrigger:{trigger:s,start:"bottom 85%",end:"bottom 15%",scrub:1}});
 }
 S.create({trigger:s,start:"top 55%",end:"bottom 45%",onToggle:self=>{if(!self.isActive)return;counter.textContent=String(i+1).padStart(2,"0");next.textContent=active[i+1]?sceneName(active[i+1]):"Let's talk"}});
 // Interconnected handoff at the actual boundary; one overlay reused for all scenes.
 if(i<active.length-1){
  const dest=active[i+1],special=native||map[dest.dataset.adoScene]?.type==="native";
  if(!special)S.create({trigger:dest,start:"top 100%",end:"top 55%",onUpdate:self=>{
   if(!self.isActive){if(wipe.dataset.scene===dest.dataset.adoScene){wipe.style.opacity="0";wipe.style.visibility="hidden"}return}
   wipe.dataset.scene=dest.dataset.adoScene;wiText.textContent=sceneName(dest);wipe.style.visibility="visible";
   const p=self.progress;wipe.style.opacity=String(Math.sin(p*Math.PI)*.9);
   wi.style.transform="translate3d(0,"+((1-p)*90)+"%,0) scale("+(1.05-p*.05)+")";
   wiText.style.transform="translate3d(0,"+((1-p)*30)+"px,0)";
  },onLeave:()=>{wipe.style.opacity="0";wipe.style.visibility="hidden"},onLeaveBack:()=>{wipe.style.opacity="0";wipe.style.visibility="hidden"}});
 }
});
const refresh=()=>S.refresh();window.addEventListener("load",refresh,{once:true});document.fonts?.ready?.then(refresh);
})();