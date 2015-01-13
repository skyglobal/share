'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
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
        console.log('Error');
        err = new gutil.PluginError('Sheut: ', err.join('\n'), {showStack: true});
        gulp.emit("error", err)
        process.exit(1)
    });
});

gulp.task('sheut', function(cb){
    return sheut.capture()
        .then(function(){
            return sheut.compare();
        }).then(function onSuccess(){
            cb();
        }, function onError(err){
            console.log('Error');
            return new Error("no match");
            //err = new gutil.PluginError('Sheut: ', err.join('\n'), {showStack: true});
            //gulp.emit("error", err)
            //cb()
        });
});
