/* =========================================================
   Demand Tankservice – Homepage interactions · v2
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
  // Only top-level links that point to a section on the current page
  var navLinks = Array.prototype.slice.call(doc.querySelectorAll('.main-nav > ul > li > a[href^="#"]'));
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
    if (reduceMotion) { el.textContent = fmt(target); return; }
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

  /* ---------- FAQ accordion (smooth, single-open) ---------- */
  var faqItems = Array.prototype.slice.call(doc.querySelectorAll(".faq-item"));
  if (faqItems.length) {
    faqItems.forEach(function (item) {
      var summary = item.querySelector("summary");
      var panel = item.querySelector(".faq-a");
      if (!summary || !panel) return;

      summary.addEventListener("click", function (e) {
        e.preventDefault();
        var isOpen = item.hasAttribute("open");

        if (isOpen) {
          collapse(item, panel);
        } else {
          // close others
          faqItems.forEach(function (other) {
            if (other !== item && other.hasAttribute("open")) collapse(other, other.querySelector(".faq-a"));
          });
          expand(item, panel);
        }
      });
    });

    function expand(item, panel) {
      item.setAttribute("open", "");
      if (reduceMotion) return;
      var h = panel.scrollHeight;
      panel.style.height = "0px";
      panel.style.opacity = "0";
      requestAnimationFrame(function () {
        panel.style.transition = "height 0.34s var(--ease), opacity 0.34s var(--ease)";
        panel.style.height = h + "px";
        panel.style.opacity = "1";
      });
      panel.addEventListener("transitionend", function te() {
        panel.style.height = ""; panel.style.transition = ""; panel.style.opacity = "";
        panel.removeEventListener("transitionend", te);
      });
    }
    function collapse(item, panel) {
      if (reduceMotion || !panel) { item.removeAttribute("open"); return; }
      var h = panel.scrollHeight;
      panel.style.height = h + "px"; panel.style.opacity = "1";
      panel.style.transition = "height 0.3s var(--ease), opacity 0.3s var(--ease)";
      requestAnimationFrame(function () { panel.style.height = "0px"; panel.style.opacity = "0"; });
      panel.addEventListener("transitionend", function te() {
        item.removeAttribute("open");
        panel.style.height = ""; panel.style.transition = ""; panel.style.opacity = "";
        panel.removeEventListener("transitionend", te);
      });
    }
  }

  /* ---------- Anfrage-Funnel (mehrstufiges Formular) ----------
     - Auswahlkarten gehen nach dem Klick automatisch zum nächsten Schritt
     - ?leistung=<slug> (von den Leistungsseiten) wählt Schritt 1 vor
     - Versand: Endpoint in  <form id="funnel-form" data-endpoint="…">  eintragen
       (z. B. Formspree). Ohne Endpoint wird nur eine Vorschau-Bestätigung gezeigt.
  --------------------------------------------------------- */
  var contactForm = doc.getElementById("kontakt-form");
  if (contactForm) {
    if (window.URLSearchParams && contactForm.elements.leistung) {
      var requestedService = new URLSearchParams(window.location.search).get("leistung");
      if (requestedService) contactForm.elements.leistung.value = requestedService;
    }
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!contactForm.reportValidity()) return;
      var fields = contactForm.elements;
      if (fields.website && fields.website.value.trim()) return;
      var values = {
        name: fields.name.value.trim(),
        email: fields.email.value.trim(),
        telefon: fields.telefon.value.trim(),
        leistung: fields.leistung.value.trim(),
        ort: fields.ort.value.trim(),
        nachricht: fields.nachricht.value.trim()
      };
      var body = [
        "Name: " + values.name,
        "E-Mail: " + values.email,
        "Telefon: " + (values.telefon || "Nicht angegeben"),
        "Gewünschte Leistung: " + (values.leistung || "Nicht angegeben"),
        "Ort / PLZ des Tankstandorts: " + (values.ort || "Nicht angegeben"),
        "",
        "Ihr Vorhaben:",
        values.nachricht
      ].join("\n");
      var status = doc.getElementById("kontakt-form-status");
      status.textContent = "Ihr E-Mail-Programm wird geöffnet. Bitte senden Sie die vorbereitete Nachricht dort ab.";
      status.className = "form-status success";
      status.hidden = false;
      window.location.href = "mailto:info@demand-tankservice.de?subject=" + encodeURIComponent("Kontaktanfrage über die Website") + "&body=" + encodeURIComponent(body);
    });
  }

  var funnel = doc.getElementById("funnel-form");
  if (funnel) {
    var steps = Array.prototype.slice.call(funnel.querySelectorAll(".funnel-step"));
    var total = steps.length;
    var current = 0;
    var barEl = doc.getElementById("funnel-bar");
    var fillEl = doc.getElementById("funnel-bar-fill");
    var labelEl = doc.getElementById("funnel-label");
    var pctEl = doc.getElementById("funnel-pct");
    var errEl = doc.getElementById("funnel-error");
    var backBtn = doc.getElementById("funnel-back");
    var nextBtn = doc.getElementById("funnel-next");
    var successEl = doc.getElementById("funnel-success");
    var autoTimer = null;
    var sending = false;
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function showErr(msg) { errEl.textContent = msg; errEl.hidden = false; }
    function clearErr() { errEl.hidden = true; errEl.textContent = ""; }
    function checkedIn(step) { return step.querySelector('input[type="radio"]:checked'); }

    function render(focus) {
      steps.forEach(function (st, i) { st.hidden = i !== current; });
      var pct = Math.round((current / total) * 100);
      fillEl.style.width = pct + "%";
      barEl.setAttribute("aria-valuenow", pct);
      pctEl.innerHTML = pct + "&nbsp;%";
      labelEl.textContent = "Schritt " + (current + 1) + " von " + total;
      backBtn.hidden = current === 0;
      var last = current === total - 1;
      nextBtn.querySelector("span").textContent = last ? "Anfrage absenden" : "Weiter";
      clearErr();
      if (focus) {
        var q = steps[current].querySelector(".funnel-q");
        if (q) q.focus({ preventScroll: true });
        var top = funnel.getBoundingClientRect().top;
        if (top < 0 || top > window.innerHeight * 0.6) scrollToTarget(funnel.closest(".funnel-card") || funnel);
      }
    }

    function validateStep(i) {
      var st = steps[i];
      if (st.querySelector('input[type="radio"]')) {
        if (!checkedIn(st)) { showErr("Bitte wählen Sie eine Option aus."); return false; }
        return true;
      }
      var bad = null;
      Array.prototype.forEach.call(st.querySelectorAll("[required]"), function (f) {
        var ok;
        if (f.type === "checkbox") ok = f.checked;
        else if (f.type === "email") ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim());
        else if (f.type === "tel") ok = f.value.replace(/\D/g, "").length >= 6;
        else ok = f.value.trim().length >= 2;
        if (ok) f.removeAttribute("aria-invalid");
        else { f.setAttribute("aria-invalid", "true"); if (!bad) bad = f; }
      });
      if (bad) {
        showErr(bad.type === "checkbox" ? "Bitte stimmen Sie der Datenverarbeitung zu." : "Bitte füllen Sie die markierten Felder korrekt aus.");
        bad.focus();
        return false;
      }
      return true;
    }

    function goNext() {
      clearTimeout(autoTimer);
      if (!validateStep(current)) return;
      if (current < total - 1) { current++; render(true); }
      else submitFunnel();
    }
    function goBack() {
      clearTimeout(autoTimer);
      if (current > 0) { current--; render(true); }
    }

    // Auswahlkarten: automatisch weiter
    funnel.addEventListener("change", function (e) {
      if (e.target.type !== "radio") return;
      clearErr();
      clearTimeout(autoTimer);
      autoTimer = setTimeout(goNext, reduced ? 0 : 350);
    });
    // Eingabefelder: Markierung entfernen sobald gültig
    funnel.addEventListener("input", function (e) {
      if (e.target.getAttribute("aria-invalid")) e.target.removeAttribute("aria-invalid");
    });
    backBtn.addEventListener("click", goBack);
    funnel.addEventListener("submit", function (e) { e.preventDefault(); goNext(); });

    // Vorauswahl aus ?leistung=… → Schritt 1 gewählt, direkt weiter zu Schritt 2
    if (window.URLSearchParams) {
      var wanted = new URLSearchParams(window.location.search).get("leistung");
      if (wanted) {
        var pre = funnel.querySelector('[data-key="leistung"] input[value="' + wanted.replace(/[^a-z0-9-]/gi, "") + '"]');
        if (pre) { pre.checked = true; current = 1; }
      }
    }
    render(false);

    function collect() {
      var data = {};
      steps.forEach(function (st) {
        var key = st.getAttribute("data-key");
        var r = checkedIn(st);
        if (r) { data[key] = r.value; data[key + "_text"] = r.getAttribute("data-text"); }
      });
      ["ort", "name", "email", "telefon", "nachricht", "website"].forEach(function (n) {
        var f = funnel.elements[n]; if (f) data[n] = f.value.trim();
      });
      return data;
    }

    function showSuccess(data, isPreview) {
      var title = doc.getElementById("funnel-success-title");
      var first = (data.name || "").split(" ")[0];
      if (first) title.textContent = "Vielen Dank, " + first + "!";
      var rows = [
        ["Leistung", data.leistung_text], ["Tankart", data.tankart_text], ["Größe", data.groesse_text],
        ["Standort", data.standort_text], ["Zeitraum", data.zeitraum_text], ["PLZ / Ort", data.ort]
      ];
      var ul = doc.getElementById("funnel-summary");
      ul.innerHTML = "";
      rows.forEach(function (r) {
        if (!r[1]) return;
        var li = doc.createElement("li");
        var a = doc.createElement("span"); a.textContent = r[0];
        var b = doc.createElement("span"); b.textContent = r[1];
        li.appendChild(a); li.appendChild(b); ul.appendChild(li);
      });
      doc.getElementById("funnel-preview-note").hidden = !isPreview;
      funnel.classList.add("is-done");
      successEl.hidden = false;
      successEl.focus({ preventScroll: true });
      scrollToTarget(funnel.closest(".funnel-card") || funnel);
    }

    function submitFunnel() {
      if (sending) return;
      var data = collect();
      if (data.website) return; // Honeypot: Bot
      var endpoint = funnel.getAttribute("data-endpoint");
      if (!endpoint) { showSuccess(data, true); return; }
      sending = true;
      nextBtn.disabled = true;
      nextBtn.querySelector("span").textContent = "Wird gesendet …";
      data._subject = "Neue Anfrage über die Website – " + (data.leistung_text || "Demand Tankservice");
      delete data.website;
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      }).then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        showSuccess(data, false);
      }).catch(function () {
        showErr("Die Anfrage konnte leider nicht gesendet werden. Bitte versuchen Sie es erneut oder rufen Sie uns an: +49 1517 0158805.");
      }).then(function () {
        sending = false;
        nextBtn.disabled = false;
        nextBtn.querySelector("span").textContent = "Anfrage absenden";
      });
    }
  }
})();
