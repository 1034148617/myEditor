/**
 * @description 自定义数据结构Data插件
 * @CreateTime 2022.09.20
 */
import {SlateNode, DomEditor} from '@wangeditor/editor'
import {Transforms} from 'slate'

export function withData (editor) {
    const {isInline, insertText} = editor
    const newEditor = editor

    // 重写 isInline
    newEditor.isInline = elem => {
        const type = DomEditor.getNodeType(elem)
        if (type === 'data') return true
        return isInline(elem)
    }

    // 重写 insertText
    newEditor.insertText = text => {
        const {selection} = editor;
        const codeNode = DomEditor.getSelectedNodeByType(newEditor, 'data');

        if (codeNode !== null) {
            const content = SlateNode.string(codeNode);
            if (content.substring(content.length - 1) === " " && text === " ") {
                Transforms.insertNodes(editor,{text:' '},{at:selection});
            }

        }

        return insertText(text);
    }

    return newEditor
}

