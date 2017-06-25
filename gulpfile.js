let gulp = require('gulp');
let jshint = require('gulp-jshint');
let jshintStylish = require('jshint-stylish');
let run = require('gulp-run');

gulp.task('default',() => {
  run('npm start').exec(); 
    gulp.watch('app/**/*').on('change',event =>{
        gulp.src(event.path) 
            .pipe(jshint({esversion:6})) 
            .pipe(jshint.reporter(jshintStylish))
    });
});