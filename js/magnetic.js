/* ── MAGNETIC BUTTONS ────────────────────────────────────────
   magnetic.js — leve atração nos botões ao hover
─────────────────────────────────────────────────────────── */

export function initMagneticButtons() {
    // Ignora em touch (mobile)
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.querySelectorAll('.social-btn, .btn, .toggle-btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const { left, top, width, height } = btn.getBoundingClientRect();
            const dx = (e.clientX - (left + width / 2)) * 0.18;
            const dy = (e.clientY - (top + height / 2)) * 0.18;
            gsap.to(btn, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.5)' });
        });
    });
}
