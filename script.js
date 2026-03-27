// 1. Smooth Scrolling for Navigation
document.querySelectorAll('.nav-links a, .btn-secondary').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 60, // Offset for sticky nav
                behavior: 'smooth'
            });
        }
    });
});

// 2. Scroll Fade-in Animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(section => {
    observer.observe(section);
});

// 3. The UNC Easter Egg
const nameHeader = document.getElementById('name-trigger');
const toast = document.getElementById('toast');

if (nameHeader) {
    nameHeader.addEventListener('click', () => {
        // Toggle UNC Blue CSS variables
        document.body.classList.toggle('tar-heel-mode');
        
        // Show Toast Notification
        toast.classList.add('show');
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    });
}