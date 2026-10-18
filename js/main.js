/* =========================================================
   Paul Demand Tankservice – Homepage interactions
   ========================================================= */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var toggle = document.getElementById("nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");

  /* ---------- Current year in footer ---------- */
  var yearEl = document.getElementById("jahr");
  if (yearEl) { yearEl.textContent = String(new Date().getFullYear()); }

  /* ---------- Mobile navigation toggle ---------- */
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
    // allow the element to be unhidden before applying the open class
    requestAnimationFrame(function () { mobileNav.classList.add("open"); });
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Menü schließen");
  }

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      if (expanded) { closeMenu(); } else { openMenu(); }
    });

    // Close after tapping a link
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { closeMenu(); }
    });

    // Reset menu when resizing up to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) { closeMenu(); }
    });
  }

  /* ---------- Sticky header shadow on scroll ---------- */
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 8) { header.classList.add("scrolled"); }
    else { header.classList.remove("scrolled"); }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Active nav link via IntersectionObserver ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".main-nav a"));
  var linkById = {};
  navLinks.forEach(function (link) {
    var id = (link.getAttribute("href") || "").replace("#", "");
    if (id) { linkById[id] = link; }
  });

  var sections = Object.keys(linkById)
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove("is-active"); });
          var active = linkById[entry.target.id];
          if (active) { active.classList.add("is-active"); }
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Scroll reveal ---------- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealTargets = document.querySelectorAll(
    ".section-head, .hero-copy, .hero-media, .card, .benefit, .step, .about-media, .about-copy, .area-copy, .area-visual, .contact-intro, .contact-card"
  );

  if (!reduceMotion && "IntersectionObserver" in window) {
    revealTargets.forEach(function (el, i) {
      el.classList.add("reveal");
      el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + "ms";
    });
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Contact form (frontend validation only) ----------
     NOTE: This is a staging preview. No data is sent anywhere yet.
     A backend / mail handler still needs to be connected before launch.
  ------------------------------------------------------------------ */
  var form = document.getElementById("anfrage-form");
  var status = document.getElementById("form-status");

  function showStatus(message, type) {
    if (!status) return;
    status.textContent = message;
    status.className = "form-status " + type;
    status.hidden = false;
  }

  function fieldValid(field) {
    if (field.type === "checkbox") { return field.checked; }
    if (!field.value.trim()) { return false; }
    if (field.type === "email") { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim()); }
    return true;
  }

  if (form) {
    var requiredFields = Array.prototype.slice.call(form.querySelectorAll("[required]"));

    requiredFields.forEach(function (field) {
      field.addEventListener("input", function () {
        if (fieldValid(field)) { field.removeAttribute("aria-invalid"); }
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstInvalid = null;

      requiredFields.forEach(function (field) {
        if (!fieldValid(field)) {
          field.setAttribute("aria-invalid", "true");
          if (!firstInvalid) { firstInvalid = field; }
        } else {
          field.removeAttribute("aria-invalid");
        }
      });

      if (firstInvalid) {
        showStatus("Bitte füllen Sie alle Pflichtfelder korrekt aus.", "error");
        firstInvalid.focus();
        return;
      }

      // Staging: simulate a successful submission (no backend connected yet)
      showStatus(
        "Vielen Dank für Ihre Anfrage! Wir melden uns zeitnah bei Ihnen zurück. (Hinweis: Dies ist eine Vorschau – der Formularversand wird vor dem Launch eingerichtet.)",
        "success"
      );
      form.reset();
      status.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    });
  }
})();
