import { SlateRange, SlateEditor, SlateTransforms, SlateElement, SlatePath } from '@wangeditor/editor'
import { DomEditor, IDomEditor, SlateNode } from '@wangeditor/editor'
import { useBreakpoints } from 'element-plus/node_modules/@vueuse/core';
import { Editor, Node, Transforms, Element } from 'slate'
import { AUtils } from './AUtils';

/**
 * @description 表格操作
 */
export class Form {
    /**
     * @description 根据分组和自定义配置生成表格
     * @param editor 
     * @param GroupID 数据源分组
     * @param Conf  配置数组
     * @param isHeader 是否显示标题
     * @param isBorder 是否显示边框
     * @param isRender 是否加载数据
     */
    static InsertTableConfig(editor: IDomEditor, GroupID: string, Conf: Array<any>, isHeader: boolean, isBorder: boolean, isRender: boolean, isSerial: boolean): void {
        console.log(Conf)
        if (!isRender) {
            // 插入模板
            var tabChildren = []

            if (isHeader) {
                var rowHeaderChildren = []
                for (var i = 0; i < Conf.length; i++) {
                    if (Conf[i].isShow) {
                        var headNode = { type: 'tab-cell', isHeader: true, rowSpan: 1, colSpan: 1, border: isBorder, field: Conf[i].FieldID, width: Conf[i].width, height: 30, children: [{ text: Conf[i].FieldName }] }
                        rowHeaderChildren.push(headNode)
                    }
                }
                if (isSerial) {
                    rowHeaderChildren.unshift({ type: 'tab-cell', isSerial: true, isHeader: true, rowSpan: 1, colSpan: 1, border: isBorder, width: 50, height: 30, children: [{ text: '序号' }] })
                }
                var rowNode = { type: 'tab-row', children: rowHeaderChildren }
                tabChildren.push(rowNode)
            }
            var rowChildren = []
            for (var j = 0; j < Conf.length; j++) {
                if (Conf[j].isShow) {
                    var cellNode = {
                        type: 'tab-cell',
                        isHeader: false,
                        rowSpan: 1,
                        colSpan: 1,
                        border: isBorder,
                        field: Conf[j].FieldID,
                        width: Conf[j].width,
                        height: Conf[j].height,
                        valign: Conf[j].valign,
                        // readOnly: Conf[j].isReadOnly,
                        location: Conf[j].location,
                        children: [{ text: '' }]
                    }
                    rowChildren.push(cellNode)
                }
            }
            if (isSerial) {
                rowChildren.unshift({ type: 'tab-cell', valign: "middle", isSerial: true, isHeader: false, rowSpan: 1, colSpan: 1, border: isBorder, width: 50, height: 30, location: Conf[0].location, children: [{ text: '1' }] })
            }
            var rowChildrenList = { type: 'tab-row', children: rowChildren }
            tabChildren.push(rowChildrenList)

            var nodeList = [{ type: 'ptab', name: AUtils.NewID(10), group: GroupID, children: tabChildren }, { type: 'paragraph', children: [{ text: ' ' }] }]

            editor.restoreSelection()
            // @ts-ignore
            SlateTransforms.insertNodes(editor, nodeList)

        } else {



        }

    }

    /**
     * @description 根据自定义样式插入表格
     * @param editor 
     * @param row 
     * @param col 
     * @param Conf 
     * @param isHeader 
     * @param isBorder 
     */
    static InsertCustomTable(editor: IDomEditor, row: number, col: number, Conf: Array<any>, isHeader: boolean, isBorder: boolean, isSerial: boolean): void {
        var tabChildren = []
        if (isHeader) {
            row = row + 1
        }

        for (var i = 0; i < row; i++) {
            var rowChildren = []
            for (var j = 0; j < col; j++) {
                var cellNode = null
                if (isHeader && i == 0) {
                    cellNode = { type: 'tab-cell', isHeader: true, rowSpan: 1, colSpan: 1, border: isBorder, width: Conf[j].width, height: 30, children: [{ text: Conf[j].colName }] }
                } else {
                    cellNode = {
                        type: 'tab-cell',
                        isHeader: false,
                        rowSpan: 1,
                        colSpan: 1,
                        border: isBorder,
                        width: Conf[j].width,
                        height: Conf[j].height,
                        location: Conf[j].location,
                        valign: Conf[j].valign,
                        children: [{ text: '' }]
                    }
                }
                rowChildren.push(cellNode)
            }
            //  加入序号列的处理逻辑
            if (isSerial) {
                var serialNode = {
                    type: 'tab-cell',
                    isSerial: true,
                    isHeader: false,
                    rowSpan: 1,
                    colSpan: 1,
                    border: isBorder,
                    width: Conf[0].width,
                    height: Conf[0].height,
                    location: Conf[0].location,
                    valign: "middle",
                    children: [{ text: '' }]
                }
                if (isHeader && i == 0) {
                    serialNode.isHeader = true
                    serialNode.children[0].text = '序号'
                } else if (isHeader && i > 0) {
                    var index = i
                    serialNode.children[0].text = '' + index
                } else {
                    var index = i + 1
                    serialNode.children[0].text = '' + index
                }
                rowChildren.unshift(serialNode)
            }
            var rowNode = { type: 'tab-row', children: rowChildren }
            tabChildren.push(rowNode)
        }
        var nodeList = [{ type: 'ptab', name: AUtils.NewID(10), children: tabChildren }, { type: 'paragraph', children: [{ text: ' ' }] }]
        editor.restoreSelection()
        // @ts-ignore
        SlateTransforms.insertNodes(editor, nodeList)
    }

    /**
     * @description 调整单元格样式 v2.0 2022.04.27
     */
    static EditTableCell(editor: IDomEditor, row: number, col: number, Conf: { [key: string]: any }): void {
        editor.restoreSelection()
        this.UpdateTableNode(editor, row, col, Conf)

        editor.restoreSelection()
        Transforms.setNodes(editor, Conf, {
            match: (node: SlateNode, path: SlatePath) => {
                if (SlateElement.isElement(node)) {
                    // @ts-ignore
                    if (node.type === 'tab-cell') {
                        return true
                    }
                }
                return false
            }
        })
    }

    /**
     * @description 表格节点更新(同步行高、列宽) 被EditTableCell方法调用 
     * 2022.4.28 自测：合并单元格后出现逻辑问题 待修改节点数据结构
     */
    static UpdateTableNode(editor: IDomEditor, row: number, col: number, Conf: { [key: string]: any }): void {
        const nodeEntries = SlateEditor.nodes(editor, {
            match: (node: SlateNode) => {
                if (SlateElement.isElement(node)) {
                    if (node.type === 'ptab') {
                        return true
                    }
                }
                return false
            },
            universal: true,
        })
        var node = null
        for (let nodeEntry of nodeEntries) {
            node = JSON.parse(JSON.stringify(nodeEntry[0]))
        }
        //@ts-ignore
        const cell = node.children[row].children[col]
        const tname = node.name

        if (cell.width != Conf["width"]) {
            //@ts-ignore
            for (var i = 0; i < node.children.length; i++) {
                if (col > node.children[i].children.length) continue
                if (node.children[i].children[col] == undefined) continue
                //@ts-ignore
                node.children[i].children[col].width = Conf["width"]
            }
        }

        if (cell.height != Conf["height"]) {
            //@ts-ignore
            for (var i = 0; i < node.children[row].children.length; i++) {
                //@ts-ignore
                node.children[row].children[i].height = Conf["height"]
            }
        }

        // 移除旧表格
        SlateTransforms.removeNodes(editor, {
            match: (node: SlateNode, path: SlatePath) => {
                if (SlateElement.isElement(node)) {
                    // @ts-ignore
                    if (node.type === 'ptab') {
                        return true
                    }
                }
                return false
            }
        })

        // 在原位置插入新表格
        SlateTransforms.insertNodes(editor, [node])
    }

    /**
     * @description 合并单元格 v1.0
     * @param editor 编辑器
     * @param beginLocation 起始位置 [x1,y1]
     * @param endLocation 结束位置 [x2,y2]且x2>=x1,y2>=y1
     */
    static MergedCell(editor: IDomEditor, beginLocation: Array<any>, endLocation: Array<any>): void {

        if (editor.selection == null) return
        const selectPath = editor.selection.focus.path[0]
        var node = JSON.parse(JSON.stringify(AUtils.getNodeList(editor).nodes[selectPath]))
        var newTdNode = JSON.parse(JSON.stringify(node.children[beginLocation[0]].children[beginLocation[1]]))

        if (node.type !== "ptab") return
        if (endLocation[0] < beginLocation[0] && endLocation[1] < beginLocation[1]) return

        // 合并前先取消合并
        // this.CancelMerged(editor,beginLocation[0],beginLocation[1])

        var rname = node.name
        var mergeText = ''

        for (var i = 0; i < node.children.length; i++) {
            for (var j = 0; j < node.children[0].children.length; j++) {
                if (i >= beginLocation[0] && i <= endLocation[0] && j >= beginLocation[1] && j <= endLocation[1]) {
                    if (node.children[i].children[j].isHeader) {
                        continue            // th标签不允许合并
                    } else {
                        mergeText += node.children[i].children[j].children[0].text  // 合并文本内容
                    }
                }
            }
            if (i >= beginLocation[0] && i <= endLocation[0]) {
                node.children[i].children.splice(beginLocation[1], (endLocation[1] - beginLocation[1] + 1))
            }
        }
        newTdNode.rowSpan = endLocation[0] - beginLocation[0] + 1
        newTdNode.colSpan = endLocation[1] - beginLocation[1] + 1
        newTdNode.children = [{ text: mergeText }]

        node.children[beginLocation[0]].children.splice(beginLocation[1], 0, newTdNode)

        // 移除旧表格
        SlateTransforms.removeNodes(editor, {
            match: (node: SlateNode, path: SlatePath) => {
                if (SlateElement.isElement(node)) {
                    // @ts-ignore
                    if (node.type === 'ptab' && node.name === rname) {
                        return true
                    }
                }
                return false
            }
        })

        // 在原位置插入新表格
        SlateTransforms.insertNodes(editor, [node])
        // // 恢复光标
        // editor.restoreSelection()
    }

    /**
     * @description 取消单元格合并 v1.0
     */
    static CancelMerged(editor: IDomEditor, row: number, col: number): void {

        if (editor.selection == null) return
        const selectPath = editor.selection.focus.path[0]
        var node = JSON.parse(JSON.stringify(AUtils.getNodeList(editor).nodes[selectPath])) // 获取表格节点
        var rname = node.name
        var cell = JSON.parse(JSON.stringify(node.children[row].children[col]))    // 获取选择的单元格
        if (cell.rowSpan == 1 && cell.colSpan == 1) return            // 选择单元格非合并

        // 还原合并前的节点
        for (var j = 0; j < cell.rowSpan; j++) {
            var cellList = []
            for (var i = 0; i < cell.colSpan; i++) {
                var newCell = JSON.parse(JSON.stringify(cell))
                newCell.rowSpan = 1
                newCell.colSpan = 1
                newCell.children = [{ text: '' }]
                cellList.push(newCell)
            }
            if (j == 0) {
                node.children[j + row].children.splice(col, 1, ...cellList)
            }
            else {
                node.children[j + row].children.splice(col, 0, ...cellList)
            }
        }

        // 将单元格内容存入选中单元格中
        node.children[row].children[col].children = [{ text: cell.children[0].text }]

        // 移除旧表格
        SlateTransforms.removeNodes(editor, {
            match: (node: SlateNode, path: SlatePath) => {
                if (SlateElement.isElement(node)) {
                    // @ts-ignore
                    if (node.type === 'ptab' && node.name === rname) {
                        return true
                    }
                }
                return false
            }
        })

        // 在原位置插入新表格
        SlateTransforms.insertNodes(editor, [node])
        // // 恢复光标
        // editor.restoreSelection()
    }

    /*******************************************行操作*********************************************/

    /**
     * @description 在选中单元格下方插入行
     */
    static insertNewRow(editor: IDomEditor, row: number): void {
        if (editor.selection == null) return
        const selectPath = editor.selection.focus.path[0]
        var node = JSON.parse(JSON.stringify(AUtils.getNodeList(editor).nodes[selectPath])) // 获取表格节点
        var rname = node.name
        var rowList = JSON.parse(JSON.stringify(node.children[row]))    // 获取选择的单元格

        var rlen = rowList.children.length
        for (var i = 0; i < rlen; i++) {
            rowList.children[i].children = [{ text: '' }]
        }


        for (var i = 0; i < row; i++) {
            // 如果在之前行存在合并格 更新rowSpan
            if (node.children[i].children.length > rlen) {
                for (var m = 0; m < row; m++) {
                    for (var n = 0; n < node.children[m].children.length; n++) {
                        var scell = node.children[m].children[n]
                        if (m + scell.rowSpan > row) {
                            node.children[m].children[n].rowSpan += 1
                        }
                    }
                }
                break
            }
        }

        for (var m = 0; m < rlen; m++) {
            if (rowList.children[m].rowSpan > 1) {
                node.children[row].children[m].rowSpan += 1
                rowList.children.splice(m, 1)
                break
            }
        }

        // 插入新行节点
        if (row == node.children.length - 1) {
            node.children.push(rowList)
        } else {
            node.children.splice(row + 1, 0, rowList)
        }


        // 移除旧表格
        SlateTransforms.removeNodes(editor, {
            match: (node: SlateNode, path: SlatePath) => {
                if (SlateElement.isElement(node)) {
                    // @ts-ignore
                    if (node.type === 'ptab' && node.name === rname) {
                        return true
                    }
                }
                return false
            }
        })

        // 在原位置插入新表格
        SlateTransforms.insertNodes(editor, [node])
        // 恢复光标
        editor.restoreSelection()
    }

    /**
     * @description 删除选中行
     */
    static deleteRow(editor: IDomEditor, row: number): void {
        if (editor.selection == null) return
        const selectPath = editor.selection.focus.path[0]
        var node = JSON.parse(JSON.stringify(AUtils.getNodeList(editor).nodes[selectPath])) // 获取表格节点
        var rname = node.name
        var rowList = JSON.parse(JSON.stringify(node.children[row]))    // 获取选择的单元格




        for (var i = 0; i < row; i++) {
            // 如果在之前行存在动态行 更新rowSpan
            if (node.children[i].children.length > rowList.children.length) {
                for (var m = 0; m < row; m++) {
                    for (var n = 0; n < node.children[m].children.length; n++) {
                        var scell = node.children[m].children[n]
                        if (m + scell.rowSpan > row) {
                            node.children[m].children[n].rowSpan -= 1
                        }
                    }
                }
                break
            }
        }

        node.children.splice(row, 1)

        // 移除旧表格
        SlateTransforms.removeNodes(editor, {
            match: (node: SlateNode, path: SlatePath) => {
                if (SlateElement.isElement(node)) {
                    // @ts-ignore
                    if (node.type === 'ptab' && node.name === rname) {
                        return true
                    }
                }
                return false
            }
        })

        // 在原位置插入新表格
        SlateTransforms.insertNodes(editor, [node])
        // // 恢复光标
        // editor.restoreSelection()
    }

    /**
     * @description 在选中单元格插入列
     * @param col       列号
     * @param isLeft    true=>左侧插入  false=>右侧插入
     */
    static insertNewCol(editor: IDomEditor, col: number, isLeft: boolean): void {
        if (editor.selection == null) return
        const selectPath = editor.selection.focus.path[0]
        var node = JSON.parse(JSON.stringify(AUtils.getNodeList(editor).nodes[selectPath])) // 获取表格节点
        var rname = node.name

        var changeColList = []
        for (var i = 0; i < node.children.length; i++) {
            for (var j = 0; j < node.children[i].children.length; j++) {
                var cell = JSON.parse(JSON.stringify(node.children[i].children[j]))
                if (cell.colSpan > 1 && cell.colSpan + j > col && j <= col) {
                    node.children[i].children[j].colSpan += 1
                    for (var k = i; k < i + cell.rowSpan; k++) {
                        changeColList.push(k)
                    }
                    i += cell.rowSpan - 1
                }
            }
        }
        changeColList = Array.from(new Set(changeColList))      //  保存已经修改过的行号

        for (var m = 0; m < node.children.length; m++) {
            if (changeColList.indexOf(m) == -1) {         // 未添加新节点的行执行插入操作
                var scell = null
                if (col < node.children[m].children.length) {
                    scell = JSON.parse(JSON.stringify(node.children[m].children[col]))
                } else {
                    scell = JSON.parse(JSON.stringify(node.children[m].children[node.children[m].children.length - 1]))
                }
                scell.children = [{ text: '' }]
                if (isLeft) {
                    node.children[m].children.splice(col, 0, scell)
                } else {
                    if (col >= node.children[m].children.length) {
                        node.children[m].children.push(scell)
                    } else {
                        node.children[m].children.splice(col + 1, 0, scell)
                    }
                }
            }
        }


        // 移除旧表格
        SlateTransforms.removeNodes(editor, {
            match: (node: SlateNode, path: SlatePath) => {
                if (SlateElement.isElement(node)) {
                    // @ts-ignore
                    if (node.type === 'ptab' && node.name === rname) {
                        return true
                    }
                }
                return false
            }
        })
        // 在原位置插入新表格
        SlateTransforms.insertNodes(editor, [node])
        // 恢复光标
        editor.restoreSelection()
    }

    /**
     * @description 删除当前单元格
     * @param col       列号
     */
    static deleteCell(editor: IDomEditor, row: number, col: number): void {
        if (editor.selection == null) return
        const selectPath = editor.selection.focus.path[0]
        var node = JSON.parse(JSON.stringify(AUtils.getNodeList(editor).nodes[selectPath])) // 获取表格节点
        var rname = node.name
        node.children[row].children.splice(col, 1)

        //移除旧表格
        SlateTransforms.removeNodes(editor, {
            match: (node: SlateNode, path: SlatePath) => {
                if (SlateElement.isElement(node)) {
                    // @ts-ignore
                    if (node.type === 'ptab' && node.name === rname) {
                        return true
                    }
                }
                return false
            }
        })
        // 在原位置插入新表格
        SlateTransforms.insertNodes(editor, [node])

    }

}