const gulp = require('gulp');

const isDevMode = process.env.NODE_ENV === 'development';

require('./templates');
require('./assets');
require('./images');

gulp.task('dev', ['images_dev', 'html_dev', 'watch_assets']);
gulp.task('prod', ['images_prod', 'html_prod']);
gulp.task('default', isDevMode ? ['dev'] : ['prod']);
