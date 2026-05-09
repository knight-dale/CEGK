document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });

    // Form Handling
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('.submit-btn');
        
        // Mock success state
        submitBtn.textContent = 'Message Sent ✓';
        submitBtn.style.background = '#2D6A2F';
        
        setTimeout(() => {
            submitBtn.textContent = 'Send Message';
            submitBtn.style.background = '';
            contactForm.reset();
        }, 3000);
    });
});

window.addEventListener('scroll', () => {
  const navMenu = document.querySelector('.nav-menu');
  // Darken further on scroll to maintain contrast over white sections
  if (window.scrollY > 100) {
    navMenu.style.background = 'rgba(0, 0, 0, 0.95)';
    navMenu.style.borderColor = 'rgba(255, 255, 255, 0.2)';
  } else {
    navMenu.style.background = 'rgba(17, 23, 16, 0.85)';
    navMenu.style.borderColor = 'rgba(255, 255, 255, 0.1)';
  }
});