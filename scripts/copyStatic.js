const fs = require('fs');
const path = require('path');

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Copy index.html to dist
fs.copyFileSync(
  path.join(__dirname, '../src/index.html'),
  path.join(__dirname, '../dist/index.html')
);

// Copy styles.css to dist
fs.copyFileSync(
  path.join(__dirname, '../src/styles.css'),
  path.join(__dirname, '../dist/styles.css')
); 