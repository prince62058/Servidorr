// Login Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const togglePassword = document.getElementById('togglePassword');

    
    // Demo users for testing
    const demoUsers = [
        { email: 'admin@servidorr.com', password: 'admin123', name: 'Admin User', role: 'admin' },
        { email: 'user@servidorr.com', password: 'user123', name: 'Regular User', role: 'user' },
        { email: 'demo@servidorr.com', password: 'demo123', name: 'Demo User', role: 'user' }
    ];
    
    // Initialize login page
    initializeLogin();
    
    function initializeLogin() {
        // Password toggle functionality
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            
            const icon = this.querySelector('i');
            if (type === 'password') {
                icon.className = 'fas fa-eye';
            } else {
                icon.className = 'fas fa-eye-slash';
            }
        });
        
        // Form submission
        loginForm.addEventListener('submit', handleLogin);
        
        // Real-time validation
        emailInput.addEventListener('input', validateEmail);
        passwordInput.addEventListener('input', validatePassword);
        
        // Social login buttons
        document.querySelector('.google-btn').addEventListener('click', () => {
            showNotification('Google login integration coming soon!', 'info');
        });
        
        document.querySelector('.facebook-btn').addEventListener('click', () => {
            showNotification('Facebook login integration coming soon!', 'info');
        });
        

        
        // Check if user is already logged in
        checkExistingSession();
        
        console.log('Login page initialized successfully!');
    }
    
    function validateEmail() {
        const email = emailInput.value.trim();
        const emailError = document.getElementById('emailError');
        
        if (email === '') {
            clearValidation(emailInput, emailError);
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFieldError(emailInput, emailError, 'Please enter a valid email address');
            return false;
        }
        
        showFieldSuccess(emailInput, emailError);
        return true;
    }
    
    function validatePassword() {
        const password = passwordInput.value;
        const passwordError = document.getElementById('passwordError');
        
        if (password === '') {
            clearValidation(passwordInput, passwordError);
            return false;
        }
        
        if (password.length < 6) {
            showFieldError(passwordInput, passwordError, 'Password must be at least 6 characters');
            return false;
        }
        
        showFieldSuccess(passwordInput, passwordError);
        return true;
    }
    
    function showFieldError(input, errorElement, message) {
        input.classList.add('error');
        input.classList.remove('success');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    function showFieldSuccess(input, errorElement) {
        input.classList.add('success');
        input.classList.remove('error');
        errorElement.classList.remove('show');
    }
    
    function clearValidation(input, errorElement) {
        input.classList.remove('success', 'error');
        errorElement.classList.remove('show');
    }
    
    async function handleLogin(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        // Validate inputs
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        
        if (!isEmailValid || !isPasswordValid) {
            showNotification('Please fix the errors above', 'error');
            return;
        }
        
        // Show loading state
        setLoadingState(true);
        
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Check credentials against demo users
            const user = demoUsers.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Successful login
                showNotification(`Welcome back, ${user.name}!`, 'success');
                
                // Store user session
                const sessionData = {
                    user: {
                        id: Date.now(),
                        email: user.email,
                        name: user.name,
                        role: user.role
                    },
                    loginTime: new Date().toISOString(),
                    rememberMe: rememberMe
                };
                
                if (rememberMe) {
                    localStorage.setItem('userSession', JSON.stringify(sessionData));
                } else {
                    sessionStorage.setItem('userSession', JSON.stringify(sessionData));
                }
                
                // Redirect after successful login
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1000);
                
            } else {
                // Invalid credentials
                showNotification('Invalid email or password. Please try again.', 'error');
                
                // Show demo credentials hint
                setTimeout(() => {
                    showNotification('Demo: admin@servidorr.com / admin123', 'info');
                }, 2000);
            }
            
        } catch (error) {
            console.error('Login error:', error);
            showNotification('Login failed. Please try again.', 'error');
        } finally {
            setLoadingState(false);
        }
    }
    
    function setLoadingState(loading) {
        const btnText = loginBtn.querySelector('.btn-text');
        const btnLoader = loginBtn.querySelector('.btn-loader');
        
        if (loading) {
            btnText.style.opacity = '0';
            btnLoader.style.display = 'block';
            loginBtn.disabled = true;
        } else {
            btnText.style.opacity = '1';
            btnLoader.style.display = 'none';
            loginBtn.disabled = false;
        }
    }
    
    function showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="${icons[type]}" style="color: ${getNotificationColor(type)};"></i>
                <span>${message}</span>
            </div>
        `;
        
        container.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }
    
    function getNotificationColor(type) {
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            warning: '#f39c12',
            info: '#667eea'
        };
        return colors[type] || colors.info;
    }
    

    
    function checkExistingSession() {
        const sessionData = localStorage.getItem('userSession') || sessionStorage.getItem('userSession');
        
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                const loginTime = new Date(session.loginTime);
                const now = new Date();
                const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
                
                // Check if session is still valid (24 hours for remember me, 8 hours for regular)
                const maxHours = session.rememberMe ? 24 : 8;
                
                if (hoursDiff < maxHours) {
                    showNotification('You are already logged in. Redirecting...', 'info');
                    setTimeout(() => {
                        window.location.href = '../index.html';
                    }, 1500);
                    return;
                }
            } catch (error) {
                console.error('Session check error:', error);
            }
        }
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
    
    // Focus management
    emailInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            passwordInput.focus();
        }
    });
    
    passwordInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
    
    // Auto-fill demo credentials for testing
    window.fillDemoCredentials = function(userType = 'admin') {
        const demoUser = demoUsers.find(u => u.role === userType) || demoUsers[0];
        emailInput.value = demoUser.email;
        passwordInput.value = demoUser.password;
        validateEmail();
        validatePassword();
        showNotification(`Demo credentials filled for ${demoUser.name}`, 'info');
    };
    
    // Add demo button for testing
    const demoButton = document.createElement('button');
    demoButton.type = 'button';
    demoButton.className = 'btn btn-outline-secondary btn-sm';
    demoButton.innerHTML = '<i class="fas fa-user"></i> Fill Demo Credentials';
    demoButton.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 1000; border-radius: 20px; padding: 8px 16px; font-size: 12px;';
    demoButton.onclick = () => fillDemoCredentials('admin');
    document.body.appendChild(demoButton);
});

// Add slideOut animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);