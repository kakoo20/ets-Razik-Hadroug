/* ============================================
   GROUPE DIVERSIFIÉ - MAIN JAVASCRIPT
   Pure JavaScript - No Frameworks
   ============================================ */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    MobileMenu.init();
    StickyHeader.init();
    SmoothScroll.init();
    LazyLoading.init();
    ActiveNav.init();
    FormValidation.init();
    AnimationOnScroll.init();
    DetailsAccordion.init();
});

/* ============================================
   DETAILS ACCORDION MODULE
   ============================================ */
const DetailsAccordion = {
    init: function() {
        // We attach ONE listener to the whole document
        document.addEventListener('click', function(e) {
            
            // Look for the closest element with the class .arrow-toggle
            const button = e.target.closest('.arrow-toggle');
            
            // If we didn't click a button, exit
            if (!button) return;

            // Find the section that contains this button
            const section = button.closest('section');
            if (!section) return;

            // Find the hidden details div inside that section
            const details = section.querySelector('.hidden-details');
            
            if (details) {
                // Toggle the states
                button.classList.toggle('active');
                details.classList.toggle('show');
            }
        });
    }
};

/* ============================================
   MOBILE MENU MODULE
   ============================================ */
const MobileMenu = {
    init: function() {
        this.toggle = document.querySelector('.mobile-menu-toggle');
        this.navList = document.querySelector('.nav-list');
        this.body = document.body;
        
        if (!this.toggle || !this.navList) return;
        
        this.bindEvents();
    },
    
    bindEvents: function() {
        // Toggle menu on button click
        this.toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });
        
        // Close menu when clicking on a link
        const navLinks = this.navList.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.navList.classList.contains('active') && 
                !this.navList.contains(e.target) && 
                !this.toggle.contains(e.target)) {
                this.closeMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navList.classList.contains('active')) {
                this.closeMenu();
            }
        });
        
        // Close menu on window resize (if going to desktop)
        window.addEventListener('resize', this.debounce(() => {
            if (window.innerWidth > 768 && this.navList.classList.contains('active')) {
                this.closeMenu();
            }
        }, 250));
    },
    
    toggleMenu: function() {
        const isOpen = this.navList.classList.contains('active');
        
        if (isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    },
    
    openMenu: function() {
        this.navList.classList.add('active');
        this.toggle.classList.add('active');
        this.toggle.setAttribute('aria-expanded', 'true');
        this.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Animate hamburger to X
        const spans = this.toggle.querySelectorAll('span');
        if (spans.length === 3) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        }
    },
    
    closeMenu: function() {
        this.navList.classList.remove('active');
        this.toggle.classList.remove('active');
        this.toggle.setAttribute('aria-expanded', 'false');
        this.body.style.overflow = ''; // Restore scrolling
        
        // Reset hamburger
        const spans = this.toggle.querySelectorAll('span');
        if (spans.length === 3) {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    },
    
    debounce: function(func, wait) {
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
};

/* ============================================
   STICKY HEADER MODULE
   ============================================ */
const StickyHeader = {
    init: function() {
        this.header = document.querySelector('.main-header');
        if (!this.header) return;
           this.lastScroll = 0;

        this.scrollThreshold = 100;
     
        
        this.bindEvents();
    },
    
    bindEvents: function() {
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
        }, 100));
    },
    
    handleScroll: function() {
        const currentScroll = window.pageYOffset;
        
        // Add/remove shadow based on scroll position
        if (currentScroll > 10) {
            this.header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        } else {
            this.header.style.boxShadow = '';
        }
        
        // Hide/show header on scroll direction (optional)
        if (currentScroll > this.scrollThreshold) {
            if (currentScroll > this.lastScroll && currentScroll > 200) {
                // Scrolling down - hide header
                this.header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up - show header
                this.header.style.transform = 'translateY(0)';
            }
        } else {
            this.header.style.transform = 'translateY(0)';
        }
        
        this.lastScroll = currentScroll;
    },
    
    throttle: function(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

/* ============================================
   SMOOTH SCROLL MODULE
   ============================================ */
const SmoothScroll = {
    init: function() {
        this.bindEvents();
    },
    
    bindEvents: function() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    this.scrollTo(targetElement);
                }
            });
        });
    },
    
    scrollTo: function(element, offset = 100) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
};

/* ============================================
   LAZY LOADING MODULE
   ============================================ */
const LazyLoading = {
    init: function() {
        // Check if native lazy loading is supported
        if ('loading' in HTMLImageElement.prototype) {
            this.nativeLazyLoad();
        } else {
            this.intersectionObserverLazyLoad();
        }
        
        // Lazy load background images
        this.lazyLoadBackgrounds();
    },
    
    nativeLazyLoad: function() {
        // Browser supports native lazy loading
        // Images with loading="lazy" will work automatically
        console.log('Native lazy loading supported');
    },
    
    intersectionObserverLazyLoad: function() {
        // Fallback for browsers without native support
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    },
    
    loadImage: function(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;
        
        // Create a new image to preload
        const tempImage = new Image();
        tempImage.onload = () => {
            img.src = src;
            img.classList.add('loaded');
        };
        tempImage.onerror = () => {
            img.classList.add('error');
        };
        tempImage.src = src;
    },
    
    lazyLoadBackgrounds: function() {
        const bgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const bgUrl = element.getAttribute('data-bg');
                    if (bgUrl) {
                        element.style.backgroundImage = `url(${bgUrl})`;
                        element.classList.add('bg-loaded');
                    }
                    observer.unobserve(element);
                }
            });
        }, {
            rootMargin: '100px 0px'
        });
        
        document.querySelectorAll('[data-bg]').forEach(el => {
            bgObserver.observe(el);
        });
    }
};

/* ============================================
   ACTIVE NAVIGATION MODULE
   ============================================ */
const ActiveNav = {
    init: function() {
        this.currentPage = window.location.pathname.split('/').pop() || 'index.html';
        this.highlightCurrentPage();
        this.highlightSubNavOnScroll();
    },
    
    highlightCurrentPage: function() {
        const navLinks = document.querySelectorAll('.nav-list a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === this.currentPage || 
                (this.currentPage === '' && href === 'index.html') ||
                (this.currentPage === '/' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    },
    
    highlightSubNavOnScroll: function() {
        // Only run on pages with sub-navigation
        const subNav = document.querySelector('.sub-nav');
        if (!subNav) return;
        
        const sections = document.querySelectorAll('section[id]');
        const subNavLinks = subNav.querySelectorAll('a');
        
        if (sections.length === 0 || subNavLinks.length === 0) return;
        
        const observerOptions = {
            rootMargin: '-20% 0px -80% 0px',
            threshold: 0
        };
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    this.updateSubNavActiveState(id, subNavLinks);
                }
            });
        }, observerOptions);
        
        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    },
    
    updateSubNavActiveState: function(activeId, links) {
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${activeId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
};

/* ============================================
   FORM VALIDATION MODULE
   ============================================ */
const FormValidation = {
    init: function() {
        this.forms = document.querySelectorAll('form');
        this.bindEvents();
    },
    
    bindEvents: function() {
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
            
            // Real-time validation
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
                
                input.addEventListener('input', () => {
                    this.clearError(input);
                });
            });
        });
    },
    
    validateForm: function(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    },
    
    validateField: function(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Required check
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Ce champ est requis';
        }
        
        // Email validation
        if (isValid && field.type === 'email' && value) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(value)) {
                isValid = false;
                errorMessage = 'Veuillez entrer une adresse email valide';
            }
        }
        
        // Phone validation
        if (isValid && field.type === 'tel' && value) {
            const phonePattern = /^[\+\d\s\-\(\)]{8,}$/;
            if (!phonePattern.test(value)) {
                isValid = false;
                errorMessage = 'Veuillez entrer un numéro de téléphone valide';
            }
        }
        
        // Min length
        if (isValid && field.minLength && value.length < field.minLength) {
            isValid = false;
            errorMessage = `Minimum ${field.minLength} caractères requis`;
        }
        
        if (isValid) {
            this.showSuccess(field);
        } else {
            this.showError(field, errorMessage);
        }
        
        return isValid;
    },
    
    showError: function(field, message) {
        this.clearError(field);
        field.classList.add('error');
        
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = '#dc2626';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
        errorElement.style.display = 'block';
        
        field.parentNode.appendChild(errorElement);
    },
    
    showSuccess: function(field) {
        field.classList.remove('error');
        field.classList.add('success');
    },
    
    clearError: function(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
};

/* ============================================
   ANIMATION ON SCROLL MODULE
   ============================================ */
const AnimationOnScroll = {
    init: function() {
        this.animatedElements = document.querySelectorAll(
            '.pillar-card, .store-card, .service-detail-card, ' +
            '.portfolio-item, .cert-card, .content-section, .etb-section'
        );
        
        if (this.animatedElements.length === 0) return;
        
        this.setupObserver();
    },
    
    setupObserver: function() {
        const observerOptions = {
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        this.animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(el);
        });
        
        // Add CSS for animation
        this.addAnimationStyles();
    },
    
    addAnimationStyles: function() {
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }
};

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

// Cookie utilities
const CookieUtil = {
    set: function(name, value, days) {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/';
    },
    
    get: function(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) {
                return decodeURIComponent(c.substring(nameEQ.length, c.length));
            }
        }
        return null;
    },
    
    remove: function(name) {
        this.set(name, '', -1);
    }
};

// Local Storage utilities
const StorageUtil = {
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.warn('LocalStorage not available');
            return false;
        }
    },
    
    get: function(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.warn('LocalStorage not available');
            return null;
        }
    },
    
    remove: function(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn('LocalStorage not available');
        }
    }
};

// Debounce function
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

// Throttle function
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

// Detect if element is in viewport
function isInViewport(element, offset = 0) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= -offset &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Back to top button functionality
function initBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Retour en haut');
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--accent, #333);
        color: white;
        border: none;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        font-size: 20px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(backToTopBtn);
    
    window.addEventListener('scroll', throttle(() => {
        if (window.pageYOffset > 500) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    }, 200));
    
    backToTopBtn.addEventListener('click', scrollToTop);
}

// Initialize back to top button
document.addEventListener('DOMContentLoaded', initBackToTop);

/* ============================================
   PERFORMANCE MONITORING
   ============================================ */
const PerformanceMonitor = {
    init: function() {
        // Log page load time
        window.addEventListener('load', () => {
            setTimeout(() => {
                const timing = performance.timing;
                const loadTime = timing.loadEventEnd - timing.navigationStart;
                console.log(`Page load time: ${loadTime}ms`);
            }, 0);
        });
        
        // Monitor long tasks
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.duration > 50) {
                            console.warn('Long task detected:', entry.duration + 'ms');
                        }
                    }
                });
                observer.observe({ entryTypes: ['longtask'] });
            } catch (e) {
                // Long task observer not supported
            }
        }
    }
};

// Initialize performance monitoring
PerformanceMonitor.init();