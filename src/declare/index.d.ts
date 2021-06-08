/// <reference path="Common.d.ts" />
/// <reference path="MediaWiki.d.ts" />
/// <reference path="NationalDay.d.ts" />
interface Window {
    /**指示common.js是否加载 */
    commonJSLoad?: boolean;
    /**mw对象 */
    mw: mw;
}
