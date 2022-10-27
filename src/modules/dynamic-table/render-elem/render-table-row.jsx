/**
 * @description render table
 * @createTime 2022..09.22
 */
import { h } from 'snabbdom'

function renderDynamicTableRow(
    elemNode,
    children,
    editor
){
    return h(
        "tr", null, children
    )
}

export default renderDynamicTableRow