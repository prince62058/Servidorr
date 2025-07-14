// Booking Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    let currentStep = 1;
    let selectedService = {
        id: 1,
        name: 'Leaky Faucet Repair',
        description: 'Fix minor leaks in faucets and pipes',
        price: 50,
        image: '../assets/faucet_images.png'
    };
    let selectedTimeSlot = null;
    let selectedDate = null;
    let selectedPaymentMethod = 'card';

    // Check if service is pre-selected from services page
    const preSelectedService = JSON.parse(localStorage.getItem('selectedService') || 'null');
    if (preSelectedService) {
        selectedService = preSelectedService;
        currentStep = 2; // Skip to date/time selection
        localStorage.removeItem('selectedService'); // Clear after use
        console.log('Pre-selected service loaded:', selectedService);
    } else {
        console.log('Using default service:', selectedService);
    }

    // Initialize booking form
    initializeBookingForm();
    initializeTimeSlots();
    initializeServiceModal();
    initializePaymentMethods();
    loadServices();
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('serviceDate').setAttribute('min', today);

    function initializeBookingForm() {
        // Update service display
        updateSelectedService();
        
        // Show correct step based on currentStep
        updateSteps();
        
        // Initialize payment interface
        updatePaymentInterface();
        
        // Form validation
        const form = document.getElementById('bookingForm');
        form.addEventListener('submit', handleFormSubmit);
        
        // Update button states
        updateButtonStates();
    }

    function initializeTimeSlots() {
        const timeSlots = document.querySelectorAll('.time-slot');
        timeSlots.forEach(slot => {
            slot.addEventListener('click', function() {
                // Remove selection from other slots
                timeSlots.forEach(s => s.classList.remove('selected'));
                
                // Select current slot
                this.classList.add('selected');
                selectedTimeSlot = this.dataset.time;
                
                // Update summary
                updateSummary();
            });
        });
    }

    function initializeServiceModal() {
        const modal = new bootstrap.Modal(document.getElementById('serviceModal'));
        window.openServiceModal = function() {
            modal.show();
        };
    }

    function initializePaymentMethods() {
        const paymentMethods = document.querySelectorAll('.payment-method');
        paymentMethods.forEach(method => {
            method.addEventListener('click', function() {
                // Remove active class from all methods
                paymentMethods.forEach(m => m.classList.remove('active'));
                
                // Add active class to selected method
                this.classList.add('active');
                selectedPaymentMethod = this.dataset.method;
                
                // Show/hide payment elements based on selection
                updatePaymentInterface();
            });
        });
    }

    function updatePaymentInterface() {
        const cardElement = document.getElementById('card-element');
        
        if (selectedPaymentMethod === 'upi') {
            cardElement.innerHTML = `
                <div class="upi-payment">
                    <div class="form-group mb-3">
                        <label for="upiId" class="form-label">UPI ID</label>
                        <input type="text" class="form-control" id="upiId" placeholder="example@paytm" required>
                        <div class="form-text">Enter your UPI ID (like PhonePe, GooglePay, Paytm)</div>
                    </div>
                    <div class="popular-upi-apps">
                        <h6>Popular UPI Apps</h6>
                        <div class="upi-apps">
                            <div class="upi-app" onclick="selectUPIApp('phonepe')">
                                <i class="fas fa-mobile-alt"></i>
                                <span>PhonePe</span>
                            </div>
                            <div class="upi-app" onclick="selectUPIApp('googlepay')">
                                <i class="fab fa-google-pay"></i>
                                <span>Google Pay</span>
                            </div>
                            <div class="upi-app" onclick="selectUPIApp('paytm')">
                                <i class="fas fa-wallet"></i>
                                <span>Paytm</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            cardElement.innerHTML = `
                <div class="card-payment">
                    <div class="form-group mb-3">
                        <label for="cardNumber" class="form-label">Card Number</label>
                        <input type="text" class="form-control" id="cardNumber" placeholder="1234 5678 9012 3456" required>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group mb-3">
                                <label for="expiryDate" class="form-label">Expiry Date</label>
                                <input type="text" class="form-control" id="expiryDate" placeholder="MM/YY" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group mb-3">
                                <label for="cvv" class="form-label">CVV</label>
                                <input type="text" class="form-control" id="cvv" placeholder="123" required>
                            </div>
                        </div>
                    </div>
                    <div class="form-group mb-3">
                        <label for="cardName" class="form-label">Cardholder Name</label>
                        <input type="text" class="form-control" id="cardName" placeholder="John Doe" required>
                    </div>
                </div>
            `;
        }
    }

    window.selectUPIApp = function(appName) {
        const upiId = document.getElementById('upiId');
        if (upiId) {
            switch(appName) {
                case 'phonepe':
                    upiId.placeholder = 'yourname@ybl';
                    break;
                case 'googlepay':
                    upiId.placeholder = 'yourname@okaxis';
                    break;
                case 'paytm':
                    upiId.placeholder = 'yourname@paytm';
                    break;
            }
            upiId.focus();
        }
    };

    function loadServices() {
        const services = [
            {
                id: 1,
                name: 'Leaky Faucet Repair',
                description: 'Fix minor leaks in faucets and pipes',
                price: 50,
                image: '../assets/faucet_images.png',
                category: 'repair',
                subServices: [
                    'Kitchen Faucet Repair',
                    'Bathroom Faucet Repair', 
                    'Garden Tap Repair',
                    'Shower Head Repair'
                ]
            },
            {
                id: 2,
                name: 'Water Heater',
                description: 'Install new water heater systems in homes',
                price: 100,
                image: '../assets/water_heater.png',
                category: 'repair',
                subServices: [
                    'Electric Water Heater',
                    'Gas Water Heater',
                    'Solar Water Heater',
                    'Instant Water Heater'
                ]
            },
            {
                id: 3,
                name: 'Fan',
                description: 'Install and replace ceiling fans and lighting',
                price: 75,
                image: '../assets/fan_image.png',
                category: 'repair',
                subServices: [
                    'Ceiling Fan Installation',
                    'Table Fan Repair',
                    'Exhaust Fan Installation',
                    'Stand Fan Repair'
                ]
            },
            {
                id: 4,
                name: 'Switchboard Repair',
                description: 'Repair faulty switchboards and electrical outlets',
                price: 50,
                image: '../assets/services/switches_images.png',
                category: 'repair',
                subServices: [
                    'Socket Repair',
                    'Switch Replacement',
                    'Outlet Installation',
                    'Electrical Panel Repair'
                ]
            },
            {
                id: 5,
                name: 'Full Home Cleaning',
                description: 'Deep cleaning of the entire house, including floors and surfaces',
                price: 100,
                image: 'https://www.balajicleaningagency.com/img/service/Untitled-02.jpg',
                category: 'cleaning',
                subServices: [
                    'Deep House Cleaning',
                    'Kitchen Deep Clean',
                    'Living Room Cleaning',
                    'Bedroom Cleaning'
                ]
            },
            {
                id: 6,
                name: 'Bathroom',
                description: 'Deep cleaning of bathroom surfaces, tiles, and fixtures',
                price: 75,
                image: '../assets/services/toilet_seat_image.png',
                category: 'cleaning',
                subServices: [
                    'Toilet Deep Clean',
                    'Tile Cleaning',
                    'Shower Cleaning',
                    'Mirror & Fixture Clean'
                ]
            },
            {
                id: 7,
                name: 'Haircut and Styling',
                description: 'Professional hairstyling and haircuts at home',
                price: 50,
                image: '../assets/barbar_image.png',
                category: 'beauty',
                subServices: [
                    'Men\'s Haircut',
                    'Women\'s Haircut',
                    'Beard Trimming',
                    'Hair Styling'
                ]
            },
            {
                id: 8,
                name: 'Full Body Massage',
                description: 'Relaxing full body massage therapy at home',
                price: 100,
                image: '../assets/services/massage_images.png',
                category: 'beauty',
                subServices: [
                    'Swedish Massage',
                    'Deep Tissue Massage',
                    'Aromatherapy Massage',
                    'Relaxation Massage'
                ]
            },
            {
                id: 9,
                name: 'AC Repair',
                description: 'Fix and service air conditioning units',
                price: 75,
                image: '../assets/ac_image.png',
                category: 'repair',
                subServices: [
                    'AC Gas Refill',
                    'AC Cleaning',
                    'Compressor Repair',
                    'Filter Replacement'
                ]
            },
            {
                id: 10,
                name: 'Kitchen Chimney Cleaning',
                description: 'Deep cleaning of kitchen chimneys to remove grease and soot',
                price: 100,
                image: 'https://5.imimg.com/data5/SELLER/Default/2024/3/401808890/WR/UK/BU/14823340/kitchen-chimney-cleaning-service.jpg',
                category: 'cleaning',
                subServices: [
                    'Chimney Filter Cleaning',
                    'Grease Removal',
                    'Motor Cleaning',
                    'Duct Cleaning'
                ]
            },
            {
                id: 11,
                name: 'Pest Control (Cockroach)',
                description: 'Treatment to remove cockroaches from home',
                price: 150,
                image: 'https://res.cloudinary.com/jerrick/image/upload/d_642250b563292b35f27461a7.png,f_jpg,fl_progressive,q_auto,w_1024/67a9ce46c35314001d3a5c28.jpg',
                category: 'home',
                subServices: [
                    'Kitchen Treatment',
                    'Bathroom Treatment',
                    'Living Area Treatment',
                    'Full House Treatment'
                ]
            },
            {
                id: 12,
                name: 'Pest Control (Termite)',
                description: 'Termite control service with safe chemicals',
                price: 200,
                image: 'https://www.getpestcontrol.in/wp-content/uploads/2020/11/termite-pest-control-1.jpg',
                category: 'home',
                subServices: [
                    'Wood Treatment',
                    'Foundation Treatment',
                    'Soil Treatment',
                    'Preventive Treatment'
                ]
            },
            {
                id: 13,
                name: 'AC Service',
                description: 'Comprehensive maintenance and servicing of air conditioners',
                price: 100,
                image: 'https://static.wixstatic.com/media/ade29c_24e1ba8f67a241b5a6a44f04a96fdbd0~mv2.png/v1/fill/w_556,h_366,fp_0.50_0.50,q_85,usm_0.66_1.00_0.01,enc_auto/ade29c_24e1ba8f67a241b5a6a44f04a96fdbd0~mv2.png',
                category: 'repair',
                subServices: [
                    'Annual Maintenance',
                    'Filter Cleaning',
                    'Coil Cleaning',
                    'Performance Check'
                ]
            },
            {
                id: 14,
                name: 'Refrigerator Repair',
                description: 'Fix cooling issues and mechanical problems in refrigerators',
                price: 100,
                image: 'https://cdn.shopify.com/s/files/1/0631/7892/5894/files/How_to_fix_common_refrigerator_problems.webp?v=1693558242',
                category: 'repair',
                subServices: [
                    'Cooling Issue Fix',
                    'Compressor Repair',
                    'Thermostat Repair',
                    'Door Seal Replacement'
                ]
            },
            {
                id: 15,
                name: 'Geyser Installation',
                description: 'Professional installation of water heaters and geysers',
                price: 150,
                image: 'https://serviceonwheel.com/uploads/categoryimages/1619498610.geyser-repairing.jpg',
                category: 'repair',
                subServices: [
                    'Electric Geyser Install',
                    'Gas Geyser Install',
                    'Instant Geyser Install',
                    'Storage Geyser Install'
                ]
            },
            {
                id: 16,
                name: 'CCTV Installation',
                description: 'Complete CCTV camera setup and installation for home security',
                price: 200,
                image: 'https://5.imimg.com/data5/SELLER/Default/2023/3/293903698/XK/EH/HJ/5944502/cctv-installation-service.jpg',
                category: 'home',
                subServices: [
                    'Indoor Camera Setup',
                    'Outdoor Camera Setup',
                    'DVR Installation',
                    'Mobile App Setup'
                ]
            },
            {
                id: 17,
                name: 'Mobile Repair',
                description: 'Repair services for smartphones and mobile devices',
                price: 100,
                image: 'https://www.dignited.com/wp-content/uploads/2021/01/Mobile-phone-repair.jpg',
                category: 'repair',
                subServices: [
                    'Screen Replacement',
                    'Battery Replacement',
                    'Speaker Repair',
                    'Charging Port Fix'
                ]
            }
        ];

        const serviceGrid = document.getElementById('serviceGrid');
        serviceGrid.innerHTML = services.map(service => `
            <div class="service-card-main" data-service-id="${service.id}">
                <div class="service-header" onclick="selectService(${service.id})">
                    <img src="${service.image}" alt="${service.name}">
                    <div class="service-main-info">
                        <h6>${service.name}</h6>
                        <p>${service.description}</p>
                        <div class="price">Starting from ₹${service.price}</div>
                    </div>
                    <i class="fas fa-chevron-down expand-icon"></i>
                </div>
                <div class="sub-services">
                    ${service.subServices.map(subService => `
                        <div class="sub-service-item" onclick="selectSubService(${service.id}, '${subService}')">
                            <i class="fas fa-arrow-right"></i>
                            <span>${subService}</span>
                            <span class="sub-price">₹${service.price}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');

        // Add click handlers for expanding/collapsing
        document.querySelectorAll('.service-header').forEach(header => {
            header.addEventListener('click', function(e) {
                e.stopPropagation();
                const card = this.closest('.service-card-main');
                const isExpanded = card.classList.contains('expanded');
                
                // Close all other cards
                document.querySelectorAll('.service-card-main').forEach(c => c.classList.remove('expanded'));
                
                // Toggle current card
                if (!isExpanded) {
                    card.classList.add('expanded');
                }
            });
        });
    }

    // Function to select sub-service directly
    window.selectSubService = function(serviceId, subServiceName) {
        const services = [
            {
                id: 1,
                name: 'Leaky Faucet Repair',
                description: 'Fix minor leaks in faucets and pipes',
                price: 50,
                image: '../assets/faucet_images.png'
            },
            {
                id: 2,
                name: 'Water Heater Installation',
                description: 'Install new water heater systems',
                price: 100,
                image: '../assets/water_heater.png'
            },
            {
                id: 3,
                name: 'Fan Installation',
                description: 'Install and replace ceiling fans',
                price: 75,
                image: '../assets/fan_image.png'
            },
            {
                id: 4,
                name: 'Full Home Cleaning',
                description: 'Deep cleaning of entire house',
                price: 100,
                image: '../assets/cleaning_tools.png'
            },
            {
                id: 5,
                name: 'Haircut & Styling',
                description: 'Professional hairstyling at home',
                price: 50,
                image: '../assets/barbar_image.png'
            }
        ];

        const baseService = services.find(s => s.id === serviceId);
        selectedService = {
            ...baseService,
            name: subServiceName,
            description: `Professional ${subServiceName.toLowerCase()} service`
        };
        
        updateSelectedService();
        updateSummary();
        
        // Close modal and show confirmation
        const modal = bootstrap.Modal.getInstance(document.getElementById('serviceModal'));
        modal.hide();
        
        showNotification(`${subServiceName} selected successfully!`, 'success');
    };

    window.selectService = function(serviceId) {
        const services = [
            {
                id: 1,
                name: 'Leaky Faucet Repair',
                description: 'Fix minor leaks in faucets and pipes',
                price: 50,
                image: '../assets/faucet_images.png'
            },
            {
                id: 2,
                name: 'Water Heater Installation',
                description: 'Install new water heater systems',
                price: 100,
                image: '../assets/water_heater.png'
            },
            {
                id: 3,
                name: 'Fan Installation',
                description: 'Install and replace ceiling fans',
                price: 75,
                image: '../assets/fan_image.png'
            },
            {
                id: 4,
                name: 'Full Home Cleaning',
                description: 'Deep cleaning of entire house',
                price: 100,
                image: '../assets/cleaning_tools.png'
            },
            {
                id: 5,
                name: 'Haircut & Styling',
                description: 'Professional hairstyling at home',
                price: 50,
                image: '../assets/barbar_image.png'
            }
        ];

        selectedService = services.find(s => s.id === serviceId);
        updateSelectedService();
        updateSummary();
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('serviceModal'));
        modal.hide();
    };

    function updateSelectedService() {
        // Update service display elements
        const serviceImage = document.getElementById('serviceImage');
        const serviceName = document.getElementById('serviceName');
        const serviceDescription = document.getElementById('serviceDescription');
        const servicePrice = document.getElementById('servicePrice');
        
        if (serviceImage) {
            serviceImage.src = selectedService.image;
            serviceImage.alt = selectedService.name;
        }
        if (serviceName) serviceName.textContent = selectedService.name;
        if (serviceDescription) serviceDescription.textContent = selectedService.description;
        if (servicePrice) servicePrice.textContent = `₹${selectedService.price}`;
        
        // Update booking header with service name
        const bookingHeader = document.querySelector('.booking-header h2');
        if (bookingHeader) {
            bookingHeader.textContent = `Book ${selectedService.name}`;
        }
        
        // Also update summary immediately
        updateSummary();
        
        console.log('Updated service display for:', selectedService.name);
    }

    function updateSummary() {
        const summaryService = document.getElementById('summaryService');
        const summaryTotal = document.getElementById('summaryTotal');
        const summaryDate = document.getElementById('summaryDate');
        const summaryTime = document.getElementById('summaryTime');
        const summaryDuration = document.getElementById('summaryDuration');
        const summaryServiceImage = document.getElementById('summaryServiceImage');
        
        if (summaryService) summaryService.textContent = selectedService.name;
        if (summaryTotal) summaryTotal.textContent = `₹${selectedService.price}`;
        if (summaryDuration) summaryDuration.textContent = selectedService.duration || '1-2 hours';
        if (summaryServiceImage) {
            summaryServiceImage.src = selectedService.image;
            summaryServiceImage.alt = selectedService.name;
        }
        
        if (selectedDate && summaryDate) {
            const date = new Date(selectedDate);
            summaryDate.textContent = date.toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        
        if (selectedTimeSlot && summaryTime) {
            const time = convertTo12Hour(selectedTimeSlot);
            summaryTime.textContent = time;
        }
        
        // Update step 2 with current selections
        updateStep2Summary();
        
        console.log('Summary updated for service:', selectedService.name, 'Price:', selectedService.price);
    }
    
    function updateStep2Summary() {
        // Add booking summary to step 2 for better visibility
        const step2 = document.querySelector('.form-step[data-step="2"]');
        if (!step2) return;
        
        let summaryDiv = step2.querySelector('.current-booking-summary');
        if (!summaryDiv) {
            summaryDiv = document.createElement('div');
            summaryDiv.className = 'current-booking-summary';
            step2.insertBefore(summaryDiv, step2.querySelector('.datetime-selection'));
        }
        
        summaryDiv.innerHTML = `
            <div class="booking-summary-card">
                <h5>Your Booking Details</h5>
                <div class="booking-service-info">
                    <img src="${selectedService.image}" alt="${selectedService.name}" class="booking-service-image">
                    <div class="booking-service-details">
                        <div class="summary-row">
                            <span class="label">Service:</span>
                            <span class="value">${selectedService.name}</span>
                        </div>
                        <div class="summary-row">
                            <span class="label">Price:</span>
                            <span class="value">₹${selectedService.price}</span>
                        </div>
                        ${selectedDate ? `
                            <div class="summary-row">
                                <span class="label">Date:</span>
                                <span class="value">${new Date(selectedDate).toLocaleDateString('en-IN')}</span>
                            </div>
                        ` : ''}
                        ${selectedTimeSlot ? `
                            <div class="summary-row">
                                <span class="label">Time:</span>
                                <span class="value">${convertTo12Hour(selectedTimeSlot)}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    function convertTo12Hour(time24) {
        const [hours, minutes] = time24.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    }

    window.nextStep = function() {
        if (validateCurrentStep()) {
            if (currentStep < 3) {
                currentStep++;
                updateSteps();
                updateButtonStates();
            }
        }
    };

    window.previousStep = function() {
        if (currentStep > 1) {
            currentStep--;
            updateSteps();
            updateButtonStates();
        }
    };

    function validateCurrentStep() {
        switch (currentStep) {
            case 1:
                const name = document.getElementById('customerName').value.trim();
                const phone = document.getElementById('customerPhone').value.trim();
                const address = document.getElementById('customerAddress').value.trim();
                
                if (!name || !phone || !address) {
                    showNotification('Please fill in all required fields', 'error');
                    return false;
                }
                
                if (!/^[6-9]\d{9}$/.test(phone)) {
                    showNotification('Please enter a valid 10-digit phone number', 'error');
                    return false;
                }
                return true;
                
            case 2:
                const date = document.getElementById('serviceDate').value;
                selectedDate = date;
                
                if (!date || !selectedTimeSlot) {
                    showNotification('Please select date and time slot', 'error');
                    return false;
                }
                
                updateSummary();
                return true;
                
            case 3:
                if (selectedPaymentMethod === 'upi') {
                    const upiId = document.getElementById('upiId');
                    if (!upiId || !upiId.value.trim()) {
                        showNotification('Please enter your UPI ID', 'error');
                        return false;
                    }
                    
                    // Basic UPI ID validation
                    const upiPattern = /^[\w\.-]+@[\w\.-]+$/;
                    if (!upiPattern.test(upiId.value.trim())) {
                        showNotification('Please enter a valid UPI ID (e.g., name@paytm)', 'error');
                        return false;
                    }
                } else {
                    const cardNumber = document.getElementById('cardNumber');
                    const expiryDate = document.getElementById('expiryDate');
                    const cvv = document.getElementById('cvv');
                    const cardName = document.getElementById('cardName');
                    
                    if (!cardNumber || !cardNumber.value.trim() ||
                        !expiryDate || !expiryDate.value.trim() ||
                        !cvv || !cvv.value.trim() ||
                        !cardName || !cardName.value.trim()) {
                        showNotification('Please fill in all card details', 'error');
                        return false;
                    }
                }
                return true;
                
            default:
                return true;
        }
    }

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#007bff'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    function updateSteps() {
        // Update step indicators
        const steps = document.querySelectorAll('.step');
        const formSteps = document.querySelectorAll('.form-step');
        
        steps.forEach((step, index) => {
            const stepNumber = index + 1;
            if (stepNumber < currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (stepNumber === currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
        
        // Update form steps
        formSteps.forEach((step, index) => {
            if (index + 1 === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    function updateButtonStates() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');
        
        prevBtn.style.display = currentStep === 1 ? 'none' : 'inline-block';
        nextBtn.style.display = currentStep === 3 ? 'none' : 'inline-block';
        submitBtn.style.display = currentStep === 3 ? 'inline-block' : 'none';
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        
        if (!validateCurrentStep()) {
            return;
        }
        
        // Collect payment details
        let paymentDetails = {
            method: selectedPaymentMethod
        };
        
        if (selectedPaymentMethod === 'upi') {
            paymentDetails.upiId = document.getElementById('upiId').value.trim();
        } else {
            paymentDetails.cardNumber = document.getElementById('cardNumber').value.trim();
            paymentDetails.expiryDate = document.getElementById('expiryDate').value.trim();
            paymentDetails.cvv = document.getElementById('cvv').value.trim();
            paymentDetails.cardName = document.getElementById('cardName').value.trim();
        }

        // Collect form data
        const formData = {
            service: selectedService,
            customer: {
                name: document.getElementById('customerName').value,
                phone: document.getElementById('customerPhone').value,
                address: document.getElementById('customerAddress').value,
                notes: document.getElementById('serviceNotes').value
            },
            booking: {
                date: selectedDate,
                time: selectedTimeSlot
            },
            payment: paymentDetails,
            amount: selectedService.price
        };
        
        // Process booking
        processBooking(formData);
    }

    function processBooking(bookingData) {
        // Show loading state
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Generate order ID
            const orderId = 'ORD' + Date.now().toString().slice(-6);
            
            // Store booking data in localStorage (in real app, this would be sent to server)
            const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            const newBooking = {
                id: orderId,
                ...bookingData,
                status: 'confirmed',
                createdAt: new Date().toISOString(),
                estimatedTime: '2-4 hours'
            };
            bookings.push(newBooking);
            localStorage.setItem('bookings', JSON.stringify(bookings));
            
            // Show success message
            showSuccessModal(orderId);
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
        }, 2000);
    }

    function showSuccessModal(orderId) {
        const modalHtml = `
            <div class="modal fade" id="successModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title">Booking Confirmed!</h5>
                        </div>
                        <div class="modal-body text-center">
                            <div class="mb-3">
                                <i class="fas fa-check-circle text-success" style="font-size: 4rem;"></i>
                            </div>
                            <h4>Your booking has been confirmed</h4>
                            <p class="mb-3">Order ID: <strong>${orderId}</strong></p>
                            <p>You will receive a confirmation SMS and email shortly.</p>
                            <p>Our service provider will contact you before the scheduled time.</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" onclick="goToOrders()">View Orders</button>
                            <button type="button" class="btn btn-secondary" onclick="goHome()">Go Home</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modal = new bootstrap.Modal(document.getElementById('successModal'));
        modal.show();
    }

    window.goToOrders = function() {
        window.location.href = 'orders.html';
    };

    window.goHome = function() {
        window.location.href = '../index.html';
    };

    // Initialize with console log for debugging
    console.log('Booking system initialized successfully!');

    window.goToOrders = function() {
        window.location.href = 'orders.html';
    };

    window.goHome = function() {
        window.location.href = '../index.html';
    };

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'error' ? 'danger' : 'info'} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    console.log('Booking system initialized successfully!');
});