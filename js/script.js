/**
 * BrendStory — интерактивность
 * Vanilla JS · Без зависимостей · Доступность · Производительность
 */
(function () {
    'use strict';

    /* ============================================================
       UTILS
       ============================================================ */
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ============================================================
       HEADER — sticky + active nav
       ============================================================ */
    const header = $('#header');
    const navLinks = $$('.nav__link[href^="#"]');

    let lastScrollY = 0;
    let ticking = false;

    function onScroll() {
        lastScrollY = window.scrollY;

        if (!ticking) {
            window.requestAnimationFrame(() => {
                // Sticky header
                if (lastScrollY > 40) {
                    header.classList.add('is-scrolled');
                } else {
                    header.classList.remove('is-scrolled');
                }

                // Active nav link
                const scrollPos = lastScrollY + 120;
                let currentId = '';

                $$('section[id]').forEach(section => {
                    if (scrollPos >= section.offsetTop &&
                        scrollPos < section.offsetTop + section.offsetHeight) {
                        currentId = section.id;
                    }
                });

                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
                });

                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ============================================================
       MOBILE NAV
       ============================================================ */
    const burger = $('#burger');
    const nav = $('#nav');

    if (burger && nav) {
        const closeNav = () => {
            burger.setAttribute('aria-expanded', 'false');
            nav.classList.remove('is-open');
            document.body.classList.remove('nav-open');
        };

        const openNav = () => {
            burger.setAttribute('aria-expanded', 'true');
            nav.classList.add('is-open');
            document.body.classList.add('nav-open');
        };

        burger.addEventListener('click', () => {
            const isOpen = burger.getAttribute('aria-expanded') === 'true';
            isOpen ? closeNav() : openNav();
        });

        // Close on link click
        $$('.nav__link', nav).forEach(link => {
            link.addEventListener('click', closeNav);
        });

        // Close on Escape
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && nav.classList.contains('is-open')) {
                closeNav();
            }
        });
    }

    /* ============================================================
       HERO DESCRIPTION — элегантное появление по словам
       ============================================================ */
    const heroDescription = $('.hero__description');

    if (heroDescription && !prefersReducedMotion) {
        const originalText = heroDescription.textContent.trim();
        const words = originalText.split(/\s+/);

        // Оборачиваем каждое слово в span с индивидуальным индексом
        heroDescription.innerHTML = words
            .map((word, i) =>
                `<span class="hero-word" style="--word-index:${i}">${word}</span>`
            )
            .join(' ');

        // Активируем стартовое (скрытое) состояние
        heroDescription.classList.add('is-animating');

        // Даём браузеру отрисовать стартовое состояние, затем запускаем reveal
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                heroDescription.classList.add('is-revealed');
            });
        });
    }

    /* ============================================================
       SMOOTH SCROLL (fallback for older browsers)
       ============================================================ */
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = $(targetId);
            if (!target) return;

            e.preventDefault();

            const headerOffset = header ? header.offsetHeight : 0;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;

            window.scrollTo({
                top: targetPosition,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        });
    });

    /* ============================================================
       CAROUSEL — accessible, touch-friendly
       ============================================================ */
    const carousel = $('#casesCarousel');
    if (carousel) {
        const track = $('#carouselTrack');
        const slides = $$('.case-card', track);
        const prevBtn = $('#carouselPrev');
        const nextBtn = $('#carouselNext');
        const dotsContainer = $('#carouselDots');

        let currentIndex = 0;
        const totalSlides = slides.length;

        // Create dots
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'carousel__dot';
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Кейс ${i + 1}`);
            dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        });

        const dots = $$('.carousel__dot', dotsContainer);

        function updateCarousel() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, i) => {
                dot.setAttribute('aria-selected', i === currentIndex ? 'true' : 'false');
            });
        }

        function goTo(index) {
            currentIndex = (index + totalSlides) % totalSlides;
            updateCarousel();
        }

        prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
        nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

        // Keyboard
        carousel.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft') { goTo(currentIndex - 1); }
            if (e.key === 'ArrowRight') { goTo(currentIndex + 1); }
        });

        // Touch / swipe
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? goTo(currentIndex + 1) : goTo(currentIndex - 1);
            }
        }, { passive: true });

        // Auto-play (paused on hover/focus, disabled on reduced motion)
        let autoPlayInterval = null;

        function startAutoPlay() {
            if (prefersReducedMotion) return;
            stopAutoPlay();
            autoPlayInterval = setInterval(() => goTo(currentIndex + 1), 6000);
        }

        function stopAutoPlay() {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
            }
        }

        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);
        carousel.addEventListener('focusin', stopAutoPlay);
        carousel.addEventListener('focusout', startAutoPlay);

        startAutoPlay();

        // Initial
        updateCarousel();
    }

    /* ============================================================
       COUNTERS — animate on scroll
       ============================================================ */
    const counters = $$('[data-counter]');

    if (counters.length && !prefersReducedMotion) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const el = entry.target;
                const target = parseInt(el.dataset.counter, 10);
                const duration = 1600;
                const startTime = performance.now();

                function update(now) {
                    const progress = Math.min((now - startTime) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.floor(eased * target);

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        el.textContent = target;
                        if (target === 100) el.textContent = '100+';
                        if (target === 150) el.textContent = '150%';
                        if (target === 8) el.textContent = '8';
                    }
                }

                requestAnimationFrame(update);
                counterObserver.unobserve(el);
            });
        }, { threshold: 0.5 });

        counters.forEach(el => counterObserver.observe(el));
    } else {
        counters.forEach(el => {
            const target = parseInt(el.dataset.counter, 10);
            el.textContent = target === 100 ? '100+' : target === 150 ? '150%' : target;
        });
    }

    /* ============================================================
       REVEAL ON SCROLL
       ============================================================ */
    if (!prefersReducedMotion) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        $$('.section__head, .about__grid, .service-card, .testimonial, .faq__item, .contact__inner')
            .forEach(el => {
                el.classList.add('reveal');
                revealObserver.observe(el);
            });
    }

    /* ============================================================
       LAZY LOAD FALLBACK (for older browsers)
       ============================================================ */
    if ('loading' in HTMLImageElement.prototype === false) {
        const lazyImages = $$('img[loading="lazy"]');
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            });
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

})();