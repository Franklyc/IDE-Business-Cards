/**
 * Export functionality for the IDE Business Card Generator
 */

// Export the card window as PNG
function exportToPNG() {
    const cardWindow = document.getElementById('card-window');
    const exportBtn = document.getElementById('export-btn');
    
    // Disable the button during export
    exportBtn.disabled = true;
    exportBtn.textContent = 'Exporting...';
    
    // Use html2canvas to convert the card to an image
    html2canvas(cardWindow, {
        scale: 2,  // Increase quality
        backgroundColor: null,  // Transparent background
        logging: false
    }).then(canvas => {
        // Create business card with proper aspect ratio (standard business card ratio)
        const aspectRatio = 1.75;  // Standard business card ratio (3.5" x 2")
        
        // Create a new canvas with the proper aspect ratio
        const finalCanvas = document.createElement('canvas');
        const ctx = finalCanvas.getContext('2d');
        
        // Set dimensions to maintain aspect ratio
        const cardWidth = canvas.width;
        const cardHeight = cardWidth / aspectRatio;
        
        finalCanvas.width = cardWidth;
        finalCanvas.height = cardHeight;
        
        // Fill with the background color from the theme
        const computedStyle = getComputedStyle(cardWindow);
        ctx.fillStyle = computedStyle.backgroundColor;
        ctx.fillRect(0, 0, cardWidth, cardHeight);
        
        // Draw the card content centered vertically in the new canvas
        const yOffset = (cardHeight - Math.min(canvas.height, cardHeight)) / 2;
        ctx.drawImage(
            canvas, 
            0, 0, canvas.width, Math.min(canvas.height, cardHeight),
            0, yOffset, cardWidth, Math.min(canvas.height, cardHeight)
        );
        
        // Convert to data URL and trigger download
        const dataUrl = finalCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'dev-card.png';
        link.href = dataUrl;
        link.click();
        
        // Re-enable the button
        exportBtn.disabled = false;
        exportBtn.innerHTML = '<i class="fas fa-download"></i> Export PNG';
    }).catch(error => {
        console.error('Export failed:', error);
        exportBtn.disabled = false;
        exportBtn.innerHTML = '<i class="fas fa-download"></i> Export PNG';
        alert('Export failed. Please try again.');
    });
}

// Initialize export button
document.addEventListener('DOMContentLoaded', () => {
    const exportBtn = document.getElementById('export-btn');
    
    exportBtn.addEventListener('click', exportToPNG);
});
