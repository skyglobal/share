function getElementOffset(el) {
    return {
        top: el.getBoundingClientRect().top + window.pageYOffset - document.documentElement.clientTop,
        left: el.getBoundingClientRect().left + window.pageXOffset - document.documentElement.clientLeft
    };
}

function elementVisibleBottom(el) {
    if (el.length < 1){
        return;
    }
    var elementOffset = getElementOffset(el);
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    return (elementOffset.top + el.offsetHeight <= scrollTop + document.documentElement.clientHeight);
}

function elementVisibleRight(el) {
    if (el.length < 1) {
        return;
    }
    var elementOffset = getElementOffset(el);
    return (elementOffset.left + el.offsetWidth <= document.documentElement.clientWidth);
}

function contains(el, child){
    return el !== child && el.contains(child);
}

function addClass(el, className){
    if (el.classList) {
        el.classList.add(className);
    } else {
        el.className += ' ' + className;
    }
}

function removeClass(el, className){
    if (el.classList) {
        el.classList.remove(className);
    } else {
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
}

function toggleClass(el, className, force){
    if (force === true){
        return addClass(el, className);
    } else if (force === false){
        return removeClass(el, className);
    } else if (el.classList) {
        return el.classList.toggle(className);
    }
    var classes = el.className.split(' ');
    var existingIndex = classes.indexOf(className);

    if (existingIndex >= 0){
        removeClass(el, className);
    } else if (existingIndex <0) {
        addClass(el, className);
    }
}

function off(el, eventName, eventHandler){
    el.removeEventListener(eventName, eventHandler);
}

function on(el, eventName, eventHandler, useCapture){
    el.addEventListener(eventName, eventHandler, !!useCapture);
}

function matches(el, selector){
    var fn = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    return fn.call(el, selector);
}

function parent(el, selector) {
    var p = el.parentNode;
    if (!selector){
        return p;
    }

    while (!matches(p, selector) && p!==null) {
        p = p.parentNode;
    }
    return p;
}

var eventRegistry = {};

function dispatchEvent(event) {
    var targetElement = event.target;

    eventRegistry[event.type].forEach(function (entry) {
        var potentialElements = document.querySelectorAll(entry.selector);
        var hasMatch = false;
        Array.prototype.forEach.call(potentialElements, function(item){
            if (contains(item, targetElement)){
                hasMatch = true;
                return;
            }
        });

        if (hasMatch) {
            entry.handler.call(targetElement, event);
        }
    }.bind(this));

}

function live(event, selector, handler){

    if (!eventRegistry[event]) {
        eventRegistry[event] = [];
        on(document.documentElement, event, dispatchEvent.bind(this), true);
    }

    eventRegistry[event].push({
        selector: selector,
        handler: handler
    });
}




function toggleSharePopover(e) {
    e.preventDefault();
    var section = parent(this, '.share-popup'),
        popover = section.getElementsByClassName('popover'),
        triggerEvents = 'keypress ' + ('ontouchend' in document.documentElement ? 'touchend' : 'click');
    if(e.type === 'click' || e.type === 'touchend' || (e.type === 'keypress' && e.which === 13)) {
        toggleClass(section, 'active');
        console.log('left', !elementVisibleRight(popover[0]))
        toggleClass(popover[0], "left", !elementVisibleRight(popover[0]));
        console.log('top', !elementVisibleBottom(popover[0]))
        toggleClass(popover[0], "top", !elementVisibleBottom(popover[0]));

        on(document, triggerEvents, function hidePopover(e) {
            if(!contains(section, e.target)) {
                removeClass(section, 'active');
                off(document, triggerEvents, hidePopover);
            }
        });
    }
}


function popupLink(e) {
    e.preventDefault();
    var args = {}
    var url = (this.tagName === 'A') ? this : parent(this, 'a').getAttribute('href');
    var width = args.width || 626;
    var height = args.height || 436;
    var top = args.top || (screen.height/2)-(height/2);
    var left = args.left || (screen.width/2)-(width/2);
    var windowTitle = args.title || 'Sky';
    return window.open(url, windowTitle, 'top=' + top + ',left=' + left + ',width=' + width + ',height='+ height);

}

function bindEvents() { // keypress
    live('click', '.share-popup .summary', toggleSharePopover);
    live('click', '[data-popup]', popupLink);
}

module.exports = {
    init: bindEvents,
    toggleSharePopover: toggleSharePopover
};

if (typeof skyComponents === "undefined") window.skyComponents = {};
skyComponents.share = module.exports;