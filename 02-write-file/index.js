const fs =  require('fs');
const path = require('path');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

function ifError(err) {
  if(err){
    throw err;
  }
}

const notePath = path.join(__dirname, 'note.txt');

const writeStream = fs.createWriteStream(notePath);
readline.write('Enter text\n');
readline.on('close',() => console.log('GoodBay'));
readline.on('line', (text)=> {
  if(text === 'exit') {
    readline.close();
    writeStream.close();
  } else {
    writeStream.write( text + '\n', (error)=> {
      ifError(error);
    });
  }
});
