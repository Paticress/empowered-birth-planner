
/**
 * Custom build script to handle the proper build sequence
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting build process...');

// Check if index.html exists in the root directory
const indexPath = path.join(__dirname, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error('❌ index.html not found in the root directory!');
  process.exit(1);
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
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
