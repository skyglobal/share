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

    xit(' Pressing enter on share link should open popup', function () {
        expect(popup.className).not.toMatch(/active/);
        event.trigger(share, 'keypress', 13);
        expect(popup.className).toMatch(/active/);
        event.trigger(share, 'keypress', {which: 13});
        expect(popup.className).not.toMatch(/active/);
    });

    xit('Pressing any key should not open share popup', function () {
        expect(popup.className).not.toMatch(/active/);
        var e = jQuery.Event("keypress");
        e.which = 12; // # Some key code value
        $(".summary").trigger(e);
        expect(popup.className).not.toMatch(/active/);
    });
});