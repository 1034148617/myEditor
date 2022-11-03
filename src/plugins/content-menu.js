/**
 * 右键菜单配置
 */
import {insertDataSpanExec} from "../modules/data-holder/helper";
import {insertTestCaseSpan} from "../modules/test-case/helper";
import {SlateTransforms} from "@wangeditor/editor";

export const general_items =
    [
        {
            id: "addDataTag",
            name: "插入数据标签",
            func: insertDataSpanExec,
            priority: 1
        },
        {
            id: "addTestCase",
            name: "插入测试用例",
            func: insertTestCaseSpan,
            priority: 2
        },
        {
            id: "deleteRowNode",
            name: "删除当前行节点",
            func: function (editor) {
                if (editor == null) return
                SlateTransforms.removeNodes(editor)
            },
            priority: 3
        }
    ]

export const paragraph_items =
    [
        {
            id: "addNewParagraph",
            name: "插入空行",
            func: function (editor) {
                if (editor == null) return
                const node = {type: 'paragraph', children: [{text: ''}]}
                editor.insertNode(node)
            },
            priority: 1
        },
    ]

export const header_items =
    [
        {
            id: "setHeaderConfig",
            name: "设置标题格式",
            func: function (editor) {
                console.log("设置标题格式")
            },
            priority: 1
        }
    ]

export const table_items =
    []

export const drow_items =
    []

export function getContentByNodeType(NodeType) {
    let result = general_items

    if (NodeType.indexOf("paragraph") > -1) {
        result = result.concat(paragraph_items)
    } else if (NodeType.indexOf("header") > -1) {
        result = result.concat(header_items)
    } else if (NodeType.indexOf("table") > -1) {
        result = result.concat(table_items)
    } else if (NodeType.indexOf("pdr") > -1) {
        result = result.concat(drow_items)
    }

    // 菜单项排序 （暂时不加入）

    return result
}


















