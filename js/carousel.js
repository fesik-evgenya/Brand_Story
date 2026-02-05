/**
 * Карусель для блока "Кейсы и истории"
 * Всегда показывает по 1 слайду (1 кейс) на всех разрешениях
 */

document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('casesCarousel');
    if (!carousel) return;

    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const nav = document.getElementById('carouselNav');

    // Данные для карусели
    const casesData = [
        {
            id: 1,
            title: 'Сотрудничество с ресторанами',
            text: 'Рестораны — это не только место, где люди едят, но и платформа для вашего бренда. Совместные мероприятия, такие как дни рождения или дегустации, могут стать отличной возможностью для повышения узнаваемости.',
            image: 'img/case1.jpg'
        },
        {
            id: 2,
            title: 'Продвижение ювелирного бренда',
            text: 'Создание уникальной стратегии продвижения для ювелирной мастерской. Результат: увеличение продаж на 150% и узнаваемость бренда в профессиональном сообществе.',
            image: 'img/case2.jpg'
        },
        {
            id: 3,
            title: 'PR-кампания для дизайнера',
            text: 'Разработка и реализация комплексной PR-кампании для дизайнера интерьеров. Публикации в профильных изданиях, участие в подкастах и медиа-проектах.',
            image: 'img/case3.jpg'
        },
        {
            id: 4,
            title: 'Организация бизнес-ивента',
            text: 'Организация мероприятия под ключ для сообщества женщин-предпринимателей. Более 100 участников, освещение в СМИ и новые партнерские связи.',
            image: 'img/case4.jpg'
        },
        {
            id: 5,
            title: 'Стратегия для салона красоты',
            text: 'Разработка стратегии личного бренда для владелицы салона красоты. Увеличение потока клиентов на 80% за 3 месяца.',
            image: 'img/case5.jpg'
        }
    ];

    // Настройки карусели
    let currentIndex = 0;
    const slidesPerView = 1; // Всегда показываем 1 слайд
    let slideWidth = getSlideWidth();
    let autoScrollInterval;
    let isAutoScrollEnabled = true;
    let isTransitioning = false;
    let resizeTimeout;

    // Инициализация карусели
    function initCarousel() {
        createSlides();
        updateCarousel();
        createNavigation();
        setupEventListeners();
        startAutoScroll();

        // Обновляем размеры после загрузки всех изображений
        window.addEventListener('load', updateCarouselDimensions);
    }

    // Создание слайдов с адаптивным контентом
    function createSlides() {
        track.innerHTML = '';

        // Определяем размер изображения в зависимости от разрешения
        const imageHeight = getImageHeight();

        // Добавляем дополнительные слайды для бесконечной прокрутки
        const totalSlides = casesData.length * 3; // Три копии для бесконечности

        for (let i = 0; i < totalSlides; i++) {
            const caseIndex = i % casesData.length;
            const caseData = casesData[caseIndex];

            const slide = document.createElement('article');
            slide.className = 'case-card';
            slide.setAttribute('data-index', i);
            slide.setAttribute('data-slide', caseIndex);

            // Устанавливаем адаптивные размеры - всегда 100% ширины
            slide.style.minWidth = '100%';
            slide.style.width = '100%';
            slide.style.flex = `0 0 100%`;

            // Ленивая загрузка изображений
            const imgSrc = i < slidesPerView * 2 ? caseData.image : '';
            const loadingAttr = i < slidesPerView * 2 ? 'eager' : 'lazy';

            // Адаптивный текст в зависимости от разрешения
            let displayText = caseData.text;
            const screenWidth = window.innerWidth;

            if (screenWidth <= 480) {
                // Для мелких мобильных сокращаем текст
                displayText = displayText.length > 150 ?
                    displayText.substring(0, 150) + '...' :
                    displayText;
            } else if (screenWidth <= 600) {
                // Для средних мобильных
                displayText = displayText.length > 200 ?
                    displayText.substring(0, 200) + '...' :
                    displayText;
            }

            slide.innerHTML = `
                <img src="${imgSrc}" 
                     data-src="${caseData.image}" 
                     alt="${caseData.title}" 
                     class="case-card__image" 
                     style="height: ${imageHeight}px; object-fit: cover;"
                     loading="${loadingAttr}"
                     onerror="this.src='img/placeholder.jpg'; this.style.height='${imageHeight}px';">
                <div class="case-card__content">
                    <h3 class="case-card__title">${caseData.title}</h3>
                    <p class="case-card__text">${displayText}</p>
                </div>
            `;

            track.appendChild(slide);

            // Загрузка отложенных изображений при необходимости
            if (i >= slidesPerView * 2) {
                const img = slide.querySelector('img');
                img.setAttribute('data-src', caseData.image);

                // Используем Intersection Observer для ленивой загрузки
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const lazyImage = entry.target;
                            lazyImage.src = lazyImage.getAttribute('data-src');
                            observer.unobserve(lazyImage);
                        }
                    });
                }, {
                    rootMargin: '50px 0px',
                    threshold: 0.1
                });

                observer.observe(img);
            }
        }

        // Устанавливаем начальную позицию (середина)
        currentIndex = casesData.length;
        updateCarouselPosition();

        // Убираем gap между слайдами, так как показываем по одному
        track.style.gap = '0px';
    }

    // Определение ширины слайда - всегда 100% контейнера
    function getSlideWidth() {
        const container = carousel.querySelector('.carousel__track-container') || carousel;
        return container.clientWidth || 800; // Запасное значение
    }

    // Определение высоты изображения в зависимости от разрешения
    function getImageHeight() {
        const width = window.innerWidth;

        if (width >= 1024) return 300;    // Ноутбуки
        if (width >= 768) return 280;     // Планшеты
        if (width >= 600) return 250;     // Средние мобильные
        if (width >= 480) return 220;     // Мелкие мобильные
        return 200;                       // Маленькие мобильные
    }

    // Обновление позиции карусели
    function updateCarouselPosition() {
        if (isTransitioning || !track.children.length) return;

        // Рассчитываем смещение - умножаем текущий индекс на ширину слайда
        const offset = currentIndex * slideWidth;

        // Применяем трансформацию
        track.style.transform = `translateX(-${offset}px)`;

        // Обновляем активную точку навигации
        updateNavigation();
    }

    // Создание навигации (точки) с адаптивным размером
    function createNavigation() {
        nav.innerHTML = '';

        // Адаптивный размер точек в зависимости от разрешения
        const dotSize = window.innerWidth <= 480 ? '8px' : '10px';

        for (let i = 0; i < casesData.length; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel__dot';
            dot.style.width = dotSize;
            dot.style.height = dotSize;
            dot.setAttribute('aria-label', `Перейти к слайду ${i + 1}`);
            dot.setAttribute('data-slide', i);

            dot.addEventListener('click', () => {
                goToSlide(i);
            });

            // Добавляем поддержку клавиатуры для навигации
            dot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    goToSlide(i);
                }
            });

            nav.appendChild(dot);
        }

        updateNavigation();
    }

    // Обновление активной точки навигации
    function updateNavigation() {
        const dots = nav.querySelectorAll('.carousel__dot');
        const activeIndex = currentIndex % casesData.length;

        dots.forEach((dot, index) => {
            const isActive = index === activeIndex;
            dot.classList.toggle('active', isActive);
            dot.setAttribute('aria-current', isActive ? 'true' : 'false');
        });
    }

    // Переход к конкретному слайду
    function goToSlide(index) {
        if (isTransitioning) return;

        const actualIndex = index + casesData.length; // Компенсируем бесконечность
        currentIndex = actualIndex;

        updateCarouselPosition();
        resetAutoScroll();
    }

    // Переход к следующему слайду
    function nextSlide() {
        if (isTransitioning) return;

        currentIndex++;

        // Бесконечная прокрутка: если дошли до конца, плавно переходим к началу
        const totalSlides = track.children.length;
        if (currentIndex >= totalSlides - slidesPerView) {
            isTransitioning = true;

            // Быстрое перемещение к началу без анимации
            setTimeout(() => {
                track.style.transition = 'none';
                currentIndex = casesData.length;
                updateCarouselPosition();

                // Возвращаем анимацию
                setTimeout(() => {
                    track.style.transition = 'transform 0.5s ease';
                    isTransitioning = false;
                }, 50);
            }, 500);
        }

        updateCarouselPosition();
        resetAutoScroll();
    }

    // Переход к предыдущему слайду
    function prevSlide() {
        if (isTransitioning) return;

        currentIndex--;

        // Бесконечная прокрутка: если дошли до начала, плавно переходим к концу
        if (currentIndex < 0) {
            isTransitioning = true;

            // Быстрое перемещение к концу без анимации
            setTimeout(() => {
                track.style.transition = 'none';
                currentIndex = casesData.length * 2 - slidesPerView;
                updateCarouselPosition();

                // Возвращаем анимацию
                setTimeout(() => {
                    track.style.transition = 'transform 0.5s ease';
                    isTransitioning = false;
                }, 50);
            }, 500);
        }

        updateCarouselPosition();
        resetAutoScroll();
    }

    // Обновление размеров карусели
    function updateCarouselDimensions() {
        const newSlideWidth = getSlideWidth();

        // Обновляем только если изменилась ширина
        if (newSlideWidth !== slideWidth) {
            slideWidth = newSlideWidth;

            // Обновляем стили существующих слайдов
            const slides = track.querySelectorAll('.case-card');
            slides.forEach(slide => {
                slide.style.flex = `0 0 100%`;
                slide.style.width = '100%';
                slide.style.minWidth = '100%';

                // Обновляем высоту изображений
                const imageHeight = getImageHeight();
                const img = slide.querySelector('.case-card__image');
                if (img) {
                    img.style.height = `${imageHeight}px`;
                }
            });

            updateCarouselPosition();
        }
    }

    // Обновление карусели при изменении размера окна
    function updateCarousel() {
        if (resizeTimeout) clearTimeout(resizeTimeout);

        resizeTimeout = setTimeout(() => {
            const newSlideWidth = getSlideWidth();

            // Если изменилась ширина, обновляем размеры
            if (newSlideWidth !== slideWidth) {
                slideWidth = newSlideWidth;
                updateCarouselDimensions();
                updateCarouselPosition();
            }
        }, 250); // Задержка для оптимизации производительности
    }

    // Настройка обработчиков событий
    function setupEventListeners() {
        // Кнопки навигации
        if (prevBtn) {
            prevBtn.addEventListener('click', prevSlide);
            prevBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                prevSlide();
            }, { passive: false });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', nextSlide);
            nextBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                nextSlide();
            }, { passive: false });
        }

        // Свайп на мобильных устройствах
        let startX = 0;
        let endX = 0;
        let isSwiping = false;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isSwiping = true;
            stopAutoScroll();
        }, { passive: true });

        track.addEventListener('touchmove', (e) => {
            if (!isSwiping) return;
            endX = e.touches[0].clientX;
        }, { passive: true });

        track.addEventListener('touchend', () => {
            if (!isSwiping) return;

            const threshold = window.innerWidth <= 480 ? 30 : 50;
            const diff = startX - endX;

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }

            isSwiping = false;
            startAutoScroll();
        });

        // Пауза при наведении (только для десктопа)
        if (window.innerWidth >= 768) {
            carousel.addEventListener('mouseenter', stopAutoScroll);
            carousel.addEventListener('mouseleave', startAutoScroll);
        }

        // Адаптация при изменении размера окна
        window.addEventListener('resize', updateCarousel);

        // Поддержка клавиатуры
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide();
            }
        });
    }

    // Автопрокрутка
    function startAutoScroll() {
        if (!isAutoScrollEnabled || window.innerWidth < 768) return;

        stopAutoScroll();

        // Адаптивная скорость автопрокрутки
        const interval = window.innerWidth >= 1024 ? 5000 : 4000;

        autoScrollInterval = setInterval(() => {
            nextSlide();
        }, interval);
    }

    function stopAutoScroll() {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
    }

    function resetAutoScroll() {
        stopAutoScroll();
        startAutoScroll();
    }

    // Отключение автопрокрутки на мобильных
    function checkAutoScrollStatus() {
        if (window.innerWidth < 768) {
            stopAutoScroll();
            isAutoScrollEnabled = false;
        } else {
            isAutoScrollEnabled = true;
            startAutoScroll();
        }
    }

    // Инициализация
    initCarousel();

    // Проверяем статус автопрокрутки при загрузке
    checkAutoScrollStatus();

    // И при изменении размера окна
    window.addEventListener('resize', checkAutoScrollStatus);

    // Экспорт функций для отладки
    window.carouselAPI = {
        nextSlide,
        prevSlide,
        goToSlide,
        updateCarousel,
        getSlideWidth,
        getImageHeight
    };

    console.log('Карусель инициализирована. Показывается 1 слайд.');
    console.log('Текущее разрешение:', window.innerWidth, 'px');
    console.log('Ширина слайда:', slideWidth, 'px');
});