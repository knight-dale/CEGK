document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const nav = document.querySelector('nav');
    const contactForm = document.getElementById('contactForm');
    const btn = document.getElementById('submit-btn');
    let lastScrollY = window.pageYOffset;

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    window.addEventListener('scroll', () => {
        const currentScrollY = window.pageYOffset;

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            nav.classList.add('nav-hidden');
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        } else {
            nav.classList.remove('nav-hidden');
        }

        lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
    }, { passive: true });

    if (contactForm && btn) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            btn.textContent = 'Sending...';
            btn.disabled = true;

            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                const result = await response.json();
                if (response.status == 200) {
                    btn.textContent = 'Message Sent ✓';
                    btn.style.background = '#2D6A2F';
                    contactForm.reset();
                } else {
                    console.error("Web3Forms Error:", result.message);
                    btn.textContent = 'Error: ' + result.message;
                }
            })
            .catch(() => {
                btn.textContent = 'Network Error';
            })
            .finally(() => {
                setTimeout(() => {
                    btn.textContent = 'Send Message →';
                    btn.disabled = false;
                    btn.style.background = '';
                }, 4000);
            });
        });
    }

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
});