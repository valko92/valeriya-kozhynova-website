var path =  require('path');
var fs =  require('fs');
var del =  require('del');
var gulp =  require('gulp');
var gutil = require('gulp-util');
var data =  require('gulp-data');
var rename = require('gulp-rename');
var minifyInline = require('gulp-minify-inline');
var imagemin = require('gulp-imagemin');
var pug =  require('gulp-pug');
var sass =  require('gulp-sass');
var prefix =  require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify =  require('gulp-uglify');
var browserSync =  require('browser-sync');

const PATHS = {
  src:       './src/',
  build:     './build/',
  jsassets:  './build/assets/js',
  cssassets: './build/assets/css',
  scss:      './src/styles/',
  js:        './src/scripts/',
  public:    './src/public',
  data:      './src/data/'
};

/** PUG -> HTML */
var html = () => {
  return gulp.src(`${PATHS.src}**/*.pug`)
    .pipe(data((file) => {
      if (fs.existsSync(`${PATHS.data}${path.basename(file.path)}.json`)) {
        return JSON.parse(fs.readFileSync(`${PATHS.data}${path.basename(file.path)}.json`));
      }
    }))
    .pipe(pug())
    .on('error', (err) => {
      process.stderr.write(`${err.message}\n`);
    })
    .pipe(rename(function (file) {
      if (`${file.basename}${file.extname}` === 'index.html') {
        gutil.noop();
      } else if (`${file.basename}${file.extname}` === 'sitemap.html') {
        file.dirname = '.';
        file.extname = '.xml';
      } else {
        file.dirname = file.basename;
        file.basename = 'index';
      }
    }))
    .pipe(minifyInline())
    .pipe(gulp.dest(PATHS.build));
};

/** SCSS -> CSS */
var styles = () => {
  return gulp.src(`${PATHS.scss}main.scss`)
    .pipe(prefix({browsers: ['last 3 versions']}))
    .pipe(gutil.env.env === 'dev' ? sass({outputStyle: 'expanded'}).on('error', sass.logError): sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest(`${PATHS.cssassets}`))
    .pipe(gutil.env.env === 'dev' ? browserSync.stream() : gutil.noop());
};

/** JS -> TEST, UGLIFY */
var scripts = () => {
  return gulp.src(`${PATHS.js}*.js`)
    .pipe(concat('scripts.js'))
    .pipe(gutil.env.env === 'dev' ? uglify({output: { beautify: true }, mangle: false, compress: false}) : uglify({mangle: true}))
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest(`${PATHS.jsassets}`));
};

/** COPY + IMAGEMIN */
var copy = () => {
  return gulp.src(`${PATHS.public}/**/*`)
    .pipe(gutil.env.env === 'dev' ? gutil.noop(): imagemin())
    .pipe(gulp.dest(`${PATHS.build}`));
};

/** DELETE ./BUILD */
var prep = () => {
  return del([PATHS.build]);
};

/** WATCH + LOCAL SERVER */
var reload = browserSync.reload;
var localserver = () => {
  browserSync.init({
    server: PATHS.build,
    port: 3000,
    open: 'local',
    cors: true,
    reloadOnRestart: true
  });
  
  // watch the src files and invoke tasks if they change
  gulp.watch([`${PATHS.src}**/*.pug`, PATHS.data], html);
  gulp.watch(PATHS.scss, styles);
  gulp.watch(PATHS.js, scripts);
  gulp.watch(PATHS.public, copy);

  // watch the build files and reload the browser if they change because of the previous changes
  // gulp.watch([`${PATHS.build}**/*.html`,`${PATHS.data}*.json`, `${PATHS.build}**/*.js`,`${PATHS.build}public/**/*`]).on('change', () => {
  //     reload();
  // });
  // gulp.watch(`${PATHS.build}**/*.html`).on('change', () => {
  //   reload();
  // });
};

/** TASKS */
gulp.task(html);
html.description = 'Convert pug to html and xml while also using similarily-named json data files.';

gulp.task(styles);
styles.description = 'Convert scss to css, also include above the fold css.';

gulp.task(scripts);
scripts.description = 'Combine all javascript files into one and minify for production.';

gulp.task(prep);
prep.description = 'Delete the old build folder before you build/rebuild the project.';

gulp.task(copy);
copy.description = 'Copy everything in the .src/public/ folder directly into ./build/, compress any images on the way.';

gulp.task(localserver);
localserver.description = 'Spin up a local browser-sync server and reload when a change occurs.';

gulp.task('default', gulp.series(prep, gulp.parallel(html, scripts, styles, copy)));

gulp.task('serve', gulp.series(prep, gulp.parallel(html, scripts, styles, copy), localserver));