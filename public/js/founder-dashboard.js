document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const messageDiv = document.getElementById('message');
    const logoutBtn = document.getElementById('logoutBtn');
    const editProfileBtn = document.getElementById('editProfileBtn');

    // Check if user is authenticated
    if (!token || !user || user.role !== 'founder') {
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
            document.getElementById('companyName').textContent = data.companyName || 'Not specified';
            document.getElementById('projectType').textContent = data.projectType || 'Not specified';
            document.getElementById('projectTimeline').textContent = data.projectTimeline || 'Not specified';
            document.getElementById('budgetRange').textContent = data.budgetRange || 'Not specified';
            document.getElementById('projectDescription').textContent = data.projectDescription || 'Not specified';
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