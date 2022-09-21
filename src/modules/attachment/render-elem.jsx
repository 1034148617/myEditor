/**
 * @description  render attachment elem
 * @createTime 2022.09.21
 */
import { h } from 'snabbdom'
import { getVNode, transformVNode } from "@/utils/dom2vnode";

import {
    svg_avi_file,
    svg_excel_file, svg_exe_file, svg_other_file,
    svg_pdf_file,
    svg_ppt_file,
    svg_word_file,
    svg_zip_file
} from "@/assets/attachment-style";

function renderAttachment(elemNode, children, editor){

    let _img = null
    let _type = elemNode.filetype.toLowerCase()
    let _fn = elemNode.filename + "." + elemNode.filetype

    if(_type === "xls" || _type === "xlsx"){
        _img = "excel.png"
    }else if(_type === "doc" || _type === "docx"){
        _img = "word.png"
    }else if(_type === "rar" || _type === "zip" || _type === "iso"){
        _img = "zip.png"
    }else if(_type === "ppt" || _type === "pptx"){
        _img = "ppt.png"
    }else if(_type === "pdf"){
        _img = "pdf.png"
    }else{
        _img = "other.png"
    }

    const img = h(
        "img",
        {
            props: {
                // src: "../../assets/attachment-img/" + _img
                src: "http://192.168.1.78/develop/api/5D5A9F8387924E9794E0B904AA134B1C.ds?PID=3E90FF8542BB44D2A07CF62B6EAB769A"
            },
            style: {
                width: "150px",
                height: "150px"
            },
            className: "class-attachment-img"
        }
    )


    const prompt =  h(
        'span',
        {
            className: "class-attachment-prompt"
        },
        _fn
    )


    return h(
        'span',
        {
            className: 'class-attachment'
        },
        [ img ,  prompt ]
    )

}

export const renderAttachmentConf = {
    type: 'attachment',
    renderElem: renderAttachment,
}

