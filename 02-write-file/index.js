const fs =  require('fs');
const path = require('path');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Enter text');
readline.on('close',() => console.log('GoodBay'));
readline.on('line', (text)=> {
  if(text === 'exit') {
    readline.close();
  } else {
    fs.appendFile(path.join(__dirname, 'note.txt'), text + '\n', (error)=> {
      if(error) {
        throw error;
      }
    });
  }
});
