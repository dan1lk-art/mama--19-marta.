/**
 * THE EVOLUTION SCRIPT
 * Версия: 2.0.0
 * Автор: Gemini AI (Твой напарник)
 * Этот скрипт управляет всей магией сайта.
 */

// Ждем полной загрузки контента
window.addEventListener('DOMContentLoaded', () => {

    console.log("System Initialized...");

    // 1. Инициализация Lenis (Плавный скролл)
    const initLenis = () => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
    };

    // 2. Анимация кастомного курсора
    const initCursor = () => {
        const dot = document.querySelector('.cursor-dot');
        const outline = document.querySelector('.cursor-outline');

        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Используем GSAP для идеально плавного следования
            gsap.to(dot, { x: posX, y: posY, duration: 0.1 });
            gsap.to(outline, { x: posX, y: posY, duration: 0.45 });
        });
    };

    // 3. Прелоадер
    const initLoader = () => {
        const tl = gsap.timeline();

        tl.to(".loader-bar span", { width: "100%", duration: 1.5, ease: "power2.inOut" })
          .to(".loader", { yPercent: -100, duration: 1, ease: "expo.inOut" })
          .from(".main-title .char", { y: 200, stagger: 0.05, duration: 1, ease: "expo.out" }, "-=0.5");
    };

    // 4. SplitType - разбиваем текст на буквы для анимации
    const initTextAnimation = () => {
        const splitElements = document.querySelectorAll('.split-text');
        
        splitElements.forEach(el => {
            const split = new SplitType(el, { types: 'chars' });
            
            gsap.from(split.chars, {
                scrollTrigger: {
                    trigger: el,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                },
                y: 100,
                opacity: 0,
                stagger: 0.02,
                duration: 1,
                ease: "power4.out"
            });
        });
    };

    // 5. Горизонтальный скролл (Секция 2)
    const initHorizontalScroll = () => {
        const track = document.querySelector('.horizontal-track');
        
        gsap.to(track, {
            x: () => -(track.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
                trigger: ".horizontal-section",
                start: "top top",
                end: () => "+=" + track.scrollWidth,
                scrub: 1,
                pin: true,
                invalidateOnRefresh: true
            }
        });
    };

    // 6. Анимация появления блоков (Reveal Up)
    const initReveal = () => {
        const reveals = document.querySelectorAll('.reveal-up');

        reveals.forEach(el => {
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: "top 90%",
                },
                y: 60,
                opacity: 0,
                duration: 1.2,
                ease: "expo.out"
            });
        });
    };

    // ЗАПУСК ВСЕХ ФУНКЦИЙ
    initLenis();
    initCursor();
    initLoader();
    initTextAnimation();
    initHorizontalScroll();
    initReveal();

});