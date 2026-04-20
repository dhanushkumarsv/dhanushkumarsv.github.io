document.addEventListener('DOMContentLoaded', () => {

    // 1. Intersection Observer for fade-in animations
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 2. Interactive Expertise Accordion 
    const categories = document.querySelectorAll('.exp-category');
    
    // Set initial height for the active one
    categories.forEach(cat => {
        if(cat.classList.contains('active')) {
            const content = cat.querySelector('.exp-content');
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });

    const headers = document.querySelectorAll('.exp-header');
    
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const category = header.parentElement;
            const content = category.querySelector('.exp-content');
            
            // Toggle active state
            const isActive = category.classList.contains('active');
            
            // Close all other categories first (optional, for accordion effect)
            categories.forEach(cat => {
                cat.classList.remove('active');
                cat.querySelector('.exp-content').style.maxHeight = null;
            });

            // If it wasn't active, open it
            if (!isActive) {
                category.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // 3. Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 4. Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

});
