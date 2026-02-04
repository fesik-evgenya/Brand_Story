/**
 * Карусель для блока "Кейсы и истории"
 * Ванильный JavaScript, без библиотек
 */

document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('casesCarousel');
    if (!carousel) return;

    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const nav = document.getElementById('carouselNav');

    // Данные для карусели (можно заменить на данные с сервера)
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
    let slidesPerView = getSlidesPerView();
    let autoScrollInterval;
    let isAutoScrollEnabled = true;
    let isTransitioning = false;

    // Инициализация карусели
    function initCarousel() {
        createSlides();
        updateCarousel();
        createNavigation();
        setupEventListeners();
        startAutoScroll();
    }

    // Создание слайдов
    function createSlides() {
        track.innerHTML = '';

        // Добавляем дополнительные слайды для бесконечной прокрутки
        const totalSlides = casesData.length * 3; // Три копии для бесконечности

        for (let i = 0; i < totalSlides; i++) {
            const caseIndex = i % casesData.length;
            const caseData = casesData[caseIndex];

            const slide = document.createElement('article');
            slide.className = 'case-card';
            slide.setAttribute('data-index', i);

            // Ленивая загрузка изображений
            const imgSrc = i < slidesPerView * 2 ? caseData.image : '';
            const loadingAttr = i < slidesPerView * 2 ? 'eager' : 'lazy';

            slide.innerHTML = `
                <img src="${imgSrc}" 
                     data-src="${caseData.image}" 
                     alt="${caseData.title}" 
                     class="case-card__image" 
                     loading="${loadingAttr}"
                     onerror="this.src='img/placeholder.jpg'">
                <div class="case-card__content">
                    <h3 class="case-card__title">${caseData.title}</h3>
                    <p class="case-card__text">${caseData.text}</p>
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
                });

                observer.observe(img);
            }
        }

        // Устанавливаем начальную позицию (середина)
        currentIndex = casesData.length;
        updateCarouselPosition();
    }

    // Определение количества видимых слайдов
    function getSlidesPerView() {
        const width = window.innerWidth;

        if (width >= 1024) return 3; // Десктоп
        if (width >= 768) return 2;  // Планшет
        return 1;                     // Мобильный
    }

    // Обновление позиции карусели
    function updateCarouselPosition() {
        if (isTransitioning) return;

        const slideWidth = track.children[0]?.offsetWidth || 300;
        const gap = parseInt(getComputedStyle(track).gap) || 32;
        const totalGap = (slidesPerView - 1) * gap;
        const trackWidth = slideWidth * slidesPerView + totalGap;

        track.style.transform = `translateX(-${currentIndex * (slideWidth + gap)}px)`;

        // Обновляем активную точку навигации
        updateNavigation();
    }

    // Создание навигации (точки)
    function createNavigation() {
        nav.innerHTML = '';

        for (let i = 0; i < casesData.length; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel__dot';
            dot.setAttribute('aria-label', `Перейти к слайду ${i + 1}`);
            dot.setAttribute('data-slide', i);

            dot.addEventListener('click', () => {
                goToSlide(i);
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
            dot.classList.toggle('active', index === activeIndex);
            dot.setAttribute('aria-current', index === activeIndex ? 'true' : 'false');
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

    // Обновление карусели при изменении размера окна
    function updateCarousel() {
        const newSlidesPerView = getSlidesPerView();

        if (newSlidesPerView !== slidesPerView) {
            slidesPerView = newSlidesPerView;
            createSlides();
            updateCarouselPosition();
        }
    }

    // Настройка обработчиков событий
    function setupEventListeners() {
        // Кнопки навигации
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);

        // Свайп на мобильных
        let startX = 0;
        let endX = 0;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            stopAutoScroll();
        }, { passive: true });

        track.addEventListener('touchmove', (e) => {
            endX = e.touches[0].clientX;
        }, { passive: true });

        track.addEventListener('touchend', () => {
            const threshold = 50;

            if (startX - endX > threshold) {
                nextSlide();
            } else if (endX - startX > threshold) {
                prevSlide();
            }

            startAutoScroll();
        });

        // Пауза при наведении
        carousel.addEventListener('mouseenter', stopAutoScroll);
        carousel.addEventListener('mouseleave', startAutoScroll);

        // Адаптация при изменении размера окна
        window.addEventListener('resize', () => {
            updateCarousel();
        });
    }

    // Автопрокрутка
    function startAutoScroll() {
        if (!isAutoScrollEnabled || window.innerWidth < 768) return;

        stopAutoScroll();

        autoScrollInterval = setInterval(() => {
            nextSlide();
        }, 5000); // 5 секунд
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

    // Инициализация
    initCarousel();

    // Экспорт функций для отладки
    window.carouselAPI = {
        nextSlide,
        prevSlide,
        goToSlide,
        updateCarousel
    };
});