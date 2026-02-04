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

    // Проверка мобильного устройства
    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    // Позиционирование меню относительно .hero__video-wrapper
    function positionNavMenu() {
        if (!heroVideoWrapper || !nav) return;

        if (window.innerWidth > 767) {
            const videoWrapperRect = heroVideoWrapper.getBoundingClientRect();
            const navList = nav.querySelector('.nav__list');

            if (navList) {
                navList.style.position = 'fixed';
                navList.style.top = (videoWrapperRect.top + 10) + 'px';
                navList.style.right = (window.innerWidth - videoWrapperRect.right + 10) + 'px';
                navList.style.zIndex = '1001';
            }
        } else {
            // На мобильных возвращаем обычное позиционирование
            const navList = nav.querySelector('.nav__list');
            if (navList) {
                navList.style.position = '';
                navList.style.top = '';
                navList.style.right = '';
            }
        }
    }

    // Обновление позиции меню при скролле
    function updateNavPosition() {
        if (window.innerWidth > 767 && heroVideoWrapper && nav) {
            const videoWrapperRect = heroVideoWrapper.getBoundingClientRect();
            const navList = nav.querySelector('.nav__list');

            if (navList) {
                // Если .hero__video-wrapper вышел за верхний край окна
                if (videoWrapperRect.top > 0) {
                    navList.style.top = (videoWrapperRect.top + 10) + 'px';
                    navList.style.right = (window.innerWidth - videoWrapperRect.right + 10) + 'px';
                } else {
                    // Фиксируем меню в верхнем правом углу с отступами 10px
                    navList.style.top = '10px';
                    navList.style.right = '10px';
                }
            }
        }
    }

    // Инициализация позиционирования меню
    window.addEventListener('load', positionNavMenu);
    window.addEventListener('resize', positionNavMenu);

    // Обновляем позицию меню при скролле
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }

        scrollTimeout = setTimeout(function() {
            updateNavPosition();

            // Подсветка активного пункта меню
            if (window.innerWidth > 767) {
                let currentSection = '';
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;
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
        }, 100);
    });

    // Бургер-меню
    if (burger && nav) {
        burger.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
            this.setAttribute('aria-expanded', this.classList.contains('active'));

            // На мобильных перепозиционируем меню при открытии
            if (window.innerWidth <= 767 && nav.classList.contains('active')) {
                const navList = nav.querySelector('.nav__list');
                if (navList) {
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
                }
            } else if (window.innerWidth <= 767) {
                // При закрытии меню на мобильных
                const navList = nav.querySelector('.nav__list');
                if (navList) {
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
                }
            }
        });

        // Закрытие меню при клике на ссылку
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                nav.classList.remove('active');
                document.body.classList.remove('no-scroll');
                burger.setAttribute('aria-expanded', 'false');

                // На мобильных возвращаем стандартные стили
                if (window.innerWidth <= 767) {
                    const navList = nav.querySelector('.nav__list');
                    if (navList) {
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
                    }
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
            if (burger && burger.classList.contains('active')) {
                burger.classList.remove('active');
                nav.classList.remove('active');
                document.body.classList.remove('no-scroll');
                burger.setAttribute('aria-expanded', 'false');
            }

            // Прокрутка с учетом высоты хедера
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

    // Анимация появления секций при скролле (только не на мобильных)
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

                    // Запускаем счетчики для секции "Обо мне"
                    if (entry.target.id === 'about' && counters.length > 0) {
                        animateCounters();
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Добавляем класс fade-in для анимации
        sections.forEach(section => {
            section.classList.add('fade-in');
            observer.observe(section);
        });
    }

    // Анимация счетчиков
    function animateCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-counter'));
            const suffix = counter.nextElementSibling ? counter.nextElementSibling.textContent.trim() : '';
            const duration = 2000; // 2 секунды
            const step = target / (duration / 16); // 60fps

            let current = 0;
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current);
            }, 16);
        });
    }

    // Изменение стиля хедера при скролле (только тень)
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (header) {
            if (scrollTop > 50) {
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = 'none';
            }
        }
    });

    // Обработка ошибок загрузки изображений
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'img/placeholder.jpg';
            this.alt = 'Изображение не загружено';
        });
    });

    // Инициализация
    function init() {
        console.log('Сайт Виктории Пугач загружен');
        // Инициализируем позиционирование меню
        positionNavMenu();
        updateNavPosition();
    }

    init();
});