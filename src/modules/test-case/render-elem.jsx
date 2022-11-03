/**
 * @description  render data elem
 * @createTime 2022.09.20
 */
import {h} from 'snabbdom'
import {SlateEditor, SlateElement, SlateNode} from '@wangeditor/editor'
import {getUrlParams} from "../../utils/util";

function renderTestCaseHolder(
    elemNode,
    children,
    editor
) {
    let url_param = getUrlParams()
    let _className = url_param["isTc"] == 1 ? "class-testcase" : "class-testcase elem-none"

    return h(
        'span',
        {
            props: {},
            attrs: {},
            className: _className,
            style: {},
            on: {
                dblclick: function () {
                    const nodeEntries = SlateEditor.nodes(editor, {
                        match: (node) => {
                            if (SlateElement.isElement(node)) {
                                if (node.type === 'testcase') return true
                            }
                            return false
                        }
                    })

                    let choose_nodeEntry = null

                    for (let nodeEntry of nodeEntries) {
                        choose_nodeEntry = JSON.parse(JSON.stringify(nodeEntry))
                    }

                    if (window.openDialogModel) {
                        window.openDialogModel("TestCaseConfigModal", "编辑测试用例", "70%", choose_nodeEntry)
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
