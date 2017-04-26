;Container.set('PagerManger', function(_$, _$s, ___HtmlStr, ___CssStr, ES5Array, FastRender, Attr, Path, DomReadyComplete) {
    var mian_JS = _$('script[main-js]');
    Path.update(mian_JS.src)

    var PagerMangerCache = {
        cssText: ___CssStr,
        htmlText: ___HtmlStr,
        filterList: [],
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
            _$('head').appendChild(_createStyleElement(this.cssText))
        },
        insertHml: function(insertSelector){
            _$(insertSelector || 'body').innerHTML = this.htmlText;
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