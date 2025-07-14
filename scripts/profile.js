// Profile Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    let currentTab = 'personal';
    let userProfile = {};

    // Initialize profile page
    initializeProfile();
    initializeMenuTabs();
    loadUserProfile();
    loadAddresses();
    loadPaymentMethods();
    initializeFAQ();
    checkUserSession();

    function initializeProfile() {
        // Check if user is logged in
        const userSession = localStorage.getItem('userSession') || sessionStorage.getItem('userSession');
        
        if (userSession) {
            try {
                const sessionData = JSON.parse(userSession);
                const sessionUser = sessionData.user;
                
                // Load user profile from localStorage or create from session
                userProfile = JSON.parse(localStorage.getItem('userProfile')) || {
                    firstName: sessionUser.name ? sessionUser.name.split(' ')[0] : 'User',
                    lastName: sessionUser.name ? sessionUser.name.split(' ').slice(1).join(' ') : '',
                    email: sessionUser.email || 'user@example.com',
                    phone: '+91 9876543210',
                    dateOfBirth: '',
                    gender: '',
                    avatar: '../assets/default-avatar.png'
                };
                
                // Update profile with session data
                if (sessionUser.name) {
                    const nameParts = sessionUser.name.split(' ');
                    userProfile.firstName = nameParts[0];
                    userProfile.lastName = nameParts.slice(1).join(' ');
                }
                if (sessionUser.email) {
                    userProfile.email = sessionUser.email;
                }
                
            } catch (error) {
                console.error('Error loading session:', error);
                // Redirect to login if session is invalid
                window.location.href = 'login.html';
                return;
            }
        } else {
            // No session, redirect to login
            window.location.href = 'login.html';
            return;
        }

        updateProfileDisplay();
    }

    function initializeMenuTabs() {
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                const tabName = this.dataset.tab;
                switchTab(tabName);
            });
        });
    }

    function switchTab(tabName) {
        // Update menu active state
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update content active state
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.querySelector(`.tab-content[data-tab="${tabName}"]`).classList.add('active');

        currentTab = tabName;
    }

    function updateProfileDisplay() {
        // Update profile card
        document.getElementById('profileName').textContent = `${userProfile.firstName} ${userProfile.lastName}`;
        document.getElementById('profileEmail').textContent = userProfile.email;
        
        if (userProfile.avatar) {
            document.getElementById('profileAvatar').src = userProfile.avatar;
        }

        // Update form fields
        document.getElementById('firstName').value = userProfile.firstName;
        document.getElementById('lastName').value = userProfile.lastName;
        document.getElementById('email').value = userProfile.email;
        document.getElementById('phone').value = userProfile.phone;
        document.getElementById('dateOfBirth').value = userProfile.dateOfBirth;
        document.getElementById('gender').value = userProfile.gender;

        // Update stats
        updateProfileStats();
    }

    function updateProfileStats() {
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const totalBookings = bookings.length;
        const totalSavings = bookings.reduce((sum, booking) => sum + (booking.amount * 0.1), 0);

        document.getElementById('totalBookings').textContent = totalBookings;
        document.getElementById('totalSavings').textContent = `₹${Math.round(totalSavings)}`;
    }

    function loadUserProfile() {
        const form = document.getElementById('personalInfoForm');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            saveUserProfile();
        });

        // Avatar upload
        const avatarInput = document.getElementById('avatarInput');
        avatarInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const avatar = e.target.result;
                    document.getElementById('profileAvatar').src = avatar;
                    userProfile.avatar = avatar;
                    saveUserProfile();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    function saveUserProfile() {
        // Collect form data
        userProfile.firstName = document.getElementById('firstName').value;
        userProfile.lastName = document.getElementById('lastName').value;
        userProfile.email = document.getElementById('email').value;
        userProfile.phone = document.getElementById('phone').value;
        userProfile.dateOfBirth = document.getElementById('dateOfBirth').value;
        userProfile.gender = document.getElementById('gender').value;

        // Save to localStorage
        localStorage.setItem('userProfile', JSON.stringify(userProfile));

        // Update display
        updateProfileDisplay();

        // Show success message
        showNotification('Profile updated successfully!', 'success');
    }

    function loadAddresses() {
        const addresses = JSON.parse(localStorage.getItem('addresses') || '[]');
        const addressesGrid = document.getElementById('addressesGrid');

        if (addresses.length === 0) {
            addressesGrid.innerHTML = `
                <div class="col-12 text-center py-4">
                    <i class="fas fa-map-marker-alt fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">No addresses saved</h5>
                    <p class="text-muted">Add your first address to get started</p>
                </div>
            `;
            return;
        }

        addressesGrid.innerHTML = addresses.map((address, index) => `
            <div class="address-card ${address.isDefault ? 'default' : ''}">
                ${address.isDefault ? '<div class="default-badge">Default</div>' : ''}
                <div class="address-label">${address.label}</div>
                <div class="address-text">${address.fullAddress}, ${address.city} - ${address.pincode}</div>
                <div class="address-actions">
                    <button class="btn btn-outline-primary btn-sm" onclick="editAddress(${index})">Edit</button>
                    ${!address.isDefault ? `<button class="btn btn-outline-success btn-sm" onclick="setDefaultAddress(${index})">Set Default</button>` : ''}
                    <button class="btn btn-outline-danger btn-sm" onclick="deleteAddress(${index})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    window.addNewAddress = function() {
        const modal = new bootstrap.Modal(document.getElementById('addAddressModal'));
        modal.show();
    };

    window.saveAddress = function() {
        const label = document.getElementById('addressLabel').value || 'Home';
        const fullAddress = document.getElementById('fullAddress').value;
        const city = document.getElementById('city').value;
        const pincode = document.getElementById('pincode').value;

        if (!fullAddress || !city || !pincode) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        const addresses = JSON.parse(localStorage.getItem('addresses') || '[]');
        const newAddress = {
            id: Date.now(),
            label,
            fullAddress,
            city,
            pincode,
            isDefault: addresses.length === 0
        };

        addresses.push(newAddress);
        localStorage.setItem('addresses', JSON.stringify(addresses));

        // Clear form
        document.getElementById('addAddressForm').reset();

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addAddressModal'));
        modal.hide();

        // Reload addresses
        loadAddresses();

        showNotification('Address added successfully!', 'success');
    };

    window.setDefaultAddress = function(index) {
        const addresses = JSON.parse(localStorage.getItem('addresses') || '[]');
        addresses.forEach((addr, i) => {
            addr.isDefault = i === index;
        });
        localStorage.setItem('addresses', JSON.stringify(addresses));
        loadAddresses();
        showNotification('Default address updated!', 'success');
    };

    window.deleteAddress = function(index) {
        if (confirm('Are you sure you want to delete this address?')) {
            const addresses = JSON.parse(localStorage.getItem('addresses') || '[]');
            addresses.splice(index, 1);
            localStorage.setItem('addresses', JSON.stringify(addresses));
            loadAddresses();
            showNotification('Address deleted successfully!', 'success');
        }
    };

    function loadPaymentMethods() {
        const paymentMethods = JSON.parse(localStorage.getItem('paymentMethods') || '[]');
        const paymentGrid = document.getElementById('paymentMethodsGrid');

        if (paymentMethods.length === 0) {
            paymentGrid.innerHTML = `
                <div class="col-12 text-center py-4">
                    <i class="fas fa-credit-card fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">No payment methods saved</h5>
                    <p class="text-muted">Add a payment method for faster checkout</p>
                </div>
            `;
            return;
        }

        paymentGrid.innerHTML = paymentMethods.map((method, index) => `
            <div class="payment-card ${method.isDefault ? 'default' : ''}">
                ${method.isDefault ? '<div class="default-badge">Default</div>' : ''}
                <div class="card-info">
                    <div class="card-icon">
                        <i class="fas fa-credit-card"></i>
                    </div>
                    <div class="card-details">
                        <h6>${method.type} ending in ${method.lastFour}</h6>
                        <div class="card-number">**** **** **** ${method.lastFour}</div>
                    </div>
                </div>
                <div class="card-actions">
                    ${!method.isDefault ? `<button class="btn btn-outline-success btn-sm" onclick="setDefaultPayment(${index})">Set Default</button>` : ''}
                    <button class="btn btn-outline-danger btn-sm" onclick="deletePaymentMethod(${index})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    window.addPaymentMethod = function() {
        // In a real app, this would integrate with Stripe or similar
        const lastFour = Math.floor(1000 + Math.random() * 9000);
        const paymentMethods = JSON.parse(localStorage.getItem('paymentMethods') || '[]');
        
        const newMethod = {
            id: Date.now(),
            type: 'Credit Card',
            lastFour: lastFour.toString(),
            isDefault: paymentMethods.length === 0
        };

        paymentMethods.push(newMethod);
        localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));
        loadPaymentMethods();
        showNotification('Payment method added successfully!', 'success');
    };

    window.setDefaultPayment = function(index) {
        const paymentMethods = JSON.parse(localStorage.getItem('paymentMethods') || '[]');
        paymentMethods.forEach((method, i) => {
            method.isDefault = i === index;
        });
        localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));
        loadPaymentMethods();
        showNotification('Default payment method updated!', 'success');
    };

    window.deletePaymentMethod = function(index) {
        if (confirm('Are you sure you want to delete this payment method?')) {
            const paymentMethods = JSON.parse(localStorage.getItem('paymentMethods') || '[]');
            paymentMethods.splice(index, 1);
            localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));
            loadPaymentMethods();
            showNotification('Payment method deleted successfully!', 'success');
        }
    };

    function initializeFAQ() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                const answer = this.nextElementSibling;
                const isActive = this.classList.contains('active');

                // Close all other FAQs
                faqQuestions.forEach(q => {
                    q.classList.remove('active');
                    q.nextElementSibling.classList.remove('active');
                });

                // Toggle current FAQ
                if (!isActive) {
                    this.classList.add('active');
                    answer.classList.add('active');
                }
            });
        });
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // User session management
    function checkUserSession() {
        const userSession = localStorage.getItem('userSession') || sessionStorage.getItem('userSession');
        
        if (userSession) {
            try {
                const sessionData = JSON.parse(userSession);
                updateNavigationForLoggedInUser(sessionData.user);
            } catch (error) {
                console.error('Error parsing user session:', error);
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
        
        showNotification('Logged out successfully', 'success');
        
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);
    };

    console.log('Profile page initialized successfully!');
});