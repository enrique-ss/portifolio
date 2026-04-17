/* -- TABS FUNCTIONALITY -- */
export function initTabs() {
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
