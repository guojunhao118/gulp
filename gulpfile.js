const gulp = require('gulp')

const jsonToCss = require('./gulp-json-css')

gulp.task('default', () => {
    let s = gulp.src('./css.json')
        .pipe(jsonToCss())
        .pipe(gulp.dest('./build'))

    return s
})