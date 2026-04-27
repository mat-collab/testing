/* =========================================================
   CivicBridge — Main Script
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
    '.service-card, .pricing-card, .feature-item, .governance-card, ' +
    '.impact-number, .reseller-card, .demo-svc-card'
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
      btn.closest('.faq-accordions').querySelectorAll('.faq-trigger').forEach(b => {
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

  /* ---------- Demo Tabs ---------- */
  const demoTabs = document.querySelectorAll('.demo-tab');
  if (demoTabs.length) {
    demoTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const panelId = 'tab-' + tab.dataset.tab;
        // Update tab buttons
        demoTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        // Update panels
        document.querySelectorAll('.demo-panel').forEach(panel => {
          panel.classList.remove('active');
          panel.hidden = true;
        });
        const activePanel = document.getElementById(panelId);
        if (activePanel) {
          activePanel.classList.add('active');
          activePanel.hidden = false;
        }
      });
    });
  }

  /* ---------- Revenue Calculator ---------- */
  const inputMunis  = document.getElementById('input-munis');
  const inputSize   = document.getElementById('input-size');
  const inputMarkup = document.getElementById('input-markup');
  const valMunis    = document.getElementById('val-munis');
  const valSize     = document.getElementById('val-size');
  const valMarkup   = document.getElementById('val-markup');
  const roiDisplay  = document.getElementById('roi-display');

  const sizeLabels = ['Small', 'Medium', 'Large'];
  const basePrice  = [499, 699, 999]; // R per municipality per month

  function updateCalc() {
    const count  = parseInt(inputMunis.value, 10);
    const size   = parseInt(inputSize.value, 10) - 1;
    const markup = parseInt(inputMarkup.value, 10);

    valMunis.textContent  = count;
    valSize.textContent   = sizeLabels[size];
    valMarkup.textContent = markup;

    const monthly = Math.round(count * basePrice[size] * (1 + markup / 100));
    // \u00a0 is a non-breaking space so "R" and the number never wrap onto separate lines
    roiDisplay.textContent = 'R\u00a0' + monthly.toLocaleString('en-ZA') + '/mo';
  }

  if (inputMunis && inputSize && inputMarkup) {
    inputMunis.addEventListener('input', updateCalc);
    inputSize.addEventListener('input', updateCalc);
    inputMarkup.addEventListener('input', updateCalc);
    updateCalc();
  }

  /* ---------- Contact form validation ---------- */
  const form       = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      formStatus.className = 'form-status';
      formStatus.textContent = '';

      const orgName = form.querySelector('#org-name').value.trim();
      const name    = form.querySelector('#name').value.trim();
      const email   = form.querySelector('#email').value.trim();
      const message = form.querySelector('#message').value.trim();

      if (!orgName || !name || !email || !message) {
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
        formStatus.textContent = '✅ Message sent! Our team will be in touch within 24 hours.';
        formStatus.className = 'form-status success';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }, 1400);
    });
  }

  /* ---------- Framework strip: pause on hover ---------- */
  const track = document.querySelector('.frameworks-track');
  if (track) {
    const wrapper = track.parentElement;
    wrapper.addEventListener('mouseenter', () => { track.style.animationPlayState = 'paused'; });
    wrapper.addEventListener('mouseleave', () => { track.style.animationPlayState = 'running'; });
  }

})();
