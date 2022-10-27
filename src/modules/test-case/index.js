import { withTestCase } from './plugin'
import { renderTestCaseHolderConf } from './render-elem'

const testcaseHolderModule = {
    editorPlugin: withTestCase,
    renderElems: [renderTestCaseHolderConf]
}

export default testcaseHolderModule