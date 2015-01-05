(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var utils = require('./utils');
var timeout = { resize: null };

function bindEvents() {
    on(window, 'resize', initResizeEnd);
}

function initResizeEnd() {
    clearTimeout(timeout.resize);
    timeout.resize = setTimeout(function triggerResizeEnd() {
        trigger(window, 'resizeend');
    }, 200);
}


function ready(exec) {
    if (/in/.test(document.readyState)) {
        setTimeout(function () {
            ready(exec);
        }, 9);
    } else {
        exec();
    }
}

function trigger(el, eventName) {
    utils.dispatchEvent(el, eventName);
}

function live(events, selector, eventHandler){
    events.split(' ').forEach(function(eventName){
        utils.attachEvent(eventName, selector, eventHandler);
    });
}

function off(el, eventNames, eventHandler) {
    eventNames.split(' ').forEach(function(eventName) {
        if (el.isNodeList) {
            Array.prototype.forEach.call(el, function (element, i) {
                utils.removeEventListener(element, eventName, eventHandler);
            });
        } else {
            utils.removeEventListener(el, eventName, eventHandler);
        }
    });
}

function on(el, eventNames, eventHandler, useCapture) {
    eventNames.split(' ').forEach(function(eventName) {
        if (el.isNodeList){
            Array.prototype.forEach.call(el, function(element, i){
                utils.addEventListener(element, eventName, eventHandler, useCapture);
            });
        } else {
            utils.addEventListener(el, eventName, eventHandler, useCapture);
        }
    });
}

bindEvents();

module.exports = {
    live: live,
    on: on,
    off: off,
    emit: trigger, //deprecate me
    trigger: trigger,
    ready: ready
};

if (typeof skyComponents === "undefined") window.skyComponents = {};
skyComponents.event = module.exports;

},{"./utils":2}],2:[function(require,module,exports){
var eventRegistry = {};
var state = {    };
var browserSpecificEvents = {
    'transitionend': 'transition',
    'animationend': 'animation'
};
NodeList.prototype.isNodeList = HTMLCollection.prototype.isNodeList = true;

function capitalise(str) {
    return str.replace(/\b[a-z]/g, function () {
        return arguments[0].toUpperCase();
    });
}

function check(eventName) {
    var type = '';
    if (browserSpecificEvents[eventName]){
        eventName =  browserSpecificEvents[eventName];
        type = 'end';
    }
    var result = false,
        eventType = eventName.toLowerCase() + type.toLowerCase(),
        eventTypeCaps = capitalise(eventName.toLowerCase()) + capitalise(type.toLowerCase());
    if (state[eventType]) {
        return state[eventType];
    }
    ['ms', 'moz', 'webkit', 'o', ''].forEach(function(prefix){
        if (('on' + prefix + eventType in window) ||
            ('on' + prefix + eventType in document.documentElement)) {
            result = (!!prefix) ? prefix + eventTypeCaps : eventType;
        }
    });
    state[eventType] = result;
    return result;
}

function dispatchEvent(el, eventName){
    eventName = check(eventName) || eventName;
    var event;
    if (document.createEvent) {
        event = document.createEvent('CustomEvent'); // MUST be 'CustomEvent'
        event.initCustomEvent(eventName, false, false, null);
        el.dispatchEvent(event);
    } else {
        event = document.createEventObject();
        el.fireEvent('on' + eventName, event);
    }
}

function addEventListener(el, eventName, eventHandler, useCapture){
    eventName = check(eventName) || eventName;
    if (el.addEventListener) {
        el.addEventListener(eventName, eventHandler, !!useCapture);
    } else {
        el.attachEvent('on' + eventName, eventHandler);
    }
}

function removeEventListener(el, eventName, eventHandler){
    eventName = check(eventName) || eventName;
    if (el.removeEventListener) {
        el.removeEventListener(eventName, eventHandler, false);
    } else {
        el.detachEvent('on' + eventName, eventHandler);
    }
}

function dispatchLiveEvent(event) {
    var targetElement = event.target;

    eventRegistry[event.type].forEach(function (entry) {
        var potentialElements = document.querySelectorAll(entry.selector);
        var hasMatch = false;
        Array.prototype.forEach.call(potentialElements, function(el){
            if (el.contains(targetElement) || el === targetElement){
                hasMatch = true;
                return;
            }
        });

        if (hasMatch) {
            entry.handler.call(targetElement, event);
        }
    });

}

function attachEvent(eventName, selector, eventHandler){
    if (!eventRegistry[eventName]) {
        eventRegistry[eventName] = [];
        addEventListener(document.documentElement, eventName, dispatchLiveEvent, true);
    }

    eventRegistry[eventName].push({
        selector: selector,
        handler: eventHandler
    });
}


module.exports = {
    dispatchEvent: dispatchEvent,
    attachEvent: attachEvent,
    addEventListener: addEventListener,
    removeEventListener: removeEventListener
};
},{}],3:[function(require,module,exports){
var event = require('../../bower_components/bskyb-event/src/js/event');

function getElementOffset(el) {
    return {
        top: el.getBoundingClientRect().top + window.pageYOffset - document.documentElement.clientTop,
        left: el.getBoundingClientRect().left + window.pageXOffset - document.documentElement.clientLeft
    };
}

function elementVisibleBottom(el) {
    var elementOffset = getElementOffset(el);
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    return (elementOffset.top + el.offsetHeight <= scrollTop + document.documentElement.clientHeight);
}

function elementVisibleRight(el) {
    var elementOffset = getElementOffset(el);
    return (elementOffset.left + el.offsetWidth <= document.documentElement.clientWidth);
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
        return removeClass(el, className);
    } else if (existingIndex <0) {
        return addClass(el, className);
    }
}

function contains(el, child){
    return el !== child && el.contains(child);
}

function matches(el, selector){
    var fn = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    if (!fn)  { //no 'matches' on document.documentElement
        return;
    }
    return fn.call(el, selector);
}

function parent(el, selector) {
    var p = el.parentNode;
    while (!matches(p, selector) && p!==null) {
        p = p.parentNode;
    }
    return p;
}


function toggleSharePopover(e) {
    e.preventDefault();
    var section = parent(this, '.share__popup'),
        popover = section.getElementsByClassName('share__list'),
        triggerEvents = 'keypress touchend click';
    if(e.type === 'click' || e.type === 'touchend' || (e.type === 'keypress' && e.which === 13)) {
        toggleClass(section, 'share__popup--active');
        toggleClass(popover[0], "share__list--left", !elementVisibleRight(popover[0]));
        toggleClass(popover[0], "share__list--top", !elementVisibleBottom(popover[0]));

        event.on(document.documentElement, triggerEvents, function hidePopover(e) {
            if(contains(section, e.target)) { return; }
            removeClass(section, 'share__popup--active');
            event.off(document, triggerEvents, hidePopover);
        });
    }
}


function popupLink(e) {
    e.preventDefault();
    var url = (this.tagName === 'A') ? this : parent(this, 'a').getAttribute('href');
    var width = 626;
    var height = 436;
    var top = (screen.height/2)-(height/2);
    var left = (screen.width/2)-(width/2);
    var windowTitle = 'Sky';
    return window.open(url, windowTitle, 'top=' + top + ',left=' + left + ',width=' + width + ',height='+ height);
}

function bindEvents() {
    event.live('click', '.share__summary', toggleSharePopover);
    event.live('click', '.share__social-link', popupLink);
}

module.exports = {
    init: bindEvents,
    _toggleSharePopover: toggleSharePopover,
    _toggleClass: toggleClass,
    _popupLink: popupLink
};

/* istanbul ignore if */
if (typeof skyComponents === "undefined") window.skyComponents = {};
skyComponents.share = module.exports;
},{"../../bower_components/bskyb-event/src/js/event":1}]},{},[3]);
