'use strict';

const gulp 			= require('gulp'),
      postcss       = require('gulp-postcss'),
      autoprefixer 	= require('autoprefixer'),
      mqpacker      = require('mqpacker'),
      sortCSSmq     = require('sort-css-media-queries'),
	  sass 			= require('gulp-sass'),
      cleanCSS 		= require('gulp-clean-css'),
      htmlhint      = require('gulp-htmlhint'),
      pug           = require('gulp-pug'),
      svgSprite     = require('gulp-svg-sprite'),
      sourcemaps    = require('gulp-sourcemaps'),
	  browserSync 	= require('browser-sync');

const path = {
    build: {
        html: 'build/',
        style: 'build/css'
    },
    src: {
        html: 'src/*.pug',
        style: 'src/sass/index.scss',
        svg: 'src/svg/all/**/*.svg'
    },
    watch: {
        html: 'src/**/*.pug',
        style: 'src/sass/**/*.scss',
        svg: 'src/svg/all/**/*.svg'
    }
};

const browserSyncConfig = {
    server: {
        baseDir: './build'
    },
    notify: false
};

const svgSpriteConfig = {
    mode: {
        symbol: {
            dest: 'svg',
            sprite: 'sprite'
        }
    }
};

gulp.task('browser-sync', function () {
    browserSync(browserSyncConfig);
});

gulp.task('html', function () {
    return gulp.src(path.src.html)
        .pipe(sourcemaps.init())
            .pipe(pug({
                //pretty: true
            }))
            .pipe(htmlhint())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('css', function () {
    let plugins = [
        autoprefixer(
            {
                cascade: false
            }
        ),
        mqpacker({
            sort: sortCSSmq.desktopFirst
        })
    ];

    return gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(plugins))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.style))
        .pipe(browserSync.stream());
});

gulp.task('svg', function() {
    return gulp.src(path.src.svg)
        .pipe(svgSprite(svgSpriteConfig))
        .pipe(gulp.dest('src'));
});

gulp.task('watch', function(){
    gulp.watch(path.watch.html, gulp.parallel('html'));
    gulp.watch(path.watch.style, gulp.parallel('css'));
    gulp.watch(path.watch.style, gulp.parallel('svg'));
});

gulp.task('default', gulp.parallel('html', 'css', 'svg', 'browser-sync', 'watch'));
