'use strict';

var gulp = require('gulp');
var componentHelper = require('gulp-component-helper')(gulp);
var paths = componentHelper.paths;
var runSequence = require('run-sequence');
var sheut = require('sheut');

gulp.task('screenshot:capture', function(cb){
    return sheut.capture(cb);
});

gulp.task('screenshot:accept', function(cb){
    return sheut.accept(cb);
});

gulp.task('screenshot:compare', function(cb){
    return sheut.compare(cb);
});

gulp.task('sheut', function(cb){
    return sheut.capture(function(){
        return sheut.compare(cb);
    });
});