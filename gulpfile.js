const { src, dest, watch, series, parallel } = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const stylelint = require('gulp-stylelint');
const plumber = require('gulp-plumber');
const qcmq = require('gulp-group-css-media-queries');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano'); 
const rename = require('gulp-rename'); 
const del = require('del');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const webp = require('gulp-webp');


const entry = {
    scss: {
        path: './src/assets/styles',
        filename: 'index.scss'
    },
    html: {
        path: './src',
        filename: 'index.html'
    },
    img: {
        path: './src/assets/pic',
        filename: '*.{png,jpeg,jpg,gif}'
    },
    js: {
        path: './src/assets/scripts',
        filename: 'index.js'
    }
};

const output = {
    path: './dist',
};

async function clean_output_task() {
    return await del(output.path); 
}

function stylelint_task(cb) {
    if (!entry.scss) {
        cb(new Error('do not have settings for scss'))
        return;
    }

    return src(`${entry.scss.path}/${entry.scss.filename}`)
        .pipe(plumber())
        .pipe(stylelint({
            failAfterError: true,
            reporters: [
                {
                    formatter: 'string',
                    console: true,
                },
            ],
        }))
}

function scss_task() {
    if (!entry.scss) {
        cb(new Error('do not have settings for scss'))
        return;
    }

    return src(`${entry.scss.path}/${entry.scss.filename}`)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(rename({basename: 'main'}))
        .pipe(dest(`${output.path}/assets/`))
        .pipe(browserSync.stream());
}

function html_task(cb) {
    if (!entry.html) {
        cb(new Error('have not settings for html'))
        return;
    }

    return src(`${entry.html.path}/${entry.html.filename}`)
        .pipe(dest(output.path))
        .pipe(browserSync.stream());
}

async function image_task(cb) {
    if (!entry.img) {
        cb(new Error('have not settings for img'))
        return;
    }

    const _output = `${output.path}/assets/pic`;

    await del(_output);

    return src(`${entry.img.path}/${entry.img.filename}`)
        .pipe(webp())
        .pipe(dest(_output))
        .pipe(browserSync.stream());
}

function minimization_style_task() {
    
    return src(`${output.path}/assets/*.css`)
    .pipe(cssnano()) 
    .pipe(rename({suffix: '.min', basename: 'main'})) 
    .pipe(dest(`${output.path}/assets/`))
}

function js_task () {
    return src(`${entry.js.path}/${entry.js.filename}`)
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe(rename({basename: 'main'}))
    .pipe(dest(`${output.path}/assets/scripts`))
    .pipe(browserSync.stream());
}

function minimization_js() {
    return src(`${entry.js.path}/${entry.js.filename}`)
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe(uglify())
    .pipe(rename({suffix: '.min', basename: 'main'}))    
    .pipe(dest(`${output.path}/assets/scripts`));
}

function build_styles_task() {
    return src(`${entry.scss.path}/${entry.scss.filename}`)
    .pipe(sass())
    .pipe(qcmq())
    .pipe(autoprefixer({cascade: false}))
    .pipe(dest(`${output.path}/assets/`))
}


function development_watch(cb) {
    if (!entry.html || !entry.scss || !entry.img) {
        cb(new Error('have not settings'))
        return;
    }

    browserSync.init({
        server: output.path
    })

    const _options = { ignoreInitial: false };

    watch(`${entry.scss.path}/**/*.scss`, _options, series(stylelint_task, scss_task));
    watch(`${entry.html.path}/**/${entry.html.filename}`, _options, html_task);
    watch(`${entry.img.path}/**/${entry.img.filename}`, _options, image_task);
    watch(`${entry.js.path}/**/*.js`, _options, js_task);
}

function builded_watch(cb) {
    browserSync.init({
        server: output.path
    })
}

exports.check = stylelint_task;
exports.start = development_watch;
exports.build = series([clean_output_task, parallel([html_task, image_task, minimization_js, series([build_styles_task, minimization_style_task])])])
exports.watch = builded_watch;