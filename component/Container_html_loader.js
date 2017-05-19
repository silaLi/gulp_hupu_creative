;Container.set('PagerManger', function(_$$, ES5Array, Path, DomReadyComplete) {
    var mian_JS = _$$('script[main-js]').getElemList(0);
    Path.update(mian_JS.src);

    var PagerMangerCache = {
        cssText: '',
        htmlText: '',
        filterList: [],
        setHtml: function(html){
            this.htmlText = html;
        },
        pushHtml: function(html){
            this.htmlText += html;
        },
        setCss: function(css){
            this.cssText = css;
        },
        pushCss: function(css){
            this.cssText += css;
        },
        pushFitlter: function(filter, value){
            this.filterList.push(filter);
        },
        pushCssFilter: function(filter){
            this.pushFitlter(filter)
        },
        pushHtmlFilter: function(filter){
            this.pushFitlter(filter)
        },
        insertCss: function(){
            _$$('head').append(_createStyleElement(this.cssText))
        },
        insertHml: function(insertSelector){
            _$$(insertSelector || 'body').getElemList(0).innerHTML = this.htmlText;
        },
        executeFilter: function(){
            new ES5Array(this.filterList).forEach(function(filter){
                filter.call(this);
            }, this);
        },
        start: function(selector){
            this.executeFilter();

            this.insertCss();
            this.insertHml(selector);
        }
    };
    
    return PagerMangerCache

    function _createStyleElement(cssString) {
        var style = document.createElement("style");
        style.type = 'text/css';
        var cssString = cssString || '';

        if (style.styleSheet) { // IE  
            style.styleSheet.cssText = cssString;
        } else { // w3c  
            var cssText = document.createTextNode(cssString);
            style.appendChild(cssText);
        }

        return style;
    }
});