'这里的任何JavaScript将为所有用户在每次页面载入时加载';
'使用typescript编译而成，因此代码看起来可能怪怪的';
'仓库地址：https://github.com/mcbbs-wiki/Wiki-Common-JS';
// 添加功能方法：
// 1、写个函数包起来，然后塞进main()，注意写在两个分割线之间的区域
// 2、再写一个自执行函数
/**放在自执行函数中以防污染全局变量 */
(function () {
    const prefix = '[MCBBSWiki]';
    /**页面数据接口 */
    const mwConfigValue = window.mw.config.values;
    /**用户对页面的操作 */
    const action = mwConfigValue.wgAction;
    /**页面名 */
    const pageName = mwConfigValue.wgPageName;
    /**页面内部ID */
    const pageID = mwConfigValue.wgArticleId;
    /**页面名字空间的数字ID */
    const nameSpace = mwConfigValue.wgNamespaceNumber;
    /**是不是主页 */
    const isMainPage = mwConfigValue.wgIsMainPage ?? false;
    /**用户名, 最好使用typeof来判断 */
    const userName = mwConfigValue.wgUserName;
    /**打印到控制台 */
    const log = (...a: any[]) => {
        console.log(...a);
    };
    /**添加脚本到页面上 */
    const addMyScript: string[] = [
        // 加载修改用户名显示的脚本，现在不用新建账号就能改名了（其实并没有改名，只是改了显示）
        'https://mcbbs-wiki.cn/index.php?title=MediaWiki:ReplaceUsername.js&action=raw&ctype=text/javascript',
        // 加载特殊日期脚本
        'https://mcbbs-wiki.cn/index.php?title=MediaWiki:NationalDays.js&action=raw&ctype=text/javascript',
    ];
    /**主要过程运行完毕后添加到页面上的脚本 */
    const addMyScriptLater: string[] = [];
    /**添加CSS到页面上 */
    const addMyCSS: string[] = [];
    // --------------------------------
    // ------------ 分割线 ------------
    // --------------------------------
    // 主过程
    function main() {
        // 添加脚本和样式表
        addCustomCSSes();
        addCustomScripts();
        // 百度推送
        if (action === 'view')
            // 只推送查看界面，不然百度到的总是杂着源代码、历史记录界面
            baiduPush();
        // 登录方能访问的名字空间
        loginForViewNameSpace([3100]);
        // 水印设置
        if (nameSpace === 3100) waterMark('页面废存');
    }
    /**百度推送 */
    function baiduPush() {
        let bp = document.createElement('script');
        let src =
            window.location.protocol.indexOf('https') !== -1
                ? 'https://zz.bdstatic.com/linksubmit/push.js'
                : 'http://push.zhanzhang.baidu.com/push.js';
        bp.src = src;
        bp.setAttribute('async', ''); // 最好异步加载
        document.body.appendChild(bp);
    }
    /**登录方能观看
     * @param nameSpaceID 数字数组，需要登录方可访问的名字空间ID
     */
    function loginForViewNameSpace(nameSpaceID: number[]) {
        if (!userName) {
            if (nameSpaceID.indexOf(nameSpace) !== -1) {
                // document.getElementById('bodyContent')
                window.location.replace('https://mcbbs-wiki.cn/wiki/特殊:用户登录');
            }
        } else {
            document.body.classList.add('mcbbswiki-user-online');
        }
    }
    /**
     * 添加水印到页面上
     * @param str 显示的字符
     */
    function waterMark(
        str: string,
        p?: {
            fsize: number;
            width: number;
            height: number;
            bold: boolean;
        }
    ) {
        const picW = p?.width ?? 480,
            picH = p?.height ?? 320,
            fsize = p?.fsize ?? 40,
            fbold = p?.bold ?? true;
        // 用CSS控制
        addCSS(
            `
/**/
#watermark {
    position: fixed;
    top: -21vw;
    left: -21vh;
    width: calc(100vw + 42vh);
    height: calc(100vh + 42vw);
    opacity: .25;
    transform-origin: 50% 50%;
    transform: rotate(-45deg);
    pointer-events: none;
    z-index: 999;
}
#watermark .watermark{
    position: absolute;
    top: 0; bottom: 0; left: 0; right: 0;
    background-image: url("${textToImg(str)}");
}
#watermark .watermark:first-child {
    top: -${picH / 2}px;
    left: -${picW / 2}px;
}
`,
            0
        );
        let container = document.createElement('div'),
            m1 = document.createElement('div'),
            m2 = document.createElement('div');
        container.id = 'watermark';
        m1.className = 'watermark';
        m2.className = 'watermark';
        container.appendChild(m1);
        container.appendChild(m2);
        document.body.appendChild(container);
        /**
         * 生成水印图片
         * @param str 输入的文字
         * @returns 字符串，图片的BASE64格式
         */
        function textToImg(str: string) {
            // 构造一个绘图区域
            let canvas = document.createElement('canvas');
            canvas.width = picW;
            canvas.height = picH;
            document.body.appendChild(canvas);
            // 绘图
            let context = canvas.getContext('2d')!;
            context.fillStyle = '#fff0';
            context.fillRect(0, 0, picW, picH);
            context.fillStyle = '#999';
            context.font = (fbold ? 'bold ' : '') + fsize + 'px sans-serif';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(str, picW / 2, picH / 2);
            // 获取图片
            let res = canvas.toDataURL('image/png');
            // 清除绘图区域
            document.body.removeChild(canvas);
            // 返回图片
            return res;
        }
    }
    // --------------------------------
    // ------------ 分割线 ------------
    // --------------------------------
    /**
     * assert: 断言
     * @param condition 为假时报错
     * @param msg 报错语句，默认为“发生错误”
     * */
    function assert(condition: any, msg?: string): asserts condition {
        if (!condition) throw new Error(prefix + ': ' + (msg ?? '发生错误'));
    }
    /**自动添加自定义脚本 */
    function addCustomScripts() {
        for (let s of addMyScript) {
            addJS(s, 1);
        }
        let fn = function () {
            for (let s of addMyScriptLater) {
                addJS(s, 1);
            }
        };
        document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn();
    }
    /**自动添加自定义CSS */
    function addCustomCSSes() {
        for (let s of addMyCSS) {
            addCSS(s, 1);
        }
    }
    /**
     * 将CSS代码附到页面上
     * @param css CSS代码
     * @param type 0-CSS代码 1-链接
     */
    function addCSS(css: string, type: 0): void;
    /**
     * 通过链接启用CSS
     * @param src CSS链接
     * @param type 0-CSS代码 1-链接
     */
    function addCSS(src: string, type: 1): void;
    function addCSS(str: string, type: 0 | 1): void {
        if (type === 0) {
            let sty = document.createElement('style');
            sty.textContent = str;
            document.head.appendChild(sty);
        } else {
            let link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = str;
            document.head.appendChild(link);
        }
    }
    /**
     * 将JS代码附到页面上
     * @param code JS代码
     * @param type 0-JS代码 1-链接
     */
    function addJS(code: string, type: 0): void;
    /**
     * 通过链接启用JS
     * @param src JS链接
     * @param type 0-JS代码 1-链接
     */
    function addJS(src: string, type: 1): void;
    function addJS(str: string, type: 0 | 1): void {
        let sc = document.createElement('script');
        if (type === 0) {
            sc.textContent = str;
        } else {
            sc.src = str;
        }
        document.body.appendChild(sc);
    }
    // 执行主要代码
    log(prefix + 'CommonJS加载中');
    // 开始计时
    console.time(prefix + 'CommonJS加载完毕');
    main();
    // 计时完毕
    console.timeEnd(prefix + 'CommonJS加载完毕');
})();
