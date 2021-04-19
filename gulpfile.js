const gulp = require('gulp');
const watch = require('gulp-watch');
const svg = require('gulp-svg-sprite');

gulp.task('svg', function () {
    return gulp.src('./build/svg/*.svg')
        .pipe(svg({
            mode: {
                stack: {
                    sprite: "../sprite.svg"
                }
            },
            css: {
                render: {
                    css: true
                }
            }
        }
        ))
        .pipe(gulp.dest('./build/'));
});

gulp.task('watch', function () {
    gulp.watch('./build/svg/*.svg', gulp.series('svg'))
})