'use strict';

var gulp = require('gulp');
var helper = require('component-helper');
var paths = helper.paths;
//var sheut = require('sheut');
var argv = process.argv.slice(3).toString();

function error(err){
    gulp.emit("error", err);
}
function success(msg){
    console.log(msg.message);
}

gulp.task('build', function() {
    return helper.build.all().catch(error)
});

gulp.task('serve',  function() {
    return helper.serve.all().catch(error);
});

gulp.task('test', function(){
    return helper.test.all().catch(error);
});

gulp.task('release', function(){
    var version = argv.split('--version=')[1];
    return helper.release.all(null, version).catch(error);
});

//gulp.task('sheut:clean', function(){
//    return sheut.clean().then(success, error);
//});
//
//gulp.task('sheut:capture', ['sheut:clean'], function(){
//    return sheut.capture().then(success, error);
//});
//
//gulp.task('sheut:accept', function(){
//    return sheut.accept().then(success, error);
//});
//
//gulp.task('sheut:compare', ['sheut:capture'], function(){
//    return sheut.compare().then(success, error);
//});
