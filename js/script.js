/**
 Скрипт для анимаций и работы с бургер-меню
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

// ===================== ФУНКЦИИ ДЛЯ РАБОТЫ С МОБИЛЬНЫМ МЕНЮ =====================

// Функция открытия меню с правой стороны
    function openMobileMenu() {
        if (isMenuAnimating || !isMobileDevice()) return;

        isMenuAnimating = true;

        // Включаем блокировку прокрутки для body
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
            // Убираем no-scroll ТОЛЬКО если он ещё не был убран (защита от двойного удаления)
            if (document.body.classList.contains('no-scroll')) {
                document.body.classList.remove('no-scroll');
            }
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
                    const targetElement = document.querySelector(hash);
                    if (targetElement) {
                        const headerHeight = header ? header.offsetHeight : 0;
                        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - EXTRA_OFFSET;
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
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

// ===================== КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ: ОБРАБОТЧИКИ КЛИКОВ ПО ССЫЛКАМ =====================
// ВАЖНО: НЕ вызываем preventDefault() — разрешаем стандартную прокрутку браузера
// Но СРАЗУ убираем no-scroll, чтобы не блокировать прокрутку во время анимации закрытия меню

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId.startsWith('#')) return;

            // Обновляем активный пункт ДО прокрутки
            updateActiveNavItem(targetId);

            // Если меню открыто на мобильном — закрываем его
            if (isMobileDevice() && burger.classList.contains('active')) {
                // КРИТИЧЕСКИ ВАЖНО: убираем no-scroll СРАЗУ, чтобы разрешить прокрутку
                document.body.classList.remove('no-scroll');
                // Запускаем анимацию закрытия меню
                closeMobileMenu();
            }

            // Для херо-секции запускаем анимации после прокрутки
            if (targetId === '#hero') {
                // Используем таймаут, чтобы анимации запустились ПОСЛЕ завершения прокрутки
                setTimeout(() => {
                    resetHeroAnimations();
                    animateHeroElements();
                }, 600);
            }
        });

        // Для тач-устройств
        link.addEventListener('touchend', function(e) {
            if (e.cancelable) e.preventDefault();
            this.click();
        }, { passive: false });
    });

// Обработчики для бургер-меню
    if (burger && nav) {
        burger.addEventListener('click', toggleMobileMenu);

        // Обработчик touchend для лучшей совместимости
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
    }

// Плавная прокрутка для остальных ссылок (не из мобильного меню)
    scrollLinks.forEach(link => {
        if (!link.hasAttribute('data-nav-link')) {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#' || !targetId.startsWith('#')) return;

                e.preventDefault();
                updateActiveNavItem(targetId);

                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;

                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - EXTRA_OFFSET;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                if (targetId === '#hero') {
                    setTimeout(() => {
                        resetHeroAnimations();
                        animateHeroElements();
                    }, 600);
                }
            });
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
            // Убираем no-scroll при закрытии через Esc
            document.body.classList.remove('no-scroll');
            closeMobileMenu();
        }
    });

// ===================== ИНИЦИАЛИЗАЦИЯ =====================

    function initAnimations() {
        console.log('Скрипт анимаций и бургер-меню загружен (финальная исправленная версия)');

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
        
        /* Обеспечиваем плавную прокрутку на уровне CSS */
        html {
            scroll-behavior: smooth;
        }
    `;
        document.head.appendChild(style);
    }

    initAnimations();
});