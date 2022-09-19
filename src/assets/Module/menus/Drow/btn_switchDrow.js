/**
 * @description 渲染动态行
 * @createTime 2022.08.18
 */
import axios from 'axios'
import {Utils} from '../../utils'
import {Transforms} from 'slate'
import {SlateNode, SlateTransforms} from "@wangeditor/editor";
import {url_get_data} from "@/assets/urls";
import {ElMessage} from "element-plus";

/**
 * 根据数据渲染动态行
 * @param editor
 * @param DID 动态行ID
 * @param dataSource 数据源
 */
function getDrowNodes(editor, DID, dataSource) {
    let drow_nodes = []

    const template = editor.children.filter(item => {
        if (item["type"] === "pdr" && item["Did"] === DID) return true;
    })

    const groupID = template[0]["group"];

    for (let i = 0; i < dataSource.length; i++) {
        const ds = dataSource[i];
        let node_block = JSON.parse(JSON.stringify(template))
        node_block.forEach(node => {
            if ("RowID" in node)
                node["RowID"] = Utils.NewID(32);    // 文档行ID
            node["Rid"] = ds["RowID"];               // 动态行ID
            node["isTemplate"] = false;
            node["Template"] = template;
            node["DataSource"] = JSON.parse(JSON.stringify(ds));

            for (let j = 0; j < node.children.length; j++) {
                const split_node = node.children[j]
                if (split_node["type"] === "data" && split_node["group"] === groupID
                    && ds[split_node["field"]]) {
                    const value = ds[split_node["field"]];
                    node.children[j]["value"] = value;
                    node.children[j]["children"] = [{text: value}];
                }
            }
            drow_nodes.push(node);
        })
    }

    return drow_nodes;
}

export function renderDrow(editor) {
    if (editor == null) return;

    const {selection} = editor;
    if (selection == null) editor.restoreSelection();

    const row = selection["anchor"]["path"][0]
    const node = editor.children[row]

    if (node["type"] !== "pdr") return;

    if (node["isTemplate"]) {
        // 1.获取数据
        let params = new URLSearchParams();
        let env_args = Utils.getUrlParams();
        env_args["GroupID"] = node["group"];
        for (let key in env_args) {
            params.append(key, env_args[key]);
        }
        axios.post(url_get_data, params).then(function (res) {
            const data_source = res["data"];

            if(data_source.length > 0){

            // 2.渲染数据
            const nodes = getDrowNodes(editor, node["Did"], data_source);

            for (let i = editor.children.length - 1; i >= 0; i--) {
                const dnode = editor.children[i]
                if (dnode["type"] === "pdr" && dnode["Did"] === node["Did"]) {
                    //
                    Transforms.removeNodes(editor, {at: [i]})
                }
            }
            editor.deleteBackward();
            Transforms.insertNodes(editor, nodes);

            }else{
                ElMessage({
                    message: "数据源为空，请检查环境参数",
                    center: true,
                    duration: 3000,
                    type: "error",
                });
            }
        })
    } else {
        const template = JSON.parse(JSON.stringify(node["Template"]));
        // 切换回模板
        for (let i = editor.children.length - 1; i >= 0; i--) {
            const dnode = editor.children[i]
            if (dnode["type"] === "pdr" && dnode["Did"] === node["Did"]) {
                //
                Transforms.removeNodes(editor, {at: [i]})
            }
        }
        editor.deleteBackward();
        Transforms.insertNodes(editor, template);
    }
}

class SwitchDrow {
    constructor() {
        this.title = '切换'
        this.iconSvg = '<svg t="1660805377510" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2356" width="200" height="200"><path d="M872.1 197.6L684.4 72.5c-5.3-3.5-12.4 0.3-12.4 6.7V160H384C207.3 160 64 303.3 64 480v64c0 45.9 9.7 89.6 27.1 129 2 4.6 7.6 6.2 11.8 3.5l95.4-63.6c3-2 4.3-5.7 3.2-9.2-6.2-19-9.4-39.1-9.4-59.7v-64c0-51.3 20-99.5 56.2-135.8C284.5 308 332.7 288 384 288h288v81.3c0 6.4 7.1 10.2 12.4 6.7L872 250.9c19.1-12.7 19.1-40.6 0.1-53.3zM151.2 833.3l187.6 125.1c5.3 3.5 12.4-0.3 12.4-6.7v-80.8h288c176.7 0 320-143.3 320-320v-64c0-45.9-9.7-89.6-27.1-129-2-4.6-7.6-6.2-11.8-3.5L825 418c-3 2-4.3 5.7-3.2 9.2 6.2 19 9.4 39.1 9.4 59.7v64c0 51.3-20 99.5-56.2 135.8-36.3 36.3-84.5 56.2-135.8 56.2h-288v-81.3c0-6.4-7.1-10.2-12.4-6.7L151.2 780c-18.9 12.7-18.9 40.6 0 53.3z" p-id="2357"></path></svg>'
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
        renderDrow(editor)
    }
}

export const SwitchDrowConf = {
    key: 'menu-switch-drow',
    factory() {
        return new SwitchDrow()
    },
}


