document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.signup-form');
    const steps = document.querySelectorAll('.form-step');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const roleCards = document.querySelectorAll('.role-card');
    
    let currentStep = 1;
    let selectedRole = null;

    // Initialize form
    updateNavigation();

    // Role selection
    roleCards.forEach(card => {
        card.addEventListener('click', () => {
            roleCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedRole = card.dataset.role;
            nextBtn.disabled = false;
        });
    });

    // Navigation buttons
    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateSteps();
            updateNavigation();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            if (currentStep < steps.length) {
                currentStep++;
                updateSteps();
                updateNavigation();
            } else {
                submitForm();
            }
        }
    });

    function updateSteps() {
        steps.forEach((step, index) => {
            if (index + 1 === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Show role-specific step
        if (currentStep === 3) {
            document.getElementById('step3-founder').style.display = selectedRole === 'founder' ? 'block' : 'none';
            document.getElementById('step3-developer').style.display = selectedRole === 'developer' ? 'block' : 'none';
        }
    }

    function updateNavigation() {
        prevBtn.style.display = currentStep === 1 ? 'none' : 'block';
        nextBtn.textContent = currentStep === steps.length ? 'Submit' : 'Next';
        
        if (currentStep === 1) {
            nextBtn.disabled = !selectedRole;
        }
    }

    function validateStep(step) {
        const currentStepElement = steps[step - 1];
        const inputs = currentStepElement.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });

        return isValid;
    }

    function submitForm() {
        const formData = {
            role: selectedRole,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            name: document.getElementById('name').value
        };

        if (selectedRole === 'founder') {
            formData.companyName = document.getElementById('company-name').value;
            formData.projectBudget = document.getElementById('project-budget').value;
            formData.projectDescription = document.getElementById('project-description').value;
            formData.techStack = document.getElementById('tech-stack').value;
        } else {
            formData.primarySkills = document.getElementById('primary-skills').value;
            formData.experience = document.getElementById('experience').value;
            formData.portfolio = document.getElementById('portfolio').value;
            formData.hourlyRate = document.getElementById('hourly-rate').value;
        }

        // Here you would typically send the data to your backend
        console.log('Form submitted:', formData);
        
        // Show success message
        form.innerHTML = `
            <div class="success-message">
                <h2>Welcome to VibeSwipe! 🎉</h2>
                <p>Your account has been created successfully.</p>
                <p>We've sent a verification email to ${formData.email}.</p>
                <a href="/" class="btn-primary">Continue to Dashboard</a>
            </div>
        `;
    }

    // Add input validation
    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('error');
        });
    });
}); 