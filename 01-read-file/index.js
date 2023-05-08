const fs = require('fs');
const path = require('path');
const process = require('node:process');

const readSteam = fs.createReadStream(path.join(__dirname, 'text.txt'));
readSteam.pipe(process.stdout);
