(function () {
  'use strict';

  function initJourneyAnimation() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      setTimeout(initJourneyAnimation, 100);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const journeyContainer = document.getElementById('immersive-journey-container');
    if (!journeyContainer) return;

    // Select the slides
    const slideAchievement = document.getElementById('journey-achievement');
    const slideTextSlider = document.getElementById('journey-text-slider');
    const slideWorkShowcase = document.getElementById('journey-work-showcase');
    const slidePricing = document.getElementById('journey-pricing');
    const slideFeatures = document.getElementById('journey-features');
    const slideServicesApproach = document.getElementById('journey-services-approach');

    if (!slideAchievement || !slideTextSlider || !slideWorkShowcase || !slidePricing || !slideFeatures || !slideServicesApproach) return;

    // Element references for Immersive Achievements
    const achievementWrapper = slideAchievement.querySelector(".achievement-split-wrapper");
    const halfLeft = slideAchievement.querySelector(".half-left");
    const halfRight = slideAchievement.querySelector(".half-right");
    const stats = slideAchievement.querySelectorAll(".stat-item");
    const slogan = slideAchievement.querySelector(".achievement-slogan-overlay");
    const revealedBg = slideAchievement.querySelector(".achievement-revealed-bg");
    const revealedContent = slideAchievement.querySelector(".revealed-content");

    // Dynamic morphing SVG injection for slideServicesApproach
    const servicesView = slideServicesApproach.querySelector('#animated-images-services');
    const approachView = slideServicesApproach.querySelector('#approach-revealed-view');



    // Element references for Services & Approach
    const firstThreeSpans = gsap.utils.toArray('.char-wrapper:not(.extra-char) .char-span');
    const extraWrappers   = gsap.utils.toArray('.extra-char');
    const extraSpans      = gsap.utils.toArray('.extra-char .char-span');
    const cards           = gsap.utils.toArray('.bg-img-card');
    const paragraphs      = gsap.utils.toArray('.bg-para');

    // Element references for Work Showcase
    const workShowcase = document.getElementById('work-showcase-immersive');
    const workTrack = workShowcase ? workShowcase.querySelector('.feed-scroll-track') : null;
    const workCards = workShowcase ? workShowcase.querySelectorAll('.feed-card-item, .feed-card-end') : [];
    const workHeaders = workShowcase ? workShowcase.querySelectorAll('.project-header-item') : [];

    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: "(min-width: 992px)",
      isMobile: "(max-width: 991px)"
    }, (context) => {
      let { isDesktop } = context.conditions;

      if (isDesktop) {
        // --- DESKTOP ANIMATION: PINNED MASTER TIMELINE ---

        // 1. Initial State Setup
        gsap.set(journeyContainer, { backgroundColor: "var(--neutral-50)" });
        
        // Hide all slides except the first one (slideAchievement)
        gsap.set([slideTextSlider, slidePricing, slideFeatures, slideServicesApproach], { 
          opacity: 0, 
          pointerEvents: "none" 
        });
        gsap.set(slideAchievement, { opacity: 1, pointerEvents: "auto" });
        gsap.set(slideWorkShowcase, {
          yPercent: 100,
          opacity: 1,
          pointerEvents: "none"
        });
        gsap.set(".text-slider-box", { y: -100, opacity: 0 });
        gsap.set(".text-slider-box-2", { y: 100, opacity: 0 });

        // Immersive Achievements initial states
        gsap.set(achievementWrapper, { scale: 0.75, borderRadius: "24px", pointerEvents: "auto" });
        gsap.set(slogan, { opacity: 1, y: 0 });
        gsap.set(stats, { opacity: 0, y: 30 });
        gsap.set(revealedBg, { opacity: 0, pointerEvents: "none" });
        gsap.set(revealedContent, { opacity: 0, scale: 0.95 });
        gsap.set(halfLeft, { xPercent: 0 });
        gsap.set(halfRight, { xPercent: 0 });

        // Work showcase initial state
        if (workTrack) gsap.set(workTrack, { y: 0 });
        if (workCards.length) {
          workCards.forEach((c, idx) => c.classList.toggle('active', idx === 0));
        }
        if (workHeaders.length) {
          workHeaders.forEach((h, idx) => h.classList.toggle('active', idx === 0));
        }

        // Services & Approach initial state
        gsap.set(servicesView, { opacity: 1, y: 0 });
        gsap.set('.animated-main-title', { opacity: 0, scale: 0.85 });
        gsap.set(firstThreeSpans, { opacity: 0 });
        gsap.set(extraWrappers,   { width: 0, opacity: 0 });
        gsap.set(extraSpans,      { opacity: 0, scale: 0 });
        gsap.set(cards,           { scale: 0, opacity: 0, x: 0, y: 0, z: -500 });
        gsap.set(paragraphs,      { y: 60, opacity: 0 });
        gsap.set(approachView,    { opacity: 0, y: 120, pointerEvents: "none" });
        gsap.set('#features-header', { opacity: 1, y: 0 });
        gsap.set('#journey-features .features-card', { scale: 0, opacity: 0 });

        // Build Master Timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: journeyContainer,
            start: "top top",
            end: "+=1250%",
            pin: true,
            scrub: 1.2,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        });

        // ====================================================
        // PHASE 0: Immersive Achievements (Progress 0.0 -> 2.0)
        // ====================================================
        tl.to(achievementWrapper, {
          scale: 1,
          borderRadius: "0px",
          duration: 0.65,
          ease: "power2.inOut"
        }, 0.05);

        tl.to(slogan, {
          opacity: 0,
          y: -20,
          duration: 0.5,
          ease: "power2.out"
        }, 0.15);

        // Fade in stats and trigger odometers
        stats.forEach((stat, idx) => {
          tl.to(stat, {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: "back.out(1.4)",
            onStart: () => {
              const odometer = stat.querySelector(".odometer");
              if (odometer) {
                odometer.innerHTML = odometer.getAttribute("data-count");
              }
            }
          }, 0.45 + idx * 0.18);
        });

        // Split the image halves horizontally
        tl.to(halfLeft, {
          xPercent: -100,
          duration: 0.85,
          ease: "power2.inOut"
        }, 1.25);

        tl.to(halfRight, {
          xPercent: 100,
          duration: 0.85,
          ease: "power2.inOut"
        }, 1.25);

        tl.to(achievementWrapper, {
          pointerEvents: "none",
          duration: 0.1
        }, 1.25);

        tl.to(stats, {
          opacity: 0,
          scale: 0.85,
          duration: 0.55,
          ease: "power2.inOut"
        }, 1.25);

        tl.to(revealedBg, {
          opacity: 1,
          pointerEvents: "auto",
          duration: 0.65,
          ease: "power2.inOut"
        }, 1.35);

        tl.to(revealedContent, {
          opacity: 1,
          scale: 1,
          duration: 0.65,
          ease: "power2.out"
        }, 1.55);

        // ====================================================
        // PHASE 1: Achievements -> Text Slider (Progress 2.0 -> 3.25)
        // ====================================================
        tl.to(slideAchievement, {
          opacity: 0,
          scale: 0.9,
          duration: 0.45,
          ease: "power2.in"
        }, 2.0);

        tl.set(slideAchievement, { pointerEvents: "none" }, 2.45);

        tl.to(slideTextSlider, {
          opacity: 1,
          pointerEvents: "auto",
          duration: 0.45,
          ease: "power2.out"
        }, 2.0);

        // Converge Text Slider Boxes from Top and Bottom
        tl.to(".text-slider-box", {
          y: 0,
          opacity: 1,
          duration: 0.45,
          ease: "power2.out"
        }, 2.15);

        tl.to(".text-slider-box-2", {
          y: 0,
          opacity: 1,
          duration: 0.45,
          ease: "power2.out"
        }, 2.15);

        tl.to([".text-slider-box", ".text-slider-box-2"], {
          y: -600,
          duration: 0.5,
          ease: "power2.in"
        }, 2.6);

        tl.to(slideTextSlider, {
          y: -600,
          duration: 0.5,
          ease: "power2.in"
        }, 2.6);

        tl.set(slideTextSlider, { pointerEvents: "none" }, 3.05);

        tl.to(slideWorkShowcase, {
          yPercent: 0,
          pointerEvents: "auto",
          duration: 0.65,
          ease: "power2.out"
        }, 2.6);

        // ----------------------------------------------------
        // PHASE 2: Work Showcase Card Feed Scroll (Progress 3.15 -> 5.15)
        // ----------------------------------------------------
        if (workTrack && workCards.length) {
          const totalItems = workCards.length;
          workCards.forEach((card, idx) => {
            const stepStart = 3.15 + (idx / totalItems) * 1.5;
            const isLast = (idx === totalItems - 1);
            const targetY = isLast ? -card.offsetTop + window.innerHeight - 520 : -card.offsetTop;

            if (isLast) {
              // 1. Scroll track to align the end card at the bottom/lower-right of viewport (stuck/held)
              tl.to(workTrack, {
                y: targetY,
                duration: 0.4,
                ease: "power2.out"
              }, stepStart);

              // 2. Let it stay stuck in its normal state (this acts as a pause while scrolling)
              // 3. Start full-screen expansion animation at stepStart + 0.6
              const expandStart = stepStart + 0.6;

              // Scroll track slightly more to align the card's top with the top of the viewport
              tl.to(workTrack, {
                y: -card.offsetTop - 120,
                duration: 0.5,
                ease: "power2.out"
              }, expandStart);

              // Fade out and shrink left panel
              tl.to(".showcase-left-panel", {
                width: "0%",
                paddingLeft: "0px",
                opacity: 0,
                duration: 0.5,
                ease: "power2.out"
              }, expandStart);

              // Expand right panel to fill full width
              tl.to(".showcase-right-feed", {
                width: "100%",
                duration: 0.5,
                ease: "power2.out"
              }, expandStart);

              // Hide floating text
              tl.to(".showcase-floating-text", {
                opacity: 0,
                duration: 0.3,
                ease: "power2.out"
              }, expandStart);

              // Expand feed-card-end to fill screen
              tl.to(card, {
                width: "100%",
                maxWidth: "100%",
                margin: 0,
                scale: 1,
                duration: 0.5,
                ease: "power2.out"
              }, expandStart);

              const innerCta = card.querySelector('.cta-text-card');
              if (innerCta) {
                tl.to(innerCta, {
                  width: "100%",
                  height: "100vh",
                  borderTopLeftRadius: "0px",
                  paddingLeft: "8%",
                  duration: 0.5,
                  ease: "power2.out"
                }, expandStart);
              }

              // Animate button falling down with bounce
              const ctaBtn = card.querySelector('.cta-card-link');
              if (ctaBtn) {
                tl.fromTo(ctaBtn,
                  { y: -120, opacity: 0 },
                  { y: 0, opacity: 1, duration: 0.6, ease: "bounce.out" },
                  expandStart + 0.15
                );
              }
            } else {
              // Standard card scrolling behavior
              tl.to(workTrack, {
                y: targetY,
                duration: 0.35,
                ease: "power2.out"
              }, stepStart);
            }

            // Update classes
            tl.call(() => {
              workCards.forEach((c, i) => {
                c.classList.toggle('active', i === idx);
                c.classList.toggle('exit-fade', isLast && i < idx);
              });
              workHeaders.forEach((h, i) => h.classList.toggle('active', i === idx));
            }, null, stepStart);
          });
        }

        // 4. Button wipe transition to white page transition:
        // - First, scale the button 20% (scale: 1.2), fade out the text inside it, and fade out the rest of the CTA text.
        // - Then, explode the button to scale: 100, border-radius: 0px to cover the entire container/viewport with solid white.
        // - While the white space fills, fade in the new expanded heading and paragraphs inside it.
        // - Finally, fade out the Work Showcase slide.
        tl.to('.feed-card-end .cta-card-link', {
          scale: 1.2,
          color: "var(--neutral-50)",
          pointerEvents: "none",
          duration: 0.25,
          ease: "power2.out"
        }, 5.95);

        tl.to('.feed-card-end .cta-card-subtitle, .feed-card-end .cta-card-title', {
          opacity: 0,
          duration: 0.2,
          ease: "power2.out"
        }, 5.95);

        tl.to('.feed-card-end .cta-card-link', {
          scale: 100,
          borderRadius: "0px",
          duration: 0.45,
          ease: "power2.in"
        }, 6.2);

        // Fade in new expanded text and heading inside the white space
        tl.fromTo('.feed-card-end .cta-expanded-content', {
          opacity: 0,
          y: 40
        }, {
          opacity: 1,
          y: 0,
          pointerEvents: "auto",
          duration: 0.35,
          ease: "power2.out"
        }, 6.3);

        tl.to(slideWorkShowcase, {
          xPercent: 100,
          duration: 0.5,
          ease: "power2.inOut"
        }, 7.35);

        tl.set(slideWorkShowcase, { opacity: 0, xPercent: 0, pointerEvents: "none" }, 7.85);

        // ----------------------------------------------------
        // PHASE 3: Pricing Plans Reveal (Progress 7.35 -> 8.85)
        // ----------------------------------------------------
        tl.fromTo(slidePricing,
          { xPercent: -100, opacity: 1, scale: 1 },
          { xPercent: 0, opacity: 1, scale: 1, pointerEvents: "auto", duration: 0.5, ease: "power2.inOut" },
          7.35
        );

        tl.fromTo("#pricing-container",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
          7.7
        );

        tl.to(slidePricing, {
          opacity: 0,
          y: -50,
          duration: 0.45,
          ease: "power2.in"
        }, 8.65);

        tl.set(slidePricing, { pointerEvents: "none" }, 9.1);

        // ----------------------------------------------------
        // PHASE 4: Features Reveal (Progress 8.85 -> 10.15)
        // ----------------------------------------------------
        tl.fromTo(slideFeatures,
          { opacity: 0, scale: 1.05 },
          { opacity: 1, scale: 1, pointerEvents: "auto", duration: 0.35, ease: "power2.out" },
          8.85
        );

        // 1. First, animate the center circle / logo
        tl.fromTo(".features-center",
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.2, ease: "back.out(1.2)" },
          9.0
        );

        // 2. Next, expand the side-line-main width using clipPath (reveals symmetrically from center)
        tl.fromTo(".side-line-main",
          { clipPath: "inset(0% 50% 0% 50%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.2, ease: "power2.inOut" },
          9.1
        );

        // 3. Finally, stagger the scale-in of each card in the left and right columns
        const colCards = gsap.utils.toArray("#features-col-left .features-card, #features-col-right .features-card");
        if (colCards.length > 0) {
          tl.fromTo(colCards,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, stagger: 0.04, duration: 0.25, ease: "back.out(1.2)" },
            9.2
          );

          // 5. Reverse: Scale-down the column cards, leaving only the center card
          tl.to(colCards, {
            scale: 0,
            opacity: 0,
            stagger: 0.04,
            duration: 0.25,
            ease: "back.in(1.2)"
          }, 9.75);
        }

        // Hide features-header before slide ends (starts simultaneously with cards reverse)
        tl.to("#features-header", {
          opacity: 0,
          y: -20,
          duration: 0.3,
          ease: "power2.in"
        }, 9.75);

        // 6. Reverse: Shrink side lines back into the center card
        tl.to(".side-line-main", {
          clipPath: "inset(0% 50% 0% 50%)",
          duration: 0.2,
          ease: "power2.inOut"
        }, 9.85);

        // 7. Slide exits (only center logo is left, which scales up to 1.2, translates to x: 4, y: -49, and fades out)
        tl.to(slideFeatures, {
          opacity: 0,
          duration: 0.35,
          ease: "power2.in"
        }, 11.0);

        tl.set(slideFeatures, { pointerEvents: "none" }, 11.35);

        // ----------------------------------------------------
        // PHASE 5: Services & Approach (Progress 10.15 -> 11.85)
        // ----------------------------------------------------
        tl.fromTo(slideServicesApproach,
          { opacity: 0 },
          { opacity: 1, pointerEvents: "auto", duration: 0.4, ease: "power2.out" },
          10.15
        );

        // Center card collapse
        tl.to('.features-center', {
          scale: 1.15,
          y: -25,
          ease: 'power1.inOut',
          duration: 0.3
        }, 10.35);

        tl.to('.features-center', {
          scaleY: 0,
          scaleX: 3,
          y: -50,
          opacity: 0,
          ease: 'power2.inOut',
          duration: 0.4
        }, 10.55);

        // Cards burst
        cards.forEach((card, i) => {
          const angle = (i / cards.length) * Math.PI * 2;
          const destX = Math.cos(angle) * (180 + i * 20);
          const destY = Math.sin(angle) * (130 + i * 16);
          const spin  = i % 2 === 0 ? -10 : 10;

          tl.fromTo(card,
            { scale: 0, opacity: 0, x: 0, y: 0, z: -500, rotation: spin * 2 },
            { scale: 1, opacity: 1, x: destX, y: destY, z: 0, rotation: spin, ease: 'power2.out', duration: 0.35 },
            10.55 + i * 0.02
          );

          tl.to(card, {
            scale: 4.2,
            opacity: 0,
            z: 700,
            x: destX * 3,
            y: destY * 3,
            rotation: spin * 3,
            ease: 'power2.in',
            duration: 0.4
          }, 11.25 + i * 0.02);
        });

        // Title build
        tl.to('.animated-main-title', {
          opacity: 1, scale: 1, ease: 'power2.out', duration: 0.3
        }, 10.65);

        const firstThreeOffsets = [{ x: -160, y: 0 }, { x: 0, y: 160 }, { x: 160, y: 0 }];
        tl.fromTo(firstThreeSpans, {
          scale: 2.5, opacity: 0,
          x: (i) => firstThreeOffsets[i % 3].x,
          y: (i) => firstThreeOffsets[i % 3].y
        }, {
          scale: 1, opacity: 1, x: 0, y: 0, ease: 'power2.out', duration: 0.45
        }, 10.65);

        tl.to(extraWrappers, {
          width: '8.2vw', opacity: 1, ease: 'power2.inOut', duration: 0.5
        }, 10.75);

        const extraOffsets = [{ x: -160, y: 0 }, { x: 0, y: 160 }, { x: 160, y: 0 }, { x: -160, y: 0 }, { x: 0, y: 160 }, { x: 160, y: 0 }];
        tl.fromTo(extraSpans, {
          scale: 0, opacity: 0,
          x: (i) => extraOffsets[i % 6].x,
          y: (i) => extraOffsets[i % 6].y
        }, {
          scale: 1, opacity: 1, x: 0, y: 0, ease: 'back.out(1.2)', duration: 0.5, stagger: 0.02
        }, 10.8);

        // Paragraphs
        paragraphs.forEach((para, i) => {
          tl.to(para, { y: 0, opacity: 1, ease: 'power2.out', duration: 0.3 }, 10.85 + i * 0.03);
          tl.to(para, { opacity: 0, y: -30, ease: 'power2.in', duration: 0.25 }, 11.25 + i * 0.03);
        });

        // Title and view transition to White
        tl.to('.animated-main-title', {
          opacity: 0, scale: 0.75, duration: 0.35, ease: 'power2.in'
        }, 11.35);

        tl.to(servicesView, {
          opacity: 0, y: -50, pointerEvents: "none", duration: 0.4
        }, 11.5);

        tl.to(journeyContainer, {
          backgroundColor: "var(--neutral-50)", duration: 0.6, ease: "power2.inOut"
        }, 11.35);

        tl.fromTo(approachView, 
          { opacity: 0, y: 120 },
          { opacity: 1, y: 0, pointerEvents: "auto", duration: 0.7, ease: "power2.out" },
          11.55
        );

        const approachBoxes = approachView.querySelectorAll(".approach-box");
        approachBoxes.forEach((box, idx) => {
          tl.fromTo(box,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
            11.7 + idx * 0.12
          );
        });

      } else {
        // --- MOBILE FALLBACK: STACKED scrollTrigger reveals ---
        gsap.set(journeyContainer, { backgroundColor: "#09090b" });
        gsap.set([slideAchievement, slideTextSlider, slideWorkShowcase, slidePricing, slideFeatures, slideServicesApproach], { 
          opacity: 1, 
          pointerEvents: "auto",
          y: 0,
          scale: 1
        });

        gsap.set(servicesView, { opacity: 1, y: 0, pointerEvents: "auto" });
        gsap.set(approachView, { opacity: 1, scale: 1, pointerEvents: "auto" });
        gsap.set(".text-slider-box", { y: 0, opacity: 1 });
        gsap.set(".text-slider-box-2", { y: 0, opacity: 1 });
        gsap.set('.animated-main-title', { opacity: 0, scale: 0.9 });
        gsap.set(firstThreeSpans, { opacity: 1 });
        gsap.set(extraWrappers,   { width: '24px', opacity: 1 });
        gsap.set(extraSpans,      { opacity: 1, scale: 1 });
        gsap.set(cards,           { scale: 1, opacity: 1, x: 0, y: 0 });
        gsap.set(paragraphs,      { y: 0, opacity: 1 });

        // Immersive Achievements mobile states
        gsap.set(achievementWrapper, { scale: 1, borderRadius: "0px" });
        gsap.set(slogan, { opacity: 1, y: 0 });
        gsap.set(stats, { opacity: 1, y: 0 });
        gsap.set(revealedBg, { opacity: 1, pointerEvents: "auto" });
        gsap.set(revealedContent, { opacity: 1, scale: 1 });
        gsap.set(halfLeft, { xPercent: 0 });
        gsap.set(halfRight, { xPercent: 0 });
        stats.forEach(stat => {
          const odometer = stat.querySelector(".odometer");
          if (odometer) {
            odometer.innerHTML = odometer.getAttribute("data-count");
          }
        });

        // Work showcase mobile animations
        if (workCards.length) {
          workCards.forEach((card) => {
            gsap.fromTo(card, 
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                scrollTrigger: {
                  trigger: card,
                  start: "top 85%",
                  toggleActions: "play none none reverse"
                }
              }
            );
          });
        }

        // Pricing card stack mobile animations
        const pricingCards = document.querySelectorAll("#pricing-container .grc-4");
        if (pricingCards.length) {
          pricingCards.forEach((c) => {
            gsap.fromTo(c,
              { opacity: 1 },
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                scrollTrigger: {
                  trigger: c,
                  start: "top 85%"
                }
              }
            );
          });
        }

        // Services fade-in
        gsap.to('.animated-main-title', {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: servicesView,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        });

        // Approach boxes
        const approachBoxes = approachView.querySelectorAll(".approach-box");
        approachBoxes.forEach((box) => {
          gsap.fromTo(box,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              scrollTrigger: {
                trigger: box,
                start: "top 85%"
              }
            }
          );
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initJourneyAnimation);
  } else {
    initJourneyAnimation();
  }
})();