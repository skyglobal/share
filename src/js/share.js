function getElementOffset(el) {
    return {
        top: el.getBoundingClientRect().top + window.pageYOffset - document.documentElement.clientTop,
        left: el.getBoundingClientRect().left + window.pageXOffset - document.documentElement.clientLeft
    };
}

function elementVisibleBottom(el) {
    if (el.length < 1)
        return;
    var elementOffset = getElementOffset(el);
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    return (elementOffset.top + el.offsetHeight <= scrollTop + document.documentElement.clientHeight);
}

function elementVisibleRight(el) {
    if (el.length < 1)
        return;
    var elementOffset = getElementOffset(el);
    return (elementOffset.left + el.offsetWidth <= document.documentElement.clientWidth);
}

var $document = $(document);

function bindEvents() {
    $document.on('click keypress', '.share-popup .summary', toggleSharePopover);
}

function toggleSharePopover(e) {
    e.preventDefault();
    var $section = $(this).parent(),
        $popover = $section.parent().find('.popover'),
        triggerEvents = 'keypress ' + ('ontouchend' in document.documentElement ? 'touchend' : 'click');
    if(e.type === 'click' || e.type === 'touchend' || (e.type === 'keypress' && e.which === 13)) {
        $section.toggleClass('active');
        $popover.toggleClass("top", !elementVisibleBottom($popover[0]));
        $popover.toggleClass("left", !elementVisibleRight($popover[0]));

        $document.on(triggerEvents, function hidePopover(e) {
            if(!$.contains($section[0], e.target)) {
                $section.removeClass('active');
                $document.off(triggerEvents, hidePopover);
            }
        });
    }
}

bindEvents();

module.exports = {
    toggleSharePopover: toggleSharePopover
};

if (typeof skyComponents === "undefined") window.skyComponents = {};
skyComponents.share = module.exports;