document.addEventListener('DOMContentLoaded', () => {

    /* --- Theme Toggle Logic --- */
    const themeBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    const icon = themeBtn.querySelector('i');

    // Check for saved user preference, if any, on load of the website
    const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

    if (currentTheme) {
        htmlEl.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }

    themeBtn.addEventListener('click', () => {
        let theme = htmlEl.getAttribute('data-theme');
        
        if (theme === 'dark') {
            htmlEl.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            htmlEl.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    });

    /* --- Mobile Menu Logic --- */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-list a');

    if (mobileMenuBtn && navList) {
        mobileMenuBtn.addEventListener('click', () => {
            navList.classList.toggle('active');
            const menuIcon = mobileMenuBtn.querySelector('i');
            if (navList.classList.contains('active')) {
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-xmark');
            } else {
                menuIcon.classList.remove('fa-xmark');
                menuIcon.classList.add('fa-bars');
            }
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
                const menuIcon = mobileMenuBtn.querySelector('i');
                menuIcon.classList.remove('fa-xmark');
                menuIcon.classList.add('fa-bars');
            });
        });
    }

    /* --- Scroll Reveal Animations --- */
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll);
    
    // Trigger once on load
    revealOnScroll();

    /* --- Expertise Panel Logic --- */
    const expertiseData = {
        "Aspen Plus": {
            desc: "A leading chemical process optimization software used by the bulk, fine, specialty, & biochemical industries.",
            exp: "Modeled hybrid VMD-MED and MSF-MED systems for phosphogypsum wastewater purification. Also guided students in process simulation as a Teaching Assistant."
        },
        "Aspen HYSYS": {
            desc: "A process simulation tool for the energy industry, used for optimizing the performance of processes.",
            exp: "Utilized for modeling and simulating chemical and energy-related processes, ensuring optimal operational parameters."
        },
        "MATLAB": {
            desc: "A proprietary multi-paradigm programming language and numeric computing environment.",
            exp: "Used for complex mathematical modeling, data analysis, and algorithm development for process optimization."
        },
        "GAMS": {
            desc: "General Algebraic Modeling System, a high-level modeling system for mathematical optimization.",
            exp: "Formulated a MILP model for integrated milk procurement under capacity, flow balance, and service constraints, achieving ~17% cost reduction."
        },
        "Electrochemical coating": {
            desc: "A process that uses electrical current to reduce dissolved metal cations so that they form a thin coherent metal coating on an electrode.",
            exp: "Studied electro-chemical coating and metallization methods at RK Metals. Evaluated performance factors including thickness, adhesion, and corrosion resistance."
        },
        "Surface process modeling": {
            desc: "Modeling of physical and chemical processes occurring at solid surfaces.",
            exp: "Applied principles of surface processing to evaluate coating performance and improve overall material characteristics."
        },
        "Yield optimization": {
            desc: "The process of identifying and reducing sources of yield loss in manufacturing to maximize output and quality.",
            exp: "Analyzed production data from hot and cold rolling lines at SAIL to identify factors affecting steel yield and quality. Investigated manufacturing defects."
        },
        "Origin": {
            desc: "A proprietary computer program for interactive scientific graphing and data analysis.",
            exp: "Employed for plotting experimental data and analyzing results from chemical engineering processes and material tests."
        },
        "Excel": {
            desc: "A spreadsheet developed by Microsoft featuring calculation, graphing tools, pivot tables, etc.",
            exp: "Used extensively for data organization, basic statistical analysis, and managing process parameters in various projects."
        },
        "ImageJ": {
            desc: "A Java-based image processing program developed at the National Institutes of Health.",
            exp: "Utilized for analyzing microscopic images of coatings and materials to determine surface properties and defect sizes."
        },
        "Python (basic)": {
            desc: "A high-level, general-purpose programming language.",
            exp: "Applied basic scripting for data manipulation, automation of repetitive tasks, and preliminary data analysis."
        },
        "Process flow reports": {
            desc: "Documentation detailing the sequence of operations in a process, including flowcharts and parameters.",
            exp: "Drafted comprehensive reports detailing process models, optimization results, and technical specifications for projects."
        },
        "Design of experiments": {
            desc: "The design of any task that aims to describe and explain the variation of information under conditions that are hypothesized to reflect the variation.",
            exp: "Applied DOE principles to structure experiments for photocatalytic hydrogen production and material coating tests."
        },
        "Technical writing": {
            desc: "Writing or drafting technical communication used in technical and occupational fields.",
            exp: "Authored technical publications including papers for ICATES 2023 and 2024, summarizing complex research into accessible formats."
        }
    };

    const tags = document.querySelectorAll('.tag');
    const panel = document.getElementById('expertise-panel');
    const overlay = document.getElementById('panel-overlay');
    const closeBtn = document.getElementById('close-panel');
    const panelTitle = document.getElementById('panel-title');
    const panelDesc = document.getElementById('panel-desc');
    const panelExp = document.getElementById('panel-experience');

    if (panel && tags.length > 0) {
        tags.forEach(tag => {
            tag.addEventListener('click', () => {
                const skill = tag.textContent.trim();
                const data = expertiseData[skill];
                
                panelTitle.textContent = skill;
                if (data) {
                    panelDesc.textContent = data.desc;
                    panelExp.textContent = data.exp;
                } else {
                    panelDesc.textContent = "Detailed description for " + skill + " goes here.";
                    panelExp.textContent = "Details about your experience and what you did with " + skill + ".";
                }

                panel.classList.add('active');
                overlay.classList.add('active');
            });
        });

        const closePanel = () => {
            panel.classList.remove('active');
            overlay.classList.remove('active');
        };

        closeBtn.addEventListener('click', closePanel);
        overlay.addEventListener('click', closePanel);
    }

});
