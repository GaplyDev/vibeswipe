document.addEventListener('DOMContentLoaded', function() {
    const verificationStatus = document.getElementById('verificationStatus');
    const verificationResult = document.getElementById('verificationResult');
    const verificationError = document.getElementById('verificationError');
    const errorMessage = document.getElementById('errorMessage');

    // Get token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        showError('No verification token provided');
        return;
    }

    // Verify email
    verifyEmail(token);

    async function verifyEmail(token) {
        try {
            const response = await fetch(`/api/auth/verify-email/${token}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Verification failed');
            }

            // Show success
            verificationStatus.style.display = 'none';
            verificationResult.style.display = 'block';
        } catch (error) {
            showError(error.message);
        }
    }

    function showError(message) {
        verificationStatus.style.display = 'none';
        verificationError.style.display = 'block';
        errorMessage.textContent = message;
    }
}); 