import { InsertAttachmentMenuConf } from './menu/index'
import { withAttachment } from './plugin'
import { renderAttachmentConf } from './render-elem'

const attachmentModule = {
    menus: [InsertAttachmentMenuConf],
    editorPlugin: withAttachment,
    renderElems: [renderAttachmentConf]
}

export default attachmentModule