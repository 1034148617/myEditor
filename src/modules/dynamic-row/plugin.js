/**
 * @description 自定义数据结构Dynamic Row插件
 * @CreateTime 2022.09.20
 */
import {NewID} from "@/utils/util"
import { Editor, Transforms, Node as SlateNode, Element as SlateElement } from 'slate'
import { IDomEditor, DomEditor } from '@wangeditor/core'

function checkDynamicRow(n) {
    const type = DomEditor.getNodeType(n)
    return ['pdr'].includes(type)
}

function deleteHandler(newEditor) {
    const [nodeEntry] = Editor.nodes(newEditor, {
        match: n => newEditor.children[0] === n,
        mode: 'highest'
    })
    if (nodeEntry == null) return false
    const n = nodeEntry[0]
    if (!SlateElement.isElement(n)) return false

    if (!SlateNode.string(n) && checkDynamicRow(n)) {
        Transforms.unwrapNodes(newEditor, {
            match: n => checkDynamicRow(n),
            split: true,
        })
        // 转换为 paragraph
        Transforms.setNodes(newEditor, {
            type: 'paragraph',
        })
        return true
    }
    return false
}

export function withDynamicRowContent(editor) {
    const {insertBreak, normalizeNode, insertData} = editor
    const newEditor = editor

    // 重写换行
    newEditor.insertBreak = () => {
        const dynamicRowNode = DomEditor.getSelectedNodeByType(newEditor, 'pdr')
        const contentNode = DomEditor.getSelectedNodeByType(newEditor, 'dr-content')

        if (dynamicRowNode == null) {
            insertBreak() // 执行默认的换行
            return
        }

        let isTemplate = dynamicRowNode["isTemplate"] || false

        if(isTemplate){
            // insertBreak()
            // Transforms.insertNodes(newEditor, genDynamicRowContentNode(true))
            newEditor.insertText('\n')
        }else{
            let template = dynamicRowNode["template"]
            if(template.length > 0){
                const rowID = NewID(32)
                template.forEach((item)=>{
                    item["rid"] = rowID
                })
                Transforms.insertNodes(newEditor, template)
            }else{
                newEditor.insertText('\n')          // 普通换行
            }
        }
    }

    // 重写 normalizeNode
    newEditor.normalizeNode = ([node, path]) => {
        const type = DomEditor.getNodeType(node)

        // -------------- dr-content node 不能是顶层，否则替换为 p --------------
        if (type === 'dr-content' && path.length <= 1) {
            Transforms.setNodes(newEditor, { type: 'paragraph' }, { at: path })
        }

        if (type === 'pdr') {
            // -------------- pdr 是 editor 最后一个节点，需要后面插入 p --------------
            const isLast = newEditor.children.length === path[0] + 1
            if (isLast) {
                Transforms.insertNodes(newEditor, { type: 'paragraph',children:[{text:""}] }, { at: [path[0] + 1] })
            }

            // -------------- pdr 下面必须是 dr-content --------------
            if (DomEditor.getNodeType((node).children[0]) !== 'dr-content') {
                Transforms.unwrapNodes(newEditor)
                Transforms.setNodes(newEditor, { type: 'paragraph' }, { mode: 'highest' })
            }
        }

        // 执行默认行为
        return normalizeNode([node, path])
    }

    newEditor.insertData = (data) => {
        const codeNode = DomEditor.getSelectedNodeByType(newEditor, 'pdr')
        if (codeNode == null) {
            insertData(data) // 执行默认的 insertData
            return
        }

        // 获取文本，并插入到代码块
        const text = data.getData('text/plain')
        Editor.insertText(newEditor, text)
    }

    return newEditor
}


