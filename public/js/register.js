document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const roleButtons = document.querySelectorAll('.role-btn');
    const founderFields = document.getElementById('founderFields');
    const developerFields = document.getElementById('developerFields');
    const messageDiv = document.getElementById('message');
    let selectedRole = null;

    // Role selection
    roleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove selected class from all buttons
            roleButtons.forEach(btn => btn.classList.remove('selected'));
            // Add selected class to clicked button
            this.classList.add('selected');
            // Store selected role
            selectedRole = this.dataset.role;
            
            // Show/hide role-specific fields
            if (selectedRole === 'founder') {
                founderFields.style.display = 'block';
                developerFields.style.display = 'none';
            } else if (selectedRole === 'developer') {
                founderFields.style.display = 'none';
                developerFields.style.display = 'block';
            }
        });
    });

    // Form submission
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!selectedRole) {
            showError('Please select a role');
            return;
        }

        const submitButton = document.getElementById('registerBtn');
        submitButton.disabled = true;
        submitButton.textContent = 'Creating Account...';

        const formData = {
            role: selectedRole,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value
        };

        // Add role-specific data
        if (selectedRole === 'founder') {
            formData.companyName = document.getElementById('companyName').value;
            formData.projectType = document.getElementById('projectType').value;
            formData.projectDescription = document.getElementById('projectDescription').value;
        } else if (selectedRole === 'developer') {
            formData.oneLiner = document.getElementById('oneLiner').value;
            formData.hourlyRate = document.getElementById('hourlyRate').value;
            formData.availability = document.getElementById('availability').value;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // Store token and user data
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Show success message and redirect
                messageDiv.innerHTML = `
                    <div class="alert alert-success">
                        Registration successful! Please check your email for verification.
                    </div>
                `;
                
                setTimeout(() => {
                    window.location.href = '/login.html';
                }, 2000);
            } else {
                showError(data.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            showError('An error occurred. Please try again.');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Create Account';
        }
    });

    // Function to show error message
    function showError(message) {
        messageDiv.innerHTML = `
            <div class="alert alert-danger">
                ${message}
            </div>
        `;
    }
}); 