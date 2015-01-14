'use strict';

var gulp = require('gulp');
var componentHelper = require('gulp-component-helper')(gulp);
var paths = componentHelper.paths;
var sheut = require('sheut');

gulp.task('sheut:clean', function(cb){
    return sheut.clean();
});

gulp.task('sheut:capture', ['clean'], function(cb){
    return sheut.capture();
});

gulp.task('sheut:accept', function(cb){
    return sheut.accept();
});

gulp.task('sheut:compare', ['capture'], function(cb){
    return sheut.compare()
        .then(function onSuccess(){

        }, function onError(err){
            gulp.emit("error", err);
        });
});
