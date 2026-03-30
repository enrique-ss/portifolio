/* ── SCROLL REVEALS (BIDIRECIONAL) ──────────────────────────
   reveals.js — elementos surgem ao descer e somem ao subir
─────────────────────────────────────────────────────────── */

export function initScrollTriggerAnimations() {
    // Limpa triggers anteriores (evita duplicação ao trocar de view)
    ScrollTrigger.getAll().forEach(t => t.kill());

    const items = document.querySelectorAll(
        '.section-header, .skill-chip, .edu-card, .education__subtitle, .project-card, .notebook-card'
    );

    items.forEach((el, i) => {
        // Estado inicial: invisível e levemente abaixo
        gsap.set(el, { opacity: 0, y: 22 });

        ScrollTrigger.create({
            trigger: el,
            start: 'top 92%', // Entra quando chega perto do fundo da tela
            end:   'top 8%',  // Sai quando sobe além do topo da tela
            // toggleActions: onEnter onLeave onEnterBack onLeaveBack
            //   → entra descendo: aparece
            //   → sai subindo (saiu pelo topo): some
            //   → volta descendo: reaparece
            //   → sai descendo (voltou pelo fundo): some de novo
            onEnter:     () => gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: (i % 5) * 0.04 }),
            onLeave:     () => gsap.to(el, { opacity: 0, y: -18, duration: 0.4, ease: 'power2.in' }),
            onEnterBack: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }),
            onLeaveBack: () => gsap.to(el, { opacity: 0, y: 22, duration: 0.4, ease: 'power2.in' }),
        });
    });

    ScrollTrigger.refresh();
}
