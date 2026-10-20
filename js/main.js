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

    // 4. Botão PDF
    initPDFButton();
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

function initPDFButton() {
    const btn = document.getElementById('pdfBtn');
    if (!btn) return;

    btn.addEventListener('click', async () => {
        // Navigate to home if not already there
        if (window.location.hash !== '' && window.location.hash !== '#home') {
            window.location.hash = '#home';
            setTimeout(() => generatePDF(), 500);
        } else {
            generatePDF();
        }
    });
}

async function generatePDF() {
    // Just open print dialog - user can save as PDF
    window.print();
}

