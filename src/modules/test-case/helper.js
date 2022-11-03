/**
 * @description test-case holder helper
 * @createTime 2022.09.20
 */

import {Editor, Range, Transforms} from "slate";

/**
 * 生成测试用例节点
 * @param editor
 * @param text
 * @return
 */
export function genTestCaseSpan(editor, text) {
    if(editor == null){
        return null
    }else{
        let content = text || "用例@"
        let number = 1
        const tc_nodes = editor.getElemsByType("testcase")

        if(tc_nodes.length === 0){
            content = content.replace("@", 1)
            return {
                type: 'testcase',
                seq: 1,
                children: [{ text: content }]
            }
        }else{
            tc_nodes.forEach((value)=>{
                if(value.seq > number) number = value.seq
            })
            number += 1
            content = content.replace("@", number)
            return {
                type: 'testcase',
                seq: number,
                children: [{ text: content }]
            }
        }
    }
}

/**
 * 插入测试用例节点
 * @param editor
 * @return
 */
export function insertTestCaseSpan(editor) {
    if (editor == null) return;

    // 判断选区是否折叠
    const { selection } = editor;
    if (selection == null) return;

    const isCollapsed = Range.isCollapsed(selection);

    if (isCollapsed) {
        const tcNode = genTestCaseSpan(editor)
        editor.insertText(' ')              // 数据标签前置空格
        Transforms.insertNodes(editor, tcNode)
        editor.insertFragment([{ text: ' ' }])  // 数据标签后置空格
    } else {
        const selectedText = Editor.string(editor, selection) // 选中的文字
        const tcNode = genTestCaseSpan(editor, selectedText)
        editor.deleteFragment()
        editor.insertNode(tcNode)
    }
}