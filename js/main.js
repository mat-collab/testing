/* =========================================================
   Ethical Compass — Main Script
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
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

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

  /* ---------- Fade-in on scroll ---------- */
  const fadeEls = document.querySelectorAll(
    '.service-card, .pricing-card, .feature-item, .governance-card, .impact-number, .personnel-card, .testimonial-card'
  );
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

  /* ---------- FAQ / Benefit Accordion ---------- */
  document.querySelectorAll('.faq-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const content  = btn.nextElementSibling;
      // Collapse all siblings first
      const allItems = btn.closest('.faq-accordions').querySelectorAll('.faq-trigger');
      allItems.forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.hidden = true;
      });
      // Toggle clicked
      if (!expanded) {
        btn.setAttribute('aria-expanded', 'true');
        content.hidden = false;
      }
    });
  });

  /* ---------- Bio Accordion ---------- */
  document.querySelectorAll('.bio-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const content  = btn.nextElementSibling;
      btn.setAttribute('aria-expanded', String(!expanded));
      content.hidden = expanded;
    });
  });

  /* ---------- ROI Calculator ---------- */
  const inputRegulatory = document.getElementById('input-regulatory');
  const inputBrand      = document.getElementById('input-brand');
  const inputComplexity = document.getElementById('input-complexity');
  const valRegulatory   = document.getElementById('val-regulatory');
  const valBrand        = document.getElementById('val-brand');
  const valComplexity   = document.getElementById('val-complexity');
  const roiDisplay      = document.getElementById('roi-display');

  const complexityLabels = ['', 'Low', 'Moderate', 'High', 'Very High', 'Critical'];

  function updateROI() {
    const reg     = parseInt(inputRegulatory.value, 10);
    const brand   = parseInt(inputBrand.value, 10);
    const complex = parseInt(inputComplexity.value, 10);

    valRegulatory.textContent = reg;
    valBrand.textContent      = (brand / 1000).toFixed(brand % 1000 === 0 ? 0 : 1);
    valComplexity.textContent = complexityLabels[complex];

    // Formula: higher risk + higher brand value + higher complexity = higher ROI multiple
    const totalRisk = reg + brand / 100;
    const multiplier = 1 + (complex - 1) * 0.5;
    const roi = Math.round((totalRisk / 150) * multiplier + 4);
    roiDisplay.textContent = Math.min(roi, 40) + 'x';
  }

  if (inputRegulatory && inputBrand && inputComplexity) {
    inputRegulatory.addEventListener('input', updateROI);
    inputBrand.addEventListener('input', updateROI);
    inputComplexity.addEventListener('input', updateROI);
    updateROI();
  }

  /* ---------- Contact form validation ---------- */
  const form       = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (form) {
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

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      setTimeout(() => {
        form.reset();
        formStatus.textContent = '✅ Message sent! Our governance team will be in touch within 24 hours.';
        formStatus.className = 'form-status success';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }, 1400);
    });
  }

  /* ---------- Framework strip pause on hover ---------- */
  const track = document.querySelector('.frameworks-track');
  if (track) {
    const wrapper = track.parentElement;
    wrapper.addEventListener('mouseenter', () => { track.style.animationPlayState = 'paused'; });
    wrapper.addEventListener('mouseleave', () => { track.style.animationPlayState = 'running'; });
  }

})();
