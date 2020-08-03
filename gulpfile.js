const gulp = require('gulp');
const concat = require('gulp-concat');
const minifyCss = require('gulp-minify-css');
const imagemin = require('gulp-imagemin');
const clean = require('gulp-clean');
const shell = require('gulp-shell');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const runSequence = require('run-sequence');

const path = {
    src: {
        html: 'app/index.html',
        styles: [
            'app/css/font-awesome.css',
            'app/css/fonts-debby-muller.css',
            'app/css/reset.css',
            'app/css/styles1.css'
        ],
        fonts: ['app/fonts/**/*'],
        images: 'app/images/**/*'
    },
    build: {
        html: 'build/',
        styles: 'build/css',
        fonts: 'build/fonts',
        images: 'build/images'
    }
};

gulp.task('css', function() {
    return gulp.src(path.src.styles)
        .pipe(minifyCss())
        .pipe(concat('main.css'))
        .pipe(gulp.dest(path.build.styles))
        .pipe(reload({stream: true}))
});

gulp.task('html', function() {
    return gulp.src(path.src.html)
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}))
});

gulp.task('fonts', function() {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('images', function () {
    return gulp.src(path.src.images)
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ], {
            verbose: true
        }))
        .pipe(gulp.dest(path.build.images))
});

gulp.task('clean', function() {
    return gulp.src('build', {allowEmpty: true}).pipe(clean());
});

gulp.task('build', shell.task([
    'gulp clean',
    'gulp images',
    'gulp html',
    'gulp fonts',
    'gulp css'
]));

gulp.task('browser-sync', function () {
    browserSync({
        startPath: '/',
        server: {
            baseDir: 'build'
        },
        notify: false
    })
});

gulp.task('watch', function() {
    gulp.watch('app/*.html', gulp.parallel('html'));
    gulp.watch('app/css/**/*.css', gulp.parallel('css'));
});

gulp.task('server', gulp.series('build', gulp.parallel('browser-sync', 'watch'), function() {}));

gulp.task('default', gulp.series('server'), function() {});