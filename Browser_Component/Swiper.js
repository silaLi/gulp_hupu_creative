;Container.set('Swiper', function(Hammer, _$$, CreateId, AutoprefixerCssStyle, WaitResources, WindowEventCtrl) {
    return function(elem, opt){
        opt = opt || {};
        Hammer = Hammer || window.Hammer;
        
        var Swiper_id = CreateId();
        var static_ClassName = {
            swiper_button_disabled: 'swiper-button-disabled',
            auto_width_mode: 'auto_width'
        }
        container = typeof elem === 'string'? _$$(elem).getElemList(0) : elem;
        if ( !container ) {
            return 'has no the elem';
        }
        nextButton = typeof opt.nextButton === 'string'? _$$(opt.nextButton).getElemList(0): opt.nextButton;
        prevButton = typeof opt.prevButton === 'string'? _$$(opt.prevButton).getElemList(0): opt.prevButton;
        var attr = _$$.Attr(container)
        var elem_id = attr.get('swiper-id');
        if ( elem_id ) {
            return Container(elem_id);
        }else{
            attr.set('swiper-id', Swiper_id);
        }
        var Cache = {
            id: Swiper_id,
            container: container,
            wrapper: _$$('[swiper-id='+Swiper_id+'] > .swiper-wrapper').getElemList(0),
            slides: _$$('[swiper-id='+Swiper_id+'] > .swiper-wrapper > .swiper-slide').getElemList(),
            offsetLeftList: [],
            nextButton: nextButton,
            prevButton: prevButton
        }
        
        Cache.wrapperWidth = Cache.wrapper.clientWidth;
        Cache.slidesLength = Cache.slides.length;
        Cache.activeIndex = 0;
        Cache.activeOffsetLeft = 0;
        Cache.activeOffsetLeftMin = 0;
        Cache.activeOffsetLeftMax = getWrapperSlideWidth() - Cache.wrapperWidth;
        Cache.duration = 300;
        Cache.transition_timer = null;
        arguBind(opt);
        wholeWidth(opt.wholeWidth);

        initializate_interface(opt, opt.loop === true ? loop_initializate : initializate);
        
        action(opt);
        var CacheAPI = {
            loop_updateOffsetLeftList: function(){
                if ( !opt.loop ) {
                    return 'not loop'
                }
                loop_setOffsetLeftList();

                /** slidesLength */
                var sl = Cache.slidesLength;
                if (sl == 1) {
                    Cache.wrapperSlideWidthNum = Cache.slides[0].clientWidth;
                }else{
                    Cache.wrapperSlideWidthNum = Cache.offsetLeftList[1] + Cache.offsetLeftList[sl - 1];
                }
                for (var i = 0, len = Cache.slides.length; i < len; i++) {
                    /** offsetLeft of swiper-slide    */
                    Cache.offsetLeftList[i + sl * 1] = Cache.offsetLeftList[i] + Cache.wrapperSlideWidthNum * 1;
                    /** offsetLeft of substitute_next */
                    Cache.offsetLeftList[i + sl * 2] = Cache.offsetLeftList[i] + Cache.wrapperSlideWidthNum * 2;
                }
                Cache.activeOffsetLeft = Cache.wrapperSlideWidthNum;
            }
        }
        Container(Swiper_id, CacheAPI);
        return CacheAPI;
        function wholeWidth(wholeWidth){
            /** wholeWidth can not use with auto_width */
            if (wholeWidth === true && opt.auto_width !== true) {
                /** only word when wrapperSlideWidth < wrapperWidth */
                var wrapperSlideWidth = getWrapperSlideWidth();
                if (wrapperSlideWidth > Cache.wrapperWidth) {
                    return;
                }
                var slideWidth = Math.ceil(Cache.wrapperWidth / Cache.slidesLength);
                for (var i = Cache.slides.length - 1; i >= 0; i--) {
                    Cache.slides[i].style.width = slideWidth + 'px';
                }
            }
        }
        function arguBind(opt){
            var auto_width = opt.auto_width || false;
            if (auto_width === true) {
                _$$.ClassList.add( Cache.container, static_ClassName.auto_width_mode )
            }

            Cache.duration = opt.duration || Cache.duration
        }
        /** it can known i need use initializate or loop_initializate */
        function initializate_interface(opt, initializateHandler){
            var waitResourcesObj = WaitResources(waitResourcesEachComplete);
            if ( opt.auto_width ) {
                waitResourcesObj.setLoadhandler(waitResourcesEachComplete);
            }else{
                initializateHandler(opt)
            }
            waitResourcesObj.push(_$$.render([Cache.wrapper]).find('img').getElemList())
            waitResourcesObj.complete()

            function waitResourcesEachComplete(){
                initializateHandler(opt)
            }
        }
        function loop_initializate( opt ){
            loop_setOffsetLeftList()
            
            loop_supplement();
            loop_updateLoad();
        }
        function loop_supplement(){
            if ( !opt.loop ) {
                return 'not loop'
            }
            Cache.has_loop_supplement = true;
            /** slidesLength */
            var sl = Cache.slidesLength;
            if (sl == 1) {
                Cache.wrapperSlideWidthNum = Cache.slides[0].clientWidth;
            }else{
                Cache.wrapperSlideWidthNum = Cache.offsetLeftList[1] + Cache.offsetLeftList[sl - 1];    
            }
            Cache.wrapper.style.display = 'none';
            
            var wrapper_slides_prev = _$$.render([Cache.wrapper]).find('.substitute_prev').getElemList();
            var wrapper_slides_next = _$$.render([Cache.wrapper]).find('.substitute_next').getElemList();
            for (var i = 0,len = wrapper_slides_prev.length; i < len; i++) {
                Cache.wrapper.removeChild(wrapper_slides_prev[i]);
                Cache.wrapper.removeChild(wrapper_slides_next[i]);
            }
            
            Cache.substitute_prev_slides = [];
            for (var i = 0, len = Cache.slides.length; i < len; i++) {
                /** insert elem before */
                var slideNode = Cache.slides[i].cloneNode(true);
                _$$.ClassList.add(slideNode, 'substitute_prev');
                Cache.wrapper.insertBefore(slideNode, Cache.slides[0]);
                Cache.substitute_prev_slides.push(slideNode);

                /** insert elem after */
                var slideNode = Cache.slides[i].cloneNode(true);
                _$$.ClassList.add(slideNode, 'substitute_next');
                Cache.wrapper.appendChild(slideNode);


                /** offsetLeft of swiper-slide    */
                Cache.offsetLeftList[i + sl * 1] = Cache.offsetLeftList[i] + Cache.wrapperSlideWidthNum * 1;
                /** offsetLeft of substitute_next */
                Cache.offsetLeftList[i + sl * 2] = Cache.offsetLeftList[i] + Cache.wrapperSlideWidthNum * 2;
            }
            Cache.wrapper.style.display = '';

            Cache.activeIndex = sl;
            Cache.activeOffsetLeft = Cache.wrapperSlideWidthNum;
            Cache.activeOffsetLeftMin = 0;
            Cache.activeOffsetLeftMax = Infinity;
        }
        function initializate(opt){
            setOffsetLeftList()
            updateLoad()
        }
        function action(opt){
            setBtnClick();
            var parentNodeHasSwipe = false
            var parentNode = Cache.container
            while(parentNode){
                if (parentNode.tagName !== 'HTML') {
                    if (_$$.ClassList.contains(parentNode, 'hammer-swipe-event')) {
                        parentNodeHasSwipe = true;
                    }
                    parentNode = parentNode.parentNode;
                }else{
                    parentNode = null
                }
            }
            if (!parentNodeHasSwipe) {
                new Hammer( Cache.container, {
                  domEvents: true
                } );
            }
            _$$.ClassList.add(Cache.container, 'hammer-swipe-event');

            _$$.Event.on(Cache.container, 'swipeleft', function(e){
                go_next();
                return _$$.pdsp(e);
            })
            _$$.Event.on(Cache.container, 'swiperight', function(e){
                go_prev();
                
                return _$$.pdsp(e);
            })

            _$$.Event.on(Cache.container, 'mouseenter', function(e){
                stopAutoPlay();
                return _$$.pdsp(e);
            })
            _$$.Event.on(Cache.container, 'mouseleave', function(e){
                startAutoPlay();
                return _$$.pdsp(e);
            })

            WindowEventCtrl.register('resize').push(function(){
                CacheAPI.loop_updateOffsetLeftList()
                updateLoad_interface()
            })
            setPagination();
            updateWrapper_after();
            autoplay_handler(opt.autoplay)
        }

        function autoplay_handler(autoplay){
            if (typeof autoplay !== 'number' || autoplay <= 0) {
                return 'not has autoplay'
            }
            startAutoPlay(autoplay)
        }
        function startAutoPlay(autoplay){
            autoplay = autoplay || opt.autoplay;
            if (typeof autoplay !== 'number' || autoplay <= 0) {
                return 'not has autoplay'
            }
            stopAutoPlay();
            Cache.autoplayTimer = setInterval(function(){
                go_next();
            }, autoplay)
        }
        function stopAutoPlay(){
            clearInterval(Cache.autoplayTimer);
            Cache.autoplayTimer = null;
        }
        function restartAutoPlay(){
            stopAutoPlay();
            startAutoPlay();
        }

        function loop_setOffsetLeftList(){

            var offsetLeftList = [0];
            for (var i = 0, len =  Cache.slides.length; i < len; i++) {
                offsetLeftList[i] = Cache.slides[i].offsetLeft - offsetLeftList[0];
            }
            offsetLeftList[0] = 0;
            Cache.offsetLeftList_real = offsetLeftList;
            Cache.offsetLeftList = offsetLeftList;
        }
        function setOffsetLeftList(){
            Cache.offsetLeftList = [0];
            for (var i = 1, len =  Cache.slides.length; i < len; i++) {
                Cache.offsetLeftList.push(Cache.slides[i].offsetLeft);
            }
            Cache.offsetLeftList_real = Cache.offsetLeftList
        }
        function updateLoad_interface(){
            opt.loop === true? loop_updateLoad(): updateLoad();
        }
        function loop_updateLoad(){
            Cache.wrapperWidth = Cache.wrapper.clientWidth;

            setOffsetLeftValue(null, true)
            updateWrapper_after()
            if (Cache.wrapperSlideWidthNum < Cache.wrapperWidth) {
                Cache.state = 'stop';
                _$$.ClassList.add(Cache.wrapper, 'slides-lack')
                Cache.prevButton && setTimeout(function(){ _$$.ClassList.add(Cache.prevButton, static_ClassName.swiper_button_disabled) });
                Cache.nextButton && setTimeout(function(){ _$$.ClassList.add(Cache.nextButton, static_ClassName.swiper_button_disabled) });
            }else{
                Cache.state = 'run';
                _$$.ClassList.remove(Cache.wrapper, 'slides-lack')
                Cache.prevButton && setTimeout(function(){ _$$.ClassList.remove(Cache.prevButton, static_ClassName.swiper_button_disabled) });
                Cache.nextButton && setTimeout(function(){ _$$.ClassList.remove(Cache.nextButton, static_ClassName.swiper_button_disabled) });
            }
        }
        function updateLoad(){
            Cache.wrapperWidth = Cache.wrapper.clientWidth;
            Cache.activeOffsetLeftMax = getWrapperSlideWidth() - Cache.wrapperWidth;
            
            setOffsetLeftValue(null, true)
            updateWrapper_after()
        }

        function setOffsetLeftValue(offsetLeftValue, direct){
            restartAutoPlay();
            offsetLeftValue = offsetLeftValue == undefined ? Cache.activeOffsetLeft : offsetLeftValue; 
            Cache.activeOffsetLeft = getOffsetLeftMax( offsetLeftValue );
            Cache.activeOffsetLeft = getOffsetLeftMin( Cache.activeOffsetLeft );
            Cache.wrapper.style.cssText = AutoprefixerCssStyle('transition-duration', direct ? 0 :( Cache.duration / 1000 ) + 's') + AutoprefixerCssStyle('transform', 'translate(-'+Cache.activeOffsetLeft+'px)')
        }

        function go_next(){
            if (Cache.state === 'stop') {
                return
            }

            if (Cache.activeOffsetLeft >= Cache.activeOffsetLeftMax) {
                return
            }

            for (var i = 0, len = Cache.offsetLeftList.length; Cache.offsetLeftList[i] <= Cache.activeOffsetLeft && i < len; i++) { }
            Cache.activeIndex = i;
            setOffsetLeftValue( Cache.offsetLeftList[i] );

            typeof opt.onSlideStart === 'function' && opt.onSlideStart(Cache)
            
            Cache.transition_timer = setTimeout(updateWrapper_after, Cache.duration);
        }

        function go_prev(){
            if (Cache.state === 'stop') {
                return
            }
            if (Cache.activeOffsetLeft <= Cache.activeOffsetLeftMin) {
                return
            }

            for (var i = Cache.offsetLeftList.length - 1; Cache.offsetLeftList[i] >= Cache.activeOffsetLeft && i >= 0; i--) { }
            Cache.activeIndex = i;

            setOffsetLeftValue( Cache.offsetLeftList[i] );

            typeof opt.onSlideStart === 'function' && opt.onSlideStart(Cache)

            
            Cache.transition_timer = setTimeout(updateWrapper_after, Cache.duration);
        }

        function getOffsetLeftMax(offsetLeft){
            if (offsetLeft >= Cache.activeOffsetLeftMax) {
                return Cache.activeOffsetLeftMax
            }
            return offsetLeft
        }
        function getOffsetLeftMin(offsetLeft){
            if (offsetLeft <= Cache.activeOffsetLeftMin) {
                return Cache.activeOffsetLeftMin
            }
            return offsetLeft
        }

        function updateWrapper_after(){
            if ( Cache.activeOffsetLeft <= Cache.activeOffsetLeftMin ) {
                Cache.prevButton && _$$.ClassList.add(Cache.prevButton, static_ClassName.swiper_button_disabled)
            }else{
                Cache.prevButton && _$$.ClassList.remove(Cache.prevButton, static_ClassName.swiper_button_disabled)
            }

            if ( Cache.activeOffsetLeft >= Cache.activeOffsetLeftMax ) {
                Cache.nextButton && _$$.ClassList.add(Cache.nextButton, static_ClassName.swiper_button_disabled)
            }else{
                Cache.nextButton && _$$.ClassList.remove(Cache.nextButton, static_ClassName.swiper_button_disabled)
            }

            updatePagination();
            loop_resetActive();

            typeof opt.onSlideEnd === 'function' && opt.onSlideEnd(Cache)
        }

        function loop_resetActive(){
            if (opt.loop !== true) {
                return 'is not loop swiper, does not need resetActive'
            }
            var activeIndex = (Cache.activeIndex + Cache.slidesLength) % Cache.slidesLength + Cache.slidesLength;
            Cache.activeIndex = activeIndex;
            setOffsetLeftValue(Cache.offsetLeftList[activeIndex], true)
        }

        function setBtnClick(){
            if (opt.nextButton) {
                _$$.Event.on(Cache.nextButton, 'click', function(e){
                    go_next();
                    return _$$.pdsp(e);
                })
            }
            
            if (opt.prevButton) {
                _$$.Event.on(Cache.prevButton, 'click', function(e){
                    go_prev();

                    return _$$.pdsp(e);
                })
            }
            
        }

        function setPagination(){
            if (!opt.pagination) {
                return
            }
            Cache.pagination = _$$(opt.pagination).getElemList(0);
            _$$.ClassList.add(Cache.pagination, 'swiper-pagination-bullets')

            var pagination_li_HTML = '';
            for (var i = 0, len = Cache.slides.length; i < len; i++) {
                if (opt.paginationTemplate_handler) {
                    pagination_li_HTML += opt.paginationTemplate_handler(i, 'swiper-pagination-bullet', 'swiper-pagination-index');
                }else{
                    pagination_li_HTML += '<span swiper-pagination-index="'+i+'" class="swiper-pagination-bullet"></span>'
                }
            }
            Cache.pagination.innerHTML = pagination_li_HTML;
            Cache.paginationBullets = _$$.render([Cache.pagination]).find('.swiper-pagination-bullet').getElemList();

            pagination_click_event();
        }

        function pagination_click_event(){
            var pagination_event_handler = opt.loop === true ? loop_pagination_click_handler: pagination_click_handler
            _$$.Event.on(Cache.paginationBullets, 'click', function(e){

                var index = _$$.Attr(this).get('swiper-pagination-index');
                Cache.activeIndex = index - 0;
                pagination_event_handler( Cache.activeIndex );
                
                return _$$.pdsp(e);
            })
        }
        function  pagination_click_handler(index) {
            
            setOffsetLeftValue( Cache.offsetLeftList[index] );
            typeof opt.onSlideStart === 'function' && opt.onSlideStart(Cache)
            Cache.transition_timer = setTimeout(updateWrapper_after, Cache.duration);
        }
        function loop_pagination_click_handler(index) {
            var index = ( index - 0 + Cache.slidesLength ) % Cache.slidesLength + Cache.slidesLength;

            setOffsetLeftValue( Cache.offsetLeftList[index] );
            typeof opt.onSlideStart === 'function' && opt.onSlideStart(Cache)
            Cache.transition_timer = setTimeout(updateWrapper_after, Cache.duration);
        }

        function updatePagination(){
            if (!opt.pagination) {
                return
            }

            Cache.activePaginationBullet && _$$.ClassList.remove(Cache.activePaginationBullet, 'swiper-pagination-bullet-active')
            if (Cache.paginationBullets) {
                var activeIndex = ( Cache.activeIndex + Cache.slidesLength ) % Cache.slidesLength
                _$$.ClassList.add(Cache.paginationBullets[activeIndex], 'swiper-pagination-bullet-active')
                Cache.activePaginationBullet = Cache.paginationBullets[activeIndex]
            }
        }

        function getWrapperSlideWidth(){
            var div = document.createElement('div')
            div.style.cssText = 'display: inline-block';
            Cache.wrapper.appendChild(div);
            var width = div.offsetLeft;
            Cache.wrapper.removeChild(div)
            return width;
        }
    }
});