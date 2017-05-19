;Container.set('CreateId', function() {
    var i = 0;
    var base_id = new Date().getTime();
    return function() {
        i++;
        return 'creatid__id__' + base_id + i;
    }
});