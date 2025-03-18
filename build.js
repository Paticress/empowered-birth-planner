
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
      const indexPath = findIndexHtml(filePath);
      if (indexPath) {
        return indexPath;
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
  }
  
  // If we copied index.html to root, clean it up
  const tempIndexPath = path.join(__dirname, 'index.html');
  if (path.dirname(indexPath) !== __dirname && fs.existsSync(tempIndexPath)) {
    console.log(`🧹 Cleaning up temporary index.html...`);
    fs.unlinkSync(tempIndexPath);
  }
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
