/*
 * @Descripttion: 分页器
 * @Author: Jevin
 * @Date: 2021-01-11
 * @LastEditors  : Jevin
*/
class Pagination {
    #curPage; // 当前页码 number
    #total; // 总数据量 number
    #pageSize; // 每页条数 number
    #pageLen; // 页码数 number
    #minPage = 6; // 最小页码 超过即出现··· number
    #prevPage; // 上一页 function
    #nextPage; // 下一页 function
    #selectPage; // 选中页码 function
    constructor({ el, total, pageSize, curPage, prevPage, nextPage, selectPage }) {
        if (typeof el !== 'string')  throw 'el传入的值应为id';
        // 初始化
        this.#total = total || 0;
        this.#pageSize = pageSize || 10;
        this.#curPage = curPage || 1;
        this.#pageLen = Math.ceil(total / pageSize);
        this.#prevPage = prevPage || null;
        this.#nextPage = nextPage || null;
        this.#selectPage = selectPage || null;

        var container = document.getElementById(el);
        var containerStyle = 'font-size: 14px; text-align: center; -webkit-user-select: none';
        // 设置容器样式
        this.#_setDomAttr(container, {style: containerStyle});

        for (var i = 0; i < 3; i++) {
            var DIV = this.#_createDom('div');
            if (i === 0) {
                this.#_setDomAttr(DIV, {class: 'page-prev'}, {id: 'prev_page'});
                DIV.innerText = '<';
            } else if (i === 1) {
                this.#_setDomAttr(DIV, {id: 'pageNum'});
            } else {
                this.#_setDomAttr(DIV, {class: 'page-next'}, {id: 'next_page'});
                DIV.innerText = '>';
            }
            container.append(DIV)
        }
        this.mainRender();
        this.#_setEvents();
    }

    /**
     * 创建dom
     * @param { div, span, a... } type html标签
     */
    #_createDom = function(type) {
        return document.createElement(type);
    }
    /**
     * 设置dom属性
     * @param dom 需要设置属性的dom
     * @param  {...any} options 属性值(object):{class: 'test'}
     */
    #_setDomAttr = function(dom, ...options) {
        options.forEach(function(item) {
            for (var key in item) {
                dom.setAttribute(key, item[key]);
            }
        })
    }
    /**
     * 删除子节点
     * @param dom 需要删除子节点的dom
     */
    #_clearChildNode = function(dom) {
        var childList = dom.childNodes,
            length = childList.length
        if (length === 0) return
        for (var i = length - 1; i >= 0; i--) {
            dom.removeChild(childList[i])
        }
    }
    /**
     * 渲染页码
     * @param { dom } parentDom 添加页码的dom
     */
    #_renderNum = function(parentDom, text = null) {
        var SPAN = this.#_createDom('span');
        this.#_setDomAttr(SPAN, {class: 'page-num'});
        text && (SPAN.innerText = text);
        parentDom.append(SPAN);
    }
    /**
     * 主渲染函数
     */
    mainRender = function() {
        var pageNumContainer = document.getElementById('pageNum');
        this.#_clearChildNode(pageNumContainer);
        var minPage = this.#minPage,
            pageLen =this.#pageLen,
            curPage = this.#curPage;
        var ins = this;
        if (pageLen < minPage) { // minPage 页以下 全部展示
            for (var i = 0; i < pageLen; i++) {
                this.#_renderNum(pageNumContainer, i + 1);
            }
        } else { // minPage页及minPage页以上 展示 ···
            if (curPage < 5) {
                for (var i = 0; i < 5; i++) {
                    this.#_renderNum(pageNumContainer, i + 1);
                }
                this.#_renderNum(pageNumContainer, '···');
                this.#_renderNum(pageNumContainer, pageLen);
            } else if (curPage >= 5 && (curPage + 3) < pageLen) {
                var textArr = [1, '···', (curPage - 1), curPage, (curPage + 1), '···', pageLen];
                textArr.forEach(function(item) {
                    ins.#_renderNum(pageNumContainer, item);
                })
            } else {
                this.#_renderNum(pageNumContainer, 1);
                this.#_renderNum(pageNumContainer, '···');
                if (curPage <= pageLen - 5){
                    for (var i = 0; i < pageLen; i++) {
                        if (i >= curPage - 1 && i < pageLen - 5) {
                            this.#_renderNum(pageNumContainer, i + 1);
                        }
                    }
                } else {
                    var textArr = [(pageLen - 4), (pageLen - 3), (pageLen - 2), (pageLen - 1), pageLen];
                    textArr.forEach(function(item) {
                        ins.#_renderNum(pageNumContainer, item);
                    })
                }
            }
        }
        var numList = pageNumContainer.childNodes,
            length = numList.length;
        for (var i = 0; i < length; i++) {
            var innerText = numList[i].innerText;
            if (curPage.toString() === innerText) {
                numList[i].classList.add('cur-page');
            }
        }

        var nums = pageNumContainer.getElementsByClassName('page-num'),
            numLen = nums.length;

        for (var i = 0; i < numLen; i++) {
            nums[i].addEventListener('click', function() {
                if (curPage.toString() === this.innerText || this.innerText === '···') return;
                ins.#_selectNum(nums, numLen, Number(this.innerText));
            })
        }
    }
    /**
     * 切换页码
     * @param { dom } nums 所有页码dom
     * @param { number } length 页码的个数
     * @param { number } page 选中的页码
     */
    #_selectNum = function(nums, length, page) {
        for (var i = 0; i < length; i++) {
            var innerText = nums[i].innerText;
            if (Number(innerText) === page) {
                this.#curPage = page;
            }
        }
        this.mainRender();
        this.#selectPage && this.#selectPage(this.#curPage);
    }
    /**
     * 上一页/下一页绑定事件
     */
    #_setEvents = function() {
        var prevPage = document.getElementById('prev_page'),
            nxetPage = document.getElementById('next_page');
        var ins = this;
        prevPage.addEventListener('click', function() {
            if (ins.#curPage === 1) return
            ins.#curPage--;
            ins.mainRender();
            ins.#prevPage && ins.#prevPage(ins.#curPage)
        })
        nxetPage.addEventListener('click', function() {
            if (ins.#curPage === ins.#pageLen) return
            ins.#curPage++;
            ins.mainRender();
            ins.#nextPage && ins.#nextPage(ins.#curPage)
        })
    }
}
