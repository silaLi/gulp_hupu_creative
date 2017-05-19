Container.set('Paging', function() {
	return function Paging(opt){
		this.init = function(opt){
			this.data = opt.data;
			this.pageNum = opt.pageNum;
			this.pageChange = opt.pageChange;
			
			this.curPage = 0;
			this.pages = Math.ceil(opt.data.length / opt.pageNum);

			this.setCurPage(1);
		}
		this.getPageData = function(curPage){
			curPage = curPage || this.curPage;

			var data = [];
			var startNum = (curPage - 1) * this.pageNum;
			for (var i = startNum, len = startNum + this.pageNum; i < len && this.data[i]; i++) {
				this.data[i].index = i;
				data.push(this.data[i]);
			}
			return data;
		}
		this.setCurPage = function(curPage){
			if (this.pageChange != curPage) {
				this.curPage = curPage;

				this.pageChange(this.getPageData(), this.curPage);
			}
			return this;
		}
		this.getPagerNav = function(){
			var pagerHTMLBefore = '';
			var pagerHTMLCenter = '';
			var pagerHTMLAfter = '';

			var curPage = this.curPage;
			var maxPage = this.pages;
			
			if (curPage !== 1) { // 是否在第一页 显示上一页
				pagerHTMLBefore += '<li data-index="'+(curPage-1)+'" class="pager-li first-pager"><a href="#"><</a></li>';
			}
			if (curPage !== maxPage) { // 当前是否在最后一页 显示下一页
				pagerHTMLAfter += '<li data-index="'+(curPage+1)+'" class="pager-li last-pager"><a href="#">></a></li>';
			}
			// 始终显示第一页
			pagerHTMLBefore += '<li data-index="1" class="pager-li page-1"><a href="#">1</a></li>';

			if (maxPage === 1) {
				pagerHTMLBefore = '';
				pagerHTMLCenter = '';
				pagerHTMLAfter = '';
			}
			if (maxPage >= 2) { // 页数超过2 显示最后一页
				pagerHTMLAfter = '<li data-index="'+maxPage+'" class="pager-li page-'+maxPage+'"><a href="#">'+maxPage+'</a></li>' + pagerHTMLAfter;
			}
			var pagerArr = new Array(maxPage);
			if (maxPage >= 3) {
				if (pagerArr.slice(0, curPage - 1).length - 1 > 0) {
					pagerHTMLBefore += '<li class="pager-li hide">···</li>'
				}
				if (pagerArr.slice(curPage - 1, maxPage - 1).length - 1 > 0) {
					pagerHTMLAfter = '<li class="pager-li hide">···</li>' + pagerHTMLAfter
				}
			}
				
			if (curPage !== 1 && curPage !== maxPage) {
				pagerHTMLCenter += '<li data-index="'+curPage+'" class="pager-li page-'+curPage+'"><a href="#">'+curPage+'</a></li>';
			}
			var HTML = pagerHTMLBefore + pagerHTMLCenter + pagerHTMLAfter;
			HTML = HTML.replace('page-'+curPage, 'ative')
			return HTML;
		}

		this.init(opt);
	}
})