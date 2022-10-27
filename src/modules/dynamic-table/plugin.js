/**
 * @description 自定义数据结构Dynamic Table插件
 * @CreateTime 2022.09.22
 */
import {
    Editor,
    Transforms,
    Location,
    Point,
    Element as SlateElement,
    Descendant,
    NodeEntry,
    Node,
    BaseText,
    Path,
} from 'slate'
import { IDomEditor, DomEditor } from '@wangeditor/core'
import { getNodeRow } from "../../utils/util";

// table cell 内部的删除处理
function deleteHandler(newEditor){
    const { selection } = newEditor
    if (selection == null) return false

    const [cellNodeEntry] = Editor.nodes(newEditor, {
        match: n => DomEditor.checkNodeType(n, 'ptable-cell'),
    })
    if (cellNodeEntry) {
        const [, cellPath] = cellNodeEntry
        const start = Editor.start(newEditor, cellPath)

        if (Point.equals(selection.anchor, start)) {
            return true // 阻止删除 cell
        }
    }

    return false
}

/**
 * 判断该 location 有没有命中 table
 * @param editor editor
 * @param location location
 */
function isTableLocation(editor, location){
    const tables = Editor.nodes(editor, {
        at: location,
        match: n => {
            const type = DomEditor.getNodeType(n)
            return type === 'ptable'
        },
    })
    let hasTable = false
    for (const table of tables) {
        hasTable = true // 找到了 table
    }
    return hasTable
}

export function withDynamicTable(editor){
    const {
        insertBreak,
        deleteBackward,
        deleteForward,
        normalizeNode,
        insertData,
        handleTab,
        selectAll,
    } = editor
    const newEditor = editor

    // 重写 insertBreak
    newEditor.insertBreak = () => {
        const selectedNode = DomEditor.getSelectedNodeByType(newEditor, 'ptable')
        if (selectedNode != null) {
            // 选中了 table ，则在 cell 内换行
            newEditor.insertText('\n')
            return
        }

        // 未选中 table ，默认的换行
        insertBreak()
    }

    // 重写 delete
    newEditor.deleteBackward = unit => {
        const res = deleteHandler(newEditor)
        if (res) return

        const { selection } = newEditor
        if (selection) {
            const before = Editor.before(newEditor, selection) // 前一个 location
            if (before) {
                const isTableOnBeforeLocation = isTableLocation(newEditor, before)
                const isTableOnCurSelection = isTableLocation(newEditor, selection)
                if (isTableOnBeforeLocation && !isTableOnCurSelection) {
                    return
                }
            }
        }

        // 执行默认的删除
        deleteBackward(unit)
    }

    // 重写 handleTab 在table内按tab时跳到下一个单元格
    newEditor.handleTab = () => {
        const selectedNode = DomEditor.getSelectedNodeByType(newEditor, 'ptable')
        if (selectedNode) {
            const above = Editor.above(editor)

            // 常规情况下选中文字外层 table-cell 进行跳转
            if (DomEditor.checkNodeType(above[0], 'table-cell')) {
                Transforms.select(editor, above[1])
            }

            let next = Editor.next(editor)
            if (next) {
                if (next[0] && (next[0]).text) {
                    // 多个单元格同时选中按 tab 导致错位修复
                    next = (Editor.above(editor, { at: next[1] })) ?? next
                }
                Transforms.select(editor, next[1])
            } else {
                const topLevelNodes = newEditor.children || []
                const topLevelNodesLength = topLevelNodes.length
                // 在最后一个单元格按tab时table末尾如果没有p则插入p后光标切到p上
                if (DomEditor.checkNodeType(topLevelNodes[topLevelNodesLength - 1], 'table')) {
                    const p = {type:"paragraph",children:[{text:''}]}
                    Transforms.insertNodes(newEditor, p, { at: [topLevelNodesLength] })
                    newEditor.handleTab()
                }
            }
            return
        }

        handleTab()
    }

    newEditor.deleteForward = unit => {
        const res = deleteHandler(newEditor)
        if (res) return // 命中 table cell ，自己处理删除

        // 执行默认的删除
        deleteForward(unit)
    }

    // 重新 normalize
    newEditor.normalizeNode = ([node, path]) => {
        const type = DomEditor.getNodeType(node)
        if (type !== 'ptable') {
            return normalizeNode([node, path])
        }


        const isLast = getNodeRow(newEditor) === path[0] - 1
        if (isLast) {
            const p = {type:"paragraph",children:[{text:''}]}
            Transforms.insertNodes(newEditor, p, { at: [path[0] + 1] })
        }
    }

    // 重写 insertData - 粘贴文本
    newEditor.insertData = (data) => {
        const tableNode = DomEditor.getSelectedNodeByType(newEditor, 'ptable')
        if (tableNode == null) {
            insertData(data) // 执行默认的 insertData
            return
        }

        // 获取文本，并插入到 cell
        const text = data.getData('text/plain')

        // 单图或图文 插入
        if (text === '\n' || /<img[^>]+>/.test(data.getData('text/html'))) {
            insertData(data)
            return
        }

        Editor.insertText(newEditor, text)
    }

    // 重写 table-cell 中的全选
    newEditor.selectAll = () => {
        const selection = newEditor.selection
        if (selection == null) {
            selectAll()
            return
        }

        const cell = DomEditor.getSelectedNodeByType(newEditor, 'ptable-cell')
        if (cell == null) {
            selectAll()
            return
        }

        const { anchor, focus } = selection
        if (!Path.equals(anchor.path.slice(0, 3), focus.path.slice(0, 3))) {
            // 选中了多个 cell ，忽略
            selectAll()
            return
        }
        
        const text = Node.string(cell)
        const textLength = text.length
        if (textLength === 0) {
            selectAll()
            return
        }

        const path = DomEditor.findPath(newEditor, cell)
        const start = Editor.start(newEditor, path)
        const end = Editor.end(newEditor, path)
        const newSelection = {
            anchor: start,
            focus: end,
        }
        newEditor.select(newSelection) // 选中 table-cell 内部的全部文字
    }

    return newEditor
}