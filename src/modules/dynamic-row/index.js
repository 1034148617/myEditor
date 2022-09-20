import { InsertDynamicRowMenuConf, SwitchDynamicRowMenuConf, CancelDynamicRowMenuConf } from './menu/index'
import { withDynamicRowContent } from './plugin'
import { renderDynamicRowConf, renderDynamicRowContentConf } from './render-elem'

const dynamicRowModule = {
    menus: [InsertDynamicRowMenuConf, SwitchDynamicRowMenuConf, CancelDynamicRowMenuConf],
    editorPlugin: withDynamicRowContent,
    renderElems: [renderDynamicRowConf, renderDynamicRowContentConf]
}

export default dynamicRowModule