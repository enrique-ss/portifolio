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
        // Estado inicial: invisível e levemente abaixo
        gsap.set(el, { opacity: 0, y: 22 });

        ScrollTrigger.create({
            trigger: el,
            start: 'top 75%', // Trigga mais alto para não encostar na borda ao sumir
            onEnter:     () => gsap.to(el, { opacity: 1, y: 0,  duration: 0.5, ease: 'power2.out', delay: (i % 5) * 0.03 }),
            onLeaveBack: () => gsap.to(el, { opacity: 0, y: 22, duration: 0.5, ease: 'power2.out' }),
        });
    });

    ScrollTrigger.refresh();
}
