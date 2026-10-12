const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  nav.classList.remove('open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  nav.classList.toggle('open', open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
document.querySelector('#year').textContent = new Date().getFullYear();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window) {
  if (!reducedMotion.matches) document.body.classList.add('motion-ready');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(section => revealObserver.observe(section));
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        nav.querySelectorAll('a').forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: '-15% 0px -65% 0px' });
  document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
}
const progress = document.querySelector('.scroll-progress');
let scrollPending = false;
function updateProgress() {
  const range = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${range > 0 ? (window.scrollY / range) * 100 : 0}%`;
  scrollPending = false;
}
window.addEventListener('scroll', () => {
  if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateProgress); }
}, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();
const projects = {
  wayfind: {
    label: '01 / SEMANTIC SEARCH × REAL-WORLD NAVIGATION',
    title: 'Wayfind',
    description: 'An AI-powered retail navigation system that makes products easier to find, from a QR scan to a route through the store.',
    features: ['An AI-assisted CSV pipeline cleans inconsistent product data, groups similar items with embeddings, and generates store sections.', 'MiniLM and PostgreSQL pgvector match the meaning of a search, without a paid API for semantic matching.', 'Walking routes support stairs and multiple floors, with validation for safe paths.', 'Validated with 150 messy product records and 135 automated tests.'],
    tags: ['PostgreSQL', 'pgvector', 'MiniLM', 'Vercel'],
    url: 'https://wayfind-sage.vercel.app', link: 'Visit live project ↗'
  },
  analytics: {
    label: '02 / LOCAL AI × BUSINESS INTELLIGENCE',
    title: 'AI Analytics & BI Dashboard',
    description: 'A full-stack analytics platform that connects data profiling, anomaly detection, and interactive dashboards with a local language model.',
    features: ['Specialized agents handle data science, visualization, backend work, quality assurance, and orchestration.', 'Pandas powers data profiling while Plotly turns the results into interactive visualizations.', 'Ollama provides local AI insights, with KPI cards and drilldowns for exploring the data.', 'CSV and PDF exports make the resulting analysis easier to share.'],
    tags: ['Python', 'Flask', 'Pandas', 'Plotly', 'Ollama'],
    url: 'https://github.com/yash-dong025', link: 'Explore my GitHub ↗'
  },
  travel: {
    label: '03 / PERSONALIZED PLANNING × GENERATIVE AI',
    title: 'AI Travel Planning Agent',
    description: 'A Streamlit application that brings planning tools together to turn travel preferences into a practical itinerary.',
    features: ['Gemini creates personalized, day-by-day travel plans.', 'Google Maps and weather integrations add context to the journey.', 'Hotel suggestions and packing lists help cover the details before departure.', 'Downloadable PDF itineraries keep the plan accessible beyond the app.'],
    tags: ['Python', 'Streamlit', 'Gemini', 'Google Maps', 'Weather APIs'],
    url: 'https://github.com/yash-dong025/Real-Time-AI-Travel-Planner-master', link: 'View source on GitHub ↗'
  }
};
const dialog = document.querySelector('#project-dialog');
dialog.setAttribute('aria-labelledby', 'dialog-title');
dialog.setAttribute('aria-describedby', 'dialog-description');
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  const project = projects[button.dataset.project];
  document.querySelector('#dialog-label').textContent = project.label;
  document.querySelector('#dialog-title').textContent = project.title;
  document.querySelector('#dialog-description').textContent = project.description;
  document.querySelector('#dialog-features').replaceChildren(...project.features.map(feature => {
    const item = document.createElement('li'); item.textContent = feature; return item;
  }));
  document.querySelector('#dialog-tags').replaceChildren(...project.tags.map(tag => {
    const item = document.createElement('span'); item.textContent = tag; return item;
  }));
  const link = document.querySelector('#dialog-link'); link.href = project.url; link.textContent = project.link;
  dialog.showModal();
  document.body.style.overflow = 'hidden';
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
dialog.addEventListener('close', () => { document.body.style.overflow = ''; });
document.querySelector('#copy-email').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText('dongayash864@gmail.com');
    status.textContent = 'Email copied. Let’s connect.';
  } catch {
    status.textContent = 'Copy this address: dongayash864@gmail.com';
  }
});
