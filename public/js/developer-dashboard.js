document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const messageDiv = document.getElementById('message');
    const logoutBtn = document.getElementById('logoutBtn');
    const editProfileBtn = document.getElementById('editProfileBtn');

    // Check if user is authenticated
    if (!token || !user || user.role !== 'developer') {
        window.location.href = '/login.html';
        return;
    }

    // Load profile data
    const loadProfileData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load profile data');
            }

            const data = await response.json();
            
            // Update profile information
            document.getElementById('oneLiner').textContent = data.oneLiner || 'Not specified';
            document.getElementById('availability').textContent = data.availability || 'Not specified';
            
            const portfolioLink = document.getElementById('portfolioLink');
            if (data.portfolioLink) {
                portfolioLink.href = data.portfolioLink;
                portfolioLink.textContent = data.portfolioLink;
            } else {
                portfolioLink.textContent = 'Not specified';
            }

            // Update tech stack
            const techStackDiv = document.getElementById('techStack');
            if (data.techStack && data.techStack.length > 0) {
                techStackDiv.innerHTML = data.techStack
                    .map(tech => `<span class="tech-tag">${tech}</span>`)
                    .join('');
            } else {
                techStackDiv.textContent = 'Not specified';
            }
        } catch (error) {
            messageDiv.innerHTML = `
                <div class="alert danger">
                    <i class="fas fa-exclamation-circle"></i>
                    ${error.message}
                </div>
            `;
        }
    };

    // Handle logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    });

    // Handle edit profile
    editProfileBtn.addEventListener('click', () => {
        window.location.href = '/edit-profile.html';
    });

    // Load initial profile data
    loadProfileData();
}); 