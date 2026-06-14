const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'mkmka', 'Desktop', 'Adomantra Dated 11 Jun 26', 'Final-Adomantra-2026-main', 'adotrip.html');
const content = fs.readFileSync(filePath, 'utf-8');

const regex = /<style[^>]*>([\s\S]*?)<\/style>/g;
const match = regex.exec(content);
if (match) {
  fs.writeFileSync('.gemini/style_block_1.css', match[1]);
  console.log("Dumped style block 1 to .gemini/style_block_1.css");
} else {
  console.log("No style block 1 found");
}
