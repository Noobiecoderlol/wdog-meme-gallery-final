import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  Download, 
  Sparkles, 
  Wand2, 
  ArrowLeft, 
  Twitter, 
  LineChart, 
  Crosshair, 
  RotateCcw,
  Type,
  Move,
  Upload,
  Image
} from 'lucide-react';
import { XIcon } from '@/components/ui/x-icon';
import { toast } from 'sonner';
import { BACKGROUNDS, CATEGORIES, BASE_DOG, WRAPPER, type Asset } from '@/data/assets';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Standard color presets
const PRESET_COLORS = [
  { name: 'White', value: '#FFFFFF' },
  { name: 'Black', value: '#000000' },
  { name: 'Red', value: '#FF0000' },
  { name: 'Blue', value: '#0066FF' },
  { name: 'Green', value: '#00FF00' },
  { name: 'Yellow', value: '#FFFF00' },
  { name: 'Purple', value: '#9900FF' },
  { name: 'Pink', value: '#FF69B4' },
];

// Text functionality interfaces
interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  isDragging: boolean;
  rotation: number; // Rotation in degrees
  scale: number; // Scale factor
  assetId?: string; // Associated asset ID for hat/eye text
}

// Asset-specific text configuration
interface AssetTextConfig {
  assetId: string;
  name: string;
  defaultText: string;
  defaultPosition: { x: number; y: number };
  defaultFontSize: number;
  maxLength: number;
  category: 'hats' | 'eyes';
}

interface PresetPosition {
  name: string;
  x: number;
  y: number;
  fontSize: number;
}

// Preset fonts
const FONTS = [
  { name: 'Arial', value: 'Arial' },
  { name: 'Comic Sans MS', value: 'Comic Sans MS' },
  { name: 'Impact', value: 'Impact' },
  { name: 'Verdana', value: 'Verdana' },
  { name: 'Times New Roman', value: 'Times New Roman' }
];

// Asset-specific text configurations
const ASSET_TEXT_CONFIGS: AssetTextConfig[] = [
  // Hat configurations - Adjust these positions as needed
  { assetId: 'hat-2', name: 'Hat 2', defaultText: 'TEXT', defaultPosition: { x: 256, y: 160 }, defaultFontSize: 24, maxLength: 20, category: 'hats' },
  { assetId: 'hat-9', name: 'Hat 9', defaultText: 'TEXT', defaultPosition: { x: 256, y: 170 }, defaultFontSize: 20, maxLength: 15, category: 'hats' },
  { assetId: 'hat-16', name: 'Hat 16', defaultText: 'TEXT', defaultPosition: { x: 256, y: 180 }, defaultFontSize: 22, maxLength: 18, category: 'hats' },
  { assetId: 'hat-18', name: 'Hat 18', defaultText: 'TEXT', defaultPosition: { x: 256, y: 165 }, defaultFontSize: 26, maxLength: 12, category: 'hats' },
  { assetId: 'hat-21', name: 'Hat 21', defaultText: 'TEXT', defaultPosition: { x: 256, y: 175 }, defaultFontSize: 24, maxLength: 16, category: 'hats' },
  { assetId: 'hat-22', name: 'Hat 22', defaultText: 'TEXT', defaultPosition: { x: 256, y: 170 }, defaultFontSize: 28, maxLength: 10, category: 'hats' },
  { assetId: 'hat-25', name: 'Hat 25', defaultText: 'TEXT', defaultPosition: { x: 256, y: 165 }, defaultFontSize: 26, maxLength: 14, category: 'hats' },
  { assetId: 'hat-26', name: 'Hat 26', defaultText: 'TEXT', defaultPosition: { x: 256, y: 180 }, defaultFontSize: 22, maxLength: 18, category: 'hats' },
  { assetId: 'hat-27', name: 'Hat 27', defaultText: 'TEXT', defaultPosition: { x: 256, y: 175 }, defaultFontSize: 24, maxLength: 16, category: 'hats' },
  { assetId: 'hat-28', name: 'Hat 28', defaultText: 'TEXT', defaultPosition: { x: 256, y: 170 }, defaultFontSize: 26, maxLength: 14, category: 'hats' },
  { assetId: 'hat-29', name: 'Hat 29', defaultText: 'TEXT', defaultPosition: { x: 256, y: 165 }, defaultFontSize: 28, maxLength: 12, category: 'hats' },
  { assetId: 'hat-30', name: 'Hat 30', defaultText: 'TEXT', defaultPosition: { x: 256, y: 180 }, defaultFontSize: 22, maxLength: 18, category: 'hats' },
  { assetId: 'hat-31', name: 'Hat 31', defaultText: 'TEXT', defaultPosition: { x: 256, y: 175 }, defaultFontSize: 24, maxLength: 16, category: 'hats' },
  { assetId: 'hat-32', name: 'Hat 32', defaultText: 'TEXT', defaultPosition: { x: 256, y: 170 }, defaultFontSize: 26, maxLength: 14, category: 'hats' },
  { assetId: 'hat-34', name: 'Hat 34', defaultText: 'TEXT', defaultPosition: { x: 256, y: 165 }, defaultFontSize: 28, maxLength: 12, category: 'hats' },
  { assetId: 'hat-36', name: 'Hat 36', defaultText: 'TEXT', defaultPosition: { x: 256, y: 180 }, defaultFontSize: 22, maxLength: 18, category: 'hats' },
  
  // Eye configurations - Only Eyes 4, 12, and 14 should have text support
  // Note: UI shows "Eyes 4" but asset ID is 'eyes-5', UI shows "Eyes 12" but asset ID is 'eyes-16', etc.
  { assetId: 'eyes-5', name: 'Eyes 4', defaultText: 'TEXT', defaultPosition: { x: 256, y: 240 }, defaultFontSize: 18, maxLength: 25, category: 'eyes' },
  { assetId: 'eyes-16', name: 'Eyes 12', defaultText: 'TEXT', defaultPosition: { x: 256, y: 245 }, defaultFontSize: 16, maxLength: 30, category: 'eyes' },
  { assetId: 'eyes-19', name: 'Eyes 14', defaultText: 'TEXT', defaultPosition: { x: 256, y: 235 }, defaultFontSize: 20, maxLength: 22, category: 'eyes' },
];

// Preset positions
const PRESET_POSITIONS: PresetPosition[] = [
  { name: 'Top Center', x: 256, y: 50, fontSize: 36 },
  { name: 'Bottom Center', x: 256, y: 462, fontSize: 36 },
  { name: 'Center', x: 256, y: 256, fontSize: 48 },
  { name: 'Top Left', x: 50, y: 50, fontSize: 24 },
  { name: 'Top Right', x: 462, y: 50, fontSize: 24 },
  { name: 'Bottom Left', x: 50, y: 462, fontSize: 24 },
  { name: 'Bottom Right', x: 462, y: 462, fontSize: 24 }
];

interface BodyReference {
  x: number;
  y: number;
  scale: number;
}

interface BodyGuide {
  head: BodyReference;
  eyes: BodyReference;
  nose: BodyReference;
  neck: BodyReference;
  chest: BodyReference;
  body: BodyReference;
}

interface PFPGeneratorProps {
  onBack?: () => void;
}

interface Coordinates {
  x: number;
  y: number;
}

interface ControlPoint {
  x: number;
  y: number;
  cursor: string;
  action: 'rotate' | 'scale';
}

export const PFPGenerator: React.FC<PFPGeneratorProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedBackground, setSelectedBackground] = useState<Asset>(BACKGROUNDS[0]);
  const [selectedAssets, setSelectedAssets] = useState<Record<string, Asset>>({});
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);
  const [mousePos, setMousePos] = useState<Coordinates>({ x: 0, y: 0 });
  const [canvasScale, setCanvasScale] = useState(1);

  // Text functionality state
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [activeTextId, setActiveTextId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotationStart, setRotationStart] = useState(0);
  const [scaleStart, setScaleStart] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [isScaling, setIsScaling] = useState(false);
  const [activeControl, setActiveControl] = useState<'rotate' | 'scale' | null>(null);
  const [startAngle, setStartAngle] = useState(0);
  const [startScale, setStartScale] = useState(1);

  // Asset-specific text state
  const [assetTextElements, setAssetTextElements] = useState<TextElement[]>([]);
  const [activeAssetTextId, setActiveAssetTextId] = useState<string | null>(null);

  // Sign controls state
  const [signPosition, setSignPosition] = useState({ x: 0, y: -150 });
  const [signScale, setSignScale] = useState(1.0);

  // Custom background upload state
  const [customBackgrounds, setCustomBackgrounds] = useState<Asset[]>([]);
  const [uploadedBackgrounds, setUploadedBackgrounds] = useState<Asset[]>([]);
  
  // Background selection confirmation state
  const [showBackgroundConfirmDialog, setShowBackgroundConfirmDialog] = useState(false);
  const [pendingBackgroundSelection, setPendingBackgroundSelection] = useState<Asset | null>(null);
  const [hasUploadedBackgroundSelected, setHasUploadedBackgroundSelected] = useState(false);


  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map<string, HTMLImageElement>());

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      if (imageCache.current.has(src)) {
        resolve(imageCache.current.get(src)!);
        return;
      }

      const img = document.createElement('img');
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        imageCache.current.set(src, img);
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
  };


  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isTestMode || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    

    const x = Math.round((event.clientX - rect.left) * scaleX);
    const y = Math.round((event.clientY - rect.top) * scaleY);
    

    const centerX = Math.round(x - canvas.width / 2);
    const centerY = Math.round(y - canvas.height / 2);
    
    setMousePos({ x: centerX, y: centerY });
  };

  // Calculate angle between two points
  const getAngle = (cx: number, cy: number, ex: number, ey: number) => {
    const dy = ey - cy;
    const dx = ex - cx;
    const theta = Math.atan2(dy, dx);
    return theta * 180 / Math.PI;
  };

  // Calculate distance between two points
  const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  // Update handleCanvasMouseDown to remove rectangle
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !activeTextId) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const activeText = textElements.find(t => t.id === activeTextId);
    if (!activeText) return;

    // Calculate text bounds without drawing them
    ctx.save();
    ctx.font = `${activeText.fontSize * (activeText.scale || 1)}px ${activeText.fontFamily}`;
    const metrics = ctx.measureText(activeText.text);
    const height = activeText.fontSize * (activeText.scale || 1);
    
    // Transform mouse position to text coordinate system
    const dx = mouseX - activeText.x;
    const dy = mouseY - activeText.y;
    const angle = -(activeText.rotation || 0) * Math.PI / 180;
    const rotatedX = dx * Math.cos(angle) - dy * Math.sin(angle);
    const rotatedY = dx * Math.sin(angle) + dy * Math.cos(angle);

    // Check if click is within text bounds
    const bounds = {
      left: -metrics.width/2,
      right: metrics.width/2,
      top: -height/2,
      bottom: height/2
    };

    ctx.restore();

    if (
      rotatedX >= bounds.left &&
      rotatedX <= bounds.right &&
      rotatedY >= bounds.top &&
      rotatedY <= bounds.bottom
    ) {
      setIsDragging(true);
      setDragStart({ x: mouseX, y: mouseY });
    } else {
      setActiveTextId(null);
    }
  };

  // Update handleCanvasMouseMove
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !activeTextId) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const activeText = textElements.find(t => t.id === activeTextId);
    if (!activeText) return;

    if (activeControl === 'rotate') {
      const angle = getAngle(activeText.x, activeText.y, mouseX, mouseY) - startAngle;
      updateText(activeTextId, { rotation: angle });
    } else if (activeControl === 'scale') {
      const distance = getDistance(activeText.x, activeText.y, mouseX, mouseY);
      const baseDistance = getDistance(activeText.x, activeText.y, dragStart.x, dragStart.y);
      const newScale = Math.max(0.5, Math.min(2, startScale * (distance / baseDistance)));
      updateText(activeTextId, { scale: newScale });
    } else if (isDragging) {
      const deltaX = mouseX - dragStart.x;
      const deltaY = mouseY - dragStart.y;
      updateText(activeTextId, {
        x: activeText.x + deltaX,
        y: activeText.y + deltaY
      });
      setDragStart({ x: mouseX, y: mouseY });
    }

    // Update cursor based on what we're hovering over
    const controlPoints: ControlPoint[] = [
      { 
        x: activeText.x, 
        y: activeText.y - activeText.fontSize - 30,
        cursor: 'grab',
        action: 'rotate'
      },
      {
        x: activeText.x + ctx.measureText(activeText.text).width/2 + 20,
        y: activeText.y,
        cursor: 'ew-resize',
        action: 'scale'
      }
    ];

    let cursor = 'default';
    for (const point of controlPoints) {
      const distance = getDistance(mouseX, mouseY, point.x, point.y);
      if (distance < 10) {
        cursor = point.cursor;
        break;
      }
    }
    canvas.style.cursor = cursor;
  };

  // Update handleCanvasMouseUp
  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    setActiveControl(null);
    setStartAngle(0);
    setStartScale(1);
  };

  // Handle mouse click on canvas to find and activate text
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Check if click hits any text
    textElements.forEach(text => {
      ctx.font = `${text.fontSize * text.scale}px ${text.fontFamily}`;
      const metrics = ctx.measureText(text.text);
      const height = text.fontSize * text.scale;

      // Calculate text bounds with rotation
      const bounds = {
        left: text.x - (metrics.width / 2),
        right: text.x + (metrics.width / 2),
        top: text.y - (height / 2),
        bottom: text.y + (height / 2)
      };

      // Check if click is within text bounds
      if (x >= bounds.left && x <= bounds.right && 
          y >= bounds.top && y <= bounds.bottom) {
        setActiveTextId(text.id);
      }
    });
  };

  // Handle rotation and scaling with keyboard when text is active
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!activeTextId) return;

    const text = textElements.find(t => t.id === activeTextId);
    if (!text) return;

    switch (e.key) {
      case 'r':
        // Rotate with R + arrow keys
        if (e.shiftKey) {
          setIsRotating(true);
          setRotationStart(text.rotation);
        }
        break;
      case 's':
        // Scale with S + arrow keys
        if (e.shiftKey) {
          setIsScaling(true);
          setScaleStart(text.scale);
        }
        break;
      case 'ArrowLeft':
        if (isRotating) {
          updateText(activeTextId, { rotation: text.rotation - 5 });
        } else if (isScaling) {
          updateText(activeTextId, { scale: Math.max(0.5, text.scale - 0.1) });
        }
        break;
      case 'ArrowRight':
        if (isRotating) {
          updateText(activeTextId, { rotation: text.rotation + 5 });
        } else if (isScaling) {
          updateText(activeTextId, { scale: Math.min(2, text.scale + 0.1) });
        }
        break;
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'r') setIsRotating(false);
    if (e.key === 's') setIsScaling(false);
  };

  // Add keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeTextId, isRotating, isScaling]);

  // Update canvas scale on resize
  useEffect(() => {
    const updateCanvasScale = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        setCanvasScale(canvas.width / rect.width);
      }
    };

    updateCanvasScale();
    window.addEventListener('resize', updateCanvasScale);
    return () => window.removeEventListener('resize', updateCanvasScale);
  }, []);

  // Update selectedAssets when position or scale changes
  useEffect(() => {
    if (selectedAssets.signs) {
      setSelectedAssets(prev => ({
        ...prev,
        signs: {
          ...prev.signs,
          position: signPosition,
          scale: signScale
        }
      }));
    }
  }, [signPosition, signScale]);

  // Add handleSignPosition function
  const handleSignPosition = (position: string) => {
    switch (position) {
      case 'top-center':
        setSignPosition({ x: 0, y: -200 });
        break;
      case 'bottom-center':
        setSignPosition({ x: 0, y: 200 });
        break;
      case 'center':
        setSignPosition({ x: 0, y: 0 });
        break;
      case 'top-left':
        setSignPosition({ x: -150, y: -150 });
        break;
      case 'top-right':
        setSignPosition({ x: 150, y: -150 });
        break;
      case 'bottom-left':
        setSignPosition({ x: -150, y: 150 });
        break;
      case 'bottom-right':
        setSignPosition({ x: 150, y: 150 });
        break;
    }
  };

  const renderCanvas = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
    
      ctx.clearRect(0, 0, canvas.width, canvas.height);

  
      const canvasCenter = canvas.width / 2;
      const dogBaseSize = Math.min(canvas.width, canvas.height);
      const dogScale = 1.0;
      const dogSize = dogBaseSize * dogScale;
      const dogX = canvasCenter - (dogSize / 2);
      const dogY = 0;

  
      const bgImg = await loadImage(selectedBackground.src);
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

  
      const dogImg = await loadImage(BASE_DOG.src);
      ctx.drawImage(dogImg, dogX, dogY, dogSize, dogSize);

      // Check if selected hat should hide the wrapper
      // These specific hats are designed to work without the wrapper overlay
      const selectedHat = selectedAssets['hats'];
      const hatsThatHideWrapper = ['hat-2', 'hat-3', 'hat-5', 'hat-16', 'hat-21', 'hat-22', 'hat-25', 'hat-26', 'hat-29', 'hat-31', 'hat-27', 'hat-30', 'hat-32', 'hat-36'];
      const shouldHideWrapper = selectedHat && hatsThatHideWrapper.includes(selectedHat.id);

      // Only draw wrapper if it shouldn't be hidden
      if (!shouldHideWrapper) {
        const wrapperImg = await loadImage(WRAPPER.src);
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(wrapperImg, dogX, dogY, dogSize, dogSize);
      }

  
      const layerOrder = ['clothes', 'items', 'eyes', 'sunglasses', 'hats', 'signs', 'signs2'];
      
      for (const category of layerOrder) {
        const asset = selectedAssets[category];
        if (!asset) continue;

        // If it's a sign, use renderFunction with position and scale
        if (category === 'signs' && asset.renderFunction) {
          const x = asset.position?.x || 0;
          const y = asset.position?.y || 0;
          const scale = asset.scale || 1;
          asset.renderFunction(ctx, x, y, scale);
          continue;
        }

        // Handle Signs 2 (image-based signs)
        if (category === 'signs2') {
          const assetImg = await loadImage(asset.src);
          const scale = asset.scale || 0.4; // Reduce size further
          const assetSize = dogSize * scale;
          
          let assetX = dogX + (dogSize / 2);
          let assetY = dogY + (dogSize / 2);


          if (asset.position) {
            assetX += asset.position.x * (dogSize / 512);
            assetY += asset.position.y * (dogSize / 512);
          }


          assetX -= assetSize / 2;

          // Set composite operation to handle transparency correctly
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = 1.0;
          
          // Draw sign with transparency and handle white background
          ctx.drawImage(assetImg, assetX, assetY, assetSize, assetSize);
          console.log(`Signs2 rendered at:`, { x: assetX, y: assetY, size: assetSize });
          continue;
        }

        console.log(`Rendering ${category}:`, asset);

        const assetImg = await loadImage(asset.src);
        const scale = asset.scale || 1;
        const assetSize = dogSize * scale;
        
        let assetX = dogX + (dogSize / 2);
        let assetY = dogY + (dogSize / 2);

        // Adjust position for each category
        switch (category) {
          case 'clothes':
            // Clothes should cover the entire dog, so we don't center them
            assetX = dogX;
            assetY = dogY;
            ctx.globalCompositeOperation = 'source-over';
            break;
            
          case 'items': // Accessories
            // Position accessories using asset.position or default
            if (asset.position) {
              assetX = dogX + (dogSize / 2) + (asset.position.x * (dogSize / 512));
              assetY = dogY + (dogSize / 2) + (asset.position.y * (dogSize / 512));
            } else {
              // Default position if none specified
              assetX = dogX + (dogSize * 0.5);
              assetY = dogY + (dogSize * 0.10);
            }
            ctx.globalCompositeOperation = 'source-over';
            
            // Use asset.scale instead of hardcoded accessoryScale
            const accessorySize = dogSize * scale; // Use the scale from asset data
            
            // Center the accessory
            const accessoryX = assetX - (accessorySize / 2);
            
            ctx.drawImage(assetImg, accessoryX, assetY, accessorySize, accessorySize);
            console.log('Accessory rendered at:', { x: accessoryX, y: assetY, size: accessorySize, scale: scale });
            continue;
            
          case 'eyes':
            assetY = dogY + (dogSize * 0.45);
            ctx.globalCompositeOperation = 'source-over';
            break;
            
          case 'hats':
            assetY = dogY + (dogSize * 0.2);
            ctx.globalCompositeOperation = 'source-over';
            break;
            
          case 'sunglasses':
            assetY = dogY + (dogSize * 0.45);
            ctx.globalCompositeOperation = 'source-over';
            break;
        }


        if (asset.position) {
          assetX += asset.position.x * (dogSize / 512);
          assetY += asset.position.y * (dogSize / 512);
        }


        if (category !== 'clothes') {
          assetX -= assetSize / 2;
        }

        ctx.globalAlpha = 1.0;
        

        if (category === 'clothes') {
          ctx.drawImage(assetImg, assetX, assetY, assetSize, assetSize);
          console.log(`${category} rendered at:`, { x: assetX, y: assetY, size: assetSize });
        } else {
          ctx.drawImage(assetImg, assetX, assetY, assetSize, assetSize);
          console.log(`${category} rendered at:`, { x: assetX, y: assetY, size: assetSize });
        }
      }


      // Draw regular text elements
      textElements.forEach(text => {
        if (!ctx || !text.text.trim()) return;
        
        ctx.save();
        ctx.translate(text.x, text.y);
        ctx.rotate((text.rotation || 0) * Math.PI / 180);
        ctx.scale(text.scale || 1, text.scale || 1);
        
        ctx.font = `${text.fontSize}px ${text.fontFamily}`;
        ctx.fillStyle = text.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text.text, 0, 0);
        
        ctx.restore();
      });

      // Draw asset-specific text elements
      assetTextElements.forEach(text => {
        if (!ctx || !text.text.trim()) return;
        
        ctx.save();
        ctx.translate(text.x, text.y);
        ctx.rotate((text.rotation || 0) * Math.PI / 180);
        ctx.scale(text.scale || 1, text.scale || 1);
        
        ctx.font = `${text.fontSize}px ${text.fontFamily}`;
        ctx.fillStyle = text.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text.text, 0, 0);
        
        ctx.restore();
      });


      if (isTestMode) {

        ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.lineWidth = 1;
        

        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();
        

        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();


        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 0.5;
        

        for (let x = 0; x <= canvas.width; x += 50) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        

        for (let y = 0; y <= canvas.height; y += 50) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      }

    } catch (error) {
      console.error('Error rendering canvas:', error);
      toast.error('Failed to render image');
    }
  };

  const toggleAsset = (category: string, asset: Asset) => {
    setSelectedAssets(prev => {
      const newAssets = { ...prev };
      if (prev[category]?.id === asset.id) {
        delete newAssets[category];
        // Remove asset text when asset is deselected
        if (category === 'hats' || category === 'eyes') {
          removeAssetText(prev[category]!.id);
        }
      } else {
        newAssets[category] = asset;
      }
      return newAssets;
    });
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsGenerating(true);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'wdog-pfp.png';
        a.click();
        URL.revokeObjectURL(url);
        toast.success('🎉 Your wDOG PFP is ready!');
      }
      setIsGenerating(false);
    }, 'image/png');
  };

  const randomize = () => {
    const randomBg = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
    setSelectedBackground(randomBg);
    
    const newAssets: Record<string, Asset> = {};
    CATEGORIES.forEach(category => {
      if (Math.random() > 0.5 && category.items.length > 0) {
        const randomAsset = category.items[Math.floor(Math.random() * category.items.length)];
        newAssets[category.id] = randomAsset;
      }
    });
    setSelectedAssets(newAssets);
    toast.success('✨ Randomized your wDOG!');
  };

  // Function to add new text
  const addNewText = (preset?: PresetPosition) => {
    const newId = `text-${Date.now()}`;
    const newText: TextElement = {
      id: newId,
      text: '', // Empty text as default instead of 'Double click to edit'
      x: preset?.x ?? 256,
      y: preset?.y ?? 256,
      fontSize: preset?.fontSize ?? 36,
      fontFamily: 'Arial',
      color: '#ffffff',
      isDragging: false,
      rotation: 0,
      scale: 1
    };
    setTextElements(prev => [...prev, newText]);
    setActiveTextId(newId);
  };

  // Function to update text
  const updateText = (id: string, updates: Partial<TextElement>) => {
    setTextElements(prev => 
      prev.map(text => 
        text.id === id ? { ...text, ...updates } : text
      )
    );
  };

  // Function to add asset-specific text
  const addAssetText = (assetId: string) => {
    const config = ASSET_TEXT_CONFIGS.find(c => c.assetId === assetId);
    if (!config) return;

    const newId = `asset-text-${Date.now()}`;
    const newText: TextElement = {
      id: newId,
      text: config.defaultText,
      x: config.defaultPosition.x,
      y: config.defaultPosition.y,
      fontSize: config.defaultFontSize,
      fontFamily: 'Arial',
      color: '#ffffff',
      isDragging: false,
      rotation: 0,
      scale: 1,
      assetId: assetId
    };
    setAssetTextElements(prev => [...prev, newText]);
    setActiveAssetTextId(newId);
  };

  // Function to update asset text
  const updateAssetText = (id: string, updates: Partial<TextElement>) => {
    setAssetTextElements(prev => 
      prev.map(text => 
        text.id === id ? { ...text, ...updates } : text
      )
    );
  };

  // Function to remove asset text
  const removeAssetText = (assetId: string) => {
    setAssetTextElements(prev => prev.filter(text => text.assetId !== assetId));
    if (activeAssetTextId && assetTextElements.find(t => t.id === activeAssetTextId)?.assetId === assetId) {
      setActiveAssetTextId(null);
    }
  };

  // Check if selected asset supports text
  const getSelectedAssetTextConfig = () => {
    const selectedHat = selectedAssets['hats'];
    const selectedEyes = selectedAssets['eyes'];
    
    if (selectedHat) {
      return ASSET_TEXT_CONFIGS.find(c => c.assetId === selectedHat.id && c.category === 'hats');
    }
    if (selectedEyes) {
      return ASSET_TEXT_CONFIGS.find(c => c.assetId === selectedEyes.id && c.category === 'eyes');
    }
    return null;
  };

  // Get current asset text element
  const getCurrentAssetText = () => {
    const selectedHat = selectedAssets['hats'];
    const selectedEyes = selectedAssets['eyes'];
    
    if (selectedHat) {
      return assetTextElements.find(t => t.assetId === selectedHat.id);
    }
    if (selectedEyes) {
      return assetTextElements.find(t => t.assetId === selectedEyes.id);
    }
    return null;
  };

  // Update resetCustomization function to include text
  const resetCustomization = () => {
    setSelectedBackground(BACKGROUNDS[0]);
    setSelectedAssets({});
    setActiveCategory(CATEGORIES[0].id);
    setTextElements([]); // Reset all texts
    setActiveTextId(null);
    setAssetTextElements([]); // Reset asset texts
    setActiveAssetTextId(null);
    setUploadedBackgrounds([]); // Clear custom backgrounds
    setCustomBackgrounds([]); // Clear custom backgrounds
    setHasUploadedBackgroundSelected(false); // Reset uploaded background state
    toast.success('🔄 Reset to default settings');
  };

  // Handle background upload functionality
  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('🔍 handleBackgroundUpload triggered');
    const files = event.target.files;
    console.log('📁 Files selected:', files);
    
    if (!files || files.length === 0) {
      console.log('❌ No files selected');
      return;
    }

    // First, filter valid files
    const validFiles = Array.from(files).filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024;
      
      if (!isValidType) {
        console.log(`❌ Invalid file type: ${file.type}`);
        toast.error(`❌ ${file.name} is not a valid image file`);
        return false;
      }
      
      if (!isValidSize) {
        console.log(`❌ File too large: ${file.size} bytes`);
        toast.error(`❌ ${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      
      console.log(`✅ File validation passed for: ${file.name}`);
      return true;
    });

    console.log(`📊 Valid files to process: ${validFiles.length}`);

    if (validFiles.length === 0) {
      console.log(`❌ No valid files to process`);
      return;
    }

    let processedCount = 0;
    const newBackgrounds: Asset[] = [];

    validFiles.forEach((file, index) => {
      console.log(`📄 Processing file ${index + 1}:`, file.name, file.type, file.size);

      const reader = new FileReader();
      reader.onload = (e) => {
        console.log(`📖 FileReader completed for: ${file.name}`);
        const result = e.target?.result as string;
        if (result) {
          console.log(`✅ Creating new background asset for: ${file.name}`);
          const newBackground: Asset = {
            id: `custom-bg-${Date.now()}-${index}`,
            name: `Custom Background ${uploadedBackgrounds.length + newBackgrounds.length + 1}`,
            src: result,
            thumbnail: result
          };
          
          newBackgrounds.push(newBackground);
          processedCount++;
          console.log(`📦 Added to newBackgrounds array. Total: ${newBackgrounds.length}, Processed: ${processedCount}/${validFiles.length}`);
          
          // Update state when all files are processed
          if (processedCount === validFiles.length) {
            console.log(`🎉 All files processed! Updating state...`);
            setUploadedBackgrounds(prev => {
              console.log(`📤 Setting uploadedBackgrounds. Previous: ${prev.length}, Adding: ${newBackgrounds.length}`);
              return [...prev, ...newBackgrounds];
            });
            setCustomBackgrounds(prev => {
              console.log(`📤 Setting customBackgrounds. Previous: ${prev.length}, Adding: ${newBackgrounds.length}`);
              return [...prev, ...newBackgrounds];
            });
            
            // Automatically select the first uploaded background
            if (newBackgrounds.length > 0) {
              console.log(`🎯 Auto-selecting first uploaded background: ${newBackgrounds[0].name}`);
              setSelectedBackground(newBackgrounds[0]);
              setHasUploadedBackgroundSelected(true);
              toast.success(`✅ Successfully uploaded and selected background: ${newBackgrounds[0].name}`);
            } else {
              console.log(`📝 No valid backgrounds to select`);
              toast.success(`✅ Successfully uploaded ${newBackgrounds.length} background(s)`);
            }
          }
        } else {
          console.log(`❌ FileReader result is null for: ${file.name}`);
        }
      };
      
      reader.onerror = (error) => {
        console.log(`❌ FileReader error for ${file.name}:`, error);
      };
      
      console.log(`📖 Starting FileReader for: ${file.name}`);
      reader.readAsDataURL(file);
    });

    // Reset the input
    event.target.value = '';
    console.log('🔄 Input value reset');
  };

  // Handle background selection with confirmation for uploaded backgrounds
  const handleBackgroundSelection = (background: Asset) => {
    // Check if current background is uploaded and new background is different
    const isCurrentUploaded = uploadedBackgrounds.some(bg => bg.id === selectedBackground.id);
    const isNewUploaded = uploadedBackgrounds.some(bg => bg.id === background.id);
    
    // If switching from uploaded background to a different background, show confirmation
    if (isCurrentUploaded && !isNewUploaded && selectedBackground.id !== background.id) {
      setPendingBackgroundSelection(background);
      setShowBackgroundConfirmDialog(true);
    } else {
      // Direct selection without confirmation
      setSelectedBackground(background);
      setHasUploadedBackgroundSelected(isNewUploaded);
    }
  };

  // Confirm background selection and clear uploaded background
  const confirmBackgroundSelection = () => {
    if (pendingBackgroundSelection) {
      setSelectedBackground(pendingBackgroundSelection);
      setHasUploadedBackgroundSelected(false);
      setPendingBackgroundSelection(null);
      setShowBackgroundConfirmDialog(false);
      toast.success('✅ Background changed successfully');
    }
  };

  // Cancel background selection
  const cancelBackgroundSelection = () => {
    setPendingBackgroundSelection(null);
    setShowBackgroundConfirmDialog(false);
  };

  // Update position for active text or create new if none is active
  const applyPresetPosition = (preset: PresetPosition) => {
    if (activeTextId) {
      // Update position of active text
      updateText(activeTextId, {
        x: preset.x,
        y: preset.y,
        fontSize: preset.fontSize
      });
      toast.success('✨ Text position updated');
    } else if (textElements.length > 0) {
      // If there's text but none is active, activate the first one and update it
      const firstText = textElements[0];
      setActiveTextId(firstText.id);
      updateText(firstText.id, {
        x: preset.x,
        y: preset.y,
        fontSize: preset.fontSize
      });
      toast.success('✨ Text position updated');
    } else {
      // If no text exists, create new
      addNewText(preset);
      toast.success('✨ New text added');
    }
  };


  useEffect(() => {
    renderCanvas();
  }, [selectedBackground, selectedAssets, isTestMode, textElements, assetTextElements, hasUploadedBackgroundSelected]);

  const activeItems = CATEGORIES.find(c => c.id === activeCategory)?.items || [];

  return (
    <div className="min-h-screen bg-gradient-background p-2 sm:p-4">
      <div className="max-w-6xl mx-auto relative">
        {/* Social Icons */}
        <div className="absolute top-0 right-0 flex gap-2 sm:gap-4 p-2 sm:p-4">
          <Button
            variant="ghost"
            size="icon"
            className="bg-black hover:bg-gray-800 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10"
            onClick={() => window.open('https://t.co/GurmgVXpiR', '_blank')}
          >
            <XIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-[#FF8C00] hover:bg-[#FF8C00]/90 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10"
            onClick={() => window.open('https://dexscreener.com/solana/25txtutlkjtcux3kqoervc7aubym7fckbwovqnqnydgq', '_blank')}
          >
            <LineChart className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-4 sm:mb-8 pt-8 sm:pt-16">
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-2 sm:mb-4">
            {onBack && (
              <Button
                variant="outline"
                onClick={onBack}
                className="mb-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              wDOG PFP Generator
            </h1>
          </div>
          <p className="text-muted-foreground text-base sm:text-lg px-4">
            Create the perfect profile picture with our legendary net-wearing dog! 🐕‍🦺
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Left Column: Canvas Preview and Text Editor */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Canvas Preview */}
            <Card className="p-3 sm:p-6 bg-gradient-card border-border/50 shadow-card">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2 sm:gap-0">
                <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Preview
                </h2>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetCustomization}
                    className="hover:border-destructive/50"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                  <Button
                    variant={isTestMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setIsTestMode(!isTestMode);
                      renderCanvas();
                    }}
                    className={`${isTestMode ? "bg-gradient-accent" : ""} hidden`} // Hidden from user but available for debug
                  >
                    <Crosshair className="w-4 h-4 mr-2" />
                    {isTestMode ? "Exit Test" : "Test"}
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={randomize}
                    className="bg-gradient-accent hover:shadow-glow-accent transition-all duration-300"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    Random
                  </Button>
                  <Button 
                    size="sm"
                    onClick={downloadImage}
                    disabled={isGenerating}
                    className="bg-gradient-primary hover:shadow-glow-primary transition-all duration-300"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isGenerating ? 'Wait...' : 'Download'}
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-center">
                <div className="relative w-full max-w-[512px]">
                  <canvas
                    ref={canvasRef}
                    width={512}
                    height={512}
                    className="w-full h-auto rounded-xl"
                    onMouseMove={handleMouseMove}
                    onMouseDown={handleCanvasMouseDown}
                    onMouseUp={handleCanvasMouseUp}
                    onClick={handleCanvasClick}
                  />
                  {isTestMode && (
                    <div className="absolute top-2 left-2 bg-black/80 text-white p-2 rounded text-sm font-mono">
                      X: {mousePos.x}, Y: {mousePos.y}
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Text Editor */}
            <Card className="p-3 sm:p-6 bg-gradient-card border-border/50 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
                  <Type className="w-4 h-4 sm:w-5 sm:h-5" />
                  Text Editor
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addNewText()}
                  className="hover:border-primary/50"
                >
                  Add Text
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
                {PRESET_POSITIONS.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    size="sm"
                    onClick={() => applyPresetPosition(preset)}
                    className={`text-xs ${
                      textElements.some(text => 
                        text.id === activeTextId && 
                        text.x === preset.x && 
                        text.y === preset.y
                      ) ? 'border-primary bg-primary/10' : ''
                    }`}
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>

              {/* Sign Controls - Only show when a sign is selected */}
              {selectedAssets.signs && (
                <div className="mt-6 border-t border-border/50 pt-4">
                  <h4 className="text-sm font-semibold mb-3">Sign Position & Size</h4>
                  
                  {/* Position Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSignPosition('top-center')}
                      className="text-xs"
                    >
                      Top Center
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSignPosition('bottom-center')}
                      className="text-xs"
                    >
                      Bottom Center
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSignPosition('center')}
                      className="text-xs"
                    >
                      Center
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSignPosition('top-left')}
                      className="text-xs"
                    >
                      Top Left
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSignPosition('top-right')}
                      className="text-xs"
                    >
                      Top Right
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSignPosition('bottom-left')}
                      className="text-xs"
                    >
                      Bottom Left
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSignPosition('bottom-right')}
                      className="text-xs"
                    >
                      Bottom Right
                    </Button>
                  </div>

                  {/* Size Slider */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span>Sign Size</span>
                      <span className="text-muted-foreground">
                        {Math.round(signScale * 100)}%
                      </span>
                    </div>
                    <Slider
                      value={[signScale * 100]}
                      min={50}
                      max={150}
                      step={5}
                      onValueChange={([value]) => setSignScale(value / 100)}
                      className="py-0.5"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {textElements.map((text) => (
                  <Card
                    key={text.id}
                    className={`p-3 sm:p-4 ${
                      activeTextId === text.id ? 'border-primary' : 'border-border/50'
                    }`}
                    onClick={() => setActiveTextId(text.id)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Move className="w-4 h-4 cursor-move" />
                        <Input
                          value={text.text}
                          onChange={(e) => updateText(text.id, { text: e.target.value })}
                          className="flex-1 text-sm"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setTextElements(prev => prev.filter(t => t.id !== text.id));
                            if (activeTextId === text.id) setActiveTextId(null);
                          }}
                          className="text-destructive hover:text-destructive/90"
                        >
                          ×
                        </Button>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <Select
                          value={text.fontFamily}
                          onValueChange={(value) => updateText(text.id, { fontFamily: value })}
                        >
                          <SelectTrigger className="flex-1 text-sm">
                            <SelectValue placeholder="Font" />
                          </SelectTrigger>
                          <SelectContent>
                            {FONTS.map((font) => (
                              <SelectItem
                                key={font.value}
                                value={font.value}
                                style={{ fontFamily: font.value }}
                              >
                                {font.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Color Selection */}
                        <div className="space-y-1 sm:space-y-2">
                          <span className="text-xs sm:text-sm">Color</span>
                          <div className="flex flex-wrap gap-1 sm:gap-2 mb-1 sm:mb-2">
                            {PRESET_COLORS.map((color) => (
                              <button
                                key={color.value}
                                onClick={() => updateText(text.id, { color: color.value })}
                                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 ${
                                  text.color === color.value ? 'border-primary' : 'border-transparent'
                                }`}
                                style={{ backgroundColor: color.value }}
                                title={color.name}
                              />
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm">Custom</span>
                            <input
                              type="color"
                              value={text.color}
                              onChange={(e) => updateText(text.id, { color: e.target.value })}
                              className="w-6 h-6 sm:w-8 sm:h-8 rounded cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span>Font Size</span>
                          <span className="text-muted-foreground">
                            {text.fontSize}px
                          </span>
                        </div>
                        <Slider
                          value={[text.fontSize]}
                          min={12}
                          max={72}
                          step={1}
                          onValueChange={([value]) => updateText(text.id, { fontSize: value })}
                          className="py-0.5"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Asset-Specific Text Editor */}
            {getSelectedAssetTextConfig() && (
              <Card className="p-3 sm:p-6 bg-gradient-card border-border/50 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
                    <Type className="w-4 h-4 sm:w-5 sm:h-5" />
                    {getSelectedAssetTextConfig()?.name} Text Editor
                  </h3>
                  <div className="flex gap-2">
                    {!getCurrentAssetText() && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addAssetText(getSelectedAssetTextConfig()!.assetId)}
                        className="hover:border-primary/50"
                      >
                        Add Text
                      </Button>
                    )}
                    {getCurrentAssetText() && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeAssetText(getSelectedAssetTextConfig()!.assetId)}
                        className="hover:border-destructive/50 text-destructive"
                      >
                        Remove Text
                      </Button>
                    )}
                  </div>
                </div>

                {getCurrentAssetText() && (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Move className="w-4 h-4 cursor-move" />
                        <Input
                          value={getCurrentAssetText()!.text}
                          onChange={(e) => {
                            const config = getSelectedAssetTextConfig()!;
                            const newText = e.target.value.slice(0, config.maxLength);
                            updateAssetText(getCurrentAssetText()!.id, { text: newText });
                          }}
                          className="flex-1 text-sm"
                          placeholder={`Max ${getSelectedAssetTextConfig()!.maxLength} characters`}
                        />
                        <div className="text-xs text-muted-foreground">
                          {getCurrentAssetText()!.text.length}/{getSelectedAssetTextConfig()!.maxLength}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <Select
                          value={getCurrentAssetText()!.fontFamily}
                          onValueChange={(value) => updateAssetText(getCurrentAssetText()!.id, { fontFamily: value })}
                        >
                          <SelectTrigger className="flex-1 text-sm">
                            <SelectValue placeholder="Font" />
                          </SelectTrigger>
                          <SelectContent>
                            {FONTS.map((font) => (
                              <SelectItem
                                key={font.value}
                                value={font.value}
                                style={{ fontFamily: font.value }}
                              >
                                {font.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Color Selection */}
                        <div className="space-y-1 sm:space-y-2">
                          <span className="text-xs sm:text-sm">Color</span>
                          <div className="flex flex-wrap gap-1 sm:gap-2 mb-1 sm:mb-2">
                            {PRESET_COLORS.map((color) => (
                              <button
                                key={color.value}
                                onClick={() => updateAssetText(getCurrentAssetText()!.id, { color: color.value })}
                                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 ${
                                  getCurrentAssetText()!.color === color.value ? 'border-primary' : 'border-transparent'
                                }`}
                                style={{ backgroundColor: color.value }}
                                title={color.name}
                              />
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm">Custom</span>
                            <input
                              type="color"
                              value={getCurrentAssetText()!.color}
                              onChange={(e) => updateAssetText(getCurrentAssetText()!.id, { color: e.target.value })}
                              className="w-6 h-6 sm:w-8 sm:h-8 rounded cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span>Font Size</span>
                          <span className="text-muted-foreground">
                            {getCurrentAssetText()!.fontSize}px
                          </span>
                        </div>
                        <Slider
                          value={[getCurrentAssetText()!.fontSize]}
                          min={12}
                          max={48}
                          step={1}
                          onValueChange={([value]) => updateAssetText(getCurrentAssetText()!.id, { fontSize: value })}
                          className="py-0.5"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span>Scale</span>
                          <span className="text-muted-foreground">
                            {Math.round(getCurrentAssetText()!.scale * 100)}%
                          </span>
                        </div>
                        <Slider
                          value={[getCurrentAssetText()!.scale * 100]}
                          min={50}
                          max={200}
                          step={5}
                          onValueChange={([value]) => updateAssetText(getCurrentAssetText()!.id, { scale: value / 100 })}
                          className="py-0.5"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span>Rotation</span>
                          <span className="text-muted-foreground">
                            {getCurrentAssetText()!.rotation}°
                          </span>
                        </div>
                        <Slider
                          value={[getCurrentAssetText()!.rotation]}
                          min={-180}
                          max={180}
                          step={5}
                          onValueChange={([value]) => updateAssetText(getCurrentAssetText()!.id, { rotation: value })}
                          className="py-0.5"
                        />
                      </div>

                      {/* Position Adjusters */}
                      <div className="space-y-3 pt-2 border-t border-border/50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Position</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const config = getSelectedAssetTextConfig()!;
                              updateAssetText(getCurrentAssetText()!.id, {
                                x: config.defaultPosition.x,
                                y: config.defaultPosition.y
                              });
                            }}
                            className="text-xs"
                          >
                            Reset Position
                          </Button>
                        </div>
                                                <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                              <span>X Position</span>
                              <span className="text-muted-foreground">
                                {getCurrentAssetText()!.x}
                              </span>
                            </div>
                            <Slider
                              value={[getCurrentAssetText()!.x]}
                              min={100}
                              max={412}
                              step={1}
                              onValueChange={([value]) => updateAssetText(getCurrentAssetText()!.id, { x: value })}
                              className="py-0.5"
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                              <span>Y Position</span>
                              <span className="text-muted-foreground">
                                {getCurrentAssetText()!.y}
                              </span>
                            </div>
                            <Slider
                              value={[getCurrentAssetText()!.y]}
                              min={100}
                              max={412}
                              step={1}
                              onValueChange={([value]) => updateAssetText(getCurrentAssetText()!.id, { y: value })}
                              className="py-0.5"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!getCurrentAssetText() && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Type className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Click "Add Text" to add custom text to this {getSelectedAssetTextConfig()?.category === 'hats' ? 'hat' : 'eye'}.</p>
                    <p className="text-xs mt-1">Text will be positioned and sized specifically for this asset.</p>
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Right Column: Asset Controls */}
          <div className="space-y-4 sm:space-y-6">
            {/* Backgrounds */}
            <Card className="p-3 sm:p-6 bg-gradient-card border-border/50 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-foreground">Backgrounds</h3>
                
                {/* Upload Button */}
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleBackgroundUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="background-upload"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-gradient-secondary hover:bg-gradient-secondary/80 text-primary-foreground border-primary/20"
                    onClick={() => {
                      console.log('🔘 Upload button clicked');
                      const inputElement = document.getElementById('background-upload');
                      console.log('📁 Input element found:', inputElement);
                      inputElement?.click();
                    }}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-[200px] sm:h-[400px] pr-4">
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-3">
                  {/* Default Backgrounds */}
                  {BACKGROUNDS.map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => handleBackgroundSelection(bg)}
                      className={`relative overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                        selectedBackground.id === bg.id 
                          ? 'border-primary shadow-glow-primary' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <img
                        src={bg.thumbnail}
                        alt={bg.name}
                        className="w-full h-16 sm:h-20 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-1 left-2 text-xs font-medium text-white">
                        {bg.name}
                      </div>
                    </button>
                  ))}
                  
                  {/* Custom Uploaded Backgrounds */}
                  {uploadedBackgrounds.length > 0 && (
                    <>
                      <div className="col-span-2 sm:col-span-1 mt-4 mb-2">
                        <div className="flex items-center gap-2">
                          <Image className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-primary">Custom Backgrounds</span>
                        </div>
                      </div>
                      {uploadedBackgrounds.map((bg) => (
                        <button
                          key={bg.id}
                          onClick={() => handleBackgroundSelection(bg)}
                          className={`relative overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                            selectedBackground.id === bg.id 
                              ? 'border-primary shadow-glow-primary' 
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <img
                            src={bg.thumbnail}
                            alt={bg.name}
                            className="w-full h-16 sm:h-20 object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          <div className="absolute bottom-1 left-2 text-xs font-medium text-white">
                            {bg.name}
                          </div>
                          <div className="absolute top-1 right-1">
                            <Badge className="bg-primary text-primary-foreground text-xs px-1">
                              Custom
                            </Badge>
                          </div>
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </ScrollArea>
            </Card>

            {/* Categories */}
            <Card className="p-3 sm:p-6 bg-gradient-card border-border/50 shadow-card overflow-visible">
              <h3 className="text-base sm:text-lg font-semibold mb-4 text-foreground">Customize</h3>
              
              {/* Category tabs */}
              <div className="flex gap-1 sm:gap-2 mb-4 flex-wrap">
                {CATEGORIES.map((category) => (
                  <Button
                    key={category.id}
                    variant={activeCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory(category.id)}
                    className={`text-xs sm:text-sm ${activeCategory === category.id ? "bg-gradient-secondary" : ""}`}
                  >
                    <span className="mr-1">{category.icon}</span>
                    {category.name}
                  </Button>
                ))}
              </div>

              {/* Asset grid with ScrollArea */}
              <ScrollArea className="h-[300px] sm:h-[600px] pr-4 overflow-visible">
                <div className="grid grid-cols-2 gap-2 sm:gap-4 overflow-visible">
                  {activeItems.map((asset) => {
                    const isSelected = selectedAssets[activeCategory]?.id === asset.id;
                    return (
                      <button
                        key={asset.id}
                        onClick={() => toggleAsset(activeCategory, asset)}
                        className={`relative overflow-hidden rounded-lg border-2 p-2 sm:p-4 transition-all duration-300 hover:scale-102 hover:z-10 ${
                          isSelected 
                            ? 'border-primary shadow-glow-primary bg-primary/10' 
                            : 'border-border hover:border-primary/50 bg-muted/50'
                        }`}
                      >
                        <img
                          src={asset.thumbnail}
                          alt={asset.name}
                          className="w-full h-12 sm:h-16 object-contain"
                        />
                        <div className="text-xs font-medium mt-2 text-center">
                          {asset.name}
                        </div>
                        {isSelected && (
                          <Badge className="absolute top-1 right-1 bg-primary text-primary-foreground text-xs px-1">
                            ✓
                          </Badge>
                        )}
                        {ASSET_TEXT_CONFIGS.some(config => config.assetId === asset.id) && (
                          <Badge className="absolute bottom-1 right-1 bg-secondary text-secondary-foreground text-xs px-1">
                            <Type className="w-3 h-3" />
                          </Badge>
                        )}
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </div>

      {/* Background Selection Confirmation Dialog */}
      <AlertDialog open={showBackgroundConfirmDialog} onOpenChange={setShowBackgroundConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replace Uploaded Background?</AlertDialogTitle>
            <AlertDialogDescription>
              You have an uploaded background selected. If you choose a different background, your uploaded background will be removed. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelBackgroundSelection}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmBackgroundSelection}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PFPGenerator;