'use strict';

var gulp   = require('gulp'),
    del    = require('del'),
    sass   = require('gulp-sass'),
    jade   = require('gulp-jade');

gulp.task('clean', function () {
  del(['.tmp', 'public']);
});

gulp.task('sass', function () {
  var autoprefixer = require('gulp-autoprefixer');

  gulp
    .src('app/styles/main.scss')
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('public/styles'));
});

gulp.task('jade', function () {
  gulp
    .src('app/**/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('public'));
});
