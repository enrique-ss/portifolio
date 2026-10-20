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

    btn.addEventListener('click', () => generatePDF());
}

async function generatePDF() {
    const home = document.querySelector('.view-home');
    if (!home) {
        window.location.hash = '#home';
        window.addEventListener('portfolio:home-ready', generatePDF, { once: true });
        return;
    }

    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) {
        console.error('A biblioteca de geração de PDF não foi carregada.');
        return;
    }

    const text = (selector, root = home) => root.querySelector(selector)?.innerText.trim() || '';
    const entries = (selector) => [...home.querySelectorAll(selector)];
    const name = text('#heroName') || 'Enrique Silveira';
    const role = text('.hero__role').replace(/^\/\//, '').replace(/\s+/g, ' ');
    const summary = 'Estudante de Licenciatura em Computação (IFSul) e do curso Técnico em Desenvolvimento de Sistemas (Senac). O curso de ADS na UniFacitie está trancado.';

    const pdf = new jsPDF({ format: 'a4', unit: 'mm', compress: true });
    const fontScale = 1;
    const setFontSize = (size) => pdf.setFontSize(size * fontScale);
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 12;
    const contentWidth = pageWidth - margin * 2;
    const teal = [23, 107, 114];
    const ink = [32, 42, 53];
    const muted = [82, 99, 106];
    const heading = (label, y) => {
        pdf.setFont('helvetica', 'bold');
        setFontSize(10.2);
        pdf.setTextColor(...teal);
        pdf.text(label.toLocaleUpperCase('pt-BR'), margin, y);
        pdf.setDrawColor(189, 205, 208);
        pdf.setLineWidth(0.25);
        pdf.line(margin, y + 1.5, pageWidth - margin, y + 1.5);
        return y + 5.5 * fontScale;
    };
    const plainText = (value, x, y, width, size = 8.5, color = ink) => {
        pdf.setFont('helvetica', 'normal');
        setFontSize(size);
        pdf.setTextColor(...color);
        const lines = pdf.splitTextToSize(value, width);
        pdf.text(lines, x, y);
        return y + lines.length * size * fontScale * 0.42;
    };

    // Foto circular e cabeçalho compacto com dados de contato impressos.
    const avatar = home.querySelector('#heroAvatar');
    if (avatar && !avatar.complete) {
        await new Promise((resolve) => {
            avatar.addEventListener('load', resolve, { once: true });
            avatar.addEventListener('error', resolve, { once: true });
        });
    }
    if (avatar?.naturalWidth) {
        const sourceSize = Math.min(avatar.naturalWidth, avatar.naturalHeight);
        const cropY = (avatar.naturalHeight - sourceSize) * 0.12;
        const photoCanvas = document.createElement('canvas');
        photoCanvas.width = sourceSize;
        photoCanvas.height = sourceSize;
        const context = photoCanvas.getContext('2d');
        const cornerRadius = sourceSize * (32 / 140);
        context.beginPath();
        context.roundRect(0, 0, sourceSize, sourceSize, cornerRadius);
        context.clip();
        context.drawImage(avatar, 0, cropY, sourceSize, sourceSize, 0, 0, sourceSize, sourceSize);
        pdf.addImage(photoCanvas.toDataURL('image/png'), 'PNG', margin, 16, 24, 24);
        pdf.setDrawColor(210, 221, 223);
        pdf.setLineWidth(0.35);
        pdf.roundedRect(margin, 16, 24, 24, 5.5, 5.5, 'S');
    }
    const infoX = margin + 30;
    const contactX = 137;
    const contactWidth = pageWidth - margin - contactX;
    pdf.setFont('helvetica', 'bold');
    setFontSize(22);
    pdf.setTextColor(18, 60, 70);
    pdf.text(name, infoX, 23, { maxWidth: contactX - infoX - 5 });
    pdf.setFont('helvetica', 'bold');
    setFontSize(10.2);
    pdf.setTextColor(...teal);
    pdf.text(pdf.splitTextToSize(role, contactX - infoX - 5), infoX, 31);
    pdf.setDrawColor(...teal);
    pdf.setFont('helvetica', 'bold');
    setFontSize(9);
    pdf.setTextColor(...ink);
    pdf.text('CONTATO', contactX, 18);
    let contactY = 24;
    contactY = plainText('Email: enriqueabyss@gmail.com', contactX, contactY, contactWidth, 8.2);
    contactY = plainText('LinkedIn: luiz-enrique-ss', contactX, contactY + 1, contactWidth, 8.2);
    contactY = plainText('GitHub: enrique-ss', contactX, contactY + 1, contactWidth, 8.2);
    plainText('Pelotas, Três Vendas', contactX, contactY + 1, contactWidth, 8.2);

    let y = heading('Sobre mim', 47);
    y = plainText(summary, margin, y, contentWidth, 9.5) + 7 * fontScale;
    y = heading('Competências', y);
    const skills = entries('.skill-chip').map((item) => item.innerText.trim()).join(' · ');
    y = plainText(skills, margin, y, contentWidth, 9.1) + 7 * fontScale;
    y = heading('Formação', y);
    for (const item of entries('.edu-card')) {
        const title = text('.edu-card__title', item);
        let meta = text('.edu-card__meta', item).replace(/\s+/g, ' ');
        if (meta.includes('UniFacitie')) meta = meta.replace('2022 – Atualmente', '2022 – Trancado');
        pdf.setFont('helvetica', 'bold');
        setFontSize(9.4);
        pdf.setTextColor(...ink);
        const titleLines = pdf.splitTextToSize(title, 122);
        pdf.text(titleLines, margin, y);
        pdf.setFont('helvetica', 'normal');
        setFontSize(8.4);
        pdf.setTextColor(...muted);
        pdf.text(pdf.splitTextToSize(meta, 55), pageWidth - margin, y, { align: 'right', maxWidth: 55 });
        y += Math.max(titleLines.length * 4.3 * fontScale, 5.8 * fontScale) + 3.5 * fontScale;
    }

    y += 6 * fontScale;
    y = heading('Experiência e projetos', y);
    const experienceSummaries = [
        'Desenvolveu o projeto Amigobô em Scratch, criou a narrativa interativa e apresentou a proposta educacional ao público.',
        'Planejou e ministrou oficina de criação de visual novel em Scratch, ensinando lógica de programação a adolescentes.',
        'Pesquisou metodologias acessíveis e ministrou aulas de Word, Excel e segurança digital para pessoas idosas.',
        'Pesquisou o ensino de programação por mecânicas de jogos e apresentou o trabalho na 12ª SIIEPE da UFPel.',
        'Organizou produtos, abasteceu gôndolas e apoiou clientes na localização de itens.',
        'Repôs mercadorias, organizou o estoque e apoiou clientes em ambiente de atacado.',
        'Atendeu clientes no caixa, processou pagamentos e prestou suporte com agilidade e cordialidade.',
        'Atendeu clientes e processou pagamentos, com foco em comunicação, eficiência e qualidade de serviço.'
    ];
    for (const [index, item] of entries('.experience-card').entries()) {
        const title = text('.experience-card__title', item);
        const meta = text('.experience-card__meta', item).replace(/\s+/g, ' ');
        const description = experienceSummaries[index] || text('.experience-card__desc', item).replace(/\s+/g, ' ');

        pdf.setFont('helvetica', 'bold');
        setFontSize(9.2);
        pdf.setTextColor(...ink);
        const titleLines = pdf.splitTextToSize(title, 129);
        pdf.text(titleLines, margin, y);
        pdf.setFont('helvetica', 'normal');
        setFontSize(8.0);
        pdf.setTextColor(...muted);
        pdf.text(pdf.splitTextToSize(meta, 48), pageWidth - margin, y, { align: 'right', maxWidth: 48 });
        y += Math.max(titleLines.length * 4 * fontScale, 4.5 * fontScale) + 0.5 * fontScale;
        pdf.setFont('helvetica', 'normal');
        setFontSize(8.8);
        pdf.setTextColor(...ink);
        const descriptionLines = pdf.getTextWidth(description) > contentWidth * 0.7
            ? (() => {
                const words = description.split(/\s+/);
                let firstLine = '';
                let wordsUsed = 0;
                for (const word of words) {
                    const candidate = firstLine ? `${firstLine} ${word}` : word;
                    if (pdf.getTextWidth(candidate) > contentWidth * 0.7 && firstLine) break;
                    firstLine = candidate;
                    wordsUsed += 1;
                }
                return [firstLine, ...pdf.splitTextToSize(words.slice(wordsUsed).join(' '), contentWidth)];
            })()
            : [description];
        pdf.text(descriptionLines, margin, y);
        y += descriptionLines.length * 8.8 * fontScale * 0.42 + 4 * fontScale;
    }

    if (y > pageHeight - margin) {
        console.warn('O currículo passou do limite de uma página.', { bottom: y, pageLimit: pageHeight - margin });
    }

    pdf.save('curriculo-enrique-silveira.pdf');
}

