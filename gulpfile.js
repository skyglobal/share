'use strict';

var gulp = require('gulp');
var componentHelper = require('gulp-component-helper')(gulp);
var paths = componentHelper.paths;
var sheut = require('sheut');

gulp.task('sheut:clean', function(){
    return sheut.clean();
});

gulp.task('sheut:capture', ['sheut:clean'], function(){
    return sheut.capture();
});

gulp.task('sheut:accept', function(){
    return sheut.accept();
});

gulp.task('sheut:compare', ['sheut:capture'], function(){
    return sheut.compare()
        .then(function onSuccess(){

        }, function onError(err){
            gulp.emit("error", err);
        });
});
