import React, { useState, useCallback, useEffect } from 'react';
import { ArrowLeft, Download, Twitter, LineChart, Shuffle, Image } from 'lucide-react';
import { XIcon } from '@/components/ui/x-icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const MISSING_IMAGES = [47, 48];

// Import all example dog images (0-99), excluding missing images
const allDogs = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  src: `/dogs/${i}.webp`,
  alt: `Dog ${i}`
})).filter(dog => !MISSING_IMAGES.includes(dog.id));

// Number of dogs to display at once
const DISPLAY_COUNT = 12;

const HallOfDogs: React.FC = () => {
  const navigate = useNavigate();
  const [displayedDogs, setDisplayedDogs] = useState<typeof allDogs>([]);
  const [failedImages, setFailedImages] = useState<number[]>([]);

  // Function to shuffle and display random dogs
  const shuffleDogs = useCallback(() => {
    const shuffled = [...allDogs]
      .filter(dog => !failedImages.includes(dog.id))
      .sort(() => Math.random() - 0.5);
    setDisplayedDogs(shuffled.slice(0, DISPLAY_COUNT));
  }, [failedImages]);

  // Run shuffle when component mounts
  useEffect(() => {
    shuffleDogs();
  }, [shuffleDogs]);

  // Handle images that fail to load
  const handleImageError = (dogId: number) => {
    setFailedImages(prev => [...prev, dogId]);
  };

  // Handle image download when clicked
  const handleDownload = (imageSrc: string, dogId: number) => {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = `wdog-${dogId}.webp`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-background p-4">
      <div className="max-w-7xl mx-auto relative">
        {/* Social Media Icons */}
        <div className="absolute top-0 right-0 flex gap-4 p-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="bg-black hover:bg-gray-800 text-white rounded-full w-10 h-10"
            onClick={() => window.open('https://t.co/GurmgVXpiR', '_blank')}
          >
            <XIcon className="h-5 w-5 text-white" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-[#FF8C00] hover:bg-[#FF8C00]/90 text-white rounded-full w-10 h-10"
            onClick={() => window.open('https://dexscreener.com/solana/25txtutlkjtcux3kqoervc7aubym7fckbwovqnqnydgq', '_blank')}
          >
            <LineChart className="h-5 w-5" />
          </Button>
        </div>

        {/* Page Header */}
        <div className="text-center mb-8 pt-16 relative">
          {/* Back button positioned absolutely for mobile */}
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            size="sm"
            className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back to Generator</span>
            <span className="sm:hidden">Back</span>
          </Button>
          
          {/* Main title with better mobile spacing */}
          <div className="px-4 sm:px-0 pt-12 sm:pt-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
              Hall of DOG's
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto px-2">
              Explore a random selection of legendary wDOG profile pictures. Click any image to download!
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Badge variant="secondary" className="text-lg px-6 py-3">
              {DISPLAY_COUNT} Random Examples from {allDogs.length}
            </Badge>
            <Button
              onClick={shuffleDogs}
              variant="outline"
              size="lg"
              className="group hover:border-primary/50"
            >
              <Shuffle className="w-5 h-5 mr-2 group-hover:animate-spin" />
              Shuffle Dogs
            </Button>
            <Button
              onClick={() => navigate('/memes')}
              variant="outline"
              size="lg"
              className="group hover:border-primary/50"
            >
              <Image className="w-5 h-5 mr-2" />
              Meme Gallery
            </Button>
          </div>
        </div>

        {/* Dog Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 md:px-8">
          {displayedDogs.map((dog) => (
            <Card
              key={dog.id}
              className="group relative overflow-hidden bg-gradient-card border border-border/50 shadow-card hover:shadow-neon transition-all duration-300 hover:scale-105"
            >
              <div className="aspect-square relative">
                <img
                  src={dog.src}
                  alt={dog.alt}
                  className="w-full h-full object-cover rounded-lg cursor-pointer"
                  onClick={() => handleDownload(dog.src, dog.id)}
                  onError={() => handleImageError(dog.id)}
                />
                
                {/* Download Overlay - Appears on Hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDownload(dog.src, dog.id)}
                    className="bg-primary/90 hover:bg-primary text-primary-foreground"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
                
                {/* Image Number Badge */}
                <Badge className="absolute top-2 left-2 bg-black/70 text-white border-0">
                  #{dog.id}
                </Badge>
              </div>
            </Card>
          ))}
        </div>

        {/* Page Footer */}
        <div className="text-center mt-16 mb-8">
          <p className="text-muted-foreground mb-4">
            wDOG is a fully decentralized meme that gained traction organically on pump.fun, without influencer promotion.
          </p>
          <p className="text-sm text-muted-foreground">
            Like early Bitcoin, its rise is driven by community engagement, highlighting the power of true decentralization.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HallOfDogs; 