const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true},(err, files)=> {
  if(err) {
    throw err;
  }
  files.forEach(item=> {
    if(item.isFile()) {
      fs.stat(path.join(__dirname,'secret-folder', item.name), (err, stats)=> {
        if(err) {
          throw err;
        }
        console.log(
          path.parse(item.name).name,
          ' - ',
          path.parse(item.name).ext.slice(1),
          ' - ',
          (stats.size / 1024) + 'kb');
      });
    }
  });
});

