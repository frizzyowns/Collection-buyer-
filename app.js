document.getElementById('submissionForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const confirmation = document.getElementById('confirmation');
    const submissionId = Math.floor(Math.random() * 10000);
    confirmation.style.display = 'block';
    confirmation.innerHTML = `
        <h3>Submission Received!</h3>
        <p>Your submission ID is <strong>#${submissionId}</strong></p>
        <p>Please include this number in your package.</p>
        <p>Ship your collection to:<br><strong>Your Business Name<br>123 Card Lane<br>Cardtown, CA 90210</strong></p>
        <p>We’ll review your cards and send payment within 5 business days.</p>
    `;
    this.reset();
});
