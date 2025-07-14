// Animation controller for Servidorr website
document.addEventListener('DOMContentLoaded', function() {

    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 400,
            easing: 'ease-out',
            once: true,
            mirror: false,
            offset: 80,
            delay: 0,
            anchorPlacement: 'top-bottom'
        });
    }

    // Initialize custom animations
    initializeScrollAnimations();
    initializeHoverEffects();
    initializeParallaxEffects();
    initializeMorphingShapes();
    initializeStaggerAnimations();
    initializeRevealAnimations();
    initializeFloatingElements();
    initializePageTransitions();
    initializeTextAnimations();
    initializeMouseParallax();
    initializeSpecificAnimations();
    initializeLoadingAnimations();
    initializeCardFlips();
    initializeSmoothTransitions();
    initializeScrollBasedAnimations();
    initializeCounterAnimations();

    // Scroll-triggered animations
    function initializeScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;

                    // Add animation class based on data attribute
                    if (element.dataset.animation) {
                        element.classList.add(element.dataset.animation);
                    }

                    // Trigger stagger animation for children
                    if (element.classList.contains('stagger-container')) {
                        triggerStaggerAnimation(element);
                    }

                    // Trigger counter animation
                    if (element.classList.contains('counter')) {
                        animateCounter(element);
                    }

                    // Trigger progress bar animation
                    if (element.classList.contains('progress-bar')) {
                        animateProgressBar(element);
                    }

                    observer.unobserve(element);
                }
            });
        }, observerOptions);

        // Observe elements with animation data attributes
        document.querySelectorAll('[data-animation]').forEach(el => {
            observer.observe(el);
        });

        // Observe specific animation elements
        document.querySelectorAll('.fade-in-observer, .slide-in-left-observer, .slide-in-right-observer, .scale-in-observer').forEach(el => {
            observer.observe(el);
        });

        // Observe stagger containers
        document.querySelectorAll('.stagger-container').forEach(el => {
            observer.observe(el);
        });

        // Observe counters
        document.querySelectorAll('.counter').forEach(el => {
            observer.observe(el);
        });

        // Observe progress bars
        document.querySelectorAll('.progress-bar').forEach(el => {
            observer.observe(el);
        });
    }

    // Hover effects
    function initializeHoverEffects() {
        // Service cards hover effects
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
                this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
                this.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';

                // Animate service icon
                const icon = this.querySelector('.service-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                    icon.style.transition = 'transform 0.2s ease-out';
                }

                // Animate service image
                const img = this.querySelector('.service-image img');
                if (img) {
                    img.style.transform = 'scale(1.08)';
                    img.style.transition = 'transform 0.2s ease-out';
                }
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
                this.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';

                const icon = this.querySelector('.service-icon');
                if (icon) {
                    icon.style.transform = '';
                    icon.style.transition = 'transform 0.2s ease-out';
                }

                const img = this.querySelector('.service-image img');
                if (img) {
                    img.style.transform = '';
                    img.style.transition = 'transform 0.2s ease-out';
                }
            });
        });

        // Button hover effects
        document.querySelectorAll('.btn-animate').forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
                this.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
            });

            button.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
                this.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
            });
        });

        // Floating card hover effects
        document.querySelectorAll('.floating-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.05)';
                this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
            });
        });

        // Feature item hover effects
        document.querySelectorAll('.feature-item').forEach(item => {
            item.addEventListener('mouseenter', function() {
                const icon = this.querySelector('.feature-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                    icon.style.background = 'linear-gradient(45deg, var(--primary-color), var(--primary-light))';
                }
            });

            item.addEventListener('mouseleave', function() {
                const icon = this.querySelector('.feature-icon');
                if (icon) {
                    icon.style.transform = '';
                    icon.style.background = '';
                }
            });
        });
    }

    // Parallax effects
    function initializeParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax-element');

        if (parallaxElements.length === 0) return;

        // Throttle scroll event for performance
        let ticking = false;

        function updateParallax() {
            const scrolled = window.pageYOffset;

            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.speed) || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });

            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestTick);

        // Hero section parallax
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            window.addEventListener('scroll', function() {
                const scrolled = window.pageYOffset;
                const parallax = scrolled * 0.5;

                heroSection.style.transform = `translateY(${parallax}px)`;
            });
        }
    }

    // Counter animations
    function animateCounter(element) {
        const target = parseInt(element.dataset.target) || parseInt(element.textContent);
        const duration = parseInt(element.dataset.duration) || 2000;
        const increment = target / (duration / 16);

        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    // Initialize counter animations
    function initializeCounterAnimations() {
        const counters = document.querySelectorAll('.counter, .stat-number');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    // Progress bar animations
    function animateProgressBar(element) {
        const target = parseInt(element.dataset.target) || 100;
        const duration = parseInt(element.dataset.duration) || 2000;

        element.style.width = '0%';

        setTimeout(() => {
            element.style.transition = `width ${duration}ms ease-in-out`;
            element.style.width = `${target}%`;
        }, 100);
    }

    // Morphing shapes
    function initializeMorphingShapes() {
        const morphShapes = document.querySelectorAll('.morph-shape');

        morphShapes.forEach(shape => {
            // Add CSS animation
            shape.style.animation = 'morph 8s ease-in-out infinite';
        });
    }

    // Stagger animations
    function initializeStaggerAnimations() {
        // This is handled by the intersection observer
    }

    function triggerStaggerAnimation(container) {
        const items = container.querySelectorAll('.stagger-item');

        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animate');
            }, index * 100);
        });
    }

    // Reveal animations
    function initializeRevealAnimations() {
        const revealElements = document.querySelectorAll('.reveal-mask');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        });

        revealElements.forEach(el => observer.observe(el));
    }

    // Floating elements
    function initializeFloatingElements() {
        const floatingElements = document.querySelectorAll('.floating-card');

        floatingElements.forEach((element, index) => {
            // Add different animation delays
            element.style.animationDelay = `${index * 0.5}s`;

            // Add random floating animation
            const randomDuration = 3 + Math.random() * 2;
            element.style.animationDuration = `${randomDuration}s`;
        });
    }

    // Page transitions
    function initializePageTransitions() {
        // Add fade-in animation to main sections
        const sections = document.querySelectorAll('section');

        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(50px)';
            section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        });

        // Animate sections on scroll
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    sectionObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(section => sectionObserver.observe(section));
    }

    // Text animations
    function initializeTextAnimations() {
        // Typing effect
        const typingElements = document.querySelectorAll('.text-typing');

        typingElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';

            let i = 0;
            const timer = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(timer);
                }
            }, 100);
        });
    }

    // Mouse movement parallax
    function initializeMouseParallax() {
        const parallaxElements = document.querySelectorAll('.mouse-parallax');

        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.speed) || 1;
                const x = (mouseX - window.innerWidth / 2) * speed;
                const y = (mouseY - window.innerHeight / 2) * speed;

                element.style.transform = `translateX(${x}px) translateY(${y}px)`;
            });
        });
    }

    // Scroll-triggered animations for specific elements
    function initializeSpecificAnimations() {
        // Animate hero title
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.style.opacity = '0';
            heroTitle.style.transform = 'translateY(50px)';

            setTimeout(() => {
                heroTitle.style.transition = 'opacity 1s ease, transform 1s ease';
                heroTitle.style.opacity = '1';
                heroTitle.style.transform = 'translateY(0)';
            }, 500);
        }

        // Animate hero subtitle
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) {
            heroSubtitle.style.opacity = '0';
            heroSubtitle.style.transform = 'translateY(50px)';

            setTimeout(() => {
                heroSubtitle.style.transition = 'opacity 1s ease, transform 1s ease';
                heroSubtitle.style.opacity = '1';
                heroSubtitle.style.transform = 'translateY(0)';
            }, 700);
        }

        // Animate hero buttons
        const heroButtons = document.querySelector('.hero-buttons');
        if (heroButtons) {
            heroButtons.style.opacity = '0';
            heroButtons.style.transform = 'translateY(50px)';

            setTimeout(() => {
                heroButtons.style.transition = 'opacity 1s ease, transform 1s ease';
                heroButtons.style.opacity = '1';
                heroButtons.style.transform = 'translateY(0)';
            }, 900);
        }

        // Animate hero stats
        const heroStats = document.querySelector('.hero-stats');
        if (heroStats) {
            heroStats.style.opacity = '0';
            heroStats.style.transform = 'translateY(50px)';

            setTimeout(() => {
                heroStats.style.transition = 'opacity 1s ease, transform 1s ease';
                heroStats.style.opacity = '1';
                heroStats.style.transform = 'translateY(0)';
            }, 1100);
        }
    }

    // Loading animations
    function initializeLoadingAnimations() {
        const loader = document.querySelector('.loading-screen');

        if (loader) {
            // Add pulse animation to loading spinner
            const spinner = loader.querySelector('.spinner');
            if (spinner) {
                spinner.style.animation = 'spin 1s linear infinite, pulse 2s ease-in-out infinite';
            }
        }
    }

    // Card flip animations
    function initializeCardFlips() {
        const flipCards = document.querySelectorAll('.card-flip');

        flipCards.forEach(card => {
            card.addEventListener('click', function() {
                this.classList.toggle('flipped');
            });
        });
    }

    // Smooth state transitions
    function initializeSmoothTransitions() {
        // Add smooth transitions to all interactive elements
        const interactiveElements = document.querySelectorAll('button, a, .service-card, .feature-item, .contact-item');

        interactiveElements.forEach(element => {
            element.style.transition = 'all 0.3s ease';
        });
    }

    // Scroll-based animations (duplicate removed in favor of the one below)

    // Initialize all remaining animations
    initializeTextAnimations();
    initializeMouseParallax();
    initializeSpecificAnimations();
    initializeLoadingAnimations();
    initializeCardFlips();
    initializeSmoothTransitions();
    initializeScrollBasedAnimations();

    // Initialize animation functions
    function initializeScrollBasedAnimations() {
        let lastScrollY = window.pageYOffset;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.pageYOffset;
            const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';

            // Navbar animation based on scroll direction
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                if (scrollDirection === 'down' && currentScrollY > 100) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
            }

            lastScrollY = currentScrollY;
        });
    }

    // Performance optimization
    function optimizeAnimations() {
        // Reduce animations on mobile devices
        if (window.innerWidth <= 768) {
            // Disable complex animations on mobile
            document.querySelectorAll('.floating-card').forEach(card => {
                card.style.animation = 'none';
            });

            // Reduce parallax effects
            document.querySelectorAll('.parallax-element').forEach(element => {
                element.style.transform = 'none';
            });
        }

        // Disable animations for users who prefer reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.querySelectorAll('*').forEach(element => {
                element.style.animation = 'none';
                element.style.transition = 'none';
            });
        }
    }

    // Initialize performance optimizations
    optimizeAnimations();

    // Re-optimize on window resize
    window.addEventListener('resize', optimizeAnimations);

    // Utility functions
    function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    function animateValue(element, start, end, duration, easing = easeInOutQuad) {
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easing(progress);

            const value = start + (end - start) * easedProgress;
            element.textContent = Math.round(value);

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // Custom animation functions
    function slideInFromLeft(element, duration = 400) {
        element.style.transform = 'translateX(-100%)';
        element.style.opacity = '0';
        element.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${duration}ms ease`;

        setTimeout(() => {
            element.style.transform = 'translateX(0)';
            element.style.opacity = '1';
        }, 50);
    }

    function slideInFromRight(element, duration = 400) {
        element.style.transform = 'translateX(100%)';
        element.style.opacity = '0';
        element.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${duration}ms ease`;

        setTimeout(() => {
            element.style.transform = 'translateX(0)';
            element.style.opacity = '1';
        }, 50);
    }

    function fadeInUp(element, duration = 400) {
        element.style.transform = 'translateY(30px)';
        element.style.opacity = '0';
        element.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${duration}ms ease`;

        setTimeout(() => {
            element.style.transform = 'translateY(0)';
            element.style.opacity = '1';
        }, 50);
    }

    function scaleIn(element, duration = 400) {
        element.style.transform = 'scale(0.9)';
        element.style.opacity = '0';
        element.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${duration}ms ease`;

        setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.opacity = '1';
        }, 50);
    }

    // Export animation functions for external use
    window.ServidorrAnimations = {
        slideInFromLeft,
        slideInFromRight,
        fadeInUp,
        scaleIn,
        animateValue,
        easeInOutQuad,
        easeInOutCubic
    };

    // Initialize counter animations
    initializeCounterAnimations();

    console.log('Servidorr animations initialized successfully!');
});

// Counter Animation Function
function initializeCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number, .timer-value');

    const animateCounter = (element) => {
        const target = parseInt(element.textContent.replace(/[^0-9]/g, '')) || 0;
        const duration = 1000; // 1 second
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            // Format the number based on original text
            const originalText = element.textContent;
            if (originalText.includes('K')) {
                element.textContent = Math.floor(current / 1000) + 'K+';
            } else if (originalText.includes('%')) {
                element.textContent = Math.floor(current) + '%';
            } else if (originalText.includes('/')) {
                element.textContent = Math.floor(current) + '/7';
            } else {
                element.textContent = Math.floor(current).toString().padStart(2, '0');
            }
        }, 16);
    };

    // Observe counters for animation
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            // For stagger animations
            if (entry.target.classList.contains('stagger-parent')) {
                const children = entry.target.querySelectorAll('.stagger-item');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate');
                    }, index * 50);
                });
            }
        }
    });
}, observerOptions);