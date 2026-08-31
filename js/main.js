/* ── MAIN ENTRY ──────────────────────────────────────────────
   main.js — inicializa o router e os efeitos globais
─────────────────────────────────────────────────────────── */

import { initRouter }          from './router.js';
import { initBackground }       from './background.js';
import { initTheme }            from './theme.js';
import './tabs.js';

document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // 0. Tema (primeiro para evitar flash de cor errada)
    initTheme();

    // 1. Fundo perspectivado
    initBackground();

    // 2. Roteador
    initRouter();

    // 3. Botão Voltar ao Topo
    initScrollToTop();
});

function initScrollToTop() {
    const btn = document.getElementById('scrollTopBtn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        gsap.to(window, {
            scrollTo: { y: 0 },
            duration: 0.8,
            ease: 'power3.inOut'
        });
    });
}


