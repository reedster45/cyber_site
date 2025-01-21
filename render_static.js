
import ejs from "ejs";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Helper to get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const viewsDir = path.join(__dirname, "views");
const publicDir = path.join(__dirname, "public");
const outputDir = path.join(__dirname, "docs");

// Ensure the output directory exists
await fs.mkdir(outputDir, { recursive: true });

// Function to render an EJS file to HTML
const renderEJS = async (templatePath, data = {}) => {
  const template = await fs.readFile(templatePath, "utf8");
  return ejs.render(template, data, { root: viewsDir });
};

// Render main pages
const pages = ["home"]; // Add more pages as needed
for (const page of pages) {
  const html = await renderEJS(path.join(viewsDir, `${page}.ejs`));
  await fs.writeFile(path.join(outputDir, `${page}.html`), html);
}

// Function to copy files/folders
const copyFolderRecursive = async (source, destination) => {
  await fs.mkdir(destination, { recursive: true });
  const items = await fs.readdir(source, { withFileTypes: true });
  for (const item of items) {
    const srcPath = path.join(source, item.name);
    const destPath = path.join(destination, item.name);
    if (item.isDirectory()) {
      await copyFolderRecursive(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
};

// Copy public assets to the docs folder
await copyFolderRecursive(publicDir, path.join(outputDir, "public"));

console.log("Static files generated successfully in the 'docs' folder.");
