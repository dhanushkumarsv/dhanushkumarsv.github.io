/* ============================================================
   Portfolio interactions: themes, hidden identities, nav,
   animations, parallax, tilt, scroll effects.
   ============================================================ */

(function () {
  "use strict";

  const root = document.documentElement;
  const THEMES = ["pro", "noir", "spidey", "batman", "cap", "vinland", "luffy", "naruto"];
  const CHARACTER_MSG = {
    spidey: "🕷️ Spidey mode — click for webs, or enter the “Spider-Verse” (bottom-left)!",
    batman: "🦇 Welcome to Gotham — try “Lights out” (bottom-left).",
    cap: "🛡️ Cap mode — click for shields, or brace for the “Shield slam”!",
    vinland: "🌾 Vinland — click for a breeze, or let the “Harvest wind” blow (bottom-left).",
    luffy: "🏴‍☠️ Luffy mode — hit “Gravity OFF” (bottom-left) and set sail!",
    naruto: "🍥 Naruto mode — click for chakra, or dare the “Genjutsu” (bottom-left)…"
  };
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------------- Toast ---------------- */
  const toastEl = document.getElementById("toast");
  let toastTimer = null;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 3600);
  }

  /* ---------------- Theme switching ----------------
     The site always opens in warm Professional mode. The navbar
     offers light/dark professional; the six character identities
     live in the vault at the bottom of the page. */
  const themeBtns = document.querySelectorAll("[data-set-theme]");
  let currentTheme = null;

  function applyTheme(theme) {
    if (!THEMES.includes(theme)) theme = "pro";
    root.setAttribute("data-theme", theme);
    themeBtns.forEach(b => b.classList.toggle("active", b.dataset.setTheme === theme));
    if (currentTheme && theme !== currentTheme && CHARACTER_MSG[theme]) toast(CHARACTER_MSG[theme]);
    currentTheme = theme;
    document.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
  }

  themeBtns.forEach(btn =>
    btn.addEventListener("click", () => applyTheme(btn.dataset.setTheme))
  );

  /* ---------------- Identity vault ---------------- */
  const vault = document.getElementById("vault");
  const vaultToggle = document.getElementById("vaultToggle");

  function setVault(open, scroll) {
    vault.classList.toggle("open", open);
    vaultToggle.setAttribute("aria-expanded", String(open));
    vaultToggle.querySelector(".vault-hint").textContent = open ? "— choose your identity" : "— open the vault";
    if (open && scroll) {
      setTimeout(() => vault.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" }), 200);
    }
  }
  vaultToggle.addEventListener("click", () => setVault(!vault.classList.contains("open"), false));

  // Shared with the chatbot
  window.DK = { applyTheme, toast, openVault: () => setVault(true, true) };

  /* ================================================================
     THEME SPECIAL SKILLS
     ================================================================ */
  const skillBtn = document.getElementById("skillBtn");
  const lightsOut = document.getElementById("lightsOut");
  const windWash = document.getElementById("windWash");
  const shieldFly = document.getElementById("shieldFly");
  const hudFrame = document.getElementById("hudFrame");
  const starfield = document.getElementById("starfield");
  const svDots = document.getElementById("spiderverseDots");
  const genjutsu = document.getElementById("genjutsu");
  const kaiFlash = document.getElementById("kaiFlash");

  let lightsActive = false, blueprintActive = false, starActive = false;
  let voyageActive = false, verseActive = false, genjutsuActive = false;
  let slamming = false, windActive = false;
  let voyageTimer = null, windTimer = null, shootTimer = null, popTimer = null, featherTimer = null;

  /* Shared pointer tracking for the Batman spotlight */
  function pointerFX(e) {
    if (!lightsActive) return;
    const p = e.touches ? e.touches[0] : e;
    lightsOut.style.setProperty("--mx", p.clientX + "px");
    lightsOut.style.setProperty("--my", p.clientY + "px");
  }
  document.addEventListener("mousemove", pointerFX, { passive: true });
  document.addEventListener("touchmove", pointerFX, { passive: true });

  function guardMotion() {
    if (reduceMotion) { toast("Motion effects are limited by your system settings 🍃"); return true; }
    return false;
  }

  /* --- Batman: lights out, a spotlight follows the pointer --- */
  function setLights(active) {
    lightsActive = active;
    lightsOut.classList.toggle("on", active);
    refreshSkillBtn();
  }

  /* --- Pro: Blueprint mode — the whole site becomes a technical drawing --- */
  function setBlueprint(active) {
    blueprintActive = active;
    document.body.classList.toggle("blueprint", active);
    document.body.classList.toggle("hud", active);
    hudFrame.classList.toggle("on", active);
    refreshSkillBtn();
  }

  /* --- Noir: starlight — night sky with shooting stars --- */
  function spawnShootingStar() {
    const s = document.createElement("div");
    s.className = "shooting-star";
    s.style.left = (Math.random() * 40) + "%";
    s.style.top = (Math.random() * 45) + "%";
    starfield.appendChild(s);
    setTimeout(() => s.remove(), 1300);
  }
  function setStars(active) {
    starActive = active;
    starfield.classList.toggle("on", active);
    clearInterval(shootTimer);
    starfield.innerHTML = "";
    if (active) {
      for (let i = 0; i < 70; i++) {
        const s = document.createElement("div");
        s.className = "star";
        const size = (1 + Math.random() * 1.6).toFixed(1);
        s.style.width = size + "px";
        s.style.height = size + "px";
        s.style.left = (Math.random() * 100) + "%";
        s.style.top = (Math.random() * 100) + "%";
        s.style.setProperty("--tw", (1.6 + Math.random() * 3).toFixed(1) + "s");
        s.style.animationDelay = (Math.random() * 3).toFixed(1) + "s";
        starfield.appendChild(s);
      }
      if (!reduceMotion) shootTimer = setInterval(spawnShootingStar, 1500);
    }
    refreshSkillBtn();
  }

  /* --- Luffy: gravity off → the ocean rises and we sail the page --- */
  function setVoyage(active) {
    voyageActive = active;
    document.body.classList.toggle("voyage", active);
    clearInterval(voyageTimer);
    if (active) {
      const stops = Array.from(document.querySelectorAll("section[id]:not(#hero), footer[id]"));
      let i = 0;
      setTimeout(() => {
        if (!voyageActive) return;
        voyageTimer = setInterval(() => {
          if (i >= stops.length) { clearInterval(voyageTimer); return; }
          stops[i++].scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        }, 3200);
      }, 900);
    }
    refreshSkillBtn();
  }

  /* --- Spidey: Spider-Verse mode — halftone, glitch, comic bursts --- */
  const POP_WORDS = ["THWIP!", "BAM!", "WHAM!", "POW!", "ZAP!"];
  const POP_COLORS = ["#e11d25", "#2456c9", "#e6a817"];
  function spawnComicPop() {
    const pop = document.createElement("div");
    pop.className = "comic-pop";
    pop.textContent = POP_WORDS[Math.floor(Math.random() * POP_WORDS.length)];
    pop.style.background = POP_COLORS[Math.floor(Math.random() * POP_COLORS.length)];
    pop.style.left = (8 + Math.random() * 72) + "vw";
    pop.style.top = (14 + Math.random() * 62) + "vh";
    pop.style.setProperty("--rot", (Math.random() * 28 - 14).toFixed(0) + "deg");
    document.body.appendChild(pop);
    setTimeout(() => pop.remove(), 1500);
  }
  function setVerse(active) {
    verseActive = active;
    document.body.classList.toggle("spiderverse", active);
    svDots.classList.toggle("on", active);
    clearInterval(popTimer);
    if (active && !reduceMotion) {
      spawnComicPop();
      popTimer = setInterval(spawnComicPop, 1700);
    }
    refreshSkillBtn();
  }

  /* --- Cap: shield slam — drops into center, tricolor shockwave --- */
  function shieldSlam() {
    if (slamming || guardMotion()) return;
    slamming = true;
    refreshSkillBtn();
    const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    shieldFly.style.setProperty("--cx", (cx - 46) + "px");
    shieldFly.style.setProperty("--cy", (cy - 46) + "px");
    shieldFly.classList.add("on", "slam");
    setTimeout(() => {
      document.body.classList.add("shake");
      ["#b31942", "#f5f7fa", "#0a3161"].forEach((color, i) => {
        const ring = document.createElement("div");
        ring.className = "slam-ring";
        ring.style.left = cx + "px";
        ring.style.top = cy + "px";
        ring.style.borderColor = color;
        ring.style.animationDelay = (i * 0.12) + "s";
        document.body.appendChild(ring);
        setTimeout(() => ring.remove(), 1600);
      });
      for (let i = 0; i < 7; i++) {
        const star = document.createElement("div");
        star.className = "slam-star";
        star.style.left = cx + "px";
        star.style.top = cy + "px";
        const ang = Math.random() * Math.PI * 2, dist = 120 + Math.random() * 170;
        star.style.setProperty("--sx", (Math.cos(ang) * dist).toFixed(0) + "px");
        star.style.setProperty("--sy", (Math.sin(ang) * dist).toFixed(0) + "px");
        document.body.appendChild(star);
        setTimeout(() => star.remove(), 950);
      }
      setTimeout(() => document.body.classList.remove("shake"), 500);
      setTimeout(() => {
        shieldFly.classList.remove("on", "slam");
        slamming = false;
        refreshSkillBtn();
      }, 700);
    }, 620);
  }

  /* --- Vinland: harvest wind — wheat drifts across the whole page --- */
  function spawnWindPetal() {
    const d = document.createElement("div");
    d.className = "wind-petal";
    d.style.left = "-20px";
    d.style.top = (Math.random() * window.innerHeight * 0.8) + "px";
    d.style.setProperty("--dur", (5.5 + Math.random() * 4).toFixed(1) + "s");
    d.style.setProperty("--dy", (60 + Math.random() * 160).toFixed(0) + "px");
    d.style.transform = "scale(" + (0.7 + Math.random() * 0.7).toFixed(2) + ")";
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 10500);
  }
  function setWind(active) {
    if (active && guardMotion()) return;
    windActive = active;
    windWash.classList.toggle("on", active);
    clearInterval(windTimer);
    if (active) windTimer = setInterval(spawnWindPetal, 240);
    else document.querySelectorAll(".wind-petal").forEach(el => el.remove());
    refreshSkillBtn();
  }

  /* --- Naruto: genjutsu — crimson illusion, spinning Sharingan, falling feathers --- */
  function spawnFeather() {
    const f = document.createElement("div");
    f.className = "genjutsu-feather";
    f.style.left = (Math.random() * 100) + "vw";
    const dur = 5.5 + Math.random() * 3.5;
    f.style.setProperty("--dur", dur.toFixed(1) + "s");
    f.style.setProperty("--dx", (Math.random() * 260 - 130).toFixed(0) + "px");
    f.style.setProperty("--rot", (540 + Math.random() * 300).toFixed(0) + "deg");
    document.body.appendChild(f);
    setTimeout(() => f.remove(), dur * 1000 + 300);
  }
  function setGenjutsu(active, silent) {
    genjutsuActive = active;
    genjutsu.classList.toggle("on", active);
    document.body.classList.toggle("genjutsu", active);
    clearInterval(featherTimer);
    if (active) {
      if (!reduceMotion) featherTimer = setInterval(spawnFeather, 380);
    } else {
      document.querySelectorAll(".genjutsu-feather").forEach(el => el.remove());
      if (!silent) {
        // Kai! — a white flash breaks the illusion
        kaiFlash.classList.remove("flash");
        void kaiFlash.offsetWidth; // restart the animation
        kaiFlash.classList.add("flash");
        setTimeout(() => kaiFlash.classList.remove("flash"), 650);
      }
    }
    refreshSkillBtn();
  }

  const SKILLS = {
    pro: { label: () => blueprintActive ? "🎨 Exit blueprint" : "📐 Blueprint mode", act: () => setBlueprint(!blueprintActive) },
    noir: { label: () => starActive ? "🌙 Clear sky" : "🌠 Starlight", act: () => setStars(!starActive) },
    spidey: { label: () => verseActive ? "🚪 Exit multiverse" : "🌀 Spider-Verse", act: () => setVerse(!verseActive) },
    batman: { label: () => lightsActive ? "💡 Lights on" : "🔦 Lights out", act: () => setLights(!lightsActive) },
    cap: { label: () => slamming ? "🛡️ Incoming…" : "🛡️ Shield slam", act: shieldSlam },
    vinland: { label: () => windActive ? "🍂 Calm the wind" : "🌾 Harvest wind", act: () => setWind(!windActive) },
    luffy: { label: () => voyageActive ? "⚓ Gravity ON" : "🌊 Gravity OFF", act: () => setVoyage(!voyageActive) },
    naruto: { label: () => genjutsuActive ? "💥 Kai — release!" : "👁 Genjutsu", act: () => setGenjutsu(!genjutsuActive) }
  };

  function refreshSkillBtn() {
    const s = SKILLS[currentTheme];
    if (s) { skillBtn.hidden = false; skillBtn.textContent = s.label(); }
    else skillBtn.hidden = true;
  }
  skillBtn.addEventListener("click", () => { const s = SKILLS[currentTheme]; if (s) s.act(); });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && lightsActive) setLights(false);
  });

  // Leaving a theme switches its skill off
  document.addEventListener("themechange", () => {
    if (lightsActive && currentTheme !== "batman") setLights(false);
    if (blueprintActive && currentTheme !== "pro") setBlueprint(false);
    if (starActive && currentTheme !== "noir") setStars(false);
    if (voyageActive && currentTheme !== "luffy") setVoyage(false);
    if (verseActive && currentTheme !== "spidey") setVerse(false);
    if (windActive && currentTheme !== "vinland") setWind(false);
    if (genjutsuActive && currentTheme !== "naruto") setGenjutsu(false, true);
    refreshSkillBtn();
  });

  /* --- Click effects: web / shield rings / chakra / petals --- */
  function spawnFX(cls, html, x, y, life) {
    const d = document.createElement("div");
    d.className = "fx " + cls;
    d.style.left = x + "px";
    d.style.top = y + "px";
    d.innerHTML = html;
    document.body.appendChild(d);
    setTimeout(() => d.remove(), life);
  }

  function webSVG() {
    let spokes = "";
    for (let a = 0; a < 360; a += 45) {
      const r = a * Math.PI / 180;
      spokes += '<line x1="0" y1="0" x2="' + (46 * Math.cos(r)).toFixed(1) + '" y2="' + (46 * Math.sin(r)).toFixed(1) + '"/>';
    }
    function ring(rad) {
      const pts = [];
      for (let a = 22.5; a < 360; a += 45) {
        const r = a * Math.PI / 180;
        pts.push((rad * Math.cos(r)).toFixed(1) + "," + (rad * Math.sin(r)).toFixed(1));
      }
      return '<polygon points="' + pts.join(" ") + '"/>';
    }
    return '<svg viewBox="-50 -50 100 100" width="110" height="110">' +
      '<g stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round">' +
      spokes + ring(15) + ring(29) + ring(43) + "</g></svg>";
  }

  function capRingsSVG() {
    return '<svg viewBox="-50 -50 100 100" width="120" height="120" fill="none" stroke-width="5">' +
      '<circle r="44" stroke="#b31942" style="animation-delay:0s"/>' +
      '<circle r="30" stroke="#e8edf5" style="animation-delay:.09s"/>' +
      '<circle r="16" stroke="#0a3161" style="animation-delay:.18s"/></svg>';
  }

  function chakraSVG() {
    return '<svg viewBox="0 0 200 200" width="110" height="110" fill="none">' +
      '<path stroke="currentColor" stroke-width="13" stroke-linecap="round" ' +
      'd="M52 100 A48 48 0 1 1 148 100 A38 38 0 1 1 72 100 A28 28 0 1 1 128 100 A18 18 0 1 1 92 100 A8 8 0 1 1 108 100"/></svg>';
  }

  function spawnPetals(x, y) {
    for (let i = 0; i < 6; i++) {
      const d = document.createElement("div");
      d.className = "fx fx-petal";
      d.style.left = (x + (Math.random() * 30 - 15)) + "px";
      d.style.top = (y + (Math.random() * 16 - 8)) + "px";
      d.style.setProperty("--dx", (Math.random() * 130 - 65).toFixed(0) + "px");
      d.style.setProperty("--rot", (Math.random() * 320 + 80).toFixed(0) + "deg");
      d.style.animationDelay = (i * 55) + "ms";
      document.body.appendChild(d);
      setTimeout(() => d.remove(), 1900);
    }
  }

  document.addEventListener("click", e => {
    if (reduceMotion) return;
    if (e.clientX === 0 && e.clientY === 0) return; // keyboard-triggered
    const x = e.clientX, y = e.clientY;
    if (currentTheme === "spidey") spawnFX("fx-web", webSVG(), x, y, 950);
    else if (currentTheme === "cap") spawnFX("fx-rings", capRingsSVG(), x, y, 900);
    else if (currentTheme === "naruto") spawnFX("fx-chakra", chakraSVG(), x, y, 1000);
    else if (currentTheme === "vinland") spawnPetals(x, y);
  });

  applyTheme("pro");
  refreshSkillBtn();

  /* ---------------- Navbar ---------------- */
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navLinks.classList.toggle("open");
  });
  navLinks.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
    })
  );

  /* Active link highlighting */
  const sections = document.querySelectorAll("section[id], footer[id]");
  const linkMap = {};
  navLinks.querySelectorAll("a").forEach(a => { linkMap[a.getAttribute("href").slice(1)] = a; });

  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting && linkMap[en.target.id]) {
        Object.values(linkMap).forEach(a => a.classList.remove("active"));
        linkMap[en.target.id].classList.add("active");
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  sections.forEach(s => spy.observe(s));

  /* ---------------- Scroll: progress bar, navbar, back-to-top ---------------- */
  const progress = document.getElementById("scrollProgress");
  const toTop = document.getElementById("toTop");

  function onScroll() {
    const el = document.documentElement;
    const max = el.scrollHeight - window.innerHeight;
    progress.style.transform = "scaleX(" + (max > 0 ? el.scrollTop / max : 0) + ")";
    navbar.classList.toggle("scrolled", el.scrollTop > 10);
    toTop.classList.toggle("show", el.scrollTop > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })
  );

  /* ---------------- Scroll reveal ---------------- */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add("visible");
        revealObs.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => revealObs.observe(el));

  /* ---------------- Animated counters ---------------- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const dur = 1400;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        animateCount(en.target);
        countObs.unobserve(en.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll("[data-count]").forEach(el => countObs.observe(el));

  /* ---------------- Typewriter ---------------- */
  const roles = [
    "Process Engineer",
    "Simulation Specialist",
    "Optimization Enthusiast",
    "Chemical Engineer",
    "Researcher"
  ];
  const tw = document.getElementById("typewriter");
  let roleIdx = 0, charIdx = 0, deleting = false;

  function typeLoop() {
    const word = roles[roleIdx];
    if (!deleting) {
      charIdx++;
      if (charIdx === word.length) {
        deleting = true;
        setTimeout(typeLoop, 1700);
        tw.textContent = word.slice(0, charIdx);
        return;
      }
    } else {
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }
    tw.textContent = word.slice(0, charIdx);
    setTimeout(typeLoop, deleting ? 45 : 90);
  }
  typeLoop();

  /* ---------------- Hero parallax (desktop only) ---------------- */
  const hero = document.getElementById("hero");
  const decors = hero.querySelectorAll(".hero-decor");

  if (!reduceMotion && finePointer) {
    hero.addEventListener("mousemove", e => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      decors.forEach(d => {
        d.style.transform = "translate(" + (x * -16).toFixed(1) + "px, " + (y * -10).toFixed(1) + "px)";
      });
    });
    hero.addEventListener("mouseleave", () => {
      decors.forEach(d => { d.style.transform = ""; });
    });
  }

  /* ---------------- 3D tilt on cards (desktop only) ---------------- */
  if (!reduceMotion && finePointer) {
    document.querySelectorAll(".skill-card, .research-card").forEach(card => {
      card.addEventListener("mousemove", e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          "translateY(-6px) rotateX(" + (-y * 6).toFixed(2) + "deg) rotateY(" + (x * 6).toFixed(2) + "deg)";
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
  }

  /* ---------------- Preloader ---------------- */
  function hidePreloader() {
    setTimeout(() => document.body.classList.add("loaded"), 350);
  }
  if (document.readyState === "complete") hidePreloader();
  else window.addEventListener("load", hidePreloader);

  /* ---------------- Custom cursor (desktop only) ---------------- */
  if (finePointer && !reduceMotion) {
    const dot = document.getElementById("cursorDot");
    const ring = document.getElementById("cursorRing");
    document.body.classList.add("custom-cursor");
    let cursorSeen = false;

    document.addEventListener("mousemove", e => {
      if (!cursorSeen) { dot.style.opacity = "1"; ring.style.opacity = "1"; cursorSeen = true; }
      const t = "translate(" + e.clientX + "px, " + e.clientY + "px)";
      dot.style.transform = t;
      ring.style.transform = t;
    });
    document.documentElement.addEventListener("mouseleave", () => {
      dot.style.opacity = "0"; ring.style.opacity = "0"; cursorSeen = false;
    });
    document.addEventListener("mouseover", e => {
      const interactive = e.target.closest("a, button, [role=button], .chip");
      ring.classList.toggle("grow", !!interactive);
      const overText = !!e.target.closest("input, textarea");
      dot.classList.toggle("hide", overText);
      ring.classList.toggle("hide", overText);
    });
  }

  /* ---------------- Magnetic hero buttons (desktop only) ---------------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".hero-cta .btn").forEach(btn => {
      btn.addEventListener("mousemove", e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        btn.style.transform = "translate(" + (x * 8).toFixed(1) + "px, " + (y * 8 - 3).toFixed(1) + "px)";
      });
      btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
    });
  }
})();
