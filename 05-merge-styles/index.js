const path = require('path');
const fs = require('fs');

const pathBundle = path.join(__dirname,'project-dist', 'bundle.css');
const pathStyles = path.join(__dirname,'styles');

function ifError(err) {
  if(err){
    throw err;
  }
}

let i = 0;
function writeToFile(from, to, flags) {
  const readStr = fs.createReadStream(from);
  const writeStr = fs.createWriteStream(to, {flags});
  if(flags) {
    writeStr.write('\n');
  }
  readStr.pipe(writeStr);
  writeStr.on('finish', ()=> {
    i+=1;
    // writeStr.write('\n');
    const nextFileName = arrStyles[i]?.name;
    if(nextFileName){
      writeToFile(path.join(pathStyles,nextFileName), to, 'a');
    }
  });
}

let arrStyles = [];
fs.readdir(pathStyles, {withFileTypes: true}, ( err, files)=> {
  ifError(err);
  arrStyles = files.filter((item)=> item.isFile() && path.extname(item.name) === '.css');
  writeToFile(path.join(pathStyles, arrStyles[0]?.name), pathBundle);
});

