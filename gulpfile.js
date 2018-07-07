const gulp = require('gulp');
const scss = require('gulp-sass');
const csso = require('gulp-csso');
const maps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync');
const nunjucks = require('gulp-nunjucks-render');
const imagemin = require('gulp-imagemin');
const watch = require('gulp-watch');
const plumber = require('gulp-plumber');
const browserify = require('gulp-browserify');
const babel = require('babelify');
const minifyJS = require('gulp-uglify');

gulp.task('css', function() {
  return gulp.src('src/main.scss')
    .pipe(plumber())
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
    .pipe(plumber.stop())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream())
});

gulp.task('html', function() {
  return gulp.src('src/pages/*.html')
    .pipe(plumber())
    .pipe(nunjucks({
      path: 'src/'
    }))
    .pipe(plumber.stop())
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream())
});

gulp.task('img', function() {
  return gulp.src('src/assets/img/**/*.*')
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

gulp.task('js', function () {
  return gulp.src('src/index.js')
    .pipe(plumber())
    .pipe(browserify({
      debug: true,
      transform: [babel.configure({
        presets: ['es2015'],
      })]
    }))
    .pipe(minifyJS())
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream())
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
  return gulp.src('src/assets/fonts/*.*')
    .pipe(gulp.dest('dist/fonts'))
})

gulp.task('watch', ['reload', 'css', 'html', 'img', 'js', 'fonts'], function() {
  watch('src/**/*.html', () => gulp.start('html'));
  watch('src/**/*.scss', () => gulp.start('css'));
  watch('src/**/*.js', () => gulp.start('js'));
  gulp.watch('dist/*.html', browserSync.reload());
});