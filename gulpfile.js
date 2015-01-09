'use strict';

var gulp = require('gulp');
var componentHelper = require('gulp-component-helper')(gulp);
var paths = componentHelper.paths;
var runSequence = require('run-sequence');
var connect = require('gulp-connect');
var child_process = require('child_process');
var del = require('del');
var fs = require('fs');
var path = require('path');
var resemble = require('node-resemble');
var spawn = child_process.spawn;
var exec = child_process.exec;
var execFile = child_process.execFile;


try {
    fs.mkdir('./test/screenshots');
    fs.mkdir('./test/screenshots/difference');
    fs.mkdir('./test/screenshots/new');
    fs.mkdir('./test/screenshots/reference');
} catch(e){

}

gulp.task('screenshot:init', function(cb){

    var npmChild = spawn('npm', ['install'], {cwd: 'bower_components/backstopjs'});
    npmChild.on('close', function (code) {
        var success = code === 0; // Will be 1 in the event of failure
        if (success){  } else {     }

        cb()
    });

});


gulp.task('screenshot:capture', function(cb){

    connect.server({
        root: '_site',
        port: 8888
    });

    var casperChild = spawn('casperjs', ['test/casper.js']);

    casperChild.on('close', function (code) {
        var success = code === 0; // Will be 1 in the event of failure

        if (success){

        } else {

        }

        connect.serverClose();
        cb();
    });
});


gulp.task('screenshot:accept', function(cb){
    return gulp.src('test/screenshots/new/*')
        .pipe(gulp.dest('test/screenshots/reference'))
});

gulp.task('clean:screenshot-difference', function(cb){
    return del(['./test/screenshots/different'], cb);
});
gulp.task('clean:screenshot-record', function(cb){
    return del(['./test/screenshots/new'], cb);
});


gulp.task('screenshot:compare', ['clean:screenshot-difference'], function(cb){
    execFile('find', [ './test/screenshots/reference' ], function(err, stdout, stderr) {
        var file_list = stdout.split('\n');
        file_list.shift();
        file_list.pop();
        file_list.forEach(function(file){
            var img1 = fs.readFileSync(file);
            var img2 = fs.readFileSync(file.replace('/reference/', '/new/'));
            var imgDiff = file.replace('/reference/', '/difference/');
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
                    console.log(file);
                    err = true;
                }
                if (err){
                    var base64 = data.getImageDataUrl().replace(/^data:image\/png;base64,/, "");
                    fs.writeFile(imgDiff, base64, {encoding:'base64'}, function(){
                            //process.exit(1);
                    });
                }
            });
        });

        if (err){
            process.exit(1);
        } else {
            console.log('The new images match the reference shots');
            cb();
        }
    });
});