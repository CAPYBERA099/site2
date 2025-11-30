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
    
    // Прямая ссылка на скачивание из Google Drive
    const fileId = '1NLA512Esf2-FrHwSoK-mXuAlHorPxaCz';
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`;
    
    // Создаем временную ссылку для скачивания
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'Antonov_Beta_3.0.apk';
    link.style.display = 'none';
    
    // Добавляем в DOM, кликаем и удаляем
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('Начато скачивание Beta 3.0');
    
    // Альтернативный метод через iframe (на случай если первый не сработает)
    setTimeout(() => {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = downloadUrl;
        document.body.appendChild(iframe);
        
        setTimeout(() => {
            document.body.removeChild(iframe);
        }, 1000);
    }, 100);
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

