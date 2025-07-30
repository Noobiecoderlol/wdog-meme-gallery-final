import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Image, Video, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

// Configuration matching the original script
const TOTAL_IMAGES = 1000; // Will gracefully handle missing images
const BATCH_SIZE = 30; // Process content in batches to avoid blocking UI
const IMAGE_FOLDER = '/wdog-meme-gallery-main/images/';
const VIDEO_FOLDER = '/wdog-meme-gallery-main/videos/';

// Video files array from original script
const VIDEO_FILES = [
  'bbqking.mp4', 'cantgetenoughofyourlovebabe.mp4', 'canttouchthis copy.mp4',
  'canttouchthis (online-video-cutter.com).mp4', 'Chat with Cartoon Character.mp4',
  'deathfight.mp4', 'everbody (online-video-cutter.com).mp4', 'EVERYBODY.mp4',
  'fearless (online-video-cutter.com).mp4', 'gameon.mp4', 'getyourgameon (online-video-cutter.com).mp4',
  'gm (online-video-cutter.com).mp4', 'gm.mp4', 'gotfam2 (online-video-cutter.com).mp4',
  'hallowen.mp4', 'hallowen2 (online-video-cutter.com).mp4', 'hanginthere.mp4',
  'Hedra (online-video-cutter.com).mp4', 'hotdog.mp4', 'howwedoit.mp4', 'ifeelgood.mp4',
  'IMG_3510.mp4', 'indaclub (online-video-cutter.com) copy.mp4', 'indaclub (online-video-cutter.com).mp4',
  'iwantyou.mp4', 'jim.mp4', 'john (online-video-cutter.com).mp4', 'likesugar copy.mp4',
  'likesugar.mp4', 'listen to your hearth.mp4', 'loveshock.mp4', 'loveshockjenny.mp4',
  'miniwdog.mp4', 'papas (online-video-cutter.com).mp4', 'pepas perfecto.mp4', 'pepas.mp4',
  'pepewdog (online-video-cutter.com).mp4', 'pixverse2Fmedia2F7709982c-83b8-4159-b583-8fa69812e598_seed43290079.mp4',
  'polka.mp4', 'ppepas (online-video-cutter.com).mp4', 'rockubody.mp4', 'rstillcool.mp4',
  'samba.mp4', 'sato.mp4', 'shakeit.mp4', 'shutupanddance.mp4', 'skibid copy.mp4',
  'skibid.mp4', 'stm (online-video-cutter.com).mp4', 'sunshine.mp4',
  'takeonme (online-video-cutter.com) copy.mp4', 'takeonme (online-video-cutter.com).mp4',
  'thisishowwedoit.mp4', 'truelove.mp4', 'umakemydreams (online-video-cutter.com).mp4',
  'umakemydreams.mp4', 'wdog (1).mp4', 'wdog (3) (online-video-cutter.com).mp4',
  'wdogjim copy copy.mp4', 'wdogjim.mp4', 'whatswdog.mp4', 'wrapyourbody.mp4'
];

interface ImageItem {
  id: number;
  src: string;
  alt: string;
  loaded: boolean;
  error: boolean;
}

interface VideoItem {
  id: number;
  src: string;
  title: string;
  loaded: boolean;
  error: boolean;
  playing: boolean;
}

const MemeGallery: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('images');
  const [loadedImages, setLoadedImages] = useState(0);
  const [loadedVideos, setLoadedVideos] = useState(0);
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);
  const [videoItems, setVideoItems] = useState<VideoItem[]>([]);
  const [processedImages, setProcessedImages] = useState<Set<number>>(new Set());
  const [processedVideos, setProcessedVideos] = useState<Set<number>>(new Set());
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  
  const imageGridRef = useRef<HTMLDivElement>(null);
  const videoGridRef = useRef<HTMLDivElement>(null);

  // Create image item with error handling (matching original logic)
  const createImageItem = useCallback((imageNumber: number): ImageItem => {
    return {
      id: imageNumber,
      src: `${IMAGE_FOLDER}${imageNumber}.jpg`, // Try lowercase first
      alt: `Meme ${imageNumber}`,
      loaded: false,
      error: false
    };
  }, []);

  // Create video item (matching original logic)
  const createVideoItem = useCallback((videoFileName: string, index: number): VideoItem => {
    const cleanTitle = videoFileName
      .replace(/\.mp4$/, '')
      .replace(/\(online-video-cutter\.com\)/g, '')
      .replace(/ copy/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    return {
      id: index,
      src: `${VIDEO_FOLDER}${videoFileName}`,
      title: cleanTitle,
      loaded: false,
      error: false,
      playing: false
    };
  }, []);

  // Handle image load success
  const handleImageLoad = useCallback((imageNumber: number) => {
    if (!processedImages.has(imageNumber)) {
      setProcessedImages(prev => new Set(prev).add(imageNumber));
      setLoadedImages(prev => prev + 1);
      setImageItems(prev => 
        prev.map(item => 
          item.id === imageNumber ? { ...item, loaded: true } : item
        )
      );
    }
  }, [processedImages]);

  // Handle image load error (try uppercase extension)
  const handleImageError = useCallback((imageNumber: number) => {
    setImageItems(prev => 
      prev.map(item => {
        if (item.id === imageNumber) {
          if (item.src.endsWith('.jpg')) {
            // Try uppercase extension
            return { ...item, src: `${IMAGE_FOLDER}${imageNumber}.JPG` };
          } else {
            // Both extensions failed, mark as error
            if (!processedImages.has(imageNumber)) {
              setProcessedImages(prevSet => new Set(prevSet).add(imageNumber));
            }
            return { ...item, error: true };
          }
        }
        return item;
      })
    );
  }, [processedImages]);

  // Handle video load success
  const handleVideoLoad = useCallback((videoId: number) => {
    if (!processedVideos.has(videoId)) {
      setProcessedVideos(prev => new Set(prev).add(videoId));
      setLoadedVideos(prev => prev + 1);
      setVideoItems(prev => 
        prev.map(item => 
          item.id === videoId ? { ...item, loaded: true } : item
        )
      );
    }
  }, [processedVideos]);

  // Handle video load error
  const handleVideoError = useCallback((videoId: number) => {
    if (!processedVideos.has(videoId)) {
      setProcessedVideos(prev => new Set(prev).add(videoId));
      setLoadedVideos(prev => prev + 1);
      setVideoItems(prev => 
        prev.map(item => 
          item.id === videoId ? { ...item, error: true } : item
        )
      );
    }
  }, [processedVideos]);

  // Process image batch (matching original logic)
  const processImageBatch = useCallback((startIndex: number, endIndex: number) => {
    const newImages: ImageItem[] = [];
    for (let i = startIndex; i <= endIndex && i <= TOTAL_IMAGES; i++) {
      newImages.push(createImageItem(i));
    }
    
    setImageItems(prev => [...prev, ...newImages]);

    // Schedule next batch if needed
    if (endIndex < TOTAL_IMAGES) {
      requestAnimationFrame(() => {
        processImageBatch(endIndex + 1, endIndex + BATCH_SIZE);
      });
    }
  }, [createImageItem]);

  // Process video batch (matching original logic)
  const processVideoBatch = useCallback((startIndex: number, endIndex: number) => {
    const newVideos: VideoItem[] = [];
    for (let i = startIndex; i <= endIndex && i < VIDEO_FILES.length; i++) {
      newVideos.push(createVideoItem(VIDEO_FILES[i], i));
    }
    
    setVideoItems(prev => [...prev, ...newVideos]);

    // Schedule next batch if needed
    if (endIndex < VIDEO_FILES.length) {
      requestAnimationFrame(() => {
        processVideoBatch(endIndex + 1, endIndex + BATCH_SIZE);
      });
    }
  }, [createVideoItem]);

  // Initialize galleries
  useEffect(() => {
    console.log('Initializing meme gallery...');
    processImageBatch(1, BATCH_SIZE);
    processVideoBatch(0, BATCH_SIZE);
  }, [processImageBatch, processVideoBatch]);

  // Handle video click (play/pause)
  const handleVideoClick = (videoId: number) => {
    const videoElement = document.querySelector(`video[data-video-id="${videoId}"]`) as HTMLVideoElement;
    if (videoElement) {
      if (videoElement.paused) {
        videoElement.play();
        setVideoItems(prev => 
          prev.map(item => 
            item.id === videoId ? { ...item, playing: true } : item
          )
        );
      } else {
        videoElement.pause();
        setVideoItems(prev => 
          prev.map(item => 
            item.id === videoId ? { ...item, playing: false } : item
          )
        );
      }
    }
  };

  // Handle image download
  const handleImageDownload = (imageSrc: string, imageNumber: number) => {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = `wdog-meme-${imageNumber}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle video download
  const handleVideoDownload = (videoSrc: string, videoTitle: string) => {
    const link = document.createElement('a');
    link.href = videoSrc;
    link.download = `${videoTitle}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle image fullscreen
  const handleImageFullscreen = (image: ImageItem) => {
    setSelectedImage(image);
  };

  // Handle video fullscreen
  const handleVideoFullscreen = (video: VideoItem) => {
    setSelectedVideo(video);
  };

  // Close fullscreen modal
  const closeFullscreen = () => {
    setSelectedImage(null);
    setSelectedVideo(null);
  };

  // Handle backdrop click to close modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeFullscreen();
    }
  };

  // Handle keyboard events (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (selectedImage || selectedVideo)) {
        closeFullscreen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, selectedVideo]);

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
            <span className="text-white font-bold">𝕏</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-[#FF8C00] hover:bg-[#FF8C00]/90 text-white rounded-full w-10 h-10"
            onClick={() => window.open('https://dexscreener.com/solana/25txtutlkjtcux3kqoervc7aubym7fckbwovqnqnydgq', '_blank')}
          >
            <span className="text-white">📊</span>
          </Button>
        </div>

        {/* Page Header */}
        <div className="text-center mb-8 pt-16 relative">
          {/* Back button positioned absolutely for mobile */}
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            size="sm"
            className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 h-8 w-8 sm:h-9 sm:w-auto px-2 sm:px-3 bg-background/90 backdrop-blur-sm border border-border/30 hover:bg-background/95 hover:border-border/50 text-muted-foreground hover:text-foreground shadow-sm"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline ml-1">Back</span>
          </Button>
          
          {/* Main title with better mobile spacing */}
          <div className="px-4 sm:px-0 pt-8 sm:pt-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
              wDOG Meme Collection
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto px-2">
              Explore the legendary wDOG meme collection! Click any image or video to download.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center gap-2 mb-8">
            <Button
              variant={activeTab === 'images' ? 'default' : 'outline'}
              onClick={() => setActiveTab('images')}
              className="flex items-center gap-2 px-6 py-3"
            >
              <Image className="w-4 h-4" />
              <span>Images</span>
              <Badge variant="secondary" className="ml-2">
                {Math.min(loadedImages, TOTAL_IMAGES)}
              </Badge>
            </Button>
            <Button
              variant={activeTab === 'videos' ? 'default' : 'outline'}
              onClick={() => setActiveTab('videos')}
              className="flex items-center gap-2 px-6 py-3"
            >
              <Video className="w-4 h-4" />
              <span>Videos</span>
              <Badge variant="secondary" className="ml-2">
                {Math.min(loadedVideos, VIDEO_FILES.length)}
              </Badge>
            </Button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="px-4 md:px-8">
          {/* Images Grid */}
          <div 
            ref={imageGridRef}
            className={`grid gap-4 ${
              activeTab === 'images' ? 'grid' : 'hidden'
            } grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`}
          >
            {imageItems.map((image) => (
              !image.error && (
                <Card
                  key={image.id}
                  className="group relative overflow-hidden bg-gradient-card border border-border/50 shadow-card hover:shadow-neon transition-all duration-300 hover:scale-105 cursor-pointer"
                  onClick={() => handleImageFullscreen(image)}
                >
                  <div className="aspect-square relative">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover rounded-lg"
                      loading="lazy"
                      onLoad={() => handleImageLoad(image.id)}
                      onError={() => handleImageError(image.id)}
                      style={{ 
                        opacity: image.loaded ? 1 : 0.5,
                        backgroundColor: '#f0f0f0'
                      }}
                    />
                    
                    {/* Fullscreen Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-primary/90 hover:bg-primary text-primary-foreground"
                      >
                        <Image className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </div>
                    

                  </div>
                </Card>
              )
            ))}
          </div>

          {/* Videos Grid */}
          <div 
            ref={videoGridRef}
            className={`grid gap-6 ${
              activeTab === 'videos' ? 'grid' : 'hidden'
            } grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`}
          >
            {videoItems.map((video) => (
              !video.error && (
                <Card
                  key={video.id}
                  className="group relative overflow-hidden bg-gradient-card border border-border/50 shadow-card hover:shadow-neon transition-all duration-300 hover:scale-105 cursor-pointer"
                  onClick={() => handleVideoFullscreen(video)}
                >
                  <div className="aspect-video relative">
                    <video
                      src={video.src}
                      className="w-full h-full object-cover rounded-lg"
                      preload="metadata"
                      muted={false}
                      data-video-id={video.id}
                      onLoadedMetadata={() => handleVideoLoad(video.id)}
                      onError={() => handleVideoError(video.id)}
                      onEnded={() => {
                        setVideoItems(prev => 
                          prev.map(item => 
                            item.id === video.id ? { ...item, playing: false } : item
                          )
                        );
                      }}
                      style={{ 
                        opacity: video.loaded ? 1 : 0.5,
                        backgroundColor: '#f0f0f0'
                      }}
                    />
                    
                    {/* Play/Pause Button Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-white/90 rounded-full p-3">
                        {video.playing ? (
                          <Pause className="w-6 h-6 text-black" />
                        ) : (
                          <Play className="w-6 h-6 text-black" />
                        )}
                      </div>
                    </div>
                    

                  </div>
                  
                  {/* Video Title */}
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-foreground truncate">
                      {video.title}
                    </h3>
                  </div>
                </Card>
              )
            ))}
          </div>

          {/* Loading State */}
          {activeTab === 'images' && imageItems.length === 0 && (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading images...</p>
            </div>
          )}

          {activeTab === 'videos' && videoItems.length === 0 && (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading videos...</p>
            </div>
          )}
        </div>

        {/* Page Footer */}
        <div className="text-center mt-16 mb-8">
          <p className="text-muted-foreground mb-4">
            The wDOG meme collection showcases the community's creativity and humor.
          </p>
          <p className="text-sm text-muted-foreground">
            All memes are created by the wDOG community. Share and enjoy responsibly! 🐕‍🦺
          </p>
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <div className="relative max-w-full max-h-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10"
              onClick={closeFullscreen}
            >
              <span className="text-xl">×</span>
            </Button>
            
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            
            <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-4">
              <Button
                variant="secondary"
                size="sm"
                className="bg-black/50 hover:bg-black/70 text-white"
                onClick={() => handleImageDownload(selectedImage.src, selectedImage.id)}
              >
                <Image className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Video Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <div className="relative max-w-full max-h-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10"
              onClick={closeFullscreen}
            >
              <span className="text-xl">×</span>
            </Button>
            
            <video
              src={selectedVideo.src}
              className="max-w-full max-h-full object-contain rounded-lg"
              controls
              autoPlay
              muted={false}
            />
            
            <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-4">
              <Button
                variant="secondary"
                size="sm"
                className="bg-black/50 hover:bg-black/70 text-white"
                onClick={() => handleVideoDownload(selectedVideo.src, selectedVideo.title)}
              >
                <Video className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemeGallery; 