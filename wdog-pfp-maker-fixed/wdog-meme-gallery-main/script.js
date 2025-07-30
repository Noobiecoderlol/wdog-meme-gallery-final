// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function() {
    // Get the container elements where content will be dynamically added
    const imageGrid = document.getElementById('image-grid');
    const videoGrid = document.getElementById('video-grid');
    
    // Configuration for the gallery
    const TOTAL_IMAGES = 1000; // Set to a high number - will gracefully handle missing images
    const IMAGE_FOLDER = 'images/'; // Folder containing the images
    const VIDEO_FOLDER = 'videos/'; // Folder containing the videos
    
    // Performance optimization: batch size for creating content
    const BATCH_SIZE = 30; // Process content in batches to avoid blocking the UI
    
    // Track loaded content counts
    let loadedImages = 0;
    let loadedVideos = 0;
    let processedImages = new Set(); // Track which images have been processed to avoid duplicates
    let processedVideos = new Set(); // Track which videos have been processed to avoid duplicates
    
    // Get video files from the videos folder
    const videoFiles = [
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
    
    /**
     * Creates a single image element with proper attributes and error handling
     * @param {number} imageNumber - The sequential number of the image (1-729)
     * @returns {HTMLImageElement} - The created image element
     */
    function createImageElement(imageNumber) {
        // Create a new image element
        const img = document.createElement('img');
        
        // Try lowercase .jpg first, then uppercase .JPG if that fails
        // This handles mixed case extensions in the image folder
        img.src = IMAGE_FOLDER + imageNumber + '.jpg';
        
        // Enable native browser lazy loading for performance optimization
        img.loading = 'lazy';
        
        // Add alt text for accessibility
        img.alt = `Meme ${imageNumber}`;
        
        // Add a title attribute for tooltip on hover
        img.title = `Meme #${imageNumber}`;
        
        // Add error handling for images that fail to load
        img.onerror = function() {
            // If lowercase .jpg failed, try uppercase .JPG
            if (img.src.endsWith('.jpg')) {
                console.log(`Trying uppercase extension for image ${imageNumber}`);
                img.src = IMAGE_FOLDER + imageNumber + '.JPG';
            } else {
                // Both extensions failed, hide the broken image
                console.log(`Image ${imageNumber} not found - gracefully hiding`);
                img.style.display = 'none';
                
                // Mark as processed but don't count it (since it doesn't exist)
                if (!processedImages.has(imageNumber)) {
                    processedImages.add(imageNumber);
                    // Don't increment loadedImages for missing images
                    updateImageCount();
                }
            }
        };
        
        // Add load event handler for successful image loading
        img.onload = function() {
            // Image loaded successfully
            img.style.opacity = '1';
            
            // Only increment count if this image hasn't been counted before
            if (!processedImages.has(imageNumber)) {
                processedImages.add(imageNumber);
                loadedImages++;
                updateImageCount();
            }
        };
        
        return img;
    }
    
    /**
     * Creates a single video element with proper attributes and styling
     * @param {string} videoFileName - The name of the video file
     * @param {number} index - The index of the video in the array
     * @returns {HTMLElement} - The created video container element
     */
    function createVideoElement(videoFileName, index) {
        // Create video container
        const container = document.createElement('div');
        container.className = 'video-container';
        
        // Create video element
        const video = document.createElement('video');
        video.src = VIDEO_FOLDER + videoFileName;
        video.preload = 'metadata'; // Only load metadata for performance
        video.muted = false; // Allow sound when user clicks to play
        
        // Create play button overlay
        const playButton = document.createElement('div');
        playButton.className = 'play-button';
        playButton.innerHTML = '▶️';
        
        // Create video title overlay
        const videoTitle = document.createElement('div');
        videoTitle.className = 'video-title';
        // Clean up the filename for display (remove extensions and special characters)
        const cleanTitle = videoFileName
            .replace(/\.mp4$/, '')
            .replace(/\(online-video-cutter\.com\)/g, '')
            .replace(/ copy/g, '')
            .replace(/\s+/g, ' ')
            .trim();
        videoTitle.textContent = cleanTitle;
        
        // Add click handler for video playback
        container.addEventListener('click', function() {
            if (video.paused) {
                // Play the video
                video.play();
                playButton.style.display = 'none';
                videoTitle.style.display = 'none';
            } else {
                // Pause the video
                video.pause();
                playButton.style.display = 'flex';
                videoTitle.style.display = 'block';
            }
        });
        
        // Add video event handlers
        video.addEventListener('ended', function() {
            playButton.style.display = 'flex';
            videoTitle.style.display = 'block';
        });
        
        video.addEventListener('loadedmetadata', function() {
            // Only increment count if this video hasn't been counted before
            if (!processedVideos.has(index)) {
                processedVideos.add(index);
                loadedVideos++;
                updateVideoCount();
            }
        });
        
        // Add error handling
        video.addEventListener('error', function() {
            console.warn(`Failed to load video: ${videoFileName}`);
            container.style.display = 'none';
            
            // Still count it as processed to avoid counting issues
            if (!processedVideos.has(index)) {
                processedVideos.add(index);
                loadedVideos++;
                updateVideoCount();
            }
        });
        
        // Assemble the video container
        container.appendChild(video);
        container.appendChild(playButton);
        container.appendChild(videoTitle);
        
        return container;
    }
    
    /**
     * Updates the image count display in the navigation tab
     */
    function updateImageCount() {
        const imageCountElement = document.getElementById('image-count');
        if (imageCountElement) {
            // Ensure we don't exceed the total number of images
            const actualCount = Math.min(loadedImages, TOTAL_IMAGES);
            imageCountElement.textContent = actualCount;
        }
    }
    
    /**
     * Updates the video count display in the navigation tab
     */
    function updateVideoCount() {
        const videoCountElement = document.getElementById('video-count');
        if (videoCountElement) {
            // Ensure we don't exceed the total number of videos
            const actualCount = Math.min(loadedVideos, videoFiles.length);
            videoCountElement.textContent = actualCount;
        }
    }
    
    /**
     * Processes a batch of images to avoid blocking the UI thread
     * @param {number} startIndex - Starting index for this batch
     * @param {number} endIndex - Ending index for this batch
     */
    function processImageBatch(startIndex, endIndex) {
        // Create images for the current batch
        for (let i = startIndex; i <= endIndex && i <= TOTAL_IMAGES; i++) {
            const imgElement = createImageElement(i);
            imageGrid.appendChild(imgElement);
        }
        
        // If there are more images to process, schedule the next batch
        if (endIndex < TOTAL_IMAGES) {
            // Use requestAnimationFrame for smooth performance
            requestAnimationFrame(() => {
                processImageBatch(endIndex + 1, endIndex + BATCH_SIZE);
            });
        } else {
            // All images have been processed
            console.log(`Processed ${TOTAL_IMAGES} image slots - ${loadedImages} images actually loaded`);
            
            // Final count verification and correction
            const finalCount = Math.min(loadedImages, TOTAL_IMAGES);
            loadedImages = finalCount;
            updateImageCount();
            console.log(`Final image count: ${finalCount} (out of ${TOTAL_IMAGES} attempted)`);
        }
    }
    
    /**
     * Processes a batch of videos to avoid blocking the UI thread
     * @param {number} startIndex - Starting index for this batch
     * @param {number} endIndex - Ending index for this batch
     */
    function processVideoBatch(startIndex, endIndex) {
        // Create videos for the current batch
        for (let i = startIndex; i <= endIndex && i < videoFiles.length; i++) {
            const videoElement = createVideoElement(videoFiles[i], i);
            videoGrid.appendChild(videoElement);
        }
        
        // If there are more videos to process, schedule the next batch
        if (endIndex < videoFiles.length) {
            // Use requestAnimationFrame for smooth performance
            requestAnimationFrame(() => {
                processVideoBatch(endIndex + 1, endIndex + BATCH_SIZE);
            });
        } else {
            // All videos have been processed
            console.log(`Successfully loaded ${videoFiles.length} videos into the gallery`);
        }
    }
    
    /**
     * Initializes the image gallery by starting the batch processing
     */
    function initializeImages() {
        console.log('Initializing image gallery...');
        processImageBatch(1, BATCH_SIZE);
    }
    
    /**
     * Initializes the video gallery by starting the batch processing
     */
    function initializeVideos() {
        console.log('Initializing video gallery...');
        processVideoBatch(0, BATCH_SIZE);
    }
    
    /**
     * Handles tab switching between images and videos
     */
    function initializeTabNavigation() {
        const navTabs = document.querySelectorAll('.nav-tab');
        const contentGrids = document.querySelectorAll('.content-grid');
        
        navTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const targetContent = this.getAttribute('data-content');
                console.log(`Switching to ${targetContent} tab`);
                
                // Update active tab
                navTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Update active content
                contentGrids.forEach(grid => {
                    grid.classList.remove('active');
                });
                
                if (targetContent === 'images') {
                    imageGrid.classList.add('active');
                    console.log('Image grid activated');
                } else if (targetContent === 'videos') {
                    videoGrid.classList.add('active');
                    console.log('Video grid activated');
                }
            });
        });
    }
    
    // Initialize everything when the page loads
    const startTime = performance.now();
    
    // Initialize tab navigation
    initializeTabNavigation();
    
    // Initialize both galleries
    initializeImages();
    initializeVideos();
    
    // Log performance metrics after a short delay
    setTimeout(() => {
        const endTime = performance.now();
        console.log(`Gallery initialization took ${(endTime - startTime).toFixed(2)}ms`);
    }, 100);
});

// Add a simple click handler for images (optional enhancement)
document.addEventListener('click', function(event) {
    // Check if the clicked element is an image in our gallery
    if (event.target.tagName === 'IMG' && event.target.closest('#image-grid')) {
        // Get the image source for potential full-size viewing
        const imageSrc = event.target.src;
        const imageNumber = event.target.alt.split(' ')[1]; // Extract number from alt text
        
        console.log(`Clicked on meme #${imageNumber}`);
        
        // Optional: Add functionality like opening in a modal or new tab
        // For now, just log the click event
    }
}); 