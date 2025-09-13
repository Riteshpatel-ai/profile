/**
 * Modern Portfolio JavaScript
 * Author: Ritesh Patel
 * Description: Enhanced interactive functionality for software engineer portfolio
 */

// =================================
// CONFIGURATION & CONSTANTS
// =================================

const CONFIG = {
    // Typing animation configuration
    typing: {
        texts: [
            'Software Engineer',
            'Java Full Stack Developer',
            'Spring Boot Specialist',
            'DevOps Engineer',
            'Cloud Solutions Architect',
            'AI/ML Enthusiast',
            'Problem Solver'
        ],
        typeSpeed: 100,
        deleteSpeed: 50,
        delayBetweenTexts: 2000
    },

    // Loader configuration
    loader: {
        minDisplayTime: 1500,
        maxDisplayTime: 3000
    },

    // Scroll configuration
    scroll: {
        offset: 100,
        smoothBehavior: true
    },

    // Animation configuration
    animations: {
        duration: 800,
        once: true,
        offset: 100,
        easing: 'ease-out-cubic'
    },

    // Particles configuration
    particles: {
        number: { value: 80 },
        color: { value: '#64ffda' },
        shape: { type: 'circle' },
        opacity: {
            value: 0.5,
            random: true,
            animation: { enable: true, speed: 1, minimumValue: 0.1 }
        },
        size: {
            value: 3,
            random: true,
            animation: { enable: true, speed: 40, minimumValue: 0.1 }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#64ffda',
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false
        }
    }
};

// =================================
// UTILITY FUNCTIONS
// =================================

const utils = {
    // Debounce function for performance optimization
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Get element with error handling
    getElement: (selector) => {
        const element = document.querySelector(selector);
        if (!element) {
            console.warn(`Element not found: ${selector}`);
        }
        return element;
    },

    // Get elements with error handling
    getElements: (selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
            console.warn(`No elements found: ${selector}`);
        }
        return elements;
    },

    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Smooth scroll to element
    scrollToElement: (element, offset = 0) => {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
};

// =================================
// CORE COMPONENTS
// =================================

class PortfolioManager {
    constructor() {
        this.isLoaded = false;
        this.components = {};
        this.init();
    }

    async init() {
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // Initialize components in order
            this.initializeComponents();
            
            // Mark as loaded
            this.isLoaded = true;
            
            console.log('Portfolio initialized successfully');
        } catch (error) {
            console.error('Failed to initialize portfolio:', error);
        }
    }

    initializeComponents() {
        // Initialize loader first
        this.components.loader = new LoaderManager();
        
        // Initialize other components
        this.components.cursor = new CursorManager();
        this.components.navigation = new NavigationManager();
        this.components.scroll = new ScrollManager();
        this.components.typing = new TypingAnimation();
        this.components.skills = new SkillsManager();
        this.components.contact = new ContactManager();
        this.components.particles = new ParticlesManager();
        
        // Initialize animations after a short delay
        setTimeout(() => {
            this.components.animations = new AnimationManager();
        }, 500);
    }

    // Method to refresh all components
    refresh() {
        Object.values(this.components).forEach(component => {
            if (component.refresh && typeof component.refresh === 'function') {
                component.refresh();
            }
        });
    }
}

// =================================
// LOADER MANAGER
// =================================

class LoaderManager {
    constructor() {
        this.loader = utils.getElement('#loader');
        this.progress = utils.getElement('.loader-progress');
        this.isHidden = false;
        
        if (this.loader) {
            this.init();
        }
    }

    init() {
        // Animate progress bar
        this.animateProgress();
        
        // Hide loader after minimum time
        setTimeout(() => {
            this.hideLoader();
        }, CONFIG.loader.minDisplayTime);
        
        // Fallback hide after maximum time
        setTimeout(() => {
            if (!this.isHidden) {
                this.hideLoader();
            }
        }, CONFIG.loader.maxDisplayTime);
    }

    animateProgress() {
        if (!this.progress) return;
        
        let width = 0;
        const interval = setInterval(() => {
            if (width >= 100) {
                clearInterval(interval);
                return;
            }
            
            width += Math.random() * 30;
            if (width > 100) width = 100;
            
            this.progress.style.width = width + '%';
        }, 200);
    }

    hideLoader() {
        if (this.isHidden || !this.loader) return;
        
        this.isHidden = true;
        this.loader.classList.add('hide');
        
        // Remove from DOM after animation
        setTimeout(() => {
            if (this.loader.parentNode) {
                this.loader.remove();
            }
            
            // Enable body scroll
            document.body.style.overflow = '';
            
            // Trigger custom event
            document.dispatchEvent(new CustomEvent('loaderHidden'));
        }, 500);
    }
}

// =================================
// CURSOR MANAGER
// =================================

class CursorManager {
    constructor() {
        this.cursor = utils.getElement('#cursor');
        this.follower = utils.getElement('#cursor-follower');
        this.isTouch = 'ontouchstart' in window;
        
        if (!this.isTouch && this.cursor && this.follower) {
            this.init();
        }
    }

    init() {
        // Mouse move handler
        this.handleMouseMove = utils.throttle((e) => {
            const { clientX: x, clientY: y } = e;
            
            // Update cursor position immediately
            this.cursor.style.left = x + 'px';
            this.cursor.style.top = y + 'px';
            
            // Update follower with slight delay
            requestAnimationFrame(() => {
                this.follower.style.left = x + 'px';
                this.follower.style.top = y + 'px';
            });
        }, 10);

        // Add event listeners
        document.addEventListener('mousemove', this.handleMouseMove);
        
        // Handle hover effects
        this.setupHoverEffects();
    }

    setupHoverEffects() {
        const hoverElements = utils.getElements('a, button, .btn, .project-card, .skill-tag');
        
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.cursor?.classList.add('hover');
                this.follower?.classList.add('hover');
            });
            
            element.addEventListener('mouseleave', () => {
                this.cursor?.classList.remove('hover');
                this.follower?.classList.remove('hover');
            });
        });
    }
}

// =================================
// NAVIGATION MANAGER
// =================================

class NavigationManager {
    constructor() {
        this.navbar = utils.getElement('#navbar');
        this.hamburger = utils.getElement('#hamburger');
        this.navMenu = utils.getElement('#nav-menu');
        this.navLinks = utils.getElements('.nav-link');
        
        this.init();
    }

    init() {
        // Setup scroll behavior
        this.setupScrollBehavior();
        
        // Setup mobile menu
        this.setupMobileMenu();
        
        // Setup smooth scrolling
        this.setupSmoothScrolling();
        
        // Setup active link tracking
        this.setupActiveLinkTracking();
    }

    setupScrollBehavior() {
        const handleScroll = utils.throttle(() => {
            if (!this.navbar) return;
            
            if (window.scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        }, 10);

        window.addEventListener('scroll', handleScroll);
    }

    setupMobileMenu() {
        if (!this.hamburger || !this.navMenu) return;

        this.hamburger.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#navbar')) {
                this.closeMobileMenu();
            }
        });

        // Close menu when pressing escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        this.hamburger?.classList.toggle('active');
        this.navMenu?.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (this.navMenu?.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    closeMobileMenu() {
        this.hamburger?.classList.remove('active');
        this.navMenu?.classList.remove('active');
        document.body.style.overflow = '';
    }

    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            if (href && href.startsWith('#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    const target = utils.getElement(href);
                    if (target) {
                        utils.scrollToElement(target, CONFIG.scroll.offset);
                        this.closeMobileMenu();
                    }
                });
            }
        });
    }

    setupActiveLinkTracking() {
        const sections = utils.getElements('section[id]');
        
        const updateActiveLink = utils.throttle(() => {
            let current = '';
            
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= CONFIG.scroll.offset && rect.bottom >= CONFIG.scroll.offset) {
                    current = section.getAttribute('id');
                }
            });

            this.navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }, 100);

        window.addEventListener('scroll', updateActiveLink);
    }
}

// =================================
// SCROLL MANAGER
// =================================

class ScrollManager {
    constructor() {
        this.progressBar = utils.getElement('#scroll-progress');
        this.init();
    }

    init() {
        this.setupScrollProgress();
        this.setupScrollToTop();
    }

    setupScrollProgress() {
        if (!this.progressBar) return;

        const updateProgress = utils.throttle(() => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = scrollTop / docHeight;
            
            this.progressBar.style.transform = `scaleX(${scrollPercent})`;
        }, 10);

        window.addEventListener('scroll', updateProgress);
    }

    setupScrollToTop() {
        // Add scroll to top functionality for logo clicks
        const logo = utils.getElement('.logo-link');
        if (logo) {
            logo.addEventListener('click', (e) => {
                if (window.location.hash === '' || window.location.hash === '#home') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        }
    }
}

// =================================
// TYPING ANIMATION
// =================================

class TypingAnimation {
    constructor() {
        this.element = utils.getElement('#typed-text');
        this.cursor = utils.getElement('.typing-cursor');
        
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.isTyping = false;
        
        if (this.element) {
            this.init();
        }
    }

    init() {
        // Start typing after a delay
        setTimeout(() => {
            this.startTyping();
        }, 1000);
    }

    startTyping() {
        this.isTyping = true;
        this.type();
    }

    type() {
        if (!this.isTyping) return;

        const currentText = CONFIG.typing.texts[this.textIndex];
        
        if (this.isDeleting) {
            // Deleting text
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
            
            if (this.charIndex === 0) {
                this.isDeleting = false;
                this.textIndex = (this.textIndex + 1) % CONFIG.typing.texts.length;
                setTimeout(() => this.type(), 500);
                return;
            }
            
            setTimeout(() => this.type(), CONFIG.typing.deleteSpeed);
        } else {
            // Typing text
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
            
            if (this.charIndex === currentText.length) {
                setTimeout(() => {
                    this.isDeleting = true;
                    this.type();
                }, CONFIG.typing.delayBetweenTexts);
                return;
            }
            
            setTimeout(() => this.type(), CONFIG.typing.typeSpeed);
        }
    }

    stop() {
        this.isTyping = false;
    }

    restart() {
        this.stop();
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        setTimeout(() => this.startTyping(), 500);
    }
}

// =================================
// SKILLS MANAGER
// =================================

class SkillsManager {
    constructor() {
        this.skillBars = utils.getElements('.skill-progress');
        this.hasAnimated = false;
        
        if (this.skillBars.length > 0) {
            this.init();
        }
    }

    init() {
        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.hasAnimated) {
                        this.animateSkills();
                        this.hasAnimated = true;
                    }
                });
            },
            { threshold: 0.5 }
        );

        // Observe skills section
        const skillsSection = utils.getElement('#skills');
        if (skillsSection) {
            observer.observe(skillsSection);
        }
    }

    animateSkills() {
        this.skillBars.forEach((bar, index) => {
            const width = bar.getAttribute('data-width') || '0';
            
            setTimeout(() => {
                bar.style.width = width + '%';
            }, index * 200);
        });
    }

    refresh() {
        this.hasAnimated = false;
    }
}

// =================================
// CONTACT MANAGER
// =================================

class ContactManager {
    constructor() {
        this.form = utils.getElement('#contactForm');
        this.submitBtn = utils.getElement('#submitBtn');
        this.messageElement = utils.getElement('#formMessage');
        this.charCountElement = utils.getElement('#charCount');
        this.messageTextarea = utils.getElement('#message');
        
        // EmailJS Configuration - Replace these with your actual EmailJS credentials
        // See EMAIL_SETUP_GUIDE.md for detailed setup instructions
        this.emailConfig = {
            publicKey: '50CiieQxzEkJn7-Nz',     // Get from EmailJS Account > General
            serviceId: 'service_802mujo',     // Get from EmailJS Email Services
            templateId: 'template_vioytzq'    // Get from EmailJS Email Templates
        };
        
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.initializeEmailJS();
        this.updateEmailNotice();
        this.setupFormValidation();
        this.setupCharacterCount();
        this.setupFormSubmission();
    }

    initializeEmailJS() {
        // Initialize EmailJS if available
        if (typeof emailjs !== 'undefined') {
            emailjs.init(this.emailConfig.publicKey);
        }
    }

    updateEmailNotice() {
        const emailNotice = utils.getElement('#emailNotice');
        if (emailNotice) {
            if (this.isEmailJSConfigured()) {
                // Hide the notice since EmailJS is properly configured
                emailNotice.classList.add('hidden');
            } else {
                emailNotice.classList.add('hidden');
            }
        }
    }

    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const isValid = field.checkValidity();
        
        if (!isValid) {
            field.classList.add('error');
            return false;
        }
        
        field.classList.remove('error');
        return true;
    }

    clearFieldError(field) {
        field.classList.remove('error');
    }

    setupCharacterCount() {
        if (!this.messageTextarea || !this.charCountElement) return;

        this.messageTextarea.addEventListener('input', () => {
            const length = this.messageTextarea.value.length;
            this.charCountElement.textContent = length;
            
            if (length > 500) {
                this.charCountElement.style.color = '#ef4444';
            } else {
                this.charCountElement.style.color = '';
            }
        });
    }

    setupFormSubmission() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSubmit();
        });
    }

    async handleSubmit() {
        // Validate all fields
        const inputs = this.form.querySelectorAll('input, select, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showMessage('Please correct the errors above.', 'error');
            return;
        }

        // Show loading state
        this.setLoadingState(true);

        try {
            // Get form data
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);
            
            // Send email using EmailJS if configured
            if (typeof emailjs !== 'undefined' && this.isEmailJSConfigured()) {
                await this.sendEmailViaEmailJS(data);
                this.showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
            } else {
                // EmailJS not configured - inform user
                console.log('EmailJS not configured. Form data:', data);
                await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
                this.showMessage('Thank you for your message! I will get back to you soon. You can also reach me directly at Ritesh9878patel@gmail.com', 'success');
            }
            
            this.form.reset();
            
            // Reset character count
            if (this.charCountElement) {
                this.charCountElement.textContent = '0';
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showMessage('Failed to send message. Please try again or contact me directly:\n📧 Ritesh9878patel@gmail.com\n📱 +91 9878124052\n💬 WhatsApp: wa.me/919878124052', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    isEmailJSConfigured() {
        return this.emailConfig.publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY' &&
               this.emailConfig.serviceId !== 'YOUR_EMAILJS_SERVICE_ID' &&
               this.emailConfig.templateId !== 'YOUR_EMAILJS_TEMPLATE_ID';
    }

    async sendEmailViaEmailJS(formData) {
        const templateParams = {
            user_name: `${formData.firstName} ${formData.lastName}`,
            user_email: formData.email,
            subject: formData.subject,
            message: formData.message,
            to_name: 'Ritesh Patel',
            reply_to: formData.email
        };

        const response = await emailjs.send(
            this.emailConfig.serviceId,
            this.emailConfig.templateId,
            templateParams
        );

        console.log('Email sent successfully:', response);
        return response;
    }

    setLoadingState(isLoading) {
        if (!this.submitBtn) return;

        if (isLoading) {
            this.submitBtn.classList.add('loading');
            this.submitBtn.disabled = true;
        } else {
            this.submitBtn.classList.remove('loading');
            this.submitBtn.disabled = false;
        }
    }

    showMessage(message, type) {
        if (!this.messageElement) return;

        this.messageElement.textContent = message;
        this.messageElement.className = `form-message ${type}`;
        this.messageElement.style.display = 'block';

        // Hide message after 5 seconds
        setTimeout(() => {
            this.messageElement.style.display = 'none';
        }, 5000);
    }
}

// =================================
// PARTICLES MANAGER
// =================================

class ParticlesManager {
    constructor() {
        this.container = utils.getElement('#particles-js');
        
        if (this.container && window.particlesJS) {
            this.init();
        }
    }

    init() {
        try {
            particlesJS('particles-js', {
                particles: CONFIG.particles,
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: { enable: true, mode: 'repulse' },
                        onclick: { enable: true, mode: 'push' },
                        resize: true
                    },
                    modes: {
                        repulse: { distance: 100, duration: 0.4 },
                        push: { particles_nb: 4 }
                    }
                },
                retina_detect: true
            });
        } catch (error) {
            console.error('Failed to initialize particles:', error);
        }
    }

    refresh() {
        if (window.pJSDom && window.pJSDom.length > 0) {
            window.pJSDom[0].pJS.fn.vendors.destroypJS();
            this.init();
        }
    }
}

// =================================
// ANIMATION MANAGER
// =================================

class AnimationManager {
    constructor() {
        this.hasAOS = typeof AOS !== 'undefined';
        
        if (this.hasAOS) {
            this.init();
        } else {
            this.initFallbackAnimations();
        }
    }

    init() {
        try {
            AOS.init(CONFIG.animations);
            
            // Custom refresh on specific events
            document.addEventListener('loaderHidden', () => {
                setTimeout(() => AOS.refresh(), 500);
            });
            
        } catch (error) {
            console.error('Failed to initialize AOS:', error);
            this.initFallbackAnimations();
        }
    }

    initFallbackAnimations() {
        // Simple fallback animations for browsers without AOS support
        const animatedElements = utils.getElements('[data-aos]');
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('aos-animate');
                    }
                });
            },
            { threshold: 0.1 }
        );

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    refresh() {
        if (this.hasAOS && typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }
}

// =================================
// PERFORMANCE MONITORING
// =================================

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            loadTime: 0,
            domContentLoaded: 0,
            firstPaint: 0,
            largestContentfulPaint: 0
        };
        
        this.init();
    }

    init() {
        // Monitor load events
        this.monitorLoadEvents();
        
        // Monitor Web Vitals if available
        this.monitorWebVitals();
        
        // Log performance metrics
        window.addEventListener('load', () => {
            setTimeout(() => this.logMetrics(), 1000);
        });
    }

    monitorLoadEvents() {
        // DOM Content Loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.metrics.domContentLoaded = performance.now();
        });

        // Window Load
        window.addEventListener('load', () => {
            this.metrics.loadTime = performance.now();
        });
    }

    monitorWebVitals() {
        // First Paint
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    list.getEntries().forEach((entry) => {
                        if (entry.name === 'first-paint') {
                            this.metrics.firstPaint = entry.startTime;
                        }
                    });
                });
                observer.observe({ entryTypes: ['paint'] });
            } catch (error) {
                console.warn('Performance observer not supported:', error);
            }
        }
    }

    logMetrics() {
        console.group('Portfolio Performance Metrics');
        console.log(`DOM Content Loaded: ${this.metrics.domContentLoaded.toFixed(2)}ms`);
        console.log(`Window Load: ${this.metrics.loadTime.toFixed(2)}ms`);
        if (this.metrics.firstPaint) {
            console.log(`First Paint: ${this.metrics.firstPaint.toFixed(2)}ms`);
        }
        console.groupEnd();
    }
}

// =================================
// ERROR HANDLING
// =================================

class ErrorHandler {
    constructor() {
        this.init();
    }

    init() {
        // Handle uncaught errors
        window.addEventListener('error', (event) => {
            this.logError('JavaScript Error', event.error);
        });

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.logError('Unhandled Promise Rejection', event.reason);
        });
    }

    logError(type, error) {
        console.error(`${type}:`, error);
        
        // In production, you might want to send errors to an error tracking service
        // this.sendToErrorTracking(type, error);
    }

    sendToErrorTracking(type, error) {
        // Implement error tracking service integration here
        // Example: Sentry, LogRocket, etc.
    }
}

// =================================
// INITIALIZATION
// =================================

// Initialize the portfolio when the script loads
const portfolio = new PortfolioManager();

// Initialize performance monitoring
const performanceMonitor = new PerformanceMonitor();

// Initialize error handling
const errorHandler = new ErrorHandler();

// Expose portfolio instance globally for debugging
if (typeof window !== 'undefined') {
    window.portfolio = portfolio;
}

// =================================
// SERVICE WORKER REGISTRATION
// =================================

// Register service worker for PWA capabilities (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// =================================
// EXPORT FOR MODULE SYSTEMS
// =================================

// Export for ES6 modules if supported
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PortfolioManager, CONFIG, utils };
}
