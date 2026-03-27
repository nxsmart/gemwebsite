/**
 * PERSONAL PORTFOLIO — script.js
 * Environmental Health & Data Science Student
 *
 * Features:
 *  1. Navbar: scroll shadow + active link highlighting
 *  2. Mobile hamburger menu toggle
 *  3. Scroll-triggered fade-in animations (IntersectionObserver)
 *  4. Smooth section tracking for nav highlighting
 *  5. Easter egg: clicking name cycles accent color + shows fun fact
 *  6. Resume PDF placeholder detection
 */

'use strict';

/* ─────────────────────────────────────────────────────────────
   1. NAVBAR — scroll shadow & active link tracking
   ───────────────────────────────────────────────────────────── */

const navbar    = document.getElementById('navbar');
const navLinks  = document.querySelectorAll('.nav-link:not(.nav-external)');
const sections  = document.querySelectorAll('section[id]');

// Add/remove the "scrolled" class (enables border + shadow)
function handleNavbarScroll() {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

// Highlight the nav link that corresponds to the current visible section
function updateActiveNavLink() {
  let currentSection = '';

  sections.forEach(section => {
    const sectionTop    = section.getBoundingClientRect().top;
    const sectionHeight = section.offsetHeight;

    // A section is "active" when it occupies the upper half of the viewport
    if (sectionTop <= 120 && sectionTop + sectionHeight > 120) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    // Match the href="#sectionId" to currentSection
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', () => {
  handleNavbarScroll();
  updateActiveNavLink();
}, { passive: true });

// Run once on load
handleNavbarScroll();
updateActiveNavLink();


/* ─────────────────────────────────────────────────────────────
   2. MOBILE HAMBURGER MENU
   ───────────────────────────────────────────────────────────── */

const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

// Close mobile menu when a link is clicked
mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// Close menu if user clicks outside of it
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});


/* ─────────────────────────────────────────────────────────────
   3. SCROLL FADE-IN ANIMATIONS
   Uses IntersectionObserver for performance
   ───────────────────────────────────────────────────────────── */

const fadeElements = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger sibling elements within the same parent
        const siblings = Array.from(entry.target.parentElement.children)
          .filter(el => el.classList.contains('fade-in'));
        const idx = siblings.indexOf(entry.target);

        // Apply a small staggered delay based on sibling position
        const delay = Math.min(idx * 80, 320); // cap at 320ms
        entry.target.style.transitionDelay = `${delay}ms`;
        entry.target.classList.add('visible');

        // Stop observing once it's animated in
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,       // trigger when 12% of element is visible
    rootMargin: '0px 0px -40px 0px'  // slight offset from bottom
  }
);

// Immediately show home section elements without waiting for scroll
document.querySelectorAll('.section-home .fade-in').forEach((el, i) => {
  el.style.transitionDelay = `${i * 100 + 100}ms`;
  // Small timeout to allow CSS to register initial state before animating
  setTimeout(() => el.classList.add('visible'), 50);
});

// Observe all other fade-in elements
fadeElements.forEach(el => {
  if (!el.closest('.section-home')) {
    fadeObserver.observe(el);
  }
});


/* ─────────────────────────────────────────────────────────────
   4. SMOOTH NAVIGATION CLICKS
   Ensures nav logo and links smoothly scroll even in older Safari
   ───────────────────────────────────────────────────────────── */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});


/* ─────────────────────────────────────────────────────────────
   5. EASTER EGG — Click the name to cycle accent colors
      Each color has a paired "fun fact" message
   ───────────────────────────────────────────────────────────── */

const homeName      = document.getElementById('home-name');
const easterTooltip = document.getElementById('easter-tooltip');
const navLogo       = document.getElementById('nav-logo');

// Accent color cycles + matching messages
const accentCycles = [
  {
    color: '#3B6B4A',
    colorMid: '#5A8C6A',
    colorLight: '#C2D4B8',
    colorPale: '#EBF2E5',
    message: '🌿 "In every walk with nature, one receives far more than he seeks." — John Muir'
  },
  {
    color: '#4A6B8A',
    colorMid: '#6A8CAA',
    colorLight: '#B8CEDE',
    colorPale: '#E8F0F5',
    message: '💧 About 71% of Earth\'s surface is water — yet only 3% is freshwater.'
  },
  {
    color: '#7A5C3A',
    colorMid: '#9A7C5A',
    colorLight: '#D4C0A8',
    colorPale: '#F5EDE0',
    message: '🌍 Environmental exposures influence roughly 24% of global disease burden (WHO).'
  },
  {
    color: '#3B6B4A',   // back to original
    colorMid: '#5A8C6A',
    colorLight: '#C2D4B8',
    colorPale: '#EBF2E5',
    message: '✨ Back to green — the original palette!'
  }
];

let currentAccentIdx = 0;
let tooltipTimer = null;

function cycleAccent() {
  currentAccentIdx = (currentAccentIdx + 1) % accentCycles.length;
  const cycle = accentCycles[currentAccentIdx];

  // Update CSS custom properties on the root
  document.documentElement.style.setProperty('--accent',       cycle.color);
  document.documentElement.style.setProperty('--accent-mid',   cycle.colorMid);
  document.documentElement.style.setProperty('--accent-light', cycle.colorLight);
  document.documentElement.style.setProperty('--accent-pale',  cycle.colorPale);

  // Show tooltip with the message
  showTooltip(cycle.message);
}

function showTooltip(message) {
  easterTooltip.textContent = message;
  easterTooltip.classList.add('visible');

  // Clear any existing timer
  if (tooltipTimer) clearTimeout(tooltipTimer);

  tooltipTimer = setTimeout(() => {
    easterTooltip.classList.remove('visible');
  }, 3500);
}

// Trigger on clicking the large name heading
if (homeName) {
  homeName.addEventListener('click', cycleAccent);
  homeName.title = 'Try clicking me...';
  homeName.style.cursor = 'pointer';
}

// Also trigger on clicking the nav logo
if (navLogo) {
  navLogo.addEventListener('click', (e) => {
    // Only trigger egg if we're navigating to #home (prevent interfering with nav)
    cycleAccent();
  });
}


/* ─────────────────────────────────────────────────────────────
   6. RESUME PDF PLACEHOLDER DETECTION
   Hides the placeholder overlay once the iframe has content
   ───────────────────────────────────────────────────────────── */

const resumeIframe      = document.querySelector('.resume-viewer iframe');
const resumePlaceholder = document.getElementById('resume-placeholder');

if (resumeIframe && resumePlaceholder) {
  resumeIframe.addEventListener('load', () => {
    // Try to detect if a real PDF loaded vs. a blank/error page
    try {
      // If the src is set to a real file, hide the placeholder
      if (resumeIframe.src && !resumeIframe.src.endsWith('/resume.pdf')
          || resumeIframe.contentDocument) {
        // Can't always inspect cross-origin iframes; just hide after load
        resumePlaceholder.style.display = 'none';
      }
    } catch {
      // Cross-origin restriction — assume it loaded fine, hide placeholder
      resumePlaceholder.style.display = 'none';
    }
  });

  // If no src is set or it points to a missing file, keep placeholder visible
  // (The placeholder is positioned absolute and shows by default in CSS)
}


/* ─────────────────────────────────────────────────────────────
   7. UTILITY — Debounce helper for resize events (future use)
   ───────────────────────────────────────────────────────────── */

function debounce(fn, delay = 150) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Log a small console greeting (visible in DevTools)
console.log(
  '%c🌿 Portfolio loaded successfully.',
  'color: #3B6B4A; font-weight: 600; font-size: 13px;'
);
console.log(
  '%cHint: Try clicking the name on the homepage...',
  'color: #7A8E7E; font-size: 11px;'
);
