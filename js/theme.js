/* ── THEME MANAGER ───────────────────────────────────────────
   theme.js — alterna entre dark/light e persiste no localStorage
─────────────────────────────────────────────────────────── */

const KEY = 'portfolio-theme';

export function initTheme() {
    // Lê preferência salva ou prefere o sistema
    const saved  = localStorage.getItem(KEY);
    const system = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    applyTheme(saved || system);

    // Botão de toggle
    document.getElementById('themeToggle')?.addEventListener('click', () => {
        const current = document.documentElement.dataset.theme || 'dark';
        applyTheme(current === 'dark' ? 'light' : 'dark');
    });
}

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(KEY, theme);

    // Atualiza o ícone do botão
    const btn = document.getElementById('themeToggle');
    if (btn) btn.setAttribute('aria-label', theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro');
}
