/**
 * Modern Portfolio - Enhanced JavaScript
 * Smooth animations, interactions, and effects
 * Author: Zhon Mark Manaois
 */

(function() {
    "use strict";

    /**
     * Helper function - Select elements
     */
    const select = (el, all = false) => {
        el = el.trim();
        if (all) {
            return [...document.querySelectorAll(el)];
        } else {
            return document.querySelector(el);
        }
    };

    /**
     * Helper function - Event listener
     */
    const on = (type, el, listener, all = false) => {
        let selectEl = select(el, all);
        if (selectEl) {
            if (all) {
                selectEl.forEach(e => e.addEventListener(type, listener));
            } else {
                selectEl.addEventListener(type, listener);
            }
        }
    };

    /**
     * Helper function - Scroll event listener
     */
    const onscroll = (el, listener) => {
        el.addEventListener('scroll', listener);
    };

    /**
     * Navbar links active state on scroll
     */
    let navbarlinks = select('#navbar .scrollto', true);
    const navbarlinksActive = () => {
        let position = window.scrollY + 200;
        navbarlinks.forEach(navbarlink => {
            if (!navbarlink.hash) return;
            let section = select(navbarlink.hash);
            if (!section) return;
            if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
                navbarlink.classList.add('active');
            } else {
                navbarlink.classList.remove('active');
            }
        });
    };
    window.addEventListener('load', navbarlinksActive);
    onscroll(document, navbarlinksActive);

    /**
     * Smooth scroll to element
     */
    const scrollto = (el) => {
        let element = select(el);
        if (element) {
            let elementPos = element.offsetTop;
            window.scrollTo({
                top: elementPos,
                behavior: 'smooth'
            });
        }
    };

    /**
     * Back to top button
     */
    let backtotop = select('.back-to-top');
    if (backtotop) {
        const toggleBacktotop = () => {
            if (window.scrollY > 100) {
                backtotop.classList.add('active');
            } else {
                backtotop.classList.remove('active');
            }
        };
        window.addEventListener('load', toggleBacktotop);
        onscroll(document, toggleBacktotop);
    }

    /**
     * Mobile nav toggle
     */
    on('click', '.mobile-nav-toggle', function(e) {
        select('body').classList.toggle('mobile-nav-active');
        this.querySelector('i').classList.toggle('bx-menu');
        this.querySelector('i').classList.toggle('bx-x');
    });

    /**
     * Close mobile nav when clicking outside
     */
    document.addEventListener('click', function(e) {
        if (select('body').classList.contains('mobile-nav-active')) {
            if (!e.target.closest('#header') && !e.target.closest('.mobile-nav-toggle')) {
                select('body').classList.remove('mobile-nav-active');
                let toggle = select('.mobile-nav-toggle i');
                if (toggle) {
                    toggle.classList.add('bx-menu');
                    toggle.classList.remove('bx-x');
                }
            }
        }
    });

    /**
     * Scroll with offset on links with .scrollto class
     */
    on('click', '.scrollto', function(e) {
        if (select(this.hash)) {
            e.preventDefault();

            let body = select('body');
            if (body.classList.contains('mobile-nav-active')) {
                body.classList.remove('mobile-nav-active');
                let navbarToggle = select('.mobile-nav-toggle i');
                if (navbarToggle) {
                    navbarToggle.classList.add('bx-menu');
                    navbarToggle.classList.remove('bx-x');
                }
            }
            scrollto(this.hash);
        }
    }, true);

    /**
     * Scroll with offset on page load with hash links in the url
     */
    window.addEventListener('load', () => {
        if (window.location.hash) {
            if (select(window.location.hash)) {
                scrollto(window.location.hash);
            }
        }
    });

    /**
     * Typed.js effect
     */
    const typed = select('.typed');
    if (typed) {
        let typed_strings = typed.getAttribute('data-typed-items');
        typed_strings = typed_strings.split(',').map(s => s.trim());
        new Typed('.typed', {
            strings: typed_strings,
            loop: true,
            typeSpeed: 80,
            backSpeed: 40,
            backDelay: 2000,
            startDelay: 500,
            cursorChar: '|',
            smartBackspace: true
        });
    }

    /**
     * Initialize GLightbox
     */
    const portfolioLightbox = GLightbox({
        selector: '.portfolio-lightbox',
        touchNavigation: true,
        loop: true,
        autoplayVideos: true
    });

    /**
     * AOS Animation on scroll
     */
    window.addEventListener('load', () => {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            mirror: false,
            offset: 50
        });
    });

    /**
     * Parallax effect for hero section
     */
    const hero = select('#hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const heroContainer = select('.hero-container');
            if (heroContainer && scrolled < window.innerHeight) {
                heroContainer.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContainer.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
            }
        });
    }

    /**
     * Mouse move parallax for glass cards
     */
    const glassCards = select('.content', true);
    glassCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    /**
     * Intersection Observer for fade-in animations
     */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all sections
    select('section', true).forEach(section => {
        observer.observe(section);
    });

    /**
     * Smooth reveal for resume items
     */
    const resumeItems = select('.resume-item', true);
    resumeItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });

    /**
     * Dynamic gradient on mouse move
     */
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        document.body.style.setProperty('--mouse-x', x);
        document.body.style.setProperty('--mouse-y', y);
    });

    /**
     * Keyboard navigation support
     */
    document.addEventListener('keydown', (e) => {
        // ESC key closes mobile nav
        if (e.key === 'Escape') {
            if (select('body').classList.contains('mobile-nav-active')) {
                select('body').classList.remove('mobile-nav-active');
                let toggle = select('.mobile-nav-toggle i');
                if (toggle) {
                    toggle.classList.add('bx-menu');
                    toggle.classList.remove('bx-x');
                }
            }
        }
    });

    /**
     * Preloader (if you add one later)
     */
    window.addEventListener('load', () => {
        const preloader = select('#preloader');
        if (preloader) {
            preloader.remove();
        }
    });

    /**
     * Console greeting
     */
    console.log('%c👋 Hello there!', 'font-size: 24px; font-weight: bold;');
    console.log('%cWelcome to Zhon Mark Manaois\'s Portfolio', 'font-size: 14px; color: #667eea;');
    console.log('%cLooking for internship opportunities!', 'font-size: 12px; color: #f093fb;');

})();
