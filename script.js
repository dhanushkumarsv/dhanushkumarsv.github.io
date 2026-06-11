document.addEventListener('DOMContentLoaded', () => {

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ===== Theme toggle (dark default) ===== */
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = themeBtn.querySelector('i');
    const root = document.documentElement;

    const applyTheme = (theme) => {
        if (theme === 'light') {
            root.setAttribute('data-theme', 'light');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        } else {
            root.removeAttribute('data-theme');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
    };

    applyTheme(localStorage.getItem('theme') || 'dark');

    themeBtn.addEventListener('click', () => {
        const next = root.hasAttribute('data-theme') ? 'dark' : 'light';
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
        'Process Engineer',
        'Process Simulation Specialist',
        'Yield Optimization Enthusiast',
        'Aspen Plus | HYSYS | GAMS',
        'M.S. Chemical Engineering'
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
        'Aspen Plus': {
            sym: 'Ap',
            desc: 'A leading chemical process simulation software used by the bulk, fine, specialty and biochemical industries for modeling, design and optimization.',
            exp: 'Modeled hybrid VMD-MED and MSF-MED systems for phosphogypsum wastewater purification, and guided students through process simulation as a Teaching Assistant at NCHU.'
        },
        'Aspen HYSYS': {
            sym: 'Hy',
            desc: 'A process simulation tool for the energy industry, used for optimizing the performance of oil, gas and chemical processes.',
            exp: 'Used for modeling and simulating chemical and energy-related processes, ensuring optimal operational parameters.'
        },
        'MATLAB': {
            sym: 'Ml',
            desc: 'A multi-paradigm programming language and numeric computing environment for engineering and science.',
            exp: 'Used for complex mathematical modeling, data analysis and algorithm development for process optimization.'
        },
        'GAMS': {
            sym: 'Ga',
            desc: 'General Algebraic Modeling System — a high-level modeling system for mathematical optimization problems.',
            exp: 'Formulated a MILP model for integrated milk procurement under capacity, flow-balance and service constraints, achieving ~17% total cost reduction.'
        },
        'Electrochemical Coating': {
            sym: 'Ec',
            desc: 'A process that uses electrical current to deposit a thin, coherent metal coating on an electrode surface.',
            exp: 'Studied electrochemical coating and metallization methods at RK Metals; evaluated thickness, adhesion and corrosion resistance.'
        },
        'Surface Process Modeling': {
            sym: 'Sp',
            desc: 'Modeling of physical and chemical processes occurring at solid surfaces and interfaces.',
            exp: 'Applied surface-processing principles to evaluate coating performance and improve material characteristics.'
        },
        'Yield Optimization': {
            sym: 'Yo',
            desc: 'Identifying and reducing sources of yield loss in manufacturing to maximize output and quality.',
            exp: 'Analyzed production data from hot and cold rolling lines at SAIL to identify factors affecting steel yield; investigated manufacturing defects via root cause analysis.'
        },
        'Origin': {
            sym: 'Og',
            desc: 'A professional software package for interactive scientific graphing and data analysis.',
            exp: 'Used for plotting experimental data and analyzing results from chemical engineering processes and material tests.'
        },
        'Excel': {
            sym: 'Ex',
            desc: 'Spreadsheet software featuring calculation, graphing tools and pivot tables for engineering data work.',
            exp: 'Used extensively for data organization, statistical analysis and managing process parameters across projects.'
        },
        'ImageJ': {
            sym: 'Ij',
            desc: 'A Java-based image processing program developed at the National Institutes of Health.',
            exp: 'Analyzed microscopic images of coatings and materials to determine surface properties and defect sizes.'
        },
        'Python': {
            sym: 'Py',
            desc: 'A high-level, general-purpose programming language widely used for data work and automation.',
            exp: 'Applied scripting for data manipulation, automation of repetitive tasks and preliminary data analysis.'
        },
        'Process Flow Reports': {
            sym: 'Pf',
            desc: 'Documentation detailing the sequence of operations in a process, including flowcharts and key parameters.',
            exp: 'Drafted comprehensive reports detailing process models, optimization results and technical specifications.'
        },
        'Design of Experiments': {
            sym: 'De',
            desc: 'A systematic method to determine the relationship between factors affecting a process and its output.',
            exp: 'Applied DOE principles to structure experiments for photocatalytic hydrogen production and coating tests.'
        },
        'Technical Writing': {
            sym: 'Tw',
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

    document.querySelectorAll('.element').forEach(el => {
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

    /* ===== Molecule canvas (hero background) ===== */
    const canvas = document.getElementById('molecule-canvas');
    if (canvas && !prefersReducedMotion) {
        const ctx = canvas.getContext('2d');
        let atoms = [];
        let w, h, raf;

        const accent = () => root.hasAttribute('data-theme')
            ? { atom: 'rgba(13, 148, 136, 0.55)', bond: '13, 148, 136' }
            : { atom: 'rgba(45, 212, 191, 0.55)', bond: '45, 212, 191' };

        const resize = () => {
            const rect = canvas.parentElement.getBoundingClientRect();
            w = canvas.width = rect.width;
            h = canvas.height = rect.height;

            const count = Math.min(90, Math.floor((w * h) / 16000));
            atoms = Array.from({ length: count }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.45,
                vy: (Math.random() - 0.5) * 0.45,
                r: Math.random() * 2.2 + 1.2
            }));
        };

        const BOND_DIST = 130;

        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            const c = accent();

            for (let i = 0; i < atoms.length; i++) {
                const a = atoms[i];
                a.x += a.vx; a.y += a.vy;
                if (a.x < 0 || a.x > w) a.vx *= -1;
                if (a.y < 0 || a.y > h) a.vy *= -1;

                ctx.beginPath();
                ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
                ctx.fillStyle = c.atom;
                ctx.fill();

                for (let j = i + 1; j < atoms.length; j++) {
                    const b = atoms[j];
                    const dx = a.x - b.x, dy = a.y - b.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < BOND_DIST) {
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.strokeStyle = `rgba(${c.bond}, ${0.16 * (1 - dist / BOND_DIST)})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
            raf = requestAnimationFrame(draw);
        };

        resize();
        draw();
        window.addEventListener('resize', () => { cancelAnimationFrame(raf); resize(); draw(); });
    }

});
