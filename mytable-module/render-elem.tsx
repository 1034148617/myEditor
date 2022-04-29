/**
 * @description  slate element => html code
 */
 import { IDomEditor, DomEditor } from '@wangeditor/core'
 import { Boot } from '@wangeditor/editor'
 import { Editor, Element as SlateElement, Range, Point, Path } from 'slate'
 import { h, jsx, VNode } from 'snabbdom'


/***************************************表格结构渲染***********************************************/
function renderMyTable(
    elemNode: SlateElement,
    children: VNode[] | null,
    editor: IDomEditor
): VNode {
    var vnode = h(
        'table',
        {
            className: 'class-mytable',
            style: {
                contenteditable: "true"
            },
        },
        children
    )
    return vnode
}
export const renderMyTableConf = {
    type: 'ptab',
    renderElem: renderMyTable,
}
Boot.registerRenderElem(renderMyTableConf)

function renderMyTableRow(
    elemNode: SlateElement,
    children: VNode[] | null,
    editor: IDomEditor
): VNode {
    var vnode = h(
        'tr',
        {
            className: 'class-mytable-tr',
        },
        children
    )
    return vnode
}
export const renderMyTableRowConf = {
    type: 'tab-row',
    renderElem: renderMyTableRow,
}
Boot.registerRenderElem(renderMyTableRowConf)

function renderMyTableCell(
    elemNode: SlateElement,
    children: VNode[] | null,
    editor: IDomEditor
): VNode {
    // @ts-ignore
    const isHeader = elemNode.isHeader
    const Tag = isHeader ? "th" : "td"
    const TagClass = isHeader ? "class-mytable-th" : "class-mytable-td"

    // 单元格样式设置
    let styList: { [key: string]: string } = {}
    // @ts-ignore
    if (elemNode.border) {
        styList.border = "1px solid"
    } else {
        styList.border = "none"
    }
    // @ts-ignore
    if (elemNode.width) {
        // @ts-ignore
        styList.width = elemNode.width + "px"
    }
    // @ts-ignore
    if (elemNode.height) {
        // @ts-ignore
        styList.height = elemNode.height + "px"
    }
    // @ts-ignore
    if (elemNode.location) {
        // @ts-ignore
        styList["text-align"] = elemNode.location
    }
    // @ts-ignore
    if (elemNode.bgcolor) {
        // @ts-ignore
        styList["background-color"] = elemNode.bgcolor
    }

    var vnode = h(
        Tag,
        {
            className: TagClass,
            style: styList,
            on: {
                dblclick: event => {
                    //@ts-ignore
                    window.openTableEditDialog()
                },
            },
        },
        children
    )

    setTimeout(() => {
        if (vnode.elm != undefined) {
            var cell = vnode.elm
            // @ts-ignore
            cell.setAttribute("rowspan", elemNode.rowSpan)
            // @ts-ignore
            cell.setAttribute("colspan", elemNode.colSpan)
            //@ts-ignore
            cell.setAttribute("valign", elemNode.valign)
        }
    })

    return vnode
}
export const renderMyTableCellConf = {
    type: 'tab-cell',
    renderElem: renderMyTableCell,
}
Boot.registerRenderElem(renderMyTableCellConf)



