(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
    if (el.classList) {
        el.classList.toggle(className);
        return ;
    }
    var classes = el.className.split(' ');
    var existingIndex = classes.indexOf(className);

    if (existingIndex >= 0 || force === false) {
        removeClass(el, className);
    } else if (existingIndex <0 || force === true) {
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
        removeClass(popover[0], "left");
        removeClass(popover[0], "top");
        if (!elementVisibleRight(popover[0])){
            addClass(popover[0], "left");
        }
        if (!elementVisibleBottom(popover[0])){
            addClass(popover[0], "top", !elementVisibleRight(popover[0]));
        }

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
},{}],2:[function(require,module,exports){
var share = require('./share');

if (typeof window.define === "function" && window.define.amd) {
    define('bower_components/bskyb-share/dist/js/share.requirejs', [], function() {
        'use strict';
        return share;
    });
}
},{"./share":1}]},{},[2]);
