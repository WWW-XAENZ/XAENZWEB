/**
 * Xaenz Digital - Interactive JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    initCodeBackground();
    initHeader();
    initMobileMenu();
    initSmoothScroll();
    initAnimations();
    initCounter();
    initForm();
    initFaq();
    initNewsletter();
    initPortfolioFilter();
});

/**
 * Background matrix/vector code effect
 */
function initCodeBackground() {
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

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
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

        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn?.innerHTML;
        
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
        }

        setTimeout(() => {
            showAlert('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
            form.reset();
            if (submitBtn) {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        }, 1500);
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
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
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