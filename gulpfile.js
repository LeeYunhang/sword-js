const gulp = require('gulp');
const babel = require('gulp-babel');
var concat = require('gulp-concat');

gulp.task('default', () => {
    return gulp.src('src/*.js')
        .pipe(babel())
        .pipe(gulp.dest('dist/'));
});

gulp.task('test', () => {
    return gulp.src('src/*.js')
        .pipe(babel())
        .pipe(concat('test.js'))
        .pipe(gulp.dest('test/'));  
})