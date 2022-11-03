/**
 * @description data-holder helper
 * @createTime 2022.09.20
 */
import axios from "axios";
import {Editor, Path, Range, Transforms} from "slate";
import {SlateEditor, SlateElement, SlateNode} from '@wangeditor/editor'
import {getUrlParams} from '../../utils/util'
import {url_get_data, url_load_data_source, url_update_data} from "../../assets/urls";
import {DomEditor} from "@wangeditor/core";

export function genDataSpanNode(group, field, text) {
    return {
        type: 'data',
        group: group,
        field: field,
        value: text,
        children: text ? [{text}] : [],
    }
}

export function getDataSpanContent(group, field) {
    let url_param = getUrlParams()
}

/**
 * 插入数据标签
 * @param editor
 * @param group
 * @param field
 * @param text
 */
export async function insertDataHolder(editor, group, field, text) {
    if (editor == null) return;

    // 判断选区是否折叠
    const {selection} = editor;
    if (selection == null) return;
    const isCollapsed = Range.isCollapsed(selection);

    if (isCollapsed) {
        editor.insertText(' ')              // 数据标签前置空格

        const DataNode = genDataSpanNode(group, field, text)
        Transforms.insertNodes(editor, DataNode)

        editor.insertFragment([{text: ' '}])  // 数据标签后置空格
    } else {
        const selectedText = Editor.string(editor, selection) // 选中的文字
        editor.deleteFragment()
        let DataNode = genDataSpanNode(group, field, selectedText)
        DataNode["value"] = DataNode["field"]
        editor.insertNode(DataNode)

    }
}

/**
 * 扫描编辑器中所有的data-holder并且将其渲染为数据
 * @param {*} editor
 */
export function renderDataSpan(editor) {
    if (editor == null) return

    editor.selectAll()

    const env_args = getUrlParams()

    const nodeEntries = SlateEditor.nodes(editor, {
        match: (node) => {
            if (SlateElement.isElement(node)) {
                if (node.type === 'data') {
                    return true // 匹配 data
                }
            }
            return false
        },
        // universal: true,
    })

    for (let nodeEntry of nodeEntries) {
        const [node, path] = nodeEntry

        const group = node.group
        const field = node.field

        if (group && field) {
            const params = new URLSearchParams()
            for (let key in env_args) {
                if (Object.prototype.hasOwnProperty.call(env_args, key)) {
                    params.append(key, env_args[key])
                }
            }
            params.append("GroupID", group)
            // params.append("FiledID", field)

            axios.post(url_get_data, params).then(function (res) {
                const data_source = res["data"][0];     // 数据字典

                const content = data_source[field] || ''

                const newNode = {
                    type: "data",
                    group: group,
                    field: field,
                    value: content,
                    children: [{text: content}]
                }

                Transforms.insertNodes(editor, newNode, {at: path})
                Transforms.removeNodes(editor, {at: Path.next(Path.next(path))})
            })
        }
    }

    editor.restoreSelection()
}

/**
 * 扫描编辑器中所有的data-holder并且将还原为模板
 * @param {*} editor
 * @param {*} callback
 */
export function restoreDataSpan(editor, callback) {
    if (editor == null) return

    editor.selectAll()

    const env_args = getUrlParams()

    const nodeEntries = SlateEditor.nodes(editor, {
        match: (node) => {
            if (SlateElement.isElement(node)) {
                if (node.type === 'data') {
                    return true // 匹配 data
                }
            }
            return false
        },
        // universal: true,
    })


    axios.get(url_load_data_source).then(function (res) {
        const data_source = res["data"]["Field"]

        for (let nodeEntry of nodeEntries) {
            const [node, path] = nodeEntry

            const group = node.group
            const field = node.field

            for (let i = 0; i < data_source.length; i++) {
                if (data_source[i]["GroupID"] === group && data_source[i]["FieldID"] === field) {
                    const content = data_source[i]["FieldName"]
                    const newNode = {
                        type: "data",
                        group: group,
                        field: field,
                        value: content,
                        children: [{text: content}]
                    }
                    Transforms.insertNodes(editor, newNode, {at: path})
                    Transforms.removeNodes(editor, {at: Path.next(Path.next(path))})
                    break
                }
            }
        }

        editor.restoreSelection()

        if (callback) callback(res)
    })

}

/**
 * 扫描编辑器中所有的data-holder并回写数据（未设置UpdateSql则跳过）
 * @param {*} editor
 */
export function saveDataSpan(editor) {
    if (editor == null) return

    editor.selectAll()

    const nodeEntries = SlateEditor.nodes(editor, {
        match: (node) => {
            if (SlateElement.isElement(node)) {
                if (node.type === 'data') {
                    return true // 匹配 data
                }
            }
            return false
        },
        // universal: true,
    })

    const env_args = getUrlParams()

    axios.get(url_load_data_source).then(function (res) {
        const data_source = res["data"]["Field"]


        for (let nodeEntry of nodeEntries) {
            const [node, path] = nodeEntry
            const content = SlateNode.string(node);

            // 内容未变化则跳过
            if (content === node.value) continue

            let field_info = data_source.filter((field) => {
                return (field.GroupID === node.group && field.FieldID === node.field)
            })

            if (field_info.length > 0)
                field_info = field_info[0]
            else
                continue

            let updateSql = field_info["SqlTemplate"]             // 获取到字段更新sql

            if (updateSql == null) continue

            env_args["content"] = content
            for (let key in env_args) {
                const replace_holder = '{' + key + '}'
                if (updateSql.indexOf(replace_holder) > -1) {
                    const newReg = new RegExp(replace_holder, "g")
                    updateSql = updateSql.replace(newReg, env_args[key])
                }
            }

            const params = new URLSearchParams()
            params.append("Sql", updateSql)

            axios.post(url_update_data, params).then(function (res) {
                //
            })
        }

        editor.restoreSelection()

    })


}


/**
 * 用于插入数据标签按钮功能调用的函数（同时用于右键菜单）
 * @param editor
 */
export function insertDataSpanExec(editor) {
    if (window.openDialogModel) {
        if (DomEditor.getSelectedNodeByType(editor, 'pdr') != null) {
            const node = DomEditor.getSelectedNodeByType(editor, 'pdr')
            window.openDialogModel("InsertDataSpanModal", "插入数据标签", "70%", {
                "model": "data",
                "group": node["group"],
                "filter": ["10"]
            })
        } else {
            window.openDialogModel("InsertDataSpanModal", "插入数据标签", "70%", {
                "model": "data",
                "filter": ["10"]
            })
        }
    }
}





