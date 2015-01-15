'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var componentHelper = require('gulp-component-helper')(gulp);
var paths = componentHelper.paths;
var sheut = require('sheut');

function error(err){
    gulp.emit("error", err);
}
function success(err){
    gutil.log(gutil.colors.green(err.message));
}

gulp.task('sheut:clean', function(){
    return sheut.clean().then(success, error);
});

gulp.task('sheut:capture', ['sheut:clean'], function(){
    return sheut.capture().then(success, error);
});

gulp.task('sheut:accept', function(){
    return sheut.accept().then(success, error);
});

gulp.task('sheut:compare', ['sheut:capture'], function(){
    return sheut.compare().then(success, error);
});
