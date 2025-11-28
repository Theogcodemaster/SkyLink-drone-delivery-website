/**
 * InnovateTech Website - Main JavaScript
 * Interactive Features: Scroll Animations, Modal System, Tabs, Accordions
 */

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initScrollAnimations();
    initModals();
    initTabs();
    initAccordions();
    initSmoothScroll();
    initImageLazyLoading();
    initScrollProgress();
    initScrollToTop();
    initTypingEffect(); // Call the new typing effect initialization
});

// ==========================================
// MOBILE MENU
// ==========================================

function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            const isOpen = mobileMenu.classList.contains('active');

            if (isOpen) {
                mobileMenu.classList.remove('active');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            } else {
                mobileMenu.classList.add('active');
                mobileMenuButton.setAttribute('aria-expanded', 'true');
            }
        });

        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

// ==========================================
// SCROLL ANIMATIONS (INTERSECTION OBSERVER)
// ==========================================

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in-up');

    // Create intersection observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animated elements
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// ==========================================
// MODAL SYSTEM
// ==========================================

// Global functions for modal control
window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling

        // Set focus to modal for accessibility
        modal.focus();

        // Trap focus within modal
        trapFocus(modal);
    }
};

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
    }
};

function initModals() {
    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal:not(.hidden)');
            openModals.forEach(modal => {
                closeModal(modal.id);
            });
        }
    });

    // Prevent modal content clicks from closing the modal
    const modalContents = document.querySelectorAll('.modal-content');
    modalContents.forEach(content => {
        content.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
}

// Trap focus within modal for accessibility
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function(e) {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    });
}

// ==========================================
// TAB SYSTEM
// ==========================================

function initTabs() {
    const tabContainers = document.querySelectorAll('[data-tabs]');

    tabContainers.forEach(container => {
        const buttons = container.querySelectorAll('[data-tab-button]');
        const contents = container.querySelectorAll('[data-tab-content]');

        buttons.forEach(button => {
            button.addEventListener('click', function() {
                const targetId = this.getAttribute('data-tab-button');

                // Remove active class from all buttons and contents
                buttons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                contents.forEach(content => {
                    content.classList.add('hidden');
                    content.classList.remove('tab-content');
                });

                // Add active class to clicked button and corresponding content
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');

                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.classList.remove('hidden');
                    targetContent.classList.add('tab-content');
                }
            });
        });

        // Activate first tab by default if none is active
        if (buttons.length > 0 && !container.querySelector('.active')) {
            buttons[0].click();
        }
    });
}

// ==========================================
// ACCORDION SYSTEM
// ==========================================

function initAccordions() {
    const accordionButtons = document.querySelectorAll('[data-accordion-button]');

    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-accordion-button');
            const content = document.getElementById(targetId);
            const isActive = this.classList.contains('active');

            // Close all other accordions in the same group (optional)
            const parentAccordion = this.closest('[data-accordion-group]');
            if (parentAccordion) {
                const allButtons = parentAccordion.querySelectorAll('[data-accordion-button]');
                const allContents = parentAccordion.querySelectorAll('[data-accordion-content]');

                allButtons.forEach(btn => {
                    if (btn !== this) {
                        btn.classList.remove('active');
                        btn.setAttribute('aria-expanded', 'false');
                    }
                });

                allContents.forEach(cnt => {
                    if (cnt !== content) {
                        cnt.classList.remove('active');
                    }
                });
            }

            // Toggle current accordion
            if (isActive) {
                this.classList.remove('active');
                this.setAttribute('aria-expanded', 'false');
                content.classList.remove('active');
            } else {
                this.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
                content.classList.add('active');
            }
        });
    });
}

// ==========================================
// SMOOTH SCROLL
// ==========================================

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#"
            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80; // Account for fixed header

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Update URL without jumping
                history.pushState(null, null, href);
            }
        });
    });
}

// ==========================================
// IMAGE LAZY LOADING ENHANCEMENT
// ==========================================

function initImageLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    images.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });

        // If image is already loaded (cached)
        if (img.complete) {
            img.classList.add('loaded');
        }
    });
}

// ==========================================
// SCROLL PROGRESS BAR
// ==========================================

function initScrollProgress() {
    // Create progress bar element
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.style.width = '0%';
    document.body.appendChild(progressBar);

    // Update progress on scroll
    window.addEventListener('scroll', function() {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// ==========================================
// SCROLL TO TOP
// ==========================================

function initScrollToTop() {
    // Create button element
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = `
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
    `;
    scrollToTopBtn.className = 'fixed bottom-8 right-8 bg-primary text-white p-3 rounded-full shadow-lg cursor-pointer transition-all duration-300 transform translate-y-20 opacity-0 z-50 hover:bg-primary/90 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollToTopBtn);

    // Show/hide button on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.remove('translate-y-20', 'opacity-0');
        } else {
            scrollToTopBtn.classList.add('translate-y-20', 'opacity-0');
        }
    });

    // Scroll to top on click
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==========================================
// TYPING EFFECT
// ==========================================

function initTypingEffect() {
    const typedTextSpan = document.getElementById('typed-text');
    if (!typedTextSpan) return; // Exit if element not found (e.g., on other pages)

    const fullText = typedTextSpan.textContent;
    let charIndex = 0;
    const typingDelay = 100; // milliseconds per character

    // Clear content and remove hidden class
    typedTextSpan.textContent = '';
    typedTextSpan.classList.remove('hidden');

    function type() {
        if (charIndex < fullText.length) {
            typedTextSpan.textContent += fullText.charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        }
    }

    type(); // Start the typing effect
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Debounce function to limit function calls
 */
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

/**
 * Throttle function to limit function calls
 */
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

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Get cookie value by name
 */
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

/**
 * Set cookie
 */
function setCookie(name, value, days) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value || ''}${expires}; path=/`;
}

// ==========================================
// EXPORT FOR USE IN OTHER FILES
// ==========================================

window.InnovateTech = {
    openModal,
    closeModal,
    debounce,
    throttle,
    isInViewport,
    getCookie,
    setCookie,
    initScrollToTop,
    initTypingEffect // Export the new typing effect function
};

