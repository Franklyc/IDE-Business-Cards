/**
 * Main application logic for the IDE Business Card Generator
 */

// Default fields for the business card
const defaultFields = [
    { key: 'name', value: 'Frank' },
    { key: 'title', value: 'ML Researcher' },
    { key: 'email', value: 'your.email@example.com' },
    { key: 'link', value: 'your-website.com' }
];

// Current format - 'json' or 'yaml'
let currentFormat = 'json';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the card with default fields
    initializeFields();
    
    // Add event listeners
    setupEventListeners();
    
    // Initial card content update
    updateCardContent();
    
    // Set default theme
    applyTheme('dracula');
    
    // Update theme toggle based on system preference
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDarkScheme.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
});

// Initialize form fields
function initializeFields() {
    const fieldsContainer = document.getElementById('fields-container');
    fieldsContainer.innerHTML = '';
    
    defaultFields.forEach((field, index) => {
        addFieldRow(field.key, field.value, index !== 0);
    });
}

// Add a new field row to the form
function addFieldRow(key = '', value = '', removable = true) {
    const fieldsContainer = document.getElementById('fields-container');
    const fieldRow = document.createElement('div');
    fieldRow.classList.add('field-row');
    
    fieldRow.innerHTML = `
        <div class="field-key">
            <input type="text" placeholder="Key" value="${key}" class="key-input">
        </div>
        <div class="field-value">
            <input type="text" placeholder="Value" value="${value}" class="value-input">
        </div>
        ${removable ? '<button class="remove-field"><i class="fas fa-times"></i></button>' : ''}
    `;
    
    // Add event listener to inputs for live update
    const inputs = fieldRow.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', updateCardContent);
    });
    
    // Add event listener to remove button
    if (removable) {
        const removeBtn = fieldRow.querySelector('.remove-field');
        removeBtn.addEventListener('click', () => {
            fieldRow.remove();
            updateCardContent();
        });
    }
    
    fieldsContainer.appendChild(fieldRow);
    return fieldRow;
}

// Set up event listeners
function setupEventListeners() {
    // Add field button
    const addFieldBtn = document.getElementById('add-field-btn');
    addFieldBtn.addEventListener('click', () => {
        // Add click animation to button
        addFieldBtn.classList.add('clicked');
        setTimeout(() => {
            addFieldBtn.classList.remove('clicked');
        }, 300);
        
        const row = addFieldRow();
        row.querySelector('input').focus();
        updateCardContent();
    });
    
    // Format select
    const formatSelect = document.getElementById('format-select');
    formatSelect.addEventListener('change', (e) => {
        currentFormat = e.target.value;
        const windowTitle = document.getElementById('window-title');
        windowTitle.textContent = `business_card.${currentFormat}`;
        updateCardContent();
    });

    // Font size input
    const fontSizeInput = document.getElementById('font-size-input');
    fontSizeInput.addEventListener('input', applyCustomStyles);

    // Line height input
    const lineHeightInput = document.getElementById('line-height-input');
    lineHeightInput.addEventListener('input', applyCustomStyles);
}

// Get current field data from form
function getFieldData() {
    const rows = document.querySelectorAll('.field-row');
    const data = {};
    
    rows.forEach(row => {
        const keyInput = row.querySelector('.key-input');
        const valueInput = row.querySelector('.value-input');
        
        const key = keyInput.value.trim();
        const value = valueInput.value.trim();
        
        if (key && value) {
            data[key] = value;
        }
    });
    
    return data;
}

// Format data as JSON, YAML, or Properties
function formatData(data) {
    if (currentFormat === 'json') {
        return formatAsJSON(data);
    } else if (currentFormat === 'yaml') {
        return formatAsYAML(data);
    } else if (currentFormat === 'properties') {
        return formatAsProperties(data);
    } else {
        // Default to JSON if format is unknown
        return formatAsJSON(data);
    }
}

// Format data as pretty JSON
function formatAsJSON(data) {
    const jsonString = JSON.stringify(data, null, 2);
    return jsonString;
}

// Format data as YAML
function formatAsYAML(data) {
    let yaml = '';
    for (const key in data) {
        yaml += `${key}: ${data[key]}\n`;
    }
    return yaml.trim(); // Trim trailing newline
}

// Format data as Properties (KEY=Value)
function formatAsProperties(data) {
    let propertiesString = '';
    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
            propertiesString += `${key}=${data[key]}\n`;
        }
    }
    return propertiesString.trim(); // Trim trailing newline
}

// Update the card content based on form data
function updateCardContent() {
    const codeContent = document.getElementById('code-content');
    const lineNumbers = document.getElementById('line-numbers');
    const data = getFieldData();
    
    // Format the data as JSON or YAML
    const formattedData = formatData(data);
    
    // Split the formatted data into lines
    const lines = formattedData.split('\n');
    
    // Update line numbers
    lineNumbers.innerHTML = '';
    for (let i = 1; i <= lines.length; i++) {
        const lineNumber = document.createElement('div');
        lineNumber.textContent = i;
        lineNumbers.appendChild(lineNumber);
    }
    
    // Update code content with syntax highlighting
    codeContent.innerHTML = '';
    if (currentFormat === 'json') {
        // Apply JSON syntax highlighting
        lines.forEach(line => {
            const lineElement = document.createElement('div');
            
            // Check if line contains a property
            if (line.includes(':')) {
                const parts = line.split(':');
                const propertyPart = parts[0];
                const valuePart = parts.slice(1).join(':');
                
                // Handle property and string value
                if (propertyPart.includes('"')) {
                    const propertyName = document.createElement('span');
                    propertyName.classList.add('property');
                    propertyName.textContent = propertyPart;
                    lineElement.appendChild(propertyName);
                } else {
                    lineElement.textContent += propertyPart;
                }
                
                lineElement.textContent += ':';
                
                if (valuePart.includes('"')) {
                    const valueSpan = document.createElement('span');
                    valueSpan.classList.add('string');
                    valueSpan.textContent = valuePart;
                    lineElement.appendChild(valueSpan);
                } else {
                    lineElement.textContent += valuePart;
                }
            } else {
                // Handle braces and other characters
                lineElement.textContent = line;
            }
            
            codeContent.appendChild(lineElement);
        });
    } else if (currentFormat === 'yaml') { // Explicitly check for yaml
        // Apply YAML syntax highlighting
        lines.forEach(line => {
            const lineElement = document.createElement('div');
            
            if (line.includes(':')) {
                const parts = line.split(/:(.*)/s); // Split only on the first colon
                const propertyPart = parts[0];
                const valuePart = parts[1] || ''; // Handle cases with no value after colon
                
                const propertyName = document.createElement('span');
                propertyName.classList.add('property');
                propertyName.textContent = propertyPart;
                lineElement.appendChild(propertyName);
                
                const colon = document.createTextNode(':');
                lineElement.appendChild(colon);
                
                const valueSpan = document.createElement('span');
                valueSpan.classList.add('string');
                valueSpan.textContent = valuePart;
                lineElement.appendChild(valueSpan);
            } else {
                lineElement.textContent = line;
            }
            
            codeContent.appendChild(lineElement);
        });
    } else if (currentFormat === 'properties') {
        // Apply Properties syntax highlighting
        lines.forEach(line => {
            const lineElement = document.createElement('div');
            if (line.includes('=')) {
                const parts = line.split(/=(.*)/s); // Split only on the first equals sign
                const keyPart = parts[0];
                const valuePart = parts[1] || ''; // Handle cases with no value after equals

                const keySpan = document.createElement('span');
                keySpan.classList.add('property'); // Use 'property' class for keys
                keySpan.textContent = keyPart;
                lineElement.appendChild(keySpan);

                const equalsSign = document.createTextNode('=');
                lineElement.appendChild(equalsSign);

                const valueSpan = document.createElement('span');
                valueSpan.classList.add('string'); // Use 'string' class for values
                valueSpan.textContent = valuePart;
                lineElement.appendChild(valueSpan);
            } else {
                // Potentially for comments (e.g. lines starting with #) or empty lines
                if (line.trim().startsWith('#')) {
                    const commentSpan = document.createElement('span');
                    commentSpan.classList.add('comment');
                    commentSpan.textContent = line;
                    lineElement.appendChild(commentSpan);
                } else {
                    lineElement.textContent = line;
                }
            }
            codeContent.appendChild(lineElement);
        });
    } else {
        // Fallback for any other unknown format (or if you want a plain text view)
        lines.forEach(line => {
            const lineElement = document.createElement('div');
            lineElement.textContent = line;
            codeContent.appendChild(lineElement);
        });
    }
    
    // Apply custom font size and line height first, then adjust if no custom font size is set
    applyCustomStyles(); // Apply user-defined styles
    adjustFontSize(); // Dynamically adjust font size if not set by user
}

// Dynamically adjust font size based on content amount
function adjustFontSize() {
    const codeContent = document.getElementById('code-content');
    const lineNumbers = document.getElementById('line-numbers');
    const fontSizeInput = document.getElementById('font-size-input');

    // If user has set a font size, respect it and do not auto-adjust
    if (fontSizeInput.value && parseFloat(fontSizeInput.value) > 0) {
        // Ensure line numbers also get this font size if not handled by applyCustomStyles directly for line numbers
        // applyCustomStyles already handles codeContent, this is a fallback or explicit set for lineNumbers
        // lineNumbers.style.fontSize = `${parseFloat(fontSizeInput.value)}px`;
        return;
    }

    const lineCount = codeContent.childElementCount;
    
    // Base size for auto-adjustment
    let fontSize = 14;
    
    // Adjust based on number of lines
    if (lineCount <= 3) {
        fontSize = 18; // Larger font for very little content
    } else if (lineCount <= 6) {
        fontSize = 16; // Medium font for small content
    } else if (lineCount <= 10) {
        fontSize = 14; // Default font size
    } else if (lineCount <= 15) {
        fontSize = 12; // Smaller font for more content
    } else {
        fontSize = 10; // Very small font for lots of content
    }
    
    // Apply the font size
    codeContent.style.fontSize = `${fontSize}px`;
    document.getElementById('line-numbers').style.fontSize = `${fontSize}px`;
}

// Apply custom styles from input fields
function applyCustomStyles() {
    const codeContent = document.getElementById('code-content');
    const lineNumbers = document.getElementById('line-numbers');
    const fontSizeInput = document.getElementById('font-size-input');
    const lineHeightInput = document.getElementById('line-height-input');

    const fontSize = fontSizeInput.value;
    const lineHeight = lineHeightInput.value;

    if (fontSize && parseFloat(fontSize) > 0) {
        const newFontSize = `${parseFloat(fontSize)}px`;
        codeContent.style.fontSize = newFontSize;
        lineNumbers.style.fontSize = newFontSize; // Also apply to line numbers
    } else {
        // If font size input is cleared, let adjustFontSize handle it or reset to a default
        // For now, if cleared, adjustFontSize will take over.
        // Alternatively, reset to a default:
        // codeContent.style.fontSize = '14px';
        // lineNumbers.style.fontSize = '14px';
    }

    if (lineHeight && parseFloat(lineHeight) > 0) {
        codeContent.style.lineHeight = lineHeight;
        lineNumbers.style.lineHeight = lineHeight; // Also apply to line numbers
    } else {
        // Reset to a default if cleared
        // codeContent.style.lineHeight = '1.5';
        // lineNumbers.style.lineHeight = '1.5';
    }
}
