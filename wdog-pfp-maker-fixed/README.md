# WDOG PFP Generator

A customizable profile picture generator for the WDOG community. Create unique WDOG profile pictures by adding backgrounds, accessories, and custom text.

## Features

- **Base Dog Customization**
  - Multiple backgrounds to choose from
  - Various accessories including eyes, hats, and clothes
  - Drag-and-drop positioning of elements
  - Real-time preview

- **Text Customization**
  - Add custom text to your PFP
  - Choose from multiple fonts
  - Adjust text size and color
  - Drag text to position
  - Preset text positions available

- **Asset Management**
  - Organized asset categories
  - Easy-to-use interface
  - Preview thumbnails for all assets

- **Export Options**
  - Download as PNG
  - High-quality output
  - Perfect for social media profiles

## Quick Links
- [Telegram](https://t.me)
- [Twitter](https://twitter.com)
- [Solscan](https://solscan.io)
- [DexTools](https://www.dextools.io)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Biirdmaan/wdog-pfp-maker-fun.git
cd wdog-pfp-maker-fun
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
wdog-pfp-maker-fixed/
├── public/              # Static assets
│   └── dogs/           # Example dog images
├── src/
│   ├── assets/         # Asset images (backgrounds, accessories, etc.)
│   ├── components/     # React components
│   ├── data/          # Asset configurations
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   └── pages/         # Page components
```

## Technologies Used

- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Canvas Manipulation**: HTML5 Canvas API

## Features in Detail

### PFP Generator
- Real-time preview of customizations
- Drag-and-drop interface for text positioning
- Multiple asset categories (backgrounds, eyes, hats, clothes)
- Custom text with font selection and color picker

### Asset Management
- Organized asset categories
- Easy switching between different assets
- Preview thumbnails
- Responsive grid layout

### Text Editor
- Font selection
- Color picker with presets
- Size adjustment
- Position presets
- Direct manipulation on canvas

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Original WDOG concept and community
- All contributors and community members
- shadcn/ui for the beautiful components
- Lucide for the icons
