# wDOG PFP Generator

A customizable profile picture generator for the wDOG community. Create unique wDOG profile pictures by adding backgrounds, accessories, custom text, and more!

## ✨ Features

### 🎨 Base Dog Customization
- **35+ Stunning Backgrounds** - Choose from vaporwave, space themes, and more
- **Multiple Accessory Categories**:
  - **Eyes** - 15 different eye styles
  - **Hats** - 36 unique hat options with smart wrapper management
  - **Clothes** - 35 outfit variations
  - **Glasses** - 12 stylish glasses (including 6 moved from eyes category)
  - **Accessories** - 13 cool items
  - **Meme Signs** - 15 crypto-themed signs with custom positioning

### 🎩 Smart Hat System
- **36 Hats** with continuous numbering (1-36)
- **Intelligent Wrapper Management** - Certain hats automatically hide the wrapper overlay for better visual compatibility
- **Hats without wrapper**: Hat 2, 3, 5, 16, 21, 22, 25, 26, 27, 29, 30, 31, 32, 36
- **Hats with wrapper**: All other hats maintain the original wrapper overlay

### 📝 Advanced Text Editor
- Add custom text to your PFP
- **Font Selection** - Multiple font options (Arial, Comic Sans MS, Impact, Verdana, Times New Roman)
- **Color Picker** - Choose from presets or custom colors
- **Size & Position Control** - Drag text anywhere on canvas
- **Rotation & Scaling** - Rotate and scale text with keyboard shortcuts
- **Preset Positions** - Quick positioning options (Top Center, Bottom Center, Center, Top Left, Top Right, Bottom Left, Bottom Right)

### 🎯 Real-time Preview
- Instant preview of all changes
- Drag-and-drop positioning
- High-quality rendering
- Responsive design for all devices
- Smart asset positioning and scaling

### 💾 Export Options
- Download as high-quality PNG
- Perfect for social media profiles
- Optimized for various platforms

## 🔗 Quick Links
- [Twitter/X](https://t.co/GurmgVXpiR)
- [DexScreener](https://dexscreener.com/solana/25txtutlkjtcux3kqoervc7aubym7fckbwovqnqnydgq)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Biirdmaan/wdog-pfp-maker-fixed.git
cd wdog-pfp-maker-fixed
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
```

3. **Start the development server:**
```bash
npm run dev
# or
yarn dev
```

4. **Open your browser and navigate to `http://localhost:5173`**

## 📁 Project Structure

```
wdog-pfp-maker-fixed/
├── public/              # Static assets
│   └── dogs/           # Example dog images (0-99)
├── src/
│   ├── assets/         # Asset images
│   │   ├── back/       # Background images
│   │   ├── eyes/       # Eye variations
│   │   ├── hats/       # Hat options (36 total)
│   │   ├── clothes/    # Clothing items
│   │   ├── sunglases/  # Glasses options
│   │   ├── items/      # Accessories
│   │   └── signs/      # Meme signs
│   ├── components/     # React components
│   │   ├── PFPGenerator.tsx  # Main generator component
│   │   ├── Hero.tsx          # Landing page component
│   │   └── ui/               # shadcn/ui components
│   ├── data/          # Asset configurations
│   │   ├── assets.ts  # Main asset definitions
│   │   └── signs.ts   # Sign rendering functions
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   └── pages/         # Page components
```

## 🛠️ Technologies Used

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom gradients
- **UI Components**: shadcn/ui
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Canvas Manipulation**: HTML5 Canvas API
- **State Management**: React Hooks
- **Notifications**: Sonner toast

## 🎮 How to Use

### Creating Your PFP

1. **Choose a Background** - Select from 35+ stunning backgrounds
2. **Add Accessories** - Mix and match from different categories:
   - Eyes, Hats, Clothes, Glasses, Accessories
3. **Add Custom Text** - Use the text editor to add personalized messages
4. **Position Elements** - Drag text and use preset positions
5. **Download** - Save your creation as a high-quality PNG

### Text Editor Tips

- **Add Text**: Click "Add Text" button
- **Move Text**: Drag text directly on canvas
- **Rotate**: Hold Shift + R, then use arrow keys
- **Scale**: Hold Shift + S, then use arrow keys
- **Preset Positions**: Use quick position buttons
- **Font & Color**: Use the text controls panel

### Keyboard Shortcuts

- **R + Shift + Arrow Keys**: Rotate text
- **S + Shift + Arrow Keys**: Scale text
- **Random**: Generate random combination
- **Reset**: Clear all customizations

## 🎨 Asset Categories

### Backgrounds (35+ options)
- Vaporwave themes
- Space and cosmic designs
- Abstract patterns
- Gradient backgrounds

### Eyes (15 options)
- Various eye expressions
- Different styles and colors

### Hats (36 options)
- **Smart wrapper management** - Some hats automatically hide the wrapper for better compatibility
- Baseball caps, beanies, cowboy hats, and many more styles
- Continuous numbering from 1-36
- **Hats without wrapper**: 2, 3, 5, 16, 21, 22, 25, 26, 27, 29, 30, 31, 32, 36
- **Hats with wrapper**: All other hats

### Clothes (35 options)
- T-shirts
- Hoodies
- Jackets
- Various outfits

### Glasses (12 options)
- **Renamed from "Sunglasses" to "Glasses"** for better clarity
- Includes 6 items moved from the eyes category for better categorization
- Sunglasses and regular glasses
- Various frame styles

### Accessories (13 options)
- Musical instruments
- Props and items

### Meme Signs (15 options)
- Crypto-themed messages
- "TO THE MOON", "HODL", "WAGMI", etc.
- Custom positioning for each sign

## 🔧 Recent Updates

### Version 2.0 Features
- **Smart Hat System**: Automatic wrapper hiding for compatible hats
- **Glasses Category**: Renamed and reorganized for better user experience
- **Asset Reorganization**: Moved 6 eye items to glasses category
- **Continuous Hat Numbering**: Fixed hat numbering from 1-36 without gaps
- **Enhanced Text Editor**: Improved rotation and scaling controls
- **Code Cleanup**: Translated all comments to English and removed unnecessary code

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Original wDOG concept and community
- All contributors and community members
- shadcn/ui for the beautiful components
- Lucide for the icons
- The entire wDOG community for support and feedback

---

**Made with ❤️ for the wDOG community**