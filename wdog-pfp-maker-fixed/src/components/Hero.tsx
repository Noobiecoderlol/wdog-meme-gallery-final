import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Download, Palette, Zap, Twitter, LineChart, Wand2, Image } from 'lucide-react';
import { XIcon } from '@/components/ui/x-icon';
import { useNavigate } from 'react-router-dom';
import baseDog from '@/assets/body/base-dog.webp';
import wrapper from '@/assets/body/wrapper.webp';

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  const navigate = useNavigate();
  
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

        <div className="pt-12 sm:pt-20 text-center px-2 sm:px-4">
          {/* Animated logo/icon */}
          <div className="mb-4 sm:mb-6 flex justify-center">
            <div className="relative">
              {/* Base dog image */}
              <img 
                src={baseDog} 
                alt="wDOG Base Dog" 
                className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 animate-float object-contain"
              />
              {/* Wrapper overlay */}
              <img 
                src={wrapper} 
                alt="wDOG Wrapper" 
                className="absolute inset-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 animate-float object-contain"
              />
              <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 text-xl sm:text-2xl animate-pulse">✨</div>
              <div className="absolute -bottom-1 -left-1 sm:-left-2 text-lg sm:text-xl animate-pulse">🌟</div>
            </div>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            wDOG PFP Generator
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Create your own legendary wDOG profile picture with our epic generator. Choose from stunning backgrounds and accessories!
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10 max-w-3xl mx-auto px-4">
            <div className="flex flex-col items-center p-4 sm:p-6 rounded-xl bg-gradient-card border border-border/50 shadow-card">
              <Palette className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-2 sm:mb-3" />
              <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Custom Backgrounds</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Choose from stunning vaporwave and space themes</p>
            </div>
            
            <div className="flex flex-col items-center p-4 sm:p-6 rounded-xl bg-gradient-card border border-border/50 shadow-card">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-secondary mb-2 sm:mb-3" />
              <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Cool Accessories</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Hats, glasses, and more to style your wDOG</p>
            </div>
            
            <div className="flex flex-col items-center p-4 sm:p-6 rounded-xl bg-gradient-card border border-border/50 shadow-card">
              <Download className="w-6 h-6 sm:w-8 sm:h-8 text-accent mb-2 sm:mb-3" />
              <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Instant Download</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">High-quality PNG ready for any platform</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-6 sm:mb-8 px-4">
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="w-full sm:w-auto bg-gradient-primary hover:shadow-glow-primary text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3 hover:scale-105 transition-all duration-300"
            >
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Start Creating
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/examples')}
              className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3 hover:scale-105 transition-all duration-300"
            >
              <Wand2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              See Examples
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/memes')}
              className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3 hover:scale-105 transition-all duration-300"
            >
              <Image className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Meme Gallery
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center px-4">
            <p className="text-muted-foreground text-xs sm:text-sm">
              Free forever • No signup required • Instant download
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};