'use strict';

var gulp = require('gulp');
var componentHelper = require('gulp-component-helper')(gulp);
var paths = componentHelper.paths;
var runSequence = require('run-sequence');
var connect = require('gulp-connect');
var child_process = require('child_process');
var spawn = child_process.spawn;
var exec = child_process.exec;


//gulp.task('screenshot:record', function(cb){
//
//    connect.server({
//        root: '_site',
//        port: 8888
//    });
//
//    var casperChild = spawn('casperjs', ['test/casper.js'].concat(['test/casper.js']));
//
//    casperChild.on('close', function (code) {
//        var success = code === 0; // Will be 1 in the event of failure
//
//        if (success){
//
//        } else {
//
//        }
//
//
//        connect.serverClose();
//        gulp.emit('end', cb)
//    });
//
//
//});
//
//
//gulp.task('screenshot:accepted', function(cb){
//    return gulp.src('test/screenshots/new/*')
//        .pipe(gulp.dest('test/screenshots/reference'))
//});
//
//var resemble = require('resemblejs');
//gulp.task('screenshot:compare', function(cb){
//    var api = resemble('test/screenshots/reference/google.png').resemble('test/screenshots/new/google.png').onComplete(function(data){
//        console.log(data);
//        /*
//         {
//         red: 255,
//         green: 255,
//         blue: 255,
//         brightness: 255
//         }
//         */
//    });
//});

gulp.task('init:screenshot', function(cb){

    var npmChild = spawn('npm', ['install'], {cwd: 'bower_components/backstopjs'});
    npmChild.on('close', function (code) {
        var success = code === 0; // Will be 1 in the event of failure
        if (success){  } else {     }

        gulp.emit('end', cb)
    });

});

gulp.task('screenshot:test', function(cb){

    var gulpChild = spawn('gulp', ['test'], {cwd: 'bower_components/backstopjs'});
    gulpChild.on('close', function (code) {
        console.log(arguments);
        var success = code === 0; // Will be 1 in the event of failure
        if (success){
            console.log('success!');
            gulp.src('./bower_components/backstopjs/bitmaps_reference/**/*')
                .pipe(gulp.dest('./test/screenshots/reference'))
                .emit('end', cb);
        } else {
            console.log('woah!');
            gulp.emit('end', cb)
        }
    });


    gulpChild.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });

    gulpChild.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });

    gulpChild.on('close', function (code) {
        console.log('child process exited with code ' + code);
    });

});