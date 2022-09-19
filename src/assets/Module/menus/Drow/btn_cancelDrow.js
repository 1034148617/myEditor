/**
 * @description  插入动态行按钮
 * @createTime 2022.08.16
 */
import {Editor, Range, Transforms} from 'slate'
import {SlateNode, SlateTransforms} from "@wangeditor/editor";

export function cancel_pdr(editor) {
    if (editor == null) return;

    const {selection} = editor;
    if (selection == null) editor.restoreSelection();

    let row_start = selection["anchor"]["path"][0]
    let row_end = selection["focus"]["path"][0]

    if(row_start > row_end){
        let temp = row_start;
        row_start = row_end;
        row_end= temp;
    }

    for (let row = row_start; row <= row_end; row++) {
        const node = editor.children[row]

        if (node["type"] === "pdr") {
            const selectedText = SlateNode.string(node); // 当前行文字
            const PNode = {type: 'paragraph', children: [{text: selectedText}]}

            SlateTransforms.setNodes(editor, PNode, {
                at: [row]
            });
        }
    }
}

class CancelDrow {
    constructor() {
        this.title = '取消动态行'
        this.iconSvg = '<svg t="1660803213989" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1359" width="200" height="200"><path d="M567.027 90.125c-152.242 0-276.969 124.728-276.969 276.969v421.875h-111.889l143.071 143.071 143.071-143.071h-111.888v-421.875c0-117.392 95.38-212.772 212.772-212.772s212.772 95.38 212.772 212.772v566.781h64.198v-566.781c3.668-152.242-121.059-276.969-275.136-276.969z" p-id="1360"></path></svg>'
        this.tag = 'button'
    }

    getValue() {
        return ''
    }

    isActive() {
        return false
    }

    isDisabled() {
        return false
    }

    exec(editor) {
        cancel_pdr(editor)
    }
}

export const CancelDrowConf = {
    key: 'menu-cancel-pdr',
    factory() {
        return new CancelDrow()
    },
}



