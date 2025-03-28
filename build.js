/**
 * Custom build script to handle the proper build sequence
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting build process...');

// Find index.html in the project structure
function findIndexHtml(dir) {
  const files = fs.readdirSync(dir);
  
  // Check if index.html exists in this directory
  if (files.includes('index.html')) {
    return path.join(dir, 'index.html');
  }
  
  // Recursively check subdirectories
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    // Skip node_modules and .git directories
    if (stat.isDirectory() && file !== 'node_modules' && file !== '.git' && file !== 'dist') {
      try {
        const indexPath = findIndexHtml(filePath);
        if (indexPath) {
          return indexPath;
        }
      } catch (error) {
        // Continue searching other directories if error occurs
      }
    }
  }
  
  return null;
}

// Find index.html
const indexPath = findIndexHtml(__dirname);
if (!indexPath) {
  console.error('❌ index.html not found in the project!');
  process.exit(1);
} else {
  console.log(`✅ Found index.html at: ${indexPath}`);
  
  // If index.html is not in the root, copy it to the root for the build
  if (path.dirname(indexPath) !== __dirname) {
    console.log(`📝 Copying index.html to project root for build...`);
    fs.copyFileSync(indexPath, path.join(__dirname, 'index.html'));
  }
}

// Ensure favicon.ico exists and is in the right place
const publicFaviconPath = path.join(__dirname, 'public', 'favicon.ico');
const rootFaviconPath = path.join(__dirname, 'favicon.ico');

if (!fs.existsSync(publicFaviconPath)) {
  console.log('⚠️ favicon.ico not found in public directory, creating a placeholder...');
  
  // Create public directory if it doesn't exist
  if (!fs.existsSync(path.join(__dirname, 'public'))) {
    fs.mkdirSync(path.join(__dirname, 'public'), { recursive: true });
  }
  
  // Copy an existing image to use as favicon if available
  const possibleImages = [
    './public/og-image.png',
    './public/logo.png',
    './public/icon.png'
  ];
  
  let copied = false;
  for (const imgPath of possibleImages) {
    if (fs.existsSync(imgPath)) {
      console.log(`📝 Using ${imgPath} as favicon`);
      fs.copyFileSync(imgPath, publicFaviconPath);
      copied = true;
      break;
    }
  }
  
  if (!copied) {
    console.log('⚠️ No suitable image found for favicon, creating empty file');
    fs.writeFileSync(publicFaviconPath, '');
  }
}

// Copy favicon to root as a fallback
console.log('📝 Copying favicon.ico to project root as fallback...');
fs.copyFileSync(publicFaviconPath, rootFaviconPath);

try {
  // Run TypeScript check without emitting files
  console.log('🔍 Running TypeScript check...');
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  
  // Run Vite build
  console.log('🏗️ Building project with Vite...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
  
  if (fs.existsSync('./dist')) {
    console.log(`
📁 The "dist" folder has been created with the following contents:
${fs.readdirSync('./dist').map(file => `  - ${file}`).join('\n')}

Ready to deploy! You can upload these files to your web server.
    `);
    
    // Ensure favicon is in the dist folder
    if (!fs.existsSync('./dist/favicon.ico')) {
      console.log('📝 Copying favicon.ico to dist folder...');
      fs.copyFileSync(publicFaviconPath, path.join(__dirname, 'dist', 'favicon.ico'));
    }
  }
  
  // Clean up temporary files
  if (path.dirname(indexPath) !== __dirname && fs.existsSync(path.join(__dirname, 'index.html'))) {
    console.log(`🧹 Cleaning up temporary index.html...`);
    fs.unlinkSync(path.join(__dirname, 'index.html'));
  }
  
  // Clean up temporary favicon in root
  if (fs.existsSync(rootFaviconPath)) {
    console.log(`🧹 Cleaning up temporary favicon.ico from root...`);
    fs.unlinkSync(rootFaviconPath);
  }
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
