const { dst_dir } = require('../config');
const fs = require('fs');
const gzipSize = require('gzip-size');
const path = require('path');
const log = console.log.bind(console);
const chalk = require('chalk');
const prettysize = require('prettysize'); 
const pretty = val => prettysize(val, true);

// creates object in the format {style: {normal: 0, gzip: 0}}
let sizes = ['style', 'script', 'html', 'image', 'font', 'svg', 'other'].reduce((acc, type) => {
  return Object.assign(acc, {
    [type]: {
      normal: 0, 
      gzip: 0
    }
  });
}, {});

const isImage = filename => /\.(jpg|jpeg|png|gif)$/i.test(filename);
const isScript = filename => /\.js$/i.test(filename);
const isHtml = filename => /\.html$/i.test(filename);
const isFont = filename => /\.(woff|woff2|otf|ttf|eot)$/i.test(filename);
const isStyle = filename => /\.css$/i.test(filename);
const isSvg = filename => /\.svg$/i.test(filename);
const getFileType = filename => {
  if(isImage(filename)) return 'image';
  if(isScript(filename)) return 'script';
  if(isHtml(filename)) return 'html';
  if(isStyle(filename)) return 'style';
  if(isFont(filename)) return 'font';
  if(isSvg(filename)) return 'svg';
  else return 'other';
}

// recursive readdir 
const read = (dir) => {
  const files = fs.readdirSync(dir).map(file => path.join(dir, file));
  files.forEach(file => {
    const stats = fs.lstatSync(file);
    const isDir = stats.isDirectory();
    if(stats.isDirectory()) {
      read(file);
    }
    else if(stats.isFile()) {
      const type = getFileType(file);
      sizes[type].normal += stats.size;
      sizes[type].gzip += gzipSize.fileSync(file);
    }
  });
};

// increment size accumulator of each file type
read(dst_dir);

const printSize = stats => `${chalk.red(pretty(stats.normal))} | ${chalk.green(pretty(stats.gzip))}`;
log(chalk.white('------------'));
log(chalk.bold.inverse('Bundle size:'));
log(chalk.white('------------'));
log(`${chalk.bgRed('Scripts:')} ${printSize(sizes.script)}`);
log(`${chalk.bgMagenta('Styles:')} ${printSize(sizes.style)}`);
log(`${chalk.bgBlue('HTML:')} ${printSize(sizes.html)}`);
log(`${chalk.bgGreen('Images:')} ${printSize(sizes.image)}`);
log(`${chalk.bgYellow('Fonts:')} ${printSize(sizes.font)}`);
log(`${chalk.bgCyan('Svg:')} ${printSize(sizes.svg)}`);
