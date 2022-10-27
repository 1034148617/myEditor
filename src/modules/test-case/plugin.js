/**
 * @description 自定义数据结构Data插件
 * @CreateTime 2022.09.20
 */
import {SlateNode, DomEditor} from '@wangeditor/editor'
import {Transforms} from 'slate'

export function withTestCase (editor) {
    const {isInline} = editor
    const newEditor = editor

    // 重写 isInline
    newEditor.isInline = elem => {
        const type = DomEditor.getNodeType(elem)
        if (type === 'testcase') return true
        return isInline(elem)
    }

    return newEditor
}

