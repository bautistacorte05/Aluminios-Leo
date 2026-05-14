document.addEventListener('DOMContentLoaded', () => {

    // 1. Dynamic Year
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // 2. Scroll Progress Bar
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = pct + '%';
        };
        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    }

    // 3. Custom Cursor — only for non-touch devices
    const cursorDot  = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    const isTouchOnly = window.matchMedia('(hover: none)').matches;

    if (cursorDot && cursorRing && !isTouchOnly) {
        document.body.classList.add('custom-cursor');

        let mouseX = -200, mouseY = -200;
        let ringX  = -200, ringY  = -200;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }, { passive: true });

        const tick = () => {
            ringX += (mouseX - ringX) * 0.13;
            ringY += (mouseY - ringY) * 0.13;

            cursorDot.style.left  = mouseX + 'px';
            cursorDot.style.top   = mouseY + 'px';
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top  = ringY + 'px';

            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);

        document.querySelectorAll('a, button, .service-card, .gallery-item, .taller-item, .modal-item')
            .forEach(el => {
                el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
                el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
            });
    }

    // 4. Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
                navbar.style.background = 'rgba(61,94,168,0.97)';
            } else {
                navbar.style.boxShadow = 'none';
                navbar.style.background = 'rgba(61,94,168,0.95)';
            }
        }, { passive: true });
    }

    // 5. Parallax Hero Image
    const heroWrapper = document.querySelector('.hero-image-wrapper');
    if (heroWrapper) {
        window.addEventListener('scroll', () => {
            const sy = window.scrollY;
            if (sy < window.innerHeight * 1.3) {
                heroWrapper.style.transform = `translateY(${sy * 0.15}px)`;
            }
        }, { passive: true });
    }

    // 6. Fade-in / drop-in observer
    // Hero elements: se muestran una vez y quedan permanentes (unobserve)
    // Resto de secciones: se reaniman al volver a pasar
    const heroEls = new Set(document.querySelectorAll('.hero .fade-in, .hero .drop-in'));

    const fadeObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                if (heroEls.has(e.target)) fadeObs.unobserve(e.target);
            } else {
                if (!heroEls.has(e.target)) e.target.classList.remove('visible');
            }
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.fade-in, .drop-in').forEach(el => fadeObs.observe(el));

    // 7. Staggered gallery entrance
    document.querySelectorAll('.gallery-item').forEach((el, i) => {
        el.style.transitionDelay = (i * 0.06) + 's';
    });
    document.querySelectorAll('.taller-item').forEach((el, i) => {
        el.style.transitionDelay = (i * 0.09) + 's';
    });

    // 8. Text reveal — hero: una vez y permanente; resto: se reanima
    const heroRevealEls = new Set(document.querySelectorAll('.hero .reveal-text'));

    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                if (heroRevealEls.has(e.target)) revealObs.unobserve(e.target);
            } else {
                if (!heroRevealEls.has(e.target)) e.target.classList.remove('visible');
            }
        });
    }, { threshold: 0.05 });
    document.querySelectorAll('.reveal-text').forEach(el => revealObs.observe(el));

    // Hero revela inmediatamente al cargar
    setTimeout(() => {
        document.querySelectorAll('.hero .reveal-text').forEach(el => el.classList.add('visible'));
    }, 150);

    // 9. Benefit items observer
    const benefitObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) e.target.classList.add('visible');
            else e.target.classList.remove('visible');
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.benefit-item').forEach(el => benefitObs.observe(el));

    // 10. Animated counters
    const counterObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            const el = e.target;
            const targetNum = parseInt(el.dataset.count, 10);
            const suffix    = el.dataset.suffix || '';

            if (!e.isIntersecting) {
                el.textContent = '+0' + suffix;
                return;
            }

            const duration  = 1600;
            const startTime = performance.now();
            const tick = (now) => {
                const progress = Math.min((now - startTime) / duration, 1);
                const eased    = 1 - Math.pow(1 - progress, 3);
                el.textContent = '+' + Math.round(eased * targetNum) + suffix;
                if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.breadcrumb-item .value').forEach(el => {
        const raw = el.textContent.trim(); // e.g. "+20 Años"
        if (!raw.startsWith('+')) return;
        const num    = parseInt(raw.replace('+', ''), 10);
        const suffix = raw.replace('+', '').replace(String(num), '').trim();
        if (isNaN(num)) return;
        el.dataset.count  = num;
        el.dataset.suffix = suffix ? ' ' + suffix : '';
        el.textContent    = '+0' + (suffix ? ' ' + suffix : '');
        counterObs.observe(el);
    });

    // 11. 3D Card Tilt
    document.querySelectorAll('.service-card').forEach(card => {
        card.style.transition = 'transform 0.1s ease, background-color 0.3s ease, border-top 0.3s ease';
        card.addEventListener('mousemove', (e) => {
            const r   = card.getBoundingClientRect();
            const x   = e.clientX - r.left;
            const y   = e.clientY - r.top;
            const rotX = ((y - r.height / 2) / (r.height / 2)) * -7;
            const rotY = ((x - r.width  / 2) / (r.width  / 2)) *  7;
            card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });

    // 12. Contact Modal
    const openModalBtn = document.getElementById('open-menu');
    const modal        = document.getElementById('contact-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    if (openModalBtn && modal && closeModalBtn) {
        openModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
        const closeModal = () => {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        };
        closeModalBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
        });
    }

    // 13. Lightbox
    const lightbox      = document.getElementById('lightbox');
    const lightboxImg   = document.getElementById('lightbox-img');
    const lightboxCount = document.getElementById('lightbox-counter');
    let lbImages = [], lbIndex = 0;

    const openLightbox = (images, index) => {
        lbImages = images; lbIndex = index;
        setLbImage();
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };
    const closeLightbox = () => {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };
    const setLbImage = () => {
        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.src = lbImages[lbIndex].src;
            lightboxImg.alt = lbImages[lbIndex].alt;
            lightboxCount.textContent = `${lbIndex + 1} / ${lbImages.length}`;
            lightboxImg.style.opacity = '1';
        }, 150);
    };

    if (lightbox) {
        document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
        document.getElementById('lightbox-backdrop').addEventListener('click', closeLightbox);
        document.getElementById('lightbox-prev').addEventListener('click', () => {
            lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length;
            setLbImage();
        });
        document.getElementById('lightbox-next').addEventListener('click', () => {
            lbIndex = (lbIndex + 1) % lbImages.length;
            setLbImage();
        });
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('open')) return;
            if (e.key === 'Escape')     closeLightbox();
            if (e.key === 'ArrowLeft')  { lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length; setLbImage(); }
            if (e.key === 'ArrowRight') { lbIndex = (lbIndex + 1) % lbImages.length; setLbImage(); }
        });

        const galleryEls  = [...document.querySelectorAll('.gallery-item')];
        const galleryImgs = galleryEls.map(el => el.querySelector('img'));
        galleryEls.forEach((item, i) => item.addEventListener('click', () => openLightbox(galleryImgs, i)));

        const tallerEls  = [...document.querySelectorAll('.taller-item')];
        const tallerImgs = tallerEls.map(el => el.querySelector('img'));
        tallerEls.forEach((item, i) => item.addEventListener('click', () => openLightbox(tallerImgs, i)));
    }

    // 14. Hamburger Menu
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    if (hamburger && mobileMenu) {
        const closeMobileMenu = () => {
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
            mobileMenu.classList.remove('open');
            mobileMenu.setAttribute('aria-hidden', 'true');
        };
        hamburger.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('open');
            hamburger.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', String(isOpen));
            mobileMenu.setAttribute('aria-hidden', String(!isOpen));
        });
        mobileMenu.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', closeMobileMenu));
        if (openModalBtn) openModalBtn.addEventListener('click', closeMobileMenu);
    }
});
