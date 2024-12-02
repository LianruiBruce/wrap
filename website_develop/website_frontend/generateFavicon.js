const sharp = require("sharp");
const toIco = require("to-ico");
const fs = require("fs");

// Create an SVG for the "W" icon
const svg = `
<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="12" fill="white"/>
    <text 
        x="50%" 
        y="50%" 
        font-family="Arial, sans-serif" 
        font-size="40"
        font-weight="bold"
        fill="black"
        text-anchor="middle"
        dominant-baseline="central">
        W
    </text>
</svg>`;

async function generateFavicon() {
  try {
    // Convert SVG to PNG
    const pngBuffer = await sharp(Buffer.from(svg)).resize(64, 64).toBuffer();

    // Create various sizes for the ICO
    const sizes = [16, 32, 48];
    const images = await Promise.all(
      sizes.map((size) => sharp(pngBuffer).resize(size, size).toBuffer())
    );

    // Convert to ICO with multiple sizes
    const icoBuffer = await toIco(images);

    // Write the ICO file
    fs.writeFileSync("public/Wrap.ico", icoBuffer);

    console.log("Successfully created Wrap.ico with multiple sizes");
  } catch (error) {
    console.error("Error generating favicon:", error);
  }
}

generateFavicon();
