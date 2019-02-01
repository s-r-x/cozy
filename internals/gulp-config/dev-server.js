const browserSync = require('browser-sync').create();

const { port, dst_dir } = require('../../config');

const config = {
  port,
  server: {
    baseDir: dst_dir,
  },
  notify: false,
};
browserSync.init(config);

module.exports = browserSync;
