'use strict';
let gulp = require('gulp'),
  browserify = require('browserify'),
  babelify = require('babelify'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  uglify = require('gulp-uglify'),
  sourcemaps = require('gulp-sourcemaps');

let prod = process.env.NODE_ENV === 'production';

gulp.task('browserify', (done) => {
  browserify({
      entries: 'src/index.js',
      standalone: 'mvc',
      debug: !prod
    }).transform(babelify, {
      presets: ['env']
    })
    .bundle()
    .pipe(source('micro-mvc.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'))
    .on('end', () => {
      done();
    });
});

gulp.task('demos', (done) => {
  gulp.src(['dist/*', 'src/demo/*'])
    .pipe(gulp.dest('demo')).on('end', () => {
      done();
    });
});

gulp.task('build', gulp.series(['browserify', 'demos']));

gulp.task('default', gulp.series(['build']));
