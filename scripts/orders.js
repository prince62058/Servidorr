// Orders Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    let allOrders = [];
    let currentFilter = 'all';
    let currentSort = 'newest';

    // Initialize orders page
    initializeOrders();
    initializeFilters();
    loadOrders();
    
    // Start real-time updates every 5 seconds
    let updateInterval = setInterval(loadOrders, 5000);
    
    // Auto-refresh when window becomes visible
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            loadOrders();
            // Restart interval when tab becomes active
            if (updateInterval) clearInterval(updateInterval);
            updateInterval = setInterval(loadOrders, 5000);
        } else {
            // Stop updates when tab is hidden to save resources
            if (updateInterval) clearInterval(updateInterval);
        }
    });
    
    

    function initializeOrders() {
        // Initialize filter tabs
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                filterTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                currentFilter = this.dataset.filter;
                filterAndDisplayOrders();
            });
        });

        // Initialize sort dropdown
        const sortSelect = document.getElementById('sortOrders');
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            filterAndDisplayOrders();
        });

        // Initialize search
        const searchInput = document.getElementById('searchOrders');
        searchInput.addEventListener('input', function() {
            filterAndDisplayOrders();
        });
    }

    function initializeFilters() {
        // Filter functionality is handled in initializeOrders
    }

    // Function to clear all orders
    function clearAllOrders() {
        if (confirm('Are you sure you want to clear all orders? This action cannot be undone.')) {
            localStorage.removeItem('bookings');
            localStorage.removeItem('orders');
            allOrders = [];
            displayOrders([]);
            showNotification('All orders have been cleared successfully!', 'success');
            showClearOrdersButton();
        }
    }
    
    // Function to clear completed orders only
    function clearCompletedOrders() {
        if (confirm('Clear all completed orders?')) {
            const remainingOrders = allOrders.filter(order => order.status !== 'completed');
            localStorage.setItem('bookings', JSON.stringify(remainingOrders));
            allOrders = remainingOrders;
            showNotification('Completed orders cleared successfully!', 'success');
            showClearOrdersButton();
            filterAndDisplayOrders();
        }
    }
    
    // Function to clear old orders (older than 30 days)
    function clearOldOrders() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentOrders = allOrders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate > thirtyDaysAgo;
        });
        
        const clearedCount = allOrders.length - recentOrders.length;
        if (clearedCount > 0) {
            localStorage.setItem('bookings', JSON.stringify(recentOrders));
            allOrders = recentOrders;
            showNotification(`${clearedCount} old orders cleared successfully!`, 'success');
            showClearOrdersButton();
            filterAndDisplayOrders();
        } else {
            showNotification('No old orders to clear', 'info');
        }
    }

    // Show clear orders button if orders exist
    function showClearOrdersButton() {
        const clearDropdown = document.getElementById('clearOrdersDropdown');
        if (clearDropdown && allOrders.length > 0) {
            clearDropdown.style.display = 'block';
        } else if (clearDropdown) {
            clearDropdown.style.display = 'none';
        }
    }

    // Function to create test orders for demonstration
    function createTestOrders() {
        const testOrders = [
            {
                id: 'ORD-' + Date.now() + '-1',
                service: {
                    name: 'AC Service & Repair',
                    description: 'Professional AC cleaning and maintenance service',
                    image: '../assets/services/ac_service.jpg'
                },
                customer: {
                    name: 'John Doe',
                    phone: '+91 9876543210',
                    address: '123 Main Street, Delhi',
                    notes: 'AC not cooling properly'
                },
                booking: {
                    date: new Date().toISOString().split('T')[0],
                    time: '10:00'
                },
                amount: 1500,
                status: 'confirmed',
                createdAt: new Date().toISOString(),
                paymentMethod: 'Online Payment',
                paymentStatus: 'Paid'
            },
            {
                id: 'ORD-' + Date.now() + '-2',
                service: {
                    name: 'House Cleaning',
                    description: 'Complete house cleaning service',
                    image: '../assets/services/bathroom_cleaning.jpg'
                },
                customer: {
                    name: 'Jane Smith',
                    phone: '+91 9876543211',
                    address: '456 Park Avenue, Mumbai',
                    notes: 'Deep cleaning required'
                },
                booking: {
                    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    time: '14:00'
                },
                amount: 2500,
                status: 'pending',
                createdAt: new Date().toISOString(),
                paymentMethod: 'Cash on Delivery',
                paymentStatus: 'Pending'
            },
            {
                id: 'ORD-' + Date.now() + '-3',
                service: {
                    name: 'Leaky Faucet Repair',
                    description: 'Fix minor leaks in faucets and pipes',
                    image: '../assets/faucet_images.png'
                },
                customer: {
                    name: 'Mike Johnson',
                    phone: '+91 9876543212',
                    address: '789 Oak Street, Bangalore',
                    notes: 'Kitchen faucet dripping'
                },
                booking: {
                    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    time: '16:00'
                },
                amount: 500,
                status: 'completed',
                createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                paymentMethod: 'Cash on Delivery',
                paymentStatus: 'Paid'
            }
        ];
        
        localStorage.setItem('bookings', JSON.stringify(testOrders));
        allOrders = testOrders;
        showNotification('Test orders created successfully!', 'success');
        filterAndDisplayOrders();
    }

    // Make cleanup functions globally accessible
    window.clearAllOrders = clearAllOrders;
    window.clearCompletedOrders = clearCompletedOrders;
    window.clearOldOrders = clearOldOrders;
    window.createTestOrders = createTestOrders;

    function loadOrders() {
        console.log('Loading orders from localStorage...');
        
        // Load orders from localStorage
        const storedOrders = JSON.parse(localStorage.getItem('bookings') || '[]');
        console.log('Raw stored orders:', storedOrders);
        
        // Use stored orders or create demo orders if none exist
        if (storedOrders.length === 0) {
            console.log('No orders found, you can browse services to create new orders');
            allOrders = [];
        } else {
            allOrders = storedOrders;
            console.log('Found existing orders:', allOrders.length);
        }
        
        console.log('Loaded orders count:', allOrders.length);
        console.log('Sample order:', allOrders[0]);

        showClearOrdersButton();
        filterAndDisplayOrders();
    }

    function filterAndDisplayOrders() {
        let filteredOrders = [...allOrders];

        // Filter by status
        if (currentFilter !== 'all') {
            filteredOrders = filteredOrders.filter(order => {
                switch (currentFilter) {
                    case 'ongoing':
                        return ['pending', 'confirmed', 'in-progress'].includes(order.status);
                    case 'completed':
                        return order.status === 'completed';
                    case 'cancelled':
                        return order.status === 'cancelled';
                    default:
                        return true;
                }
            });
        }

        // Filter by search query
        const searchQuery = document.getElementById('searchOrders').value.toLowerCase();
        if (searchQuery) {
            filteredOrders = filteredOrders.filter(order =>
                order.service.name.toLowerCase().includes(searchQuery) ||
                order.id.toLowerCase().includes(searchQuery) ||
                (order.customer && order.customer.name && order.customer.name.toLowerCase().includes(searchQuery)) ||
                (order.customer && order.customer.phone && order.customer.phone.includes(searchQuery))
            );
        }

        // Sort orders
        filteredOrders.sort((a, b) => {
            switch (currentSort) {
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'amount-high':
                    return b.amount - a.amount;
                case 'amount-low':
                    return a.amount - b.amount;
                default:
                    return 0;
            }
        });

        displayOrders(filteredOrders);
    }

    function displayOrders(orders) {
        console.log('Displaying orders:', orders.length);
        const ordersList = document.getElementById('ordersList');

        if (orders.length === 0) {
            console.log('No orders to display');
            const isFiltered = currentFilter !== 'all' || document.getElementById('searchOrders').value.trim() !== '';
            ordersList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <h4>${isFiltered ? 'No orders match your filter' : 'No orders found'}</h4>
                    <p>${isFiltered ? 'Try changing your filter or search criteria.' : 'You haven\'t placed any orders yet.'}</p>
                    ${isFiltered ? 
                        `<button class="btn btn-outline-primary" onclick="clearFilters()">Clear Filters</button>` : 
                        `<a href="services.html" class="btn btn-primary">Browse Services</a>`
                    }
                </div>
            `;
            return;
        }
        
        console.log('Sample order data:', orders[0]);

        ordersList.innerHTML = orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-info">
                        <h4>${order.service?.name || 'Service'}</h4>
                        <div class="order-id">Order ID: ${order.id}</div>
                        <div class="order-date">Ordered on ${formatDate(order.createdAt)}</div>
                    </div>
                    <div class="order-status">
                        <span class="status-badge ${order.status}">${formatStatus(order.status)}</span>
                    </div>
                </div>
                
                <div class="order-content">
                    <img src="${order.service?.image || '../assets/default-service.png'}" alt="${order.service?.name || 'Service'}" class="service-image">
                    <div class="service-details">
                        <h5>${order.service?.name || 'Service'}</h5>
                        <p>${order.service?.description || 'Professional service'}</p>
                        <div class="service-datetime">
                            <i class="fas fa-calendar"></i> ${formatDate(order.booking?.date || order.scheduledDateTime)} at ${formatTime(order.booking?.time || order.scheduledDateTime)}
                        </div>
                        ${order.customer ? `
                            <div class="customer-details">
                                <i class="fas fa-user"></i> <strong>${order.customer.name}</strong>
                                <div class="customer-info">
                                    <div><i class="fas fa-phone"></i> ${order.customer.phone}</div>
                                    <div><i class="fas fa-map-marker-alt"></i> ${order.customer.address}</div>
                                    ${order.customer.notes ? `<div><i class="fas fa-sticky-note"></i> ${order.customer.notes}</div>` : ''}
                                </div>
                            </div>
                        ` : ''}
                        ${order.provider ? `<div class="service-provider">Provider: ${order.provider.name}</div>` : ''}
                    </div>
                    <div class="order-amount">
                        <div class="amount">₹${order.amount || order.totalAmount}</div>
                    </div>
                </div>
                
                <div class="order-actions">
                    <button class="btn btn-outline-primary btn-sm" onclick="viewOrderDetails('${order.id}')">View Details</button>
                    ${order.status === 'in-progress' || order.status === 'confirmed' ? 
                        `<button class="btn btn-outline-info btn-sm" onclick="trackOrder('${order.id}')">Track Order</button>` : ''}
                    ${order.status === 'completed' ? 
                        `<button class="btn btn-outline-success btn-sm" onclick="reorderService('${order.id}')">Reorder</button>` : ''}
                    ${['pending', 'confirmed'].includes(order.status) ? 
                        `<button class="btn btn-outline-danger btn-sm" onclick="cancelOrder('${order.id}')">Cancel</button>` : ''}
                </div>
            </div>
        `).join('');
    }

    window.viewOrderDetails = function(orderId) {
        const order = allOrders.find(o => o.id === orderId);
        if (!order) {
            console.error('Order not found:', orderId);
            return;
        }

        console.log('Viewing order details for:', order);
        
        const modalContent = document.getElementById('orderDetailContent');
        modalContent.innerHTML = `
            <div class="order-detail-header">
                <div class="order-detail-info">
                    <h4>${order.service?.name || 'Service'}</h4>
                    <div class="order-id">Order ID: ${order.id}</div>
                </div>
                <span class="status-badge ${order.status}">${formatStatus(order.status)}</span>
            </div>
            
            <div class="detail-section">
                <h6>Service Details</h6>
                <div class="detail-grid">
                    <div class="detail-item">
                        <div class="detail-label">Service</div>
                        <div class="detail-value">${order.service?.name || 'Service'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Description</div>
                        <div class="detail-value">${order.service?.description || 'Professional service'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Amount</div>
                        <div class="detail-value">₹${order.amount || order.totalAmount}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Date & Time</div>
                        <div class="detail-value">${formatDate(order.booking?.date || order.scheduledDateTime)} at ${formatTime(order.booking?.time || order.scheduledDateTime)}</div>
                    </div>
                    ${order.paymentMethod ? `
                        <div class="detail-item">
                            <div class="detail-label">Payment Method</div>
                            <div class="detail-value">${order.paymentMethod}</div>
                        </div>
                    ` : ''}
                    ${order.paymentStatus ? `
                        <div class="detail-item">
                            <div class="detail-label">Payment Status</div>
                            <div class="detail-value">${order.paymentStatus}</div>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            ${order.customer && (order.customer.name || order.customer.phone || order.customer.address) ? `
                <div class="detail-section">
                    <h6>Customer Information</h6>
                    <div class="detail-grid">
                        ${order.customer.name ? `
                            <div class="detail-item">
                                <div class="detail-label">Name</div>
                                <div class="detail-value">${order.customer.name}</div>
                            </div>
                        ` : ''}
                        ${order.customer.phone ? `
                            <div class="detail-item">
                                <div class="detail-label">Phone</div>
                                <div class="detail-value">${order.customer.phone}</div>
                            </div>
                        ` : ''}
                        ${order.customer.address ? `
                            <div class="detail-item">
                                <div class="detail-label">Address</div>
                                <div class="detail-value">${order.customer.address}</div>
                            </div>
                        ` : ''}
                        ${order.customer.notes ? `
                            <div class="detail-item">
                                <div class="detail-label">Notes</div>
                                <div class="detail-value">${order.customer.notes}</div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            ` : ''}
            
            ${order.provider ? `
                <div class="detail-section">
                    <h6>Service Provider</h6>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <div class="detail-label">Name</div>
                            <div class="detail-value">${order.provider.name}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Phone</div>
                            <div class="detail-value">${order.provider.phone}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Rating</div>
                            <div class="detail-value">${order.provider.rating} ⭐</div>
                        </div>
                    </div>
                </div>
            ` : ''}
        `;

        // Show appropriate action buttons
        const reorderBtn = document.getElementById('reorderBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        
        reorderBtn.style.display = order.status === 'completed' ? 'inline-block' : 'none';
        cancelBtn.style.display = ['pending', 'confirmed'].includes(order.status) ? 'inline-block' : 'none';

        const modal = new bootstrap.Modal(document.getElementById('orderDetailModal'));
        modal.show();
    };

    window.trackOrder = function(orderId) {
        const order = allOrders.find(o => o.id === orderId);
        if (!order) return;

        const trackingSteps = [
            { title: 'Order Placed', description: 'Your order has been received', completed: true, time: formatDate(order.createdAt) },
            { title: 'Order Confirmed', description: 'Service provider assigned', completed: order.status !== 'pending', active: order.status === 'confirmed', time: order.status !== 'pending' ? '2 hours ago' : '' },
            { title: 'Service Started', description: 'Provider is on the way', completed: ['in-progress', 'completed'].includes(order.status), active: order.status === 'in-progress', time: order.status === 'in-progress' ? '30 mins ago' : '' },
            { title: 'Service Completed', description: 'Service has been completed', completed: order.status === 'completed', time: order.completedAt ? formatDate(order.completedAt) : '' }
        ];

        const trackingHtml = trackingSteps.map(step => `
            <div class="tracking-step ${step.completed ? 'completed' : step.active ? 'active' : 'pending'}">
                <div class="step-icon">${step.completed ? '✓' : step.active ? '●' : '○'}</div>
                <div class="step-info">
                    <h6>${step.title}</h6>
                    <p>${step.description}</p>
                </div>
                <div class="step-time">${step.time}</div>
            </div>
        `).join('');

        document.getElementById('orderTracking').innerHTML = trackingHtml;

        const modal = new bootstrap.Modal(document.getElementById('trackOrderModal'));
        modal.show();
    };

    window.cancelOrder = function(orderId) {
        const order = allOrders.find(o => o.id === orderId);
        if (!order) {
            showNotification('Order not found', 'error');
            return;
        }

        // Check if order can be cancelled
        if (!['pending', 'confirmed'].includes(order.status)) {
            showNotification('This order cannot be cancelled at this time', 'error');
            return;
        }

        window.currentOrderToCancel = orderId;
        
        // Update modal title with order details
        const modalTitle = document.querySelector('#cancelOrderModal .modal-title');
        modalTitle.textContent = `Cancel Order - ${order.service.name}`;
        
        // Add order info to modal body
        const modalBody = document.querySelector('#cancelOrderModal .modal-body');
        const orderInfo = modalBody.querySelector('.order-info') || document.createElement('div');
        orderInfo.className = 'order-info mb-3 p-3 bg-light rounded';
        orderInfo.innerHTML = `
            <h6>Order Details</h6>
            <div class="row">
                <div class="col-md-6">
                    <strong>Order ID:</strong> ${order.id}<br>
                    <strong>Service:</strong> ${order.service.name}<br>
                    <strong>Amount:</strong> ₹${order.amount}
                </div>
                <div class="col-md-6">
                    <strong>Date:</strong> ${formatDate(order.booking.date)}<br>
                    <strong>Time:</strong> ${formatTime(order.booking.time)}<br>
                    <strong>Status:</strong> ${formatStatus(order.status)}
                </div>
            </div>
        `;
        
        // Insert order info at the beginning of modal body
        if (!modalBody.querySelector('.order-info')) {
            modalBody.insertBefore(orderInfo, modalBody.firstChild);
        }
        
        // Clear previous form data
        document.getElementById('cancelReason').value = '';
        document.getElementById('cancelComments').value = '';
        document.getElementById('cancelReason').classList.remove('is-invalid');
        document.getElementById('cancelReasonError').textContent = '';
        
        const modal = new bootstrap.Modal(document.getElementById('cancelOrderModal'));
        modal.show();
    };

    window.confirmCancelOrder = function() {
        const orderId = window.currentOrderToCancel;
        const reason = document.getElementById('cancelReason').value;
        const comments = document.getElementById('cancelComments').value;
        const reasonSelect = document.getElementById('cancelReason');
        const errorDiv = document.getElementById('cancelReasonError');
        const confirmBtn = document.getElementById('confirmCancelBtn');

        // Clear previous errors
        reasonSelect.classList.remove('is-invalid');
        errorDiv.textContent = '';

        if (!reason) {
            reasonSelect.classList.add('is-invalid');
            errorDiv.textContent = 'Please select a reason for cancellation';
            reasonSelect.focus();
            return;
        }

        // Show loading state
        const originalText = confirmBtn.innerHTML;
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
        confirmBtn.disabled = true;

        // Simulate processing delay for better UX
        setTimeout(() => {
            // Update order status
            const orderIndex = allOrders.findIndex(o => o.id === orderId);
            if (orderIndex !== -1) {
                const order = allOrders[orderIndex];
                const serviceName = order.service.name;
                
                allOrders[orderIndex].status = 'cancelled';
                allOrders[orderIndex].cancelReason = reason;
                allOrders[orderIndex].cancelComments = comments;
                allOrders[orderIndex].cancelledAt = new Date().toISOString();

                // Update localStorage
                localStorage.setItem('bookings', JSON.stringify(allOrders));

                // Refresh display
                filterAndDisplayOrders();

                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('cancelOrderModal'));
                modal.hide();

                // Clear form
                document.getElementById('cancelReason').value = '';
                document.getElementById('cancelComments').value = '';

                // Reset button state
                confirmBtn.innerHTML = originalText;
                confirmBtn.disabled = false;

                // Show success notification with order details
                showNotification(`Order for "${serviceName}" has been cancelled successfully. A confirmation email has been sent.`, 'success');
                
                // Optional: Show cancellation details in console for debugging
                console.log('Order cancelled:', {
                    orderId: orderId,
                    reason: reason,
                    comments: comments,
                    cancelledAt: new Date().toISOString()
                });
            }
        }, 1000);
    };

    window.reorderService = function(orderId) {
        const order = allOrders.find(o => o.id === orderId);
        if (!order) return;

        // Store service for booking
        localStorage.setItem('selectedService', JSON.stringify(order.service));
        
        // Redirect to booking page
        window.location.href = 'booking.html';
    };

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    function formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    }

    function formatStatus(status) {
        switch (status) {
            case 'pending':
                return 'Pending';
            case 'confirmed':
                return 'Confirmed';
            case 'in-progress':
                return 'In Progress';
            case 'completed':
                return 'Completed';
            case 'cancelled':
                return 'Cancelled';
            default:
                return status;
        }
    }

    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.custom-notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `custom-notification alert alert-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} alert-dismissible fade show position-fixed`;
        notification.style.cssText = `
            top: 20px; 
            right: 20px; 
            z-index: 9999; 
            min-width: 350px;
            border-radius: 8px;
            border: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideInFromRight 0.3s ease;
        `;
        
        const iconMap = {
            'success': 'fas fa-check-circle',
            'error': 'fas fa-exclamation-circle',
            'info': 'fas fa-info-circle'
        };
        
        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="${iconMap[type] || iconMap['info']} me-3"></i>
                <div class="flex-grow-1">${message}</div>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutToRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    // Add CSS animations for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInFromRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOutToRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
        
        .custom-notification {
            animation: slideInFromRight 0.3s ease;
        }
        
        .order-info {
            border-left: 4px solid #007bff;
        }
        
        .order-info h6 {
            color: #007bff;
            margin-bottom: 0.5rem;
        }
        
        .btn-danger:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
        
        .invalid-feedback {
            display: block;
        }
        
        .form-select.is-invalid {
            border-color: #dc3545;
        }
        
        .form-select.is-invalid:focus {
            border-color: #dc3545;
            box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
        }
    `;
    document.head.appendChild(style);

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
    
    // Global function to clear filters
    window.clearFilters = function() {
        currentFilter = 'all';
        currentSort = 'newest';
        
        // Reset filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.filter === 'all') {
                tab.classList.add('active');
            }
        });
        
        // Reset search and sort
        document.getElementById('searchOrders').value = '';
        document.getElementById('sortOrders').value = 'newest';
        
        // Refresh display
        filterAndDisplayOrders();
    };

    // Initialize user session check
    checkUserSession();

    console.log('Orders page initialized successfully!');
});