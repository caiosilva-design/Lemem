(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     NAV: shrink on scroll + mobile menu + scroll-spy
  --------------------------------------------------------- */
  const nav = document.getElementById("site-nav");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.getElementById("nav-links");
  const navScrim = document.getElementById("nav-scrim");
  const backToTop = document.querySelector(".back-to-top");

  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle("scrolled", y > 40);
    if (backToTop) backToTop.classList.toggle("visible", y > 700);
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    navLinks.classList.remove("open");
    navScrim.classList.remove("active");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  function openMenu() {
    navLinks.classList.add("open");
    navScrim.classList.add("active");
    navToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.contains("open");
      isOpen ? closeMenu() : openMenu();
    });
  }
  navScrim.addEventListener("click", closeMenu);
  navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  // scroll-spy
  const sections = ["historia", "titulos", "gestao", "produtos", "patrocinadores"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const navAnchors = document.querySelectorAll("#nav-links a[data-nav]");

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navAnchors.forEach((a) => a.classList.toggle("active", a.dataset.nav === id));
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------------------------------------------------------
     REVEAL ON SCROLL
  --------------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  /* ---------------------------------------------------------
     STATS COUNT-UP
  --------------------------------------------------------- */
  const statNums = document.querySelectorAll(".stat-num[data-count]");
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const isYear = el.dataset.format === "year";
    if (reduceMotion) {
      el.textContent = target;
      return;
    }
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = Math.round(target * eased);
      el.textContent = value;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }
  if ("IntersectionObserver" in window && statNums.length) {
    const statObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    statNums.forEach((el) => statObserver.observe(el));
  }

  /* ---------------------------------------------------------
     TIMELINE RAIL FILL (história)
  --------------------------------------------------------- */
  const timelineFill = document.getElementById("timeline-fill");
  const historiaText = document.querySelector(".historia-text");
  if (timelineFill && historiaText) {
    const updateRail = () => {
      const rect = historiaText.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height;
      const visibleStart = vh * 0.75 - rect.top;
      const pct = Math.max(0, Math.min(1, visibleStart / total));
      timelineFill.style.height = (pct * 100) + "%";
    };
    document.addEventListener("scroll", updateRail, { passive: true });
    window.addEventListener("resize", updateRail);
    updateRail();
  }

  /* ---------------------------------------------------------
     LIGHTBOX (galerias + momentos)
  --------------------------------------------------------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  let currentGroup = [];
  let currentIndex = 0;

  function collectGroup(groupName) {
    const items = Array.from(document.querySelectorAll(`[data-lightbox-group="${groupName}"] img`));
    return items;
  }

  function openLightbox(groupName, img) {
    currentGroup = collectGroup(groupName);
    currentIndex = currentGroup.indexOf(img);
    if (currentIndex < 0) currentIndex = 0;
    showLightboxImage();
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function showLightboxImage() {
    const img = currentGroup[currentIndex];
    if (!img) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || "";
  }
  function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  function stepLightbox(dir) {
    if (!currentGroup.length) return;
    currentIndex = (currentIndex + dir + currentGroup.length) % currentGroup.length;
    showLightboxImage();
  }

  document.querySelectorAll("[data-lightbox-group]").forEach((wrap) => {
    const groupName = wrap.getAttribute("data-lightbox-group");
    const img = wrap.querySelector("img");
    if (!img) return;
    wrap.addEventListener("click", (e) => {
      // avoid triggering when clicking the expand button twice (bubbles anyway)
      openLightbox(groupName, img);
    });
  });

  lightbox.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", closeLightbox));
  lightbox.querySelector("[data-prev]").addEventListener("click", (e) => { e.stopPropagation(); stepLightbox(-1); });
  lightbox.querySelector("[data-next]").addEventListener("click", (e) => { e.stopPropagation(); stepLightbox(1); });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") stepLightbox(1);
    if (e.key === "ArrowLeft") stepLightbox(-1);
  });

  /* ---------------------------------------------------------
     VIDEO MODAL (play buttons)
  --------------------------------------------------------- */
  const videoModal = document.getElementById("video-modal");
  const videoPlayer = document.getElementById("video-modal-player");

  function openVideoModal(src) {
    videoPlayer.src = src;
    videoModal.classList.add("active");
    videoModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    videoPlayer.play().catch(() => {});
  }
  function closeVideoModal() {
    videoModal.classList.remove("active");
    videoModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    videoPlayer.pause();
    videoPlayer.removeAttribute("src");
    videoPlayer.load();
  }
  document.querySelectorAll("[data-video-src]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openVideoModal(btn.getAttribute("data-video-src"));
    });
  });
  videoModal.querySelectorAll("[data-video-close]").forEach((el) => el.addEventListener("click", closeVideoModal));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && videoModal.classList.contains("active")) closeVideoModal();
  });

  /* ---------------------------------------------------------
     Autoplay muted preview videos on hover (desktop) — nice touch,
     falls back gracefully on touch devices.
  --------------------------------------------------------- */
  document.querySelectorAll(".momento-item video, .quebradas-video-wrap video").forEach((video) => {
    const wrap = video.closest(".momento-item, .quebradas-video-wrap");
    if (!wrap) return;
    wrap.addEventListener("mouseenter", () => video.play().catch(() => {}));
    wrap.addEventListener("mouseleave", () => { video.pause(); video.currentTime = 0; });
  });

  /* ---------------------------------------------------------
     Sponsor ticker: pause is handled purely in CSS via :hover.
     Nothing else required here.
  --------------------------------------------------------- */

})();
