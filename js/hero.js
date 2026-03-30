/* ── HERO ENTRANCE ───────────────────────────────────────────
   hero.js — animação de entrada da view Home
─────────────────────────────────────────────────────────── */

export function initHeroAnimations() {
    const avatar = document.querySelector('#heroAvatar');
    const name   = document.querySelector('#heroName');
    const role   = document.querySelector('.hero__role');
    const bio    = document.querySelector('.hero__bio');
    const social = document.querySelectorAll('#heroSocial .social-btn');

    // Sai sem erro se os elementos não existirem (outra view ativa)
    if (!avatar || !name) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from(avatar, { scale: 0.85, opacity: 0, duration: 0.7, delay: 0.1 })
      .from(name,   { y: 20, opacity: 0, duration: 0.5 }, '-=0.3')
      .from(role,   { y: 14, opacity: 0, duration: 0.45 }, '-=0.35')
      .from(bio,    { y: 12, opacity: 0, duration: 0.45 }, '-=0.35')
      .from(social, { y: 10, opacity: 0, duration: 0.4, stagger: 0.08 }, '-=0.3');
}
