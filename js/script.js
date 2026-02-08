/**
 * Скрипт для анимаций и работы с бургер-меню
 */

document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('[data-nav-link]');
    const scrollLinks = document.querySelectorAll('[data-scroll-link]');
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('.section, .hero');
    const counters = document.querySelectorAll('[data-counter]');
    const navList = nav ? nav.querySelector('.nav__list') : null;
    const heroCTA = document.querySelector('.hero__CTA');
    const heroTitle = document.querySelector('.hero__title');
    const heroDescription = document.querySelector('.hero__description');

    // Создаем оверлей для бургер-меню
    const burgerOverlay = document.createElement('div');
    burgerOverlay.className = 'burger-overlay';
    document.body.appendChild(burgerOverlay);

    // Флаги для анимаций
    let heroNavAnimated = false;
    let countersAnimated = false;
    let isMenuAnimating = false;
    let activeNavItem = null;

    // Константы для смещения
    const EXTRA_OFFSET = 20;
    const HEADER_STICKY_THRESHOLD = 100;
    const MOBILE_BREAKPOINT = 1024;

    // Динамическая функция для статической переменной
    function isMobileDevice() {
        return window.innerWidth <= MOBILE_BREAKPOINT;
    }

    // Проверка поддержки плавной прокрутки
    const supportsSmoothScroll = 'scrollBehavior' in document.documentElement.style;

    // ===================== ФУНКЦИИ ДЛЯ РАБОТЫ С МОБИЛЬНЫМ МЕНЮ =====================

    // Функция открытия меню с правой стороны
    function openMobileMenu() {
        if (isMenuAnimating || !isMobileDevice()) return;

        isMenuAnimating = true;

        // Включаем прокрутку для body
        document.body.classList.add('no-scroll');

        // Показываем оверлей
        burgerOverlay.style.display = 'block';
        setTimeout(() => {
            burgerOverlay.classList.add('active');
        }, 10);

        // Показываем меню и добавляем класс active
        nav.style.display = 'flex';
        nav.classList.add('active');

        // Даем время для отображения, затем анимируем
        setTimeout(() => {
            nav.style.transform = 'translateX(0)';
            nav.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        }, 20);

        burger.classList.add('active');
        burger.setAttribute('aria-expanded', 'true');

        setTimeout(() => {
            isMenuAnimating = false;
        }, 400);
    }

    // Функция закрытия меню с выезжанием вправо
    function closeMobileMenu() {
        if (isMenuAnimating || !isMobileDevice()) return;

        isMenuAnimating = true;

        // Анимация скрытия меню
        nav.style.transform = 'translateX(100%)';
        nav.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
        burgerOverlay.classList.remove('active');
        nav.classList.remove('active');

        // Ждем завершения анимации и скрываем элементы
        setTimeout(() => {
            nav.style.display = 'none';
            nav.style.transform = '';
            nav.style.transition = '';
            burgerOverlay.style.display = 'none';
            document.body.classList.remove('no-scroll');
            isMenuAnimating = false;
        }, 300);
    }

    // Функция переключения меню
    function toggleMobileMenu(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (!isMobileDevice()) return;

        if (burger.classList.contains('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    // ===================== ФУНКЦИИ ДЛЯ ВЫДЕЛЕНИЯ АКТИВНОГО ПУНКТА МЕНЮ =====================

    function updateActiveNavItem(targetId = null) {
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        if (targetId) {
            const activeLink = document.querySelector(`[data-nav-link][href="${targetId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
                activeNavItem = activeLink;
            }
        } else {
            const scrollPosition = window.scrollY + 100;
            let currentSectionId = '#hero';

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSectionId = `#${section.id}`;
                }
            });

            const activeLink = document.querySelector(`[data-nav-link][href="${currentSectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
                activeNavItem = activeLink;
            }
        }
    }

    // ===================== ФУНКЦИИ АНИМАЦИЙ =====================

    function animateElementWithReset(element, options = {}) {
        if (!element) return;

        const {
            delay = 0,
            duration = 1200,
            easing = 'cubic-bezier(0.645, 0.045, 0.355, 1)',
            resetFirst = true
        } = options;

        const originalTransition = element.style.transition;

        if (resetFirst) {
            element.style.transition = 'none';
            element.style.opacity = '0';
            void element.offsetWidth;
        }

        setTimeout(() => {
            element.style.transition = `opacity ${duration}ms ${easing} ${delay}ms`;
            element.style.opacity = '1';

            setTimeout(() => {
                element.style.transition = originalTransition || '';
            }, duration + delay);
        }, 10);
    }

    function animateHeroElements() {
        if (heroCTA) {
            animateElementWithReset(heroCTA, {
                delay: 300,
                duration: 1500,
                easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)'
            });
        }

        // Анимируем навигацию только на десктопе
        if (navList && !isMobileDevice() && !heroNavAnimated) {
            animateElementWithReset(navList, {
                delay: 600,
                duration: 1800,
                easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)'
            });
            heroNavAnimated = true;
        }

        if (heroTitle) {
            setTimeout(() => {
                heroTitle.classList.add('hero-title-animated');
            }, 100);
        }

        if (heroDescription) {
            setTimeout(() => {
                heroDescription.classList.add('hero-description-animated');
            }, 200);
        }
    }

    function resetHeroAnimations() {
        if (heroCTA) {
            heroCTA.style.opacity = '0';
        }
    }

    function animateCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-counter'));
            const duration = 2000;
            const step = target / (duration / 16);

            let current = 0;
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);

                    let symbol = '';
                    let position = 'after';

                    if (target === 100) {
                        symbol = '+';
                    } else if (target === 150) {
                        symbol = '%';
                    } else if (target === 8) {
                        symbol = '>';
                        position = 'before';
                    }

                    if (symbol && position === 'after') {
                        counter.textContent = target.toString() + symbol;
                    } else if (symbol && position === 'before') {
                        counter.textContent = symbol + target.toString();
                    } else {
                        counter.textContent = target.toString();
                    }
                } else {
                    counter.textContent = Math.floor(current).toString();
                }
            }, 16);
        });
    }

    // ===================== STICKY HEADER И АКТИВНОЕ МЕНЮ =====================

    function handleStickyHeaderAndActiveMenu() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        if (scrollTop > HEADER_STICKY_THRESHOLD) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }

        updateActiveNavItem();
    }

    // ===================== ПЛАВНАЯ ПРОКРУТКА =====================

    // Функция плавной прокрутки
    function smoothScrollTo(targetId, extraOffset = 0, closeMenu = false) {
        return new Promise((resolve, reject) => {
            const targetElement = document.querySelector(targetId);
            if (!targetElement) {
                reject(new Error(`Элемент ${targetId} не найден`));
                return;
            }

            const headerHeight = header ? header.offsetHeight : 0;
            const totalOffset = headerHeight + extraOffset;

            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - totalOffset;

            // Обновляем активный пункт ДО прокрутки
            updateActiveNavItem(targetId);

            // Прокручиваем БЕЗ закрытия меню
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Закрываем меню ТОЛЬКО после завершения прокрутки
            const checkScroll = setInterval(() => {
                if (Math.abs(window.scrollY - targetPosition) < 5) {
                    clearInterval(checkScroll);

                    // Закрываем меню ПОСЛЕ прокрутки
                    if (closeMenu && window.innerWidth <= MOBILE_BREAKPOINT) {
                        closeMobileMenu();
                    }

                    setTimeout(resolve, 100);
                }
            }, 100);

            // Таймаут на случай если прокрутка не сработает
            setTimeout(() => {
                clearInterval(checkScroll);
                if (closeMenu && window.innerWidth <= MOBILE_BREAKPOINT) {
                    closeMobileMenu();
                }
                resolve();
            }, 1000);
        });
    }

    // ===================== ОБРАБОТЧИКИ СОБЫТИЙ =====================

    // Инициализация при загрузке
    function initializeOnLoad() {
        const hash = window.location.hash;
        const isHeroSection = hash === '' || hash === '#hero' || !hash;

        // Убедимся, что меню скрыто на мобильных при загрузке
        if (isMobileDevice() && nav) {
            nav.style.display = 'none';
            nav.style.transform = 'translateX(100%)';
            nav.classList.remove('active');
        }

        if (isHeroSection) {
            const heroSection = document.getElementById('hero');
            if (heroSection) {
                const heroRect = heroSection.getBoundingClientRect();
                const isHeroVisible = heroRect.top < window.innerHeight && heroRect.bottom > 0;

                if (isHeroVisible) {
                    setTimeout(() => {
                        animateHeroElements();
                    }, 500);
                } else {
                    resetHeroAnimations();
                }
            }
        } else {
            resetHeroAnimations();
            if (hash) {
                setTimeout(() => {
                    smoothScrollTo(hash, EXTRA_OFFSET, false).catch(error => {
                        console.error('Ошибка при прокрутке:', error);
                    });
                }, 100);
            }
        }

        updateActiveNavItem();
        handleStickyHeaderAndActiveMenu();
    }

    window.addEventListener('load', initializeOnLoad);

    window.addEventListener('resize', function() {
        // Обновляем состояние меню при изменении размера окна
        if (!isMobileDevice()) {
            // На десктопе - показываем меню, сбрасываем анимации
            if (nav) {
                nav.style.display = '';
                nav.style.transform = '';
                nav.style.transition = '';
                nav.classList.remove('active');
            }
            burger.classList.remove('active');
            burgerOverlay.style.display = 'none';
            document.body.classList.remove('no-scroll');
            heroNavAnimated = false;
        } else {
            // На мобильных - скрываем меню
            if (nav) {
                nav.style.display = 'none';
                nav.style.transform = 'translateX(100%)';
                nav.classList.remove('active');
            }
        }

        updateActiveNavItem();
        handleStickyHeaderAndActiveMenu();
    });

    window.addEventListener('scroll', handleStickyHeaderAndActiveMenu);

    // Исправленный обработчик кликов по ссылкам навигации
    function createLinkClickHandler(linkElement) {
        return async function(e) {
            if (e.cancelable) {
                e.preventDefault();
            }

            const targetId = linkElement.getAttribute('href');
            if (targetId === '#') return;

            updateActiveNavItem(targetId);
            try {
                // closeMenu = true — закрываем меню ПОСЛЕ прокрутки
                await smoothScrollTo(targetId, EXTRA_OFFSET, true);
            } catch (error) {
                console.error('Ошибка при прокрутке:', error);
            }

            if (targetId === '#hero') {
                resetHeroAnimations();
                setTimeout(() => {
                    animateHeroElements();
                }, 300);
            }
        };
    }

    // Обработчики для бургер-меню
    if (burger && nav) {
        burger.addEventListener('click', toggleMobileMenu);

        // обработчик touchend для лучшей совместимости
        burger.addEventListener('touchend', function(e) {
            if (e.cancelable) {
                e.preventDefault();
            }
            toggleMobileMenu(e);
        }, { passive: false });

        burgerOverlay.addEventListener('click', closeMobileMenu);
        burgerOverlay.addEventListener('touchend', function(e) {
            if (e.cancelable) {
                e.preventDefault();
            }
            closeMobileMenu();
        }, { passive: false });

        // Закрытие меню при клике на ссылку
        navLinks.forEach(link => {
            const handler = createLinkClickHandler(link);
            link.addEventListener('click', handler);
            link.addEventListener('touchend', handler, { passive: false });
        });
    }

    // Плавная прокрутка к якорям
    scrollLinks.forEach(link => {
        if (!link.hasAttribute('data-nav-link')) {
            const handler = createLinkClickHandler(link);
            link.addEventListener('click', handler);
            link.addEventListener('touchend', handler, { passive: false });
        }
    });

    // Наблюдатель за секциями
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                if (entry.target.id === 'hero') {
                    resetHeroAnimations();
                    setTimeout(() => {
                        animateHeroElements();
                    }, 200);
                }

                if (entry.target.id === 'about' && counters.length > 0 && !countersAnimated) {
                    animateCounters();
                    countersAnimated = true;

                    setTimeout(() => {
                        countersAnimated = false;
                    }, 1000);
                }
            } else {
                entry.target.classList.remove('visible');
                if (entry.target.id === 'hero') {
                    resetHeroAnimations();
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });

    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'img/placeholder.jpg';
            this.alt = 'Изображение не загружено';
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && burger.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // ===================== ИНИЦИАЛИЗАЦИЯ =====================

    function initAnimations() {
        console.log('Скрипт анимаций и бургер-меню загружен (исправленная версия)');

        const style = document.createElement('style');
        style.textContent = `
            /* Плавные анимации для CTA */
            .hero__CTA {
                opacity: 0;
                will-change: opacity;
                transition: opacity 1.5s cubic-bezier(0.645, 0.045, 0.355, 1) 0.3s;
            }
            
            /* Убираем анимации для навигации на мобильных устройствах */
            @media (max-width: 1024px) {
                .nav__list {
                    opacity: 1 !important;
                }
            }
            
            /* Анимации для навигации ТОЛЬКО НА ДЕСКТОПЕ */
            @media (min-width: 1025px) {
                .nav__list {
                    opacity: 0;
                    will-change: opacity;
                    transition: opacity 1.8s cubic-bezier(0.645, 0.045, 0.355, 1) 0.6s;
                }
            }
            
            /* Активный пункт меню */
            .nav__link.active {
                color: #B0B0B0 !important;
            }
            
            .nav__link.active:hover {
                color: #B0B0B0 !important;
            }
            
            /* Дополнительные анимации для текста героя */
            .hero-title-animated {
                animation: subtleGlow 3s ease-in-out infinite alternate;
            }
            
            .hero-description-animated {
                animation: subtleFade 3s ease-in-out infinite alternate;
            }
            
            @keyframes subtleGlow {
                0% {
                    text-shadow: 0 0 1px rgba(245, 245, 245, 0.1);
                }
                100% {
                    text-shadow: 0 0 3px rgba(245, 245, 245, 0.3);
                }
            }
            
            @keyframes subtleFade {
                0% {
                    opacity: 0.9;
                }
                100% {
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    initAnimations();
});