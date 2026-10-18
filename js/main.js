/* =========================================================
   Paul Demand Tankservice – Homepage interactions · v2
   Vanilla UI logic + GSAP/ScrollTrigger/Lenis (progressive).
   Everything degrades gracefully: without the libraries (or
   with reduced motion) all content stays fully visible.
   ========================================================= */
(function () {
  "use strict";

  var doc = document;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGSAP = typeof window.gsap !== "undefined";
  var hasST = typeof window.ScrollTrigger !== "undefined";

  /* ---------- Footer year ---------- */
  var yearEl = doc.getElementById("jahr");
  if (yearEl) { yearEl.textContent = String(new Date().getFullYear()); }

  /* ---------- Mobile navigation ---------- */
  var toggle = doc.getElementById("nav-toggle");
  var mobileNav = doc.getElementById("mobile-nav");

  function closeMenu() {
    if (!mobileNav || !toggle) return;
    mobileNav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Menü öffnen");
    mobileNav.hidden = true;
  }
  function openMenu() {
    if (!mobileNav || !toggle) return;
    mobileNav.hidden = false;
    requestAnimationFrame(function () { mobileNav.classList.add("open"); });
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Menü schließen");
  }
  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      (toggle.getAttribute("aria-expanded") === "true") ? closeMenu() : openMenu();
    });
    mobileNav.querySelectorAll("a").forEach(function (l) { l.addEventListener("click", closeMenu); });
    doc.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
    window.addEventListener("resize", function () { if (window.innerWidth > 860) closeMenu(); });
  }

  /* ---------- Sticky header shadow ---------- */
  var header = doc.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Active nav link ---------- */
  var navLinks = Array.prototype.slice.call(doc.querySelectorAll(".main-nav a"));
  var linkById = {};
  navLinks.forEach(function (link) {
    var id = (link.getAttribute("href") || "").replace("#", "");
    if (id) linkById[id] = link;
  });
  var sections = Object.keys(linkById).map(function (id) { return doc.getElementById(id); }).filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove("is-active"); });
          if (linkById[entry.target.id]) linkById[entry.target.id].classList.add("is-active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Lenis smooth scrolling ---------- */
  var lenis = null;
  if (!reduceMotion && typeof window.Lenis !== "undefined") {
    try {
      lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
      doc.documentElement.classList.add("lenis");
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
    } catch (e) { lenis = null; }
  }

  /* ---------- Smooth anchor navigation ---------- */
  function scrollToTarget(target) {
    if (lenis) { lenis.scrollTo(target, { offset: -70 }); }
    else { target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); }
  }
  doc.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      var target = doc.getElementById(id.slice(1));
      if (!target) return;
      e.preventDefault();
      scrollToTarget(target);
    });
  });

  /* ---------- Count-up helper ---------- */
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var plain = el.getAttribute("data-plain") === "1"; // no thousands grouping (e.g. years)
    var start = null, dur = 1400;
    function fmt(n) { return plain ? String(n) : n.toLocaleString("de-DE"); }
    function tick(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = fmt(target);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- GSAP animations ---------- */
  var canAnimate = hasGSAP && hasST && !reduceMotion;

  if (canAnimate) {
    gsap.registerPlugin(ScrollTrigger);
    doc.body.classList.add("anim-ready");

    // keep ScrollTrigger in sync with Lenis
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    // Hero entrance
    var heroItems = gsap.utils.toArray("[data-hero]").sort(function (a, b) {
      return (+a.getAttribute("data-hero")) - (+b.getAttribute("data-hero"));
    });
    gsap.set(heroItems, { opacity: 0, y: 24 });
    gsap.to(heroItems, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, delay: 0.15 });

    // Reveal single elements
    gsap.utils.toArray("[data-reveal]").forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%" }
      });
    });

    // Reveal grouped children with stagger
    gsap.utils.toArray("[data-reveal-group]").forEach(function (group) {
      var items = group.querySelectorAll("[data-reveal-item]");
      gsap.fromTo(items, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.12,
        scrollTrigger: { trigger: group, start: "top 82%" }
      });
    });

    // Parallax layers
    gsap.utils.toArray("[data-parallax]").forEach(function (el) {
      var depth = parseFloat(el.getAttribute("data-parallax")) || 0.1;
      gsap.to(el, {
        yPercent: depth * -100,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 }
      });
    });

    // Count-ups triggered on view
    gsap.utils.toArray(".count").forEach(function (el) {
      ScrollTrigger.create({
        trigger: el, start: "top 92%", once: true,
        onEnter: function () { animateCount(el); }
      });
    });

    // Refresh after fonts settle
    window.addEventListener("load", function () { ScrollTrigger.refresh(); });

  } else {
    // No-animation fallback: ensure everything visible, still run counters once in view
    if ("IntersectionObserver" in window) {
      var countObs = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { animateCount(entry.target); obs.unobserve(entry.target); }
        });
      }, { threshold: 0.4 });
      doc.querySelectorAll(".count").forEach(function (el) { countObs.observe(el); });
    } else {
      doc.querySelectorAll(".count").forEach(function (el) {
        var plain = el.getAttribute("data-plain") === "1";
        var t = parseInt(el.getAttribute("data-count"), 10) || 0;
        el.textContent = plain ? String(t) : t.toLocaleString("de-DE");
      });
    }
  }

  /* ---------- Contact form (frontend only) ----------
     Staging: validates and shows a confirmation, but does
     NOT send anything yet — a mail/form backend must be
     connected before launch (see README).
  --------------------------------------------------------- */
  var form = doc.getElementById("anfrage-form");
  var status = doc.getElementById("form-status");

  function showStatus(msg, type) {
    if (!status) return;
    status.textContent = msg;
    status.className = "form-status " + type;
    status.hidden = false;
  }
  function fieldValid(field) {
    if (field.type === "checkbox") return field.checked;
    if (!field.value.trim()) return false;
    if (field.type === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
    return true;
  }

  if (form) {
    var requiredFields = Array.prototype.slice.call(form.querySelectorAll("[required]"));
    requiredFields.forEach(function (field) {
      field.addEventListener("input", function () {
        if (fieldValid(field)) field.removeAttribute("aria-invalid");
      });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstInvalid = null;
      requiredFields.forEach(function (field) {
        if (!fieldValid(field)) {
          field.setAttribute("aria-invalid", "true");
          if (!firstInvalid) firstInvalid = field;
        } else { field.removeAttribute("aria-invalid"); }
      });
      if (firstInvalid) {
        showStatus("Bitte füllen Sie alle Pflichtfelder korrekt aus.", "error");
        firstInvalid.focus();
        return;
      }
      showStatus(
        "Vielen Dank für Ihre Anfrage! Wir melden uns zeitnah bei Ihnen zurück. (Hinweis: Dies ist eine Vorschau – der Formularversand wird vor dem Launch eingerichtet.)",
        "success"
      );
      form.reset();
      scrollToTarget(status);
    });
  }
})();
