/**
 * @description check-box helper
 * @createTime 2022.10.09
 */
import {SlateEditor, SlateElement} from "@wangeditor/editor";

// export function genCheckBoxNode(row) {
//     return {
//         type: 'checkbox',
//         row: row,
//         children: [],
//     }
// }

export function genCheckBoxNode(row, isChecked) {
    return {
        type: 'checkbox',
        row: row,
        isChecked: isChecked || false,
        children: [],
    }
}


export function insertCheckBox(nodes) {
    const newNodes = []
    for(let i=0; i< nodes.length; i++){
        const node = nodes[i]
        node.children.unshift(genCheckBoxNode(i))
        newNodes.push(node)
    }
    return newNodes
}

export function getCheckedNodes(editor){
    if (editor == null) return

    const result = []

    for(let i=0; i< editor.children.length; i++){

        let rowNode = editor.children[i]
        for(let j=0; j < rowNode.children.length; j++){
            let inlineNode = rowNode.children[j]
            if(inlineNode.type === 'checkbox'){
                if(inlineNode.isChecked){
                    result.push(editor.children[i]["rid"])
                }
                break
            }
        }
    }

    return result
}