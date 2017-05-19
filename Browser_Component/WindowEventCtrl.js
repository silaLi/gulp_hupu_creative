Container.set('WindowEventCtrl', function(CreateId, _$$){

    var EventSet = {}
    return {
        register: function(eventName){
            if (!EventSet[eventName]) {
                EventSet[eventName] = {
                    eventName: eventName,
                    ctrl: eventCtrl(eventName)
                }
            }
            return EventSet[eventName].ctrl;
        }
    }
    function eventCtrl(eventName){
        var handlerObjSet = {};
        var handlerIdArr = []
        _$$.Event.on(window, 'resize', function(){
            for (var i = 0, len = handlerIdArr.length; i < len; i++) {
                typeof handlerObjSet[handlerIdArr[i]].handler === 'function' && handlerObjSet[handlerIdArr[i]].handler();
            }
        })
        return {
            push: on,
            remove: off
        }
        function on(handler){
            var id = CreateId();


            var handlerObj = {
                id: id,
                handler: handler,
                index: handlerIdArr.length
            }
            handlerObjSet[id] = handlerObj;
            handlerIdArr.push(id);
            return id;
        }
        function off(id){
            var handlerObj = handlerObjSet[id];
        }
    }
});