// ★ Paste your API Gateway Invoke URL here
const API_ENDPOINT_URL = 'https://8fi1t8ybj9.execute-api.ap-south-1.amazonaws.com/send';

document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the default form reload

    const form = e.target;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    const statusMsg = document.getElementById('status-message');
    const submitBtn = document.getElementById('submit-btn');

    // Create the data object to send
    const data = {
        name: name,
        email: email,
        phone: phone,
        message: message
    };

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerText = 'Sending...';
    statusMsg.innerText = '';

    // Send the data using the fetch API
    fetch(API_ENDPOINT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        statusMsg.style.color = 'green';
        statusMsg.innerText = 'Message sent successfully!';
        form.reset(); // Clear the form
    })
    .catch((error) => {
        console.error('Error:', error);
        statusMsg.style.color = 'red';
        statusMsg.innerText = 'Error sending message. Please try again.';
    })
    .finally(() => {
        // Re-enable the button
        submitBtn.disabled = false;
        submitBtn.innerText = 'Send';
    });
});