/* ═══════════════════════════════════════════════════════
   YASH DONGA PORTFOLIO — main.js
   Particles · Custom cursor · Scroll animations
   Role cycler · GitHub API · Skill bars · Back-to-top
═══════════════════════════════════════════════════════ */

'use strict';

// ── Splash Cursor WebGL Fluid Simulation ──────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (typeof initSplashCursor === 'function') {
    initSplashCursor({
      SIM_RESOLUTION: 128,
      DYE_RESOLUTION: 1440,
      DENSITY_DISSIPATION: 3.5,
      VELOCITY_DISSIPATION: 2,
      PRESSURE: 0.1,
      PRESSURE_ITERATIONS: 20,
      CURL: 3,
      SPLAT_RADIUS: 0.2,
      SPLAT_FORCE: 6000,
      SHADING: true,
      COLOR_UPDATE_SPEED: 10,
      RAINBOW_MODE: false,
      COLOR: '#7c3aed'
    });
  }
});

// ── Navbar scroll effect ────────────────────────────────
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');

  // Back-to-top
  const btn = document.getElementById('back-to-top');
  if (window.scrollY > 400) btn.classList.add('visible');
  else btn.classList.remove('visible');

  // Active nav link
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(l => {
    l.classList.remove('active');
    if (l.dataset.section === current) l.classList.add('active');
  });
});

// Hamburger
const hamburger = document.getElementById('hamburger');
const navLinksList = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinksList.classList.toggle('open');
});

// Back-to-top
document.getElementById('back-to-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Role cycler (typewriter) ─────────────────────────────
const roles = [
  'Intelligent Systems',
  'ML-Powered Web Apps',
  'Prediction Models',
  'Data Pipelines',
  'AI Travel Agents',
  'Profit Forecasters',
];
const cycler = document.getElementById('role-cycler');
let rIdx = 0, charIdx = 0, deleting = false;

function typeRole() {
  const word = roles[rIdx];
  if (!deleting) {
    cycler.textContent = word.slice(0, ++charIdx);
    if (charIdx === word.length) {
      deleting = true;
      setTimeout(typeRole, 2000);
      return;
    }
  } else {
    cycler.textContent = word.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      rIdx = (rIdx + 1) % roles.length;
    }
  }
  setTimeout(typeRole, deleting ? 45 : 90);
}
setTimeout(typeRole, 800);

// ── LiquidEther Fluid Simulation Background ──────────────
document.addEventListener('DOMContentLoaded', () => {
  if (typeof initLiquidEther === 'function') {
    initLiquidEther('liquid-ether-container', {
      colors: ['#7c3aed', '#06b6d4', '#ec4899'], // Project theme colors: Purple, Cyan, Pink
      mouseForce: 20,
      cursorSize: 100,
      isViscous: true,
      viscous: 30,
      iterationsViscous: 32,
      iterationsPoisson: 32,
      resolution: 0.5,
      isBounce: false,
      autoDemo: true,
      autoSpeed: 0.5,
      autoIntensity: 2.2,
      takeoverDuration: 0.25,
      autoResumeDelay: 3000,
      autoRampDuration: 0.6
    });
  }
});

// ── Intersection Observer: Skill Bars ────────────────────
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.level + '%';
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(el => skillObserver.observe(el));

// ── Intersection Observer: Fade-up elements ──────────────
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll(
  '.timeline-item, .project-card, .cert-card, .repo-card, .fade-up'
).forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.05}s`;
  fadeObserver.observe(el);
});

// ── GitHub Repos API ─────────────────────────────────────
const LANG_COLORS = {
  Python: '#3572A5', JavaScript: '#f1e05a', HTML: '#e34c26',
  CSS: '#563d7c', 'Jupyter Notebook': '#DA5B0B',
};

function getLangDot(lang) {
  const color = LANG_COLORS[lang] || '#7c3aed';
  return `<span class="lang-dot" style="background:${color}"></span>`;
}

async function loadGitHubRepos() {
  const grid = document.getElementById('repos-grid');
  const loading = document.getElementById('repos-loading');
  const errBox = document.getElementById('repos-error');
  const repoCountEl = document.getElementById('gh-repo-count');
  const starCountEl = document.getElementById('gh-star-count');
  const langCountEl = document.getElementById('gh-lang-count');

  try {
    const resp = await fetch('/api/github-repos');
    const data = await resp.json();

    loading.style.display = 'none';

    if (!data.success || !data.repos.length) {
      errBox.style.display = 'block'; return;
    }

    const repos = data.repos;
    const totalStars = repos.reduce((s, r) => s + r.stars, 0);
    const languages = new Set(repos.map(r => r.language).filter(l => l && l !== 'N/A'));

    repoCountEl.textContent = repos.length;
    starCountEl.textContent = totalStars;
    langCountEl.textContent = languages.size;

    grid.innerHTML = repos.slice(0, 12).map(repo => `
      <a href="${repo.url}" target="_blank" class="repo-card fade-up">
        <div class="repo-name"><i class="fa-solid fa-folder-open"></i> ${repo.name}</div>
        <div class="repo-desc">${repo.description}</div>
        <div class="repo-meta">
          ${repo.language !== 'N/A' ? `
          <div class="repo-lang">
            ${getLangDot(repo.language)}
            <span>${repo.language}</span>
          </div>` : ''}
          <div class="repo-stars"><i class="fa-solid fa-star"></i> ${repo.stars}</div>
          <div class="repo-forks"><i class="fa-solid fa-code-fork"></i> ${repo.forks}</div>
        </div>
      </a>
    `).join('');

    // Re-observe new cards
    document.querySelectorAll('.repo-card.fade-up').forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.06}s`;
      fadeObserver.observe(el);
    });

  } catch (err) {
    loading.style.display = 'none';
    errBox.style.display = 'block';
    console.warn('GitHub repos error:', err);
  }
}


loadGitHubRepos();

// ── Section header reveal ────────────────────────────────
const headerObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      headerObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.section-header').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  headerObserver.observe(el);
});
// Override visible state via JS (since we added inline styles)
const shObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      shObs.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.section-header').forEach(el => shObs.observe(el));

// ── Tech tag hover glow ──────────────────────────────────
document.querySelectorAll('.tech-tag').forEach(tag => {
  tag.addEventListener('mousemove', e => {
    const rect = tag.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    tag.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(124,58,237,0.3), rgba(255,255,255,0.04))`;
  });
  tag.addEventListener('mouseleave', () => {
    tag.style.background = '';
  });
});

// ── Smooth nav link behaviour (close mobile menu) ────────
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinksList.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

// ── Tilt effect on project cards ────────────────────────
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── About avatar parallax ────────────────────────────────
const avatar = document.getElementById('about-avatar');
if (avatar) {
  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    avatar.style.transform = `translate(${dx * 8}px, ${dy * 8}px)`;
  });
}

// ── MagicBento Component ─────────────────────────────────
function initMagicBento() {
  const grid = document.getElementById('bento-grid');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.magic-bento-card'));
  const config = {
    glowColor: '124, 58, 237',
    spotlightRadius: 300,
    particleCount: 12
  };

  const isMobile = () => window.innerWidth <= 768;

  // 1. Global Spotlight
  let spotlight = document.createElement('div');
  spotlight.className = 'global-spotlight';
  spotlight.style.cssText = `
    position: fixed;
    width: 800px;
    height: 800px;
    border-radius: 50%;
    pointer-events: none;
    background: radial-gradient(circle,
      rgba(${config.glowColor}, 0.15) 0%,
      rgba(${config.glowColor}, 0.08) 15%,
      rgba(${config.glowColor}, 0.04) 25%,
      rgba(${config.glowColor}, 0.02) 40%,
      rgba(${config.glowColor}, 0.01) 65%,
      transparent 70%
    );
    z-index: 200;
    opacity: 0;
    transform: translate(-50%, -50%);
    mix-blend-mode: screen;
  `;
  document.body.appendChild(spotlight);

  const proximity = config.spotlightRadius * 0.5;
  const fadeDistance = config.spotlightRadius * 0.75;

  document.addEventListener('mousemove', e => {
    if (isMobile()) {
      if (spotlight) spotlight.style.opacity = '0';
      cards.forEach(card => card.style.setProperty('--glow-intensity', '0'));
      return;
    }

    const rect = grid.getBoundingClientRect();
    const mouseInside =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;

    if (!mouseInside) {
      if (spotlight) {
        gsap.to(spotlight, { opacity: 0, duration: 0.3, ease: 'power2.out' });
      }
      cards.forEach(card => {
        card.style.setProperty('--glow-intensity', '0');
      });
      return;
    }

    let minDistance = Infinity;

    cards.forEach(card => {
      const cardRect = card.getBoundingClientRect();
      const centerX = cardRect.left + cardRect.width / 2;
      const centerY = cardRect.top + cardRect.height / 2;
      const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2;
      const effectiveDistance = Math.max(0, distance);

      minDistance = Math.min(minDistance, effectiveDistance);

      let glowIntensity = 0;
      if (effectiveDistance <= proximity) {
        glowIntensity = 1;
      } else if (effectiveDistance <= fadeDistance) {
        glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
      }

      const relativeX = ((e.clientX - cardRect.left) / cardRect.width) * 100;
      const relativeY = ((e.clientY - cardRect.top) / cardRect.height) * 100;
      card.style.setProperty('--glow-x', `${relativeX}%`);
      card.style.setProperty('--glow-y', `${relativeY}%`);
      card.style.setProperty('--glow-intensity', glowIntensity.toString());
      card.style.setProperty('--glow-radius', `${config.spotlightRadius}px`);
    });

    if (spotlight) {
      gsap.to(spotlight, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      });

      const targetOpacity = minDistance <= proximity
        ? 0.8
        : minDistance <= fadeDistance
          ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
          : 0;

      gsap.to(spotlight, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.2 : 0.5,
        ease: 'power2.out'
      });
    }
  });

  document.addEventListener('mouseleave', () => {
    cards.forEach(card => {
      card.style.setProperty('--glow-intensity', '0');
    });
    if (spotlight) {
      gsap.to(spotlight, { opacity: 0, duration: 0.3, ease: 'power2.out' });
    }
  });

  // 2. Individual Card Interactions
  cards.forEach(card => {
    let particles = [];
    let timeouts = [];
    let isHovered = false;
    let particlesInitialized = false;
    let memoizedParticles = [];
    let magnetismAnimation = null;

    const createParticleElement = (x, y) => {
      const el = document.createElement('div');
      el.className = 'particle';
      el.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: rgba(${config.glowColor}, 1);
        box-shadow: 0 0 6px rgba(${config.glowColor}, 0.6);
        pointer-events: none;
        z-index: 100;
        left: ${x}px;
        top: ${y}px;
      `;
      return el;
    };

    const initializeParticles = () => {
      if (particlesInitialized) return;
      const rect = card.getBoundingClientRect();
      memoizedParticles = Array.from({ length: config.particleCount }, () =>
        createParticleElement(Math.random() * rect.width, Math.random() * rect.height)
      );
      particlesInitialized = true;
    };

    const clearAllParticles = () => {
      timeouts.forEach(clearTimeout);
      timeouts = [];
      if (magnetismAnimation) {
        magnetismAnimation.kill();
      }

      particles.forEach(p => {
        gsap.to(p, {
          scale: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'back.in(1.7)',
          onComplete: () => {
            if (p.parentNode) p.parentNode.removeChild(p);
          }
        });
      });
      particles = [];
    };

    const animateParticles = () => {
      if (!isHovered) return;
      initializeParticles();

      memoizedParticles.forEach((particle, index) => {
        const timeoutId = setTimeout(() => {
          if (!isHovered) return;

          const clone = particle.cloneNode(true);
          card.appendChild(clone);
          particles.push(clone);

          gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });

          gsap.to(clone, {
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100,
            rotation: Math.random() * 360,
            duration: 2 + Math.random() * 2,
            ease: 'none',
            repeat: -1,
            yoyo: true
          });

          gsap.to(clone, {
            opacity: 0.3,
            duration: 1.5,
            ease: 'power2.inOut',
            repeat: -1,
            yoyo: true
          });
        }, index * 100);

        timeouts.push(timeoutId);
      });
    };

    card.addEventListener('mouseenter', () => {
      if (isMobile()) return;
      isHovered = true;
      animateParticles();

      gsap.to(card, {
        rotateX: 5,
        rotateY: 5,
        duration: 0.3,
        ease: 'power2.out',
        transformPerspective: 1000
      });
    });

    card.addEventListener('mouseleave', () => {
      if (isMobile()) return;
      isHovered = false;
      clearAllParticles();

      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        x: 0,
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    card.addEventListener('mousemove', e => {
      if (isMobile()) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      gsap.to(card, {
        rotateX,
        rotateY,
        duration: 0.1,
        ease: 'power2.out',
        transformPerspective: 1000
      });

      const magnetX = (x - centerX) * 0.05;
      const magnetY = (y - centerY) * 0.05;

      magnetismAnimation = gsap.to(card, {
        x: magnetX,
        y: magnetY,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    card.addEventListener('click', e => {
      if (isMobile()) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${config.glowColor}, 0.4) 0%, rgba(${config.glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `;

      card.appendChild(ripple);

      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        { scale: 1, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => ripple.remove() }
      );
    });
  });
}

initMagicBento();

console.log('%c Hey! Built with Flask +  by Yash Donga', 'color:#7c3aed;font-size:14px;font-weight:bold;');

