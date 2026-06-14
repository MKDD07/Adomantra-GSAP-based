/**
 * Case Studies Details Loader
 * Each section renderer now targets a dedicated #id in the HTML instead of appending into a single container.
 */
/* cs-hero: badge, duration, summary, project objective, KPI cards */
/* cs-brand-gallery: 3 images for each brand (10on10 Foods, Kaya, Patanjali) */
/* cs-detailed-summary: pexels image, heading, paragraph */
/* cs-approach-circles: SVG progress rings with title, color, value, desc */
/* cs-overview: client profile list, baseline benchmark definition list */
/* cs-audit: checked / crossed items per audit category */
/* cs-challenges: numbered cards with title and body */
/* cs-strategy: timeline blocks with title, paragraph, tech tags */
/* cs-weekly-plan: week cards with task list and status icons */
/* cs-results: data table with trend indicators, executive quote */
/* cs-takeaways: key learnings list */

/* service-title: case study title */
/* breadcrumb-current: badge name for breadcrumb */
/* service-thumb-1: pexels bg image query target */

(function ($) {
  "use strict";

  const JSON_PATH = "assets/js/json/case-studies-contents.json";

  async function init() {
    try {
      const response = await fetch(JSON_PATH);
      const data = await response.json();

      // Determine which case study to render (using url query param or fallback to first)
      const urlParams = new URLSearchParams(window.location.search);
      const slug = urlParams.get("case") || urlParams.get("slug");
      
      let caseStudy = null;
      if (slug) {
        caseStudy = data.find(cs => cs.slug === slug || cs.id === slug);
      }
      if (!caseStudy && data && data.length > 0) {
        caseStudy = data[0];
      }

      if ($("#case-study-detail-section-dynamic").length > 0 && caseStudy) {
        renderCaseStudy(caseStudy);
        initCirclesGSAP();
        initGSAPAnimations();
      }
    } catch (error) {
      console.error("Error loading case study details:", error);
    }
  }

  function renderCaseStudy(cs) {
    if (!cs) return;

    // Update global layouts (outside dynamic area)
    if ($("#service-title").length)      $("#service-title").html(cs.title);
    if ($("#breadcrumb-current").length) $("#breadcrumb-current").text(cs.badge);
    if ($("#service-thumb-1").length && cs.hero) {
      $("#service-thumb-1")
        .css("background-image", "url('assets/images/service/services-card/service_0001.jpg')")
        .attr("data-target", cs.hero)
        .attr("data-pexels-mode", "bg")
        .removeAttr("data-pexels-done");
      
      if (window.PexelsLoader) {
        window.PexelsLoader.scan();
      }
    }

    // Render each section into its own #id slot
    renderHero(cs);
    renderBrandGallery(cs);
    renderDetailedSummary(cs);
    renderApproachCircles(cs);
    renderOverview(cs);
    renderAudit(cs);
    renderChallenges(cs);
    renderDetailedParagraph(cs);
    renderStrategy(cs);
    renderWeeklyPlan(cs);
    renderResults(cs);
    renderTakeaways(cs);

    // Build sidebar Table of Contents index
    buildTOC(cs);

    // Trigger Pexels scan on injected elements
    if (window.PexelsLoader) window.PexelsLoader.scan();
  }

  function buildTOC(cs) {
    const $list = $("#cs-toc-list");
    if (!$list.length) return;
    $list.empty();

    const sections = [];

    if ($("#cs-hero").length && cs.summary) {
      sections.push({ id: "cs-hero", label: "Overview" });
    }
    if ($("#cs-brand-gallery").length && cs.brandImages) {
      sections.push({ id: "cs-brand-gallery", label: "Brand Showcase" });
    }
    if ($("#cs-detailed-summary").length && cs.comprehensiveSummary) {
      sections.push({ id: "cs-detailed-summary", label: "Detailed Summary" });
    }
    if ($("#cs-detailed-paragraph").length && (cs.detaiedParagraph || cs.detailedParagraph)) {
      sections.push({ id: "cs-detailed-paragraph", label: "Detailed Insights" });
    }
    if ($("#cs-approach-circles").length && cs.ourApproachCircles) {
      sections.push({ id: "cs-approach-circles", label: "Our Approach" });
    }
    if ($("#cs-overview").length && cs.clientOverview) {
      sections.push({ id: "cs-overview", label: "Baseline & Profile" });
    }
    if ($("#cs-audit").length && cs.campaignAudit) {
      sections.push({ id: "cs-audit", label: "Campaign Audit" });
    }
    if ($("#cs-challenges").length && cs.challenges) {
      sections.push({ id: "cs-challenges", label: "Key Challenges" });
    }
    if ($("#cs-strategy").length && cs.strategy) {
      sections.push({ id: "cs-strategy", label: "Growth Journey" });
    }
    if ($("#cs-weekly-plan").length && cs.weeklyPlan) {
      sections.push({ id: "cs-weekly-plan", label: "Execution Plan" });
    }
    if ($("#cs-results").length && cs.results) {
      sections.push({ id: "cs-results", label: "Campaign Results" });
    }
    if ($("#cs-takeaways").length && cs.summaryFooter) {
      sections.push({ id: "cs-takeaways", label: "Key Takeaways" });
    }

    sections.forEach(sec => {
      $list.append(`<li><a href="#${sec.id}" class="toc-link">${sec.label}</a></li>`);
    });

    // Smooth scroll handler
    $(".toc-link").off("click").on("click", function (e) {
      e.preventDefault();
      const target = $(this).attr("href");
      if ($(target).length) {
        $("html, body").animate({
          scrollTop: $(target).offset().top - 100
        }, 600);
      }
    });

    // ScrollSpy to highlight active section
    $(window).off("scroll.toc").on("scroll.toc", function () {
      const scrollPos = $(document).scrollTop();
      sections.forEach(sec => {
        const $el = $(`#${sec.id}`);
        if ($el.length) {
          const top = $el.offset().top - 150;
          const bottom = top + $el.outerHeight();
          if (scrollPos >= top && scrollPos <= bottom) {
            $(".toc-link").removeClass("active");
            $(`.toc-link[href="#${sec.id}"]`).addClass("active");
          }
        }
      });
    });
  }

  /* ── SECTION RENDERERS — each targets a dedicated #id in the HTML ──────── */

  function renderHero(cs) {
    const $el = $("#cs-hero");
    if (!$el.length) return;

    let kpiHtml = "";
    cs.kpis.forEach((kpi, idx) => {
      const highlightClass = idx === 0 ? "highlight" : "";
      kpiHtml += `
        <div class="pricing-item grc-4 p-30 w-100 fl f-jcsb f-aic ${highlightClass}">
        <div>
                    <label class="kpi-label">${kpi.label}</label>

          <span class="kpi-subtext">${kpi.subtext}</span>
          </div>
                      <span class="kpi-metric">${kpi.metric}</span>

        </div>`;
    });

    $el.html(`
      <header class="cs-hero-section container rr-container-1800">
        <div class="fl f-jcsb f-aie my-2">
          <div class="cs-meta-upper w-100">
            <span class="cs-badge badge-primary">${cs.badge}</span>
            <span class="cs-duration-tag"><time datetime="P6M">${cs.duration}</time></span>
          </div>
        </div>
        <div class="grc">
          <div class="grc-6 p-30 cs-header-card">
            <h2 class="title-cs" style="--color-white: var(--neutral-100) !important;">Summary</h2>
            <p class="cs-lead-paragraph">${cs.summary}</p>
          </div>
          <div class="grc-6 p-30 cs-info">
            <p class="cs-lead-paragraph">${cs.projectobjective}</p>
          </div>
        <div class="cs-kpi-dashboard grc-12 grc" role="region" aria-label="Key Performance Indicators">
          ${kpiHtml}
        </div>        </div>
      </header>`);
  }

  function renderBrandGallery(cs) {
    const $el = $("#cs-brand-gallery");
    if (!$el.length || !cs.brandImages) return;

    let brandsHtml = "";
    cs.brandImages.forEach(brandObj => {
      let imgsHtml = "";
      brandObj.images.forEach(imgQuery => {
        imgsHtml += `
          <div class="col-4 px-1">
            <div class="brand-image-wrapper">
              <img data-target="${imgQuery}" class="w-100 h-100" alt="${brandObj.brand} image">
            </div>
          </div>`;
      });

      brandsHtml += `
        <div class="col-lg-4 mb-4">
          <div class="brand-gallery-card">
            <h4>${brandObj.brand}</h4>
            <div class="row g-0">
              ${imgsHtml}
            </div>
          </div>
        </div>`;
    });

    $el.html(`
      <section class="brand-showcase-section my-5 container rr-container-1800">
        <h2 class="text-center mb-4">Partner Brand Showcases</h2>
        <div class="row">
          ${brandsHtml}
        </div>
      </section>`);
  }

  function renderDetailedSummary(cs) {
    const $el = $("#cs-detailed-summary");
    if (!$el.length || !cs.comprehensiveSummary) return;

    $el.html(`
      <section class="cs-comp-summary container rr-container-1800">
        <div class="grc grc-12">
          <div class="grc-6 order-2 order-md-1 d-flex align-items-center">
            <img data-target="${cs.comprehensiveSummary.imageQuery}"
                 class="img-fluid"
                 alt="${cs.comprehensiveSummary.heading}">
          </div>
          <div class="grc-6 order-1 order-md-2 d-flex flex-column justify-content-center">
            <h2 class="mb-3">${cs.comprehensiveSummary.heading}</h2>
            <p class="lead-text">
              ${cs.comprehensiveSummary.paragraph}
            </p>
          </div>
        </div>
      </section>`);
  }

  function renderApproachCircles(cs) {
    const $el = $("#cs-approach-circles");
    if (!$el.length || !cs.ourApproachCircles) return;

    let blocksHtml = "";
    cs.ourApproachCircles.blocks.forEach(block => {
      blocksHtml += `
        <div class="approach-circle-block">
          <div class="circle-container">
            <svg class="progress-ring" width="200" height="200" viewBox="0 0 79 79">
              <path d="M78.0578 39.0289C78.0578 60.584 60.584 78.0578 39.0289 78.0578C17.4738 78.0578 0 60.584 0 39.0289C0 17.4738 17.4738 0 39.0289 0C60.584 0 78.0578 17.4738 78.0578 39.0289ZM8.60286 39.0289C8.60286 55.8327 22.2251 69.4549 39.0289 69.4549C55.8327 69.4549 69.4549 55.8327 69.4549 39.0289C69.4549 22.2251 55.8327 8.60286 39.0289 8.60286C22.2251 8.60286 8.60286 22.2251 8.60286 39.0289Z" fill="#E4ECF7" style="fill:#E4ECF7;fill:color(display-p3 0.8941 0.9255 0.9686);fill-opacity:1;"/>
              <circle class="progress-ring__circle bar"
                      stroke="${block.color}" stroke-width="8.6" fill="transparent" r="34.7" cx="39.5" cy="39.5"
                      data-target="${block.value}"/>
            </svg>
            <div class="circle-text" style="color:${block.color};">${block.title}</div>
          </div>
          <p class="approach-desc">${block.desc}</p>
        </div>`;
    });

    $el.html(`
      <section class="approach-circles-section container rr-container-1800">
        <h2 class="title" style="--color-white: var(--neutral-100) !important;">${cs.ourApproachCircles.title}</h2>
        <p class="text-muted">${cs.ourApproachCircles.subtitle}</p>
        <div class="circles-grid">${blocksHtml}</div>
      </section>`);
  }

  function renderOverview(cs) {
    const $el = $("#cs-overview");
    if (!$el.length) return;

    // Map component items into 3 separate visual vertical cards
    let componentsHtml = cs.clientOverview.dataBox1.items.map((item, idx) => {
      let parts = item.split("</strong>");
      let title = parts[0] ? parts[0] + "</strong>" : `Component ${idx + 1}`;
      let desc = parts[1] || "";
      if (desc.startsWith(":")) {
        desc = desc.substring(1).trim();
      }

      // Match text inside parentheses, e.g. "10on10 Foods"
      let brandMatch = title.match(/\(([^)]+)\)/);
      let brandName = brandMatch ? brandMatch[1] : "";
      
      // Remove parentheses, brand name and trailing colons from title
      let cleanTitle = title.replace(/\s*\([^)]+\)/g, "").replace(/:\s*<\/strong>$/, "</strong>");

      return `
        <div class="pr blue-card border-radius-12 cursor-pointer" onclick="document.getElementById('comp-detail-${idx + 1}').scrollIntoView({ behavior: 'smooth' })">
          <div class="d-flex align-items-center w-100 gap-3">
            <div class="flex-grow-1">
              <h5>${cleanTitle}</h5>
              <p>${desc}</p>
            </div>
            <i class="fa-regular fa-circle-arrow-right ms-3"></i>
          </div>
        </div>`;
    }).join("");

    // Map baseline benchmark items into horizontal bar graphs
    const baselineWidths = {
      "Brand Visibility Position:": 15,
      "Out of Stock Incidents:": 22,
      "Repeat Purchase Rate:": 11
    };

    let benchmarkHtml = cs.clientOverview.dataBox2.items.map(item => {
      const width = baselineWidths[item.label] || 20;
      return `
        <div class="mb-3 pr">
          <div class="d-flex justify-content-between text-muted small mb-1">
            <span>${item.label}</span>
            <span class="vertical-text mr-4">${item.value}</span>
          </div>
          <div class="delay-progress mb-12">
            <div class="progress-line" style="width: ${width}%; background: var(--fire); height: 100%; transition: width 1.2s ease-out;"></div>
          </div>
        </div>`;
    }).join("");

    $el.html(`
      <section class="cs-profile-section">
        <h2 class="title" style="--color-white: var(--neutral-100) !important;">${cs.clientOverview.title}</h2>
        <p>${cs.clientOverview.description}</p>

        <div class="grc mt-5">
          <div class="grc-6">
            <h3 class="mb-3">${cs.clientOverview.dataBox1.title}</h3>
            <div class="components-wrapper">
              ${componentsHtml}
            </div>
          </div>
          <div class="grc-6">
            <h3 class="mb-3">${cs.clientOverview.dataBox2.title}</h3>
            <div class="baseline-bars-wrapper pr mt-3">
              ${benchmarkHtml}
            </div>
          </div>
        </div>
      </section>`);
  }

  function renderAudit(cs) {
    const $el = $("#cs-audit");
    if (!$el.length || !cs.campaignAudit) return;

    const categoryConfig = {
      "Listing Visibility (Dark Store Discovery)": { icon: "fa-chart-line", sub: "Discovery Audit" },
      "Listing Optimization Strategy": { icon: "fa-rectangle-list", sub: "Conversion Audit" },
      "Performance Marketing Coordination": { icon: "fa-bullhorn", sub: "Ad Budget Audit" }
    };

    let categoriesHtml = cs.campaignAudit.categories.map((cat, idx) => {
      const config = categoryConfig[cat.name] || { icon: "fa-circle-info", sub: "Audit Card" };
      // Extract short name without parentheses
      const displayName = cat.name.split(" (")[0];

      return `
        <div class="grc-4 audit-pricing-card state-solution effectFade fadeRotateX" data-delay="${0.1 * (idx + 1)}">
          <div class="top d-flex gap-12 align-items-center">
            <div class="d-flex gap-8 align-items-center">
              <i class="fa-solid ${config.icon} fs-24"></i>
              <div class="head ms-2">${displayName}</div>
            </div>
            <div class="subtext">${config.sub}</div>
          </div>
          <div class="line-new-design"></div>
          <div class="content">
            <div class="audit-toggle-pane" data-pane="failure">
              <div class="title mb-3"><i class="fa-solid fa-triangle-exclamation icon"></i> Critical Failure</div>
              <div class="text">${cat.crossed}</div>
            </div>
            <div class="audit-toggle-pane" data-pane="solution">
              <div class="title mb-3"><i class="fa-solid fa-circle-check icon"></i> Adomantra Solution</div>
              <div class="text">${cat.checked}</div>
            </div>
          </div>
        </div>`;
    }).join("");

    $el.html(`
      <section class="audit-section-container">
        <div class="audit-wind-doodles">
          <svg viewBox="0 0 1200 400" preserveAspectRatio="none" class="wind-svg">
            <path class="wind-path wind-path-1" d="M -50,180 C 200,60 500,340 800,180 C 1100,20 1300,150 1400,180" fill="none" stroke="rgba(18, 87, 162, 0.15)" stroke-width="2" stroke-dasharray="150, 300" />
            <path class="wind-path wind-path-2" d="M -50,100 C 300,280 650,40 950,220 C 1150,110 1300,140 1400,100" fill="none" stroke="rgba(228, 236, 247, 0.22)" stroke-width="1.5" stroke-dasharray="100, 200" />
            <path class="wind-path wind-path-3" d="M -50,280 C 250,120 550,380 850,200 C 1100,40 1250,290 1400,280" fill="none" stroke="rgba(18, 87, 162, 0.1)" stroke-width="3" stroke-dasharray="200, 400" />
          </svg>
        </div>
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-4 mb-5">
          <div class="audit-section-header mb-0">
            <h2 class="title" style="--color-white: var(--neutral-100) !important;">${cs.campaignAudit.title}</h2>
            <p class="text-muted mb-0">${cs.campaignAudit.subtitle}</p>
          </div>
          <div class="d-flex align-items-center gap-3 flex-wrap p-3 border-radius-12">
            <span class="text-danger">Failure Audit</span>
            <input type="checkbox" id="auditSwitch" class="tf-switch-check" checked> 
            <span class="text-success">Result Audit</span>
          </div>
        </div>
        <div class="grc">${categoriesHtml}</div>
      </section>`);

    const handleToggle = () => {
      const isChecked = $("#auditSwitch").is(":checked");
      const cards = $(".audit-pricing-card");

      if (isChecked) {
        cards.removeClass("state-failure").addClass("state-solution");
        $(".audit-toggle-pane[data-pane='solution']").fadeIn(250);
        $(".audit-toggle-pane[data-pane='failure']").hide();
        
        cards.each(function(idx) {
          gsap.to(this, {
            transform: `translate(0px, ${idx * 20}px) scale(0.9983, 0.9983)`,
            duration: 0.4,
            ease: "power2.out"
          });
        });
      } else {
        cards.removeClass("state-solution").addClass("state-failure");
        $(".audit-toggle-pane[data-pane='failure']").fadeIn(250);
        $(".audit-toggle-pane[data-pane='solution']").hide();

        cards.each(function(idx) {
          const reverseIdx = 2 - idx;
          gsap.to(this, {
            transform: `translate(0px, ${reverseIdx * 20}px) scale(0.9983, 0.9983)`,
            duration: 0.4,
            ease: "power2.out"
          });
        });
      }
    };

    $(document).off("change", "#auditSwitch").on("change", "#auditSwitch", handleToggle);
    handleToggle();
  }

  function renderChallenges(cs) {
    const $el = $("#cs-challenges");
    if (!$el.length) return;

    let cardsHtml = cs.challenges.cards.map((card, idx) => {
      const accentColors = ["var(--primary-color)", "var(--sunset)", "var(--ocean)"];
      const bgGradients = [
        "linear-gradient(180deg, rgba(18, 87, 162, 0.03) 0%, rgba(18, 87, 162, 0) 100%)",
        "linear-gradient(180deg, rgba(234, 88, 12, 0.03) 0%, rgba(234, 88, 12, 0) 100%)",
        "linear-gradient(180deg, rgba(22, 163, 74, 0.03) 0%, rgba(22, 163, 74, 0) 100%)"
      ];
      const accentColor = accentColors[idx % accentColors.length];
      const bgGradient = bgGradients[idx % bgGradients.length];

      return `
        <div class="grc-4">
          <article class="challenge-card features-card h-100" style="--accent-color: ${accentColor}; background: ${bgGradient};">
            <span class="challenge-bg-number">${card.num}</span>
            <div class="challenge-header mb-3">
              <span class="challenge-badge">Challenge ${card.num}</span>
            </div>
            <div class="challenge-body">
              <h3 class="challenge-title">${card.title}</h3>
              <p class="challenge-desc">${card.body}</p>
            </div>
          </article>
        </div>`;
    }).join("");

    $el.html(`
      <section class="cs-challenge-section container rr-container-1800">
        <div class="text-center mb-5">
          <h2 class="title" style="--color-white: var(--neutral-100) !important;">${cs.challenges.title}</h2>
          <p class="text-muted mx-auto" style="max-width: 720px; font-size: var(--text-base);">${cs.challenges.description}</p>
        </div>
        <div class="grc">
          ${cardsHtml}
        </div>
      </section>`);
  }

function renderDetailedParagraph(cs) {
  const data = cs.detaiedParagraph || cs.detailedParagraph;
  const $el = $("#cs-detailed-paragraph");
  if (!data || !$el.length) return $el.hide();

  $el.empty().show();

  let paragraphs = [];
  if (Array.isArray(data)) {
    paragraphs = data;
  } else if (typeof data === "string") {
    let clean = data.trim().replace(/^<p>/i, "").replace(/<\/p>$/i, "");
    paragraphs = clean.split(/<br\s*\/?>/i);
  }
  $el.append('<div class="grc-3"></div>');

  const $content = $('<div class="detailed-paragraph-content grc-6"></div>');

  paragraphs
    .map(p => p.trim())
    .filter(Boolean)
    .forEach(p => {
      if (p.startsWith("<p") || p.startsWith("<div") || p.startsWith("<h")) {
        $content.append(p);
      } else {
        $content.append(`<p>${p}</p>`);
      }
    });

  $el.append($content);
  $el.append('<div class="grc-1"></div>');
  $el.append(`
    <div class="cs-absolute-sidebar grc-2">
      <nav class="cs-index-nav">
        <h5 class="mb-3">Index</h5>
        <ul class="list-unstyled" id="cs-toc-list"></ul>
      </nav>
    </div>
  `);
}
  function renderStrategy(cs) {
    const $el = $("#cs-strategy");
    if (!$el.length) return;

    let timelineHtml = cs.strategy.timeline.map((block, idx) => {
      let tagsHtml = block.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join("");
      return `
        <div class="timeline-block" id="comp-detail-${idx + 1}">
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <h3>${block.title}</h3>
            <p>${block.p}</p>
            <div class="tech-tag-container">${tagsHtml}</div>
          </div>
        </div>`;
    }).join("");

    $el.html(`
      <section class="cs-strategy-section container rr-container-1800">
        <h2 class="title" style="--color-white: var(--neutral-100) !important;">${cs.strategy.title}</h2>
        <p>${cs.strategy.description}</p>
        <div class="cs-timeline">${timelineHtml}</div>
      </section>`);
  }

  function renderWeeklyPlan(cs) {
    const $el = $("#cs-weekly-plan");
    if (!$el.length || !cs.weeklyPlan) return;

    let weeksHtml = cs.weeklyPlan.weeks.map(wk => {
      let tasksHtml = wk.tasks.map(task => {
        const icons    = { 
          completed: `<i class="fa-solid fa-circle-check"></i>`, 
          "in-progress": `<i class="fa-solid fa-circle-notch fa-spin"></i>` 
        };
        const icon     = icons[task.status] || `<i class="fa-regular fa-circle"></i>`;
        const statCls  = task.status || "pending";
        return `
          <li class="task-item ${statCls}">
            <span class="task-status-icon">${icon}</span>
            <span>${task.task}</span>
          </li>`;
      }).join("");

      return `
        <div class="week-card">
          <div class="week-header">
            <div class="week-num">${wk.week}</div>
            <div class="week-theme">${wk.theme}</div>
          </div>
          <ul class="task-list">${tasksHtml}</ul>
        </div>`;
    }).join("");

    $el.html(`
      <section class="weekly-checklist-container container rr-container-1800">
        <h2 class="title" style="--color-white: var(--neutral-100) !important;">${cs.weeklyPlan.title}</h2>
        <p class="text-muted">${cs.weeklyPlan.subtitle}</p>
        <div class="weeks-grid">${weeksHtml}</div>
      </section>`);
  }

  function renderResults(cs) {
    const $el = $("#cs-results");
    if (!$el.length) return;

    const COLOR_GREEN = "#38b000";
    const COLOR_RED   = "var(--color-red)";

    // Mapping for rendering beautiful comparative bar charts
    const chartMapping = {
      "Avg Quick Commerce Revenue/Brand": { baseLabel: "₹38 Lakhs", postLabel: "₹4.98 Crores", baseWidth: 10, postWidth: 100, color: COLOR_GREEN },
      "Avg Monthly ROAS": { baseLabel: "2.1x", postLabel: "6.4x", baseWidth: 32, postWidth: 100, color: COLOR_GREEN },
      "Repeat Purchase Rate": { baseLabel: "11%", postLabel: "31%", baseWidth: 35, postWidth: 100, color: COLOR_GREEN },
      "Inventory Out-of-Stock Days/Month": { baseLabel: "10 Days", postLabel: "1.5 Days", baseWidth: 100, postWidth: 15, color: COLOR_GREEN, baseColor: COLOR_RED },
      "Average Order Value": { baseLabel: "₹220", postLabel: "₹345", baseWidth: 63, postWidth: 100, color: COLOR_GREEN },
      "CAC (Customer Acquisition Cost)": { baseLabel: "₹380", postLabel: "₹185", baseWidth: 100, postWidth: 48, color: COLOR_GREEN, baseColor: COLOR_RED },
      "LTV: CAC Ratio": { baseLabel: "3.2:1", postLabel: "8.9:1", baseWidth: 36, postWidth: 100, color: COLOR_GREEN }
    };

    let chartCardsHtml = "";
    cs.results.table.rows.forEach(row => {
      const metricName = row[0];
      const baseline = row[1];
      const postCampaign = row[2];
      const improvement = row[3];

      const mapping = chartMapping[metricName];

      if (mapping) {
        chartCardsHtml += `
          <div class="grc-4">
            <div class="chart-card features-card">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="text-dark mb-0">${metricName}</h5>
                <span class="${improvement.includes("-") ? "badge-custom-red" : "badge-custom-green"}">
                  ${improvement}
                </span>
              </div>
              <div class="bar-chart-container">
                <!-- Baseline -->
                <div class="mb-2">
                  <div class="d-flex justify-content-between text-muted small mb-1">
                    <span>Baseline (Pre-Adomantra)</span>
                    <span class="font-semibold">${baseline}</span>
                  </div>
                  <div class="progress-track-base">
                    <div class="progress-bar-base" style="width: ${mapping.baseWidth}%;${mapping.baseColor ? ` background: ${mapping.baseColor};` : ''}"></div>
                  </div>
                </div>
                <!-- Post Adomantra -->
                <div>
                  <div class="d-flex justify-content-between text-dark small mb-1 font-semibold">
                    <span>Post-Adomantra (12-Months)</span>
                    <span style="color: ${mapping.color};">${postCampaign}</span>
                  </div>
                  <div class="progress-track-post">
                    <div class="progress-bar-post" style="background: ${mapping.color}; width: ${mapping.postWidth}%;"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>`;
      } else {
        // Render text indicators for qualitative/rank metrics
        chartCardsHtml += `
          <div class="grc-4">
            <div class="chart-card features-card centered">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="text-dark mb-0">${metricName}</h5>
                <span class="badge ${improvement.includes("-") ? "bg-danger" : "bg-success"} text-white">${improvement}</span>
              </div>
              <div class="row text-center mt-2">
                <div class="col-6 border-end">
                  <span class="text-muted small d-block">Baseline</span>
                  <span class="text-secondary value-large">${baseline}</span>
                </div>
                <div class="col-6">
                  <span class="text-dark small d-block font-semibold">Post-Adomantra</span>
                  <span class="text-success value-large">${postCampaign}</span>
                </div>
              </div>
            </div>
          </div>`;
      }
    });

    $el.html(`
      <section class="cs-results-section container rr-container-1800">
        <h2 class="title" style="--color-white: var(--neutral-100) !important;">${cs.results.title}</h2>
        <p class="mb-4">${cs.results.description}</p>
        
        <div class="grc">
          ${chartCardsHtml}
        </div>

        <blockquote class="cs-executive-quote mt-4">
          <p class="quote-body">${cs.results.quote.body}</p>
          <footer class="quote-footer">
            <cite class="author-name">${cs.results.quote.author}</cite>
            <span class="author-title">${cs.results.quote.authorTitle}</span>
          </footer>
        </blockquote>
      </section>`);
  }

  function renderTakeaways(cs) {
    const $el = $("#cs-takeaways");
    if (!$el.length) return;

    let itemsHtml = cs.summaryFooter.items
      .map(item => `<li>${item}</li>`).join("");

    $el.html(`
      <footer class="cs-summary-footer container rr-container-1800">
        <h3>${cs.summaryFooter.title}</h3>
        <ul class="takeaways-list">${itemsHtml}</ul>
      </footer>`);
  }

  function initCirclesGSAP() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      setTimeout(initCirclesGSAP, 300);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    $(".progress-ring__circle.bar").each(function () {
      const circle       = this;
      const targetVal    = parseFloat($(circle).attr("data-target")) || 0;
      const r            = parseFloat($(circle).attr("r"));
      const circumference = 2 * Math.PI * r;

      circle.style.strokeDasharray  = circumference;
      circle.style.strokeDashoffset = circumference;

      gsap.to(circle, {
        strokeDashoffset: circumference - (targetVal / 100) * circumference,
        duration: 1.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: circle,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });
    });
  }

  function initGSAPAnimations() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      setTimeout(initGSAPAnimations, 300);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Animate the component cards on scroll
    gsap.from(".component-card", {
      opacity: 0,
      y: 50,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".cs-profile-section",
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });

    // Animate the weekly checklist cards on scroll
    gsap.from(".week-card", {
      opacity: 0,
      y: 40,
      scale: 0.95,
      duration: 0.8,
      stagger: 0.15,
      ease: "back.out(1.2)",
      scrollTrigger: {
        trigger: ".weeks-grid",
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });

    // Animate audit row cards on scroll
    gsap.from(".audit-pricing-card", {
      opacity: 0,
      y: 40,
      scale: 0.95,
      duration: 0.8,
      stagger: 0.15,
      ease: "back.out(1.2)",
      scrollTrigger: {
        trigger: "#cs-audit",
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });

    // Animate the approach circle cards on scroll
    gsap.from(".approach-circle-block", {
      opacity: 0,
      y: 40,
      scale: 0.95,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".circles-grid",
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });

    // Wind doodle animations triggered by viewport of #cs-audit
    if ($("#cs-audit").length) {
      gsap.to(".audit-wind-doodles .wind-path-1", {
        strokeDashoffset: -1000,
        duration: 20,
        repeat: -1,
        ease: "none",
        scrollTrigger: {
          trigger: "#cs-audit",
          start: "top bottom",
          end: "bottom top",
          toggleActions: "play pause resume pause"
        }
      });
      gsap.to(".audit-wind-doodles .wind-path-2", {
        strokeDashoffset: -800,
        duration: 15,
        repeat: -1,
        ease: "none",
        scrollTrigger: {
          trigger: "#cs-audit",
          start: "top bottom",
          end: "bottom top",
          toggleActions: "play pause resume pause"
        }
      });
      gsap.to(".audit-wind-doodles .wind-path-3", {
        strokeDashoffset: -1200,
        duration: 25,
        repeat: -1,
        ease: "none",
        scrollTrigger: {
          trigger: "#cs-audit",
          start: "top bottom",
          end: "bottom top",
          toggleActions: "play pause resume pause"
        }
      });
    }
  }

  $(document).ready(() => init());

})(jQuery);