/**指定一个日期，可以有年份、日期限制，但必须有月份
 *
 * 日期符合条件时可将样式表、脚本应用到页面上
 *
 * 也可以将样式表、脚本应用到指定页面上 */
interface NationalDay {
    /**设为`true`需要登录方可启用 */
    needLogIn?: boolean;
    /**年份限制 */
    year?: number;
    /**月份限制 */
    month: number;
    /**日期限制 */
    day?: number;
    /**要应用的样式表 */
    css?: string;
    /**仅应用到部分页面的样式表 */
    pageCSS?: {
        id?: number | number[];
        name?: string | string[];
        css: string;
    };
    /**执行的脚本 */
    js?: () => void | string;
    /**仅应用到部分页面的脚本 */
    pageJS?: {
        id?: number | number[];
        name?: string | string[];
        js: () => void | string;
    };
    /**打印到控制台的日志 */
    log?: string | string[];
}
