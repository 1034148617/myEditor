/**
 * @description  struct node => html code
 * @createTime 2022.08.17
 */
import {h} from 'snabbdom'


function renderDataHolder(
    elemNode,
    children,
    editor
) {
    return h(
        'span',
        {
            props: {},
            className: 'class-data',
            title: elemNode.group+" "+elemNode.field,
            style: {},
            on: {
                // mousedown: event => event.preventDefault(),
                // dblclick: event => {
                // }
            },
        },
        children
    )
}

export const DataHolderConf = {
    type: 'data',
    renderElem: renderDataHolder,
}
