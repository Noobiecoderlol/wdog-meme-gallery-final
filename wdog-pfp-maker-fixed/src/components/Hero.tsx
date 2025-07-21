import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Download, Palette, Zap, Send, Twitter, FileText, LineChart, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-background p-4">
      <div className="max-w-6xl mx-auto relative">
        {/* Social Icons */}
        <div className="absolute top-0 right-0 flex gap-4 p-4">
          <Button
            variant="ghost"
            size="icon"
            className="bg-[#FF5722] hover:bg-[#FF5722]/90 text-white rounded-full w-10 h-10"
            onClick={() => window.open('https://t.me', '_blank')}
          >
            <Send className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white rounded-full w-10 h-10"
            onClick={() => window.open('https://twitter.com', '_blank')}
          >
            <Twitter className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-[#6E6E6E] hover:bg-[#6E6E6E]/90 text-white rounded-full w-10 h-10"
            onClick={() => window.open('https://solscan.io', '_blank')}
          >
            <FileText className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-[#FF8C00] hover:bg-[#FF8C00]/90 text-white rounded-full w-10 h-10"
            onClick={() => window.open('https://www.dextools.io', '_blank')}
          >
            <LineChart className="h-5 w-5" />
          </Button>
        </div>

        <div className="pt-20 text-center">
          {/* Animated logo/icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="text-8xl animate-float">🐕‍🦺</div>
              <div className="absolute -top-2 -right-2 text-2xl animate-pulse">✨</div>
              <div className="absolute -bottom-1 -left-2 text-xl animate-pulse">🌟</div>
            </div>
          </div>

          {/* Main heading */}
          <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            WDOG PFP Generator
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create your own legendary WDOG profile picture with our epic generator. Choose from stunning backgrounds and accessories!
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-3xl mx-auto">
            <div className="flex flex-col items-center p-6 rounded-xl bg-gradient-card border border-border/50 shadow-card">
              <Palette className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Custom Backgrounds</h3>
              <p className="text-sm text-muted-foreground">Choose from stunning vaporwave and space themes</p>
            </div>
            
            <div className="flex flex-col items-center p-6 rounded-xl bg-gradient-card border border-border/50 shadow-card">
              <Sparkles className="w-8 h-8 text-secondary mb-3" />
              <h3 className="font-semibold mb-2">Cool Accessories</h3>
              <p className="text-sm text-muted-foreground">Hats, glasses, and more to style your WDOG</p>
            </div>
            
            <div className="flex flex-col items-center p-6 rounded-xl bg-gradient-card border border-border/50 shadow-card">
              <Download className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-semibold mb-2">Instant Download</h3>
              <p className="text-sm text-muted-foreground">High-quality PNG ready for any platform</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="bg-gradient-primary hover:shadow-glow-primary text-lg px-8 py-3 hover:scale-105 transition-all duration-300"
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Creating
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/examples')}
              className="text-lg px-8 py-3 hover:scale-105 transition-all duration-300"
            >
              <Wand2 className="w-5 h-5 mr-2" />
              See Examples
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              Free forever • No signup required • Instant download
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};