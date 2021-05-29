// 仓库地址：https://github.com/mcbbs-wiki
/**放在自执行函数中以防污染全局变量 */
(function () {
    /**需要特殊照顾的日子 */
    const NationalDay: NationalDay[] = [
        {
            month: 10,
            day: 1,
            // css: '',
            log: '1949年12月2日，中央人民政府通过《关于中华人民共和国国庆日的决议》，规定每年10月1日为国庆日，并以这一天作为宣告中华人民共和国成立的日子。从1950年起，每年的10月1日成为了中国各族人民隆重欢庆的节日。',
        },
        {
            month: 12,
            day: 13,
            pageCSS: {
                name: '首页',
                css: 'html{-webkit-filter:grayscale(100%);filter:grayscale(100%);}body{background-image:none;background-color:#ccc}',
            },
            log: '南京大屠杀死难者国家公祭日\n\n设立南京大屠杀死难者国家公祭日，在国家层面举行公祭活动和相关纪念活动，是为了悼念南京大屠杀死难者和所有在日本帝国主义侵华战争期间惨遭日本侵略者杀戮的死难同胞，揭露日本侵略者的战争罪行，牢记侵略战争给中国人民和世界人民造成的深重灾难，表明中国人民反对侵略战争、捍卫人类尊严、维护世界和平的坚定立场。\n\n中国人民抗日战争的胜利为世界反法西斯战争的胜利作出了不可磨灭的历史贡献，共同消除了威胁世界和平的法西斯邪恶势力，壮大了人类的进步力量，促进了全球的民族解放运动，对世界和平事业产生了深远影响。\n\n中国人民抗日战争艰苦卓绝，付出的巨大民族牺牲属于人类的浩劫，3000万人口伤亡、6000亿美元损失仅仅是冰冷的数字，造成30万人死难的南京大屠杀也仅仅是日本法西斯极端残忍暴虐的典型案例之一。\n\n以中国国家名义进行正式纪念与公祭，其世界意义在于，促使人类历史记忆长久保持唤醒状态，而避免出现哪怕是片刻的忘却与麻木，共同以史为鉴、开创未来，一起维护世界和平及正义良知，促进共同发展和时代进步。\n\n任何历史都是现代史，都对现实有着巨大的警鉴价值，而对历史铭记，就是树起了一面镜子，无论是对企图颠覆历史的人，还是渴望和平的人，都需要这个镜子随时折射提示，从这个角度上说，中国的“国家公祭”，小而言之是中国人对自己同胞的记忆、缅怀，是对国人应有历史价值观的培养；大而言之，是中国人在替世界保留的一份珍贵遗产，是中国人就此确立与国际社会相处的尊严方式。',
        },
    ];
    /**页面数据接口 */
    const mwConfigValue = window.mw.config.values;
    /**页面名 */
    const pageName = mwConfigValue.wgPageName;
    /**页面内部ID */
    const pageID = mwConfigValue.wgArticleId;
    /**用户名, 最好使用typeof来判断 */
    const userName = mwConfigValue.wgUserName;
    function main() {
        let now = new Date(),
            year = now.getFullYear(),
            month = now.getMonth() + 1,
            day = now.getDate();
        for (let nd of NationalDay) {
            // 若设置了不登录没效果
            if (nd.needLogIn && !userName) continue;
            // 时间对不对
            if (nd.year && nd.year !== year) continue;
            if (nd.day && nd.day !== day) continue;
            if (nd.month !== month) continue;
            // 执行内容
            if (nd.css) addCSS(nd.css);
            if (nd.js) safeEval(nd.js);
            if (nd.log) log(nd.log);
            // 分页面执行
            if (nd.pageCSS) {
                if (
                    (nd.pageCSS.id &&
                        ((typeof nd.pageCSS.id === 'number' && nd.pageCSS.id === pageID) ||
                            (nd.pageCSS.id instanceof Array && nd.pageCSS.id.indexOf(pageID) !== -1))) ||
                    (nd.pageCSS.name &&
                        ((typeof nd.pageCSS.name === 'string' && nd.pageCSS.name === pageName) ||
                            (nd.pageCSS.name instanceof Array && nd.pageCSS.name.indexOf(pageName) !== -1)))
                )
                    addCSS(nd.pageCSS.css);
            }
            if (nd.pageJS) {
                if (
                    (nd.pageJS.id &&
                        ((typeof nd.pageJS.id === 'number' && nd.pageJS.id === pageID) ||
                            (nd.pageJS.id instanceof Array && nd.pageJS.id.indexOf(pageID) !== -1))) ||
                    (nd.pageJS.name &&
                        ((typeof nd.pageJS.name === 'string' && nd.pageJS.name === pageName) ||
                            (nd.pageJS.name instanceof Array && nd.pageJS.name.indexOf(pageName) !== -1)))
                )
                    safeEval(nd.pageJS.js);
            }
        }
    }
    function addCSS(css: string): void {
        let sty = document.createElement('style');
        sty.textContent = css;
        document.head.appendChild(sty);
    }
    function safeEval(js: string | (() => void)) {
        if (typeof js === 'string') {
            // 干净安全有效.jpg
            (0, eval)(js);
        } else if (typeof js === 'function') {
            js.call(null);
        }
    }
    function log(s: string | string[]) {
        let str = '%c';
        if (s instanceof Array) str += s.join('\n');
        else str += s;
        console.log(str, 'font-size:1rem;');
    }
    main();
})();
