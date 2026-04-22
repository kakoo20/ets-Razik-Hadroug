/* ============================================
   ETS. HADROUG RAZIK - MAIN JAVASCRIPT
   Premium Interactions & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileMenu();
    initScrollReveal();
    initAccordion();
    initBackToTop();
    initActiveNav();
});

/* ============================================
   HEADER SCROLL EFFECT
   ============================================ */
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class for shadow effect
        if (currentScroll > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });
}

/* ============================================
   MOBILE MENU
   ============================================ */
function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const navList = document.getElementById('navList');
    if (!toggle || !navList) return;

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggle.classList.toggle('active');
        navList.classList.toggle('active');
        document.body.style.overflow = navList.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    navList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            navList.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (navList.classList.contains('active') &&
            !navList.contains(e.target) &&
            !toggle.contains(e.target)) {
            toggle.classList.remove('active');
            navList.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navList.classList.contains('active')) {
            toggle.classList.remove('active');
            navList.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close on resize to desktop
    window.addEventListener('resize', debounce(() => {
        if (window.innerWidth > 768 && navList.classList.contains('active')) {
            toggle.classList.remove('active');
            navList.classList.remove('active');
            document.body.style.overflow = '';
        }
    }, 250));
}

/* ============================================
   SCROLL REVEAL ANIMATIONS
   ============================================ */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length === 0) return;

    const observerOptions = {
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
}

/* ============================================
   ACCORDION / TOGGLE DETAILS
   ============================================ */
function initAccordion() {
    document.addEventListener('click', (e) => {
        const button = e.target.closest('.accordion-toggle');
        if (!button) return;

        const targetId = button.getAttribute('data-target');
        if (!targetId) return;

        const details = document.getElementById(targetId);
        if (!details) return;

        button.classList.toggle('active');
        details.classList.toggle('show');
    });
}

/* ============================================
   BACK TO TOP BUTTON
   ============================================ */
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', throttle(() => {
        if (window.pageYOffset > 600) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, 200), { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ============================================
   ACTIVE NAVIGATION HIGHLIGHTING
   ============================================ */
function initActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-list a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage ||
            (currentPage === '' && href === 'index.html') ||
            (currentPage === '/' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

// Debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
