const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'mkmka', 'Desktop', 'Adomantra Dated 11 Jun 26', 'Final-Adomantra-2026-main', 'adotrip.html');
const cssPath = path.join('c:', 'Users', 'mkmka', 'Desktop', 'Adomantra Dated 11 Jun 26', 'Final-Adomantra-2026-main', '.gemini', 'clean_styles.css');
const backupPath = path.join('c:', 'Users', 'mkmka', 'Desktop', 'Adomantra Dated 11 Jun 26', 'Final-Adomantra-2026-main', 'adotrip_backup.html');

// Read html content
let htmlContent = fs.readFileSync(filePath, 'utf-8');

// Write backup if not exists
if (!fs.existsSync(backupPath)) {
  fs.writeFileSync(backupPath, htmlContent, 'utf-8');
  console.log("Backup created at:", backupPath);
}

// Read clean css
const cleanCss = fs.readFileSync(cssPath, 'utf-8');

// Remove all style blocks from the content
let cleanedContent = htmlContent.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

// Insert the new style block in <head>
const styleElement = `\n    <style>\n${cleanCss}\n    </style>\n`;

if (cleanedContent.includes('</head>')) {
  cleanedContent = cleanedContent.replace('</head>', styleElement + '</head>');
  console.log("Style block successfully inserted in <head>.");
} else {
  console.log("WARNING: </head> tag not found, prepending style block to page.");
  cleanedContent = styleElement + cleanedContent;
}

// Save back
fs.writeFileSync(filePath, cleanedContent, 'utf-8');
console.log("adotrip.html processed successfully. All style tags consolidated and conflicts removed.");
