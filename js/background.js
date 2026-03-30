/* ── FLOATING BLOBS BACKGROUND ──────────────────────────────
   background.js — blobs orgânicos que flutuam com o scroll
─────────────────────────────────────────────────────────── */

export function initBackground() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let scrollProgress = 0;

    // Rastreia scroll progress via GSAP scrub
    gsap.to({}, {
        scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0,
            onUpdate: (self) => { scrollProgress = self.progress; }
        }
    });

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // ── Definição dos Blobs ──────────────────────────────────
    // Cada blob tem posição base, tamanho, velocidade de parallax e fase
    const blobs = [
        { bx: 0.15, by: 0.25, r: 140, speed: 0.35, phase: 0    },
        { bx: 0.80, by: 0.15, r: 120, speed: 0.55, phase: 1.4  },
        { bx: 0.50, by: 0.60, r: 100, speed: 0.25, phase: 2.8  },
        { bx: 0.10, by: 0.75, r: 85,  speed: 0.45, phase: 0.7  },
        { bx: 0.85, by: 0.70, r: 130, speed: 0.30, phase: 2.1  },
        { bx: 0.40, by: 0.90, r: 110, speed: 0.60, phase: 1.8  },
        { bx: 0.30, by: 0.05, r: 90,  speed: 0.40, phase: 3.2  },
        { bx: 0.70, by: 0.45, r: 75,  speed: 0.65, phase: 0.4  },
        { bx: 0.05, by: 0.55, r: 115, speed: 0.20, phase: 4.1  },
    ];

    // Desenha um blob como curva bezier orgânica com n pontos
    function drawBlob(cx, cy, r, t) {
        const n       = 8;   // Número de pontos ao redor
        const wobble  = r * 0.28; // Variação de forma
        const points  = [];

        for (let i = 0; i < n; i++) {
            const angle  = (i / n) * Math.PI * 2;
            // Cada ponto "pulsa" de forma única usando seno com fase diferente
            const pulse  = Math.sin(t * 1.8 + i * 1.05 + angle) * wobble;
            const radius = r + pulse;
            points.push({
                x: cx + Math.cos(angle) * radius,
                y: cy + Math.sin(angle) * radius,
            });
        }

        ctx.beginPath();
        for (let i = 0; i < n; i++) {
            const curr = points[i];
            const next = points[(i + 1) % n];
            const cpx  = (curr.x + next.x) / 2;
            const cpy  = (curr.y + next.y) / 2;
            if (i === 0) ctx.moveTo(cpx, cpy);
            else ctx.quadraticCurveTo(curr.x, curr.y, cpx, cpy);
        }
        ctx.closePath();
        ctx.fill();
    }

    function draw(time) {
        const W = canvas.width;
        const H = canvas.height;
        const t = time * 0.0004; // Velocidade geral de pulsação (lenta)

        ctx.clearRect(0, 0, W, H);

        // Lê a cor do tema atual
        const style = getComputedStyle(document.documentElement);
        const rgb   = style.getPropertyValue('--grid-color-h').trim() || '255,255,255';

        blobs.forEach(blob => {
            // Posição Y se move com o scroll (parallax por velocidade)
            const parallaxY = scrollProgress * H * blob.speed;
            // Oscilação horizontal suave e independente do scroll
            const osc = Math.sin(t + blob.phase) * 20;

            const cx = blob.bx * W + osc;
            const cy = (blob.by * H - parallaxY + H) % H; // Loop vertical

            // Gradiente radial suave (borda transparente, centro semi-transparente)
            const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, blob.r * 1.4);
            grad.addColorStop(0,   `rgba(${rgb}, 0.06)`);
            grad.addColorStop(0.5, `rgba(${rgb}, 0.03)`);
            grad.addColorStop(1,   `rgba(${rgb}, 0)`);

            ctx.fillStyle = grad;
            drawBlob(cx, cy, blob.r, t + blob.phase);
        });

        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
}
