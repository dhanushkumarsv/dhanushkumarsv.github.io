document.addEventListener('DOMContentLoaded', () => {

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ===== Theme toggle (light default, dark optional) ===== */
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = themeBtn.querySelector('i');
    const root = document.documentElement;

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            root.removeAttribute('data-theme');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    };

    applyTheme(localStorage.getItem('theme') || 'light');

    themeBtn.addEventListener('click', () => {
        const next = root.hasAttribute('data-theme') ? 'light' : 'dark';
        localStorage.setItem('theme', next);
        applyTheme(next);
    });

    /* ===== Mobile menu ===== */
    const burger = document.getElementById('burger');
    const navLinks = document.getElementById('nav-links');
    const burgerIcon = burger.querySelector('i');

    burger.addEventListener('click', () => {
        const open = navLinks.classList.toggle('open');
        burgerIcon.classList.toggle('fa-bars', !open);
        burgerIcon.classList.toggle('fa-xmark', open);
    });

    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        burgerIcon.classList.add('fa-bars');
        burgerIcon.classList.remove('fa-xmark');
    }));

    /* ===== Nav shadow + scroll progress + scroll spy ===== */
    const navShell = document.getElementById('nav-shell');
    const progress = document.getElementById('scroll-progress');
    const sections = document.querySelectorAll('main section[id]');
    const spyLinks = navLinks.querySelectorAll('.nav-link');

    const onScroll = () => {
        navShell.classList.toggle('scrolled', window.scrollY > 10);

        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';

        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
        });
        spyLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ===== Typed hero roles ===== */
    const roles = [
        'Chemical & Process Engineer',
        'Transport Phenomena · Fluid Dynamics',
        'Heat Transfer & Thermodynamics',
        'Process Simulation & Optimization',
        'Aspen Plus | HYSYS | GAMS'
    ];
    const typedEl = document.getElementById('typed-role');

    if (prefersReducedMotion) {
        typedEl.textContent = roles[0];
    } else {
        let roleIdx = 0, charIdx = 0, deleting = false;
        const type = () => {
            const word = roles[roleIdx];
            typedEl.textContent = word.slice(0, charIdx);

            let delay = deleting ? 35 : 75;
            if (!deleting && charIdx === word.length) { delay = 1800; deleting = true; }
            else if (deleting && charIdx === 0) {
                deleting = false;
                roleIdx = (roleIdx + 1) % roles.length;
                delay = 350;
            } else {
                charIdx += deleting ? -1 : 1;
            }
            setTimeout(type, delay);
        };
        type();
    }

    /* ===== Reveal on scroll + counters + GPA bars ===== */
    const animateCount = (el) => {
        const target = parseFloat(el.dataset.count);
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const duration = 1400;
        const start = performance.now();
        const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = (target * eased).toFixed(decimals);
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('in');

            entry.target.querySelectorAll('.stat-num[data-count]').forEach(el => {
                if (!el.dataset.done) { el.dataset.done = '1'; animateCount(el); }
            });
            entry.target.querySelectorAll('.gpa-fill[data-width]').forEach(el => {
                el.style.width = el.dataset.width + '%';
            });
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    /* ===== Skill modal ===== */
    const skillData = {
        'Transport Phenomena': {
            sym: 'TP',
            desc: 'The unified study of momentum, heat and mass transfer — the framework that connects molecular mechanisms to equipment-scale behaviour in every chemical process.',
            exp: 'Applied coupled heat and mass transfer analysis to membrane distillation (VMD-MED / MSF-MED) modeling and photocatalytic reactor design, linking driving forces to recovery and yield.'
        },
        'Fluid Dynamics': {
            sym: 'FD',
            desc: 'The study of fluid flow — from laminar and turbulent regimes to pressure drop, mixing and computational fluid dynamics (CFD).',
            exp: 'Performed CFD analysis of chemical processes as a research intern at IIT Indore, learning parameter optimization and flow-field reporting techniques.'
        },
        'Heat Transfer': {
            sym: 'HT',
            desc: 'Conduction, convection and radiation analysis — sizing exchangers, evaporators and thermal separation systems.',
            exp: 'Performed energy analysis of multi-effect distillation (MED) and multi-stage flash (MSF) configurations to improve water recovery and overall thermal efficiency.'
        },
        'Thermodynamics': {
            sym: 'TD',
            desc: 'Phase equilibria, property models and energy balances — the foundation of every flowsheet simulation and separation design.',
            exp: 'Selected and applied thermodynamic property packages in Aspen Plus and HYSYS for distillation, desalination and purification process models.'
        },
        'Aspen Plus': {
            sym: 'AP',
            desc: 'A leading chemical process simulation software used by the bulk, fine, specialty and biochemical industries for modeling, design and optimization.',
            exp: 'Modeled hybrid VMD-MED and MSF-MED systems for phosphogypsum wastewater purification, and guided students through process simulation as a Teaching Assistant at NCHU.'
        },
        'Aspen HYSYS': {
            sym: 'HY',
            desc: 'A process simulation tool for the energy industry, used for optimizing the performance of oil, gas and chemical processes.',
            exp: 'Used for modeling and simulating chemical and energy-related processes, ensuring optimal operational parameters.'
        },
        'MATLAB': {
            sym: 'ML',
            desc: 'A multi-paradigm programming language and numeric computing environment for engineering and science.',
            exp: 'Used for complex mathematical modeling, data analysis and algorithm development for process optimization.'
        },
        'GAMS': {
            sym: 'GA',
            desc: 'General Algebraic Modeling System — a high-level modeling system for mathematical optimization problems.',
            exp: 'Formulated a MILP model for integrated milk procurement under capacity, flow-balance and service constraints, achieving ~17% total cost reduction.'
        },
        'Electrochemical Coating': {
            sym: 'EC',
            desc: 'A process that uses electrical current to deposit a thin, coherent metal coating on an electrode surface.',
            exp: 'Studied electrochemical coating and metallization methods at RK Metals; evaluated thickness, adhesion and corrosion resistance.'
        },
        'Surface Process Modeling': {
            sym: 'SM',
            desc: 'Modeling of physical and chemical processes occurring at solid surfaces and interfaces.',
            exp: 'Applied surface-processing principles to evaluate coating performance and improve material characteristics.'
        },
        'Yield Optimization': {
            sym: 'YO',
            desc: 'Identifying and reducing sources of yield loss in manufacturing to maximize output and quality.',
            exp: 'Analyzed production data from hot and cold rolling lines at SAIL to identify factors affecting steel yield; investigated manufacturing defects via root cause analysis.'
        },
        'Origin': {
            sym: 'OG',
            desc: 'A professional software package for interactive scientific graphing and data analysis.',
            exp: 'Used for plotting experimental data and analyzing results from chemical engineering processes and material tests.'
        },
        'Excel': {
            sym: 'EX',
            desc: 'Spreadsheet software featuring calculation, graphing tools and pivot tables for engineering data work.',
            exp: 'Used extensively for data organization, statistical analysis and managing process parameters across projects.'
        },
        'ImageJ': {
            sym: 'IJ',
            desc: 'A Java-based image processing program developed at the National Institutes of Health.',
            exp: 'Analyzed microscopic images of coatings and materials to determine surface properties and defect sizes.'
        },
        'Python': {
            sym: 'PY',
            desc: 'A high-level, general-purpose programming language widely used for data work and automation.',
            exp: 'Applied scripting for data manipulation, automation of repetitive tasks and preliminary data analysis.'
        },
        'Process Flow Reports': {
            sym: 'PF',
            desc: 'Documentation detailing the sequence of operations in a process, including flowcharts and key parameters.',
            exp: 'Drafted comprehensive reports detailing process models, optimization results and technical specifications.'
        },
        'Design of Experiments': {
            sym: 'DE',
            desc: 'A systematic method to determine the relationship between factors affecting a process and its output.',
            exp: 'Applied DOE principles to structure experiments for photocatalytic hydrogen production and coating tests.'
        },
        'Technical Writing': {
            sym: 'TW',
            desc: 'Clear, structured communication of complex technical information for engineering and research audiences.',
            exp: 'Authored technical publications including papers for ICATES 2023 and 2024, distilling complex research into accessible formats.'
        }
    };

    const modalOverlay = document.getElementById('modal-overlay');
    const modalSym = document.getElementById('modal-sym');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalExp = document.getElementById('modal-exp');
    const modalClose = document.getElementById('modal-close');

    document.querySelectorAll('.tag-card').forEach(el => {
        el.addEventListener('click', () => {
            const skill = el.dataset.skill;
            const data = skillData[skill];
            if (!data) return;
            modalSym.textContent = data.sym;
            modalTitle.textContent = skill;
            modalDesc.textContent = data.desc;
            modalExp.textContent = data.exp;
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeModal = () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    /* ===== Hero canvas: potential flow past a cylinder =====
       Real fluid mechanics: the analytic 2D potential-flow solution
       u = U(1 - R²(x²-y²)/r⁴), v = -2UR²xy/r⁴.
       Tracer particles are advected through the field and coloured by
       local speed (blue = stagnation, red = 2U at the cylinder crown),
       like a CFD velocity-magnitude plot. */
    const canvas = document.getElementById('flow-canvas');
    if (canvas && !prefersReducedMotion) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let w, h, R, cx, cy, raf;

        const U = 1.0;          // freestream velocity (px/frame, scaled below)
        const SPEED_SCALE = 1.8;

        const isDark = () => root.getAttribute('data-theme') === 'dark';

        const spawn = (anywhere) => ({
            x: anywhere ? Math.random() * w : -5 - Math.random() * 40,
            y: Math.random() * h,
            px: null, py: null,
            life: 200 + Math.random() * 400
        });

        const resize = () => {
            const rect = canvas.parentElement.getBoundingClientRect();
            w = canvas.width = rect.width;
            h = canvas.height = rect.height;

            R = Math.min(w, h) * 0.16;
            cx = w * 0.28;
            cy = h * 0.58;

            const count = Math.min(260, Math.floor((w * h) / 5500));
            particles = Array.from({ length: count }, () => spawn(true));
        };

        // Analytic potential-flow velocity at (x, y)
        const velocity = (x, y) => {
            const dx = x - cx, dy = y - cy;
            const r2 = dx * dx + dy * dy;
            if (r2 < 1e-6) return { u: 0, v: 0, s: 0 };
            const k = (R * R) / (r2 * r2);
            const u = U * (1 - k * (dx * dx - dy * dy));
            const v = -U * 2 * k * dx * dy;
            return { u, v, s: Math.hypot(u, v) };
        };

        // CFD-style colormap: slow = blue (hue 225), fast = red (hue 0)
        const speedColor = (s, alpha) => {
            const t = Math.min(s / (2 * U), 1);
            const hue = 225 * (1 - t);
            const light = isDark() ? 60 : 45;
            return `hsla(${hue}, 85%, ${light}%, ${alpha})`;
        };

        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            const dark = isDark();

            // The cylinder (the obstacle the flow bends around)
            ctx.beginPath();
            ctx.arc(cx, cy, R, 0, Math.PI * 2);
            ctx.fillStyle = dark ? 'rgba(22, 34, 58, 0.55)' : 'rgba(216, 226, 238, 0.55)';
            ctx.fill();
            ctx.setLineDash([6, 6]);
            ctx.strokeStyle = dark ? 'rgba(147, 164, 189, 0.35)' : 'rgba(70, 88, 111, 0.3)';
            ctx.lineWidth = 1.2;
            ctx.stroke();
            ctx.setLineDash([]);

            // Freestream annotation
            ctx.font = '12px "JetBrains Mono", monospace';
            ctx.fillStyle = dark ? 'rgba(147, 164, 189, 0.45)' : 'rgba(70, 88, 111, 0.45)';
            ctx.fillText('U∞ →', 18, cy + 4);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                const { u, v, s } = velocity(p.x, p.y);

                p.px = p.x; p.py = p.y;
                p.x += u * SPEED_SCALE;
                p.y += v * SPEED_SCALE;
                p.life--;

                const dx = p.x - cx, dy = p.y - cy;
                if (p.x > w + 10 || p.y < -10 || p.y > h + 10 ||
                    dx * dx + dy * dy < (R + 1) * (R + 1) ||
                    p.life <= 0 || s < 0.02) {
                    particles[i] = spawn(false);
                    continue;
                }

                ctx.beginPath();
                ctx.moveTo(p.px, p.py);
                ctx.lineTo(p.x, p.y);
                ctx.strokeStyle = speedColor(s, dark ? 0.55 : 0.5);
                ctx.lineWidth = 1.6;
                ctx.lineCap = 'round';
                ctx.stroke();
            }
            raf = requestAnimationFrame(draw);
        };

        resize();
        draw();
        window.addEventListener('resize', () => { cancelAnimationFrame(raf); resize(); draw(); });
    }

});
