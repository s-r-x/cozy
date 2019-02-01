const gulp = require('gulp');
const plumber = require('gulp-plumber');
const path = require('path');
const ejs = require('gulp-ejs');
const rename = require("gulp-rename");
const htmlmin = require('gulp-htmlmin');
const watch = require('gulp-watch');


const htmlVars = require('../../html_variables');
const { src_dir, dst_dir } = require('../../config');

const templatesSrc = path.join(src_dir, 'templates');

const watchConfig = {
  ignoreInitial: false,
};
const minifyConfig = {
  collapseWhitespace: true,
}

gulp.task('html_prod', function() {
  gulp.src(`${templatesSrc}/*.ejs`)
    .pipe(plumber())
    .pipe(ejs(htmlVars, {}, {ext: '.html'}))
    .pipe(htmlmin(minifyConfig))
    .pipe(gulp.dest(dst_dir));
});

gulp.task('html_dev', function() {
  const devServer = require('./dev-server');
  return watch(`${templatesSrc}/**/*.ejs`, watchConfig, function() {
    gulp.src(`${templatesSrc}/*.ejs`)
      .pipe(plumber())
      .pipe(ejs(htmlVars, {}, {ext: '.html'}))
      .pipe(gulp.dest(dst_dir))
      .pipe(devServer.reload({stream: true}));
  });
});
