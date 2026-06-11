document.addEventListener('DOMContentLoaded', () => {

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = document.documentElement;
    const isDark = () => root.getAttribute('data-theme') === 'dark';

    /* ============================================================
       3D PROCESS PLANT — interactive Three.js scene
       Distillation columns, heat exchanger, storage tank and
       pipework with animated product flow. Drag to rotate.
       ============================================================ */
    let setPlantTheme = () => {};

    (function initPlant() {
        const canvas = document.getElementById('plant-canvas');
        if (!canvas || !window.THREE) return;

        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        } catch (e) {
            canvas.style.display = 'none';
            return;
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
        camera.position.set(18.5, 10, 24);
        camera.lookAt(6.8, 2.4, 0);

        /* ---- Lights ---- */
        const hemi = new THREE.HemisphereLight(0xffffff, 0xc8d6e6, 0.95);
        scene.add(hemi);
        const dir = new THREE.DirectionalLight(0xffffff, 0.85);
        dir.position.set(6, 12, 8);
        scene.add(dir);
        const fill = new THREE.DirectionalLight(0xffffff, 0.25);
        fill.position.set(-8, 4, -6);
        scene.add(fill);

        /* ---- Materials (recolored on theme change) ---- */
        const matSteel  = new THREE.MeshStandardMaterial({ metalness: 0.55, roughness: 0.38 });
        const matSteel2 = new THREE.MeshStandardMaterial({ metalness: 0.5,  roughness: 0.45 });
        const matAccent = new THREE.MeshStandardMaterial({ metalness: 0.35, roughness: 0.3, emissiveIntensity: 0.35 });
        const matPipe   = new THREE.MeshStandardMaterial({ metalness: 0.6,  roughness: 0.35 });
        const matFlow   = new THREE.MeshStandardMaterial({ emissiveIntensity: 1.0, metalness: 0.1, roughness: 0.4 });
        const matGround = new THREE.MeshStandardMaterial({ metalness: 0.1,  roughness: 0.95 });

        const plant = new THREE.Group();
        plant.position.set(8.2, 0, 0);
        plant.scale.setScalar(0.82);
        scene.add(plant);

        /* ---- Ground pad + grid ---- */
        const ground = new THREE.Mesh(new THREE.CylinderGeometry(11, 11, 0.18, 64), matGround);
        ground.position.y = -0.09;
        plant.add(ground);

        let grid = null;
        const buildGrid = (c1, c2) => {
            if (grid) plant.remove(grid);
            grid = new THREE.GridHelper(21, 21, c1, c2);
            grid.position.y = 0.005;
            grid.material.transparent = true;
            grid.material.opacity = 0.35;
            plant.add(grid);
        };

        /* ---- Equipment builders ---- */
        const makeColumn = (r, h, x, z) => {
            const g = new THREE.Group();
            const body = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 32), matSteel);
            body.position.y = h / 2;
            g.add(body);

            const top = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), matSteel);
            top.position.y = h;
            g.add(top);

            const skirt = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.15, r * 1.3, 0.5, 32), matSteel2);
            skirt.position.y = 0.25;
            g.add(skirt);

            // Tray flanges
            const nRings = Math.max(3, Math.round(h / 1.6));
            for (let i = 1; i <= nRings; i++) {
                const ring = new THREE.Mesh(new THREE.TorusGeometry(r + 0.02, 0.045, 10, 40), matSteel2);
                ring.rotation.x = Math.PI / 2;
                ring.position.y = (h / (nRings + 1)) * i;
                g.add(ring);
            }

            // Accent collar near top
            const collar = new THREE.Mesh(new THREE.TorusGeometry(r + 0.03, 0.07, 12, 44), matAccent);
            collar.rotation.x = Math.PI / 2;
            collar.position.y = h - 0.35;
            g.add(collar);

            g.position.set(x, 0, z);
            plant.add(g);
            return g;
        };

        const makeTank = (r, h, x, z) => {
            const g = new THREE.Group();
            const body = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 36), matSteel2);
            body.position.y = h / 2;
            g.add(body);
            const dome = new THREE.Mesh(new THREE.SphereGeometry(r, 36, 16, 0, Math.PI * 2, 0, Math.PI / 2), matSteel2);
            dome.position.y = h;
            g.add(dome);
            const band = new THREE.Mesh(new THREE.TorusGeometry(r + 0.02, 0.05, 10, 44), matAccent);
            band.rotation.x = Math.PI / 2;
            band.position.y = h * 0.7;
            g.add(band);
            g.position.set(x, 0, z);
            plant.add(g);
            return g;
        };

        const makeExchanger = (r, len, x, y, z) => {
            const g = new THREE.Group();
            const shell = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 28), matSteel);
            shell.rotation.z = Math.PI / 2;
            g.add(shell);
            [-1, 1].forEach(s => {
                const cap = new THREE.Mesh(new THREE.SphereGeometry(r, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), matAccent);
                cap.rotation.z = s * -Math.PI / 2;
                cap.position.x = s * len / 2;
                g.add(cap);
                const leg = new THREE.Mesh(new THREE.BoxGeometry(0.22, y, 0.7), matSteel2);
                leg.position.set(s * len * 0.3, -y / 2, 0);
                g.add(leg);
            });
            g.position.set(x, y, z);
            plant.add(g);
            return g;
        };

        makeColumn(1.15, 7.2, -4.2, 0.4);      // main distillation column
        makeColumn(0.85, 5.4, -0.8, -2.2);     // secondary column
        makeTank(1.5, 2.6, 4.2, 1.8);          // product storage tank
        makeExchanger(0.62, 3.4, 2.0, 1.0, -2.6); // shell & tube heat exchanger

        /* ---- Pipework (smooth tubes along 3D curves) ---- */
        const V = (x, y, z) => new THREE.Vector3(x, y, z);
        const pipeCurves = [
            // feed line in → main column
            new THREE.CatmullRomCurve3([V(-9.5, 0.6, 3.2), V(-7, 0.6, 2.6), V(-5.4, 2.4, 1.2), V(-4.2, 3.6, 0.5)]),
            // main column top → secondary column top
            new THREE.CatmullRomCurve3([V(-4.2, 7.6, 0.4), V(-3.4, 8.3, -0.6), V(-1.8, 7.0, -1.6), V(-0.8, 5.8, -2.2)]),
            // secondary column bottom → heat exchanger
            new THREE.CatmullRomCurve3([V(-0.8, 0.8, -2.2), V(0.2, 0.6, -2.5), V(0.9, 1.0, -2.6), V(1.6, 1.0, -2.6)]),
            // heat exchanger → storage tank
            new THREE.CatmullRomCurve3([V(3.7, 1.0, -2.6), V(4.6, 1.2, -1.6), V(4.8, 2.2, 0.2), V(4.2, 3.1, 1.7)]),
            // tank → product out
            new THREE.CatmullRomCurve3([V(4.2, 0.5, 3.2), V(5.4, 0.5, 4.4), V(7.4, 0.5, 5.2), V(9.6, 0.5, 5.6)])
        ];

        pipeCurves.forEach(curve => {
            const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 64, 0.11, 12), matPipe);
            plant.add(tube);
        });

        /* ---- Flow particles inside the pipes ---- */
        const flowDots = [];
        const dotGeo = new THREE.SphereGeometry(0.085, 10, 10);
        pipeCurves.forEach(curve => {
            const n = 6;
            for (let i = 0; i < n; i++) {
                const mesh = new THREE.Mesh(dotGeo, matFlow);
                plant.add(mesh);
                flowDots.push({ curve, mesh, t: i / n, speed: 0.0016 + Math.random() * 0.0011 });
            }
        });

        /* ---- Theme-aware colors ---- */
        setPlantTheme = (dark) => {
            if (dark) {
                matSteel.color.set(0x3a4f78);
                matSteel2.color.set(0x2c3d5f);
                matPipe.color.set(0x46587f);
                matAccent.color.set(0x2dd4bf);
                matAccent.emissive.set(0x2dd4bf);
                matFlow.color.set(0x38bdf8);
                matFlow.emissive.set(0x38bdf8);
                matGround.color.set(0x0d1526);
                hemi.color.set(0x9db4d8); hemi.groundColor.set(0x1a2540); hemi.intensity = 0.7;
                dir.intensity = 0.7;
                scene.fog = new THREE.Fog(0x070c18, 26, 56);
                buildGrid(0x24365a, 0x18233c);
            } else {
                matSteel.color.set(0xc3d2e2);
                matSteel2.color.set(0xa8bccf);
                matPipe.color.set(0x93a9c0);
                matAccent.color.set(0x0d9488);
                matAccent.emissive.set(0x0d9488);
                matFlow.color.set(0x0284c7);
                matFlow.emissive.set(0x0284c7);
                matGround.color.set(0xe2eaf3);
                hemi.color.set(0xffffff); hemi.groundColor.set(0xc8d6e6); hemi.intensity = 0.95;
                dir.intensity = 0.85;
                scene.fog = new THREE.Fog(0xf4f7fb, 28, 58);
                buildGrid(0xc4d2e2, 0xd9e3ee);
            }
        };
        setPlantTheme(isDark());

        /* ---- Drag to rotate ---- */
        let autoRot = 0;
        let dragRot = 0;
        let dragging = false;
        let lastX = 0;
        const dragHint = document.getElementById('drag-hint');

        canvas.addEventListener('pointerdown', (e) => {
            dragging = true;
            lastX = e.clientX;
            if (dragHint) dragHint.classList.add('fade');
        });
        window.addEventListener('pointermove', (e) => {
            if (!dragging) return;
            dragRot += (e.clientX - lastX) * 0.006;
            lastX = e.clientX;
        });
        window.addEventListener('pointerup', () => { dragging = false; });

        /* ---- Resize ---- */
        const resize = () => {
            const rect = canvas.parentElement.getBoundingClientRect();
            renderer.setSize(rect.width, rect.height, false);
            camera.aspect = rect.width / rect.height;
            camera.updateProjectionMatrix();
        };
        resize();
        window.addEventListener('resize', resize);

        /* ---- Render loop ---- */
        const render = () => {
            plant.rotation.y = autoRot + dragRot;
            flowDots.forEach(d => {
                d.t = (d.t + d.speed) % 1;
                d.mesh.position.copy(d.curve.getPointAt(d.t));
            });
            renderer.render(scene, camera);
        };

        if (prefersReducedMotion) {
            render();
            window.addEventListener('resize', render);
        } else {
            const loop = () => {
                if (!dragging) autoRot += 0.0015;
                render();
                requestAnimationFrame(loop);
            };
            loop();
        }
    })();

    /* ===== Theme toggle (light default, dark optional) ===== */
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = themeBtn.querySelector('i');

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
        setPlantTheme(theme === 'dark');
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
        'Process Engineer',
        'Process Simulation & Optimization',
        'Aspen Plus | HYSYS | MATLAB | GAMS',
        'Yield Improvement & Process Integration'
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

    /* ===== 3D tilt on cards ===== */
    if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.tilt').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform =
                    `perspective(900px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg) translateY(-4px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    /* ===== Flip cards: tap support for touch devices ===== */
    document.querySelectorAll('.flip-card').forEach(card => {
        card.addEventListener('click', () => card.classList.toggle('flipped'));
    });

});
