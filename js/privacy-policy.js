/**
 * Скрипт для страницы "Политика конфиденциальности"
 * Анимации, интерактивность и функциональность
 */

document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const backBtn = document.getElementById('backBtn');
    const backToHome = document.getElementById('backToHome');
    const confirmBtn = document.getElementById('confirmBtn');
    const policyDate = document.getElementById('policyDate');
    const versionDate = document.getElementById('versionDate');
    const sections = document.querySelectorAll('.privacy-section');
    const privacyHeader = document.getElementById('privacyHeader');

    // Обновляем даты
    function updateDates() {
        const currentDate = new Date();
        const options = { month: 'long', year: 'numeric' };
        const russianDate = currentDate.toLocaleDateString('ru-RU', options);

        // Устанавливаем февраль 2026 как указано в задании
        policyDate.textContent = 'февраль 2026';
        versionDate.textContent = 'февраль 2026';
    }

    // Функция для плавного скролла к секции
    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = privacyHeader ? privacyHeader.offsetHeight : 0;
            const sectionPosition = section.offsetTop - headerHeight - 20;

            window.scrollTo({
                top: sectionPosition,
                behavior: 'smooth'
            });

            // Добавляем класс активной секции
            sections.forEach(sec => sec.classList.remove('active'));
            section.classList.add('active');

            // Убираем класс через некоторое время
            setTimeout(() => {
                section.classList.remove('active');
            }, 3000);
        }
    }

    // Наблюдатель за секциями для подсветки при скролле
    function setupSectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Убираем активный класс со всех секций
                    sections.forEach(section => {
                        section.classList.remove('active');
                    });

                    // Добавляем активный класс текущей секции
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // Анимация подтверждения согласия
    function setupConfirmationButton() {
        if (confirmBtn) {
            confirmBtn.addEventListener('click', function() {
                // Проверяем, было ли уже подтверждено
                if (this.classList.contains('confirmed')) {
                    this.innerHTML = `
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.6667 5.8335L8.33333 14.1668L4.16667 10.0002" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>Я согласен с условиями</span>
                    `;
                    this.classList.remove('confirmed');
                } else {
                    // Анимация подтверждения
                    this.innerHTML = `
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6024 1.66667 10 1.66667C5.39763 1.66667 1.66667 5.39763 1.66667 10C1.66667 14.6024 5.39763 18.3333 10 18.3333Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M13.3333 7.5L8.75 12.0833L6.66667 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>Спасибо за согласие!</span>
                    `;
                    this.classList.add('confirmed');

                    // Анимация "сердечка"
                    createHeartAnimation(this);

                    // Сохраняем в localStorage
                    localStorage.setItem('privacyPolicyConfirmed', 'true');
                }
            });

            // Проверяем, было ли уже подтверждено ранее
            if (localStorage.getItem('privacyPolicyConfirmed') === 'true') {
                confirmBtn.click(); // Симулируем клик для установки состояния
            }
        }
    }

    // Создание анимации сердечек
    function createHeartAnimation(element) {
        const rect = element.getBoundingClientRect();
        const heartsCount = 5;

        for (let i = 0; i < heartsCount; i++) {
            const heart = document.createElement('div');
            heart.innerHTML = '♥';
            heart.style.position = 'fixed';
            heart.style.left = (rect.left + rect.width / 2) + 'px';
            heart.style.top = (rect.top + rect.height / 2) + 'px';
            heart.style.color = 'var(--color-accent)';
            heart.style.fontSize = '20px';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '10000';
            heart.style.opacity = '0';
            heart.style.transform = 'translateY(0)';
            heart.style.transition = 'all 1s ease-out';

            document.body.appendChild(heart);

            // Анимация
            setTimeout(() => {
                const angle = (Math.PI * 2 * i) / heartsCount;
                const distance = 50 + Math.random() * 50;
                const x = Math.cos(angle) * distance;
                const y = -Math.random() * 100 - 50;

                heart.style.opacity = '1';
                heart.style.transform = `translate(${x}px, ${y}px)`;

                // Удаляем сердечко после анимации
                setTimeout(() => {
                    heart.style.opacity = '0';
                    setTimeout(() => {
                        if (heart.parentNode) {
                            heart.parentNode.removeChild(heart);
                        }
                    }, 1000);
                }, 900);
            }, i * 100);
        }
    }

    // Эффект параллакса для заголовка
    function setupParallaxEffect() {
        const privacyTitle = document.querySelector('.privacy-title');
        if (privacyTitle && window.innerWidth > 768) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * 0.1;
                privacyTitle.style.transform = `translateY(${rate}px)`;
            });
        }
    }

    // Подсветка ссылок при наведении
    function setupLinkEffects() {
        const links = document.querySelectorAll('.privacy-link');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transition = 'all 0.3s ease';
            });
        });
    }

    // Анимация появления элементов при загрузке
    function setupPageAnimations() {
        // Задержка для анимации появления
        setTimeout(() => {
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s ease';

            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 100);
        }, 100);
    }

    // Обработка кнопки "Назад"
    function setupBackButton() {
        if (backBtn) {
            backBtn.addEventListener('click', function(e) {
                e.preventDefault();

                // Анимация исчезновения перед переходом
                document.body.style.opacity = '0';
                document.body.style.transition = 'opacity 0.3s ease';

                setTimeout(() => {
                    window.location.href = 'index.html#hero';
                }, 300);
            });
        }

        if (backToHome) {
            backToHome.addEventListener('click', function(e) {
                e.preventDefault();

                // Анимация исчезновения перед переходом
                document.body.style.opacity = '0';
                document.body.style.transition = 'opacity 0.3s ease';

                setTimeout(() => {
                    window.location.href = 'index.html#hero';
                }, 300);
            });
        }
    }

    // Инициализация всех функций
    function init() {
        console.log('Страница "Политика конфиденциальности" загружена');

        updateDates();
        setupBackButton();
        setupConfirmationButton();
        setupSectionObserver();
        setupParallaxEffect();
        setupLinkEffects();
        setupPageAnimations();

        // Добавляем возможность перехода к секциям по якорям
        if (window.location.hash) {
            const sectionId = window.location.hash.substring(1);
            setTimeout(() => {
                scrollToSection(sectionId);
            }, 500);
        }

        // Эффект печатания для заголовка (опционально)
        const title = document.querySelector('.privacy-title');
        if (title && window.innerWidth > 768) {
            const originalText = title.textContent;
            title.textContent = '';
            let i = 0;

            function typeWriter() {
                if (i < originalText.length) {
                    title.textContent += originalText.charAt(i);
                    i++;
                    setTimeout(typeWriter, 50);
                }
            }

            // Запускаем с небольшой задержкой
            setTimeout(typeWriter, 300);
        }
    }

    // Запуск инициализации
    init();

    // Обработка клавиши Escape для возврата на главную
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            window.location.href = 'index.html#hero';
        }
    });
});