var config = require('./casper.config');
var sites = {};
var imageToCapture = '';
var lastViewport = config.viewports.length;
var lastSite = config.sites.length;
var lastSelector = config.sites[lastSite-1].selectors.length;
var lastImageToCapture = createImageName(config.sites[lastSite-1].name, config.sites[lastSite-1].selectors[lastSelector-1], config.viewports[lastViewport-1].name);
var urls = config.sites.map(function(site){
    sites[site.url] = site;
    return site.url;
});

function slugize(name){
    return name.replace(' ', '-').replace('\\','').replace('/','');
}

function createImageName(site, selector, viewport){
    return slugize(site) + '_' + slugize(selector) + '_' + slugize(viewport) + '.png'
}

var casper = require('casper').create();
casper.start().each(urls, function(self, link) {
    var site = sites[link];

    self.each(config.viewports, function(self, viewport){

        this.then(function() {
            this.viewport(viewport.width, viewport.height);
        });

        this.thenOpen(link, function() {

        //may need to do this if site has JS changing the page on load.
        //    better to hook into browser events or something
        //    this.wait(5000);
        //});
        //this.then(function(){
            this.then(function(){

                this.each(site.selectors, function(self, selector){

                    self.waitForSelector(selector, (function() {
                        imageToCapture = createImageName(site.name, selector, viewport.name);
                        console.log("Saved screenshot " + imageToCapture);
                        self.captureSelector('test/screenshots/new/' + imageToCapture, selector);
                    }), (function() {
                        self.die("Timeout reached. Fail whale?");
                        self.exit();
                    }), 12000);
                    console.log(link, viewport.name, selector)
                });
            });
        });
    });
});

casper.on('capture.saved', function(err) {
    if (imageToCapture === lastImageToCapture){
        this.exit()
    }
});

casper.run();