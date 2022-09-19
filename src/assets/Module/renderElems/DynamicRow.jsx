/**
 * @description  struct node => html code
 * @createTime 2022.08.15
 */
import {h} from 'snabbdom'

function renderDynamicRow(
    elemNode,
    children,
    editor
) {
    return h(
        'div',
        {
            props: {},
            className: 'class-pdr',
            style: {},
            on: {
                // mousedown: event => event.preventDefault(),
                // dblclick: event => {
                //     renderDrow(window.editor)
                // }
            },
        },
        children
    )
}

export const DynamicRowConf = {
    type: 'pdr',
    renderElem: renderDynamicRow,
}

