/// <reference path="mwConfig.d.ts" />
interface mw {
    /**页面数据接口 */
    config: mwConfig;
    /**在MediaWiki1.29后`mw.ui`完全废弃了，改为使用`OOui` */
    ui: undefined;
    /**console.log的替代品，仅在debug模式下启用，**除非真的要用否则禁止使用** */
    log(p: any): void;
}
