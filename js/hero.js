/* ── HERO ENTRANCE ───────────────────────────────────────────
   hero.js — animação de entrada da view Home
─────────────────────────────────────────────────────────── */

export function initHeroAnimations() {
    const avatar = document.querySelector('#heroAvatar');
    const name   = document.querySelector('#heroName');
    const role   = document.querySelector('.hero__role');
    const bio    = document.querySelector('.hero__bio');
    const social = document.querySelectorAll('#heroSocial .social-btn');

    // Helper to safely split text into spans without breaking HTML tags
    function wrapChars(el) {
        const spans = [];
        function walk(node) {
            if (node.nodeType === 3) { // Text node
                const chars = node.nodeValue.split('');
                if (chars.length === 0) return;
                const frag = document.createDocumentFragment();
                chars.forEach(char => {
                    const span = document.createElement('span');
                    span.textContent = char;
                    span.style.opacity = '0';
                    frag.appendChild(span);
                    spans.push(span);
                });
                node.parentNode.replaceChild(frag, node);
            } else if (node.nodeType === 1) { // Element node
                Array.from(node.childNodes).forEach(walk);
            }
        }
        Array.from(el.childNodes).forEach(walk);
        return spans;
    }

    if (!avatar || !name) return;

    // Prepare text elements for typing effect
    const nameChars = wrapChars(name);
    const roleChars = wrapChars(role);
    const bioChars  = wrapChars(bio);

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    tl.fromTo(avatar, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, delay: 0.1 })
      .to(nameChars, { opacity: 1, duration: 0.01, stagger: 0.03 }, "-=0.3")
      .to(roleChars, { opacity: 1, duration: 0.01, stagger: 0.015 }, "-=0.3")
      .to(bioChars,  { opacity: 1, duration: 0.01, stagger: 0.01 }, "-=0.2")
      .fromTo(social, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.08 }, "-=0.3");
}

