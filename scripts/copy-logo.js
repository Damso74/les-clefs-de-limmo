const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const imagesDir = path.join(root, "public", "images");

const logos = [
  { src: "Logo village des Clefs.png", dest: "logo-village-des-clefs.png" },
  { src: "lesclefs-blason.png", dest: "lesclefs-blason.png" },
];

fs.mkdirSync(imagesDir, { recursive: true });

logos.forEach(({ src, dest }) => {
  const srcPath = path.join(root, src);
  const destPath = path.join(imagesDir, dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`${src} → public/images/${dest}`);
  }
});
