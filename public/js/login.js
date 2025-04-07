document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');
    const loginBtn = document.getElementById('loginBtn');

    // Function to show error message
    function showError(message, field = null) {
        // Remove any existing error messages
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        const errorContainer = document.createElement('div');
        errorContainer.className = 'error-message';
        errorContainer.textContent = message;

        if (field) {
            const input = document.getElementById(field);
            if (input) {
                input.classList.add('error');
                input.parentNode.insertBefore(errorContainer, input.nextSibling);
            } else {
                loginForm.insertBefore(errorContainer, loginForm.firstChild);
            }
        } else {
            loginForm.insertBefore(errorContainer, loginForm.firstChild);
        }
    }

    // Function to handle resending verification email
    async function resendVerificationEmail(email) {
        try {
            const response = await fetch('http://localhost:5000/api/auth/resend-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to resend verification email');
            }

            showError('Verification email sent. Please check your inbox.', 'email');
        } catch (error) {
            showError(error.message);
        }
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            loginBtn.disabled = true;
            loginBtn.textContent = 'Logging in...';

            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Store token and user data
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Show success message
                messageDiv.innerHTML = `
                    <div class="alert success">
                        <i class="fas fa-check-circle"></i>
                        Login successful! Redirecting...
                    </div>
                `;

                // Redirect based on role
                setTimeout(() => {
                    if (data.user.role === 'founder') {
                        window.location.href = '/founder-dashboard.html';
                    } else {
                        window.location.href = '/developer-dashboard.html';
                    }
                }, 1500);
            } else {
                throw new Error(data.message || 'Login failed');
            }
        } catch (error) {
            messageDiv.innerHTML = `
                <div class="alert danger">
                    <i class="fas fa-exclamation-circle"></i>
                    ${error.message}
                </div>
            `;
        } finally {
            loginBtn.disabled = false;
            loginBtn.textContent = 'Login';
        }
    });

    // Add input validation
    const inputs = document.querySelectorAll('input[required]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.classList.remove('error');
                const errorMessage = this.parentNode.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.remove();
                }
            }
        });
    });
}); 