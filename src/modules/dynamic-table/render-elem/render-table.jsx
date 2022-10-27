/**
 * @description render table
 * @createTime 2022..09.22
 */
import {h} from 'snabbdom'
import {Editor, Path, Point, Range} from 'slate'
import {DomEditor} from '@wangeditor/core'

function renderDynamicTable(elemNode, children, editor) {
    // 宽度
    const width = elemNode.width || 'auto'

    // 标题
    const tableName = elemNode.tableName || ""

    return h(
        "div",
        {
            props: {},
            style: {},
            className: "class-ptable-container",
            on: {
                mousedown: (e) => {
                    if (e.target.tagName === 'DIV') e.preventDefault()
                },
            }
        },
        [
            h(
                "table",
                {
                    props: {
                        width: width,
                        contentEditable: true
                    },
                    style: {
                        margin: "auto"
                    }
                },
                [
                    h(
                        "caption",
                        {
                            style: {
                                "font-size": "large",
                                "font-weight": "bolder"
                            },
                            on: {
                                mousedown: (e) => {
                                    e.preventDefault()
                                }
                            }
                        },
                        tableName
                    ),
                    h("tbody",null,children)
                ]
            )
        ]
    )
}

export default renderDynamicTable