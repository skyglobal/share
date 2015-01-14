'use strict';

var gulp = require('gulp');
var componentHelper = require('gulp-component-helper')(gulp);
var paths = componentHelper.paths;
var sheut = require('sheut');

gulp.task('screenshot:capture', function(cb){
    sheut.capture().then(function(){
        cb()
    });
});

gulp.task('screenshot:accept', function(cb){
    sheut.accept().then(function(){
        cb()
    });
});

gulp.task('screenshot:compare', function(cb){
    sheut.compare().then(function onSuccess(){
        cb();
    }, function onError(err){
        gulp.emit("error", err)
    });
});

gulp.task('sheut', function(cb){
    return sheut.capture()
        .then(function(){
            return sheut.compare();
        }).then(function onSuccess(){
            //cb();
        }, function onError(err){
            gulp.emit("error", err);
        });
});
