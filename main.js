/**
 * Abin Sam - Portfolio JavaScript
 * Features: Typewriter, Portfolio Filtering, Video Lightbox, Stat Counters, Clipboard & Contact Logic
 */

document.addEventListener('DOMContentLoaded', () => {

  // ================= 1. Typing Effect in Hero =================
  const typedSpan = document.querySelector('.hero-role-typed');
  if (typedSpan) {
    const roles = [
      'Video Editor & Colorist',
      'Generative AI Video Creator',
      'Multi-Cam Live Stream Director',
      'Motion Graphics Designer',
      'Cinematic Videographer'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 100;

    function type() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typedSpan.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingDelay = 50;
      } else {
        typedSpan.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingDelay = 110;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        typingDelay = 2000; // Pause at end of word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingDelay = 400; // Pause before new word
      }

      setTimeout(type, typingDelay);
    }

    type();
  }

  // ================= 2. Sticky Navbar & Mobile Navigation =================
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightActiveNavLink();
  });

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Close menu on link click
    navItems.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  // Active Link Highlighting on Scroll
  const sections = document.querySelectorAll('section[id]');
  function highlightActiveNavLink() {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-links a[href*="${sectionId}"]`);

      if (matchingLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navItems.forEach(item => item.classList.remove('active'));
          matchingLink.classList.add('active');
        }
      }
    });
  }

  // ================= 3. Animated Number Counters =================
  const statNumbers = document.querySelectorAll('.stat-number');
  let counted = false;

  function countUp(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const stepTime = 25;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current) + suffix;
      }
    }, stepTime);
  }

  const statsSection = document.querySelector('.stats-bar-section');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counted) {
          statNumbers.forEach(num => countUp(num));
          counted = true;
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  }

  // ================= 4. Portfolio Category Filtering =================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.classList.remove('hide');
        } else {
          card.classList.add('hide');
        }
      });
    });
  });

  // ================= 5. Video Lightbox Modal =================
  const modal = document.getElementById('videoModal');
  const modalClose = document.querySelector('.modal-close-btn');
  const modalTitle = document.querySelector('.modal-title');
  const modalDesc = document.querySelector('.modal-desc');
  const modalMedia = document.querySelector('.modal-media-wrapper');
  const videoTriggers = document.querySelectorAll('[data-video-trigger]');

  function openModal(title, desc) {
    if (!modal) return;
    modalTitle.textContent = title || 'Featured Production';
    modalDesc.textContent = desc || 'Video details and production notes.';
    
    // Inject mock preview player with sleek controls
    modalMedia.innerHTML = `
      <div class="modal-placeholder-preview">
        <i class="fa-solid fa-circle-play"></i>
        <h4 style="color:#fff; font-size:1.15rem; font-weight:700;">${title}</h4>
        <p style="font-size:0.85rem; color:var(--text-muted); max-width:480px;">
          Production Reel Preview • Full project available upon request or viewable in portfolio links.
        </p>
        <a href="https://wa.me/916235406479?text=Hi%20Abin,%20I%20would%20like%20to%20watch%20the%20full%20sample%20for:%20${encodeURIComponent(title)}" target="_blank" class="btn btn-primary btn-sm" style="margin-top:0.5rem;">
          <i class="fa-brands fa-whatsapp"></i> Request Full Video File
        </a>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  videoTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.getAttribute('data-video-title');
      const desc = btn.getAttribute('data-video-desc');
      openModal(title, desc);
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // ================= 6. Toast Notification & Copy to Clipboard =================
  const toast = document.getElementById('toastNotice');
  const toastMsg = toast ? toast.querySelector('.toast-msg') : null;

  function showToast(message) {
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  const copyButtons = document.querySelectorAll('[data-copy-val]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const val = btn.getAttribute('data-copy-val');
      const label = btn.getAttribute('data-copy-label') || 'Copied';

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(val).then(() => {
          showToast(`${label} copied: ${val}`);
        }).catch(() => fallbackCopy(val, label));
      } else {
        fallbackCopy(val, label);
      }
    });
  });

  function fallbackCopy(text, label) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    tempInput.style.position = 'fixed';
    tempInput.style.left = '-9999px';
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast(`${label} copied: ${text}`);
    } catch (err) {
      showToast(`Copy failed: ${text}`);
    }
    document.body.removeChild(tempInput);
  }

  // ================= 7. Contact Form Handling (WhatsApp / Email) =================
  const contactForm = document.getElementById('projectContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('client_name').value.trim();
      const contactInfo = document.getElementById('client_email').value.trim();
      const service = document.getElementById('service_type').value;
      const details = document.getElementById('project_details').value.trim();

      const whatsappText = `*New Video Project Inquiry for Abin Sam*%0A` +
        `👤 *Client/Org:* ${encodeURIComponent(name)}%0A` +
        `📞 *Contact:* ${encodeURIComponent(contactInfo)}%0A` +
        `🎬 *Service:* ${encodeURIComponent(service)}%0A` +
        `📝 *Brief:* ${encodeURIComponent(details)}`;

      showToast('Opening WhatsApp with your project brief...');

      setTimeout(() => {
        window.open(`https://wa.me/916235406479?text=${whatsappText}`, '_blank');
      }, 700);
    });
  }

});
