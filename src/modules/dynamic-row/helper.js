/**
 * @description dynamic-row helper
 * @createTime 2022.09.20
 */
import {SlateNode} from "@wangeditor/editor";
import {Transforms} from "slate";
import axios from "axios";
import {ElMessage} from "element-plus";

import {NewID, getNodeRow, getUrlParams} from '@/utils/util'
import {url_get_data} from "@/assets/urls";

export function genDynamicRowContentNode(isTemplate, RowID, Content) {
    if (isTemplate) {
        return {
            type: "dr-content",
            children: Content ? [{text: Content}] : [],
        }
    } else {
        return {
            type: "dr-content",
            rid: RowID,
            children: Content ? [{Content}] : [],
        }
    }
}

export function genSimpleDynamicRowNode(group, rid, content) {
    return {
        type: 'pdr',
        group: group,
        rid: rid,
        isTemplate: true,
        template: null,
        // dataSource: null,
        children: [genDynamicRowContentNode(true, NewID(32), content)],
    }
}

export function insertTemplatePdr(editor, group, content) {
    if (editor == null) return;

    // 判断选区是否折叠
    const row = getNodeRow(editor)

    const node = editor.children[row]

    if (SlateNode.string(node) === "" || row === 0) {
        if(row !== 0) editor.deleteBackward();
        const PdrNode = genSimpleDynamicRowNode(group, NewID(32), content);
        Transforms.insertNodes(editor, PdrNode);
    } else {
        const selectedText = SlateNode.string(node); // 当前行文字
        const PdrNode = genSimpleDynamicRowNode(group, NewID(32), selectedText);
        Transforms.removeNodes(editor, {at: [row]})
        Transforms.insertNodes(editor, PdrNode);
    }

}

/**
 * 加载分组数据源
 * @param groupID 分组ID
 * @param callback 回调函数 用于接收处理数据
 */
function axios_load_dataSource(groupID, callback){
    let params = new URLSearchParams()
    let env_args = getUrlParams()      // 暂定从url获取参数
    env_args["GroupID"] = groupID   // 将节点所属分组加入参数字典中
    for (let key in env_args) {
        if(Object.prototype.hasOwnProperty.call(env_args, key)){
            params.append(key, env_args[key])
        }
    }

    axios.post(url_get_data, params).then(function (res) {
        const data_source = res["data"];

        if(callback) callback(data_source)
    })

}

export function switchPdr(editor) {
    if (editor == null) return;

    const row = getNodeRow(editor)
    const pdrNode = editor.children[row]

    if(pdrNode["type"] !== "pdr") return ;

    const isTemplate = pdrNode["isTemplate"] || false

    if (isTemplate) {
        // 当前dr-content作为模板节点 保存在Pdr节点的属性里
        const templateNode = pdrNode.children[0]
        const groupID = pdrNode["group"]

        // 1.加载数据源
        axios_load_dataSource(groupID,function(dataSource){
            if (dataSource.length > 0) {
                // 2.渲染数据
                let newPdrNode = JSON.parse(JSON.stringify(pdrNode))
                newPdrNode["template"] = JSON.parse(JSON.stringify(templateNode))
                // newPdrNode["dataSource"] = dataSource
                newPdrNode["isTemplate"] = false

                let childrenNodes = []
                for (let i = 0; i < dataSource.length; i++) {
                    const ds = dataSource[i]
                    let node = JSON.parse(JSON.stringify(templateNode))

                    node["rid"] = ds["RowID"] || NewID(32)

                    for (let j = 0; j < node.children.length; j++) {
                        const single_node = node.children[j]
                        if (single_node["type"] === "data" && single_node["group"] === groupID
                            && ds[single_node["field"]]) {
                            const value = ds[single_node["field"]];
                            node.children[j]["children"] = [{text: value}];
                        }
                    }
                    childrenNodes.push(node)
                }

                newPdrNode.children = childrenNodes
                Transforms.removeNodes(editor, {at: [row]})
                Transforms.insertNodes(editor, newPdrNode, {at: [row]});
            } else {
                ElMessage({
                    message: "数据源为空，请检查环境参数",
                    center: true,
                    duration: 3000,
                    type: "error",
                });
            }
        })
    } else {
        // 还原成模板
        const templateNode = pdrNode["template"]
        let newPdrNode = JSON.parse(JSON.stringify(pdrNode))
        newPdrNode["template"] = null
        newPdrNode["isTemplate"] = true
        newPdrNode["children"] = [templateNode]

        Transforms.removeNodes(editor, {at: [row]})
        Transforms.insertNodes(editor, newPdrNode, {at: [row]});
    }


}

export function cancelPdr(editor) {
    if (editor == null) return

    const row = getNodeRow(editor)
    const pdrNode = editor.children[row]

    if(pdrNode["type"] !== "pdr") return

    let nodes = []

    for(let i = 0; i < pdrNode.children.length; i++) {
        const contentNode = pdrNode.children[i];
        const content = SlateNode.string(contentNode)
        nodes.push({"type": "paragraph", children: [{ text : content}]})
    }

    Transforms.removeNodes(editor, {at: [row]})
    Transforms.insertNodes(editor, nodes, { at: [row]})


}

