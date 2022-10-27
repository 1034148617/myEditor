/**
 * @description render dynamic-table-cell
 * @createTime 2022..09.22
 */
import { h } from 'snabbdom'

/**
 * 从节点中获取样式
 * @param cellNode
 * @returns {{}}
 */
function getStyles(cellNode){
    let styleList = {}

    if(cellNode.width){
        styleList.width = cellNode.width + 'px'
    }

    if(cellNode.height){
        styleList.height = cellNode.height + 'px'
    }

    if(cellNode.location){
        styleList["text-align"] = cellNode.location
    }

    if(cellNode.bgcolor){
        styleList["background-color"] = cellNode.bgcolor
    }

    return styleList
}

function getProps(cellNode){
    let props = {}

    props.colspan = cellNode.colSpan || 1
    props.rowspan = cellNode.rowSpan || 1
    props.valign = cellNode.valign || 'middle'

    return props
}

function renderDynamicTableCell(cellNode, children, editor){
    const isHeader = cellNode.isHeader || false
    const styles = getStyles(cellNode)
    const props = getProps(cellNode)

    const tag = isHeader ? 'th' : 'td'
    const vnode = h(
        tag,
        {
            style: styles
        },
        children
    )

    setTimeout(()=>{
        if(vnode.elm !== undefined){
            let cell = vnode.elm
            cell.setAttribute("colspan",props.colspan)
            cell.setAttribute("rowspan",props.rowspan)
            cell.setAttribute("valign",props.valign)
        }
    })

    return vnode
}

export default renderDynamicTableCell