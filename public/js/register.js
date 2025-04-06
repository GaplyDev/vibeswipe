document.addEventListener('DOMContentLoaded', function() {
    // Initialize form variables
    let currentStep = 1;
    let selectedRole = null;
    let formData = {};

    // Check URL for role parameter
    const urlParams = new URLSearchParams(window.location.search);
    const roleParam = urlParams.get('role');
    
    // Role selection
    const roleCards = document.querySelectorAll('.role-card');
    
    function selectRole(role) {
        console.log('Selecting role:', role); // Debug log
        selectedRole = role;
        
        // Update role cards
        roleCards.forEach(card => {
            if (card.dataset.role === role) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });

        // Enable next button
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) {
            nextBtn.disabled = false;
        }

        // Show/hide role-specific sections
        const founderProfile = document.getElementById('founderProfile');
        const developerProfile = document.getElementById('developerProfile');
        const founderPreferences = document.getElementById('founderPreferences');
        const developerPreferences = document.getElementById('developerPreferences');

        if (role === 'founder') {
            if (founderProfile) founderProfile.style.display = 'block';
            if (developerProfile) developerProfile.style.display = 'none';
            if (founderPreferences) founderPreferences.style.display = 'block';
            if (developerPreferences) developerPreferences.style.display = 'none';
        } else if (role === 'developer') {
            if (founderProfile) founderProfile.style.display = 'none';
            if (developerProfile) developerProfile.style.display = 'block';
            if (founderPreferences) founderPreferences.style.display = 'none';
            if (developerPreferences) developerPreferences.style.display = 'block';
        }
    }

    // Handle role selection from URL
    if (roleParam && (roleParam === 'founder' || roleParam === 'developer')) {
        // Select the role
        selectRole(roleParam);
    }

    // Add click handlers for role cards
    roleCards.forEach(card => {
        card.addEventListener('click', function() {
            const role = this.dataset.role;
            selectRole(role);
        });
    });

    // Technology search and selection
    const techSearch = document.getElementById('techSearch');
    const techSearchResults = document.getElementById('techSearchResults');
    const selectedTechnologies = document.getElementById('selectedTechnologies');
    let selectedTechs = new Set();

    // Comprehensive technology list
    const technologies = [
        // Frontend
        'React', 'Vue.js', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'Gatsby', 'Remix',
        'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Sass', 'Less', 'Tailwind CSS',
        'Bootstrap', 'Material-UI', 'Chakra UI', 'Styled Components', 'Emotion',
        
        // Backend
        'Node.js', 'Express', 'NestJS', 'Python', 'Django', 'Flask', 'FastAPI',
        'Java', 'Spring Boot', 'PHP', 'Laravel', 'Symfony', 'Ruby', 'Ruby on Rails',
        'Go', 'Gin', 'Echo', 'Rust', 'Actix', 'Rocket', 'C#', '.NET', 'ASP.NET',
        
        // Mobile
        'React Native', 'Flutter', 'Swift', 'SwiftUI', 'Kotlin', 'Android',
        'iOS', 'Xamarin', 'Ionic', 'Cordova', 'PhoneGap',
        
        // Database
        'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle',
        'Microsoft SQL Server', 'Firebase', 'Supabase', 'DynamoDB',
        'Cassandra', 'CouchDB', 'Neo4j', 'Elasticsearch',
        
        // DevOps & Cloud
        'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Terraform',
        'Ansible', 'Jenkins', 'GitLab CI', 'GitHub Actions', 'CircleCI',
        'Nginx', 'Apache', 'Linux', 'Bash', 'Shell Scripting',
        
        // AI/ML
        'TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn', 'OpenCV',
        'NLTK', 'SpaCy', 'Hugging Face', 'GPT', 'BERT',
        
        // Blockchain
        'Solidity', 'Web3.js', 'Ethereum', 'Hyperledger', 'IPFS',
        'Truffle', 'Hardhat', 'Ganache',
        
        // Testing
        'Jest', 'Mocha', 'Chai', 'Cypress', 'Selenium',
        'JUnit', 'Pytest', 'RSpec', 'Cucumber',
        
        // Tools & Others
        'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Jira',
        'Confluence', 'Slack', 'VS Code', 'IntelliJ', 'WebStorm',
        'Postman', 'Swagger', 'GraphQL', 'REST API', 'WebSocket',
        'OAuth', 'JWT', 'OAuth2', 'OIDC', 'SAML'
    ];

    if (techSearch) {
        techSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const results = technologies.filter(tech => 
                tech.toLowerCase().includes(searchTerm)
            );

            if (results.length > 0) {
                techSearchResults.innerHTML = results.map(tech => `
                    <div class="tech-option">
                        <label>
                            <input type="checkbox" value="${tech}" 
                                ${selectedTechs.has(tech) ? 'checked' : ''}>
                            ${tech}
                        </label>
                    </div>
                `).join('');
                techSearchResults.classList.add('active');
            } else {
                techSearchResults.innerHTML = '<div class="tech-option">No results found</div>';
                techSearchResults.classList.add('active');
            }
        });

        // Handle technology selection
        techSearchResults.addEventListener('change', function(e) {
            if (e.target.type === 'checkbox') {
                const tech = e.target.value;
                if (e.target.checked) {
                    selectedTechs.add(tech);
                } else {
                    selectedTechs.delete(tech);
                }
                updateSelectedTechnologies();
            }
        });

        // Close search results when clicking outside
        document.addEventListener('click', function(e) {
            if (!techSearch.contains(e.target) && !techSearchResults.contains(e.target)) {
                techSearchResults.classList.remove('active');
            }
        });
    }

    function updateSelectedTechnologies() {
        selectedTechnologies.innerHTML = Array.from(selectedTechs).map(tech => `
            <div class="tech-tag">
                ${tech}
                <button type="button" onclick="removeTechnology('${tech}')">×</button>
            </div>
        `).join('');
    }

    // Make removeTechnology function globally available
    window.removeTechnology = function(tech) {
        selectedTechs.delete(tech);
        updateSelectedTechnologies();
        // Update checkbox in search results
        const checkbox = techSearchResults.querySelector(`input[value="${tech}"]`);
        if (checkbox) {
            checkbox.checked = false;
        }
    };

    // Password strength indicator
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const strengthBar = document.querySelector('.strength-bar');
            const strengthText = document.querySelector('.strength-text');
            const password = this.value;

            let strength = 0;
            if (password.length >= 8) strength++;
            if (password.match(/[A-Z]/)) strength++;
            if (password.match(/[0-9]/)) strength++;
            if (password.match(/[^A-Za-z0-9]/)) strength++;

            const width = (strength / 4) * 100;
            strengthBar.style.width = width + '%';

            let text = '';
            let color = '';
            switch (strength) {
                case 0:
                case 1:
                    text = 'Weak';
                    color = 'var(--error-color)';
                    break;
                case 2:
                    text = 'Medium';
                    color = 'var(--warning-color)';
                    break;
                case 3:
                case 4:
                    text = 'Strong';
                    color = 'var(--success-color)';
                    break;
            }

            strengthBar.style.backgroundColor = color;
            strengthText.textContent = text;
            strengthText.style.color = color;
        });
    }

    // Founder Preferences Functionality
    const addReferenceBtn = document.getElementById('addReferenceBtn');
    const referenceInputs = document.querySelector('.reference-inputs');
    const projectFiles = document.getElementById('projectFiles');
    const filePreview = document.getElementById('filePreview');
    const enhancePrdBtn = document.getElementById('enhancePrdBtn');
    const suggestTechBtn = document.getElementById('suggestTechBtn');
    const projectDescription = document.getElementById('projectDescription');
    const projectType = document.getElementById('projectType');

    // Add reference functionality
    if (addReferenceBtn) {
        addReferenceBtn.addEventListener('click', function() {
            const referenceItem = document.createElement('div');
            referenceItem.className = 'reference-item';
            referenceItem.innerHTML = `
                <input type="url" placeholder="Competitor/Reference URL" class="reference-url">
                <input type="text" placeholder="Notes about this reference" class="reference-notes">
                <button type="button" class="btn remove-btn">×</button>
            `;
            referenceInputs.appendChild(referenceItem);

            // Add remove functionality
            const removeBtn = referenceItem.querySelector('.remove-btn');
            removeBtn.addEventListener('click', function() {
                referenceItem.remove();
            });
        });
    }

    // File upload functionality
    if (projectFiles) {
        projectFiles.addEventListener('change', handleFileSelect);
        
        // Drag and drop functionality
        const fileUploadContainer = document.querySelector('.file-upload-container');
        fileUploadContainer.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });

        fileUploadContainer.addEventListener('dragleave', function() {
            this.classList.remove('dragover');
        });

        fileUploadContainer.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            projectFiles.files = e.dataTransfer.files;
            handleFileSelect({ target: projectFiles });
        });
    }

    function handleFileSelect(e) {
        const files = e.target.files;
        filePreview.innerHTML = '';

        Array.from(files).forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-preview-item';
            fileItem.innerHTML = `
                <span>${file.name}</span>
                <button type="button" class="remove-file">×</button>
            `;

            const removeBtn = fileItem.querySelector('.remove-file');
            removeBtn.addEventListener('click', function() {
                fileItem.remove();
                // TODO: Remove file from FileList
            });

            filePreview.appendChild(fileItem);
        });
    }

    // AI Enhancement functionality
    if (enhancePrdBtn) {
        enhancePrdBtn.addEventListener('click', function() {
            const description = projectDescription.value;
            if (!description.trim()) {
                alert('Please enter a project description first');
                return;
            }

            // Show loading state
            enhancePrdBtn.disabled = true;
            enhancePrdBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enhancing...';

            // TODO: Call AI enhancement API
            setTimeout(() => {
                // Simulate AI enhancement
                const enhancedDescription = description + '\n\nEnhanced with AI suggestions...';
                projectDescription.value = enhancedDescription;
                
                // Reset button
                enhancePrdBtn.disabled = false;
                enhancePrdBtn.innerHTML = '<i class="fas fa-magic"></i> Enhance with AI';
            }, 2000);
        });
    }

    // Tech Stack Suggestion functionality
    if (suggestTechBtn) {
        suggestTechBtn.addEventListener('click', function() {
            const type = projectType.value;
            if (!type) {
                alert('Please select a project type first');
                return;
            }

            // Show loading state
            suggestTechBtn.disabled = true;
            suggestTechBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Suggesting...';

            // TODO: Call tech stack suggestion API
            setTimeout(() => {
                // Simulate tech stack suggestion
                const suggestedTechs = getSuggestedTechStack(type);
                suggestedTechs.forEach(tech => {
                    if (!selectedTechs.has(tech)) {
                        selectedTechs.add(tech);
                    }
                });
                updateSelectedTechnologies();
                
                // Reset button
                suggestTechBtn.disabled = false;
                suggestTechBtn.innerHTML = '<i class="fas fa-lightbulb"></i> Suggest Tech Stack';
            }, 2000);
        });
    }

    function getSuggestedTechStack(type) {
        const techStacks = {
            'mvp-web': ['React', 'Node.js', 'MongoDB', 'AWS'],
            'mvp-mobile': ['React Native', 'Firebase', 'Redux'],
            'mvp-saas': ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe'],
            'mvp-marketplace': ['React', 'Node.js', 'MongoDB', 'Redis'],
            'mvp-ai': ['Python', 'TensorFlow', 'FastAPI', 'PostgreSQL'],
            'mvp-blockchain': ['Solidity', 'Web3.js', 'Ethereum', 'IPFS']
        };
        return techStacks[type] || [];
    }

    // Social Connections
    const socialBtns = document.querySelectorAll('.social-btn');
    const connectedProfiles = document.getElementById('connectedProfiles');
    const connectedAccounts = new Set();

    socialBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const platform = this.classList[2]; // github, linkedin, or twitter
            if (connectedAccounts.has(platform)) {
                return;
            }

            // Show loading state
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';

            // TODO: Implement actual OAuth flow
            setTimeout(() => {
                // Simulate successful connection
                connectedAccounts.add(platform);
                addConnectedProfile(platform);
                
                // Reset button
                this.disabled = false;
                this.innerHTML = `<i class="fab fa-${platform}"></i> Connected`;
                this.classList.add('connected');
            }, 2000);
        });
    });

    function addConnectedProfile(platform) {
        const profile = document.createElement('div');
        profile.className = 'connected-profile';
        profile.innerHTML = `
            <div class="profile-info">
                <i class="fab fa-${platform}"></i>
                <span>${platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
            </div>
            <button type="button" class="remove-profile" data-platform="${platform}">×</button>
        `;

        const removeBtn = profile.querySelector('.remove-profile');
        removeBtn.addEventListener('click', function() {
            const platform = this.dataset.platform;
            connectedAccounts.delete(platform);
            profile.remove();
            
            // Reset connection button
            const btn = document.querySelector(`.social-btn.${platform}`);
            btn.innerHTML = `<i class="fab fa-${platform}"></i> Connect ${platform.charAt(0).toUpperCase() + platform.slice(1)}`;
            btn.classList.remove('connected');
        });

        connectedProfiles.appendChild(profile);
    }

    // Update validation for developer profile
    function validateStep(step) {
        const currentStepElement = document.getElementById(`step${step}`);
        if (!currentStepElement) return false;

        let isValid = true;

        // Role-specific validation
        if (step === 3) {
            if (selectedRole === 'founder') {
                const companyName = document.getElementById('companyName');
                const companySize = document.getElementById('companySize');
                const companyWebsite = document.getElementById('companyWebsite');
                
                if (!companyName || !companySize || !companyWebsite) {
                    console.error('Founder profile elements not found');
                    return false;
                }

                if (!companyName.value.trim()) {
                    isValid = false;
                    companyName.classList.add('error');
                } else {
                    companyName.classList.remove('error');
                }

                if (!companySize.value) {
                    isValid = false;
                    companySize.classList.add('error');
                } else {
                    companySize.classList.remove('error');
                }

                if (!companyWebsite.value.trim()) {
                    isValid = false;
                    companyWebsite.classList.add('error');
                } else {
                    companyWebsite.classList.remove('error');
                }
            } else if (selectedRole === 'developer') {
                const oneLiner = document.getElementById('oneLiner');
                const hourlyRate = document.getElementById('hourlyRate');
                const availability = document.getElementById('availability');
                
                if (!oneLiner || !hourlyRate || !availability) {
                    console.error('Developer profile elements not found');
                    return false;
                }

                if (!oneLiner.value.trim()) {
                    isValid = false;
                    oneLiner.classList.add('error');
                } else {
                    oneLiner.classList.remove('error');
                }

                if (!hourlyRate.value) {
                    isValid = false;
                    hourlyRate.classList.add('error');
                } else {
                    hourlyRate.classList.remove('error');
                }

                if (!availability.value) {
                    isValid = false;
                    availability.classList.add('error');
                } else {
                    availability.classList.remove('error');
                }

                // Require at least one connected social profile
                if (connectedAccounts.size === 0) {
                    isValid = false;
                    document.querySelector('.social-connections').classList.add('error');
                }
            }
        } else {
            // For other steps, validate all required inputs
            const requiredInputs = currentStepElement.querySelectorAll('[required]');
            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });
        }

        // Enable/disable next button based on validation
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) {
            nextBtn.disabled = !isValid;
            if (isValid) {
                nextBtn.classList.remove('disabled');
            } else {
                nextBtn.classList.add('disabled');
            }
        }

        if (step === 4 && selectedRole === 'founder') {
            const projectType = document.getElementById('projectType');
            const projectDescription = document.getElementById('projectDescription');
            const projectTimeline = document.getElementById('projectTimeline');
            const budgetRange = document.getElementById('budgetRange');
            
            if (!projectType.value || !projectDescription.value.trim() || 
                !projectTimeline.value || !budgetRange.value) {
                isValid = false;
                if (!projectType.value) projectType.classList.add('error');
                if (!projectDescription.value.trim()) projectDescription.classList.add('error');
                if (!projectTimeline.value) projectTimeline.classList.add('error');
                if (!budgetRange.value) budgetRange.classList.add('error');
            }
        }

        return isValid;
    }

    // Add input event listeners for real-time validation
    function addInputValidationListeners() {
        const inputs = document.querySelectorAll('input[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.value.trim()) {
                    this.classList.remove('error');
                }
                validateStep(currentStep);
            });
        });

        // Add change event listener for select elements
        const selects = document.querySelectorAll('select[required]');
        selects.forEach(select => {
            select.addEventListener('change', function() {
                if (this.value) {
                    this.classList.remove('error');
                }
                validateStep(currentStep);
            });
        });
    }

    // Form navigation
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');

    // Handle browser back/forward buttons
    window.addEventListener('popstate', function(event) {
        const state = event.state;
        if (state && state.step) {
            currentStep = state.step;
            updateSteps();
        }
    });

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (validateStep(currentStep)) {
                currentStep++;
                updateSteps();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentStep--;
            updateSteps();
        });
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            if (validateStep(currentStep)) {
                submitForm();
            }
        });
    }

    // Update form steps visibility
    function updateSteps() {
        const steps = document.querySelectorAll('.form-step');
        steps.forEach(step => {
            step.classList.remove('active');
        });

        const currentStepElement = document.getElementById(`step${currentStep}`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }

        // Show/hide role-specific sections
        if (currentStep === 3) {
            const founderProfile = document.getElementById('founderProfile');
            const developerProfile = document.getElementById('developerProfile');
            
            if (selectedRole === 'founder') {
                if (founderProfile) founderProfile.style.display = 'block';
                if (developerProfile) developerProfile.style.display = 'none';
            } else if (selectedRole === 'developer') {
                if (founderProfile) founderProfile.style.display = 'none';
                if (developerProfile) developerProfile.style.display = 'block';
            }
        }

        // Update navigation buttons
        prevBtn.style.display = currentStep > 1 ? 'block' : 'none';
        nextBtn.style.display = currentStep < steps.length ? 'block' : 'none';
        submitBtn.style.display = currentStep === steps.length ? 'block' : 'none';

        // Validate current step
        validateStep(currentStep);
    }

    // Submit form
    function submitForm() {
        const formData = {
            role: selectedRole,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value
        };

        if (selectedRole === 'founder') {
            formData.projectType = document.getElementById('projectType').value;
            formData.projectDescription = document.getElementById('projectDescription').value;
            formData.projectTimeline = document.getElementById('projectTimeline').value;
            formData.budgetRange = document.getElementById('budgetRange').value;
            formData.techStack = Array.from(selectedTechs);
            formData.references = Array.from(document.querySelectorAll('.reference-item')).map(item => ({
                url: item.querySelector('.reference-url').value,
                notes: item.querySelector('.reference-notes').value
            }));
        } else if (selectedRole === 'developer') {
            formData.oneLiner = document.getElementById('oneLiner').value;
            formData.hourlyRate = document.getElementById('hourlyRate').value;
            formData.availability = document.getElementById('availability').value;
            formData.technologies = Array.from(selectedTechs);
            formData.socialProfiles = Array.from(connectedAccounts);
        }

        // TODO: Send form data to server
        console.log('Form submitted:', formData);

        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <h2>Registration Successful!</h2>
            <p>Welcome to VibeSwipe! You can now start matching with ${selectedRole === 'founder' ? 'developers' : 'projects'}.</p>
            <a href="/dashboard" class="btn primary">Go to Dashboard</a>
        `;
        document.querySelector('.register-container').innerHTML = '';
        document.querySelector('.register-container').appendChild(successMessage);
    }

    // Initialize form
    updateSteps();
    addInputValidationListeners();
}); 