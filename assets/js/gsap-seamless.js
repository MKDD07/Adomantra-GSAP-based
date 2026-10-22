/* Adomantra cinematic director: one coordinated GSAP system for 18 homepage scenes.
   Respects existing specialized pinned sections, Swiper, ScrollSmoother and interactive components. */
(function(){
 "use strict";
 function init(){
  if(!window.gsap||!window.ScrollTrigger)return;
  const gs=window.gsap,ST=window.ScrollTrigger;
  gs.registerPlugin(ST);
  const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scenes=[...document.querySelectorAll("[data-ado-scene]")];
  if(!scenes.length||reduced)return;
  const mobile=matchMedia("(max-width: 767px)").matches;
  const special=new Set(["journey","achievements","showcase","approach","window","horizontal","marquee"]);
  const bar=document.createElement("div");bar.className="ado-cinema-progress";bar.setAttribute("aria-hidden","true");document.body.append(bar);
  gs.to(bar,{scaleX:1,ease:"none",scrollTrigger:{start:0,end:"max",scrub:.3}});
  const rail=document.createElement("div");rail.className="ado-cinema-rail";rail.setAttribute("aria-hidden","true");document.body.append(rail);
  const dots=scenes.map(()=>{const el=document.createElement("span");rail.append(el);return el});
  function activate(index){dots.forEach((dot,j)=>dot.classList.toggle("is-active",j===index))}
  const triggers=[];
  scenes.forEach((section,index)=>{
    const key=section.dataset.adoScene;
    const isSpecial=special.has(key);
    const st=ST.create({trigger:section,start:"top center",end:"bottom center",onToggle:self=>{if(self.isActive)activate(index)}});
    triggers.push(st);
    // Animated section handoff: previous scene recedes while next enters.
    if(!isSpecial&&index>0){
      gs.fromTo(section,{backgroundColor:"rgba(229,44,53,0)"},{backgroundColor:"rgba(229,44,53,0.018)",ease:"none",scrollTrigger:{trigger:section,start:"top bottom",end:"top 35%",scrub:true},clearProps:"backgroundColor"});
    }
    if(index<scenes.length-1&&!isSpecial){
      const bridge=document.createElement("div");bridge.className="ado-cinema-bridge";bridge.setAttribute("aria-hidden","true");section.append(bridge);
      gs.fromTo(bridge,{scaleY:0,opacity:0},{scaleY:1,opacity:1,ease:"none",scrollTrigger:{trigger:section,start:"bottom 95%",end:"bottom 35%",scrub:true}});
    }
    // Existing pinned/special sections have their own choreography: never overwrite it.
    if(isSpecial)return;
    const headings=[...section.querySelectorAll("h1,h2")].filter(el=>!el.closest(".swiper,.accordion,.mobile-menu")).slice(0,3);
    const paragraphs=[...section.querySelectorAll("p")].filter(el=>!el.closest(".swiper,.accordion,.testimonial,.mobile-menu")).slice(0,3);
    const cards=[...section.querySelectorAll(".features-card,.service-card,.blog-card,.project-card")].filter(el=>!el.closest(".swiper,.swiper-slide,.accordion")).slice(0,7);
    const images=[...section.querySelectorAll("img")].filter(el=>!el.closest(".swiper,.swiper-slide,.swiper-wrapper,.logo,.client,.brand,.marquee")).slice(0,3);
    const tl=gs.timeline({paused:true,defaults:{ease:"power3.out"}});
    if(headings.length)tl.fromTo(headings,{y:mobile?25:54,autoAlpha:0},{y:0,autoAlpha:1,duration:1.05,stagger:.12,clearProps:"all"},0);
    if(paragraphs.length)tl.fromTo(paragraphs,{y:24,autoAlpha:0},{y:0,autoAlpha:1,duration:.85,stagger:.1,clearProps:"all"},.2);
    if(cards.length)tl.fromTo(cards,{y:mobile?18:42,autoAlpha:0},{y:0,autoAlpha:1,duration:1,stagger:.085,clearProps:"all"},.22);
    if(images.length&&index!==0)tl.fromTo(images,{scale:1.045,autoAlpha:0},{scale:1,autoAlpha:1,duration:1.25,stagger:.1,clearProps:"all"},.2);
    if(tl.duration())ST.create({trigger:section,start:index===0?"top 96%":"top 85%",once:true,onEnter:()=>tl.play(),onLeaveBack:()=>{if(!tl.progress())tl.progress(1)}});
    // Subtle parallax restricted to noninteractive standalone imagery.
    if(!mobile&&index>0)images.forEach(img=>{
      if(img.closest("[data-speed],[data-parallax],.swiper")||img.naturalWidth===0)return;
      gs.fromTo(img,{yPercent:-2},{yPercent:2,ease:"none",scrollTrigger:{trigger:section,start:"top bottom",end:"bottom top",scrub:1.5}});
    });
  });
  // Refresh after asynchronously loaded header/footer and images settle.
  const refresh=()=>ST.refresh();
  window.addEventListener("load",refresh,{once:true});
  document.fonts?.ready?.then(refresh);
  let pending;
  const observer=new MutationObserver(()=>{clearTimeout(pending);pending=setTimeout(refresh,220)});
  observer.observe(document.querySelector("#smooth-content")||document.body,{childList:true,subtree:false});
  window.addEventListener("pagehide",()=>{observer.disconnect();clearTimeout(pending)},{once:true});
  activate(0);
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
