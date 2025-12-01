// Установка даты релиза
document.addEventListener('DOMContentLoaded', function() {
    const releaseDate = '01.01.2026';
    const releaseDateElement = document.getElementById('release-date');
    if (releaseDateElement) {
        releaseDateElement.textContent = releaseDate;
    }
});

// Мобильное меню
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Закрытие меню при клике на ссылку
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Плавная прокрутка для якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Анимация появления элементов при прокрутке
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Применяем анимацию к карточкам
document.querySelectorAll('.feature-card, .about-content, .download-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Эффект параллакса для hero секции
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-background');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Подсветка активной секции в навигации
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Анимация счетчика (если нужно)
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Функция для принудительного скачивания файла
function downloadAPK(event) {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('Кнопка скачивания нажата');
    
    // Прямая ссылка на скачивание из Google Drive
    const fileId = '1YcE_erbYAOh2eKKXeEXBH7nRsaNr2qtW';
    
    // Метод 1: Прямое перенаправление (самый надежный для Google Drive)
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t&uuid=`;
    
    // Используем window.location для принудительного скачивания
    window.location.href = downloadUrl;
    
    // Альтернативный метод через создание ссылки
    setTimeout(() => {
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'Antonov_Beta_3.apk';
        link.target = '_blank';
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
            document.body.removeChild(link);
        }, 100);
    }, 100);
    
    console.log('Начато скачивание Beta 3');
    
    // Показываем уведомление пользователю
    const btn = event.target.closest('.btn-download');
    if (btn) {
        const originalText = btn.querySelector('span').textContent;
        btn.querySelector('span').textContent = 'Скачивание...';
        btn.style.opacity = '0.7';
        
        setTimeout(() => {
            btn.querySelector('span').textContent = originalText;
            btn.style.opacity = '1';
        }, 2000);
    }
    
    return false;
}

// Обработка скачивания (резервный метод)
document.querySelectorAll('.btn-download').forEach(btn => {
    if (btn.id !== 'downloadBtn') {
        btn.addEventListener('click', function(e) {
            console.log('Начато скачивание Beta 3.0');
        });
    }
});

// Добавление эффекта наведения на кнопки
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// Предзагрузка изображений (если будут добавлены)
function preloadImages() {
    const images = [];
    // Здесь можно добавить пути к изображениям
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Инициализация при загрузке
window.addEventListener('load', () => {
    console.log('Antonov Beta 3.0 - Website loaded');
    preloadImages();
});

