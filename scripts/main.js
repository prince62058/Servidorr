// Main JavaScript functionality for Servidorr service booking website
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all components
    initializeNavigation();
    initializeHero();
    initializeServiceFiltering();
    initializeCountdownTimer();
    initializeBookingForm();
    initializeContactForm();
    initializeBackToTop();
    initializeLoadingScreen();
    initializeParallax();
    initializeServiceTabs();
    initializeSmoothScrolling();
    
    // Navigation functionality
    function initializeNavigation() {
        const navbar = document.getElementById('mainNav');
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Handle navbar scroll effect
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
        
        // Handle active nav link
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        smoothScrollTo(targetElement);
                    }
                }
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
        // Handle mobile menu toggle
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        if (navbarToggler) {
            navbarToggler.addEventListener('click', function() {
                navbarCollapse.classList.toggle('show');
            });
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navbar.contains(e.target) && navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
            }
        });
    }
    
    // Hero section functionality
    function initializeHero() {
        // Initialize hero video
        const heroVideo = document.getElementById('heroVideo');
        
        if (heroVideo) {
            // Debug function
            const updateDebugInfo = (message) => {
                console.log('Video Debug:', message);
            };
            
            // Set video properties explicitly
            heroVideo.muted = true;
            heroVideo.autoplay = true;
            heroVideo.loop = true;
            heroVideo.playsInline = true;
            heroVideo.controls = false;
            
            updateDebugInfo('Video initialized with properties');
            
            // Video event listeners
            heroVideo.addEventListener('loadstart', () => updateDebugInfo('Load started'));
            heroVideo.addEventListener('loadedmetadata', () => updateDebugInfo('Metadata loaded'));
            heroVideo.addEventListener('loadeddata', () => updateDebugInfo('Data loaded'));
            heroVideo.addEventListener('canplay', () => updateDebugInfo('Can play'));
            heroVideo.addEventListener('canplaythrough', () => updateDebugInfo('Can play through'));
            heroVideo.addEventListener('playing', () => updateDebugInfo('Playing'));
            heroVideo.addEventListener('pause', () => updateDebugInfo('Paused'));
            heroVideo.addEventListener('ended', () => updateDebugInfo('Ended'));
            heroVideo.addEventListener('error', (e) => updateDebugInfo(`Error: ${e.message}`));
            
            // Force video to play
            const forcePlay = () => {
                updateDebugInfo('Attempting to play video');
                heroVideo.play()
                    .then(() => {
                        updateDebugInfo('Video playing successfully!');
                    })
                    .catch((error) => {
                        updateDebugInfo(`Play failed: ${error.message}`);
                        // Try again on user interaction
                        const playOnInteraction = () => {
                            heroVideo.play().then(() => {
                                updateDebugInfo('Play successful after user interaction');
                            });
                        };
                        document.addEventListener('click', playOnInteraction, { once: true });
                        document.addEventListener('touchstart', playOnInteraction, { once: true });
                    });
            };
            
            // Try to play when ready
            if (heroVideo.readyState >= 3) {
                forcePlay();
            } else {
                heroVideo.addEventListener('canplay', forcePlay, { once: true });
            }
            
            // Fallback: Force load and play
            setTimeout(() => {
                if (heroVideo.paused) {
                    updateDebugInfo('Video still paused, forcing load and play');
                    heroVideo.load();
                    setTimeout(forcePlay, 500);
                }
            }, 2000);
        }
        
        const heroScrollIndicator = document.querySelector('.hero-scroll-indicator');
        
        if (heroScrollIndicator) {
            heroScrollIndicator.addEventListener('click', function() {
                const servicesSection = document.getElementById('services');
                if (servicesSection) {
                    smoothScrollTo(servicesSection);
                }
            });
        }
        
        // Parallax effect for hero background
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const heroSection = document.querySelector('.hero-section');
            const heroImage = document.querySelector('.hero-bg-image');
            
            if (heroSection && heroImage) {
                const rate = scrolled * -0.5;
                heroImage.style.transform = `translateY(${rate}px)`;
            }
        });
    }
    
    // Service filtering functionality
    function initializeServiceFiltering() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const serviceItems = document.querySelectorAll('.service-item');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter services
                serviceItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        item.style.display = 'block';
                        item.style.opacity = '0';
                        
                        setTimeout(() => {
                            item.style.opacity = '1';
                        }, 100);
                    } else {
                        item.style.opacity = '0';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    // Countdown timer functionality
    function initializeCountdownTimer() {
        const countdownElement = document.getElementById('countdownTimer');
        
        if (!countdownElement) return;
        
        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        
        // Set target date (30 days from now)
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 30);
        
        function updateCountdown() {
            const now = new Date().getTime();
            const target = targetDate.getTime();
            const difference = target - now;
            
            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);
                
                if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
                if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
                if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
                if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
            } else {
                // Timer expired
                if (daysElement) daysElement.textContent = '00';
                if (hoursElement) hoursElement.textContent = '00';
                if (minutesElement) minutesElement.textContent = '00';
                if (secondsElement) secondsElement.textContent = '00';
                
                clearInterval(countdownInterval);
            }
        }
        
        // Update countdown immediately and then every second
        updateCountdown();
        const countdownInterval = setInterval(updateCountdown, 1000);
    }
    
    // Booking form functionality
    function initializeBookingForm() {
        const bookingForm = document.getElementById('bookingForm');
        const serviceCategorySelect = document.getElementById('service-category');
        const serviceTypeSelect = document.getElementById('service-type');
        const bookingDateInput = document.getElementById('booking-date');
        
        if (!bookingForm) return;
        
        // Service options mapping
        const serviceOptions = {
            'plumbing': [
                { value: 'faucet-repair', text: 'Faucet Repair' },
                { value: 'pipe-installation', text: 'Pipe Installation' },
                { value: 'water-heater', text: 'Water Heater Service' },
                { value: 'drain-cleaning', text: 'Drain Cleaning' }
            ],
            'electrical': [
                { value: 'fan-installation', text: 'Fan Installation' },
                { value: 'wiring', text: 'Electrical Wiring' },
                { value: 'switchboard', text: 'Switchboard Repair' },
                { value: 'lighting', text: 'Light Fixture Installation' }
            ],
            'cleaning': [
                { value: 'home-cleaning', text: 'Full Home Cleaning' },
                { value: 'deep-cleaning', text: 'Deep Cleaning' },
                { value: 'bathroom-cleaning', text: 'Bathroom Cleaning' },
                { value: 'kitchen-cleaning', text: 'Kitchen Cleaning' }
            ],
            'beauty': [
                { value: 'haircut', text: 'Haircut & Styling' },
                { value: 'facial', text: 'Facial Treatment' },
                { value: 'massage', text: 'Massage Therapy' },
                { value: 'manicure', text: 'Manicure & Pedicure' }
            ],
            'carpentry': [
                { value: 'furniture-repair', text: 'Furniture Repair' },
                { value: 'custom-furniture', text: 'Custom Furniture' },
                { value: 'cabinet-installation', text: 'Cabinet Installation' },
                { value: 'door-repair', text: 'Door Repair' }
            ],
            'pest': [
                { value: 'cockroach-control', text: 'Cockroach Control' },
                { value: 'termite-control', text: 'Termite Control' },
                { value: 'rodent-control', text: 'Rodent Control' },
                { value: 'general-pest', text: 'General Pest Control' }
            ]
        };
        
        // Update service type options based on category
        serviceCategorySelect.addEventListener('change', function() {
            const selectedCategory = this.value;
            serviceTypeSelect.innerHTML = '<option value="">Select specific service</option>';
            
            if (selectedCategory && serviceOptions[selectedCategory]) {
                serviceOptions[selectedCategory].forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option.value;
                    optionElement.textContent = option.text;
                    serviceTypeSelect.appendChild(optionElement);
                });
            }
        });
        
        // Set minimum date to today
        if (bookingDateInput) {
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];
            bookingDateInput.min = formattedDate;
        }
        
        // Handle form submission
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const bookingData = Object.fromEntries(formData);
            
            // Validate form
            if (validateBookingForm(bookingData)) {
                // Show loading state
                const submitButton = this.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Booking...';
                submitButton.disabled = true;
                
                // Simulate booking process
                setTimeout(() => {
                    showNotification('Booking confirmed! We will contact you shortly.', 'success');
                    bookingForm.reset();
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, 2000);
            }
        });
        
        function validateBookingForm(data) {
            const requiredFields = ['service-category', 'service-type', 'booking-date', 'booking-time', 'customer-name', 'customer-phone', 'customer-address'];
            let isValid = true;
            
            requiredFields.forEach(field => {
                const value = data[field];
                if (!value || value.trim() === '') {
                    showFieldError(field, 'This field is required');
                    isValid = false;
                } else {
                    clearFieldError(field);
                }
            });
            
            // Validate phone number
            const phone = data['customer-phone'];
            if (phone && !isValidPhone(phone)) {
                showFieldError('customer-phone', 'Please enter a valid phone number');
                isValid = false;
            }
            
            // Validate date
            const selectedDate = new Date(data['booking-date']);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                showFieldError('booking-date', 'Please select a future date');
                isValid = false;
            }
            
            return isValid;
        }
        
        function isValidPhone(phone) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            return phoneRegex.test(phone.replace(/\s/g, ''));
        }
        
        function showFieldError(fieldName, message) {
            const field = document.getElementById(fieldName);
            if (field) {
                field.classList.add('is-invalid');
                
                let errorElement = field.parentNode.querySelector('.invalid-feedback');
                if (!errorElement) {
                    errorElement = document.createElement('div');
                    errorElement.className = 'invalid-feedback';
                    field.parentNode.appendChild(errorElement);
                }
                errorElement.textContent = message;
            }
        }
        
        function clearFieldError(fieldName) {
            const field = document.getElementById(fieldName);
            if (field) {
                field.classList.remove('is-invalid');
                const errorElement = field.parentNode.querySelector('.invalid-feedback');
                if (errorElement) {
                    errorElement.remove();
                }
            }
        }
    }
    
    // Contact form functionality
    function initializeContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const contactData = Object.fromEntries(formData);
            
            // Validate form
            if (validateContactForm(contactData)) {
                // Show loading state
                const submitButton = this.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;
                
                // Simulate sending message
                setTimeout(() => {
                    showNotification('Message sent successfully! We will get back to you soon.', 'success');
                    contactForm.reset();
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, 2000);
            }
        });
        
        function validateContactForm(data) {
            let isValid = true;
            
            // Validate name
            if (!data.name || data.name.trim() === '') {
                showNotification('Please enter your name', 'error');
                isValid = false;
            }
            
            // Validate email
            if (!data.email || !isValidEmail(data.email)) {
                showNotification('Please enter a valid email address', 'error');
                isValid = false;
            }
            
            // Validate subject
            if (!data.subject || data.subject.trim() === '') {
                showNotification('Please enter a subject', 'error');
                isValid = false;
            }
            
            // Validate message
            if (!data.message || data.message.trim() === '') {
                showNotification('Please enter your message', 'error');
                isValid = false;
            }
            
            return isValid;
        }
        
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
    }
    
    // Back to top functionality
    function initializeBackToTop() {
        const backToTopButton = document.getElementById('backToTop');
        
        if (!backToTopButton) return;
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
        
        backToTopButton.addEventListener('click', function() {
            smoothScrollTo(document.body, 0);
        });
    }
    
    // Loading screen functionality
    function initializeLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        
        if (!loadingScreen) return;
        
        // Show loading screen for minimum 1 second for better UX
        let pageLoaded = false;
        let minTimeElapsed = false;
        
        // Mark page as loaded
        window.addEventListener('load', function() {
            pageLoaded = true;
            hideLoadingScreenIfReady();
        });
        
        // Ensure loading screen shows for at least 1 second
        setTimeout(() => {
            minTimeElapsed = true;
            hideLoadingScreenIfReady();
        }, 1000);
        
        function hideLoadingScreenIfReady() {
            if (pageLoaded && minTimeElapsed) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 300);
            }
        }
        
        // Fallback: hide loading screen after maximum 2 seconds regardless
        setTimeout(() => {
            if (loadingScreen.style.display !== 'none') {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 300);
            }
        }, 2000);
    }
    
    // Parallax effect functionality
    function initializeParallax() {
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        if (parallaxElements.length === 0) return;
        
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
    
    // Service tabs functionality
    function initializeServiceTabs() {
        const tabButtons = document.querySelectorAll('.service-tabs .nav-link');
        const tabContents = document.querySelectorAll('.tab-pane');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetTab = this.getAttribute('href');
                
                // Update active button
                tabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Update active content
                tabContents.forEach(content => {
                    content.classList.remove('show', 'active');
                });
                
                const targetContent = document.querySelector(targetTab);
                if (targetContent) {
                    targetContent.classList.add('show', 'active');
                }
            });
        });
    }
    
    // Smooth scrolling functionality
    function initializeSmoothScrolling() {
        const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
        
        smoothScrollLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    smoothScrollTo(targetElement);
                }
            });
        });
    }
    
    // Utility functions
    function smoothScrollTo(element, position = null) {
        if (position !== null) {
            window.scrollTo({
                top: position,
                behavior: 'smooth'
            });
        } else {
            const offsetTop = element.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
    
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
            word-wrap: break-word;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Handle close button
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', function() {
            closeNotification(notification);
        });
        
        // Auto close after 5 seconds
        setTimeout(() => {
            closeNotification(notification);
        }, 5000);
        
        function closeNotification(notificationElement) {
            notificationElement.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notificationElement.parentNode) {
                    notificationElement.parentNode.removeChild(notificationElement);
                }
            }, 300);
        }
    }
    
    // Search functionality (if needed)
    function initializeSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');
        
        if (!searchInput) return;
        
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            
            clearTimeout(searchTimeout);
            
            if (query.length > 2) {
                searchTimeout = setTimeout(() => {
                    performSearch(query);
                }, 300);
            } else {
                hideSearchResults();
            }
        });
        
        function performSearch(query) {
            // Simple search implementation
            const services = document.querySelectorAll('.service-card');
            const results = [];
            
            services.forEach(service => {
                const title = service.querySelector('.service-title').textContent.toLowerCase();
                const description = service.querySelector('.service-description').textContent.toLowerCase();
                
                if (title.includes(query.toLowerCase()) || description.includes(query.toLowerCase())) {
                    results.push({
                        title: service.querySelector('.service-title').textContent,
                        description: service.querySelector('.service-description').textContent,
                        element: service
                    });
                }
            });
            
            displaySearchResults(results);
        }
        
        function displaySearchResults(results) {
            if (!searchResults) return;
            
            searchResults.innerHTML = '';
            
            if (results.length === 0) {
                searchResults.innerHTML = '<div class="search-no-results">No services found</div>';
            } else {
                results.forEach(result => {
                    const resultElement = document.createElement('div');
                    resultElement.className = 'search-result-item';
                    resultElement.innerHTML = `
                        <h6>${result.title}</h6>
                        <p>${result.description}</p>
                    `;
                    
                    resultElement.addEventListener('click', function() {
                        result.element.scrollIntoView({ behavior: 'smooth' });
                        hideSearchResults();
                    });
                    
                    searchResults.appendChild(resultElement);
                });
            }
            
            searchResults.style.display = 'block';
        }
        
        function hideSearchResults() {
            if (searchResults) {
                searchResults.style.display = 'none';
            }
        }
        
        // Hide search results when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                hideSearchResults();
            }
        });
    }
    
    // Initialize search if search input exists
    initializeSearch();
    
    // Handle service card clicks
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', function() {
            const serviceTitle = this.querySelector('.service-title').textContent;
            const bookingSection = document.getElementById('booking');
            
            if (bookingSection) {
                smoothScrollTo(bookingSection);
                
                // Pre-fill service category if possible
                setTimeout(() => {
                    const serviceCategorySelect = document.getElementById('service-category');
                    if (serviceCategorySelect) {
                        // Try to match service title to category
                        const titleLower = serviceTitle.toLowerCase();
                        if (titleLower.includes('plumb')) {
                            serviceCategorySelect.value = 'plumbing';
                        } else if (titleLower.includes('electric')) {
                            serviceCategorySelect.value = 'electrical';
                        }
                    }
                }, 100);
            }
        });
    });
    
    // User session management
    function checkUserSession() {
        const userSession = localStorage.getItem('userSession') || sessionStorage.getItem('userSession');
        
        if (userSession) {
            try {
                const sessionData = JSON.parse(userSession);
                updateNavigationForLoggedInUser(sessionData.user);
            } catch (error) {
                console.error('Error parsing user session:', error);
                // Clear invalid session
                localStorage.removeItem('userSession');
                sessionStorage.removeItem('userSession');
            }
        }
    }
    
    // Update navigation for logged in user
    function updateNavigationForLoggedInUser(user) {
        const loginNavItem = document.getElementById('loginNavItem');
        const userProfileNavItem = document.getElementById('userProfileNavItem');
        const userNameDisplay = document.getElementById('userNameDisplay');
        
        if (loginNavItem && userProfileNavItem) {
            loginNavItem.style.display = 'none';
            userProfileNavItem.style.display = 'block';
            
            if (userNameDisplay) {
                userNameDisplay.textContent = user.name || 'Profile';
            }
        }
    }
    
    // Global logout function
    window.logout = function() {
        localStorage.removeItem('userSession');
        sessionStorage.removeItem('userSession');
        
        // Reset navigation
        const loginNavItem = document.getElementById('loginNavItem');
        const userProfileNavItem = document.getElementById('userProfileNavItem');
        
        if (loginNavItem && userProfileNavItem) {
            loginNavItem.style.display = 'block';
            userProfileNavItem.style.display = 'none';
        }
        
        // Show logout notification
        showNotification('Logged out successfully', 'success');
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
    };
    
    // Initialize user session check
    checkUserSession();
    
    // Performance optimization: throttle scroll events
    function throttle(func, limit) {
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
    }
    
    // Apply throttling to scroll events
    const throttledScrollHandler = throttle(function() {
        // Any scroll-intensive operations can be handled here
    }, 100);
    
    window.addEventListener('scroll', throttledScrollHandler);
    
    // Lazy loading for images
    function initializeLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            });
        }
    }
    
    // Initialize lazy loading
    initializeLazyLoading();
    
    // Handle keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Close modals/dropdowns with Escape key
        if (e.key === 'Escape') {
            const navbarCollapse = document.querySelector('.navbar-collapse.show');
            if (navbarCollapse) {
                navbarCollapse.classList.remove('show');
            }
        }
        
        // Navigate with arrow keys in service grid
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            const focusedElement = document.activeElement;
            if (focusedElement.classList.contains('service-card')) {
                e.preventDefault();
                const serviceCards = Array.from(document.querySelectorAll('.service-card'));
                const currentIndex = serviceCards.indexOf(focusedElement);
                
                if (e.key === 'ArrowRight' && currentIndex < serviceCards.length - 1) {
                    serviceCards[currentIndex + 1].focus();
                } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
                    serviceCards[currentIndex - 1].focus();
                }
            }
        }
    });
    
    // Make service cards focusable for keyboard navigation
    document.querySelectorAll('.service-card').forEach(card => {
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    console.log('Servidorr website initialized successfully!');
});
