const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const mozJpeg = require('imagemin-mozjpeg'); 
const pngquant = require('imagemin-pngquant'); 
const imageResize = require('gulp-image-resize');
const svgo = require('imagemin-svgo');

const { src_dir, dst_dir, jpegQuality, maxImageWidth } = require('../../config');
const path = require('path');

const mozJpegConfig = {
  quality: jpegQuality,  
};
const svgoConfig = {
  plugins: [{
    removeViewBox: false,
  }]
};
const gifsicleConfig = {
};

const imageResizeConfig = {
  width: maxImageWidth,
};

gulp.task('images_prod', function() {
  // normal images
  gulp.src(path.join(src_dir, 'images', '**/*.+(jpg|jpeg|JPG|JPEG|png|PNG|GIF|gif)'))
    .pipe(imageResize(imageResizeConfig))
    .pipe(imagemin(
      [
        pngquant(),
        mozJpeg(mozJpegConfig),
        imagemin.gifsicle(gifsicleConfig),
      ]

    ))
    .pipe(gulp.dest(path.join(dst_dir, 'images')));
  //svg 
  gulp.src(path.join(src_dir, 'images', '**/*.svg'))
    .pipe(imagemin([svgo(svgoConfig)]))
    .pipe(gulp.dest(path.join(dst_dir, 'images')));
});

gulp.task('images_dev', function() {
  gulp.src(path.join(src_dir, 'images', '**/*'))
    .pipe(gulp.dest(path.join(dst_dir, 'images')));
});

