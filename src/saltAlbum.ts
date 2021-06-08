// 仓库地址：https://github.com/mcbbs-wiki
/**放在自执行函数中以防污染全局变量 */
(function () {
    /**维护一个图片组 */
    class ImgList {
        list: { src: string; alt: string }[];
        index: number = 0;
        constructor(p: { src: string; alt: string }[]) {
            this.list = p;
        }
        /**获取当前/指定位置的图片 */
        get(index: number = this.index) {
            if (this.list.length === 0) return { src: '', alt: '' };
            index = this.fixIndex(index);
            // console.log(index);
            return this.list[index] ?? { src: '', alt: '' };
        }
        /**获取当前/指定位置后一位置的图片 */
        next(index: number = this.index) {
            return this.get(index + 1);
        }
        /**获取当前/指定位置前一位置的图片 */
        prev(index: number = this.index) {
            return this.get(index - 1);
        }
        /**修正索引数字 */
        fixIndex(index: number = this.index) {
            // console.log(index);
            if (this.list.length === 0) return 0;
            while (index > this.list.length - 1) index -= this.list.length;
            while (index < 0) index += this.list.length;
            return index;
        }
    }
    const newDiv = () => {
        return document.createElement('div');
    };
    const newImg = () => {
        return document.createElement('img');
    };
    const createAlbum = function (container: HTMLElement) {
        let index = 0;
        // 按钮
        /** 前一个 */
        const leftBtn = newDiv();
        /** 后一个 */
        const rightBtn = newDiv();
        // 三张图片
        /** 左图 */
        let imgL: HTMLElement;
        /** 中图 */
        let imgC: HTMLElement;
        /** 右图 */
        let imgR: HTMLElement;
        // 获取数据并生成图片组对象
        /** 图片组对象 */
        let imgList = new ImgList(getList());
        // 初始化按钮和三张图片
        init();
        /**将图片及其说明整合成`{ src: string; alt: string }[]` */
        function getList() {
            // 获取图片和显示文字
            const _list: { src: string; alt: string }[] = [],
                elems = container.querySelectorAll('img, span.text');
            let step = 0,
                _temp: { src: string; alt: string } = { src: '', alt: '' };
            for (let i = 0; i < elems.length; i++) {
                const el = elems[i];
                if (!(el instanceof HTMLElement)) continue;
                if (el instanceof HTMLImageElement) {
                    if (step === 0) {
                        _temp.src = el.src ?? '';
                        _temp.alt = el.alt ?? '';
                        step = 1;
                    } else {
                        // 没有找到文字说明直接到下一张图片
                        _list.push(_temp);
                        _temp = { src: el.src ?? '', alt: el.alt ?? '' };
                        step = 1;
                    }
                } else if (el instanceof HTMLSpanElement && step === 1) {
                    _temp.alt = el.textContent ?? '';
                    step = 0;
                    // 图片ID和文字都收集齐了
                    _list.push(_temp);
                    _temp = { src: '', alt: '' };
                }
            }
            if (step === 1) {
                _list.push(_temp);
            }
            return _list;
        }
        /** 初始化 */
        function init() {
            const frag = document.createDocumentFragment();
            // 初始化按钮
            leftBtn.textContent = '<';
            leftBtn.id = 'left-btn';
            leftBtn.onclick = () => {
                prevImg();
                index = imgList.fixIndex(index);
            };
            rightBtn.textContent = '>';
            rightBtn.onclick = () => {
                nextImg();
                index = imgList.fixIndex(index);
            };
            rightBtn.id = 'right-btn';
            // 清空容器，放入按钮
            container.innerHTML = '';
            frag.appendChild(leftBtn);
            frag.appendChild(rightBtn);
            container.style.display = 'block';
            // 初始化三张图片
            imgL = imgPack(imgList.prev());
            imgC = imgPack(imgList.get()); // 一开始都是0，所以懒得输入
            imgR = imgPack(imgList.next());
            classManager();
            frag.appendChild(imgL);
            frag.appendChild(imgC);
            frag.appendChild(imgR);
            // 统一拼到容器上
            container.appendChild(frag);
        }
        /** 生成一个图片-文字组 */
        function imgPack(p: { src: string; alt: string }) {
            // console.log(p);
            const img = newImg();
            img.src = p.src;
            img.alt = p.alt;
            const text = newDiv();
            text.textContent = p.alt;
            text.className = 'text';
            const c = newDiv();
            // c.className = 'img-pack';
            c.appendChild(img);
            c.appendChild(text);
            return c;
        }
        /** 统一的样式管理方法 */
        function classManager() {
            imgL.className = 'img-pack img-left';
            imgC.className = 'img-pack img-center';
            imgR.className = 'img-pack img-right';
        }
        /** 换图 */
        function nextImg() {
            index = imgList.fixIndex(++index);
            let temp = imgL;
            imgL = imgC;
            imgC = imgR;
            imgR = imgPack(imgList.next(index));
            classManager();
            container.appendChild(imgR);
            temp.style.opacity = '0';
            setTimeout(() => {
                temp.remove();
            }, 400);
        }
        function prevImg() {
            index = imgList.fixIndex(--index);
            let temp = imgR;
            imgR = imgC;
            imgC = imgL;
            imgL = imgPack(imgList.prev(index));
            classManager();
            container.appendChild(imgL);
            temp.style.opacity = '0';
            setTimeout(() => {
                temp.remove();
            }, 400);
        }
    };
    function main() {
        const elems = document.body.querySelectorAll('.salt-album:not(.done)');
        if (elems.length < 1) return;
        for (let i = 0; i < elems.length; i++) {
            const el = elems[i];
            el.classList.add('done');
            if (el instanceof HTMLElement) createAlbum(el);
        }
        // 添加css
        const style = document.createElement('style');
        style.textContent = `.salt-album{position:relative;width:100%;height:calc(var(--height, 680px) + 1.3rem);overflow:hidden;user-select:none}.salt-album>*{transition:all 0.4s ease}.salt-album #left-btn,.salt-album #right-btn{position:absolute;top:0;bottom:0;width:3rem;line-height:var(--height, 680px);font-size:3rem;text-align:center;cursor:pointer;z-index:12}.salt-album #left-btn{left:0;background:linear-gradient(90deg, var(--bgcolor, #fbf2dc), var(--bgcolor, #fbf2dc), transparent)}.salt-album #right-btn{right:0;background:linear-gradient(270deg, var(--bgcolor, #fbf2dc), var(--bgcolor, #fbf2dc), transparent)}.salt-album .img-pack{position:absolute;text-align:center;animation:fade-in 0.4s ease}.salt-album .img-pack img{display:inline-block;max-width:100%;max-height:100%}.salt-album .img-pack .text{position:absolute;bottom:-1.2rem;left:0;right:0;font-size:1rem;line-height:1rem;text-align:center}.salt-album .img-left,.salt-album .img-right{width:calc(33.3% - 2rem);height:calc(var(--height, 680px) / 3);top:calc(var(--height, 680px) / 3);line-height:calc(var(--height, 680px) / 3);opacity:0.5}.salt-album .img-left .text,.salt-album .img-right .text{opacity:0.5}.salt-album .img-left{left:calc(-18% + 1rem)}.salt-album .img-right{left:calc(82% - 1rem)}.salt-album .img-center{left:6rem;top:0;width:calc(100% - 12rem);height:var(--height, 680px);opacity:1;line-height:var(--height, 680px);z-index:10}@keyframes fade-in{from{transform:translateY(-20px);opacity:0}to{transform:translateY(0)}}
    `;
        style.setAttribute('saltAlbum', '');
        document.head.appendChild(style);
    }
    // 执行
    if (document.readyState === 'loading') {
        document.addEventListener('readystatechange', () => {
            if (document.readyState === 'interactive') main();
        });
    } else {
        main();
    }
})();
