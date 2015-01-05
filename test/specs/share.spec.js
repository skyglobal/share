document.body.innerHTML = __html__['_site/index.html'];

var share = skyComponents.share;
var event = skyComponents.event;

share.init(); //live events don't init for karma

describe('Share module with click', function () {
    var popup = document.querySelector('.share__popup');
    var share = document.querySelector('.share__summary');

    it('clicking share link should open the popup', function () {
        expect(popup.className).not.toMatch(/active/);
        event.trigger(share,'click');
        expect(popup.className).toMatch(/active/);
        event.trigger(share,'click');
        expect(popup.className).not.toMatch(/active/);
    });

    it('clicking anywhere will close an open popup', function () {
        event.trigger(share,'click');
        event.trigger(document.documentElement,'click');
        expect(popup.className).not.toMatch(/active/);
    });

});