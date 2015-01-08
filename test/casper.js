
var casper = require('casper').create({
    viewportSize: {width: 900, height: 600}
});


casper.start('http://localhost:8888/', function() {
    this.captureSelector('test/screenshots/new/body.png', 'body');
});

casper.on('capture.saved', function(err) {
    this.exit()
});

casper.run();