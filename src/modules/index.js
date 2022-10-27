import {Boot} from '@wangeditor/editor'
import dataHolderModule from "./data-holder"
import dynamicRowModule from "./dynamic-row"
import attachmentModule from "./attachment";
import documentModule from "./document";
import dynamicTableModule from "./dynamic-table";
import checkBoxModule from "./checkbox";
import testcaseHolderModule from "./test-case";

/**
 *  导入模块注册
 */
import markdownModule from '@wangeditor/plugin-md'
Boot.registerModule(markdownModule)

/**
 * 自定义模块注册
 */
Boot.registerModule(dataHolderModule)
Boot.registerModule(dynamicRowModule)
Boot.registerModule(attachmentModule)
Boot.registerModule(documentModule)
Boot.registerModule(dynamicTableModule)
Boot.registerModule(checkBoxModule)
Boot.registerModule(testcaseHolderModule)



