/**
 * Themes management for the IDE Business Card Generator
 */

// Apply a theme to the card window
function applyTheme(themeName) {
    const cardWindow = document.getElementById('card-window');
    
    // Remove all existing theme classes
    const themeClasses = ['theme-dark', 'theme-light', 'theme-monokai', 'theme-github', 'theme-tomorrow', 'theme-dracula'];
    themeClasses.forEach(cls => cardWindow.classList.remove(cls));
    
    // Add the selected theme class
    cardWindow.classList.add(`theme-${themeName}`);
    
    // Update the card content to refresh syntax highlighting
    updateCardContent();
}

// Initialize theme
document.addEventListener('DOMContentLoaded', () => {
    const themeSelect = document.getElementById('theme-select');
    
    // Apply default theme
    applyTheme('dark');
    
    // Theme change event listener
    themeSelect.addEventListener('change', (e) => {
        applyTheme(e.target.value);
    });
});
