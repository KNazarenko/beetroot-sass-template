const gulp = require('gulp');
const scss = require('gulp-sass');
const csso = require('gulp-csso');
const maps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync');
const nunjucks = require('gulp-nunjucks-render');
const imagemin = require('gulp-imagemin');

gulp.task('css', function() {
  return gulp.src('src/main.scss')
    .pipe(maps.init())
    .pipe(scss())
    .pipe(autoprefixer({
      browsers: ['last 5 versions']
    }))
    .pipe(csso())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(maps.write())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream())
});

gulp.task('html', function() {
  return gulp.src('src/views')
    .pipe(nunjucks({
      path: 'src/'
    }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream())
});

gulp.task('img', function() {
  return gulp.src('src/img/**/*.*')
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
        plugins: [
          {removeViewBox: true},
          {cleanupIDs: false}
        ]
      })
    ]))
    .pipe(gulp.dest('dist/img'))
});

gulp.task('reload', function() {
  browserSync({
    server: {
      baseDir: 'dist/'
    },
    notify: false
  });
});

gulp.task('fonts', function() {
  return gulp.src('src/fonts/*.*')
    .pipe(gulp.dest('dist/fonts'))
})

gulp.task('watch', ['reload', 'css', 'html', 'img', 'fonts'], function() {
  gulp.watch('src/**/*.scss', ['css']);
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('dist/*.html', browserSync.reload());
});