# IDE Business Card Generator

[中文说明](README_zh-CN.md)

A static web application that creates customizable IDE-style business cards that can be exported as PNG images.

![IDE Business Card Example](src/assets/example-card.png)

## Features

- Create personalized IDE-style business cards
- Customize key-value pairs with your own information
- Choose between JSON, YAML, and Properties formats
- Select from multiple IDE color themes
- Customize card preview font size and line height
- Customize the filename in the card's title bar
- Toggle visibility of the file extension in the title bar
- Export as PNG with proper business card proportions

## Usage

1.  Edit the key-value pairs in the "Customize Your Card" section.
2.  Add or remove fields as needed using the "Add Field" button.
3.  Under "Card Styling Options":
    *   Choose your preferred format (JSON, YAML, or Properties).
    *   Select a theme that matches your style.
    *   Adjust the "Font Size (px)" and "Line Height" for the card preview.
    *   Customize the "Filename" displayed in the card's title bar.
    *   Use the "Show Extension" toggle to show or hide the file extension in the title.
4.  Click "Export PNG" to download your card.

## Available Themes

- Dark (VS Code default)
- Light
- Monokai
- GitHub
- Tomorrow Night
- Dracula (Default)

## Deployment

This is a static website that can be easily deployed to GitHub Pages:

1.  Fork this repository
2.  Go to your repository settings
3.  Navigate to Pages section
4.  Choose the branch you want to deploy (usually `main`)
5.  Set the folder to `/` (root)
6.  Click Save

Your IDE Business Card Generator will be available at `https://[your-username].github.io/IDE-Business-Cards/`

## Local Development

To run this project locally:

1.  Clone the repository
2.  Open the project folder
3.  Open `index.html` in your browser

No build steps or server are required as this is a pure HTML/CSS/JavaScript application.

## License

MIT

## Credits

Created with ❤️ using HTML, CSS, and vanilla JavaScript.
