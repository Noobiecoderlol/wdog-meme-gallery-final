import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the videos folder (keeping existing structure)
const videosDir = path.join(__dirname, '../public/memes/videos/');

try {
  // Read all files in the videos directory
  const files = fs.readdirSync(videosDir);
  
  // Filter for .mp4 files only
  const videos = files
    .filter(file => file.toLowerCase().endsWith('.mp4'))
    .sort(); // Sort alphabetically for consistent ordering
  
  // Create manifest object
  const manifest = { 
    videos,
    count: videos.length,
    generatedAt: new Date().toISOString()
  };
  
  // Write to data directory
  const outputPath = path.join(__dirname, '../src/data/videos-manifest.json');
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
  
  console.log(`✅ Generated video manifest with ${videos.length} videos:`);
  console.log(`📁 Output: ${outputPath}`);
  console.log(`🎥 Videos: ${videos.join(', ')}`);
  
} catch (error) {
  console.error('❌ Error generating video manifest:', error.message);
  process.exit(1);
} 