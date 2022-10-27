import { renderCheckBoxConf } from './render-elem'
import { withCheckBox } from "./plugin";

const checkBoxModule = {
    renderElems: [renderCheckBoxConf],
    editorPlugin: withCheckBox,
}

export default checkBoxModule