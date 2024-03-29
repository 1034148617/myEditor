/**
 * @description document operations helper
 * @createTime 2022.09.20
 */

import {DB, COL, OpenDocument, SaveDocument} from "@/dmc/MongoConn"
import {changeURL, getTime, getUrlParams, NewID} from "@/utils/util";
import {SlateEditor, SlateElement, SlateNode, SlateTransforms} from "@wangeditor/editor";
import {ElMessage} from "element-plus";
import axios from "axios";
import {
    url_update_document_info,
    url_update_SRS_nodes,
    url_update_TC_nods,
    url_read_SRS_nodes
} from "@/assets/urls";
import {renderDataSpan, saveDataSpan} from "../data-holder/helper";
import {save_pdr_data} from "../dynamic-row/helper";
import {Transforms} from "slate";
import {getHtmlPlainText} from "../../utils/util";

/**
 * 页面刷新
 * @param editor
 */
export function refresh(editor) {
    setTimeout(function () {
        location.reload()
    }, 2000)
}

/**
 * Mongodb读取Document节点
 * @param condition
 * @param callback
 */
export function base_open(condition, callback) {
    OpenDocument(DB, COL, condition, {
        "_id": 0,
        "DocumentID": 0,
        "UpdateTime": 0,
    }, (res) => {
        let data = res["data"]["result"];
        if (callback) callback(data);
    })
}

/**
 * Mongodb读取Document节点
 * @param condition
 * @param callback
 */
export function open_documents(condition, callback) {
    OpenDocument(DB, COL, {'$or': condition}, {
        "_id": 0,
        "Version": 0,
        "DocumentID": 0,
        "UpdateTime": 0,
    }, (res) => {
        let data = res["data"]["result"];
        // 清楚 ID相关数据
        data.forEach((node) => {
            Reflect.deleteProperty(node, "rid");
            Reflect.deleteProperty(node, "ObjectID");
        })
        if (callback) callback(data);
    })
}

/**
 * 根据条件读取Document节点
 * @param condition_list DocumentID,version,result(RowID list)
 */
export function new_Document(condition_list) {
    const url_params = getUrlParams()

    const new_id = NewID(32)

    const conditions = []

    for (let i = 0; i < condition_list.length; i++) {
        const doc_info = condition_list[i]
        for (let j = 0; j < doc_info["result"].length; j++) {
            conditions.push({
                "DocumentID": doc_info["DocumentID"],
                "Version": doc_info["version"],
                "rid": doc_info["result"][j]
            })
        }
    }

    open_documents(conditions, (nodes) => {
        // 节点排序

        // 读取选择节点
        changeURL("DocumentID", new_id)

        if (window.editor == null) return
        window.editor.clear()
        window.editor.redo = []
        SlateTransforms.insertNodes(window.editor, nodes, {at: [0]})
    })
}

/**
 * 保存文档节点的主逻辑（部分数据节点还原成模板的操作更改至外部进行 本函数不做变动）
 * @param editor
 */
export function base_save(editor) {
    // 0.获取节点内容和DocumentID
    let elem_nodes = JSON.parse(JSON.stringify(editor.children));
    let index = elem_nodes.length;

    let args = getUrlParams();        // 从URL中获取DocumentID
    let documentID;
    if ("DocumentID" in args) {
        documentID = args["DocumentID"];
    } else {
        documentID = NewID(32);
        changeURL("DocumentID", documentID);
    }

    /************************* 1. 还原模板(回写数据另外处理)******************************/
    /* 在外部使用处理后使用回调函数调用base_save
    /********************************************************************************/

    // 2.对节点进行处理 添加rid
    editor.clear();     // 清空旧的节点

    const RowIDs = []
    for (let i = 0; i < elem_nodes.length; i++) {
        let node = elem_nodes[i];
        if (!("rid" in node) || ("rid" in node && RowIDs.indexOf(node["rid"]) > -1)) {
            const new_id = NewID(32)
            node["rid"] = new_id;
            RowIDs.push(new_id)
        } else {
            RowIDs.push(node["rid"])
        }
        SlateTransforms.insertNodes(editor, node, {
            at: [i]
        })
    }

    // 删除多余行
    if (editor.children.length === index + 1) {
        if (editor.children[index]["children"][0]["text"] === '') {
            editor.deleteBackward();
        }
    }

    // 3.保存文档相关信息至 Mongodb
    OpenDocument(DB, COL, {"DocumentID": documentID}, {"_id": 0, "Version": 1}, (res) => {
        let data = res["data"]["result"];
        let version = 1;
        if (data.length > 0) {
            data.forEach((item) => {
                if (item["Version"] > version) {
                    version = item["Version"];      // 读取版本信息
                }
            })
            version++;
        }

        let nowTime = getTime();
        let nodes = JSON.parse(JSON.stringify(editor.children));
        nodes.forEach((item) => {
            item["DocumentID"] = documentID;
            item["Version"] = version;
            item["UpdateTime"] = nowTime;
        })

        SaveDocument(DB, COL, nodes, (res) => {
            ElMessage({
                message: "保存文档成功，版本" + version,
                center: true,
                duration: 2000,
            });
        });
    })

    // 3.Sqlserver更新文档相关信息
    axios.get(url_update_document_info, {
        params: {
            "DocumentID": documentID
        }
    }).then(function (res) {
        let data = res["data"];
        // console.log(data);
    })

    refresh()
}

/**
 * 回写全部数据(目前包括 数据标签节点、动态行节点的回写）
 * @param editor
 */
export function save_data(editor) {
    if (editor == null) return

    save_pdr_data(editor)       // 回写动态行数据
    saveDataSpan(editor)
}

/**
 * 需求文档初始化
 * @param projectID
 * @param callback
 */
export function SRS_init(projectID, callback) {
    axios.get(url_read_SRS_nodes, {
        params: {
            "ProjectID": projectID
        }
    }).then(function (res) {
        let data = res["data"]["value"];
        const nodes = []

        data.forEach((value) => {
            nodes.push({        // 添加header2节点
                type: "header" + ((value["NodePath"].length -1)/ 6 + 1),
                ObjectID: value["ObjectID"],
                children: [{text: value["ObjectName"] || " "}]
            })

            let content = getHtmlPlainText(value["Description"] || "")
            nodes.push({type: "paragraph", indent: '2em',children:[{text: content}]})
        })


        nodes.unshift({type: "header1", textAlign: "center", children: [{text: "需求文档"}]})

        if (callback) callback(nodes)
    })
}


/**
 * 需求文档保存
 * @param editor
 */
export function SRS_save(editor) {
    if (editor == null) return

    const params = getUrlParams()

    const documentID = params["DocumentID"] || NewID(32)
    if (documentID.indexOf("_SRS") === -1 && documentID.indexOf("_TC")) return

    // 0. 文档Header节点添加ObjectID(避免每次保存重复添加节点)
    const old_nodes = JSON.parse(JSON.stringify(editor.children))
    for (let i = 0; i < old_nodes.length; i++) {
        if (old_nodes[i].type.indexOf("header") > -1) {
            if (old_nodes[i]["ObjectID"] === undefined) {
                old_nodes[i]["ObjectID"] = NewID(32)
            }
        }
    }
    editor.selectAll()
    SlateTransforms.removeNodes(editor)
    SlateTransforms.insertNodes(editor, old_nodes)
    if (editor.children.length > 1) {
        Transforms.removeNodes(editor, {
            at: [0]
        })
    }

    const headerNodes = editor.getElemsByTypePrefix("header")     // 读取所有的header节点

    const nodes = []
    let count = 0
    let parentID = '.'
    let preNode = []
    for (let i = 0; i < headerNodes.length; i++) {
        const node = headerNodes[i]
        const _type = node["type"]
        const level = Number(_type.substring(6, 7))

        if (_type === "header1")
            continue
        else if (_type === "header2") {
            parentID = '.'
            preNode = []
        } else {
            for (let j = preNode.length - 1; j >= 0; j--) {
                if (preNode[j][1] < level) {
                    parentID = headerNodes[preNode[j][0]]["ObjectID"]
                    break
                }
            }
        }

        nodes.push({
            "Seq": count,
            "ObjectID": node["ObjectID"],
            "ObjectName": SlateNode.string(headerNodes[i]),
            "ParentID": parentID
        })
        count++
        preNode.push([i, level])
    }

    // 1. Project_SRS表中插入节点
    const param = new URLSearchParams()
    param.append("ProjectID", documentID.substring(0, documentID.length - 4))
    param.append("Nodes", JSON.stringify(nodes))
    axios.post(url_update_SRS_nodes, param).then(function (res) {
        // 2-1 测试用例保存
        TC_save(editor)

        // 2-2 文档保存(v1.0未加入还原数据标签的逻辑)
        base_save(editor)

    })
}

/**
 * 测试用例保存回写
 * @param editor
 */
export function TC_save(editor){
    if (editor == null) return

    const params = getUrlParams()

    const documentID = params["DocumentID"] || NewID(32)
    if (documentID.indexOf("_SRS") === -1 && documentID.indexOf("_TC")) return

    const nodes = editor.children
    const tc_list = []
    let testcase_seq = 1

    const header_index_list = []       // 标题节点的下标数组
    const header_ObjectID_list = []    // 标题节点的ObjectID数组
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i]
        if(node.type.indexOf("header") === -1 || node.type === "header1") continue

        header_index_list.push(i)
        header_ObjectID_list.push(node.ObjectID)
    }

    // 对文档中的所有测试用例节点进行遍历
    editor.selectAll()
    const nodeEntries = SlateEditor.nodes(editor, {
            match: (node) => {
                if (SlateElement.isElement(node)) {
                    if (node.type === 'testcase') {
                        return true
                    }
                }
                return false
        }
    })
    for (let nodeEntry of nodeEntries) {
        const [node, path] = nodeEntry
        let nodeRow = path[0]
        let parentHeaderNodeRow = -1

        for (let i = 0; i < header_index_list.length -1; i++) {
            if(header_index_list[i] <= nodeRow && header_index_list[i+1] > nodeRow){
                parentHeaderNodeRow = i
                break
            }
        }

        if(parentHeaderNodeRow > -1){
            const parentObjectID = header_ObjectID_list[parentHeaderNodeRow]
            const testcases = node.testcases

            for (let i = 0; i < testcases.length; i++) {
                let tc_node = testcases[i]
                tc_list.push({
                    Seq: testcase_seq++,
                    ObjectID: tc_node["ObjectID"],
                    ObjectName: tc_node["name"],
                    TestCaseType: tc_node["type"],
                    Preconditions: tc_node["precondition"],
                    ExpectedResults: tc_node["expected"],
                    SrsID: parentObjectID,
                    Description: tc_node["description"]
                })
            }

        }
    }

    editor.restoreSelection

    //  Project_TestCase表中插入节点
    const param = new URLSearchParams()
    param.append("ProjectID", documentID.substring(0, documentID.length - 4))
    param.append("Nodes", JSON.stringify(tc_list))

    axios.post(url_update_TC_nods, param).then(function (res) {
        // console.log(res)
    })
}

/**
 * 获取Header节点
 * @param editor
 */
export function getHeaderNodes(editor) {
    if (editor == null) return
    const nodes = editor.getElemsByTypePrefix("header")
    const result = []
    let count = 0
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        let cnt = SlateNode.string(node)
        let level = Number(node["type"].substring(6, 7))
        if (level === 1) continue
        for (let j = 0; j < level - 2; j++) {
            cnt = "\u00a0\u00a0\u00a0" + cnt
        }
        result.push({
            num: '' + count++,
            content: cnt,
            id: node["id"]
        })
    }
    return result
}

export function editor_init(editor, callback) {
    if (editor == null) return

    window.editor = editor // 将editor对象暴露给window 用于在Dialog中调用

    let url_args = getUrlParams() // 获取url中的参数

    // 自动打开文档
    if ("DocumentID" in url_args) {
        const documentID = url_args["DocumentID"]
        let nodes = []
        base_open({
            "DocumentID": documentID
        }, function (res) {   // res为此文档的所有版本的所有节点列表
            if (res.length === 0) {
                if (documentID.indexOf("_SRS") > -1) {
                    const projectID = documentID.substring(0, documentID.length - 4)
                    SRS_init(projectID, function (data) {
                        // 插入节点
                        Transforms.insertNodes(editor, data, {
                            at: [editor.children.length]
                        })
                        if (editor.children.length > 1) {
                            Transforms.removeNodes(editor, {
                                at: [0]
                            })
                        }
                    })
                }
            } else {
                let version = 1
                if ("Version" in url_args) {
                    version = parseInt(url_args["Version"])
                } else {
                    for (let i = 0; i < res.length; i++) {
                        if (res[i]["Version"] > version) {
                            version = res[i]["Version"]
                        }
                    }
                }
                res.forEach((item) => {
                    if (item["Version"] === version) {
                        delete item["Version"]
                        nodes.push(item)
                    }
                })

                // 插入节点
                Transforms.insertNodes(editor, nodes, {
                    at: [editor.children.length]
                })
                if (editor.children.length > 1) {
                    Transforms.removeNodes(editor, {
                        at: [0]
                    })
                }
            }
            if (callback) callback(res)
        })
    }
}




