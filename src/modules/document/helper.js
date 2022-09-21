/**
 * @description document operations helper
 * @createTime 2022.09.20
 */

import {DB, COL, OpenDocument, SaveDocument} from "@/dmc/MongoConn"
import {changeURL, getTime, getUrlParams, NewID} from "@/utils/util";
import {SlateNode, SlateTransforms} from "@wangeditor/editor";
import {ElMessage} from "element-plus";
import axios from "axios";
import {url_get_update_sql, url_update_data, url_update_document_info} from "@/assets/urls";

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

export function open_documents(condition, callback) {
    OpenDocument(DB, COL, {'$or':condition}, {
        "_id": 0,
        "Version": 0,
        "DocumentID": 0,
        "UpdateTime": 0,
    }, (res) => {
        let data = res["data"]["result"];
        if (callback) callback(data);
    })
}

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

    /********************************************************************************/

    // 2.对节点进行处理 添加rid
    editor.clear();     // 清空旧的节点

    for (let i = 0; i < elem_nodes.length; i++) {
        let node = elem_nodes[i];
        if (!("rid" in node))
            node["rid"] = NewID(32);
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
                duration: 3000,
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
}

/************************************ 数据回写操作 ****************************************/

function save_pdr_data(editor){
    const nodes = JSON.parse(JSON.stringify(editor.children));

    let pdr_Did = [];

    nodes.forEach(node => {
        if (node["type"] === "pdr" && node["isTemplate"] === false && pdr_Did.indexOf(node["Did"]) === -1) {
            pdr_Did.push(node["Did"]);
        }
    });

    pdr_Did.forEach(Did => {
        nodes.forEach(node => {
            if (node["type"] === "pdr" && node["isTemplate"] === false && node["Did"] === Did) {
                let dataSource = node["DataSource"];
                let change_data_fields = [];

                if (dataSource === undefined) {
                    // 新数据
                } else {
                    for (let i = 0; i < node["children"].length; i++) {
                        if (node["children"][i]["type"] === "data") {
                            const pdr_data_node = node["children"][i];
                            const pdr_data_content = SlateNode.string(pdr_data_node);
                            if (pdr_data_node["value"] !== pdr_data_content &&
                                pdr_data_content !== "") {
                                dataSource[pdr_data_node["field"]] = pdr_data_content;
                                change_data_fields.push(pdr_data_node["field"]);
                            }
                        }
                    }

                    change_data_fields.forEach(field => {
                        const url_get_sql = url_get_update_sql + "?GroupID=" + node["group"] + "&FieldID=" + field;
                        axios.get(url_get_sql, {}).then(function (res) {
                            if (res["data"].length > 0) {
                                let update_sql = res["data"][0]["Sql"];
                                for (let key in dataSource) {
                                    let reg = new RegExp("{" + key + "}", "g");
                                    update_sql = update_sql.replace(reg, "'" + dataSource[key] + "'");
                                }
                                let params = new URLSearchParams();
                                params.append("Sql", update_sql);
                                axios.post(url_update_data, params);
                            }
                        });
                    })
                }
            }
        });
    });
}

export function save_data(editor){
    if(editor == null) return

    save_pdr_data(editor)       // 回写动态行数据
}



