/**
 * @description 自定义数据结构Dynamic Row插件
 * @CreateTime 2022.08.15
 */
import {Utils} from "@/assets/Module/utils"
import {Editor, Transforms, Node as SlateNode, Element as SlateElement} from 'slate'
import {DomEditor} from '@wangeditor/core'

function checkDynamicRow(n) {
    const type = DomEditor.getNodeType(n)
    return ['pdr'].includes(type)
}

function deleteHander(newEditor) {
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

export function getLastTextLineBeforeSelection(codeNode, editor) {
    const selection = editor.selection
    if (selection == null) return ''

    const codeText = SlateNode.string(codeNode)
    const anchorOffset = selection.anchor.offset
    const textBeforeAnchor = codeText.slice(0, anchorOffset) // 选区前的 text
    const arr = textBeforeAnchor.split('\n') // 选区前的 text ，按换行拆分
    const length = arr.length
    if (length === 0) return ''

    return arr[length - 1]
}

export function withPdr(editor) {
    const {isInline, insertBreak, normalizeNode, deleteBackward, insertData} = editor
    const newEditor = editor

    newEditor.isInline = elem => {
        const type = DomEditor.getNodeType(elem)
        if (type === 'pdr') return false
        return isInline(elem)
    }

    newEditor.insertBreak = () => {
        const codeNode = DomEditor.getSelectedNodeByType(newEditor, 'pdr')
        if (codeNode == null) {
            insertBreak() // 执行默认的换行
            return
        }

        if (SlateNode.string(codeNode) === '') {
            newEditor.deleteBackward()
            Transforms.insertNodes(newEditor, {type: "paragraph", children: [{text: ""}]})
        } else {
            let newNode = JSON.parse(JSON.stringify(codeNode))

            if ('RowID' in newNode) {
                newNode["RowID"] = Utils.NewID(32);
            }

            if (newNode["isTemplate"] === false){
                let template = JSON.parse(JSON.stringify(newNode["Template"]));
                const row = Utils.getNodeRow(editor);
                const Rid = Utils.NewID(32);
                template.forEach(node=>{
                    node["RowID"] = Utils.NewID(32);
                    node["Rid"] = Rid;
                    node["isTemplate"] = false;
                })
                Transforms.insertNodes(newEditor, template,{
                    at:[row+1]
                });
            } else {
                newNode["children"] = [{text: ''}]
                Transforms.insertNodes(newEditor, newNode)
            }

        }
    }

    newEditor.normalizeNode = ([node, path]) => {
        const type = DomEditor.getNodeType(node)

        if (type === 'pdr') {
            if (path[0] === editor.children.length - 1) {
                Transforms.insertNodes(newEditor, {type: "paragraph", children: [{text: ""}]}, {at: [path[0] + 1]})
            }
        }
        // 执行默认行为
        return normalizeNode([node, path])
    }


    newEditor.deleteBackward = unit => {
        const res = deleteHander(newEditor)
        if (res) return // 命中结果，则 return

        // 执行默认的删除
        deleteBackward(unit)
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


