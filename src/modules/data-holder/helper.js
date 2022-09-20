/**
 * @description data-holder helper
 * @createTime 2022.09.20
 */
import {Editor, Range, Transforms} from "slate";


export function genDataSpanNode(group, field, text) {
    return {
        type: 'data',
        group: group,
        field: field,
        value: text,
        children: text ? [{text}] : [],
    }
}

export async function insertDataHolder(editor, group, field, text) {
    if (editor == null) return;

    // 判断选区是否折叠
    const {selection} = editor;
    if (selection == null) return;
    const isCollapsed = Range.isCollapsed(selection);

    if (isCollapsed) {
        editor.insertText(' ')              // 数据标签前置空格

        const DataNode = genDataSpanNode(group, field, text)
        Transforms.insertNodes(editor, DataNode)

        editor.insertFragment([{text: ' '}])  // 数据标签后置空格
    } else {
        const selectedText = Editor.string(editor, selection) // 选中的文字
        editor.deleteFragment()
        let DataNode = genDataSpanNode(group, field, selectedText)
        DataNode["value"] = DataNode["field"]
        editor.insertNode(DataNode)

    }

}





