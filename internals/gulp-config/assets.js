const watch = require('gulp-watch');
const gulp = require('gulp');
const { dst_dir } = require('../../config'); 

const watchConfig = {
  ignoreInitial: false,
};

gulp.task('watch_assets', function() {
  const devServer = require('./dev-server');
  return watch([`${dst_dir}/**/*.js`, `${dst_dir}/**/*.css`], watchConfig, devServer.reload);
});
