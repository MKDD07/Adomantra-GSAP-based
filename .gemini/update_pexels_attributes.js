const fs = require('fs');
const path = require('path');

const backupPath = path.join('c:', 'Users', 'mkmka', 'Desktop', 'Adomantra Dated 11 Jun 26', 'Final-Adomantra-2026-main', 'adotrip_backup.html');
const targetPath = path.join('c:', 'Users', 'mkmka', 'Desktop', 'Adomantra Dated 11 Jun 26', 'Final-Adomantra-2026-main', 'adotrip.html');

let content = fs.readFileSync(backupPath, 'utf-8');

console.log("Parsing backup HTML content...");

// 1. Exclusive Offers Section
// Match card offer-card blocks and add data-pexels and data-pexels-random, preserving original src
const offerCardRegex = /<div class="card offer-card">([\s\S]*?)<\/div>\s*<\/div>/gi;
content = content.replace(offerCardRegex, (match) => {
  const titleMatch = match.match(/<h6[^>]*>([\s\S]*?)<\/h6>/i);
  const descMatch = match.match(/<p class="mb-1">([\s\S]*?)<\/p>/i);
  
  const title = titleMatch ? titleMatch[1].trim() : '';
  const desc = descMatch ? descMatch[1].trim() : '';
  
  let query = 'travel deals';
  if (desc.toLowerCase().includes('flight')) {
    query = 'airplane flying sky passenger jet';
  } else if (desc.toLowerCase().includes('hotel')) {
    query = 'luxury hotel resort swimming pool';
  } else if (desc.toLowerCase().includes('holiday')) {
    query = 'vacation beach tropical resort';
  }
  
  const newMatch = match.replace(/<img\s+([^>]*?)src="([^"]+)"([^>]*?)>/i, (imgMatch, before, src, after) => {
    return `<img ${before}src="${src}" data-pexels="${query}" data-pexels-random ${after}>`;
  });
  
  return newMatch;
});
console.log("Updated Exclusive Offers images, preserving original source.");

// 2. Recommended Packages
const holidayBoxedRegex = /<div class="holiday_small_boxed">([\s\S]*?)<\/div>\s*<\/div>/gi;
content = content.replace(holidayBoxedRegex, (match) => {
  const h3Match = match.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
  if (!h3Match) return match;
  
  const h3Text = h3Match[1].replace(/&amp;/g, '&').trim();
  const query = h3Text
    .replace(/(Tour)?\s*Package/gi, '')
    .replace(/\d+\s*(Nights?|Days?)/gi, '')
    .replace(/[^a-zA-Z0-9\s&]/g, '')
    .trim() + " travel tourism scenery";
    
  const newMatch = match.replace(/<img\s+([^>]*?)src="([^"]+)"([^>]*?)>/i, (imgMatch, before, src, after) => {
    return `<img ${before}src="${src}" data-pexels="${query}" data-pexels-random ${after}>`;
  });
  
  return newMatch;
});
console.log("Updated Recommended Packages images, preserving original source.");

// 3. Recommended Hotels
const hotelCardRegex = /<div class="hotel-card">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/gi;
content = content.replace(hotelCardRegex, (match) => {
  const h5Match = match.match(/<h5[^>]*>([\s\S]*?)<\/h5>/i);
  const locMatch = match.match(/<p class="text-muted mb-2">([\s\S]*?)<\/p>/i);
  
  if (!h5Match) return match;
  
  const hotelName = h5Match[1].trim();
  let city = 'resort';
  if (locMatch) {
    const locText = locMatch[1].replace(/<[^>]*>/g, '').trim();
    const parts = locText.split('\n').map(p => p.trim()).filter(p => p);
    if (parts.length > 0) city = parts[0];
  }
  
  const query = `luxury hotel room resort ${city}`.trim();
  
  const newMatch = match.replace(/<img\s+([^>]*?)src="([^"]+)"([^>]*?)>/i, (imgMatch, before, src, after) => {
    return `<img ${before}src="${src}" data-pexels="${query}" data-pexels-random ${after}>`;
  });
  
  return newMatch;
});
console.log("Updated Recommended Hotels images, preserving original source.");

// 4. Tourist Attractions
const destinationItemRegex = /<div class="destination-item">([\s\S]*?)<\/div>/gi;
content = content.replace(destinationItemRegex, (match) => {
  const spanMatch = match.match(/<span>([\s\S]*?)<\/span>/i);
  if (!spanMatch) return match;
  
  const placeName = spanMatch[1].trim();
  const query = `${placeName} travel tourism scenery`.trim();
  
  const newMatch = match.replace(/<img\s+([^>]*?)src="([^"]+)"([^>]*?)>/i, (imgMatch, before, src, after) => {
    return `<img ${before}src="${src}" data-pexels="${query}" data-pexels-random ${after}>`;
  });
  
  return newMatch;
});
console.log("Updated Famous Tourist Attraction images, preserving original source.");

// 5. Replace Graphic Tab Images with FontAwesome Icons
// Flights tab
content = content.replace(/<img[^>]*src="public\/img\/flight\.png"[^>]*>\s*Flights/gi, '<i class="fa-solid fa-plane"></i> Flights');
// Hotels tab
content = content.replace(/<img[^>]*src="public\/img\/hotel\.png"[^>]*>\s*Hotels/gi, '<i class="fa-solid fa-hotel"></i> Hotels');
// Holidays tab
content = content.replace(/<img[^>]*src="public\/img\/holiday\.png"[^>]*>\s*Holidays/gi, '<i class="fa-solid fa-umbrella-beach"></i> Holidays');
console.log("Replaced Booking nav tab images with FontAwesome icons.");

// 6. Replace Why Book With Us Section Graphic Icons with FontAwesome Icons
content = content.replace(/<img[^>]*src="public\/img\/icons\/booking\.png"[^>]*>/gi, '<i class="fa-solid fa-calendar-check why-icon" aria-hidden="true"></i>');
content = content.replace(/<img[^>]*src="public\/img\/icons\/low-price\.png"[^>]*>/gi, '<i class="fa-solid fa-tags why-icon" aria-hidden="true"></i>');
content = content.replace(/<img[^>]*src="public\/img\/icons\/refund\.png"[^>]*>/gi, '<i class="fa-solid fa-hand-holding-dollar why-icon" aria-hidden="true"></i>');
content = content.replace(/<img[^>]*src="public\/img\/icons\/24-hours-support\.png"[^>]*>/gi, '<i class="fa-solid fa-headset why-icon" aria-hidden="true"></i>');
content = content.replace(/<img[^>]*src="public\/img\/icons\/hand-shake\.png"[^>]*>/gi, '<i class="fa-solid fa-handshake why-icon" aria-hidden="true"></i>');
console.log("Replaced Why Book graphic icons with FontAwesome icons.");

// 7. Inject Pexels Loader script tag before </body>
if (!content.includes('pexels-service-final.js')) {
  const scriptTag = '\n    <script src="assets/js/pexels-service-final.js"></script>\n';
  content = content.replace('</body>', scriptTag + '</body>');
  console.log("Injected pexels-service-final.js script tag before </body>.");
}

// Write the modified content to adotrip.html
fs.writeFileSync(targetPath, content, 'utf-8');
console.log("adotrip.html updated successfully with Pexels attributes, fallbacks preserved, and FontAwesome icons.");
