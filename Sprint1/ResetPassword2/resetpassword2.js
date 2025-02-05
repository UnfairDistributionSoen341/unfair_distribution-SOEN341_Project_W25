function handleResetPassword(event) {
    event.preventDefault();
   
   
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

   
    if (newPassword !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return false;
    }

   
    alert("Password has been reset successfully!");


    window.location.href = 'login.html';
}
