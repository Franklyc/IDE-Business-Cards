# Reusable Design System Components from franklyc.github.io

This document outlines reusable code snippets (HTML, CSS, JavaScript) extracted from the `franklyc.github.io` personal website project. Use these components to build new projects with a consistent visual style and functionality.

## I. Setup & Dependencies

Before using the components, ensure you have the following set up in your new project's HTML `<head>`:

1.  **Core Stylesheet:** Link to a CSS file containing the "Core CSS" and any desired "Component CSS" sections below.
2.  **Font Awesome:** For icons (navbar toggle, theme toggle, contact icons, social links).
    ```html
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    ```
3.  **Google Font (Poppins):** For the specific typography.
    ```html
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    ```
4.  **Core JavaScript:** Include a `<script>` tag for the "Core JavaScript" functions, preferably at the end of your `<body>`.

## II. Core CSS (Variables & Base Styles)

Place these at the beginning of your main CSS file.

```css
/* ==============================
   1. CSS Variables & Theme Setup
   ============================== */
:root {
    --primary-color: #2563eb;
    --secondary-color: #1e40af;
    --background-color: #ffffff;
    --text-color: #1f2937;
    --light-gray: #f3f4f6;
    --border-color: #e5e7eb;
    --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
    /* Add RGB versions for RGBA usage if needed, e.g.: */
    --primary-color-rgb: 37, 99, 235;
    --secondary-color-rgb: 30, 64, 175;
}

[data-theme="dark"] {
    --primary-color: #60a5fa;
    --secondary-color: #3b82f6;
    --background-color: #111827;
    --text-color: #f3f4f6;
    --light-gray: #1f2937;
    --border-color: #374151;
    --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
    /* Add RGB versions for RGBA usage if needed, e.g.: */
    --primary-color-rgb: 96, 165, 250;
    --secondary-color-rgb: 59, 130, 246;
}

/* ==============================
   2. Base Styles & Typography
   ============================== */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth; /* For smooth scrolling via #links */
}

body {
    font-family: 'Poppins', sans-serif;
    line-height: 1.6;
    color: var(--text-color);
    background-color: var(--background-color);
    transition: background-color 0.3s var(--transition-timing),
                color 0.3s var(--transition-timing);
}

a {
    color: var(--primary-color);
    text-decoration: none;
    transition: color 0.3s var(--transition-timing);
}

a:hover {
    color: var(--secondary-color);
}

/* Optional: Base heading styles if desired */
h1, h2, h3, h4, h5, h6 {
   font-weight: 700; /* Example base weight */
   color: var(--text-color); /* Ensure headings also change color */
}
```

## III. Core JavaScript Utilities

Include these functions in your project's JavaScript file. Ensure the script is loaded *after* the DOM is ready (e.g., use `DOMContentLoaded` listener or place `<script>` at the end of `<body>`).

```javascript
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
   2. Smooth Scrolling for Anchor Links
   ============================== */
function setupSmoothScrolling(offset = 80) { // offset for fixed header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Ensure it's not just a hash '#' or an empty hash
            if (href.length <= 1) return;

            try {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Optional: Close mobile menu if open (needs mobile menu setup)
                     const navLinks = document.querySelector('.nav-links'); // Adjust selector if needed
                     if (navLinks && navLinks.classList.contains('active') && window.innerWidth <= 768) {
                         navLinks.classList.remove('active');
                     }
                }
            } catch (error) {
                console.warn(`Smooth scroll target not found or invalid selector: ${href}`, error);
            }
        });
    });
}

/* ==============================
   3. Intersection Observer for Section Fade-in Animation
   ============================== */
function setupSectionObserver(sectionContentSelector = '.section-content', options = {}) {
    const defaultOptions = {
        root: null,
        rootMargin: '-50px', // Adjust trigger point as needed
        threshold: 0.15       // Percentage of element visible to trigger
    };

    const observerOptions = { ...defaultOptions, ...options };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Unobserve after animation to save resources
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll(sectionContentSelector).forEach(section => {
        observer.observe(section);
    });
}

// --- CSS needed for Intersection Observer ---
/*
.section-content { // Or other observed elements
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s var(--transition-timing),
                transform 0.8s var(--transition-timing);
}

.section-content.visible {
    opacity: 1;
    transform: translateY(0);
}
*/


/* ==============================
   4. Mobile Navigation Toggle
   ============================== */
function setupMobileMenu(menuButtonSelector = '.menu-btn', navLinksSelector = '.nav-links') {
    const menuBtn = document.querySelector(menuButtonSelector);
    const navLinks = document.querySelector(navLinksSelector);

    if (!menuBtn || !navLinks) return;

    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent click from immediately closing menu via document listener
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        // Check if the click is outside the nav container and the menu is active
        if (!e.target.closest('.nav-content') && navLinks.classList.contains('active')) {
             navLinks.classList.remove('active');
        }
    });

    // Close menu when a link is clicked (useful for single-page apps)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active') && window.innerWidth <= 768) {
                navLinks.classList.remove('active');
            }
        });
    });
}

/* ==============================
   5. Navbar Scroll Effect (Shadow)
   ============================== */
function setupNavbarScrollEffect(navbarSelector = '.navbar') {
    const navbar = document.querySelector(navbarSelector);
    if (!navbar) return;

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 50) { // Add a small threshold
            navbar.style.boxShadow = 'none';
        } else {
            // Use the CSS variable for consistency
            navbar.style.boxShadow = 'var(--card-shadow)';
        }
        lastScroll = currentScroll;
    });
     // Initial check in case page loads scrolled
     if (window.pageYOffset > 50) {
        navbar.style.boxShadow = 'var(--card-shadow)';
     } else {
        navbar.style.boxShadow = 'none';
     }
}


// --- Call Initialization Functions ---
document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
    setupSmoothScrolling(80); // Adjust offset if navbar height changes
    setupSectionObserver();
    setupMobileMenu();
    setupNavbarScrollEffect();
});
```

## IV. Reusable Components (HTML & CSS)

### 1. Navbar

**HTML Structure:**

```html
<nav class="navbar">
    <div class="nav-content">
        <div class="logo">LOGO</div> <!-- Or your actual logo/text -->
        <div class="nav-links">
            <a href="#home" class="active">Home</a>
            <a href="#about">About</a>
            <!-- Add other links -->
        </div>
        <!-- Theme Toggle Button (Requires JS) -->
        <button class="theme-toggle">
            <!-- Icon is set by JS -->
        </button>
        <!-- Mobile Menu Button (Requires JS & CSS for hiding/showing links) -->
        <div class="menu-btn">
            <i class="fas fa-bars"></i>
        </div>
    </div>
</nav>
```

**CSS:**

```css
/* Navbar Styles */
.navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: rgba(var(--background-color-rgb, 255, 255, 255), 0.95); /* Fallback white */
    backdrop-filter: blur(10px);
    z-index: 1000;
    /* box-shadow applied by JS based on scroll */
    transition: background-color 0.3s var(--transition-timing), box-shadow 0.3s var(--transition-timing);
}
/* Ensure RGB vars are defined in :root and [data-theme="dark"] */
[data-theme="dark"] .navbar {
     background-color: rgba(var(--background-color-rgb, 17, 24, 39), 0.95); /* Fallback dark */
}


.nav-content {
    max-width: 1200px; /* Adjust as needed */
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-color);
    transition: transform 0.3s var(--transition-timing);
}

.logo:hover {
    transform: scale(1.05);
}

.nav-links {
    display: flex;
    gap: 2rem; /* Adjust spacing */
}

.nav-links a {
    text-decoration: none;
    color: var(--text-color);
    font-weight: 500;
    transition: color 0.3s var(--transition-timing);
    position: relative;
    padding-bottom: 4px; /* Space for underline */
}

/* Underline effect */
.nav-links a::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: var(--primary-color);
    transition: width 0.3s var(--transition-timing);
}

.nav-links a:hover::after,
.nav-links a.active::after { /* Class 'active' can be added manually or via JS */
    width: 100%;
}
.nav-links a:hover {
    color: var(--primary-color); /* Optional: change text color on hover too */
}


/* Theme Toggle Button */
.theme-toggle {
    background: none;
    border: none;
    color: var(--text-color);
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0.5rem;
    margin-left: 1rem; /* Spacing from nav links */
    transition: transform 0.3s var(--transition-timing), color 0.3s var(--transition-timing);
}

.theme-toggle:hover {
    transform: rotate(180deg);
    color: var(--primary-color);
}

/* Mobile Menu Button */
.menu-btn {
    display: none; /* Hidden by default */
    cursor: pointer;
    font-size: 1.5rem;
    color: var(--text-color);
}

/* Responsive Navbar (Mobile) */
@media (max-width: 768px) {
    .nav-links {
        display: none; /* Hidden initially */
        position: absolute;
        top: 100%; /* Position below navbar */
        left: 0;
        width: 100%;
        background-color: var(--background-color);
        padding: 1rem;
        flex-direction: column;
        align-items: center;
        box-shadow: var(--card-shadow);
        border-top: 1px solid var(--border-color);
    }

    .nav-links.active {
        display: flex; /* Show when active class is added by JS */
    }

    .menu-btn {
        display: block; /* Show mobile menu button */
    }

     .theme-toggle {
        margin-left: auto; /* Push theme toggle to the right before menu btn */
        margin-right: 1rem;
    }
}
```

### 2. Buttons

**HTML Structure:**

```html
<a href="#" class="btn primary">Primary Button</a>
<button class="btn secondary">Secondary Button</button>
```

**CSS:**

```css
.btn {
    display: inline-block; /* Or block if needed */
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 500;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s var(--transition-timing);
    border: 2px solid transparent; /* Base border */
    position: relative;
    overflow: hidden; /* For potential effects */
}

.btn:hover {
    transform: translateY(-2px); /* Slight lift effect */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn.primary {
    background-color: var(--primary-color);
    color: white; /* Ensure contrast */
    border-color: var(--primary-color);
}

.btn.primary:hover {
    background-color: var(--secondary-color);
    border-color: var(--secondary-color);
    /* Adjust shadow for primary color if desired */
    /* box-shadow: 0 4px 12px rgba(var(--primary-color-rgb), 0.3); */
}

.btn.secondary {
    background-color: transparent;
    color: var(--primary-color);
    border: 2px solid var(--primary-color);
}

.btn.secondary:hover {
    background-color: var(--primary-color);
    color: white; /* Text color changes on hover */
}

/* Optional: Ripple Effect from original project */
/*
.btn::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.6s var(--transition-timing), height 0.6s var(--transition-timing);
    opacity: 0;
}

.btn:hover::before {
    width: 300px; // Or large enough value
    height: 300px;
    opacity: 1;
}
*/
```

### 3. Section Layout

**HTML Structure:**

```html
<section id="unique-section-id">
    <div class="section-content"> <!-- JS observes this for fade-in -->
        <h2>Section Title</h2>
        <!-- Section content goes here -->
        <p>Some text...</p>
        <div class="example-grid"> <!-- Example content structure -->
            <div>Item 1</div>
            <div>Item 2</div>
        </div>
    </div>
</section>
```

**CSS:**

```css
section {
    padding: 6rem 2rem; /* Adjust padding as needed */
    position: relative; /* For potential absolute positioning inside */
}

.section-content {
    max-width: 1200px; /* Consistent content width */
    margin: 0 auto;
    /* Animation styles (applied if using JS observer) */
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s var(--transition-timing),
                transform 0.8s var(--transition-timing);
}

.section-content.visible {
    opacity: 1;
    transform: translateY(0);
}


/* Section Heading Style */
h2 {
    font-size: 2.5rem; /* Adjust size */
    font-weight: 700;
    margin-bottom: 3rem; /* Space below heading */
    text-align: center;
    position: relative; /* For underline */
    color: var(--text-color);
}

/* Underline for Section Heading */
h2::after {
    content: '';
    position: absolute;
    bottom: -10px; /* Position below text */
    left: 50%;
    transform: translateX(-50%);
    width: 60px; /* Underline width */
    height: 3px; /* Underline thickness */
    background-color: var(--primary-color);
}

/* Responsive Padding */
@media (max-width: 768px) {
    section {
        padding: 4rem 1rem;
    }
    h2 {
        font-size: 2rem;
    }
}
```

### 4. Card Component (General Base)

This provides a base style. You might need variations like `.project-card`, `.timeline-item`.

**HTML Structure:**

```html
<div class="card">
    <!-- Card content -->
    <h4>Card Title</h4>
    <p>Some descriptive text.</p>
</div>
```

**CSS:**

```css
.card { /* Base card style */
    padding: 1.5rem;
    background-color: var(--light-gray);
    border-radius: 1rem; /* Rounded corners */
    box-shadow: var(--card-shadow);
    transition: all 0.3s var(--transition-timing);
    position: relative; /* For potential pseudo-elements or positioning inside */
    overflow: hidden; /* If using effects that might bleed out */
}

.card:hover {
    transform: translateY(-5px); /* Lift effect on hover */
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15); /* Enhanced shadow */
    /* Update shadow for dark mode if needed */
     /* [data-theme="dark"] .card:hover { box-shadow: ... } */
}

.card h4 { /* Example title style */
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
    color: var(--primary-color);
}

.card p {
    margin-bottom: 1rem; /* Spacing for paragraph */
    color: var(--text-color);
    opacity: 0.9; /* Slightly lighter text */
}

/* Example: Specific card type like Project Card */
.project-card {
    /* Inherits .card styles or define similar ones */
    /* Add specific project card styles if needed */
}

.timeline-item {
     /* Inherits .card styles or define similar ones */
     /* Add specific timeline item styles */
     padding: 1.5rem;
     background-color: var(--light-gray);
     border-radius: 1rem;
     position: relative;
     transition: all 0.3s var(--transition-timing);
}
.timeline-item:hover {
    transform: translateY(-5px);
    box-shadow: var(--card-shadow);
}
.timeline-item h4 { /* Specific styling for timeline titles */
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    color: var(--primary-color);
}
/* Add other specific card styles (.publication-item, .contact-item) similarly */
```

### 5. Tag Component

**HTML Structure:**

```html
<div class="tag-container"> <!-- e.g., .skill-tags, .project-tags -->
  <span>Tag 1</span>
  <span>Another Tag</span>
  <span>Web Dev</span>
</div>
```

**CSS:**

```css
.tag-container { /* Base container */
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem; /* Space between tags */
    margin-top: 1rem; /* Space above tags */
}

.tag-container span { /* Individual tag style */
    background-color: var(--background-color); /* Or var(--light-gray) depending on context */
    padding: 0.35rem 0.85rem;
    border-radius: 2rem; /* Pill shape */
    font-size: 0.85rem;
    font-weight: 500;
    border: 1px solid var(--border-color); /* Subtle border */
    transition: all 0.3s var(--transition-timing);
    cursor: default; /* Indicate it's not clickable unless it is */
}

.tag-container span:hover {
    transform: translateY(-2px);
    box-shadow: var(--card-shadow);
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

/* Variations if needed */
.skill-tags span {
    /* Specific styles for skill tags */
     background-color: var(--light-gray); /* Original style */
}

.project-tags span {
    /* Specific styles for project tags */
    background-color: var(--background-color); /* Original style */
    font-size: 0.8rem;
}
```

### 6. Footer

**HTML Structure:**

```html
<footer>
    <div class="footer-content">
        <p>&copy; YEAR Your Name/Company. All rights reserved.</p>
        <!-- Optional: Add social links or other info -->
    </div>
</footer>
```

**CSS:**

```css
footer {
    background-color: var(--light-gray);
    padding: 2rem 1rem;
    text-align: center;
    margin-top: 4rem; /* Space above footer */
    border-top: 1px solid var(--border-color);
}

.footer-content {
    max-width: 1200px;
    margin: 0 auto;
    color: var(--text-color);
    opacity: 0.8; /* Slightly muted text */
    font-size: 0.9rem;
}
```

## V. Usage Notes

*   **Customization:** Modify CSS variables in `:root` to easily change the entire color scheme.
*   **JavaScript Initialization:** Ensure you call the setup functions (like `setupThemeToggle()`, `setupSmoothScrolling()`, etc.) after the DOM is loaded.
*   **HTML Structure:** The JavaScript functions rely on specific class names (e.g., `.theme-toggle`, `.navbar`, `.section-content`). Make sure your HTML uses these classes correctly if you want the JS functionality.
*   **Dependencies:** Remember to include Font Awesome and the Google Font in your HTML.
*   **Modularity:** You don't have to use all components. Include only the HTML structures and CSS rules for the components you need in your new project.

This structure should provide a solid foundation for reusing your design system across different projects.
