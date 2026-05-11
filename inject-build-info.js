const fs = require('fs');

const buildNumber = process.argv[2];

if (!buildNumber) {
  console.error('ERROR: build number argument is required');
  process.exit(1);
}

const now = new Date();
const pad = (n) => String(n).padStart(2, '0');

const shanghaiOffset = 8 * 60;
const localOffset = now.getTimezoneOffset();
const shanghaiTime = new Date(now.getTime() + (shanghaiOffset + localOffset) * 60 * 1000);

const year = shanghaiTime.getFullYear();
const month = pad(shanghaiTime.getMonth() + 1);
const day = pad(shanghaiTime.getDate());
const hours = pad(shanghaiTime.getHours());
const minutes = pad(shanghaiTime.getMinutes());
const seconds = pad(shanghaiTime.getSeconds());
const deployTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

const html = fs.readFileSync('index.html', 'utf8');

const updated = html
    .replace('<span id="deploy-time">--</span>', `<span id="deploy-time">${deployTime}</span>`)
    .replace('<span id="build-number">--</span>', `<span id="build-number">${buildNumber}</span>`);

if (updated === html) {
  console.error('ERROR: No placeholders were replaced. Check if index.html contains the expected placeholder spans.');
  process.exit(1);
}

fs.writeFileSync('index.html', updated);
console.log('Build info injected successfully');
console.log(`Deploy time: ${deployTime}`);
console.log(`Build number: ${buildNumber}`);
