document.addEventListener('DOMContentLoaded', () => {

    // --- Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorCrosshair = document.querySelector('.cursor-crosshair');
    const hoverTargets = document.querySelectorAll('a, button, .project-card, .timeline-item, .skill-category, .stat-card');

    document.addEventListener('mousemove', (e) => {
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
        
        // Add slight delay for crosshair to create a trailing effect
        setTimeout(() => {
            cursorCrosshair.style.left = e.clientX + 'px';
            cursorCrosshair.style.top = e.clientY + 'px';
        }, 50);
    });

    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => document.body.classList.add('hover-target'));
        target.addEventListener('mouseleave', () => document.body.classList.remove('hover-target'));
    });


    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const htmlElement = document.documentElement;

    // Check saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }


    // --- Blueprint Mode Toggle ---
    const blueprintToggle = document.getElementById('blueprint-toggle');
    
    blueprintToggle.addEventListener('click', () => {
        document.body.classList.toggle('blueprint-mode');
        
        // Add a specialized glitch or flash effect to the UI
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });


    // --- Scroll Progress & Gear Animation ---
    const gearPath = document.getElementById('gear-path');
    const rotatingGear = document.getElementById('rotating-gear');
    const pathLength = 251.2; // 2 * pi * r (r=40)

    window.addEventListener('scroll', () => {
        // Calculate scroll percentage
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollTop / docHeight;
        
        // Update circle progress
        const drawLength = pathLength * scrollPercent;
        gearPath.style.strokeDashoffset = pathLength - drawLength;
        
        // Rotate gear
        rotatingGear.style.transform = `rotate(${scrollPercent * 360}deg)`;

        // Navbar Styling on Scroll
        const navbar = document.querySelector('.navbar');
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Make scroll gear clickable to go to top
    document.querySelector('.scroll-progress-container').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    // --- Intersection Observer for Animations ---
    const observeElements = document.querySelectorAll('.skill-category, .timeline-item, .project-card, .stat-card, .edu-item, .achievement-list li');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = entry.target.classList.contains('timeline-item') || entry.target.classList.contains('edu-item') 
                    ? 'translateX(0)' 
                    : 'translateY(0)';
                
                // Trigger Progress Bars
                const progressBars = entry.target.querySelectorAll('.progress');
                progressBars.forEach(bar => {
                    bar.style.width = bar.getAttribute('data-width');
                });

                // Trigger Gauges
                const gauges = entry.target.querySelectorAll('.gauge-val');
                gauges.forEach(gauge => {
                    const val = gauge.closest('.gauge').getAttribute('data-value');
                    const offset = 125.6 - (125.6 * val / 100);
                    gauge.style.strokeDashoffset = offset;
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // Initial state for observer targets
    observeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = el.classList.contains('timeline-item') || el.classList.contains('edu-item') 
            ? 'translateX(-20px)' 
            : 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });


    // --- Glitch Text Effect ---
    const glitchText = document.querySelector('.glitch');
    if (glitchText) {
        setInterval(() => {
            if (Math.random() > 0.95) {
                glitchText.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
                glitchText.style.color = Math.random() > 0.5 ? 'var(--accent-color)' : 'var(--text-primary)';
                setTimeout(() => {
                    glitchText.style.transform = 'translate(0, 0)';
                    glitchText.style.color = 'var(--text-primary)';
                }, 50);
            }
        }, 200);
    }

    // --- Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if (navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'var(--nav-bg)';
                navLinks.style.padding = '20px';
                navLinks.style.backdropFilter = 'blur(10px)';
                navLinks.style.borderBottom = '1px solid var(--border-color)';
            }
        });
    }
});
