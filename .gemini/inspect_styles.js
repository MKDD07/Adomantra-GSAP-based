const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'mkmka', 'Desktop', 'Adomantra Dated 11 Jun 26', 'Final-Adomantra-2026-main', 'adotrip.html');
const content = fs.readFileSync(filePath, 'utf-8');

const regex = /<style[^>]*>([\s\S]*?)<\/style>/g;
let match;
let count = 0;

while ((match = regex.exec(content)) !== null) {
  count++;
  const styleContent = match[1];
  const startIndex = match.index;
  const endIndex = regex.lastIndex;
  
  // Calculate line numbers
  const startLine = content.substring(0, startIndex).split('\n').length;
  const endLine = content.substring(0, endIndex).split('\n').length;
  
  const innerLines = styleContent.trim().split('\n');
  console.log(`\n===================================`);
  console.log(`STYLE BLOCK ${count}: Lines ${startLine} to ${endLine}`);
  console.log(`Total CSS lines: ${innerLines.length}`);
  console.log(`===================================`);
  
  if (innerLines.length <= 25) {
    console.log(innerLines.join('\n'));
  } else {
    console.log(innerLines.slice(0, 15).join('\n'));
    console.log('   ...\n   [TRUNCATED]\n   ...');
    console.log(innerLines.slice(-15).join('\n'));
  }
}
