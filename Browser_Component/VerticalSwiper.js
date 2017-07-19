Container.set('VerticalSwiper', function(_$$, AutoprefixerCssStyle) {
    return function VerticalSwiper(option){
        this.setScrollTop = function(time){
        	time = time || 0;
            this.domElem.cssArray(AutoprefixerCssStyle.array('transform', 'translateZ(0) translate(0, '+(-this.scrollTop)+'px)').concat(AutoprefixerCssStyle.array('transition', 'transform '+time+'s')));

            this.updateTrain(time);
        }
        this.Event = function (){
            var self = this;
            this.EventHandleElem.on('touchstart', function(e){
                self.touchmoveClientY = JSON.parse(getTouchPostion(e)).clientY;
                self.touchmoveTimeStamp = e.timeStamp;
                self.touchstartTime = e.timeStamp;
                self.touchstartPosition = getTouchPostion(e);

                self.setScrollTop();

                return _$$.pdsp(e);
            })
            this.EventHandleElem.on('touchend', function(e){
                self.touchmoveClientY = 0;
                self.touchstartPosition = {};
                self.touchstartTime = 0;
                
                var interval = e.timeStamp - self.touchmoveTimeStamp;
                interval = 400 / interval;
                var lastMove = Math.min(self.touchmoveLastMove * interval * .5, this.clientHeight * .5);
                self.scrollTop += lastMove;
                if (self.scrollTop < 0) {
                    self.scrollTop = 0
                }else if (self.scrollTop > self.scrollHeight - self.clientHeight) {
                    self.scrollTop = self.scrollHeight - self.clientHeight
                }
				// self.domElem.cssArray(AutoprefixerCssStyle.array('transform', 'translateZ(0) translate(0, '+(-self.scrollTop)+'px)').concat(AutoprefixerCssStyle.array('transition', 'transform .5s')));
				self.setScrollTop(.5)
                return _$$.pdsp(e);
            });
            this.EventHandleElem.on('touchmove', function(e){
                var timeStamp = e.timeStamp;
                self.touchmoveTimeStamp = timeStamp;

                var clientY = JSON.parse(getTouchPostion(e)).clientY;
                var move = self.touchmoveClientY - clientY;
                if (Math.abs(move) < 5) {
                    // console.log('not small')
                    return _$$.pdsp(e);
                }
                self.touchmoveClientY = clientY;
                self.touchmoveLastMove = move;
                if(self.scrollTop + move > 0 && self.scrollTop + move < self.scrollHeight - self.clientHeight){
                    self.scrollTop += move;
                }else{
                    self.scrollTop += move * .5;
                }
                self.setScrollTop();

                return _$$.pdsp(e);
            });

            function getTouchPostion(e){
                var touchstartPosition = {};
                try{
                    var touch = e.changedTouches[0] || e.targetTouches[0];
                }catch(e){
                    var touch = {};
                }
                touchstartPosition = {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                }
                return JSON.stringify(touchstartPosition);
            }
        }
        this.getElemHeight = function(elem){
            elem.style.cssText = 'visibility: hidden;display: block';
            
            try{
                var height = elem.clientHeight;
            }catch(e){
                var height = 0;
            }
            
            elem.style.cssText = '';
            return height;
        }
        this.updateTrain = function(time){
        	var trainMaxTop = this.trackYLenght - this.trainYLenght;
        	var contentMaxTop = this.scrollHeight - this.clientHeight;
        	this.trainY.cssArray([{top: this.scrollTop / contentMaxTop * trainMaxTop + 'px'}].concat(AutoprefixerCssStyle.array('transition', 'top '+time+'s')));
        }
        this.init = function(opt){
			opt = opt || option;

            this.clientHeight = 0;
            this.scrollTop = 0;

            this.clientHeight = this.getElemHeight(opt.swiper.getElemList(0));
            this.scrollHeight = this.getElemHeight(opt.wrapper.getElemList(0));
            
            this.EventHandleElem = opt.swiper;
            this.domElem = opt.wrapper;
            this.scrollTop = 0;
            this.touchstartTime = 0;
            this.touchstartPosition = {};
            this.touchmoveClientY = 0;
            this.touchmoveTimeStamp = 0;
            this.touchmoveLastMove = 0;
            
            this.domElem.getElemList(0).style.cssText = '';
			
			this.trackY = opt.trackY;
			this.trainY = opt.trainY;

			this.trackYLenght = this.getElemHeight(opt.trackY.getElemList(0));
			this.trainYLenght = option.trainYLenght || this.clientHeight / this.scrollHeight * this.trackYLenght;

			this.trainY.css({height: this.trainYLenght + 'px', top: 0});

            this.Event();
        }
        this.goTop = function(topValue){
            this.scrollTop = topValue;
            this.setScrollTop(.3);
        }
        this.init(option)
    }
})