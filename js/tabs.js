/* -- TABS & TAG FILTER FUNCTIONALITY -- */
export function initTabs() {
    initTagFilters();

    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    if (tabButtons.length === 0) {
        return;
    }

    // Create tab indicator
    const tabsContainer = document.querySelector('.tabs');
    const indicator = document.createElement('div');
    indicator.className = 'tab-indicator';
    tabsContainer.appendChild(indicator);

    // Initialize indicator position
    updateTabIndicator(indicator);

    tabButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            const targetPane = document.getElementById(targetTab);
            
            if (targetPane) {
                targetPane.classList.add('active');
            }

            // Animate indicator
            updateTabIndicator(indicator);
        });
    });
}

export function initTagFilters() {
    const filterBar = document.getElementById('tagFilterBar');
    if (!filterBar) return;

    const cards = document.querySelectorAll('.project-card');
    if (cards.length === 0) return;

    // Coleta todas as tags únicas dos cards presentes
    const tagsSet = new Set();
    cards.forEach(card => {
        const tagElements = card.querySelectorAll('.tag');
        tagElements.forEach(tagEl => {
            const tagText = tagEl.textContent.trim();
            if (tagText) tagsSet.add(tagText);
        });
    });

    // Ordena as tags
    const sortedTags = Array.from(tagsSet).sort();

    // Renderiza botões de filtro
    filterBar.innerHTML = `<button class="tag-filter-btn active" data-tag="all">Todos</button>`;
    sortedTags.forEach(tag => {
        const btn = document.createElement('button');
        btn.className = 'tag-filter-btn';
        btn.setAttribute('data-tag', tag);
        btn.textContent = tag;
        filterBar.appendChild(btn);
    });

    const filterBtns = filterBar.querySelectorAll('.tag-filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const selectedTag = btn.getAttribute('data-tag');

            cards.forEach(card => {
                const cardTags = Array.from(card.querySelectorAll('.tag')).map(t => t.textContent.trim());
                if (selectedTag === 'all' || cardTags.includes(selectedTag)) {
                    gsap.to(card, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.3,
                        display: 'flex',
                        ease: 'power2.out'
                    });
                } else {
                    gsap.to(card, {
                        opacity: 0,
                        scale: 0.95,
                        duration: 0.2,
                        display: 'none',
                        ease: 'power2.in'
                    });
                }
            });
        });
    });

    // Permitir filtrar clicando diretamente na tag de um card
    cards.forEach(card => {
        const tagElements = card.querySelectorAll('.tag');
        tagElements.forEach(tagEl => {
            tagEl.style.cursor = 'pointer';
            tagEl.addEventListener('click', (e) => {
                e.stopPropagation();
                const tagText = tagEl.textContent.trim();
                const targetBtn = Array.from(filterBtns).find(b => b.getAttribute('data-tag') === tagText);
                if (targetBtn) {
                    targetBtn.click();
                }
            });
        });
    });
}

function updateTabIndicator(indicator) {
    const activeBtn = document.querySelector('.tab-btn.active');
    
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

// Also initialize on DOMContentLoaded for fallback
document.addEventListener('DOMContentLoaded', initTabs);

