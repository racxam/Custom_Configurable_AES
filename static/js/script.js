function encrypt() {
    if (!document.getElementById('aesForm').checkValidity()) {
        alert('Please fill in all required fields.');
        return;
    }
    const plaintext = document.getElementById('plaintext').value;
    const keySize = document.getElementById('keySize').value;
    const customNonce = document.getElementById('customNonce').value;
    fetch('/encrypt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            plaintext: plaintext,
            key_size: keySize,
            custom_nonce: customNonce,
        }),
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('results').innerHTML = `
            <p>Ciphertext: ${data.ciphertext}</p>
            <p>Key: ${data.key}</p>
            <p>Nonce: ${data.nonce}</p>
        `;
        })
        .catch(error => console.error('Error:', error));
}

function decrypt() {
    if (!document.getElementById('aesForm').checkValidity()) {
        alert('Please fill in all required fields.');
        return;
    }

    const resultsDiv = document.getElementById('results');
    if (resultsDiv.children.length < 3) {
        alert('Please encrypt the plaintext first.');
        return;
    }

    const ciphertext = resultsDiv.querySelector('p:nth-child(1)').innerText.split(': ')[1];
    const key = resultsDiv.querySelector('p:nth-child(2)').innerText.split(': ')[1];
    const nonce = resultsDiv.querySelector('p:nth-child(3)').innerText.split(': ')[1];
    fetch('/decrypt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            ciphertext: ciphertext,
            key: key,
            nonce: nonce,
        }),
    })
        .then(response => response.json())
        .then(data => {
            resultsDiv.innerHTML += `<p>Decrypted Text: ${data.decrypted_text}</p>`;

            // Reset input fields
            document.getElementById('plaintext').value = '';
            document.getElementById('customNonce').value = '';
            document.getElementById('plaintext').focus(); // Set focus back to plaintext input
        })
        .catch(error => console.error('Error:', error));
}
function togglePasswordVisibility(inputId) {
const input = document.getElementById(inputId);
const isVisible = input.getAttribute('data-visible') === 'true';
input.setAttribute('data-visible', !isVisible);

// Get the eye icon element
const eyeIcon = document.querySelector(`#${inputId} + .toggle-password i`);

// Disable pointer events on the eye icon
eyeIcon.style.pointerEvents = 'none';

// Toggle the eye icon based on visibility
if (isVisible) {
input.type = 'text';
eyeIcon.classList.remove('fa-eye-slash');
eyeIcon.classList.add('fa-eye');
} else {
input.type = 'password';
eyeIcon.classList.remove('fa-eye');
eyeIcon.classList.add('fa-eye-slash');
}

// Enable pointer events on the eye icon after a short delay
setTimeout(() => {
eyeIcon.style.pointerEvents = '';
}, 100);
}
