//gulp properties destructuring
const {src ,  dest , series, parallel, watch }  = require("gulp") ;


//#region gulp plugin caching to use 
const   concat     = require('gulp-concat'),
        prefix     = require('gulp-autoprefixer'),
        sass       = require('gulp-sass'),
        sourcemaps = require('gulp-sourcemaps'),
        minifyCss  = require('gulp-clean-css'),
        babel      = require('gulp-babel'),
        minifyEs5  = require('gulp-uglify'),
        beeper     = require('beeper'),
        notifier   = require('node-notifier');
//#endregion



//#region sassCompile Task
function sassCompile(cb) {   
    src([
          'content/sass/main-ltr.scss',
          'content/sass/main-rtl.scss'
       ])
        .pipe(sourcemaps.init())
        // .pipe(sass({outputStyle: "nested"}).on('error',sass.logError))
        .pipe(sass({ outputStyle: 'nested' }).on('error',function(err){
            console.log(`-----------------------------------------------------------------`);
            console.log(err.message);
            console.log(`-----------------------------------------------------------------`);
            beeper();
             
            notifier.notify(
                {
                  title: 'Sass Error Compiling',
                  message: `Error in File : ${err.relativePath} \nError in Line : ${err.line} , Column : ${err.column} `,
                  sound: false, 
                  wait: false,
                  timeout: 1
                },
                function(err, response) {
                  // Response is response from notification
                }
              );
            this.emit('end');
        }))
        .pipe(prefix('last 2 versions'))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('content/css'));
    cb();
};
//#endregion



//#region minifyLtrCss Task
function minifyLtrCss (cb) {
    src([
          'content/css/vendor/bootstrap/bootstrap-grid.ltr.min.css',
          'content/css/vendor/fontStyles/brands-icons-styles.css',
          'content/css/vendor/owl-carousel/owl.carousel.min.css',
          'content/css/vendor/owl-carousel/owl.theme.default.min.css',
          'content/css/main-ltr.css'
       ])
        .pipe(sourcemaps.init())
        .pipe(concat('ltr-style.min.css'))
        .pipe(minifyCss())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('content/css/minifiedStyles'));
    cb();
};
//#endregion

//#region minifyRtlCss Task
function minifyRtlCss(cb) {
    src([
          'content/css/vendor/bootstrap/bootstrap-grid.rtl.min.css',
          'content/css/vendor/fontStyles/brands-icons-styles.css',
          'content/css/vendor/owl-carousel/owl.carousel.min.css',
          'content/css/vendor/owl-carousel/owl.theme.default.min.css',
          'content/css/main-rtl.css'
       ])
        .pipe(sourcemaps.init())
        .pipe(concat('rtl-style.min.css'))
        .pipe(minifyCss())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('content/css/minifiedStyles'));
    cb();
};
//#endregion



//#region minifyLtrJs Task
function minifyLtrJs(cb) { 
     src([
           'content/js/vendor/jquery.min.js',
           'content/js/vendor/owl.carousel.min.js',
           'content/js/vendor/jquery.validate.min.js',
           'content/js/jquery.libraries.call.js',
           'content/js/main.js'
        ])
         .pipe(concat('scriptsLtr.min.js'))
         .pipe( babel({  presets: ['@babel/preset-env'] }) )
         .pipe(minifyEs5()) 
         .pipe(dest('content/scripts/minifiedJs'));
    cb();
 }; 
 //#endregion

 //#region minifyRtlJs Task
 function minifyRtlJs(cb) { 
    src([
          'content/js/vendor/jquery.min.js',
          'content/js/vendor/owl.carousel.min.js',
          'content/js/vendor/jquery.validate.min.js',
          'content/js/vendor/jquery.validate.messages_ar.min.js',
          'content/js/jquery.libraries.call.js',
          'content/js/main.js'
       ])
        .pipe(concat('scriptsRtl.min.js'))
        .pipe( babel({  presets: ['@babel/preset-env'] }) )
        .pipe(minifyEs5()) 
        .pipe(dest('content/scripts/minifiedJs'));
   cb();
}; 
 //#endregion



//#region watcher Task
function watcher(cb) {

    watch( ['content/sass/*.scss', 'content/sass/*/*.scss'], 
           series(sassCompile))

    watch( 'content/css/*.css', 
           series(minifyRtlCss,minifyLtrCss) )

    watch( 'content/js/*.js', 
           series(minifyLtrJs, minifyRtlJs) )

    cb();
}
//#endregion



//#region Export Gulp tasks
module.exports = { 
        sassCompile ,
        minifyRtlCss,
        minifyLtrCss,
        minifyCss: series(minifyRtlCss, minifyLtrCss) ,
        
        minifyLtrJs,
        minifyRtlJs,
        minifyJs: series(minifyRtlJs, minifyLtrJs) ,
        
        watcher  
}
//#endregion