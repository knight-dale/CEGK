document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const nav = document.querySelector('nav');
    const contactForm = document.getElementById('contactForm');
    let lastScrollY = window.pageYOffset;

    hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    window.addEventListener('scroll', () => {
        const currentScrollY = window.pageYOffset;

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            nav.classList.add('nav-hidden');
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        } else {
            nav.classList.remove('nav-hidden');
        }

        if (currentScrollY > 100) {
            navMenu.style.background = 'rgba(0, 0, 0, 0.95)';
            navMenu.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        } else {
            navMenu.style.background = 'rgba(17, 23, 16, 0.85)';
            navMenu.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }

        lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
    }, { passive: true });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

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

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.submit-btn');
            submitBtn.textContent = 'Message Sent ✓';
            submitBtn.style.background = '#2D6A2F';
            setTimeout(() => {
                submitBtn.textContent = 'Send Message';
                submitBtn.style.background = '';
                contactForm.reset();
            }, 3000);
        });
    }
});