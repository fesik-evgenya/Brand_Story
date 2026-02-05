/**
 * Основной скрипт сайта
 * Бургер-меню, плавная прокрутка, анимации при скролле
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
    const heroVideoWrapper = document.querySelector('.hero__video-wrapper');
    const navList = nav ? nav.querySelector('.nav__list') : null;
    const heroCTA = document.querySelector('.hero__CTA');
    const heroTitle = document.querySelector('.hero__title');
    const heroDescription = document.querySelector('.hero__description');

    // Флаги для анимаций
    let heroNavAnimated = false;
    let countersAnimated = false;

    // Проверка мобильного устройства
    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    // Переменная для хранения фиксированной позиции
    let fixedNavPosition = null;

    // ===================== ФУНКЦИИ ДЛЯ РАБОТЫ С МЕНЮ =====================

    // Функция для сброса стилей меню на мобильных
    function resetMobileMenuStyles() {
        if (!navList || window.innerWidth > 767) return;

        navList.style.position = '';
        navList.style.top = '';
        navList.style.left = '';
        navList.style.transform = '';
        navList.style.width = '';
        navList.style.maxWidth = '';
        navList.style.maxHeight = '';
        navList.style.overflowY = '';
        navList.style.background = '';
        navList.style.backdropFilter = '';
        navList.style.padding = '';
        navList.style.borderRadius = '';
        navList.style.zIndex = '';
    }

    // Функция для центрирования меню на мобильных
    function centerMobileMenu() {
        if (!navList || window.innerWidth > 767) return;

        navList.style.position = 'fixed';
        navList.style.top = '50%';
        navList.style.left = '50%';
        navList.style.transform = 'translate(-50%, -50%)';
        navList.style.width = '90%';
        navList.style.maxWidth = '300px';
        navList.style.maxHeight = '80vh';
        navList.style.overflowY = 'auto';
        navList.style.background = 'rgba(37, 34, 32, 0.95)';
        navList.style.backdropFilter = 'blur(10px)';
        navList.style.padding = '2rem';
        navList.style.borderRadius = '8px';
        navList.style.zIndex = '1002';
    }

    // Функция для вычисления и установки фиксированной позиции меню
    function setFixedNavPosition() {
        if (!heroVideoWrapper || !navList || window.innerWidth <= 767) return;

        const videoWrapperRect = heroVideoWrapper.getBoundingClientRect();

        // Вычисляем расстояние от правого края окна до правого края videoWrapper
        const distanceFromRight = window.innerWidth - videoWrapperRect.right;

        // Устанавливаем фиксированную позицию
        navList.style.position = 'fixed';
        navList.style.top = '10px';
        navList.style.right = (distanceFromRight + 2) + 'px';
        navList.style.zIndex = '1001';
        navList.style.left = 'auto';

        // Сохраняем значение для использования при ресайзе
        fixedNavPosition = distanceFromRight;
    }

    // ===================== ФУНКЦИИ АНИМАЦИЙ =====================

    // Функция для плавного сброса и запуска анимации элемента
    function animateElementWithReset(element, options = {}) {
        if (!element) return;

        const {
            delay = 0,
            duration = 1200,
            easing = 'cubic-bezier(0.645, 0.045, 0.355, 1)', // Стандартная плавная кривая
            resetFirst = true
        } = options;

        // Сохраняем текущие стили перехода
        const originalTransition = element.style.transition;

        if (resetFirst) {
            // Сбрасываем анимацию
            element.style.transition = 'none';
            element.style.opacity = '0';

            // Принудительная перерисовка для сброса
            void element.offsetWidth;
        }

        // Устанавливаем новую анимацию
        setTimeout(() => {
            element.style.transition = `opacity ${duration}ms ${easing} ${delay}ms`;
            element.style.opacity = '1';

            // Восстанавливаем оригинальную анимацию после завершения
            setTimeout(() => {
                element.style.transition = originalTransition || '';
            }, duration + delay);
        }, 10);
    }

    // Анимация элементов героя - запускается каждый раз при показе Hero
    function animateHeroElements() {
        // Анимируем блок CTA каждый раз
        if (heroCTA) {
            animateElementWithReset(heroCTA, {
                delay: 300,
                duration: 1500,
                easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)'
            });
        }

        // Анимируем меню только при первом запуске на десктопе
        if (navList && window.innerWidth > 767 && !heroNavAnimated) {
            animateElementWithReset(navList, {
                delay: 600,
                duration: 1800,
                easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)'
            });
            heroNavAnimated = true;
        }

        // Анимация для заголовка и описания (опционально, для дополнительной плавности)
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

    // Функция сброса анимации Hero для повторного запуска
    function resetHeroAnimations() {
        if (heroCTA) {
            heroCTA.style.opacity = '0';
        }

        // Для меню на мобильных тоже сбрасываем
        if (window.innerWidth <= 767 && navList) {
            navList.style.opacity = '0';
        }
    }

    // Анимация счетчиков
    function animateCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-counter'));
            const duration = 2000; // 2 секунды
            const step = target / (duration / 16); // 60fps

            let current = 0;
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);

                    // Определяем какой символ добавить в зависимости от значения
                    let symbol = '';
                    let position = 'after'; // по умолчанию символ после

                    if (target === 100) {
                        symbol = '+';
                    } else if (target === 150) {
                        symbol = '%';
                    } else if (target === 8) {
                        symbol = '>';
                        position = 'before';
                    }

                    // Добавляем символ в нужную позицию
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

    // ===================== ОБРАБОТЧИКИ СОБЫТИЙ И ИНИЦИАЛИЗАЦИЯ =====================

    // Инициализация позиционирования меню
    window.addEventListener('load', function() {
        if (window.innerWidth > 767) {
            setFixedNavPosition();
        }

        // Проверяем есть ли якорь в URL при загрузке
        const hash = window.location.hash;
        const isHeroSection = hash === '' || hash === '#hero' || !hash;

        if (isHeroSection) {
            // Если загружаемся на Hero-секции, проверяем ее видимость
            const heroSection = document.getElementById('hero');
            if (heroSection) {
                const heroRect = heroSection.getBoundingClientRect();
                const isHeroVisible = heroRect.top < window.innerHeight && heroRect.bottom > 0;

                if (isHeroVisible) {
                    // Задержка для плавного появления после загрузки
                    setTimeout(() => {
                        animateHeroElements();
                    }, 500);
                } else {
                    // Если Hero не виден, сбрасываем анимации для будущих запусков
                    resetHeroAnimations();
                }
            }
        } else {
            // Если загружаемся НЕ на Hero-секции, НЕ запускаем анимации Hero
            resetHeroAnimations();

            // Сразу устанавливаем активный пункт меню для текущего якоря
            setTimeout(() => {
                const targetSection = document.querySelector(hash);
                if (targetSection) {
                    const headerHeight = header ? header.offsetHeight : 0;
                    const scrollTop = targetSection.offsetTop - headerHeight - 20;

                    // Устанавливаем активный пункт меню
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        const href = link.getAttribute('href');
                        if (href === hash) {
                            link.classList.add('active');
                        }
                    });
                }
            }, 100);
        }
    });

    // Обработка изменения размера окна
    window.addEventListener('resize', function() {
        if (window.innerWidth > 767 && heroVideoWrapper && navList) {
            // При ресайзе пересчитываем позицию
            const videoWrapperRect = heroVideoWrapper.getBoundingClientRect();
            const distanceFromRight = window.innerWidth - videoWrapperRect.right;

            navList.style.right = (distanceFromRight + 2) + 'px';
            fixedNavPosition = distanceFromRight;
        } else {
            resetMobileMenuStyles();
        }

        // При переходе с мобильного на десктоп сбрасываем флаг анимации меню
        if (window.innerWidth > 767 && heroNavAnimated) {
            heroNavAnimated = false;
        }
    });

    // Обновляем подсветку активного пункта меню при скролле
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }

        scrollTimeout = setTimeout(function() {
            // Подсветка активного пункта меню (только на десктопе)
            if (window.innerWidth > 767) {
                let currentSection = '';
                const scrollTop = window.scrollY || document.documentElement.scrollTop;

                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const headerHeight = header ? header.offsetHeight : 0;

                    if (scrollTop >= (sectionTop - headerHeight - 100)) {
                        currentSection = section.getAttribute('id');
                    }
                });

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    const href = link.getAttribute('href');
                    if (href === `#${currentSection}`) {
                        link.classList.add('active');
                    }
                });
            }

            // Изменение стиля хедера при скролле
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            if (header) {
                if (scrollTop > 50) {
                    header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
                } else {
                    header.style.boxShadow = 'none';
                }
            }
        }, 100);
    });

    // Бургер-меню
    if (burger && nav) {
        burger.addEventListener('click', function() {
            const isActive = !this.classList.contains('active');
            this.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
            this.setAttribute('aria-expanded', isActive.toString());

            // На мобильных центрируем меню при открытии
            if (window.innerWidth <= 767 && nav.classList.contains('active') && navList) {
                centerMobileMenu();
            } else if (window.innerWidth <= 767 && navList) {
                resetMobileMenuStyles();
            }
        });

        // Закрытие меню при клике на ссылку
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 767) {
                    burger.classList.remove('active');
                    nav.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                    burger.setAttribute('aria-expanded', 'false');

                    resetMobileMenuStyles();
                }
            });
        });
    }

    // Плавная прокрутка к якорям
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            // Закрываем меню на мобильных
            if (window.innerWidth <= 767 && burger && burger.classList.contains('active')) {
                burger.classList.remove('active');
                nav.classList.remove('active');
                document.body.classList.remove('no-scroll');
                burger.setAttribute('aria-expanded', 'false');

                resetMobileMenuStyles();
            }

            // Если переход на Hero, сбрасываем и запускаем анимации
            if (targetId === '#hero') {
                // Сбрасываем анимации перед запуском
                resetHeroAnimations();

                // Запускаем анимации после небольшой задержки для плавности
                setTimeout(() => {
                    animateHeroElements();
                }, 300);
            }

            // Прокрутка с учетом высоты хедера
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

    // Наблюдатель за секциями для анимаций
    if (!isMobile) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    // Анимация для секции Hero
                    if (entry.target.id === 'hero') {
                        // Сбрасываем анимации перед запуском
                        resetHeroAnimations();

                        // Запускаем анимации
                        setTimeout(() => {
                            animateHeroElements();
                        }, 200);
                    }

                    // Анимация счетчиков для секции "Обо мне"
                    if (entry.target.id === 'about' && counters.length > 0 && !countersAnimated) {
                        animateCounters();
                        countersAnimated = true;

                        // Сбрасываем флаг через некоторое время для повторной анимации
                        setTimeout(() => {
                            countersAnimated = false;
                        }, 1000);
                    }
                } else {
                    // При скрытии секции убираем видимость для повторной анимации
                    entry.target.classList.remove('visible');

                    // Для героя сбрасываем анимации
                    if (entry.target.id === 'hero') {
                        resetHeroAnimations();
                    }
                }
            });
        }, observerOptions);

        // Добавляем класс fade-in и наблюдаем за секциями
        sections.forEach(section => {
            section.classList.add('fade-in');
            observer.observe(section);
        });
    }

    // Обработка ошибок загрузки изображений
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'img/placeholder.jpg';
            this.alt = 'Изображение не загружено';
        });
    });

    // ===================== ИНИЦИАЛИЗАЦИЯ СТРАНИЦЫ =====================

    function init() {
        console.log('Сайт Виктории Пугач загружен');

        // Инициализируем позиционирование меню
        if (window.innerWidth > 767) {
            setFixedNavPosition();
        }

        // Если есть якорь в URL, активируем соответствующую секцию
        const hash = window.location.hash;
        if (hash && hash !== '#hero') {
            const targetSection = document.getElementById(hash.substring(1));
            if (targetSection) {
                targetSection.classList.add('visible');
            }
        }

        // Добавляем CSS стили для анимаций
        const style = document.createElement('style');
        style.textContent = `
            /* Плавные анимации для CTA и меню */
            .hero__CTA {
                opacity: 0;
                will-change: opacity;
            }
            
            .nav__list {
                opacity: 0;
                will-change: opacity;
            }
            
            /* Стиль для активного пункта меню */
            .nav__link.active {
                color: var(--color-text-secondary) !important;
                position: relative;
            }
            
            .nav__link.active::after {
                content: '';
                position: absolute;
                bottom: -5px;
                left: 0;
                width: 100%;
                height: 1px;
                background-color: var(--color-text-secondary);
                opacity: 0.7;
                transition: width 0.3s ease;
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
            
            /* Плавные переходы для всех анимированных элементов */
            * {
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                backface-visibility: hidden;
            }
        `;
        document.head.appendChild(style);
    }

    init();
});