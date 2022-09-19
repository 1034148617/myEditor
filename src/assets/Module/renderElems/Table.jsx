/**
 * @description  struct node => html code
 * @createTime 2022.08.15
 */
import {h} from 'snabbdom'

function renderTable(
    elemNode,
    children,
    editor
) {
    return h(
        'div',
        {
            props: {},
            className: 'class-ptable',
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

export const TableConf = {
    type: 'ptable',
    renderElem: renderTable,
}
