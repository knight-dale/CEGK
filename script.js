document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const nav = document.querySelector('nav');
    const contactForm = document.getElementById('contactForm');
    const contactBtn = document.getElementById('submit-btn');
    const commentForm = document.getElementById('commentForm');
    const commentBtn = document.getElementById('comment-submit-btn');
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxxw9crERw_S2FYArleKxLcgvZ2VQPk1-KSIsiYiFaq2gVnc_0O-vpBLyYUm7UH-pfq6Q/exec';
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

    if (commentForm && commentBtn) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            commentBtn.textContent = 'Posting...';
            commentBtn.disabled = true;

            const formData = new FormData(commentForm);
            const params = new URLSearchParams(formData);

            fetch(GOOGLE_SHEET_URL, { 
                method: 'POST', 
                mode: 'no-cors',
                body: params 
            })
            .then(() => {
                commentBtn.textContent = 'Comment Posted ✓';
                commentBtn.style.background = '#2D6A2F';
                commentForm.reset();
            })
            .catch(() => { 
                commentBtn.textContent = 'Error. Try Again'; 
            })
            .finally(() => {
                setTimeout(() => {
                    commentBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Comment';
                    commentBtn.disabled = false;
                    commentBtn.style.background = '';
                }, 4000);
            });
        });
    }

    if (commentForm && commentBtn) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            commentBtn.textContent = 'Posting...';
            commentBtn.disabled = true;
            const formData = new FormData(commentForm);
            if (!formData.get('name')) { formData.set('name', 'Anonymous'); }
            fetch(GOOGLE_SHEET_URL, { method: 'POST', body: formData })
            .then(() => {
                commentBtn.textContent = 'Comment Posted ✓';
                commentBtn.style.background = '#2D6A2F';
                commentForm.reset();
            })
            .catch(() => { commentBtn.textContent = 'Error. Try Again'; })
            .finally(() => {
                setTimeout(() => {
                    commentBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Comment';
                    commentBtn.disabled = false;
                    commentBtn.style.background = '';
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