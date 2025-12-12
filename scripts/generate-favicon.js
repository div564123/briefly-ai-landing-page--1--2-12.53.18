// Script to generate favicon PNGs from SVG
// This requires sharp to be installed: npm install sharp

const fs = require('fs');
const path = require('path');

// SVG content for Capso AI logo
const svgContent = `<svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- White square with rounded corners -->
  <rect
    x="20"
    y="20"
    width="140"
    height="140"
    rx="28"
    fill="white"
  />
  <!-- Purple circle -->
  <circle
    cx="90"
    cy="90"
    r="45"
    fill="#6D5BFF"
  />
  <!-- White "C" letter - stylized and modern with open ends -->
  <path
    d="M 67.5 50 C 54 50 45 59 45 67.5 L 45 112.5 C 45 121 54 130 67.5 130 C 76.5 130 85.5 121.5 90 112.5"
    stroke="white"
    strokeWidth="11"
    strokeLinecap="round"
    fill="none"
  />
  <!-- Top curve of C -->
  <path
    d="M 67.5 50 C 76.5 50 85.5 58.5 90 67.5"
    stroke="white"
    strokeWidth="11"
    strokeLinecap="round"
    fill="none"
  />
</svg>`;

try {
  const sharp = require('sharp');
  const publicDir = path.join(__dirname, '..', 'public');
  
  // Create a buffer from SVG
  const svgBuffer = Buffer.from(svgContent);
  
  // Generate 32x32 PNG (for light and dark, they'll be the same for now)
  sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'icon-light-32x32.png'))
    .then(() => {
      console.log('✅ Generated icon-light-32x32.png');
      return sharp(svgBuffer)
        .resize(32, 32)
        .png()
        .toFile(path.join(publicDir, 'icon-dark-32x32.png'));
    })
    .then(() => {
      console.log('✅ Generated icon-dark-32x32.png');
      return sharp(svgBuffer)
        .resize(180, 180)
        .png()
        .toFile(path.join(publicDir, 'apple-icon.png'));
    })
    .then(() => {
      console.log('✅ Generated apple-icon.png');
      console.log('✅ All favicon files generated successfully!');
    })
    .catch((err) => {
      console.error('❌ Error generating favicons:', err);
      console.log('\n💡 Tip: Install sharp with: npm install sharp');
    });
} catch (error) {
  console.error('❌ Sharp not found. Please install it with: npm install sharp');
  console.log('\nAlternatively, you can manually convert the SVG to PNG using an online tool or image editor.');
  process.exit(1);
}






























