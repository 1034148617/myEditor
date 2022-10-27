/**
 * @description  render check-box elem
 * @createTime 2022.10.09
 */
import {h} from 'snabbdom'
import {Transforms} from "slate";

function renderCheckBox(
    elemNode,
    children,
    editor
) {
    return h(
        'input',
        {
            props: {
                type: 'checkbox',
                value: elemNode.row || '',
                checked: elemNode.isChecked
            },
            attrs: {},
            className: 'class-check-box',
            style: {},
            on: {
                click: (t, e) => {
                    const row = Number(e.elm.attributes.getNamedItem("value").textContent)
                    const isChecked = e.elm.checked

                    let node = editor.children[row]

                    for(let i=0; i< node.children.length; i++){
                        if(node.children[i].type === 'checkbox'){
                            editor.enable()
                            Transforms.setNodes(editor,{
                                isChecked: isChecked
                            },{
                                at: [row, i]
                            })
                            editor.disable()
                            break
                        }
                    }


                }
            },
        },
        children
    )
}

export const renderCheckBoxConf = {
    type: 'checkbox',
    renderElem: renderCheckBox,
}
