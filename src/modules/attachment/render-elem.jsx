/**
 * @description  render attachment elem
 * @createTime 2022.09.21
 */
import {h} from 'snabbdom'

import {
    svg_avi_file,
    svg_excel_file, svg_exe_file, svg_other_file,
    svg_pdf_file,
    svg_ppt_file,
    svg_word_file,
    svg_zip_file
} from "@/assets/attachment-style";

function renderAttachment(elemNode, children, editor) {

    let _img = null
    let _src = elemNode.src
    let _type = elemNode.filetype.toLowerCase()
    let _fn = elemNode.filename

    if (_type === ".xls" || _type === ".xlsx") {
        _img = "http://192.168.1.78/develop/api/5D5A9F8387924E9794E0B904AA134B1C.ds?PID=3E90FF8542BB44D2A07CF62B6EAB769A"
    } else if (_type === ".doc" || _type === ".docx") {
        _img = "http://192.168.1.78/develop/api/5D5A9F8387924E9794E0B904AA134B1C.ds?PID=26740331E0764F66920DF1B91827475B"
    } else if (_type === ".rar" || _type === ".zip" || _type === ".iso") {
        _img = "http://192.168.1.78/develop/api/5D5A9F8387924E9794E0B904AA134B1C.ds?PID=6C2A24E41D6A478C9159242742803571"
    } else if (_type === ".ppt" || _type === ".pptx") {
        _img = "http://192.168.1.78/develop/api/5D5A9F8387924E9794E0B904AA134B1C.ds?PID=7FE95D5622AB462ABD291F9D91AB534F"
    } else if (_type === ".pdf") {
        _img = "http://192.168.1.78/develop/api/5D5A9F8387924E9794E0B904AA134B1C.ds?PID=3FD80B71FFBB4301BF83F5BC37AEA7EB"
    } else {
        _img = "http://192.168.1.78/develop/api/5D5A9F8387924E9794E0B904AA134B1C.ds?PID=D8C0AEA6E39748A3A2B9E72EFE80AD45"
    }

    return h(
        "img",
        {
            props: {
                src: _img,
                title: _fn,
            },
            style: {
                width: "100px",
                height: "100px"
            },
            on: {
                dblclick: (e) => {
                  window.open(_src, "_blank")
                }
            },
            className: "class-attachment-img"
        }
    )

}

export const renderAttachmentConf = {
    type: 'attachment',
    renderElem: renderAttachment,
}

