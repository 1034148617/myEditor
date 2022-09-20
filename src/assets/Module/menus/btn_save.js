/**
 * @description  保存按钮
 * @createTime 2022.08.15
 */
import axios from 'axios'
import {Utils} from '../utils'
import {ElMessage} from 'element-plus'
import {DB, COL, SaveDocument, OpenDocument} from "../../../dmc/MongoConn"
import {SlateTransforms, SlateNode} from '@wangeditor/editor'
import {url_update_document_info, url_get_update_sql, url_update_data} from '@/assets/urls'

function SavePdrData(editor) {
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

export function SaveData(editor) {
    if (editor == null) return;

    SavePdrData(editor);        // 回写动态行数据
}

export function Save(editor) {
    // 0.获取节点内容和DocumentID
    let elem_nodes = JSON.parse(JSON.stringify(editor.children));  // 0.获取editor全部element node
    let index = elem_nodes.length;

    let args = Utils.getUrlParams();        // 从URL中获取DocumentID
    let documentID;
    if ("DocumentID" in args) {
        documentID = args["DocumentID"];
    } else {
        documentID = Utils.NewID(32);
        Utils.changeURL("DocumentID", documentID);
    }

    /************************* 1. 还原模板(回写数据另外处理)******************************/
        // 1-1 还原动态行模板
    let pdr_did = []
    let elem_nodes_filter_pdr = []
    elem_nodes.forEach(node => {
        if (node["type"] === "pdr" && node["isTemplate"] === false) {
            if (pdr_did.indexOf(node["Did"]) > -1) {
                return;
            } else {
                pdr_did.push(node["Did"]);
                const template = node["Template"];
                template.forEach(node => {
                    elem_nodes_filter_pdr.push(node);
                })
            }
        } else {
            elem_nodes_filter_pdr.push(node);
        }
    })
    elem_nodes = elem_nodes_filter_pdr;
    /********************************************************************************/

    // 2.对节点进行处理 添加RowID
    editor.clear();     // 清空旧的节点
    let RowID_list = [];

    for (let i = 0; i < elem_nodes.length; i++) {
        let node = elem_nodes[i];
        if ((!("RowID" in node)) || (("RowID" in node) && (RowID_list.indexOf(node["RowID"]) > -1)))
            node["RowID"] = Utils.NewID(32);
        RowID_list.push(node["RowID"]);
        SlateTransforms.insertNodes(editor, node, {
            at: [i]
        })
    }

    if (editor.children.length === index + 1) {                 // 删除多余行
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
                    version = item["Version"];
                }
            })
            version++;
        }


        let nowTime = Utils.getTime();
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

/**
 * @Description 保存文档按钮及按钮注册类
 */
class SaveMenu {
    constructor() {
        this.title = '保存'
        this.iconSvg = "<svg t=\"1648778092320\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"3282\" width=\"200\" height=\"200\"><path d=\"M85.312 85.312v853.376h853.376v-512L597.312 85.312h-512zM0 0h640l384 384v640H0V0z m170.688 512v341.312h170.624V512H170.688z m256 0v341.312h170.624V512H426.688z m256 0v341.312h170.624V512h-170.624z m-512-341.312v256h680.192l-253.568-256H170.688z\" fill=\"#262626\" p-id=\"3283\"></path></svg>"
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
        Save(editor);
    }
}

export const SaveConf = {
    key: 'menu-save',
    factory() {
        return new SaveMenu()
    },
}

/**
 * @Description 保存数据按钮及按钮注册类
 */
class SaveDataMenu {
    constructor() {
        this.title = '保存数据'
        this.iconSvg = '<svg t="1660890094376" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2128" width="200" height="200"><path d="M426.666667 128h-149.333334v234.453333c0 12.074667 9.450667 21.546667 21.205334 21.546667h298.922666c11.626667 0 21.205333-9.6 21.205334-21.546667V128h-64v149.504c0 23.466667-19.157333 42.496-42.624 42.496h-42.752A42.666667 42.666667 0 0 1 426.666667 277.504V128zM192 896V661.546667C192 602.474667 239.786667 554.666667 298.837333 554.666667h426.325334A106.709333 106.709333 0 0 1 832 661.546667V896h42.517333A21.312 21.312 0 0 0 896 874.752V273.664L750.336 128H704v234.453333c0 58.965333-47.701333 106.88-106.538667 106.88H298.538667A106.56 106.56 0 0 1 192 362.453333V128H149.248A21.269333 21.269333 0 0 0 128 149.482667v725.034666C128 886.421333 137.578667 896 149.482667 896H192zM42.666667 149.482667A106.602667 106.602667 0 0 1 149.248 42.666667H768a42.666667 42.666667 0 0 1 30.165333 12.501333l170.666667 170.666667A42.666667 42.666667 0 0 1 981.333333 256v618.752A106.645333 106.645333 0 0 1 874.517333 981.333333H149.482667A106.752 106.752 0 0 1 42.666667 874.517333V149.482667z m704 512.042666c0-12.010667-9.536-21.525333-21.504-21.525333H298.837333C286.933333 640 277.333333 649.6 277.333333 661.546667V896h469.333334V661.546667z" fill="#000000" p-id="2129"></path></svg>'
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
        SaveData(editor);
        ElMessage("数据回写成功");
    }
}

export const SaveDataConf = {
    key: 'menu-save-data',
    factory() {
        return new SaveDataMenu()
    },
}


