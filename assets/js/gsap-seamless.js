/* Page-wide GSAP choreography. Keeps layout and existing interactive scripts intact. */
(function(){
  "use strict";
  if(!window.gsap||!window.ScrollTrigger)return;
  gsap.registerPlugin(ScrollTrigger);
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(reduced)return;
  const page=document.querySelector("#smooth-content")||document.querySelector("main")||document.body;
  const sections=Array.from(page.querySelectorAll("section")).filter(s=>!s.closest("aside,.contact-drawer,footer")&&s.getBoundingClientRect().height>40);
  if(!sections.length)return;
  const motion=gsap.matchMedia();
  const progress=document.createElement("div");
  progress.className="ado-motion-progress";
  progress.setAttribute("aria-hidden","true");
  document.body.appendChild(progress);
  gsap.to(progress,{scaleX:1,ease:"none",scrollTrigger:{trigger:document.documentElement,start:"top top",end:"bottom bottom",scrub:.2}});
  sections.forEach((section,index)=>{
    section.classList.add("ado-motion-section");
    // No DOM rewriting: preserve nested markup, links, forms and SEO headings.
    const heading=Array.from(section.querySelectorAll("h1,h2,h3")).filter(el=>!el.closest("header,nav,.swiper-slide,.accordion,.contact-drawer")).slice(0,2);
    const copy=Array.from(section.querySelectorAll("p")).filter(el=>!el.closest(".swiper-slide,.accordion,.faq,.contact-drawer")).slice(0,2);
    const visuals=Array.from(section.querySelectorAll("img,video")).filter(el=>!el.closest("header,nav,.swiper-slide,.swiper-wrapper,.logo,.brand,.client,.contact-drawer")).slice(0,2);
    const cards=Array.from(section.querySelectorAll(".features-card,.service-card,.portfolio-card,.case-card")).filter(el=>!el.closest(".swiper-slide,.swiper-wrapper,.accordion")).slice(0,6);
    const trigger={trigger:section,start:"top 88%",once:true,invalidateOnRefresh:true};
    if(heading.length)gsap.fromTo(heading,{autoAlpha:0,y:Math.min(45,window.innerHeight*.05)},{autoAlpha:1,y:0,duration:1.05,stagger:.12,ease:"power3.out",clearProps:"transform,opacity,visibility",scrollTrigger:{...trigger,start:"top 90%"}});
    if(copy.length)gsap.fromTo(copy,{autoAlpha:0,y:22},{autoAlpha:1,y:0,duration:.9,stagger:.1,delay:.12,ease:"power2.out",clearProps:"transform,opacity,visibility",scrollTrigger:{...trigger,start:"top 87%"}});
    if(cards.length)gsap.fromTo(cards,{autoAlpha:0,y:32},{autoAlpha:1,y:0,duration:.85,stagger:{each:.085,from:"start"},ease:"power3.out",clearProps:"transform,opacity,visibility",scrollTrigger:{...trigger,start:"top 85%"}});
    // Gentle image entrance only; don't interfere with draggable sliders or preexisting hero timelines.
    if(index>0&&visuals.length)gsap.fromTo(visuals,{autoAlpha:0,scale:1.035},{autoAlpha:1,scale:1,duration:1.25,stagger:.12,ease:"power2.out",clearProps:"transform,opacity,visibility",scrollTrigger:{...trigger,start:"top 86%"}});
  });
  motion.add("(min-width: 992px)",()=>{
    // Parallax only on standalone visual containers, avoiding pinned/swiper elements.
    const images=sections.flatMap((s,i)=>i===0?[]:Array.from(s.querySelectorAll("img")).filter(el=>!el.closest(".swiper,.swiper-slide,.swiper-wrapper,.client,.logo,.brand,.marquee,.accordion")&&el.width>220)).slice(0,12);
    images.forEach(img=>{
      if(img.closest("[data-speed],[data-parallax]"))return;
      gsap.fromTo(img,{yPercent:-3},{yPercent:3,ease:"none",scrollTrigger:{trigger:img.closest("section"),start:"top bottom",end:"bottom top",scrub:1.3},clearProps:"transform"});
    });
  });
  const refresh=()=>ScrollTrigger.refresh();
  window.addEventListener("load",refresh,{once:true});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(refresh);
  // Async sections injected by existing components need a fresh layout measurement.
  const observer=new MutationObserver(()=>{clearTimeout(observer._t);observer._t=setTimeout(refresh,250)});
  observer.observe(page,{childList:true,subtree:false});
  window.addEventListener("pagehide",()=>{observer.disconnect();motion.revert()},{once:true});
})();
