'use strict';

var gulp = require('gulp');
var componentHelper = require('gulp-component-helper')(gulp);
var paths = componentHelper.paths;
var runSequence = require('run-sequence');
var connect = require('gulp-connect');
var resemble = require('resemblejs');
var spawn = require('child_process').spawn;


gulp.task('screenshot:record', function(cb){

    connect.server({
        root: '_site',
        port: 8888
    });

    var casperChild = spawn('casperjs', ['test/casper.js'].concat(['test/casper.js']));

    casperChild.on('close', function (code) {
        var success = code === 0; // Will be 1 in the event of failure

        if (success){

        } else {

        }


        connect.serverClose();
        gulp.emit('end', cb)
    });


});


gulp.task('screenshot:accepted', function(cb){
    return gulp.src('test/screenshots/new/*')
        .pipe(gulp.dest('test/screenshots/base'))
});

gulp.task('screenshot:compare', function(cb){
    var api = resemble('test/screenshots/base/google.png').onComplete(function(data){
        console.log(data);
        /*
         {
         red: 255,
         green: 255,
         blue: 255,
         brightness: 255
         }
         */
    });
});