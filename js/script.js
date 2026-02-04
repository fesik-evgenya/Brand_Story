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

    // Проверка мобильного устройства
    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    // Бургер-меню
    if (burger && nav) {
        burger.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
            this.setAttribute('aria-expanded', this.classList.contains('active'));
        });

        // Закрытие меню при клике на ссылку
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                nav.classList.remove('active');
                document.body.classList.remove('no-scroll');
                burger.setAttribute('aria-expanded', 'false');
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

    // Изменение стиля хедера при скролле
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Показывать/скрывать хедер при скролле
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Скролл вниз
            if (header) {
                header.style.transform = 'translateY(-100%)';
            }
        } else {
            // Скролл вверх или в начале страницы
            if (header) {
                header.style.transform = 'translateY(0)';

                // Добавляем тень при скролле
                if (scrollTop > 50) {
                    header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
                } else {
                    header.style.boxShadow = 'none';
                }
            }
        }

        lastScrollTop = scrollTop;

        // Подсветка активного пункта меню
        if (!isMobile) {
            let currentSection = '';

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
    }

    init();
});