// 页面过渡
Container.set('ViewTransition', function(_$$){
    var a = 'transition-view-';
    return function(option){
        var elem = option.elem,
            start = option.start,
            end = option.end,
            complete = option.complete;

        var transitionName = a + start + '-' + end;
        
        elem.removeClass(start).addClass(transitionName)
        // ClassList.remove(elem, start);
        // ClassList.add(elem, transitionName);
        
        elem.on('animationend webkitAnimationEnd', animationend)
        // Event.bind(elem, 'animationend', animationend)
        // Event.bind(elem, 'webkitAnimationEnd', animationend)
        
        function animationend(e){
            elem.removeClass(transitionName).addClass(end)
            // ClassList.remove(elem, transitionName);
            // ClassList.add(elem, end);
            complete && complete()
            
            elem.off('animationend webkitAnimationEnd', animationend)
            // Event.unbind(elem, 'animationend', animationend)
            // Event.unbind(elem, 'webkitAnimationEnd', animationend)
        }
    }
});