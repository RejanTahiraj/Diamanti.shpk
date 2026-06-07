// Select Service Function
function selectService(serviceName) {
    // Scroll to contact form
    const contactSection = document.getElementById('kontakti');
    contactSection.scrollIntoView({ behavior: 'smooth' });
    
    // Fill the service field
    setTimeout(() => {
        document.getElementById('sherbimi').value = serviceName;
        // Focus on the message field
        document.getElementById('mesazhi').focus();
    }, 500);
}

// Handle Form Submission
function handleSubmit(event) {
    event.preventDefault();
    
    const emri = document.getElementById('emri').value;
    const email = document.getElementById('email').value;
    const telefon = document.getElementById('telefon').value;
    const sherbimi = document.getElementById('sherbimi').value;
    const mesazhi = document.getElementById('mesazhi').value;
    
    // Validation
    if (!emri || !email || !mesazhi) {
        alert('Të lutem plotëso të gjitha fushat e detyrueshëm!');
        return;
    }
    
    if (!sherbimi) {
        alert('Të lutem zgjedh një shërbim!');
        return;
    }
    
    // Create message body
    const message = `
    Emri: ${emri}
    Email: ${email}
    Telefon: ${telefon}
    Shërbimi: ${sherbimi}
    Mesazhi: ${mesazhi}
    `;
    
    // Send via mailto (you can replace this with a real backend service)
    const mailtoLink = `mailto:info@diamanti.shpk?subject=Kërkesë për Shërbim - ${sherbimi}&body=${encodeURIComponent(message)}`;
    
    // Show success message
    alert('Mesazhi juaj u dërgua me sukses! Do t'ju kontaktojmë sa më shpejt.');
    
    // Reset form
    document.getElementById('contactForm').reset();
    
    // In a real application, you would use fetch() or XMLHttpRequest to send data to a backend
    // For now, we'll just open the email client
    window.location.href = mailtoLink;
}

// Additional: You can add this for better UX
document.addEventListener('DOMContentLoaded', () => {
    console.log('Diamanti.shpk aplikacioni është ngarkuar');
});
