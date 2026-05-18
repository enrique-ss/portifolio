/* ── SCROLL REVEALS (BIDIRECIONAL) ──────────────────────────
   reveals.js — elementos surgem ao descer e somem ao subir
─────────────────────────────────────────────────────────── */

export function initScrollTriggerAnimations() {
    // Limpa triggers anteriores (evita duplicação ao trocar de view)
    ScrollTrigger.getAll().forEach(t => t.kill());

    const items = document.querySelectorAll(
        '.section-header, .skill-chip, .edu-card, .education__subtitle'
    );

    items.forEach((el, i) => {
        // Estado inicial: invisível e levemente abaixo (15px para ser mais rápido/fluido)
        gsap.set(el, { opacity: 0, y: 15 });

        ScrollTrigger.create({
            trigger: el,
            start: 'top 90%', // Trigga muito mais cedo (10% acima da borda inferior) para ficar dinâmico
            onEnter:     () => gsap.to(el, { opacity: 1, y: 0,  duration: 0.4, ease: 'power2.out', delay: (i % 5) * 0.02 }),
            onLeaveBack: () => gsap.to(el, { opacity: 0, y: 15, duration: 0.4, ease: 'power2.out' }),
        });
    });

    ScrollTrigger.refresh();
}
