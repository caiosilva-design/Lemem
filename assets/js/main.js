// =========================================================
// LEMEM FC — Scripts do site
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initGalleryVideos();
  initMomentosVideos();
  initScrollReveal();
  initBackToTop();
});

/* ---------- Menu mobile (hambúrguer) ---------- */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Fecha o menu ao clicar em um link
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- Vídeos da galeria "Taça das Quebradas" ---------- */
function initGalleryVideos() {
  document.querySelectorAll('.quebradas-video-wrap').forEach(wrap => {
    const video = wrap.querySelector('video');
    const overlay = wrap.querySelector('.video-play-overlay');
    if (!video || !overlay) return;

    overlay.addEventListener('click', () => {
      video.play();
      overlay.classList.add('hidden');
    });
    video.addEventListener('click', () => {
      video.pause();
      overlay.classList.remove('hidden');
    });
    video.addEventListener('ended', () => {
      overlay.classList.remove('hidden');
    });
  });
}

/* ---------- Vídeos da seção "Momentos Inesquecíveis" ---------- */
function initMomentosVideos() {
  document.querySelectorAll('.momento-item').forEach(item => {
    const video = item.querySelector('video');
    const overlay = item.querySelector('.momento-video-overlay');
    if (!video || !overlay) return;

    overlay.addEventListener('click', () => {
      if (video.paused) {
        video.play();
        overlay.classList.add('playing');
      } else {
        video.pause();
        overlay.classList.remove('playing');
      }
    });
    video.addEventListener('ended', () => {
      overlay.classList.remove('playing');
    });
  });
}

/* ---------- Revela seções suavemente ao rolar a página ---------- */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '#historia .historia-grid, #titulos .titulos-grid, #gestao .gestao-grid, ' +
    '#produtos .produtos-grid, #patrocinadores .patrocinadores-grid, #momentos .momentos-grid'
  );
  targets.forEach(el => el.classList.add('reveal'));

  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(el => observer.observe(el));
}

/* ---------- Botão flutuante "voltar ao topo" ---------- */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 800);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
