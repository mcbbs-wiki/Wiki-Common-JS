// TODO: 完善主要部分 mwConfigMainValue
interface mwConfig {
    /**页面数据接口中数据，除非接口大概，否则推荐直接读取而不是使用`.get`方法
     *
     * 关于注释与官方文档的出入问题，请注意这不是使用`.get`方法获取的值而是直接访问获取的
     */
    values: mwConfigValue;
    /**检查配置中是否存在这项 */
    exists(selection: string): boolean;
    /**根据键获取数据值
     *
     * 如果不存在，则返回默认值（如果有的话）
     *
     * 没有默认值则返回`null` */
    get(selection: string): boolean | number | string | number[] | string[] | null;
    get<T>(selection: string, fallback: T): boolean | number | string | number[] | string[] | T;
    /**在这个数据接口中新建或修改数据
     *
     * 新建之后就可以用.values直接获取
     *
     * @returns 是否设置成功
     */
    set<T>(selection: string, value: T): boolean;
}
/**MediaWiki页面数据接口 */
type mwConfigValue = mwConfigValueSigned | mwConfigValueUnSigned;
// 合并登录和未登录的接口
interface mwConfigValueSigned
    extends mwConfigMainValue,
        mwConfigSiteValue,
        mwConfigOptionalValue,
        mwConfigUserValueSigned {}
interface mwConfigValueUnSigned
    extends mwConfigMainValue,
        mwConfigSiteValue,
        mwConfigOptionalValue,
        mwConfigUserValueUnSigned {}
/**接口信息的用户信息部分 */
type mwConfigUserValue = mwConfigUserValueSigned | mwConfigUserValueUnSigned;
// 关于注释与官方文档的出入问题，请注意这不是使用.get方法获取的值而是直接访问获取的
interface mwConfigUserValueSigned {
    /**当前用户的编辑数(未登录则为`undefined`) */
    wgUserEditCount: number;
    /**列出当前用户所属用户组的列表(未登录则为`['*']`)。用户组以内部名字标识，比如"sysop"和"autoconfirmed"。默认用户组名字是"*" */
    wgUserGroups: string[];
    /**当前用户的数字ID(未登录则为`undefined`) */
    wgUserId: number;
    /**用户的语言代码, 在特殊:参数设置中设置(可以被URL中的uselang=参数覆盖) */
    wgUserLanguage: string;
    /**当前用户的用户名(未登录则为null)(不是用户IP地址，与服务端PHP的 $wgUser->getName() 不同) */
    wgUserName: string;
    /**当前用户的注册时间，显示为 1970-01-01 00:00:00 UTC 以来的毫秒数。(未登录则为`undefined`) */
    wgUserRegistration: number;
}
interface mwConfigUserValueUnSigned {
    wgUserEditCount: undefined;
    wgUserGroups: ['*'];
    wgUserId: undefined;
    wgUserLanguage: string;
    wgUserName: null;
    wgUserRegistration: undefined;
}
/**主要部分
 *
 * TODO: 完善这部分
 */
interface mwConfigMainValue {
    /**页面中的操作，常见操作：
     *
     * view：查看页面，即正常浏览
     *
     * edit：编辑页面界面
     *
     * delete：删除页面界面
     *
     * protect：保护页面界面
     *
     * 详见 https://www.mediawiki.org/wiki/Manual:Parameters_to_index.php#Actions
     */
    wgAction:
        | 'view'
        | 'watch'
        | 'unwatch'
        | 'delete'
        | 'revert'
        | 'rollback'
        | 'protect'
        | 'unprotect'
        | 'markpatrolled'
        | 'render'
        | 'purge'
        | 'submit'
        | 'edit'
        | 'editredlink'
        | 'history'
        | 'historysubmit'
        | 'raw'
        | 'ajax'
        | 'credits'
        | 'info'
        | 'revisiondelete';
    /**页面的内部ID。不存在的页面和特殊页面的此项是`0` */
    wgArticleId: number;
    /**名字空间ID */
    wgNamespaceNumber: number;
    /**完整的页面名，包括翻译过的名字空间
     *
     * 如果名字空间有名字(主名字空间（0）没有)，空格将被替换为下划线
     *
     * 使用wgTitle获取没有名字空间的页面名 */
    wgPageName: string;
}
/**全站信息 */
interface mwConfigSiteValue {
    debug: boolean;
    /**显示当前皮肤的内部名称，经典皮肤（自带的皮肤）名称为："standard"，一般使用"vector" */
    skin: string;
    /**皮肤根目录的完整链接，包括样式表和配套的脚本。这个链接不包括皮肤的子目录，也不以“/”结尾 */
    stylepath: string;
    /**从根目录开始的本地路径, 用于引用文章。含有一个“$1”占位符，可以用页面标题替换来获取一个有效的页面URL
     *
     * 给定有效的页面标题title, 可以用`wgArticlePath.replace('$1', title)`获取有效URL
     *
     * 另见`$wgArticlePath`。 */
    wgArticlePath: string;
    /**MediaWiki中对大小写敏感的命名空间的ID
     *
     * 由`$wgCapitalLinks`和`$wgCapitalLinksOverrides`这两个配置变量的值决定 */
    wgCaseSensitiveNamespaces: number[];
    /**整个Wiki的默认语言代码 */
    wgContentLanguage: string;
    /**MediaWiki看作是“内容名字空间”的名字空间ID
     *
     * 和配置变量`$wgContentNamespaces`的值等价，没有加载好的话就是`[0]` */
    wgContentNamespaces: number[];
    /**Wiki的数据库名 */
    wgDBname: string;
    /**如果mw的API启用则为`true`，反之为`false` */
    wgEnableAPI: boolean;
    /**如果mw的写入API启用则为`true`，反之为`false`
     *
     * 如果`wgEnableAPI && !wgEnableWriteAPI`, 只有读取API会被启用 */
    wgEnableWriteAPI: boolean;
    /**Root path used for extension static assets (e.g. images)
     *
     * Append '/' then the name of the extension to get the root path for a given extension */
    wgExtensionAssetsPath: string;
    /**一个名字空间ID到翻译过的名字空间的查找表
     *
     * 每一个名字空间都有一个**字符串表示的数字**作为键映射到名字空间的名字
     *
     * 不包含别名或原名 */
    wgFormattedNamespaces: {
        [index: number]: string;
    };
    /**一个名字空间到名字空间ID的查找表
     *
     * 每一个名字空间（包括别名）都有一个名字空间的名字作为键映射到名字空间的ID
     *
     * 不包含原名
     *
     * 所有键的字母均小写，用下划线代替空格 */
    wgNamespaceIds: {
        [index: string]: number;
    };
    /**到达主要脚本接入点的完全路径，从根部开始
     *
     * 包括带着扩展名的脚本名
     *
     * 在维基农场上，一般是"/w/index.php"
     *
     * 另见`$wgScript` */
    wgScript: string;
    /**wgScript的路径部分，结尾不是"/"
     *
     * 这是用于直接调用php接入点（如index.php或api.php）的路径
     *
     * 另见`$wgScriptPath` */
    wgScriptPath: string;
    /**服务器链接，结尾不是"/"
     *
     * `wgServer + wgScriptPath + "/api.php"` 可以得到API脚本接入点的合法URL */
    wgServer: string;
    /**网站名，声明于`$wgSitename` */
    wgSiteName: string;
    /**如果Wiki自定义了语言变量(比如中文或塞尔维亚的Wikipedias)，这个值将设为语言变量的根路径(除`wgContentLanguage`以外)
     *
     * 这个路径包含了占位符"$1"需要用页面名替换，"$2"需要用语言代码替换(比如"zh-cn")
     *
     * 如果Wiki没有语言变量，这个值将为`false`
     *
     * 详见`$wgVariantArticlePath` */
    wgVariantArticlePath: string | false;
    /**MediaWiki软件版本 */
    wgVersion: string;
}
/**只在部分页面出现的值 */
interface mwConfigOptionalValue {
    /**如果当前页面是主页则为true
     *
     * 否则不存在这项 */
    wgIsMainPage?: true;
    /**如果Wiki有语言变量，则为用户的配置
     *
     * 如果没有语言变量，则没有这一项 */
    wgUserVariant?: string;
    /**如果用户刚刚保存了这个页面，则为"saved"
     *
     * 如果用户刚刚创建了这个页面，则为"created"
     *
     * 如果用户刚刚从历史记录中恢复了（编辑一个旧版本后保存）这个页面，则为"restored"
     *
     * 其他情况下没有这一项 */
    wgPostEdit?: 'saved' | 'created' | 'restored';
    /**"旧"版本的版本ID
     *
     * 仅在页面版本比对时有 */
    wgDiffOldId?: number;
    /**"新"版本的版本ID
     *
     * 仅在页面版本比对时有 */
    wgDiffNewId?: number;
}
