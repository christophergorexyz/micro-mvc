'use strict';
let gulp = require('gulp'),
  gutil = require('gulp-util'),
  browserify = require('browserify'),
  babelify = require('babelify'),
  mkdirp = require('mkdirp'),
  fs = require('fs'),
  path = require('path');

let prod = process.env.NODE_ENV === 'production';

gulp.task('browserify', (done) => {
  mkdirp('dist/js', function (err) {
    if (err) {
      gutil.log(err);
    }
    browserify({
        entries: ['src/index'],
        standalone: 'mvctest',
        debug: true
      })
      .transform(babelify, {
        presets: ['env']
      })
      .bundle()
      .on('error', gutil.log)
      .pipe(fs.createWriteStream(path.join(__dirname, 'dist/js', 'index.js'), {
        encoding: 'utf-8'
      }));
  });
  return done();
});

gulp.task('html', (done) => {
  gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));
  return done();
});

gulp.task('build', gulp.parallel(['browserify', 'html']));

gulp.task('default', gulp.series(['build']));
