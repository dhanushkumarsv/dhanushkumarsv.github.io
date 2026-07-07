/* ============================================================
   Resume chatbot — FULLY OFFLINE, expanded edition.
   Rule-based Q&A over the RESUME data. No API, no keys, no network:
   everything runs in the visitor's browser and works offline.

   HOW IT WORKS
   • Each question is lower-cased and matched (whole-word) against the
     keyword lists below; the best-scoring intent answers.
   • Each project / tool / role has ONE thorough answer (overview + what
     Dhanush did + results + tools), so almost any phrasing about a topic
     returns the full picture.

   TO ADD OR EDIT ANSWERS: change the INTENTS array. Add keywords to `keys`
   and write the reply. Facts come from RESUME (resume-data.js) where
   possible so they stay in sync with the rest of the site.
   ============================================================ */

(function () {
  "use strict";

  const win = document.getElementById("chatWindow");
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");
  const sugBox = document.getElementById("chatSuggestions");
  const avatarEl = document.getElementById("chatAvatar");
  const titleEl = document.getElementById("chatTitle");

  /* ---------- Theme personas ---------- */
  const PERSONAS = {
    spidey: { avatar: "🕷️", title: "Spidey Assistant", greet: "Hey there! 🕷️ Your friendly neighborhood assistant here. Ask me anything about <strong>Dhanush's</strong> education, skills, research or experience!" },
    batman: { avatar: "🦇", title: "Alfred", greet: "Good evening. I am <strong>Alfred</strong>, keeper of Master Dhanush's records. His education, expertise, research, experience — ask, and it shall be answered." },
    pro: { avatar: "🤖", title: "Dhanush's Assistant", greet: "Hello! 👋 I'm Dhanush's resume assistant. Ask me about his <strong>education, skills, research, internships, publications</strong> or how to contact him. Type <em>help</em> to see everything I can answer." },
    noir: { avatar: "🌙", title: "Night Concierge", greet: "Good evening. The lights are low and the answers are sharp. What would you like to know about <strong>Dhanush</strong>?" },
    cap: { avatar: "🛡️", title: "Cap's Assistant", greet: "At attention, soldier! 🛡️ Ask me about <strong>Dhanush's</strong> education, skills, research or experience — I can answer questions all day." },
    vinland: { avatar: "🌾", title: "Vinland Guide", greet: "Welcome, traveler 🌾 Rest a while. Every question about <strong>Dhanush</strong> — education, research, experience — finds a peaceful answer here." },
    luffy: { avatar: "🏴‍☠️", title: "First Mate", greet: "Yo!! Welcome aboard! 🏴‍☠️ Ask me anything about Captain <strong>Dhanush</strong> — his skills, research, adventures… or where to find meat 🍖" },
    naruto: { avatar: "🍥", title: "Shadow Clone", greet: "Hey! I'm Dhanush's shadow clone — believe it! 🍥 Education, research, internships… hit me with your questions!" }
  };

  function currentPersona() {
    const t = document.documentElement.getAttribute("data-theme");
    return PERSONAS[t] || PERSONAS.pro;
  }

  document.addEventListener("themechange", () => {
    const p = currentPersona();
    avatarEl.textContent = p.avatar;
    titleEl.textContent = p.title;
  });

  /* ---------- Helpers ---------- */
  function esc(s) { const d = document.createElement("div"); d.textContent = s; return d.innerHTML; }
  function addMsg(html, who) {
    const div = document.createElement("div");
    div.className = "msg " + who;
    div.innerHTML = html;
    win.appendChild(div);
    win.scrollTop = win.scrollHeight;
    return div;
  }
  function showTyping() { return addMsg('<span class="typing"><i></i><i></i><i></i></span>', "bot"); }
  function botReply(html, delay) {
    const t = showTyping();
    setTimeout(() => { t.innerHTML = html; win.scrollTop = win.scrollHeight; },
      delay || Math.min(500 + html.length * 1.5, 1500));
  }
  function list(items) { return "<ul>" + items.map(i => "<li>" + i + "</li>").join("") + "</ul>"; }

  // Shorthand references to the three projects (from resume-data.js)
  const P_WATER = () => RESUME.research[0];
  const P_MILK = () => RESUME.research[1];
  const P_H2 = () => RESUME.research[2];

  /* ---------- Knowledge base (intents) ---------- *
   * Order matters only for ties: more specific/important intents come first.
   */
  const INTENTS = [

    /* ===== Greeting / help ===== */
    {
      keys: ["hi", "hello", "hey", "greetings", "good morning", "good evening", "yo", "sup", "howdy"],
      exact: true,
      reply: () => currentPersona().greet
    },
    {
      keys: ["help", "what can i ask", "what can you do", "what do you know", "options", "menu", "topics", "commands", "guide me"],
      reply: () => "🧭 <strong>You can ask me about:</strong>" + list([
        "🎓 <strong>Education</strong> — his Master's, Bachelor's, GPAs, university",
        "🛠️ <strong>Skills & software</strong> — Aspen Plus, HYSYS, MATLAB, GAMS, Python, Ansys…",
        "🔬 <strong>Research</strong> — the desalination, dairy MILP, and hydrogen projects",
        "💼 <strong>Experience</strong> — teaching, SAIL, IIT Indore, RK Metals",
        "📚 <strong>Publications</strong>, 🗣️ <strong>languages</strong>, 💪 <strong>strengths</strong>",
        "📬 <strong>Contact / resume</strong> — how to reach him or download the CV"
      ]) + "Try: <em>“tell me about the hydrogen project”</em> or <em>“what's his Master's GPA?”</em>"
    },

    /* ===== About / summary ===== */
    {
      keys: ["about", "who is", "who's", "summary", "yourself", "himself", "introduce", "introduction", "overview", "profile", "bio", "background", "tell me about him", "tell me about you"],
      reply: () => `👨‍🔬 <strong>${RESUME.name}</strong> — ${RESUME.title}, based in ${RESUME.location}.<br><br>${RESUME.summary}<br><br>He's currently doing his M.S. in Chemical Engineering, with hands-on work spanning process simulation, optimization, and experimental research. Ask me about his <strong>research</strong>, <strong>skills</strong>, or <strong>experience</strong> for the details.`
    },

    /* ===== Research overview ===== */
    {
      keys: ["research", "projects", "project", "thesis", "portfolio work", "work on", "worked on", "what has he done", "main work"],
      reply: () => "🔬 <strong>Dhanush's research — three major projects:</strong>" + list([
        `💧 <strong>${P_WATER().title}</strong> <em>(${P_WATER().tags.join(" · ")})</em>`,
        `🥛 <strong>${P_MILK().title}</strong> <em>(${P_MILK().tags.join(" · ")})</em>`,
        `⚡ <strong>${P_H2().title}</strong> <em>(${P_H2().tags.join(" · ")})</em>`
      ]) + "Ask about any one — e.g. <em>“tell me about the desalination project”</em>, <em>“the milk MILP model”</em>, or <em>“the hydrogen reactor”</em>."
    },

    /* ===== Project 1 — Phosphogypsum / desalination ===== */
    {
      keys: ["wastewater", "waste water", "water treatment", "desalination", "desalinate", "vmd", "med", "msf", "phosphogypsum", "phosphorus", "phosphate", "mec", "microbial", "membrane", "membrane distillation", "distillation", "brine", "water recovery", "current research", "masters research", "thesis project", "hybrid process"],
      reply: () => {
        const r = P_WATER();
        return `💧 <strong>${r.title}</strong> <em>(current M.S. research)</em><br><br>` +
          `This project models <strong>hybrid desalination systems</strong> — pairing VMD (vacuum membrane distillation) with MED (multi-effect distillation), and MSF (multi-stage flash) with MED — to clean up phosphogypsum wastewater, a tough acidic stream that comes from phosphoric-acid / fertilizer production. What Dhanush did:` +
          list(r.points) +
          `<strong>Why hybrid + a microbial cell?</strong> Each method has different strengths, so combining them pushes water recovery higher and uses energy more efficiently, while the integrated MEC adds phosphorus recovery from the same stream. <br><strong>Tools:</strong> Aspen Plus / process simulation, energy analysis, and optimization. <br><em>(Specific final performance figures aren't public yet — <a href="mailto:${RESUME.email}">email him</a> for details.)</em>`;
      }
    },

    /* ===== Project 2 — Dairy MILP ===== */
    {
      keys: ["milk", "dairy", "milp", "supply chain", "supplychain", "logistics", "procurement", "bmc", "cost reduction", "unserved", "cooperative", "linear programming", "mixed integer", "milk project"],
      reply: () => {
        const r = P_MILK();
        return `🥛 <strong>${r.title}</strong><br><br>` +
          `A <strong>mathematical optimization model</strong> (MILP — mixed-integer linear programming, built in GAMS) that decides how raw milk should flow from villages → bulk milk coolers (BMCs) → processing plants at the lowest cost, while respecting capacity, flow-balance, and service constraints. What Dhanush did:` +
          list(r.points) +
          `<strong>Headline results:</strong> about <strong>17% lower total cost</strong> and up to <strong>~30% less unserved milk</strong>, plus the key BMC capacity thresholds that drive those gains. <br><strong>Tools:</strong> GAMS, MILP formulation, sensitivity & scenario analysis.`;
      }
    },

    /* ===== Project 3 — Photocatalytic hydrogen ===== */
    {
      keys: ["hydrogen", "h2", "photocatalytic", "photocatalysis", "photo-catalytic", "tio2", "titanium dioxide", "reactor", "solar", "sulphide", "sulfide", "sulphuric", "green hydrogen", "hydrogen project", "photoreactor"],
      reply: () => {
        const r = P_H2();
        return `⚡ <strong>${r.title}</strong><br><br>` +
          `Dhanush designed and built a <strong>4-litre trapezoidal photocatalytic reactor</strong> that uses sunlight and a TiO₂ photocatalyst to produce hydrogen from sulphide-rich wastewater — turning a waste stream into clean fuel. What he did:` +
          list(r.points) +
          `<strong>Headline result:</strong> ~<strong>300 mL·h⁻¹·L⁻¹</strong> of hydrogen under direct sunlight. <br><strong>Tools:</strong> experimental reactor design & build, TiO₂ photocatalysis, process optimization. <br>This work led to his <strong>ICATS 2023</strong> conference paper.`;
      }
    },

    /* ===== Skills overview ===== */
    {
      keys: ["skill", "skills", "software", "tools", "toolset", "tech stack", "technologies", "technology", "expertise", "capabilities", "what can he use", "proficient", "competencies"],
      reply: () => "🛠️ <strong>Technical expertise:</strong>" + list(
        Object.entries(RESUME.skills).map(([k, v]) => `<strong>${k}:</strong> ${v.join(", ")}`)
      ) + "Ask about any tool by name — e.g. <em>“how does he use Aspen Plus?”</em> or <em>“does he know GAMS?”</em>"
    },

    /* ===== Individual tools ===== */
    {
      keys: ["aspen plus", "aspen", "process simulator", "flowsheet"],
      reply: () => `⚗️ <strong>Aspen Plus</strong> is one of Dhanush's core tools — a process simulator for modeling chemical processes, mass/energy balances, and separations. He uses it in his <strong>hybrid desalination research</strong> (modeling the VMD–MED / MSF–MED systems) and has <strong>taught it</strong> as a teaching assistant, helping students build models and troubleshoot convergence. Ask about the <em>desalination project</em> to see it in action.`
    },
    {
      keys: ["hysys", "aspen hysys"],
      reply: () => `⚙️ <strong>Aspen HYSYS</strong> is part of Dhanush's process-simulation toolkit alongside Aspen Plus, used for modeling and simulating chemical / process systems. It's listed among his core simulation tools for process design and analysis.`
    },
    {
      keys: ["gams", "general algebraic", "solver"],
      reply: () => `📐 <strong>GAMS</strong> (General Algebraic Modeling System) is what Dhanush uses for optimization. He built the <strong>MILP dairy supply-chain model</strong> in GAMS (achieving ~17% cost reduction) and has <strong>taught GAMS</strong> as a TA — setting up constraints and objective functions. Ask about the <em>dairy / MILP project</em> for the full story.`
    },
    {
      keys: ["matlab"],
      reply: () => `📊 <strong>MATLAB</strong> is among Dhanush's core tools for modeling, numerical work, and analysis of chemical and process systems, listed in his process-simulation skill set.`
    },
    {
      keys: ["python", "pandas", "numpy", "scripting"],
      reply: () => `🐍 <strong>Python</strong> is part of Dhanush's data-analysis toolkit, which he uses alongside Origin, Excel, and ImageJ for processing and analyzing experimental and process data.`
    },
    {
      keys: ["ansys", "fluent", "cfd", "computational fluid", "fluid dynamics", "simulation cfd"],
      reply: () => `🌀 <strong>Ansys (Fluent) / CFD:</strong> Dhanush lists Ansys Fluent in his simulation skills and did a <strong>CFD research internship at IIT Indore</strong>, running computational fluid dynamics analyses for chemical processes and learning parameter optimization and reporting. Ask about his <em>IIT Indore internship</em> for details.`
    },
    {
      keys: ["origin", "imagej", "excel", "data analysis", "data-analysis", "plotting", "graphing"],
      reply: () => "📈 <strong>Data analysis:</strong> Dhanush works with " + RESUME.skills["Data Analysis"].join(", ") + " for processing experimental data, plotting results, and image/measurement analysis (ImageJ)."
    },
    {
      keys: ["optimization", "optimize", "optimisation", "optimizing", "optimise"],
      reply: () => `🎯 <strong>Optimization</strong> runs through much of Dhanush's work — both <strong>mathematical</strong> and <strong>process</strong> optimization. Examples: the <strong>GAMS MILP model</strong> that cut dairy supply-chain cost by ~17%, the <strong>process & energy optimization</strong> in his hybrid desalination research (water recovery, phosphorus yield, efficiency), and catalyst/condition tuning in the hydrogen reactor. He's also taught optimization concepts (constraints, objective functions) in GAMS.`
    },
    {
      keys: ["semiconductor", "yield", "defect", "manufacturing", "process integration", "coating", "electrochemical", "metallization"],
      reply: () => `🏭 <strong>Manufacturing & process integration:</strong> Dhanush's summary highlights modeling of <strong>chemical and semiconductor processes</strong> with a focus on <strong>yield improvement and defect reduction</strong>. His hands-on background includes <strong>steel QA at SAIL</strong> (yield & defect analysis on rolling lines) and <strong>electrochemical coating / metallization at RK Metals</strong> (thickness, adhesion, corrosion resistance). Ask about those internships for specifics.`
    },

    /* ===== Education ===== */
    {
      keys: ["education", "study", "studied", "degree", "degrees", "university", "universities", "college", "qualification", "qualifications", "academic", "academic background", "schooling"],
      reply: () => "🎓 <strong>Education:</strong>" + list(RESUME.education.map(e =>
        `<strong>${e.degree}</strong> — ${e.school}, ${e.place} (${e.years}) · GPA <strong>${e.gpa}</strong>`
      )) + "Ask about his <em>Master's</em>, <em>Bachelor's</em>, or <em>GPA</em> for more."
    },
    {
      keys: ["master", "masters", "m.s", "ms ", "nchu", "chung hsing", "graduate degree", "current degree", "grad school", "postgraduate"],
      reply: () => { const m = RESUME.education[0];
        return `🎓 <strong>Master's:</strong> ${m.degree} at <strong>${m.school}</strong>, ${m.place} (${m.years}), GPA <strong>${m.gpa}</strong>. His research focuses on <strong>hybrid membrane–thermal desalination for phosphogypsum wastewater treatment</strong> with phosphorus recovery. Ask about the <em>desalination project</em> to hear more.`; }
    },
    {
      keys: ["bachelor", "bachelors", "btech", "b.tech", "anna university", "undergraduate", "undergrad", "b tech"],
      reply: () => { const b = RESUME.education[1];
        return `🎓 <strong>Bachelor's:</strong> ${b.degree} at <strong>${b.school}</strong>, ${b.place} (${b.years}), GPA <strong>${b.gpa}</strong>. This is where his chemical-engineering foundation and early research (including the photocatalytic hydrogen work) began.`; }
    },
    {
      keys: ["gpa", "cgpa", "grade", "grades", "marks", "score", "academic performance", "results"],
      reply: () => "📊 <strong>Academic performance:</strong>" + list(RESUME.education.map(e =>
        `${e.degree} — <strong>GPA ${e.gpa}</strong> (${e.school})`
      ))
    },

    /* ===== Experience overview ===== */
    {
      keys: ["experience", "internship", "internships", "intern", "work experience", "job", "jobs", "work history", "companies", "employment", "roles", "positions"],
      reply: () => "💼 <strong>Experience & internships:</strong>" + list(RESUME.internships.map(i =>
        `<strong>${i.role}</strong> — ${i.org} <em>(${i.period})</em>`
      )) + "Ask about any one — <em>teaching</em>, <em>SAIL / steel</em>, <em>IIT Indore / CFD</em>, or <em>RK Metals / coating</em>."
    },

    /* ===== Individual roles ===== */
    {
      keys: ["teaching", "teacher", "ta ", "teaching assistant", "assistant", "tutor", "mentor", "taught"],
      reply: () => { const i = RESUME.internships[0];
        return `👩‍🏫 <strong>${i.role}</strong> — ${i.org} <em>(${i.period})</em>` + list(i.points); }
    },
    {
      keys: ["sail", "steel", "salem", "quality assurance", "qa ", "rolling", "steel authority"],
      reply: () => { const i = RESUME.internships[1];
        return `🏗️ <strong>${i.role}</strong> — ${i.org} <em>(${i.period})</em>` + list(i.points); }
    },
    {
      keys: ["iit", "indore", "iit indore", "cfd intern", "research intern"],
      reply: () => { const i = RESUME.internships[2];
        return `🌀 <strong>${i.role}</strong> — ${i.org} <em>(${i.period})</em>` + list(i.points); }
    },
    {
      keys: ["rk metals", "surface coating", "coating intern", "metals"],
      reply: () => { const i = RESUME.internships[3];
        return `🔩 <strong>${i.role}</strong> — ${i.org} <em>(${i.period})</em>` + list(i.points); }
    },

    /* ===== Publications ===== */
    {
      keys: ["publication", "publications", "paper", "papers", "conference", "conferences", "published", "research output", "articles"],
      reply: () => "📚 <strong>Publications & conferences:</strong>" + list(RESUME.publications.map(p =>
        `“${p.title}” — <strong>${p.venue}</strong>`
      )) + "Ask about the <em>glycerol paper</em> or the <em>hydrogen paper</em> for context."
    },
    {
      keys: ["glycerol", "location selection", "icates", "glycerol plant"],
      reply: () => `📄 <strong>“Location Selection and Purification Process Simulation for a Glycerol Plant”</strong> — <strong>ICATES 2024</strong>. It combines choosing a suitable plant location with simulating the glycerol purification process — glycerol being a major byproduct (e.g. of biodiesel) whose purification is a classic separation problem. Fits his focus on process simulation for separation & purification.`
    },
    {
      keys: ["hydrogen paper", "icats", "photocatalytic paper", "hydrogen gas paper"],
      reply: () => `📄 <strong>“Production of Hydrogen Gas Using Photo-catalytic Method”</strong> — <strong>ICATS 2023</strong>. This came out of his experimental work building the TiO₂ photocatalytic reactor for solar-driven hydrogen from sulphide-rich wastewater (~300 mL·h⁻¹·L⁻¹). See the <em>hydrogen project</em> for the full description.`
    },

    /* ===== Languages ===== */
    {
      keys: ["language", "languages", "speak", "spoken", "english", "chinese", "tamil", "mandarin", "multilingual"],
      reply: () => "🗣️ <strong>Languages:</strong> " + RESUME.languages.map(l => `${l.name} (${l.level})`).join(" · ") + ". Living and studying in Taiwan has made the basic Chinese especially handy."
    },

    /* ===== Strengths / why hire ===== */
    {
      keys: ["strength", "strengths", "best at", "good at", "why hire", "why should", "stand out", "unique", "value", "selling point", "highlight", "achievements", "accomplishments", "why him"],
      reply: () => "💪 <strong>What makes Dhanush stand out:</strong>" + list([
        "<strong>Simulation depth:</strong> Aspen Plus, HYSYS, MATLAB, GAMS & Ansys Fluent across chemical and semiconductor processes",
        "<strong>Proven results:</strong> ~17% supply-chain cost reduction, ~300 mL·h⁻¹·L⁻¹ solar hydrogen output, and a top M.S. GPA (3.95/4.3)",
        "<strong>Range:</strong> steel QA, CFD research, electrochemical coating, and teaching — plus 2 conference publications",
        "<strong>Both sides of the bench:</strong> comfortable in pure simulation/optimization <em>and</em> hands-on experimental work",
        "<strong>Mindset:</strong> data-driven, yield-focused, continuous improvement"
      ])
    },

    /* ===== Availability / hiring / goals ===== */
    {
      keys: ["available", "availability", "open to work", "looking for", "opportunity", "opportunities", "roles open", "recruit", "recruiter", "collaboration", "collaborate", "goals", "career", "future", "aspiration", "next step", "phd", "seeking"],
      reply: () => `🚀 Dhanush is <strong>open to process-engineering roles, research collaboration, and interesting problems</strong>. His focus is on process simulation and optimization for sustainable water and energy systems, building on his desalination, optimization, and clean-hydrogen work. The best way to start a conversation is <a href="mailto:${RESUME.email}">email</a> — or ask me for his <em>contact</em> details.`
    },

    /* ===== Contact ===== */
    {
      keys: ["contact", "email", "e-mail", "phone", "call", "linkedin", "reach", "reach out", "hire", "hiring", "connect", "get in touch", "message", "how to contact"],
      reply: () =>
        "📬 <strong>Contact Dhanush:</strong>" + list([
          `Email: <a href="mailto:${RESUME.email}">${RESUME.email}</a>`,
          `Phone: <a href="tel:${RESUME.phone.replace(/[^+\d]/g, "")}">${RESUME.phone}</a>`,
          `LinkedIn: <a href="${RESUME.linkedin}" target="_blank" rel="noopener">dhanush-kumar-772274213</a>`,
          `Location: ${RESUME.location}`
        ])
    },

    /* ===== Location ===== */
    {
      keys: ["location", "where", "based", "live", "living", "taiwan", "taichung", "from", "country", "city", "hometown", "nationality", "relocate"],
      reply: () => `📍 Dhanush is based in <strong>${RESUME.location}</strong>, where he's pursuing his M.S. in Chemical Engineering at National Chung Hsing University. He's originally from <strong>India</strong> (B.Tech at Anna University, Chennai).`
    },

    /* ===== Resume / CV ===== */
    {
      keys: ["resume", "cv", "download", "pdf", "docx", "copy of resume", "curriculum"],
      // NOTE: place your resume files at these paths (rename them to match), or edit the paths below.
      reply: () => `📄 You can grab the resume here: <a href="assets/Dhanush_Kumar_Resume.pdf" download><strong>Download PDF</strong></a> or <a href="assets/Dhanush_Kumar_Resume.docx" download><strong>Word (.docx)</strong></a> — also in the <a href="#resume">Resume section</a>.`
    },

    /* ===== Hobbies (not on file — honest pivot) ===== */
    {
      keys: ["hobby", "hobbies", "free time", "fun fact", "spare time", "outside work", "for fun", "interests outside", "pastime"],
      reply: () => `🙂 I don't have Dhanush's personal hobbies on file — for that, <a href="mailto:${RESUME.email}">ask him directly</a>! Fun fact about this site, though: it has <strong>eight switchable identities</strong> (Blueprint mode, Noir, plus six hidden character themes), each with its own special effect. Ask me about <em>secrets</em> 🤫`
    },

    /* ===== Personal / off-limits (kept professional) ===== */
    {
      keys: ["age", "old are", "how old", "married", "girlfriend", "boyfriend", "single", "relationship", "religion", "salary", "personal life", "family", "dating"],
      reply: () => `😊 I stick to Dhanush's professional side — education, research, skills, and experience. For anything personal, best to <a href="mailto:${RESUME.email}">reach out to him directly</a>. Meanwhile, happy to tell you about his <em>research</em> or <em>projects</em>!`
    },

    /* ===== Themes & easter eggs ===== */
    {
      keys: ["theme", "themes", "dark mode", "light mode", "superhero", "favorite hero", "identities", "colors"],
      reply: () => "🎨 This portfolio has <strong>eight identities</strong>, each with its own <strong>special skill button</strong> (bottom-left). Up top: <strong>Light</strong> ☀️ (Blueprint mode — the whole site redraws itself as an engineering drawing) and midnight <strong>Noir</strong> 🌙 (Starlight — a sky full of shooting stars). At the very bottom, a vault hides <strong>six character themes</strong>… ask me about <em>secrets</em> 🤫"
    },
    {
      keys: ["secret", "secrets", "hidden", "easter egg", "easter eggs", "unlock", "more themes", "surprise", "extra", "vault"],
      reply: () => {
        if (window.DK) window.DK.openVault();
        return "🤫 The vault at the bottom of the page just opened for you — six identities await:" + list([
          "🕷️ Spider-Man — red & white hero energy", "🦇 Batman — Gotham after dark",
          "🛡️ Captain America — stars & stripes", "🌾 Vinland Saga — peaceful warm fields",
          "🏴‍☠️ Luffy — sunny seas & straw hats", "🍥 Naruto — orange ninja spirit"
        ]) + "Or just ask me for any of them by name.";
      }
    },
    {
      keys: ["captain america", "captain", "america", "avenger", "avengers", "steve rogers", "rogers", "first avenger", "shield"],
      reply: () => { if (window.DK) window.DK.applyTheme("cap");
        return "🛡️ <strong>Captain America mode engaged.</strong> Click anywhere to raise the shield — or hit <strong>“Shield slam”</strong> (bottom-left): the shield drops from the sky, the ground shakes, and a red-white-blue shockwave rolls across the page. I can do this all day."; }
    },
    {
      keys: ["vinland", "saga", "thorfinn", "viking", "vikings", "norse", "askeladd", "farm arc"],
      reply: () => { if (window.DK) window.DK.applyTheme("vinland");
        return "🌾 <strong>Vinland mode.</strong> Green meadows, quiet sun. Click for a gentle breeze — or press <strong>“Harvest wind”</strong> (bottom-left) and let golden wheat drift across the whole page. A true warrior needs no sword."; }
    },
    {
      keys: ["luffy", "one piece", "pirate", "pirates", "straw hat", "monkey d", "grand line", "gomu", "gear five"],
      reply: () => { if (window.DK) window.DK.applyTheme("luffy");
        return "🏴‍☠️ <strong>Luffy mode — anchors aweigh!</strong> Ocean skies, rolling waves, straw hat secured. Special skill: hit <strong>“Gravity OFF”</strong> (bottom-left) and the sea will rise while the ship sails you through the whole portfolio, section by section 🌊"; }
    },
    {
      keys: ["naruto", "ninja", "hokage", "konoha", "shinobi", "dattebayo", "uzumaki", "rasengan"],
      reply: () => { if (window.DK) window.DK.applyTheme("naruto");
        return "🍥 <strong>Naruto mode — dattebayo!</strong> Click to spin chakra — or dare the <strong>“Genjutsu”</strong> (bottom-left): the world turns crimson, a giant Sharingan spins behind the page, and reality starts to breathe. Press <em>Kai!</em> to break free."; }
    },
    {
      keys: ["batman", "gotham", "dark knight", "bruce wayne", "spiderman", "spider-man", "spidey", "peter parker"],
      reply: q => {
        const wantsBat = /bat|gotham|bruce|dark knight/i.test(q);
        if (window.DK) window.DK.applyTheme(wantsBat ? "batman" : "spidey");
        return wantsBat
          ? "🦇 <strong>Gotham mode.</strong> Special skill: hit <strong>“Lights out”</strong> (bottom-left) and only your flashlight survives. It's not who I am underneath, but what I document, that defines me."
          : "🕷️ <strong>Spidey mode on!</strong> Click anywhere to sling webs — or enter the <strong>“Spider-Verse”</strong> (bottom-left): halftone dots, glitching dimensions, THWIP! BAM! comic bursts everywhere. With great processes comes great responsibility.";
      }
    },

    /* ===== Thanks / bye ===== */
    {
      keys: ["thank", "thanks", "thx", "great", "awesome", "cool", "nice", "bye", "goodbye", "see you"],
      reply: () => "You're welcome! 😊 Anything else you'd like to know? If you'd like to talk to the real Dhanush, <a href=\"mailto:" + RESUME.email + "\">drop him an email</a>."
    }
  ];

  const FALLBACK = () =>
    "Hmm, I don't have that one written up. 🤔 Try asking about:" + list([
      "🎓 Education & GPA", "🛠️ Skills & software (Aspen, GAMS, MATLAB, Python…)",
      "🔬 Research projects (desalination · dairy MILP · hydrogen)",
      "💼 Internships & experience", "📚 Publications", "📬 Contact / resume"
    ]) + "…or type <em>help</em> for the full menu.";

  /* ---------- Intent matching ---------- */
  function keyMatches(q, key) {
    const escaped = key.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp("\\b" + escaped + "\\b", "i").test(q);
  }

  function answer(text) {
    const q = text.toLowerCase().trim();
    let best = null, bestScore = 0;
    for (const intent of INTENTS) {
      let score = 0;
      for (const k of intent.keys) if (keyMatches(q, k)) score += k.length > 4 ? 2 : 1;
      if (intent.exact && q.split(/\s+/).length > 4) score = 0; // greeting only when short
      if (score > bestScore) { bestScore = score; best = intent; }
    }
    return best ? best.reply(q) : FALLBACK();
  }

  /* ---------- Suggestions ---------- */
  const SUGGESTIONS = [
    "Tell me about his research",
    "What software does he use?",
    "The hydrogen project",
    "What's his Master's GPA?",
    "His internships",
    "Is he open to work?",
    "How can I contact him?",
    "Any secrets? 🤫"
  ];
  SUGGESTIONS.forEach(s => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = s;
    b.addEventListener("click", () => send(s));
    sugBox.appendChild(b);
  });

  /* ---------- Send flow ---------- */
  function send(text) {
    if (!text.trim()) return;
    addMsg(esc(text), "user");
    input.value = "";
    botReply(answer(text));
  }
  form.addEventListener("submit", e => { e.preventDefault(); send(input.value); });

  /* ---------- Boot ---------- */
  const p = currentPersona();
  avatarEl.textContent = p.avatar;
  titleEl.textContent = p.title;
  botReply(p.greet, 600);
})();
