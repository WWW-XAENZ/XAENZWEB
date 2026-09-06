/**
 * Xaenz Digital - Interactive JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    initPageLoader();
    initLogoLoading();
    initCodeBackground();
    initHeader();
    initMobileMenu();
    initSoundSystem();
    initSmoothScroll();
    initAnimations();
    initCounter();
    initForm();
    initQuoteCalculator();
    initFaq();
    initNewsletter();
    initPortfolioFilter();
    initProtectedPreviews();
    initGallery();
});

function initPageLoader() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = '<div class="loader-brand"><img src="logoXaenzWeb.png" alt="XaenzWeb"><span class="loader-scan"></span></div><div class="loader-status">INITIALIZING XAENZ SYSTEM <b>OK</b></div><div class="loader-bar"><span></span></div>';
    document.body.appendChild(loader);
    window.setTimeout(() => loader.classList.add('is-hidden'), 720);
    window.setTimeout(() => loader.remove(), 1200);
}

function initGallery() {
    const images = document.querySelectorAll('.portfolio-image img');
    if (!images.length) return;

    const modal = document.createElement('div');
    modal.className = 'gallery-modal';
    modal.innerHTML = '<button class="gallery-close" type="button" aria-label="Cerrar imagen"><i class="fas fa-xmark" aria-hidden="true"></i></button><figure><img alt=""><figcaption></figcaption></figure>';
    document.body.appendChild(modal);
    const modalImage = modal.querySelector('img');
    const caption = modal.querySelector('figcaption');

    function closeGallery() {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    images.forEach(image => {
        image.tabIndex = 0;
        image.setAttribute('role', 'button');
        const openGallery = () => {
            modalImage.src = image.currentSrc || image.src;
            modalImage.alt = image.alt;
            caption.textContent = image.alt;
            modal.classList.add('is-open');
            document.body.style.overflow = 'hidden';
        };
        image.addEventListener('click', openGallery);
        image.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openGallery();
            }
        });
    });

    modal.querySelector('.gallery-close').addEventListener('click', closeGallery);
    modal.addEventListener('click', event => {
        if (event.target === modal) closeGallery();
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeGallery();
    });
}

function initProtectedPreviews() {
    document.querySelectorAll('.protected-preview').forEach(preview => {
        preview.addEventListener('contextmenu', event => event.preventDefault());
        preview.addEventListener('dragstart', event => event.preventDefault());
        preview.addEventListener('selectstart', event => event.preventDefault());
    });
}

function initSoundSystem() {
    if (!window.AudioContext && !window.webkitAudioContext) return;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    let audioContext;
    const enabled = true;
    let soundStep = 0;
    let lastHoverAt = 0;

    function ensureAudioContext() {
        audioContext ||= new AudioContextClass();
        if (audioContext.state === 'suspended') audioContext.resume();
        return audioContext;
    }

    function playTone(frequency, duration = 0.06, type = 'square', volume = 0.025, delay = 0) {
        if (!enabled) return;
        const context = ensureAudioContext();
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const now = context.currentTime + delay;
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(volume, now + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        oscillator.connect(gain).connect(context.destination);
        oscillator.start(now);
        oscillator.stop(now + duration + 0.01);
    }

    function playSound(sound) {
        const sounds = {
            glitch: [
                [[170, 0.025, 'square', 0.012], [920, 0.018, 'sawtooth', 0.009, 0.025], [280, 0.03, 'square', 0.01, 0.05]],
                [[240, 0.02, 'sawtooth', 0.01], [760, 0.025, 'square', 0.008, 0.025], [190, 0.04, 'triangle', 0.009, 0.06]],
                [[120, 0.03, 'square', 0.011], [680, 0.02, 'sawtooth', 0.008, 0.03], [340, 0.035, 'square', 0.009, 0.06]]
            ],
            hover: [
                [[620, 0.025, 'square', 0.008]],
                [[700, 0.022, 'triangle', 0.007]],
                [[560, 0.028, 'sine', 0.007]]
            ],
            click: [
                [[180, 0.045, 'sawtooth', 0.014], [360, 0.065, 'square', 0.01, 0.035]],
                [[210, 0.035, 'square', 0.012], [420, 0.07, 'triangle', 0.009, 0.04]],
                [[150, 0.05, 'triangle', 0.012], [300, 0.055, 'sawtooth', 0.008, 0.045]]
            ],
            navigate: [
                [[260, 0.05, 'square', 0.012], [520, 0.09, 'triangle', 0.012, 0.045]],
                [[300, 0.045, 'triangle', 0.011], [600, 0.08, 'sine', 0.01, 0.05]],
                [[220, 0.055, 'square', 0.01], [440, 0.1, 'triangle', 0.011, 0.05]]
            ],
            menu: [
                [[240, 0.05, 'square', 0.012], [480, 0.07, 'square', 0.01, 0.05]],
                [[190, 0.045, 'triangle', 0.011], [380, 0.08, 'square', 0.009, 0.055]]
            ],
            confirm: [
                [[440, 0.06, 'triangle', 0.012], [660, 0.1, 'triangle', 0.014, 0.06]],
                [[392, 0.06, 'sine', 0.011], [784, 0.09, 'triangle', 0.012, 0.065]]
            ]
        };

        const variants = sounds[sound] || sounds.click;
        const pattern = variants[soundStep++ % variants.length];
        pattern.forEach(([frequency, duration, type, volume, delay]) => {
            playTone(frequency, duration, type, volume, delay || 0);
        });
    }

    document.addEventListener('pointerover', event => {
        const target = event.target.closest('a, button, [role="button"], summary, .faq-question');
        if (!target || target.contains(event.relatedTarget)) return;
        if (target.matches('.logo')) {
            playSound('glitch');
        } else {
            const now = performance.now();
            if (now - lastHoverAt > 90) {
                lastHoverAt = now;
                playSound('hover');
            }
        }
    });

    document.addEventListener('click', event => {
        const target = event.target.closest('a, button, [role="button"], summary, .faq-question');
        if (!target) return;
        if (target.matches('.nav-link, .btn, .btn-project, .social-links a')) {
            playSound('navigate');
        } else if (target.matches('.hamburger')) {
            playSound('menu');
        } else if (target.matches('.filter-btn, .faq-question')) {
            playSound('confirm');
        } else {
            playSound('click');
        }
    });
}

function initLogoLoading() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const logos = document.querySelectorAll('.logo');
    logos.forEach(logo => logo.classList.add('logo-loading'));

    window.setTimeout(() => {
        logos.forEach(logo => logo.classList.remove('logo-loading'));
    }, 1400);
}

/**
 * Background matrix/vector code effect
 */
function initCodeBackground() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth <= 700) {
        return;
    }

    const existing = document.querySelector('.code-background');
    if (existing) existing.remove();

    const codeBackground = document.createElement('div');
    codeBackground.className = 'code-background';

    const codeLines = document.createElement('div');
    codeLines.className = 'code-lines';
    const codeTemplates = [
        () => `const load = ${Math.floor(62 + Math.random() * 37)}%;`,
        () => `if (ideas) { ship(${Math.floor(100 + Math.random() * 900)}); }`,
        () => `01 // NODE_${String(Math.floor(1 + Math.random() * 9)).padStart(2, '0')} :: ONLINE`,
        () => `<Xaenz build="${Math.floor(2000 + Math.random() * 999)}" />`,
        () => `position: { x: ${Math.floor(10 + Math.random() * 990)}, y: ${Math.floor(10 + Math.random() * 990)} }`,
        () => `return growth * ${Math.floor(2 + Math.random() * 8)};`
    ];

    codeTemplates.forEach((template, index) => {
        const codeLine = document.createElement('span');
        codeLine.textContent = template();
        codeLine.dataset.codeTemplate = index;
        codeLine.style.setProperty('--line-index', index);
        codeLines.appendChild(codeLine);
    });
    codeBackground.appendChild(codeLines);

    setInterval(() => {
        codeLines.querySelectorAll('span').forEach(codeLine => {
            const template = codeTemplates[Number(codeLine.dataset.codeTemplate)];
            codeLine.textContent = template();
        });
    }, 1100);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    codeBackground.appendChild(canvas);
    document.body.appendChild(codeBackground);

    const fontSize = 18;
    const chars = '01{}[]<>/;:+=*&$';
    let columns = 0;
    let drops = [];

    function resizeCanvas() {
        const ratio = window.devicePixelRatio || 1;
        canvas.width = Math.floor(window.innerWidth * ratio);
        canvas.height = Math.floor(window.innerHeight * ratio);
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

        columns = Math.ceil(window.innerWidth / fontSize);
        drops = Array.from({ length: columns }, () => Math.random() * -60);
    }

    function renderMatrix() {
        ctx.fillStyle = 'rgba(8, 9, 9, 0.16)';
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        for (let i = 0; i < drops.length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;

            const alpha = i % 5 === 0 ? 0.72 : 0.28;
            ctx.fillStyle = i % 7 === 0 ? `rgba(98, 230, 255, ${alpha})` : `rgba(57, 229, 140, ${alpha})`;
            ctx.font = `${fontSize}px 'IBM Plex Mono', Consolas, monospace`;
            ctx.shadowColor = i % 7 === 0 ? 'rgba(98, 230, 255, 0.28)' : 'rgba(57, 229, 140, 0.28)';
            ctx.shadowBlur = 10;
            ctx.fillText(char, x, y);
            ctx.shadowBlur = 0;

            if (y > window.innerHeight && Math.random() > 0.985) {
                drops[i] = 0;
            }

            drops[i] += 0.32;
        }

        requestAnimationFrame(renderMatrix);
    }

    resizeCanvas();
    renderMatrix();
    window.addEventListener('resize', resizeCanvas);
}

/**
 * Header scroll effect
 */
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!hamburger || !navMenu) return;

    const toggleMenu = () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        const isOpen = navMenu.classList.contains('active');
        hamburger.setAttribute('aria-expanded', String(isOpen));
        hamburger.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    hamburger.addEventListener('click', toggleMenu);
    hamburger.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleMenu();
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-label', 'Abrir menú');
            document.body.style.overflow = '';
        });
    });

    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-label', 'Abrir menú');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    const header = document.querySelector('.header');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || !document.querySelector(href)) return;
            e.preventDefault();
            const target = document.querySelector(href);
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        });
    });
}

/**
 * Scroll animations using Intersection Observer
 */
function initAnimations() {
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

    const cards = document.querySelectorAll('.service-card, .portfolio-card, .about-card');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), index * 100);
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => cardObserver.observe(card));
}

/**
 * Animated counter for statistics
 */
function initCounter() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach((counter, index) => {
        const target = parseInt(counter.getAttribute('data-count'));
        const suffix = counter.getAttribute('data-suffix') || '';
        
        if (!isNaN(target)) {
            setTimeout(() => {
                counter.textContent = '0';
                
                let current = 0;
                const timer = setInterval(() => {
                    current++;
                    if (suffix) {
                        counter.textContent = current + suffix;
                    } else {
                        counter.textContent = current;
                    }
                    if (current >= target) {
                        clearInterval(timer);
                    }
                }, 200);
            }, index * 300);
        }
    });
}

/**
 * Contact form handling
 */
function initForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name')?.value;
        const message = document.getElementById('message')?.value;
        
        if (!name || !message) {
            showAlert('Por favor completa todos los campos', 'error');
            return;
        }

        const fullMessage = `Hola, soy ${name}. ${message}`;
        window.open(`https://wa.me/573102145133?text=${encodeURIComponent(fullMessage)}`, '_blank', 'noopener,noreferrer');
        showAlert('Abrimos WhatsApp con tu mensaje listo para enviar.', 'success');
    });
}

function initQuoteCalculator() {
    const form = document.getElementById('quote-form');
    if (!form) return;

    const type = document.getElementById('quote-type');
    const size = document.getElementById('quote-size');
    const feature = document.getElementById('quote-feature');
    const total = document.getElementById('quote-total');
    const formatMoney = value => `$${value.toLocaleString('es-CO')} COP`;

    function updateQuote() {
        const base = Number(type.selectedOptions[0].dataset.base);
        const scopeExtra = Number(size.selectedOptions[0].dataset.extra);
        const featureExtra = Number(feature.selectedOptions[0].dataset.extra);
        const estimate = base + scopeExtra + featureExtra;
        total.textContent = `${formatMoney(estimate)} - ${formatMoney(Math.round(estimate * 1.5))}`;
    }

    [type, size, feature].forEach(select => select.addEventListener('change', updateQuote));
    updateQuote();

    form.addEventListener('submit', event => {
        event.preventDefault();
        const projectName = type.selectedOptions[0].textContent;
        const scopeName = size.selectedOptions[0].textContent;
        const featureName = feature.selectedOptions[0].textContent;
        const message = `Hola, quiero cotizar ${projectName}. Alcance: ${scopeName}. Función adicional: ${featureName}. Referencia: ${total.textContent}.`;
        window.open(`https://wa.me/573102145133?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    });
}

/**
 * Show alert message
 */
function showAlert(message, type) {
    const existingAlert = document.querySelector('.alert-message');
    if (existingAlert) existingAlert.remove();

    const alert = document.createElement('div');
    alert.className = `alert-message alert-${type}`;
    alert.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i><span>${message}</span>`;
    alert.style.cssText = `position:fixed;top:100px;right:24px;padding:16px 24px;background:${type==='success'?'rgba(168,85,247,0.95)':'rgba(236,72,153,0.95)'};color:white;border-radius:12px;display:flex;align-items:center;gap:12px;z-index:10000;animation:slideIn 0.3s ease-out;box-shadow:0 8px 32px rgba(0,0,0,0.3);font-family:'Outfit',sans-serif;`;

    if (!document.querySelector('#alert-styles')) {
        const style = document.createElement('style');
        style.id = 'alert-styles';
        style.textContent = '@keyframes slideIn{from{opacity:0;transform:translateX(100px)}to{opacity:1;transform:translateX(0)}}';
        document.head.appendChild(style);
    }

    document.body.appendChild(alert);
    setTimeout(() => {
        alert.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => alert.remove(), 300);
    }, 5000);
}

/**
 * FAQ Accordion
 */
function initFaq() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question?.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(otherItem => otherItem.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });
}

/**
 * Newsletter form
 */
function initNewsletter() {
    const forms = document.querySelectorAll('.newsletter-form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = form.querySelector('input');
            if (input?.value) {
                showAlert('¡Gracias por suscribirte! Te mantendremos informado.', 'success');
                input.value = '';
            }
        });
    });
}

/**
 * Portfolio Filter
 */
function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            const filter = btn.dataset.filter;

            portfolioCards.forEach(card => {
                const category = card.dataset.category;
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    });
}

/**
 * Navbar active state on scroll
 */
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';

    sections.forEach(section => {
        if (window.pageYOffset >= section.offsetTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});