/**
 * @description 自定义数据结构Data插件
 * @CreateTime 2022.09.20
 */
import {SlateNode, DomEditor} from '@wangeditor/editor'
import {Transforms} from 'slate'

export function withCheckBox (editor) {
    const {isInline, isVoid} = editor
    const newEditor = editor

    // 重写 isInline
    newEditor.isInline = elem => {
        const type = DomEditor.getNodeType(elem)
        if (type === 'checkbox') return true
        return isInline(elem)
    }

    // 重写 isVoid
    newEditor.isVoid = elem => {
        const type = DomEditor.getNodeType(elem)
        if (type === 'checkbox') return true
        return isVoid(elem)
    }

    return newEditor
}

