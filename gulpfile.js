const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const runSequence = require('run-sequence');
const browserSync = require('browser-sync').create();
const sass = require("gulp-sass");

const distDirectory = 'dist';
const htmlBlob = 'src/*.html';
const imagesBlob = 'src/images/**';
const fontsBlob = 'src/fonts/**';
const stylesBlob = 'src/css/**';
const sassBlob = 'src/sass/**';
const outSass = 'dist/css/&&'

gulp.task('default', function () {
  return runSequence('build', 'serve');
});

gulp.task('build', function () {
  return runSequence(
    'cleanDist',
    ['processStyles', 'processHtml', 'processImages', 'processFonts', 'processSass']
  );
});

gulp.task('serve', function () {
  browserSync.init({
    server: {
      baseDir: distDirectory
    }
  });

  gulp.watch(htmlBlob, function () {
    return runSequence('processHtml', 'reloadBrowser');
  });

  gulp.watch(imagesBlob, function () {
    return runSequence('processImages', 'reloadBrowser');
  });

  gulp.watch(fontsBlob, function () {
    return runSequence('processFonts', 'reloadBrowser');
  });

  gulp.watch(stylesBlob, function () {
    return runSequence('processStyles', 'reloadBrowser');
  });

  gulp.watch(sassBlob, function () {
    return runSequence('sass', 'reloadBrowser');
  });
});

gulp.task('cleanDist', function () {
  return gulp.src(distDirectory, {read: false, allowEmpty: true}).pipe(clean());
});

gulp.task('processHtml', function () {
  return gulp.src(htmlBlob)
    .pipe(gulp.dest(distDirectory));
});

gulp.task('processImages', function () {
  return gulp.src(imagesBlob)
    .pipe(gulp.dest(`${distDirectory}/images/`));
});

gulp.task('processFonts', function () {
  return gulp.src(fontsBlob)
    .pipe(gulp.dest(`${distDirectory}/fonts/`));
});

gulp.task('processStyles', function () {
  return gulp.src(stylesBlob)
    .pipe(concat('styles.css'))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest(`${distDirectory}/css`));
});

gulp.task('reloadBrowser', function (done) {
  browserSync.reload();
  done();
});

gulp.task('sass', function() {
  return  gulp.src(sassBlob)
    .pipe(sass())
    .pipe(gulp.dest(outSass));
});

gulp.task('reloadBrowser', function (done) {
  browserSync.reload();
  done();
});