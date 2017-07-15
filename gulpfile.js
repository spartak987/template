var gulp = require('gulp');
    sass = require('gulp-sass');
    pug = require('gulp-pug');
    browserSync = require('browser-sync');
    imagemin = require('gulp-imagemin');
    pngquant = require('imagemin-pngquant');
    prefixer = require('gulp-autoprefixer');
    cssmin = require('gulp-cssmin');
    sourcemaps = require('gulp-sourcemaps');
    uglify = require('gulp-uglify');
    rimraf = require('rimraf');

var path = {
  clean: 'build/*'
};

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('js:build', function () {
    gulp.src('src/js/*.js') //Найдем наш main файл
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(uglify()) //Сожмем наш js
        .pipe(sourcemaps.write()) //Пропишем карты
        .pipe(gulp.dest('build/js'));
});

gulp.task('js', function () {
  gulp.src('src/js/*.js') //Найдем наш main файл
      .pipe(gulp.dest('build/js'));
});

gulp.task('style:build', function () {
  gulp.src('src/sass/*.sass') //Выберем наш main.scss
    .pipe(sourcemaps.init())
    .pipe(sass()) //Скомпилируем
    .pipe(prefixer()) //Добавим вендорные префиксы
    .pipe(cssmin()) //Сожмем
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/css'));
});

gulp.task('fonts:build', function() {
    gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('build/fonts'))
});

gulp.task('utilites:build', function() {
    gulp.src('src/utilites/**')
        .pipe(gulp.dest('build/utilites'))
});

gulp.task('imagemin', function () {
  gulp.src('src/img/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()],
      interlaced: true
    }))
    .pipe(gulp.dest('build/img'));
});

gulp.task('pug', function() {
  gulp.src('src/*.pug')
    .pipe(pug({
      pretty: true
    }))
  .pipe(gulp.dest('build'));
});

gulp.task('sass', function(){
  gulp.src('src/sass/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', function(){
	gulp.watch('src/sass/**/*.sass', ['sass']);
  gulp.watch('src/*.pug', ['pug']);
  gulp.watch('src/js/*.js', ['js']);
  gulp.watch('src/img/*', ['imagemin']);
  gulp.watch('src/fonts/**/*', ['fonts:build']);
  gulp.watch('build/*.html', browserSync.reload);
});

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'build'
    },
    notify: false,
  });
});

gulp.task('default', ['pug','sass','js','watch','browser-sync']);
gulp.task('build', ['pug','js:build','style:build','imagemin','fonts:build','utilites:build']);

//pug sass js fonts utilites imagemin

//pug sass js
//fonts utilites imagemin
//style js