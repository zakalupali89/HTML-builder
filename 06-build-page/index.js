const path = require('path');
const fs = require('fs');

const distPath = path.join(__dirname, 'project-dist');
const stylesFolderPath = path.join(__dirname,'styles');
const stylesPath = path.join(__dirname,'project-dist', 'style.css');
const assetsPath = path.join(__dirname, 'assets');
const toPath = path.join(__dirname, 'project-dist/assets');

function ifError(err) {
  if(err){
    throw err;
  }
}

function copyPath (from, to) {
  fs.mkdir(to, (err)=> {
    ifError(err);
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
  });
}

function copyDir (from, to) {
  fs.stat(to, (err)=> {
    if(err) {
      copyPath(from, to);
    } else {
      fs.rm(to,{recursive: true}, (err)=> {
        ifError(err);
        copyPath(from, to);
      });
    }
  });
}

function mergeStyles() {
  let i = 0;
  function writeToFile(from, to, flags) {
    const readStr = fs.createReadStream(from);
    const writeStr = fs.createWriteStream(to, {flags});
    readStr.pipe(writeStr);
    writeStr.on('finish', ()=> {
      i+=1;
      const nextFileName = arrStyles[i]?.name;
      if(nextFileName){
        writeToFile(path.join(stylesFolderPath,nextFileName), to, 'a');
      }
    });
  }

  let arrStyles = [];
  fs.readdir(stylesFolderPath, {withFileTypes: true}, ( err, files)=> {
    ifError(err);
    arrStyles = files.filter((item)=> item.isFile() && path.extname(item.name) === '.css');
    writeToFile(path.join(stylesFolderPath, arrStyles[0]?.name), stylesPath);
  });
}

async function addTemplates(templatePath, componentsFolderPath) {
  let resultTemplate = await fs.promises.readFile(templatePath).catch((err)=>{
    throw new Error(`Can not read template : ${err.message}`);
  });
  const componentsNames = await fs.promises.readdir(componentsFolderPath);
  for( let i=0; i< componentsNames.length; i+=1) {
    const nameFile = componentsNames[i];
    const {name} = path.parse(nameFile);
    const currentComponent = await fs.promises.readFile(path.join(componentsFolderPath, nameFile));
    resultTemplate = resultTemplate.toString().replace(`{{${name}}}`, currentComponent.toString());
  }
  return resultTemplate;
}

async function build() {
  copyDir(assetsPath, toPath);
  mergeStyles();
  const templatePath = path.join(__dirname, 'template.html');
  const componentsFolderPath = path.join(__dirname, 'components');
  const newTemplateText = await addTemplates(templatePath, componentsFolderPath);
  await fs.promises.writeFile(path.join(distPath, 'index.html'), newTemplateText);
}

fs.mkdir(distPath, async (err)=> {
  if( err) {
    if( err?.code === 'EEXIST') {
      fs.rm(distPath, {recursive: true}, (err)=> {
        ifError(err);
        fs.mkdir(distPath, async (err)=> {
          ifError(err);
          build();
        });
      });
    } else {
      ifError(err);
    }
  } else {
    build();
  }
});
