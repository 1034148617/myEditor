/**
 * @description  render data elem
 * @createTime 2022.09.20
 */
import {h} from 'snabbdom'

function renderTestCaseHolder(
    elemNode,
    children,
    editor
) {
    return h(
        'span',
        {
            props: {},
            attrs: {},
            className: 'class-testcase',
            style: {},
            on: {
                dblclick: function(){
                    if(window.openDialogModel){
                        window.openDialogModel("TestCaseConfigModal", "测试用例编辑")
                    }
                }
            },
        },
        children
    )
}

export const renderTestCaseHolderConf = {
    type: 'testcase',
    renderElem: renderTestCaseHolder,
}
