document.addEventListener('DOMContentLoaded', function () {

  var hamburger = document.getElementById('hamburger');
  var navMenu = document.getElementById('navMenu');
  var nav = document.querySelector('nav');
  var lastScrollY = window.pageYOffset;

  var GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbw0sswOt4GEh8Bu1P8f1O7GfgdPy1qN8Bx6TQNIMxAtHAQ7Buu0_npOtsTTaFeNCKfR-g/exec';

  var contactForm = document.getElementById('contactForm');
  var contactBtn = document.getElementById('submit-btn');
  var contactStatus = document.getElementById('contactStatus');

  var commentForm = document.getElementById('commentForm');
  var commentBtn = document.getElementById('comment-submit-btn');
  var recentCommentsContainer = document.getElementById('recent-comments-container');

  var orderForm = document.getElementById('orderForm');
  var orderSubmitBtn = document.getElementById('submitBtn');
  var orderStatus = document.getElementById('orderStatus');
  var quantitySelect = document.getElementById('quantity');
  var totalAmountSpan = document.getElementById('totalAmount');
  var paymentAmountStrong = document.getElementById('paymentAmount');
  var copyBusinessBtn = document.getElementById('copyBusinessNo');
  var copyAccountBtn = document.getElementById('copyAccountNo');

  var observer = null;
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
  }

  function observeAnimatable() {
    var targets = document.querySelectorAll('.animate-on-scroll, .obj-card, .gallery-item, .comment-card');
    targets.forEach(function (el) {
      if (el.classList.contains('in-view')) return;
      if (observer) {
        observer.observe(el);
      } else {
        el.classList.add('in-view');
      }
    });
  }

  observeAnimatable();

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function (e) {
      e.preventDefault();
      hamburger.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  window.addEventListener('scroll', function () {
    if (!nav) return;
    var currentScrollY = window.pageYOffset;
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      nav.classList.add('nav-hidden');
      if (hamburger) hamburger.classList.remove('open');
      if (navMenu) navMenu.classList.remove('open');
    } else {
      nav.classList.remove('nav-hidden');
    }
    lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
  }, { passive: true });

  function escapeHtml(value) {
    var div = document.createElement('div');
    div.textContent = value || '';
    return div.innerHTML;
  }

  function fetchComments() {
    if (!recentCommentsContainer) return;
    fetch(GOOGLE_SHEET_URL)
      .then(function (res) { return res.json(); })
      .then(function (response) {
        var data = response.data || [];
        recentCommentsContainer.innerHTML = '';
        if (!data.length) {
          recentCommentsContainer.innerHTML = '<div class="comment-empty">No comments yet. Be the first to share your thoughts.</div>';
          return;
        }
        data.reverse().forEach(function (item) {
          var dateLabel = '';
          if (item.timestamp) {
            var d = new Date(item.timestamp);
            if (!isNaN(d.getTime())) {
              dateLabel = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            }
          }
          var card = document.createElement('div');
          card.className = 'comment-card';
          card.innerHTML =
            '<div class="comment-card-head">' +
            '<span class="comment-author"><i class="fas fa-user-circle"></i>' + escapeHtml(item.name || 'Anonymous') + '</span>' +
            '<span class="comment-time">' + escapeHtml(dateLabel) + '</span>' +
            '</div>' +
            '<p class="comment-text">' + escapeHtml(item.comment) + '</p>';
          recentCommentsContainer.appendChild(card);
        });
        observeAnimatable();
      })
      .catch(function (err) { console.error('Fetch error:', err); });
  }

  if (contactForm && contactBtn) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      contactBtn.innerHTML = 'Sending…';
      contactBtn.disabled = true;
      if (contactStatus) contactStatus.className = 'form-status';

      var formData = new FormData(contactForm);
      var payload = Object.fromEntries(formData);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (response) {
          if (response.status === 200) {
            contactBtn.innerHTML = 'Message Sent <i class="fas fa-check"></i>';
            contactBtn.style.background = '#1f8a4c';
            contactForm.reset();
            if (contactStatus) {
              contactStatus.textContent = 'Message sent. We will be in touch shortly.';
              contactStatus.className = 'form-status show success';
            }
          } else {
            contactBtn.innerHTML = 'Error. Try Again';
            if (contactStatus) {
              contactStatus.textContent = 'Something went wrong. Please try again.';
              contactStatus.className = 'form-status show error';
            }
          }
        })
        .catch(function () {
          contactBtn.innerHTML = 'Network Error';
          if (contactStatus) {
            contactStatus.textContent = 'Network error. Please check your connection and try again.';
            contactStatus.className = 'form-status show error';
          }
        })
        .finally(function () {
          setTimeout(function () {
            contactBtn.innerHTML = 'Send Message <i class="fas fa-arrow-right"></i>';
            contactBtn.disabled = false;
            contactBtn.style.background = '';
          }, 4000);
        });
    });
  }

  if (commentForm && commentBtn) {
    commentForm.addEventListener('submit', function (e) {
      e.preventDefault();
      commentBtn.innerHTML = 'Posting…';
      commentBtn.disabled = true;

      var formData = new FormData(commentForm);
      if (!formData.get('name') || !formData.get('name').trim()) {
        formData.set('name', 'Anonymous');
      }
      var params = new URLSearchParams(formData);

      fetch(GOOGLE_SHEET_URL, { method: 'POST', mode: 'no-cors', body: params })
        .then(function () {
          commentBtn.innerHTML = 'Comment Posted <i class="fas fa-check"></i>';
          commentBtn.style.background = '#1f8a4c';
          commentForm.reset();
          setTimeout(fetchComments, 1500);
        })
        .catch(function () {
          commentBtn.innerHTML = 'Error. Try Again';
        })
        .finally(function () {
          setTimeout(function () {
            commentBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Comment';
            commentBtn.disabled = false;
            commentBtn.style.background = '';
          }, 4000);
        });
    });
  }

  if (quantitySelect) {
    quantitySelect.addEventListener('change', function (e) {
      var val = parseInt(e.target.value, 10) || 1;
      var cost = val * 800;
      var formatted = 'KSH ' + cost.toLocaleString();
      if (totalAmountSpan) totalAmountSpan.textContent = formatted;
      if (paymentAmountStrong) paymentAmountStrong.textContent = formatted;
    });
  }

  function setupCopy(btn, textToCopy) {
    if (!btn) return;
    btn.addEventListener('click', function () {
      navigator.clipboard.writeText(textToCopy).then(function () {
        var originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied';
        setTimeout(function () { btn.innerHTML = originalHtml; }, 2000);
      });
    });
  }

  setupCopy(copyBusinessBtn, '880100');
  setupCopy(copyAccountBtn, '9676730018');

  if (orderForm && orderSubmitBtn) {
    orderForm.addEventListener('submit', function (e) {
      e.preventDefault();
      orderSubmitBtn.innerHTML = 'Processing Order…';
      orderSubmitBtn.disabled = true;
      if (orderStatus) orderStatus.className = 'form-status';

      var formData = new FormData(orderForm);
      var payload = Object.fromEntries(formData);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (response) {
          if (response.status === 200) {
            orderSubmitBtn.innerHTML = 'Order Submitted <i class="fas fa-check"></i>';
            orderSubmitBtn.style.backgroundColor = '#1f8a4c';
            orderForm.reset();
            if (totalAmountSpan) totalAmountSpan.textContent = 'KSH 800';
            if (paymentAmountStrong) paymentAmountStrong.textContent = 'KSH 800';
            if (orderStatus) {
              orderStatus.textContent = 'Order received. Confirm your M-Pesa payment to complete it.';
              orderStatus.className = 'form-status show success';
            }
          } else {
            orderSubmitBtn.innerHTML = 'Submission Failed. Try Again';
            if (orderStatus) {
              orderStatus.textContent = 'Something went wrong. Please try again.';
              orderStatus.className = 'form-status show error';
            }
          }
        })
        .catch(function () {
          orderSubmitBtn.innerHTML = 'Network Error';
          if (orderStatus) {
            orderStatus.textContent = 'Network error. Please check your connection and try again.';
            orderStatus.className = 'form-status show error';
          }
        })
        .finally(function () {
          setTimeout(function () {
            orderSubmitBtn.innerHTML = '<i class="fas fa-paper-plane"></i>Submit Order';
            orderSubmitBtn.disabled = false;
            orderSubmitBtn.style.backgroundColor = '';
          }, 4000);
        });
    });
  }

  fetchComments();

});