// В файле js/video-bg.js обновите логику

document.addEventListener('DOMContentLoaded', function() {
    const heroVideo = document.getElementById('heroVideo');
    const videoWrapper = document.querySelector('.hero__video-wrapper');

    if (!heroVideo || !videoWrapper) return;

    // Проверка мобильного устройства
    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    // Замена видео на изображение на мобильных
    if (isMobile) {
        handleMobileFallback();
        return;
    }

    // Настройки для десктопа
    setupDesktopVideo();

    // Обработчик изменения размера окна
    window.addEventListener('resize', handleResize);

    function handleMobileFallback() {
        // Скрываем видео элемент
        heroVideo.style.display = 'none';

        // Устанавливаем фоновую картинку через CSS
        videoWrapper.style.backgroundImage = "url('../img/Hero_background.png')";
    }

    function setupDesktopVideo() {
        // Проверяем, может ли браузер воспроизводить видео
        const canPlay = heroVideo.canPlayType('video/mp4');

        if (canPlay === 'probably' || canPlay === 'maybe') {
            // Ленивая загрузка видео при видимости блока
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        loadVideo();
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1
            });

            observer.observe(heroVideo);
        } else {
            // Браузер не поддерживает видео - используем фолбэк
            handleVideoFallback();
        }
    }

    function loadVideo() {
        // Устанавливаем источник видео
        const source = heroVideo.querySelector('source');

        if (source) {
            // Если data-src есть, используем его
            const dataSrc = source.getAttribute('data-src');
            if (dataSrc) {
                source.src = dataSrc;
            }
            heroVideo.load();
        }

        // Обработчики событий видео
        heroVideo.addEventListener('loadeddata', function() {
            // Видео загружено - показываем его
            this.classList.add('loaded');
            this.play().catch(error => {
                console.warn('Автовоспроизведение видео заблокировано:', error);
                handleVideoFallback();
            });
        });

        heroVideo.addEventListener('error', handleVideoError);

        // Пытаемся воспроизвести видео
        const playPromise = heroVideo.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('Видео успешно воспроизводится');
                    heroVideo.setAttribute('data-loaded', 'true');
                })
                .catch(error => {
                    console.warn('Автовоспроизведение видео заблокировано:', error);
                    handleVideoFallback();
                });
        }
    }

    function handleVideoError() {
        console.error('Ошибка загрузки видео');
        handleVideoFallback();
    }

    function handleVideoFallback() {
        // Используем фоновую картинку вместо видео
        heroVideo.style.display = 'none';
        videoWrapper.style.backgroundImage = "url('../img/Hero_background.png')";
    }

    function handleResize() {
        const isNowMobile = window.matchMedia('(max-width: 767px)').matches;

        if (isNowMobile && !isMobile) {
            // Переключились на мобильный вид
            handleMobileFallback();
        } else if (!isNowMobile && isMobile) {
            // Переключились на десктоп вид
            location.reload(); // Простой способ перезагрузить видео
        }
    }

    // Оптимизация для медленных соединений
    if ('connection' in navigator) {
        const connection = navigator.connection;

        if (connection) {
            // Если медленное соединение или режим экономии трафика
            if (connection.saveData ||
                connection.effectiveType === 'slow-2g' ||
                connection.effectiveType === '2g') {
                handleMobileFallback();
            }
        }
    }

    // Предзагрузка фоновой картинки
    const backgroundImage = new Image();
    backgroundImage.src = '../img/Hero_background.png';

    // Инициализация
    console.log('Видеофон инициализирован');
});