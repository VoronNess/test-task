const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const htmlmin = require("gulp-htmlmin");

// Styles

const styles = () => {
  return gulp.src("less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("css"))
    .pipe(sync.stream());
};
exports.styles = styles;

// Img optimization

const images = () => {
  return gulp.src("img/**/*.{png,svg}")
    .pipe(imagemin([
      imagemin.mozjpeg({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("./img"))
};
exports.images = images;

// Server

const server = (done) => {
  sync.init({
    server: true,
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}
exports.server = server;

//Html minify
const htmlMinify = () => {
  return gulp.src("*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("./"))
};
exports.htmlMinify = htmlMinify;


// Watcher

const watcher = () => {
  gulp.watch("less/**/*.less", gulp.series("styles"));
  gulp.watch("*.html").on("change", sync.reload);
}

exports.default = gulp.series(
  styles, server, watcher
);

const build = gulp.series(
  styles,
  images,
  htmlMinify
);
exports.build = build;

const start = gulp.series(
  build,
  server,
  watcher
);
exports.start = start;
