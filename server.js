const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// In-memory data storage for demo purposes
let services = [
  {
    id: 1,
    name: 'Leaky Faucet Repair',
    description: 'Fix minor leaks in faucets and pipes',
    price: 50,
    category: 'repair',
    image: '/assets/faucet_images.png',
    rating: 4.7,
    reviews: 90,
    duration: 120,
    availability: 'available'
  },
  {
    id: 2,
    name: 'Water Heater Installation',
    description: 'Install new water heater systems',
    price: 100,
    category: 'repair',
    image: '/assets/water_heater.png',
    rating: 4.8,
    reviews: 60,
    duration: 180,
    availability: 'available'
  },
  {
    id: 3,
    name: 'Full Home Cleaning',
    description: 'Deep cleaning of entire house',
    price: 100,
    category: 'cleaning',
    image: '/assets/cleaning_tools.png',
    rating: 4.9,
    reviews: 120,
    duration: 240,
    availability: 'available'
  },
  {
    id: 4,
    name: 'Haircut & Styling',
    description: 'Professional hairstyling at home',
    price: 50,
    category: 'beauty',
    image: '/assets/barbar_image.png',
    rating: 4.6,
    reviews: 85,
    duration: 120,
    availability: 'available'
  },
  {
    id: 5,
    name: 'AC Repair',
    description: 'Fix and service air conditioning units',
    price: 75,
    category: 'repair',
    image: '/assets/ac_image.png',
    rating: 4.6,
    reviews: 70,
    duration: 180,
    availability: 'available'
  }
];

let bookings = [];
let nextBookingId = 1;

// API Routes
app.get('/api/services', (req, res) => {
  try {
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

app.get('/api/services/:id', (req, res) => {
  try {
    const service = services.find(s => s.id === parseInt(req.params.id));
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

app.post('/api/bookings', (req, res) => {
  try {
    const booking = {
      id: 'ORD' + Date.now().toString().slice(-6),
      ...req.body,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      estimatedTime: '2-4 hours'
    };
    bookings.push(booking);
    res.json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

app.get('/api/bookings', (req, res) => {
  try {
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

app.get('/api/bookings/:id', (req, res) => {
  try {
    const booking = bookings.find(b => b.id === req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

app.put('/api/bookings/:id', (req, res) => {
  try {
    const index = bookings.findIndex(b => b.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    bookings[index] = { ...bookings[index], ...req.body };
    res.json(bookings[index]);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

app.post('/api/contact', (req, res) => {
  try {
    const inquiry = {
      id: Date.now(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    console.log('Contact inquiry received:', inquiry);
    res.json(inquiry);
  } catch (error) {
    console.error('Error creating contact inquiry:', error);
    res.status(500).json({ error: 'Failed to create inquiry' });
  }
});

// Payment processing (mock implementation)
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'inr' } = req.body;
    
    // Mock payment intent creation
    const paymentIntent = {
      id: 'pi_' + Date.now(),
      amount: amount * 100, // Convert to paise
      currency: currency,
      status: 'requires_payment_method',
      client_secret: 'pi_' + Date.now() + '_secret_' + Math.random().toString(36).substr(2, 9)
    };
    
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Initialize sample bookings for demo
function initializeSampleData() {
  console.log('✅ Sample data initialized with', services.length, 'services');
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve static files
app.use(express.static(path.join(__dirname)));

// Serve main index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidorr server running on port ${PORT}`);
  console.log(`📱 Website: http://localhost:${PORT}`);
  
  // Initialize sample data
  initializeSampleData();
  
  console.log('✅ Server ready to accept connections');
});

module.exports = app;