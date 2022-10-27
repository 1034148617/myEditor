/**
 * @description attachment helper
 * @createTime 2022.09.21
 */
import {Editor, Range, Transforms} from "slate";

export function genAttachmentNode(filename,filetype,src){
    return {
        type: 'attachment',
        filename: filename,
        filetype: filetype,
        src: src,
        children: [{ text: '' }]
    }
}

export async function insertAttachment(editor, filename, filetype, src) {
    if (editor == null) return;

    // 判断选区是否折叠
    const {selection} = editor;
    if (selection == null) return;
    const isCollapsed = Range.isCollapsed(selection);

    if (isCollapsed) {
        const DataNode = genAttachmentNode(filename, filetype, src)
        Transforms.insertNodes(editor, [DataNode, {text:' '}])
    }

}


