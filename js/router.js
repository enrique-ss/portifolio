/* ── ROUTER & VIEW MANAGER ──────────────────────────────────
   router.js — gerencia a troca de conteúdo sem refresh
─────────────────────────────────────────────────────────── */

import { initHeroAnimations } from './hero.js';
import { initScrollTriggerAnimations } from './reveals.js';
import { initTabs } from './tabs.js';

const $app = document.getElementById('app');

export async function navigate(hash) {
    const section = hash.replace('#', '') || 'home';
    const path = `./sections/${section}.html`;

    try {
        // 1. Inicia Saída (Fade Out)
        if ($app.children.length > 0) {
            await gsap.to($app, { opacity: 0, y: 10, duration: 0.3, ease: 'power2.in' });
        }

        // 2. Busca o novo conteúdo
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Não foi possível carregar: ${section}`);
        const html = await response.text();

        // 3. Injeta e Reseta
        $app.innerHTML = html;
        window.scrollTo(0, 0);

        // 4. Inicia Entrada (Fade In)
        gsap.fromTo($app, 
            { opacity: 0, y: -10 }, 
            { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
        );

        // 5. Reinicializa Animações conforme a Seção
        initScrollTriggerAnimations();
        
        if (section === 'home') {
            initHeroAnimations();
        }
        
        if (section === 'projects') {
            setTimeout(() => initTabs(), 100);
        }

    } catch (error) {
        console.error(error);
        $app.innerHTML = `<section class="error"><h2>Ops! Algo deu errado.</h2><p>${error.message}</p><a href="#home">Voltar ao Início</a></section>`;
    }
}

export function initRouter() {
    window.addEventListener('hashchange', () => {
        navigate(window.location.hash);
        updateActiveLink();
    });

    // Carga inicial
    navigate(window.location.hash);
    updateActiveLink();
}

function updateActiveLink() {
    const hash = window.location.hash || '#home';
    const buttons = document.querySelectorAll('.toggle-btn');
    const indicator = document.getElementById('navIndicator');

    let activeBtn = null;

    buttons.forEach(btn => {
        const linkHash = btn.getAttribute('href');
        const isActive = linkHash === hash;
        btn.classList.toggle('active', isActive);
        if (isActive) activeBtn = btn;
    });

    if (activeBtn && indicator) {
        gsap.to(indicator, {
            x: activeBtn.offsetLeft,
            width: activeBtn.offsetWidth,
            opacity: 1,
            duration: 0.4,
            ease: 'power3.out'
        });
    }
}
