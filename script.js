// ===================================
// ANGRY APPLE TREE LTD - JAVASCRIPT
// ===================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {

  // ===================================
  // NAVIGATION
  // ===================================

  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  // Navbar scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });

  // Mobile menu toggle
  mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const isActive = navMenu.classList.contains('active');
    mobileMenuToggle.textContent = isActive ? '✕' : '☰';
  });

  // Close mobile menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      mobileMenuToggle.textContent = '☰';
    });
  });

  // Active navigation highlighting
  const sections = document.querySelectorAll('.section, .hero');

  function highlightNavigation() {
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', highlightNavigation);

  // ===================================
  // SMOOTH SCROLLING
  // ===================================

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // Don't prevent default for non-section links
      if (href === '#' || href === '#forgot' || href === '#signup' ||
        href === '#privacy' || href === '#terms' || href === '#contact') {
        return;
      }

      e.preventDefault();

      const target = document.querySelector(href);
      if (target) {
        const offsetTop = target.offsetTop - 80; // Account for fixed navbar

        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===================================
  // FORM HANDLING
  // ===================================

  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      // Show loading state
      const submitButton = loginForm.querySelector('button[type="submit"]');
      const originalText = submitButton.innerHTML;
      submitButton.innerHTML = 'Signing in... <span>⏳</span>';
      submitButton.disabled = true;

      // Simulate login check
      setTimeout(() => {
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;

        if (username === 'Guest' && password === 'IAMAGUEST') {
          showNotification('Login successful! Redirecting...', 'success');
          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 1000);
        } else {
          showNotification('Invalid credentials. Try again.', 'error');
          // Shake animation for error
          loginForm.style.animation = 'shake 0.5s ease';
          setTimeout(() => {
            loginForm.style.animation = '';
          }, 500);
        }
      }, 1000);
    });
  }

  // ===================================
  // CARD ANIMATIONS
  // ===================================

  const cards = document.querySelectorAll('.card');

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
        cardObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    cardObserver.observe(card);
  });

  // ===================================
  // INPUT FOCUS EFFECTS
  // ===================================

  const inputs = document.querySelectorAll('input[type="text"], input[type="password"], input[type="email"]');

  inputs.forEach(input => {
    input.addEventListener('focus', function () {
      this.style.borderColor = 'var(--color-primary)';
      this.style.boxShadow = '4px 4px 0px var(--color-primary)';
    });

    input.addEventListener('blur', function () {
      this.style.borderColor = 'white';
      this.style.boxShadow = 'none';
    });
  });

  // ===================================
  // NOTIFICATION SYSTEM
  // ===================================

  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');

    let bgColor = 'black';
    let borderColor = 'white';

    if (type === 'success') {
      bgColor = 'var(--color-secondary)';
      borderColor = 'black';
    } else if (type === 'error') {
      bgColor = 'var(--color-primary)';
      borderColor = 'white';
    }

    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${bgColor};
      color: ${type === 'success' ? 'black' : 'white'};
      padding: 1rem 1.5rem;
      border: 4px solid ${borderColor};
      box-shadow: 8px 8px 0px rgba(0,0,0,0.5);
      z-index: 10000;
      font-weight: bold;
      font-family: var(--font-primary);
      text-transform: uppercase;
      animation: slideIn 0.3s ease;
      max-width: 300px;
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  // Add animation keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // ===================================
  // PARALLAX EFFECT FOR HERO
  // ===================================

  const hero = document.querySelector('.hero');

  window.addEventListener('scroll', () => {
    // Disable parallax on mobile to prevent overlap issues
    if (window.innerWidth < 768) return;

    const scrolled = window.pageYOffset;
    if (hero && scrolled < window.innerHeight) {
      hero.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
  });

  // ===================================
  // EASTER EGG - APPLE TREE ANIMATION
  // ===================================

  let clickCount = 0;
  const logoIcon = document.querySelector('.logo-icon');

  if (logoIcon) {
    logoIcon.addEventListener('click', (e) => {
      e.preventDefault();
      clickCount++;

      // Rotate animation
      logoIcon.style.transform = `rotate(${clickCount * 360}deg)`;
      logoIcon.style.transition = 'transform 0.6s ease';

      if (clickCount === 5) {
        showNotification('🍎 You found the angry apple! 🌳', 'success');
        createAppleRain();
        clickCount = 0;
      }
    });
  }

  function createAppleRain() {
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const apple = document.createElement('div');
        apple.textContent = '🍎';
        apple.style.cssText = `
          position: fixed;
          top: -50px;
          left: ${Math.random() * 100}vw;
          font-size: 2rem;
          z-index: 9999;
          pointer-events: none;
          animation: fall ${2 + Math.random() * 2}s linear;
        `;

        document.body.appendChild(apple);

        setTimeout(() => {
          document.body.removeChild(apple);
        }, 4000);
      }, i * 100);
    }

    // Add fall animation if not already added
    if (!document.getElementById('fallAnimation')) {
      const fallStyle = document.createElement('style');
      fallStyle.id = 'fallAnimation';
      fallStyle.textContent = `
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }
      `;
      document.head.appendChild(fallStyle);
    }
  }

  // ===================================
  // MOBILE/PWA BACK NAVIGATION
  // ===================================

  const isHomePage = window.location.pathname === '/' || window.location.pathname.endsWith('index.html');

  // Show back button on sub-pages (Catalogue, Events, etc)
  if (!isHomePage) {
    const navContainer = document.querySelector('.nav-container');
    const logo = document.querySelector('.logo');

    if (navContainer && logo) {
      const backBtn = document.createElement('button');
      backBtn.innerHTML = '←';
      backBtn.ariaLabel = 'Go Back';
      backBtn.className = 'nav-back-btn';

      // Inline styles for the back button to match punk aesthetic
      backBtn.style.cssText = `
        background: transparent;
        border: 2px solid white;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 4px 12px;
        margin-right: var(--spacing-sm);
        font-weight: 800;
        transition: all 0.2s ease;
        display: none; /* Hidden by default, shown via media query or JS */
      `;

      // Show on mobile or PWA
      if (window.innerWidth < 768 || window.matchMedia('(display-mode: standalone)').matches) {
        backBtn.style.display = 'block';
      }

      backBtn.addEventListener('mouseenter', () => {
        backBtn.style.background = 'white';
        backBtn.style.color = 'black';
      });

      backBtn.addEventListener('mouseleave', () => {
        backBtn.style.background = 'transparent';
        backBtn.style.color = 'white';
      });

      backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // If history exists, go back. Else go home.
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = 'index.html';
        }
      });

      navContainer.insertBefore(backBtn, logo);
    }
  }

  // ===================================
  // PERFORMANCE OPTIMIZATION
  // ===================================

  // Debounce function for scroll events
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Apply debounce to scroll-heavy functions
  window.addEventListener('scroll', debounce(highlightNavigation, 100));

  // ===================================
  // INITIALIZE
  // ===================================

  console.log('%c🍎 Angry Apple Tree Ltd', 'font-size: 24px; font-weight: bold; color: #ff3366;');
  console.log('%cWebsite loaded successfully!', 'font-size: 14px; color: #00d4aa;');

  // Initial highlight
  highlightNavigation();
});
