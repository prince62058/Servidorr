// Orders Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    let allOrders = [];
    let currentFilter = 'all';
    let currentSort = 'newest';

    // Initialize orders page
    initializeOrders();
    initializeFilters();
    loadOrders();

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

    function loadOrders() {
        // Load orders from localStorage
        const storedOrders = JSON.parse(localStorage.getItem('bookings') || '[]');
        
        // Add some demo orders if none exist
        if (storedOrders.length === 0) {
            const demoOrders = [
                {
                    id: 'ORD123456',
                    service: {
                        name: 'AC Repair',
                        description: 'Fix and service air conditioning units',
                        price: 75,
                        image: '../assets/ac_image.png'
                    },
                    customer: {
                        name: 'John Doe',
                        phone: '+91 9876543210',
                        address: '123 Main Street, City'
                    },
                    booking: {
                        date: '2024-07-15',
                        time: '14:00'
                    },
                    status: 'completed',
                    amount: 75,
                    createdAt: '2024-07-10T10:30:00Z',
                    completedAt: '2024-07-15T16:30:00Z',
                    provider: {
                        name: 'Rajesh Kumar',
                        phone: '+91 9876543211',
                        rating: 4.8
                    }
                },
                {
                    id: 'ORD123457',
                    service: {
                        name: 'Full Home Cleaning',
                        description: 'Deep cleaning of entire house',
                        price: 100,
                        image: '../assets/cleaning_tools.png'
                    },
                    customer: {
                        name: 'John Doe',
                        phone: '+91 9876543210',
                        address: '123 Main Street, City'
                    },
                    booking: {
                        date: '2024-07-12',
                        time: '10:00'
                    },
                    status: 'in-progress',
                    amount: 100,
                    createdAt: '2024-07-11T09:15:00Z',
                    provider: {
                        name: 'Priya Sharma',
                        phone: '+91 9876543212',
                        rating: 4.9
                    }
                }
            ];
            localStorage.setItem('bookings', JSON.stringify(demoOrders));
            allOrders = demoOrders;
        } else {
            allOrders = storedOrders;
        }

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
                order.id.toLowerCase().includes(searchQuery)
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
        const ordersList = document.getElementById('ordersList');

        if (orders.length === 0) {
            ordersList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <h4>No orders found</h4>
                    <p>You haven't placed any orders yet or no orders match your current filter.</p>
                    <a href="services.html" class="btn btn-primary">Browse Services</a>
                </div>
            `;
            return;
        }

        ordersList.innerHTML = orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-info">
                        <h4>${order.service.name}</h4>
                        <div class="order-id">Order ID: ${order.id}</div>
                        <div class="order-date">Ordered on ${formatDate(order.createdAt)}</div>
                    </div>
                    <div class="order-status">
                        <span class="status-badge ${order.status}">${formatStatus(order.status)}</span>
                    </div>
                </div>
                
                <div class="order-content">
                    <img src="${order.service.image}" alt="${order.service.name}" class="service-image">
                    <div class="service-details">
                        <h5>${order.service.name}</h5>
                        <p>${order.service.description}</p>
                        <div class="service-datetime">
                            <i class="fas fa-calendar"></i> ${formatDate(order.booking.date)} at ${formatTime(order.booking.time)}
                        </div>
                        ${order.provider ? `<div class="service-provider">Provider: ${order.provider.name}</div>` : ''}
                    </div>
                    <div class="order-amount">
                        <div class="amount">₹${order.amount}</div>
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
        if (!order) return;

        const modalContent = document.getElementById('orderDetailContent');
        modalContent.innerHTML = `
            <div class="order-detail-header">
                <div class="order-detail-info">
                    <h4>${order.service.name}</h4>
                    <div class="order-id">Order ID: ${order.id}</div>
                </div>
                <span class="status-badge ${order.status}">${formatStatus(order.status)}</span>
            </div>
            
            <div class="detail-section">
                <h6>Service Details</h6>
                <div class="detail-grid">
                    <div class="detail-item">
                        <div class="detail-label">Service</div>
                        <div class="detail-value">${order.service.name}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Description</div>
                        <div class="detail-value">${order.service.description}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Amount</div>
                        <div class="detail-value">₹${order.amount}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Date & Time</div>
                        <div class="detail-value">${formatDate(order.booking.date)} at ${formatTime(order.booking.time)}</div>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h6>Customer Information</h6>
                <div class="detail-grid">
                    <div class="detail-item">
                        <div class="detail-label">Name</div>
                        <div class="detail-value">${order.customer.name}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Phone</div>
                        <div class="detail-value">${order.customer.phone}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Address</div>
                        <div class="detail-value">${order.customer.address}</div>
                    </div>
                </div>
            </div>
            
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
        window.currentOrderToCancel = orderId;
        const modal = new bootstrap.Modal(document.getElementById('cancelOrderModal'));
        modal.show();
    };

    window.confirmCancelOrder = function() {
        const orderId = window.currentOrderToCancel;
        const reason = document.getElementById('cancelReason').value;
        const comments = document.getElementById('cancelComments').value;

        if (!reason) {
            showNotification('Please select a reason for cancellation', 'error');
            return;
        }

        // Update order status
        const orderIndex = allOrders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
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

            showNotification('Order cancelled successfully', 'success');
        }
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

    console.log('Orders page initialized successfully!');
});