const path = require('path');
const fs = require('fs');

const fromPath = path.join(__dirname, 'files');
const toPath = path.join(__dirname, 'files-copy');

function ifError(err) {
  if(err){
    throw err;
  }
}

function copyDir (from, to) {
  fs.stat(to, (err)=> {
    if(err) {
      fs.mkdir(to, (err)=> {
        ifError(err);
      });
    }
  });

  fs.readdir(from, {withFileTypes: true}, (err, files)=>{
    ifError(err);

    files.forEach((item)=> {
      const newFromPath = path.join(from, item.name);
      const newToPath = path.join(to,item.name);
      if(item.isDirectory()) {
        copyDir(newFromPath, newToPath);
      }
      if(item.isFile()){
        fs.copyFile(newFromPath, newToPath, (err)=> {
          ifError(err);
        });
      }
    });
  });
}

copyDir(fromPath, toPath);

