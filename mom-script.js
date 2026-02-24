// Регистрируем плагины GSAP
gsap.registerPlugin(ScrollTrigger);

// 1. Плавный скролл Lenis
const lenis = new Lenis();
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 2. Функция запуска (по клику на кнопку)
function startExperience() {
    const overlay = document.getElementById('overlay');
    const music = document.getElementById('bg-music');
    
    music.volume = 0; // Начинаем с тишины

    // 1. Взрыв конфетти
    explodeConfetti(); 

    // 2. Убираем оверлей
    gsap.to(overlay, {
        yPercent: -100,
        duration: 1.5,
        ease: "expo.inOut",
        onComplete: () => {
            overlay.style.display = 'none';
            music.play();
            // Плавно поднимаем громкость музыки
            gsap.to(music, { volume: 0.5, duration: 3 });
            initAnimations(); // Запускаем анимации контента
            createPetals();   // Запускаем падающие лепестки
        }
    });
}

// Функция для взрыва конфетти
function explodeConfetti() {
    const count = 150; // Увеличили количество для масштаба
    const colors = ['#ffb7c5', '#d4af37', '#ffffff', '#ff69b4', '#ffe4e1'];
    
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        document.body.appendChild(confetti);

        // Начальная точка — центр экрана
        const startX = window.innerWidth / 2;
        const startY = window.innerHeight / 2;

        gsap.set(confetti, {
            x: startX,
            y: startY,
            opacity: 1,
            scale: Math.random() * 1.2 + 0.5,
            rotation: Math.random() * 360
        });

        // Взрыв по всей площади
        gsap.to(confetti, {
            // Разлетаются на всю ширину и высоту с запасом
            x: `random(${-window.innerWidth * 0.2}, ${window.innerWidth * 1.2})`,
            y: `random(${-window.innerHeight * 0.2}, ${window.innerHeight * 1.2})`,
            rotation: 'random(360, 1440)',
            duration: 'random(2, 3.5)',
            ease: "power4.out",
            onComplete: () => {
                // После разлета заставляем их чуть-чуть "попадать" вниз
                gsap.to(confetti, {
                    y: "+=100",
                    opacity: 0,
                    duration: 1,
                    ease: "power1.in",
                    onComplete: () => confetti.remove()
                });
            }
        });
    }
}

// 3. Создание падающих лепестков (в финальной секции)
function createPetals() {
    const section = document.querySelector('.final-letter');
    for (let i = 0; i < 30; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        section.appendChild(petal);
        
        gsap.set(petal, {
            x: Math.random() * window.innerWidth,
            y: Math.random() * -500,
            opacity: Math.random(),
            scale: Math.random() * 0.5 + 0.5
        });

        gsap.to(petal, {
            y: window.innerHeight + 1000,
            x: "+=" + (Math.random() * 200 - 100),
            rotation: Math.random() * 360,
            duration: Math.random() * 5 + 7,
            repeat: -1,
            delay: Math.random() * 5,
            ease: "none"
        });
    }
}

// 4. Магический курсор и 3D-эффект
const cursor = document.querySelector('.magic-cursor');
window.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: "power2.out"
    });

    const xPos = (e.clientX / window.innerWidth - 0.5) * 20;
    const yPos = (e.clientY / window.innerHeight - 0.5) * 20;
    gsap.to(".main-photo-frame", {
        rotationY: xPos,
        rotationX: -yPos,
        duration: 1,
        ease: "power2.out"
    });
});

// 5. Анимации появления контента
function initAnimations() {
    gsap.from(".mom-name", { 
        opacity: 0, 
        scale: 0.8, 
        duration: 2, 
        ease: "expo.out" 
    });

    gsap.to(".marquee-inner", {
        xPercent: -30,
        scrollTrigger: {
            trigger: ".mom-marquee",
            scrub: 1
        }
    });

    gsap.utils.toArray('.memory-card').forEach(card => {
        gsap.to(card, {
            opacity: 1,
            y: -50,
            scrollTrigger: {
                trigger: card,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
    });
}

// Экспорт функции для HTML кнопки
window.startExperience = startExperience;
const signature = document.querySelector('.signature');
signature.style.cursor = 'pointer';
signature.addEventListener('click', () => {
    explodeConfetti(); // Повторим взрыв радости!
    signature.innerHTML = "Твой любимый сын ❤️";
    gsap.from(signature, {scale: 1.5, duration: 0.5, ease: "back.out"});
});
function openAlbum() {
    // 1. Находим первую фотографию альбома
    const firstPage = document.querySelector('.book-page');
    
    if (firstPage) {
        // 2. Плавно скроллим к ней с помощью Lenis или нативного скролла
        lenis.scrollTo(firstPage, {
            offset: -100, // Чтобы фото не прилипало к самому верху
            duration: 2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) // Плавный выезд
        });

        // 3. Добавляем эффект "вспышки" для всех фото при прокрутке
        gsap.fromTo(".book-page", 
            { opacity: 0, scale: 0.8, y: 50 },
            { 
                opacity: 1, 
                scale: 1, 
                y: 0, 
                stagger: 0.3, 
                duration: 1.2, 
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: ".book-container",
                    start: "top 80%"
                }
            }
        );
        
        // 4. Бахнем конфетти еще раз для настроения!
        explodeConfetti();
    }
}

// Не забудь обновить привязку окна
window.openAlbum = openAlbum;