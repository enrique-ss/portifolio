/* ── MAIN ENTRY ──────────────────────────────────────────────
   main.js — inicializa o router e os efeitos globais
─────────────────────────────────────────────────────────── */

import { initRouter }          from './router.js';
import { initBackground }       from './background.js';
import { initMagneticButtons }  from './magnetic.js';
import { initTheme }            from './theme.js';

document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // 0. Tema (primeiro para evitar flash de cor errada)
    initTheme();

    // 1. Fundo perspectivado
    initBackground();

    // 2. Roteador
    initRouter();

    // 3. Efeitos de botões
    initMagneticButtons();
});

