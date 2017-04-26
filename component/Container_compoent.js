;Container.set('CreateId', function() {
    var i = 0;
    var base_id = new Date().getTime();
    return function() {
        i++;
        return 'creatid__id__' + base_id + i;
    }
});
Container.set('Attr', function () {
    return function(elem){
        return{
            get: get,
            set: set,
            remove: remove
        }
        function get(name){
            return elem.getAttribute(name);
        }
        function set(name, value){
            elem.setAttribute(name, value);
            return this;
        }
        function remove(name){
            elem.removeAttribute(name);
            return this;
        }
    }
});
Container.set('Event', function(PreventDefault) {
    return {
        bind: bindEvent,
        unbind: unbindEvent,
        pd: PreventDefault
    }

    function bindEvent(elem, eventType, next, useCapture) {
        useCapture = useCapture ? true : false;
        if (!elem) {
            return 'has no element in bindEvent'
        }
        if (elem != window && typeof elem.length === 'number' && !elem.nodeType) {
            for (var i = elem.length - 1; i >= 0; i--) {
                bind(elem[i], eventType, next, useCapture);
            }
        } else {
            bind(elem, eventType, next, useCapture)
        }

        function bind(elem, eventType, next, useCapture) {
            if (elem.addEventListener) {
                elem.addEventListener(eventType, next, useCapture);
            }else if (elem.detachEvent) {
                elem.detachEvent('on' + eventType, next);
            } else {
                elem['on' + eventType] = next;
            }
        }
    }

    function unbindEvent(elem, eventType, next, useCapture) {
        useCapture = useCapture || false;
        
        if (!elem) {
            return 'has no element in bindEvent'
        }
        if (elem != window && typeof elem.length === 'number') {
            for (var i = elem.length - 1; i >= 0; i--) {
                unbind(elem[i], eventType, next, useCapture);
            }
        } else {
            unbind(elem, eventType, next, useCapture)
        }

        function unbind(elem, eventType, next, useCapture) {

            if (elem.removeEventListener) {
                elem.removeEventListener(eventType, next, useCapture);
            } else if (elem.detachEvent) {
                elem.detachEvent('on' + eventType, next);
            } else {
                elem['on' + eventType] = null;
            }
        }
    }
});
Container.set('PreventDefault', function() {
    return function(e) {
        e.preventDefault()
        e.stopPropagation()
        return false
    }
});
Container.set('DomReady', function(Event) {
    var Cache = {
        complete: document.readyState === 'complete',
        handler: []
    }
    Event.bind(document, 'DOMContentLoaded', completeHandlde);


    completeHandlde();
    function completeHandlde(event){
        Cache.complete = true;
        for (var i = 0, len = Cache.handler.length; i < len; i++) {
            complete(Cache.handler[i]);
        }
        Container.set('DomReadyComplete', true);
    }
    function complete(obj){
        if (Cache.complete && obj.duration > 0) {
            setTimeout(function(){
                obj.handler && obj.handler();
            }, obj.duration);
        }else if (Cache.complete && obj.duration <= 0) {
            obj.handler && obj.handler();
        }
    }
    return function(handler, duration){
        duration = duration || 0;
        var obj = {
            duration: duration,
            handler: handler
        }
        Cache.handler.push(obj);

        complete(obj);
    }
});
Container.set('FastRender', function(){
    return function(str){
        var div = document.createElement('div');
        div.innerHTML = str;

        var childElements = [];
        for (var i = 0, len = div.childNodes.length - 1; i <= len; i++) {
            if (div.childNodes[i].nodeType == 1) {
                childElements.push(div.childNodes[i]);
            }
        }
        return childElements;
    }
});
Container.set("_$", function(){
    return function(selector, elem) {
        return elem ? elem.querySelector(selector) : document.querySelector(selector) 
    }
});
Container.set("_$s", function(){
    return function(selector, elem) {
        return elem ? elem.querySelectorAll(selector) : document.querySelectorAll(selector) 
    }
});
;Container.set('ClassList', function(){
    return{
        add: addClass,
        remove: removeClass,
        contains: containsClass
    }
    function containsClass(elem, className){
        if (!elem) { return 'there is no elem'; }

        var classList = getClassList(elem);
        if (contains(classList, className) < 0) {
            return false
        }
        return true;
    }
    function addClass(elem, className){
        if (!elem) { return 'there is no elem'; }

        var classList = getClassList(elem);
        if (contains(classList, className) < 0) {
            classList.push(className)
        }
        setClassList(elem, classList)
        return elem;
    }
    function removeClass(elem, className){
        if (!elem) { return 'there is no elem'; }
        
        var classList = getClassList(elem);
        var index = contains(classList, className);
        if (index >= 0) {
            classList.splice(index, 1);
            setClassList(elem, classList);
        }
        return elem;
    }
    function contains(classList, className){
        for (var i = 0, len = classList.length; i < len; i++) {
            if (classList[i] == className) {
                return i;                
            }
        }
        return -1;
    }

    function getClassList(elem){
        var classList = (elem.className || '').split(' ')
        for (var i = classList.length - 1; i >= 0; i--) {
            if (classList[i] === '') {
                classList.splice(i, 1);
            }
        }
        return classList;
    }
    function setClassList(elem, classList){
        elem.className = classList.join(' ');
    }
});
;Container.set('ES5Array', function() {
    return ES5Array;

    function ES5Array(array){
        if (!(array && typeof array.length == 'number')) {
            throw 'not is array';
        }
        this.value = array;

        this.forEach = forEach;
    }

    function forEach(fn, context) {
        var array = this.value;
        
        for (var k = 0, len = array.length; k < len; k++) {
            if (typeof fn === "function" && Object.prototype.hasOwnProperty.call(array, k)) {
                fn.call(context, array[k], k, array);
            }
        }
    };
});
Container.set('Path', function(){
    var a = document.createElement('a');
    var a_pathname = document.createElement('a');
    var __dirname__list = null;
    var __dirname = null;
    
    setDirName(location.pathname);
    
    function dir2List(path){
        var pathList = path.split('/');

        pathList.shift();
        pathList.pop();

        return pathList;
    }
    function dirList2String(pathList){
        return '/' + pathList.join('/') + '/'
    }
    function setDirName(path){
        a.href = path;
        path = a.pathname;
        
        __dirname__list = dir2List(path);
        __dirname = dirList2String(__dirname__list);
    }
    return {
        update: setDirName,
        getPath: function(){
            return __dirname;
        },
        resolve: function(url){
            a_pathname.href = __dirname + url;
            return a.origin + a_pathname.pathname + a_pathname.search;
        }
    }
});
;Container.set('Image', function(){
    return function(){
        if (window.Image) {
            return new window.Image();
        }else{
            return function(){
                return document.createElement('img');
            }
        }
    }
});