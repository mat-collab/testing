/* =========================================================
   SwiftBag Logistics — Main Script
   ========================================================= */

(function () {
  'use strict';

  /* ---------- Navbar: scroll behaviour ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ---------- Smooth-scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------- Animated bar chart (Why Us section) ---------- */
  const bars = document.querySelectorAll('.chart-bar[data-width]');
  const animateBars = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = bar.dataset.width;
        observer.unobserve(bar);
      }
    });
  };
  const barObserver = new IntersectionObserver(animateBars, { threshold: 0.3 });
  bars.forEach(bar => {
    bar.style.width = '0';
    bar.style.transition = 'width 1.1s cubic-bezier(.4,0,.2,1)';
    barObserver.observe(bar);
  });

  /* ---------- Fade-in on scroll ---------- */
  const fadeEls = document.querySelectorAll('.service-card, .pricing-card, .testimonial-card, .feature-item');
  fadeEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
  });
  const fadeObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 80);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  fadeEls.forEach(el => fadeObserver.observe(el));

  /* ---------- Luggage tracker (demo) ---------- */
  const trackBtn   = document.getElementById('trackBtn');
  const trackInput = document.getElementById('trackInput');
  const trackResult = document.getElementById('trackResult');
  const DEMO_IDS = {
    'SB100042': '✅ Delivered — London Heathrow T2 baggage claim, 14:32',
    'SB100099': '🔄 In Transit — Departed Dubai International, ETA 6 hrs',
    'SB100007': '📦 Checked In — New York JFK, handling bay 4',
  };
  trackBtn.addEventListener('click', () => {
    const id = trackInput.value.trim().toUpperCase();
    if (!id) {
      trackResult.textContent = 'Please enter a tracking ID.';
      return;
    }
    trackResult.textContent = DEMO_IDS[id]
      ? DEMO_IDS[id]
      : '⚠️ ID not found. Try SB100042, SB100099, or SB100007.';
  });
  trackInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') trackBtn.click();
  });

  /* ---------- Contact form validation ---------- */
  const form       = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  form.addEventListener('submit', e => {
    e.preventDefault();
    formStatus.className = 'form-status';

    const name    = form.querySelector('#name').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      formStatus.textContent = 'Please fill in all required fields.';
      formStatus.className = 'form-status error';
      return;
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      formStatus.textContent = 'Please enter a valid email address.';
      formStatus.className = 'form-status error';
      return;
    }

    // Simulate async submission
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    setTimeout(() => {
      form.reset();
      formStatus.textContent = '🎉 Message sent! We\'ll be in touch within 24 hours.';
      formStatus.className = 'form-status success';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }, 1400);
  });
})();
