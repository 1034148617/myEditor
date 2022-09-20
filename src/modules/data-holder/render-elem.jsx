/**
 * @description  render data elem
 * @createTime 2022.09.20
 */
import {h} from 'snabbdom'

function renderDataHolder(
    elemNode,
    children,
    editor
) {
    if(!elemNode.group) elemNode.group = ""
    if(!elemNode.field) elemNode.field = ""
    const _title = elemNode.group + " " + elemNode.field

    return h(
        'span',
        {
            props: {
                title: _title,
            },
            attrs: {},
            className: 'class-data',
            style: {},
            on: {},
        },
        children
    )
}

export const renderDataHolderConf = {
    type: 'data',
    renderElem: renderDataHolder,
}
