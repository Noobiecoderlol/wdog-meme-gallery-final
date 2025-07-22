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
  Send, 
  Twitter, 
  FileText, 
  LineChart, 
  Crosshair, 
  RotateCcw,
  Type,
  Move
} from 'lucide-react';
import { toast } from 'sonner';
import { BACKGROUNDS, CATEGORIES, BASE_DOG, WRAPPER, type Asset } from '@/data/assets';

// Lägg till nya konstanter för standardfärger
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

// Lägg till nya interfaces för text-funktionaliteten
interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  isDragging: boolean;
  rotation: number; // Lägg till rotation
  scale: number; // Lägg till scale
}

interface PresetPosition {
  name: string;
  x: number;
  y: number;
  fontSize: number;
}

// Förinställda typsnitt
const FONTS = [
  { name: 'Arial', value: 'Arial' },
  { name: 'Comic Sans MS', value: 'Comic Sans MS' },
  { name: 'Impact', value: 'Impact' },
  { name: 'Verdana', value: 'Verdana' },
  { name: 'Times New Roman', value: 'Times New Roman' }
];

// Förinställda positioner
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

  // Lägg till state för text-funktionaliteten
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

  // Lägg till ny state för skylt-kontroller
  const [signPosition, setSignPosition] = useState({ x: 0, y: -150 });
  const [signScale, setSignScale] = useState(1.0);

  // Load and cache images
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      if (imageCache.current.has(src)) {
        resolve(imageCache.current.get(src)!);
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        imageCache.current.set(src, img);
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
  };

  // Add mouse position tracking
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isTestMode || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Calculate the scale factor between the canvas's display size and its internal size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Get mouse position relative to canvas
    const x = Math.round((event.clientX - rect.left) * scaleX);
    const y = Math.round((event.clientY - rect.top) * scaleY);
    
    // Calculate position relative to center
    const centerX = Math.round(x - canvas.width / 2);
    const centerY = Math.round(y - canvas.height / 2);
    
    setMousePos({ x: centerX, y: centerY });
  };

  // Funktion för att beräkna vinkel mellan två punkter
  const getAngle = (cx: number, cy: number, ex: number, ey: number) => {
    const dy = ey - cy;
    const dx = ex - cx;
    const theta = Math.atan2(dy, dx);
    return theta * 180 / Math.PI;
  };

  // Funktion för att beräkna avstånd mellan två punkter
  const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  // Uppdatera handleCanvasMouseDown för att ta bort rektangeln
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

    // Beräkna textens bounds utan att rita dem
    ctx.save();
    ctx.font = `${activeText.fontSize * (activeText.scale || 1)}px ${activeText.fontFamily}`;
    const metrics = ctx.measureText(activeText.text);
    const height = activeText.fontSize * (activeText.scale || 1);
    
    // Transformera musposition till textens koordinatsystem
    const dx = mouseX - activeText.x;
    const dy = mouseY - activeText.y;
    const angle = -(activeText.rotation || 0) * Math.PI / 180;
    const rotatedX = dx * Math.cos(angle) - dy * Math.sin(angle);
    const rotatedY = dx * Math.sin(angle) + dy * Math.cos(angle);

    // Kolla om klicket är inom textens bounds
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

  // Uppdatera handleCanvasMouseMove
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

    // Uppdatera muspekaren baserat på vad vi hovrar över
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

  // Uppdatera handleCanvasMouseUp
  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    setActiveControl(null);
    setStartAngle(0);
    setStartScale(1);
  };

  // Hantera musklick på canvas för att hitta och aktivera text
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Kolla om klicket träffar någon text
    textElements.forEach(text => {
      ctx.font = `${text.fontSize * text.scale}px ${text.fontFamily}`;
      const metrics = ctx.measureText(text.text);
      const height = text.fontSize * text.scale;

      // Beräkna textens bounds med rotation
      const bounds = {
        left: text.x - (metrics.width / 2),
        right: text.x + (metrics.width / 2),
        top: text.y - (height / 2),
        bottom: text.y + (height / 2)
      };

      // Kolla om klicket är inom textens bounds
      if (x >= bounds.left && x <= bounds.right && 
          y >= bounds.top && y <= bounds.bottom) {
        setActiveTextId(text.id);
      }
    });
  };

  // Hantera rotation och skalning med tangentbord när text är aktiv
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!activeTextId) return;

    const text = textElements.find(t => t.id === activeTextId);
    if (!text) return;

    switch (e.key) {
      case 'r':
        // Rotera med R + piltangenter
        if (e.shiftKey) {
          setIsRotating(true);
          setRotationStart(text.rotation);
        }
        break;
      case 's':
        // Skala med S + piltangenter
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

  // Lägg till keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeTextId, isRotating, isScaling]);

  // Uppdatera canvas scale on resize
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

  // Uppdatera selectedAssets när position eller skala ändras
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

  // Lägg till handleSignPosition funktion
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
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate base dimensions
      const canvasCenter = canvas.width / 2;
      const dogBaseSize = Math.min(canvas.width, canvas.height);
      const dogScale = 1.0;
      const dogSize = dogBaseSize * dogScale;
      const dogX = canvasCenter - (dogSize / 2);
      const dogY = 0;

      // Draw background
      const bgImg = await loadImage(selectedBackground.src);
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      // Enable high quality rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw the base dog
      const dogImg = await loadImage(BASE_DOG.src);
      ctx.drawImage(dogImg, dogX, dogY, dogSize, dogSize);

      // Check if a hat is selected
      const hasHat = selectedAssets['hats'] !== undefined;

      // Draw wrapper if no hat is selected
      if (!hasHat) {
        const wrapperImg = await loadImage(WRAPPER.src);
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(wrapperImg, dogX, dogY, dogSize, dogSize);
      }

      // Define rendering order
      const layerOrder = ['clothes', 'items', 'eyes', 'hats', 'signs', 'signs2'];
      
      for (const category of layerOrder) {
        const asset = selectedAssets[category];
        if (!asset) continue;

        // Om det är en skylt, använd renderFunction med position och skala
        if (category === 'signs' && asset.renderFunction) {
          const x = asset.position?.x || 0;
          const y = asset.position?.y || 0;
          const scale = asset.scale || 1;
          asset.renderFunction(ctx, x, y, scale);
          continue;
        }

        // Hantera Signs 2 (bildbaserade skyltar)
        if (category === 'signs2') {
          const assetImg = await loadImage(asset.src);
          const scale = asset.scale || 0.4; // Minska storleken ytterligare
          const assetSize = dogSize * scale;
          
          let assetX = dogX + (dogSize / 2);
          let assetY = dogY + (dogSize / 2);

          // Apply asset-specific position adjustments
          if (asset.position) {
            assetX += asset.position.x * (dogSize / 512);
            assetY += asset.position.y * (dogSize / 512);
          }

          // Center asset horizontally
          assetX -= assetSize / 2;

          // Sätt composite operation för att hantera transparens korrekt
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = 1.0;
          
          // Rita skylten med transparens och hantera vit bakgrund
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
            assetX = dogX - (dogSize * 0.02);
            assetY = dogY;
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(assetImg, assetX, assetY, dogSize, dogSize);
            console.log('Clothes rendered at:', { x: assetX, y: assetY, size: dogSize });
            continue;
            
          case 'items': // Accessories
            // Position accessories
            assetX = dogX + (dogSize * 0.5);
            assetY = dogY + (dogSize * 0.10);
            ctx.globalCompositeOperation = 'source-over';
            
            // Scale accessories
            const accessoryScale = 1.0;
            const accessorySize = dogSize * accessoryScale;
            
            // Center the accessory
            const accessoryX = assetX - (accessorySize / 2);
            
            ctx.drawImage(assetImg, accessoryX, assetY, accessorySize, accessorySize);
            console.log('Accessory rendered at:', { x: accessoryX, y: assetY, size: accessorySize });
            continue;
            
          case 'eyes':
            assetY = dogY + (dogSize * 0.45);
            ctx.globalCompositeOperation = 'source-over';
            break;
            
          case 'hats':
            assetY = dogY + (dogSize * 0.2);
            ctx.globalCompositeOperation = 'source-over';
            break;
        }

        // Apply asset-specific position adjustments
        if (asset.position) {
          assetX += asset.position.x * (dogSize / 512);
          assetY += asset.position.y * (dogSize / 512);
        }

        // Center asset horizontally
        assetX -= assetSize / 2;

        ctx.globalAlpha = 1.0;
        ctx.drawImage(assetImg, assetX, assetY, assetSize, assetSize);
        console.log(`${category} rendered at:`, { x: assetX, y: assetY, size: assetSize });
      }

      // Rita text och kontrollpunkter
      textElements.forEach(text => {
        if (!ctx || !text.text.trim()) return;
        
        ctx.save();
        ctx.translate(text.x, text.y);
        ctx.rotate((text.rotation || 0) * Math.PI / 180);
        ctx.scale(text.scale || 1, text.scale || 1);
        
        // Rita text
        ctx.font = `${text.fontSize}px ${text.fontFamily}`;
        ctx.fillStyle = text.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text.text, 0, 0);
        
        ctx.restore();
      });

      // Rita bara texten utan några visuella markörer
      textElements.forEach(text => {
        if (!ctx || !text.text.trim()) return; // Skippa tomma texter
        
        ctx.font = `${text.fontSize}px ${text.fontFamily}`;
        ctx.fillStyle = text.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Rita text
        ctx.fillText(text.text, text.x, text.y);
        
      });

      // Draw test mode overlays
      if (isTestMode) {
        // Draw center crosshair
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.lineWidth = 1;
        
        // Draw vertical line
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();
        
        // Draw horizontal line
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();

        // Draw coordinate grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 0.5;
        
        // Draw vertical grid lines
        for (let x = 0; x <= canvas.width; x += 50) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        
        // Draw horizontal grid lines
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
        toast.success('🎉 Your WDOG PFP is ready!');
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
    toast.success('✨ Randomized your WDOG!');
  };

  // Funktion för att lägga till ny text
  const addNewText = (preset?: PresetPosition) => {
    const newId = `text-${Date.now()}`;
    const newText: TextElement = {
      id: newId,
      text: '', // Tom text som default istället för 'Double click to edit'
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

  // Funktion för att uppdatera text
  const updateText = (id: string, updates: Partial<TextElement>) => {
    setTextElements(prev => 
      prev.map(text => 
        text.id === id ? { ...text, ...updates } : text
      )
    );
  };

  // Uppdatera resetCustomization funktionen för att inkludera text
  const resetCustomization = () => {
    setSelectedBackground(BACKGROUNDS[0]);
    setSelectedAssets({});
    setActiveCategory(CATEGORIES[0].id);
    setTextElements([]); // Återställ alla texter
    setActiveTextId(null);
    toast.success('🔄 Reset to default settings');
  };

  // Uppdatera position för aktiv text eller skapa ny om ingen är aktiv
  const applyPresetPosition = (preset: PresetPosition) => {
    if (activeTextId) {
      // Uppdatera positionen för aktiv text
      updateText(activeTextId, {
        x: preset.x,
        y: preset.y,
        fontSize: preset.fontSize
      });
      toast.success('✨ Text position updated');
    } else if (textElements.length > 0) {
      // Om det finns text men ingen är aktiv, aktivera den första och uppdatera den
      const firstText = textElements[0];
      setActiveTextId(firstText.id);
      updateText(firstText.id, {
        x: preset.x,
        y: preset.y,
        fontSize: preset.fontSize
      });
      toast.success('✨ Text position updated');
    } else {
      // Om ingen text finns, skapa ny
      addNewText(preset);
      toast.success('✨ New text added');
    }
  };

  // Render canvas whenever selections change
  useEffect(() => {
    renderCanvas();
  }, [selectedBackground, selectedAssets, isTestMode, textElements]); // Added isTestMode and textElements to re-render

  const activeItems = CATEGORIES.find(c => c.id === activeCategory)?.items || [];

  return (
    <div className="min-h-screen bg-gradient-background p-2 sm:p-4">
      <div className="max-w-6xl mx-auto relative">
        {/* Social Icons */}
        <div className="absolute top-0 right-0 flex gap-2 sm:gap-4 p-2 sm:p-4">
          <Button
            variant="ghost"
            size="icon"
            className="bg-[#FF5722] hover:bg-[#FF5722]/90 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10"
            onClick={() => window.open('https://t.me', '_blank')}
          >
            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10"
            onClick={() => window.open('https://x.com/i/communities/1848841389729059126', '_blank')}
          >
            <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-[#6E6E6E] hover:bg-[#6E6E6E]/90 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10"
            onClick={() => window.open('https://solscan.io', '_blank')}
          >
            <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
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
              WDOG PFP Generator
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
                    className={`${isTestMode ? "bg-gradient-accent" : ""} hidden`} // Dold för användare men tillgänglig för debug
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
                    className="w-full h-auto rounded-xl shadow-neon border border-primary/20"
                    onMouseMove={handleMouseMove}
                    onMouseDown={handleCanvasMouseDown}
                    onMouseUp={handleCanvasMouseUp}
                    onClick={handleCanvasClick}
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
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
          </div>

          {/* Right Column: Asset Controls */}
          <div className="space-y-4 sm:space-y-6">
            {/* Backgrounds */}
            <Card className="p-3 sm:p-6 bg-gradient-card border-border/50 shadow-card">
              <h3 className="text-base sm:text-lg font-semibold mb-4 text-foreground">Backgrounds</h3>
              <ScrollArea className="h-[200px] sm:h-[400px] pr-4">
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-3">
                  {BACKGROUNDS.map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => setSelectedBackground(bg)}
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
                </div>
              </ScrollArea>
            </Card>

            {/* Categories */}
            <Card className="p-3 sm:p-6 bg-gradient-card border-border/50 shadow-card">
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
              <ScrollArea className="h-[300px] sm:h-[600px] pr-4">
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  {activeItems.map((asset) => {
                    const isSelected = selectedAssets[activeCategory]?.id === asset.id;
                    return (
                      <button
                        key={asset.id}
                        onClick={() => toggleAsset(activeCategory, asset)}
                        className={`relative overflow-hidden rounded-lg border-2 p-2 sm:p-4 transition-all duration-300 hover:scale-105 ${
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
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PFPGenerator;