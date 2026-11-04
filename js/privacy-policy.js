/**
 * BrendStory — политика конфиденциальности
 * Vanilla JS · Доступность · localStorage
 */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        const confirmBtn = document.getElementById('confirmBtn');
        const versionDate = document.getElementById('versionDate');
        const sections = document.querySelectorAll('.privacy-section');

        /* ============================================================
           ДАТА ВЕРСИИ
           ============================================================ */
        if (versionDate) {
            versionDate.textContent = 'февраль 2026';
        }

        /* ============================================================
           КНОПКА СОГЛАСИЯ
           ============================================================ */
        if (confirmBtn) {
            const confirmText = confirmBtn.querySelector('.privacy-confirm-btn__text');
            const confirmIcon = confirmBtn.querySelector('svg');

            const ICON_CONFIRMED = `
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6024 1.66667 10 1.66667C5.39763 1.66667 1.66667 5.39763 1.66667 10C1.66667 14.6024 5.39763 18.3333 10 18.3333Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M13.3333 7.5L8.75 12.0833L6.66667 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;

            const ICON_DEFAULT = `
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M16.6667 5.8335L8.33333 14.1668L4.16667 10.0002" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;

            function setConfirmed(isConfirmed) {
                if (isConfirmed) {
                    confirmBtn.classList.add('is-confirmed');
                    if (confirmText) confirmText.textContent = 'Согласие получено';
                    if (confirmIcon) {
                        const wrapper = document.createElement('span');
                        wrapper.innerHTML = ICON_CONFIRMED;
                        confirmIcon.replaceWith(wrapper.firstElementChild);
                    }
                    try {
                        localStorage.setItem('brendstory_privacy_confirmed', '1');
                    } catch (e) { /* ignore */ }
                } else {
                    confirmBtn.classList.remove('is-confirmed');
                    if (confirmText) confirmText.textContent = 'Я согласен с условиями';
                    if (confirmIcon) {
                        const wrapper = document.createElement('span');
                        wrapper.innerHTML = ICON_DEFAULT;
                        confirmIcon.replaceWith(wrapper.firstElementChild);
                    }
                    try {
                        localStorage.removeItem('brendstory_privacy_confirmed');
                    } catch (e) { /* ignore */ }
                }
            }

            // Восстанавливаем состояние из localStorage
            try {
                if (localStorage.getItem('brendstory_privacy_confirmed') === '1') {
                    setConfirmed(true);
                }
            } catch (e) { /* ignore */ }

            confirmBtn.addEventListener('click', function () {
                const isCurrentlyConfirmed = confirmBtn.classList.contains('is-confirmed');
                setConfirmed(!isCurrentlyConfirmed);
            });
        }

        /* ============================================================
           АКТИВНАЯ СЕКЦИЯ ПРИ СКРОЛЛЕ
           ============================================================ */
        if (sections.length && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        entry.target.classList.toggle('is-active', entry.isIntersecting);
                    });
                },
                {
                    rootMargin: '-25% 0px -55% 0px',
                    threshold: 0
                }
            );

            sections.forEach((section) => observer.observe(section));
        }

        /* ============================================================
           ПЛАВНЫЙ СКРОЛЛ К ЯКОРЮ (если в URL есть #section-N)
           ============================================================ */
        if (window.location.hash) {
            const target = document.querySelector(window.location.hash);
            if (target) {
                // Даём браузеру время на рендер
                setTimeout(() => {
                    const headerHeight = document.querySelector('.privacy-header')?.offsetHeight || 0;
                    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 24;
                    window.scrollTo({ top, behavior: 'smooth' });
                }, 100);
            }
        }
    });
})();