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

function contains(el, child){
    return el !== child && el.contains(child);
}

function addClass(el, className){
    if (el.classList)
        el.classList.add(className);
    else
        el.className += ' ' + className;
}

function removeClass(el, className){
    if (el.classList)
        el.classList.remove(className);
    else
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}

function toggleClass(el, className, force){
    if (el.classList) {
        el.classList.toggle(className);
    } else {
        var classes = el.className.split(' ');
        var existingIndex = classes.indexOf(className);

        if (existingIndex >= 0 || force === false)
            removeClass(el, className)
        else if (existingIndex <0 || force === true)
            addClass(el, className)
    }
}

function off(el, eventName, eventHandler){
    el.removeEventListener(eventName, eventHandler);
}
function on(el, eventName, eventHandler){
    el.addEventListener(eventName, eventHandler);
}

function toggleSharePopover(e) {
    e.preventDefault();
    var section = this.parentNode,
        popover = section.parentNode.getElementsByClassName('.popover'),
        triggerEvents = 'keypress ' + ('ontouchend' in document.documentElement ? 'touchend' : 'click');
    if(e.type === 'click' || e.type === 'touchend' || (e.type === 'keypress' && e.which === 13)) {
        toggleClass(section, 'active');
        toggleClass(popover, "top", !elementVisibleBottom(popover[0]));
        toggleClass(popover, "left", !elementVisibleRight(popover[0]));

        on(document, triggerEvents, function hidePopover(e) {
            if(!contains(section, e.target)) {
                removeClass(section, 'active');
                off(document, triggerEvents, hidePopover);
            }
        });
    }
}

var eventRegistry = {};

function dispatchEvent(event) {
    var targetElement = event.target;

    eventRegistry[event.type].forEach(function (entry) {
        var potentialElements = document.querySelectorAll(entry.selector);
        var hasMatch = Array.prototype.indexOf.call(potentialElements, targetElement) >= 0;

        if (hasMatch) {
            entry.handler.call(targetElement, event);
        }
    }.bind(this));

}

function live(){

        return function ( event, selector, handler) {
            if (!eventRegistry[event]) {
                eventRegistry[event] = [];
                this.on(document.documentElement, event, dispatchEvent.bind(this), true);
            }

            eventRegistry[event].push({
                selector: selector,
                handler: handler
            });
        };
}


function bindEvents() {
    live('click keypress', '.share-popup .summary', toggleSharePopover);
}


bindEvents();

module.exports = {
    toggleSharePopover: toggleSharePopover
};

if (typeof skyComponents === "undefined") window.skyComponents = {};
skyComponents.share = module.exports;