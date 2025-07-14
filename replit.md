# Servidorr - Service Booking Platform

## Overview

Servidorr is a frontend-focused service booking platform that connects users with trusted professionals for various services including salon, cleaning, repairs, and more. The application is built as a static website with modern web technologies, focusing on user experience through smooth animations and intuitive navigation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Static HTML/CSS/JavaScript**: Single-page application built with vanilla JavaScript
- **Bootstrap 5**: CSS framework for responsive design and UI components
- **Animation Libraries**: AOS (Animate On Scroll) for scroll-triggered animations
- **Font Integration**: Google Fonts (Inter and Poppins) and Font Awesome icons
- **Responsive Design**: Mobile-first approach with viewport meta tags

### Technology Stack
- **HTML5**: Semantic markup with proper meta tags and accessibility considerations
- **CSS3**: Custom properties (CSS variables) for consistent theming
- **Vanilla JavaScript**: ES6+ features for modern JavaScript functionality
- **Bootstrap 5**: Component library for rapid UI development
- **External Libraries**: AOS for animations, Font Awesome for icons
- **Database**: PostgreSQL database with Drizzle ORM for data persistence
- **Backend Ready**: Database schema and storage layer prepared for full-stack functionality

## Key Components

### 1. Navigation System
- Fixed navigation bar with scroll effects
- Active link highlighting
- Smooth scrolling between sections
- Mobile-responsive hamburger menu

### 2. Animation Engine
- **Scroll Animations**: Intersection Observer API for performance
- **Hover Effects**: Interactive elements with CSS transitions
- **Parallax Effects**: Depth and movement on scroll
- **Counter Animations**: Number counting effects
- **Morphing Shapes**: Dynamic visual elements
- **Stagger Animations**: Sequential element animations
- **Page Transitions**: Smooth navigation between sections

### 3. Service Booking Features
- Service filtering and categorization
- Booking form with validation
- Contact form functionality
- Service tabs for different categories
- Countdown timers for promotions

### 4. User Experience Elements
- Loading screen with spinner
- Back-to-top button
- Floating elements for visual interest
- Reveal animations for content disclosure

## Data Flow

### Client-Side Flow
1. **Page Load**: Loading screen displays while assets load
2. **Navigation**: User clicks navigation links triggering smooth scroll
3. **Service Selection**: Users browse and filter available services
4. **Booking Process**: Form validation and submission handling
5. **Visual Feedback**: Animations provide user interaction feedback

### Animation Flow
1. **Scroll Detection**: Intersection Observer monitors element visibility
2. **Animation Trigger**: CSS classes applied based on scroll position
3. **Stagger Effects**: Sequential animations for grouped elements
4. **Completion Callbacks**: Post-animation cleanup and state management

## External Dependencies

### CDN Resources
- **Bootstrap 5.3.0**: CSS framework for responsive design
- **Font Awesome 6.4.0**: Icon library for UI elements
- **Google Fonts**: Inter and Poppins font families
- **AOS 2.3.1**: Animate On Scroll library

### Database Dependencies
- **PostgreSQL**: Primary database for data storage
- **Drizzle ORM**: Modern TypeScript ORM for database operations
- **@neondatabase/serverless**: Database driver for serverless PostgreSQL connections

### Performance Considerations
- Preconnect hints for Google Fonts
- Optimized loading order for CSS and JavaScript
- Lazy loading for non-critical animations
- Database connection pooling for efficient data access

## Deployment Strategy

### Static Hosting
- **Architecture**: Client-side only, no server-side processing
- **Requirements**: Any static web server (CDN, GitHub Pages, Netlify, etc.)
- **Assets**: All resources loaded from CDN for faster delivery
- **Caching**: Browser caching for static assets

### Build Process
- **No Build Step**: Direct deployment of source files
- **Optimization**: Manual CSS/JS minification recommended for production
- **SEO**: Meta tags and semantic HTML for search engine optimization

### Database Integration
- **PostgreSQL Database**: Fully configured with environment variables
- **Schema Design**: Complete database schema for users, services, bookings, service providers, and contact inquiries
- **Storage Layer**: TypeScript storage interface with database operations
- **Sample Data**: Pre-populated with service categories and pricing information

### Scalability Considerations
- **Backend Integration**: Database and storage layer ready for API integration
- **Database**: Full database schema implemented with proper relationships
- **Authentication**: Frontend prepared for user authentication flows
- **Real-time Features**: Database structure supports booking management and user interactions

## Development Notes

### Code Organization
- **Modular JavaScript**: Separate files for main functionality and animations
- **CSS Architecture**: Custom properties for consistent theming
- **Component Structure**: Reusable UI patterns throughout the application

### Future Enhancements
- Backend API integration for real booking functionality
- User authentication and profile management
- Payment processing integration
- Real-time availability checking
- Service provider dashboard

The application is designed to be easily extended with backend services while maintaining the current user experience and animation system.

## Recent Updates

**July 14, 2025 - Custom Authentication System Added:**
- Created custom login page with modern design and real-time functionality
- Added signup page with comprehensive form validation and password strength indicator
- Implemented demo user system for testing (admin@servidorr.com/admin123, user@servidorr.com/user123)
- Added real-time status indicators and notification system
- Created session management with localStorage and sessionStorage
- Added login/logout functionality with user redirection
- Enhanced navigation with login link
- Authentication works independently without external services
- Full responsive design with floating animations and smooth transitions

**July 14, 2025 - Navigation Menu Updates:**
- Removed "Book Now" button from navigation menu across all pages as requested
- Updated all "View Sub-Services" buttons on home page to redirect to services page
- Updated all "Book Now" buttons (hero section and promotional banner) to redirect to services page
- Improved navigation flow for better user experience

**July 14, 2025 - Added Professional Favicon Across All Pages:**
- Created custom SVG favicon with tools/service theme matching Servidorr branding
- Added favicon.ico fallback for older browsers
- Updated all HTML pages (Home, Services, Booking, Orders, Profile) with proper favicon links
- Favicon features blue background with white tools icon representing the service platform

**July 14, 2025 - Enhanced Sub-Service Selection in Booking:**
- Added expandable service cards with sub-service options in booking modal
- Implemented direct sub-service selection with one-click booking
- Enhanced CSS styling for smooth animations and better UX
- Sub-services include specific options like Kitchen Faucet Repair, Electric Water Heater, etc.
- Added visual feedback with hover effects and expand/collapse animations
- Improved service selection flow for clearer user experience

**July 11, 2025 - Enhanced Order Cancel Feature:**
- Enhanced existing cancel functionality with improved UI/UX
- Added proper form validation with error feedback
- Included more cancellation reasons (service delay, emergency, etc.)
- Added order details display in cancel modal
- Implemented loading states and animated notifications
- Added warning message about order cancellation being permanent
- Enhanced notification system with icons and smooth animations
- Added better error handling and user feedback

**July 11, 2025 - Login Page Removed:**
- Removed login page completely from the project
- Updated all navigation menus to remove login links
- Cleaned up navigation across all pages (Home, Services, Orders, Profile)
- Simplified authentication flow as requested by user

**July 14, 2025 - Real-time Orders System & Enhanced Payment Processing:**
- Fixed and enhanced booking system with reliable form submission handling
- Added comprehensive payment processing with visual overlay and loading animations
- Implemented real-time orders system with automatic updates every 5 seconds
- Added intelligent order cleanup options (all orders, completed orders, old orders 30+ days)
- Enhanced orders page with real-time status indicator showing last update time
- Improved error handling and debugging for payment system
- Added tab visibility management to conserve resources when tab is hidden
- Enhanced notification system with smooth animations and proper styling

**July 14, 2025 - Migration to Replit Environment Completed:**
- Successfully migrated project from Replit Agent to Replit environment
- Installed all required Node.js packages and dependencies (Express, PostgreSQL drivers, Stripe, etc.)
- Server running successfully on port 5000 with all features working
- All booking system functionality working properly
- Migration completed with all checklist items verified
- Video background playing correctly with proper debug logging
- Enhanced animation speeds across entire website (AOS duration: 1000ms → 400ms, transitions: 0.6s → 0.4s, hover effects: 0.3s → 0.2s)
- Improved animation easing with cubic-bezier for smoother, more responsive interactions

**July 14, 2025 - Enhanced Customer Details in Orders:**
- Fixed booking form to properly collect customer information (name, phone, address, notes)
- Updated orders page to display customer details in order cards with styled layout
- Enhanced order details modal to show complete customer information
- Added customer name and phone number to order search functionality
- Fixed issue where customer details were skipped when pre-selecting services
- Added proper validation to ensure customer details are collected before proceeding

**July 14, 2025 - User Authentication System & Profile Management:**
- Implemented complete user authentication system with login/logout functionality
- Created user session management using localStorage and sessionStorage
- Added user profile page with session-based data loading and authentication protection
- Updated navigation across all pages to show user dropdown menu after login
- Added logout functionality with proper session cleanup
- User profile page redirects to login if not authenticated
- Session data automatically updates user profile information (name, email)
- Added demo user credentials (admin@servidorr.com/admin123, user@servidorr.com/user123)
- Complete order details displayed on orders page with customer information
- Orders page shows customer name, phone, and address for each booking
- Enhanced order search to include customer details in search functionality

**July 10, 2025 - Multi-Page Architecture & Real-time Booking Implementation:**
- Transformed from single-page to multi-page architecture with separate pages for booking, services, profile, and orders
- Created complete real-time booking system with 3-step process (service selection, date/time, payment)
- Implemented order tracking system with real-time status updates
- Added comprehensive user profile management with addresses, payment methods, and help center
- Built complete services catalog page with filtering and search functionality
- Integrated all pages with consistent navigation and responsive design
- Added local storage for user data persistence (orders, profile, addresses)
- Created comprehensive CSS styling for all new pages with mobile responsiveness
- JavaScript functionality for booking flow, order management, and user interactions
- All pages fully functional with authentic service data and pricing

**Previous Updates:**
- Successfully migrated project from Replit Agent to Replit environment
- Downloaded and integrated authentic service images from Servidorr.com
- Added 20+ authentic services with actual pricing and ratings
- Project running successfully on port 5000 with all frontend features working

**Database Architecture:**
- PostgreSQL database schema ready for backend integration
- Complete storage interfaces for users, services, bookings, and inquiries
- Drizzle ORM configured for seamless database operations