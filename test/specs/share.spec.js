document.body.innerHTML = __html__['_site/index.html'];

var share = skyComponents.share;
var event = skyComponents.event;

share.init(); //live events don't init for karma

describe('Share module :', function () {
    var elPopup = document.querySelector('.share__popup');
    var elShare = document.querySelector('.share__summary');
    var elLink = document.querySelector('.share__social-link');

    it('clicking share summary should open the share counts', function () {
        expect(elPopup.className).not.toMatch(/active/);
        event.trigger(elShare,'click');
        expect(elPopup.className).toMatch(/active/);
        event.trigger(elShare,'click');
        expect(elPopup.className).not.toMatch(/active/);
    });

    it('clicking anywhere (no wihin the share list) will close an open popup', function () {
        event.trigger(elShare,'click');
        event.trigger(document.querySelector('.share__list--popup li'),'click');
        expect(elPopup.className).toMatch(/active/);

        event.trigger(document.documentElement,'click');
        expect(elPopup.className).not.toMatch(/active/);
    });

    it('clicking a share link should open a window', function () {
        window.open = function () {};
        spyOn(window, 'open');

        event.trigger(elLink, 'click');

        expect(window.open).toHaveBeenCalled();
    });

    it('clicking a share link icon should open a window', function () {
        window.open = function () {};
        spyOn(window, 'open');

        event.trigger(elLink.querySelector('.skycon'), 'click');

        expect(window.open).toHaveBeenCalled();
    });

});

describe('Toggle Unit test  : ', function () {
    var elShare = document.querySelector('.share__summary');

    it('with native classList', function () {

        expect(elShare.className).not.toMatch(/toggle-test/);
        share._toggleClass(elShare, 'toggle-test');
        expect(elShare.className).toMatch(/toggle-test/);


        share._toggleClass(elShare, 'toggle-test', true);
        expect(elShare.className).toMatch(/toggle-test/);

        share._toggleClass(elShare, 'toggle-test', false);
        expect(elShare.className).not.toMatch(/toggle-test/);

        share._toggleClass(elShare, 'toggle-test');
        share._toggleClass(elShare, 'toggle-test');
        expect(elShare.className).not.toMatch(/toggle-test/);
    });

    it('if classList is not supported', function () {
        var elShare = {className: ''};

        expect(elShare.className).not.toMatch(/native-test/);
        share._toggleClass(elShare, 'native-test');
        expect(elShare.className).toMatch(/native-test/);


        share._toggleClass(elShare, 'native-test', true);
        expect(elShare.className).toMatch(/native-test/);

        share._toggleClass(elShare, 'native-test', false);
        expect(elShare.className).not.toMatch(/native-test/);

        share._toggleClass(elShare, 'native-test');
        share._toggleClass(elShare, 'native-test');
        expect(elShare.className).not.toMatch(/native-test/);
    });
});
