import ejs from "ejs";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Helper to resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define directories
const viewsDir = path.join(__dirname, "views");
const publicDir = path.join(__dirname, "public");
const outputDir = path.join(__dirname, "docs");

// Ensure the output directory exists
await fs.mkdir(outputDir, { recursive: true });

// Render EJS to HTML
const pages = ["home"]; // Add more pages if needed

for (const page of pages) {
  const html = await ejs.renderFile(
    path.join(viewsDir, `${page}.ejs`),
    {}, // Pass additional data here if needed
    { root: viewsDir } // Set root to resolve partials
  );
  await fs.writeFile(path.join(outputDir, `${page}.html`), html);
}

// Copy public assets to docs folder
const copyDirectory = async (source, destination) => {
  await fs.mkdir(destination, { recursive: true });
  const items = await fs.readdir(source, { withFileTypes: true });

  for (const item of items) {
    const srcPath = path.join(source, item.name);
    const destPath = path.join(destination, item.name);

    if (item.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
};

await copyDirectory(publicDir, path.join(outputDir, "public"));

console.log("Static files generated successfully in the 'docs' folder.");
