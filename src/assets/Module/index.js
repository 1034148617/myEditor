/**
 * @description 统一注册相关功能
 */

import {Boot} from '@wangeditor/editor'
/** 导入按钮 */
import {ClearConf} from './menus/btn_clear'
import {SaveConf, SaveDataConf} from './menus/btn_save'
import {OpenConf} from './menus/btn_open'
import {InsertDataConf} from './menus/btn_insertData'
import {InsertDrowConf} from './menus/Drow/btn_insertDrow'
import {CancelDrowConf} from './menus/Drow/btn_cancelDrow'
import {SwitchDrowConf} from './menus/Drow/btn_switchDrow'
import {InsertTableConf} from './menus/Table/btn_insertTable'
/** 导入插件 */
import {withData} from './plugins/withData'
import {withPdr} from './plugins/withPdr'
/** 导入自定义类型 */
import {DynamicRowConf} from './renderElems/DynamicRow'
import {DataHolderConf} from './renderElems/DataSpan'
/** 导入渲染Html模板 */
import {pdrToHtmlConf} from './elemsToHtml/pdrToHtml'

/** 导入第三方模块 */
// import markdownModule from "@wangeditor/plugin-md"
// Boot.registerModule(markdownModule)

const module = {
    // 菜单
    menus: [
        ClearConf,
        SaveConf, SaveDataConf,
        OpenConf,
        InsertDataConf,
        InsertDrowConf,CancelDrowConf,SwitchDrowConf,
        InsertTableConf,
    ],
    // 渲染元素
    renderElems: [
        DynamicRowConf,
        DataHolderConf,
    ],
    // 插入html
    elemsToHtml: [
        pdrToHtmlConf,
    ]
}

Boot.registerModule(module)

// 注册插件
Boot.registerPlugin(withData)
Boot.registerPlugin(withPdr)


