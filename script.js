document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const nav = document.querySelector('nav');
    let lastScrollY = window.pageYOffset;

    hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    window.addEventListener('scroll', () => {
        const currentScrollY = window.pageYOffset;

        if (currentScrollY > lastScrollY && currentScrollY > 80) {
            nav.classList.add('nav-hidden');
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        } else {
            nav.classList.remove('nav-hidden');
        }

        lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
    }, { passive: true });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
});