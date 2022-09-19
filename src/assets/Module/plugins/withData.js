/**
 * @description 自定义数据结构Data插件
 * @CreateTime 2022.08.15
 */
import {SlateNode, SlateEditor, IDomEditor, DomEditor} from '@wangeditor/editor'
import {Transforms} from 'slate'
import {Utils} from "@/assets/Module/utils";

export function withData(editor) {                        // JS 语法
    const {isInline, insertText} = editor
    const newEditor = editor

    newEditor.isInline = elem => {
        const type = DomEditor.getNodeType(elem)
        if (type === 'data') return true
        return isInline(elem)
    }

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


