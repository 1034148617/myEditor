/**
 * @description dynamic-table helper
 * @createTime 2022.09.22
 */
import { DomEditor, IDomEditor } from '@wangeditor/core'
import { SlateNode } from "@wangeditor/editor";
import { Editor, Transforms, Path } from "slate";
import { getNodeRow, NewID } from "../../utils/util";

/**
 * 获取第一行所有 cells
 * @param tableNode table node
 */
export function getFirstRowCells(tableNode) {
    const rows = tableNode.children || []   // 所有行
    if (rows.length === 0) return []
    const firstRow = rows[0] || {}          // 第一行
    return firstRow.children || []          // 第一行所有 cell

}

/**
 * 表格是否带有表头？
 * @param tableNode table node
 */
export function isTableWithHeader(tableNode) {
    const firstRowCells = getFirstRowCells(tableNode)
    return firstRowCells.every(cell => !!cell.isHeader)
}

/**
 * 单元格是否在第一行
 * @param editor editor
 * @param cellNode cell node
 */
export function isCellInFirstRow(editor, cellNode) {
    const rowNode = DomEditor.getParentNode(editor, cellNode)
    if (rowNode == null) return false
    const tableNode = DomEditor.getParentNode(editor, rowNode)
    if (tableNode == null) return false

    const firstRowCells = getFirstRowCells(tableNode)
    return firstRowCells.some(c => c === cellNode)
}

/**
 * 生成简单自定义动态表格
 * @param rowNum 行数
 * @param colNum 列数
 * @param isHeader 是否包括表头
 * @param tableName 表格标题
 */
export function genSimpleDynamicTable(rowNum, colNum, isHeader, tableName) {
    const rows = []
    for (let i = 0; i < rowNum; i++) {
        const cells = []
        for (let j = 0; j < colNum; j++) {
            const cellNode = {
                type: 'ptable-cell',
                children: [{ text: '' }]
            }
            if (i === 0 && isHeader) {
                cellNode.isHeader = true
            }
            cells.push(cellNode)
        }
        rows.push({
            type: 'ptable-row',
            children: cells
        })
    }

    return {
        type: 'ptable',
        rid: NewID(32),
        tableName: tableName || '',
        width: 'auto',
        children: rows
    }
}

export function insertSimpleDynamicTable(editor, rowNum, colNum, isHeader, tableName) {
    if (editor == null) return;

    // 判断选区是否折叠
    const row = getNodeRow(editor)

    const node = editor.children[row]

    if (SlateNode.string(node) === "" || row === 0) {
        if (row !== 0) editor.deleteBackward();
        const ptableNode = genSimpleDynamicTable(rowNum, colNum, isHeader, tableName);
        Transforms.insertNodes(editor, ptableNode);
    } else {
        const ptableNode = genSimpleDynamicTable(rowNum, colNum, isHeader, tableName);
        Transforms.removeNodes(editor, { at: [row] })
        Transforms.insertNodes(editor, ptableNode);
    }
}

/**
 * 从列配置生成表格节点
 * @param row
 * @param TableConfig
 * @param isHeader
 * @param isSerial
 */
export function genTableNodeFromConfig(row, TableConfig, isHeader, isSerial) {
    let rows = []
    for (let i = 0; i < row; i++) {
        let rowNode = { type: 'ptable-row', children: [] }
        if (isHeader && i === 0) {
            if (isSerial) {
                rowNode.children.push({
                    type: 'ptable-cell',
                    colIndex: '-1',
                    location: 'center',
                    valign: 'middle',
                    children: [{ text: '' }]
                })
            }
            for (let j = 0; j < TableConfig.length; j++) {
                const cellNode = {
                    type: 'ptable-cell',
                    rowSpan: 1,
                    colSpan: 1,
                    isHeader: true,
                    colIndex: TableConfig[j].colIndex || j,
                    width: TableConfig[j].width || 100,
                    height: TableConfig[j].height || 30,
                    location: TableConfig[j].location || 'center',
                    valign: TableConfig[j].valign || 'middle',
                    children: [{ text: TableConfig[j].colName }]
                }
                rowNode.children.push(cellNode)
            }
        } else {
            if (isSerial) {
                rowNode.children.push({
                    type: 'ptable-cell',
                    colIndex: '-1',
                    location: 'center',
                    valign: 'middle',
                    children: [{ text: '' + i }]
                })
            }
            for (let j = 0; j < TableConfig.length; j++) {
                const cellNode = {
                    type: 'ptable-cell',
                    rowSpan: 1,
                    colSpan: 1,
                    colIndex: TableConfig[j].colIndex || j,
                    width: TableConfig[j].width || 100,
                    height: TableConfig[j].height || 30,
                    location: TableConfig[j].location || 'center',
                    valign: TableConfig[j].valign || 'middle',
                    children: [{ text: '' }]
                }
                rowNode.children.push(cellNode)
            }
        }
        rows.push(rowNode)
    }
    return {
        type: 'ptable',
        rid: NewID(32),
        isHeader: isHeader,
        isSerial: isSerial,
        children: rows
    }
}

export function deleteTable(editor) {
    if (editor == null) return

    const row = getNodeRow(editor)

    if (row == null || editor.children[row]["type"] !== 'ptable') return

    Transforms.removeNodes(editor, { at: [row] })
}

/**
 * 表格节点插入一行（2022.09.27 简易版本）
 * @param editor
 */
export function insertRow(editor) {
    if (editor == null) return

    const row = getNodeRow(editor)

    if (row == null || editor.children[row]["type"] !== 'ptable') return

    const [cellEntry] = Editor.nodes(editor, {
        match: n => DomEditor.checkNodeType(n, 'ptable-cell'),
        universal: true,
    })
    const [cellNode, cellPath] = cellEntry

    const cellRow = cellPath[1]             // 获取所在行

    const rowNode = JSON.parse(JSON.stringify(editor.children[row].children[cellRow]))

    // 插入 row
    const rowPath = Path.parent(cellPath) // 获取 tr 的 path
    const newRowPath = Path.next(rowPath)
    Transforms.insertNodes(editor, rowNode, { at: newRowPath })
}

/**
 * 表格节点删除一行（2022.09.28 简易版本）
 * @param {*} editor 
 * @returns 
 */
export function deleteRow(editor) {
    if (editor == null) return

    const row = getNodeRow(editor)

    if (row == null || editor.children[row]["type"] !== 'ptable') return

    const [cellEntry] = Editor.nodes(editor, {
        match: n => DomEditor.checkNodeType(n, 'ptable-cell'),
        universal: true,
    })
    const [cellNode, cellPath] = cellEntry

    const rowPath = Path.parent(cellPath)           // 获取所在行

    // 删除 row
    Transforms.removeNodes(editor, { at: rowPath })
}

/**
 * 表格节点插入一列
 * @param {*} editor 
 * @returns 
 */
export function insertCol(editor) {
    if (editor == null) return

    const row = getNodeRow(editor)

    if (row == null || editor.children[row]["type"] !== 'ptable') return

    const [cellEntry] = Editor.nodes(editor, {
        match: n => DomEditor.checkNodeType(n, 'ptable-cell'),
        universal: true,
    })
    const [cellNode, cellPath] = cellEntry

    // 插入 cell
    const tableNode = editor.children[row]

    for (let i = 0; i < tableNode.children.length; i++) {
        const newCell = {
            type: 'ptable-cell',
            rowSpan: 1,
            colSpan: 1,
            width: 100,
            height: 30,
            location: 'center',
            valign: 'middle',
            children: [{ text: '' }]
        }

        if (tableNode.children[i].children[cellPath[2]].isHeader === true) {
            newCell.isHeader = true
        }

        const newPath = Path.next([cellPath[0], i, cellPath[2]])
        Transforms.insertNodes(editor, newCell, { at: newPath })
    }
}

/**
 * 表格节点删除一列
 * @param {*} editor 
 * @returns 
 */
export function deleteCol(editor) {
    if (editor == null) return

    const row = getNodeRow(editor)

    if (row == null || editor.children[row]["type"] !== 'ptable') return

    const [cellEntry] = Editor.nodes(editor, {
        match: n => DomEditor.checkNodeType(n, 'ptable-cell'),
        universal: true,
    })
    const [cellNode, cellPath] = cellEntry

    // 插入 cell
    const tableNode = editor.children[row]

    for (let i = 0; i < tableNode.children.length; i++) {
        const tableCellPath = [cellPath[0], i, cellPath[2]]
        Transforms.removeNodes(editor, { at: tableCellPath })
    }
}

/**
 * 合并单元格
 * @param {*} editor 
 * @returns 
 */
export function mergeCell(editor) { 
    if (editor == null) return

    const row = getNodeRow(editor)

    if (row == null || editor.children[row]["type"] !== 'ptable') return

    const [cellEntry] = Editor.nodes(editor, {
        match: n => DomEditor.checkNodeType(n, 'ptable-cell'),
        universal: true,
    })
    const [cellNode, cellPath] = cellEntry

    console.log(cellPath)

}

/**
 * 从数据源中生成表格
 * @param editor
 * @param config
 */
export function genDynamicTableFromData(editor, config){

}



