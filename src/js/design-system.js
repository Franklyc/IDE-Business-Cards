/**
 * Design system utilities for the IDE Business Card Generator
 * Based on the design reference document
 */

/* ==============================
   1. Theme Toggle Functionality
   ============================== */
function setupThemeToggle(toggleButtonSelector = '.theme-toggle') {
    const themeToggle = document.querySelector(toggleButtonSelector);
    if (!themeToggle) return;

    const toggleTheme = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        // Assumes FontAwesome icons
        themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', newTheme);
    };

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    } else {
        // Set default icon based on initial (light) theme
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

    themeToggle.addEventListener('click', toggleTheme);
}

/* ==============================
   2. Section Intersection Observer for Fade-in Animation
   ============================== */
function setupSectionObserver(sectionContentSelector = '.section-content', options = {}) {
    const defaultOptions = {
        root: null,
        rootMargin: '-50px',
        threshold: 0.15
    };

    const observerOptions = { ...defaultOptions, ...options };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll(sectionContentSelector).forEach(section => {
        observer.observe(section);
    });
}

/* ==============================
   3. Initialization
   ============================== */
document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
    setupSectionObserver();
});
