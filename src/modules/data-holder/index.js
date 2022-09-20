import { InsertDataHolderMenuConf } from './menu/index'
import { withData } from './plugin'
import { renderDataHolderConf } from './render-elem'

const dataHolderModule = {
    menus: [InsertDataHolderMenuConf],
    editorPlugin: withData,
    renderElems: [renderDataHolderConf]
}

export default dataHolderModule