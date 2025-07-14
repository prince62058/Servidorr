// Signup Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const signupBtn = document.getElementById('signupBtn');
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');

    
    // Initialize signup page
    initializeSignup();
    
    function initializeSignup() {
        // Password toggle functionality
        togglePassword.addEventListener('click', function() {
            togglePasswordVisibility(passwordInput, this);
        });
        
        toggleConfirmPassword.addEventListener('click', function() {
            togglePasswordVisibility(confirmPasswordInput, this);
        });
        
        // Form submission
        signupForm.addEventListener('submit', handleSignup);
        
        // Real-time validation
        fullNameInput.addEventListener('input', validateName);
        emailInput.addEventListener('input', validateEmail);
        passwordInput.addEventListener('input', validatePassword);
        confirmPasswordInput.addEventListener('input', validateConfirmPassword);
        
        // Social signup buttons
        document.querySelector('.google-btn').addEventListener('click', () => {
            showNotification('Google signup integration coming soon!', 'info');
        });
        
        document.querySelector('.facebook-btn').addEventListener('click', () => {
            showNotification('Facebook signup integration coming soon!', 'info');
        });
        

        
        console.log('Signup page initialized successfully!');
    }
    
    function togglePasswordVisibility(input, button) {
        const type = input.type === 'password' ? 'text' : 'password';
        input.type = type;
        
        const icon = button.querySelector('i');
        if (type === 'password') {
            icon.className = 'fas fa-eye';
        } else {
            icon.className = 'fas fa-eye-slash';
        }
    }
    
    function validateName() {
        const name = fullNameInput.value.trim();
        const nameError = document.getElementById('nameError');
        
        if (name === '') {
            clearValidation(fullNameInput, nameError);
            return false;
        }
        
        if (name.length < 2) {
            showFieldError(fullNameInput, nameError, 'Name must be at least 2 characters');
            return false;
        }
        
        if (!/^[a-zA-Z\s]+$/.test(name)) {
            showFieldError(fullNameInput, nameError, 'Name can only contain letters and spaces');
            return false;
        }
        
        showFieldSuccess(fullNameInput, nameError);
        return true;
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
        
        // Check if email already exists (demo check)
        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        if (existingUsers.some(user => user.email === email)) {
            showFieldError(emailInput, emailError, 'Email already exists. Please use a different email.');
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
        
        if (password.length < 8) {
            showFieldError(passwordInput, passwordError, 'Password must be at least 8 characters');
            return false;
        }
        
        // Check for at least one uppercase, one lowercase, and one number
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        
        if (!hasUppercase || !hasLowercase || !hasNumber) {
            showFieldError(passwordInput, passwordError, 'Password must contain uppercase, lowercase, and number');
            return false;
        }
        
        showFieldSuccess(passwordInput, passwordError);
        
        // Also validate confirm password if it has a value
        if (confirmPasswordInput.value) {
            validateConfirmPassword();
        }
        
        return true;
    }
    
    function validateConfirmPassword() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const confirmPasswordError = document.getElementById('confirmPasswordError');
        
        if (confirmPassword === '') {
            clearValidation(confirmPasswordInput, confirmPasswordError);
            return false;
        }
        
        if (password !== confirmPassword) {
            showFieldError(confirmPasswordInput, confirmPasswordError, 'Passwords do not match');
            return false;
        }
        
        showFieldSuccess(confirmPasswordInput, confirmPasswordError);
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
    
    async function handleSignup(e) {
        e.preventDefault();
        
        const fullName = fullNameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const agreeTerms = document.getElementById('agreeTerms').checked;
        
        // Validate all inputs
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        
        if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
            showNotification('Please fix the errors above', 'error');
            return;
        }
        
        if (!agreeTerms) {
            showNotification('Please agree to the Terms of Service and Privacy Policy', 'error');
            return;
        }
        
        // Show loading state
        setLoadingState(true);
        
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Create new user
            const newUser = {
                id: Date.now(),
                fullName: fullName,
                email: email,
                password: password, // In real app, this would be hashed
                role: 'user',
                createdAt: new Date().toISOString(),
                isActive: true
            };
            
            // Store user in localStorage (demo purposes)
            const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            existingUsers.push(newUser);
            localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
            
            // Success
            showNotification('Account created successfully! You can now sign in.', 'success');
            
            // Reset form
            signupForm.reset();
            document.querySelectorAll('.form-group input').forEach(input => {
                input.classList.remove('success', 'error');
            });
            document.querySelectorAll('.error-message').forEach(error => {
                error.classList.remove('show');
            });
            
            // Redirect to login page
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            
        } catch (error) {
            console.error('Signup error:', error);
            showNotification('Account creation failed. Please try again.', 'error');
        } finally {
            setLoadingState(false);
        }
    }
    
    function setLoadingState(loading) {
        const btnText = signupBtn.querySelector('.btn-text');
        const btnLoader = signupBtn.querySelector('.btn-loader');
        
        if (loading) {
            btnText.style.opacity = '0';
            btnLoader.style.display = 'block';
            signupBtn.disabled = true;
        } else {
            btnText.style.opacity = '1';
            btnLoader.style.display = 'none';
            signupBtn.disabled = false;
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
    

    
    // Password strength indicator
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = calculatePasswordStrength(password);
        showPasswordStrength(strength);
    });
    
    function calculatePasswordStrength(password) {
        let strength = 0;
        
        if (password.length >= 8) strength += 1;
        if (password.length >= 12) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        return strength;
    }
    
    function showPasswordStrength(strength) {
        const strengthLevels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
        const strengthColors = ['#e74c3c', '#e67e22', '#f39c12', '#3498db', '#27ae60', '#16a085'];
        
        let strengthIndicator = document.getElementById('passwordStrength');
        if (!strengthIndicator) {
            strengthIndicator = document.createElement('div');
            strengthIndicator.id = 'passwordStrength';
            strengthIndicator.style.cssText = 'margin-top: 5px; font-size: 12px; font-weight: 600;';
            passwordInput.parentNode.parentNode.appendChild(strengthIndicator);
        }
        
        const level = Math.max(0, Math.min(strength, 5));
        strengthIndicator.textContent = `Password Strength: ${strengthLevels[level]}`;
        strengthIndicator.style.color = strengthColors[level];
    }
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