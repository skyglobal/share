'use strict';

var gulp = require('gulp');
var componentHelper = require('gulp-component-helper')(gulp);
var paths = componentHelper.paths;
var runSequence = require('run-sequence');
var connect = require('gulp-connect');
var child_process = require('child_process');
var fs = require('fs');
var resemble = require('node-resemble');
var spawn = child_process.spawn;
var exec = child_process.exec;

gulp.task('screenshot:init', function(cb){

    var npmChild = spawn('npm', ['install'], {cwd: 'bower_components/backstopjs'});
    npmChild.on('close', function (code) {
        var success = code === 0; // Will be 1 in the event of failure
        if (success){  } else {     }

        cb()
    });

});

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
        cb();
    });


});


gulp.task('screenshot:accepted', function(cb){
    return gulp.src('test/screenshots/new/*')
        .pipe(gulp.dest('test/screenshots/reference'))
});

gulp.task('screenshot:compare', function(cb){
    try {
        var img1 = fs.readFileSync('./test/screenshots/reference/body.png');
    } catch(e){
        console.log('The reference shot does not exit. Please copy it across.');
        process.exit(1);
    }
    var img2 = fs.readFileSync('./test/screenshots/new/body.png');
    var api = resemble(img2).compareTo(img1).onComplete(function(data){
        var err = false;
        if (!data.isSameDimensions) {
            if (data.dimensionDifference.width !== 0) {
                console.log('the new image is wider/smaller: ' + data.dimensionDifference.width + 'px different');
            }
            if (data.dimensionDifference.height !== 0) {
                console.log('the new image is taller/smaller: ' + data.dimensionDifference.height + 'px different');
            }
            err = true;
        }
        if (data.misMatchPercentage > 0) {
            console.log('The new image content has changed: ' + data.misMatchPercentage + '% different');
            console.log('Please check the following images and move them to reference directory if they are correct.');
            console.log(__dirname + '/test/screenshots/new/google.png');
            err = true;
        }
        if (err){
            //gulp.src(['./test/screenshots/reference'])
            //    .pipe('./bower_components/backstopjs/bitmaps_reference');
            process.exit(1);
        } else {
            console.log('The new images match the reference shots');
            cb();
        }
    });

});


//gulp.task('screenshot:test', function(cb){
//
//    var gulpChild = spawn('gulp', ['test'], {cwd: 'bower_components/backstopjs'});
//    gulpChild.on('close', function (code) {
//        console.log(arguments);
//        var success = code === 0; // Will be 1 in the event of failure
//        if (success){
//            console.log('success!');
//            gulp.src('./bower_components/backstopjs/bitmaps_reference/**/*')
//                .pipe(gulp.dest('./test/screenshots/reference'))
//                .emit('end', cb);
//        } else {
//            console.log('woah!');
//            gulp.emit('end', cb)
//        }
//    });
//
//
//    gulpChild.stdout.on('data', function (data) {
//        console.log('stdout: ' + data);
//    });
//
//    gulpChild.stderr.on('data', function (data) {
//        console.log('stderr: ' + data);
//    });
//
//    gulpChild.on('close', function (code) {
//        console.log('child process exited with code ' + code);
//    });
//
//});