/**
 * @description  render dynamic-row elem
 * @createTime 2022.09.20
 */
import {h} from 'snabbdom'

function renderDynamicRow(elemNode,children,editor) {
    return h(
        'div',
        {
            props: {},
            attrs: {},
            className: 'class-pdr',
            style: {},
            on: {},
        },
        children
    )
}

function renderDynamicRowContent(elemNode,children,editor) {
    return h(
        'div',
        {
            props: {},
            attrs: {},
            className: 'class-pdr-content',
            style: {},
            on: {},
        },
        children
    )
}

export const renderDynamicRowConf = {
    type: 'pdr',
    renderElem: renderDynamicRow,
}

export const renderDynamicRowContentConf = {
    type: 'dr-content',
    renderElem: renderDynamicRowContent,
}

