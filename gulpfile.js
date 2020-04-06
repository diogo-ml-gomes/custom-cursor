'use strict';

const gulp = require('gulp'),
      eslint = require('gulp-eslint'),
      terser = require('gulp-terser'),
      rename = require('gulp-rename'),
      dependents = require('gulp-dependents'),
      sass = require('gulp-sass'),
      del = require('del');

// Options
const options = {
    compile: {
        src: './src/**/*',
        dist: './dist/'
    },
    scripts: {
        src: './src/**/*.js',
        reporter: 'default'
    },
    terser: {
        compress: {
            defaults: false,
            hoist_funs: true,
            hoist_vars: true
        },
        mangle: {
            keep_classnames: true,
            keep_fnames: true
        },
        output: {
            beautify: true,
            preamble: '/* ccursor.js v1.0.0 | © 2020 diogo gomes | https://github.com/diogo-ml-gomes/custom-cursor#readme */',
        }
    },
    styles: {
        src: './public/**/*.scss',
        outputstyle: 'expanded',
        dest: './public'
    }
}

/**
 * Plain functions tasks
 */

// Run Scripts through JSHint
function scriptlint() {
	return gulp.src(options.scripts.src)
        .pipe(eslint())
        .pipe(eslint.format());
}

// Compile Scripts
function scripts() {
    return gulp.src(options.scripts.src)
        .pipe(terser(options.terser))
        .pipe(gulp.dest(options.compile.dist))
        .pipe(terser({output: {preamble: options.terser.output.preamble}}))
        .pipe(rename({suffix: '-min'}))
        .pipe(gulp.dest(options.compile.dist))
}

// Compile SCSS to CSS
function styles() {
    return gulp.src(options.styles.src, {since: gulp.lastRun(styles) })
        .pipe(dependents())
        .pipe(sass({
            outputStyle: options.styles.outputstyle
        }).on('error', sass.logError))
        .pipe(gulp.dest(options.styles.dest));
}

// Watch Function
function watch(end) {
    gulp.watch(options.scripts.src, scripts)
    gulp.watch(options.styles.src, styles);
    end();
}

// Delete Dist Folders
function delDist() {
    return (async () => {
        const deletedPaths = await del([options.compile.dist]);
        console.log('Deleted:', deletedPaths.join(', '));
    })();
};

/**
 * Run! Time ( tasks declared as CommonJS 'exports' )
 */

// Compile Scripts
exports.scripts = scripts;

// Compile SCSS to CSS
exports.styles = styles;

// Watch Task
exports.watch = watch;

// Run Scripts through JSHint
exports.lint = scriptlint;

// Delete Dist Folder
exports.del = delDist;

// Default Task
exports.default = gulp.parallel(scripts, styles, watch);