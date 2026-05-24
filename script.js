document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const nav = document.querySelector('nav');
    const contactForm = document.getElementById('contactForm');
    const contactBtn = document.getElementById('submit-btn');
    const commentForm = document.getElementById('commentForm');
    const commentBtn = document.getElementById('comment-submit-btn');
    const recentCommentsContainer = document.getElementById('recent-comments-container');
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbw0sswOt4GEh8Bu1P8f1O7GfgdPy1qN8Bx6TQNIMxAtHAQ7Buu0_npOtsTTaFeNCKfR-g/exec';
    let lastScrollY = window.pageYOffset;

    const orderForm = document.getElementById('orderForm');
    const orderSubmitBtn = document.getElementById('submitBtn');
    const quantitySelect = document.getElementById('quantity');
    const totalAmountSpan = document.getElementById('totalAmount');
    const paymentAmountStrong = document.getElementById('paymentAmount');
    const copyBusinessBtn = document.getElementById('copyBusinessNo');
    const copyAccountBtn = document.getElementById('copyAccountNo');

    const fetchComments = () => {
        if (!recentCommentsContainer) return;
        fetch(GOOGLE_SHEET_URL)
            .then(res => res.json())
            .then(response => {
                const data = response.data || [];
                recentCommentsContainer.innerHTML = '';
                data.reverse().forEach(item => {
                    const date = new Date(item.timestamp).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                    const card = document.createElement('div');
                    card.className = 'comment-card animate-on-scroll';
                    card.innerHTML = `
                        <div class="comment-header">
                            <strong>${item.name || 'Anonymous'}</strong>
                            <span>${date}</span>
                        </div>
                        <p>${item.comment}</p>
                        ${item.email ? `<small>${item.email}</small>` : ''}
                    `;
                    recentCommentsContainer.appendChild(card);
                });
            })
            .catch(err => console.error('Fetch error:', err));
    };

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

    if (contactForm && contactBtn) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            contactBtn.textContent = 'Sending...';
            contactBtn.disabled = true;
            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(object)
            })
            .then(async (response) => {
                if (response.status == 200) {
                    contactBtn.textContent = 'Message Sent ✓';
                    contactBtn.style.background = '#2D6A2F';
                    contactForm.reset();
                } else {
                    contactBtn.textContent = 'Error. Try Again';
                }
            })
            .catch(() => { contactBtn.textContent = 'Network Error'; })
            .finally(() => {
                setTimeout(() => {
                    contactBtn.textContent = 'Send Message →';
                    contactBtn.disabled = false;
                    contactBtn.style.background = '';
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
            if (!formData.get('name').trim()) { formData.set('name', 'Anonymous'); }
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
                setTimeout(fetchComments, 1500);
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

    if (quantitySelect) {
        quantitySelect.addEventListener('change', (e) => {
            const val = e.target.value;
            const cost = val * 800;
            const formattedCost = `KSH ${cost.toLocaleString()}`;
            if (totalAmountSpan) totalAmountSpan.textContent = formattedCost;
            if (paymentAmountStrong) paymentAmountStrong.textContent = formattedCost;
        });
    }

    const setupCopy = (btn, textToCopy) => {
        if (!btn) return;
        btn.addEventListener('click', () => {
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalHtml = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> Copied';
                setTimeout(() => { btn.innerHTML = originalHtml; }, 2000);
            });
        });
    };

    setupCopy(copyBusinessBtn, '880100');
    setupCopy(copyAccountBtn, '9676730018');

    if (orderForm && orderSubmitBtn) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            orderSubmitBtn.textContent = 'Processing Order...';
            orderSubmitBtn.disabled = true;

            const formData = new FormData(orderForm);
            const formObject = Object.fromEntries(formData);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formObject)
            })
            .then(async (response) => {
                if (response.status === 200) {
                    orderSubmitBtn.textContent = 'Order Submitted ✓';
                    orderSubmitBtn.style.backgroundColor = '#15803d';
                    orderForm.reset();
                    if (totalAmountSpan) totalAmountSpan.textContent = 'KSH 800';
                    if (paymentAmountStrong) paymentAmountStrong.textContent = 'KSH 800';
                } else {
                    orderSubmitBtn.textContent = 'Submission Failed. Try Again';
                }
            })
            .catch(() => {
                orderSubmitBtn.textContent = 'Network Error';
            })
            .finally(() => {
                setTimeout(() => {
                    orderSubmitBtn.innerHTML = '<i class="fas fa-paper-plane"></i>Submit Order';
                    orderSubmitBtn.disabled = false;
                    orderSubmitBtn.style.backgroundColor = '';
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

    const observeNewElements = () => {
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            if (el.style.opacity !== '1') {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'all 0.6s ease-out';
                observer.observe(el);
            }
        });
    };

    observeNewElements();
    fetchComments();
});