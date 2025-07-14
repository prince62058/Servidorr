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

    // Initialize booking form
    initializeBookingForm();
    initializeTimeSlots();
    initializeServiceModal();
    loadServices();
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('serviceDate').setAttribute('min', today);

    function initializeBookingForm() {
        // Update service display
        updateSelectedService();
        
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
                name: 'Water Heater Installation',
                description: 'Install new water heater systems',
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
                name: 'Fan Installation',
                description: 'Install and replace ceiling fans',
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
                name: 'Full Home Cleaning',
                description: 'Deep cleaning of entire house',
                price: 100,
                image: '../assets/cleaning_tools.png',
                category: 'cleaning',
                subServices: [
                    'Deep House Cleaning',
                    'Kitchen Deep Clean',
                    'Bathroom Deep Clean',
                    'Carpet Cleaning'
                ]
            },
            {
                id: 5,
                name: 'Haircut & Styling',
                description: 'Professional hairstyling at home',
                price: 50,
                image: '../assets/barbar_image.png',
                category: 'beauty',
                subServices: [
                    'Men\'s Haircut',
                    'Women\'s Haircut',
                    'Beard Trimming',
                    'Hair Styling'
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
        document.getElementById('serviceImage').src = selectedService.image;
        document.getElementById('serviceName').textContent = selectedService.name;
        document.getElementById('serviceDescription').textContent = selectedService.description;
        document.getElementById('servicePrice').textContent = `₹${selectedService.price}`;
    }

    function updateSummary() {
        document.getElementById('summaryService').textContent = selectedService.name;
        document.getElementById('summaryTotal').textContent = `₹${selectedService.price}`;
        
        if (selectedDate) {
            const date = new Date(selectedDate);
            document.getElementById('summaryDate').textContent = date.toLocaleDateString('en-IN');
        }
        
        if (selectedTimeSlot) {
            const time = convertTo12Hour(selectedTimeSlot);
            document.getElementById('summaryTime').textContent = time;
        }
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
                
            default:
                return true;
        }
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