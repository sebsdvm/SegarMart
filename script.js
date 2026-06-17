const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    const spans = hamburger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    });
  });
}

const filterBtns = document.querySelectorAll('.filter-btn');
if (filterBtns.length > 0) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      const productCards = document.querySelectorAll('#shopGrid .product-card');
      if (productCards.length > 0) {
        productCards.forEach(card => {          const match = filter === 'all' || card.getAttribute('data-cat') === filter;
          card.style.display = match ? '' : 'none';
        });
      }

      const blogCards = document.querySelectorAll('#blogGrid .blog-card');
      if (blogCards.length > 0) {
        blogCards.forEach(card => {
          const match = filter === 'all' || card.getAttribute('data-cat') === filter;
          card.classList.toggle('hidden', !match);
        });
      }
    });
  });
}

const submitBtn  = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

if (submitBtn && formSuccess) {
  submitBtn.addEventListener('click', () => {
    const name    = document.getElementById('name')?.value.trim();
    const email   = document.getElementById('email')?.value.trim();
    const message = document.getElementById('message')?.value.trim();

    if (!name || !email || !message) {
      submitBtn.style.animation = 'none';
      submitBtn.offsetHeight;
      submitBtn.style.transform = 'translateX(-6px)';
      setTimeout(() => { submitBtn.style.transform = ''; }, 150);
      submitBtn.textContent = 'Please fill all required fields';
      setTimeout(() => { submitBtn.textContent = 'Send Message'; }, 2200);
      return;
    }

    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    setTimeout(() => {
      formSuccess.classList.add('visible');
      submitBtn.style.display = 'none';
      ['name','email','subject','message'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
    }, 900);
  });
}
const revealEls = document.querySelectorAll(
  '.value-card, .product-card, .blog-card, .blog-featured__card, .contact-item'
);

if (revealEls.length > 0 && 'IntersectionObserver' in window) {
  revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    observer.observe(el);
  });
} 
