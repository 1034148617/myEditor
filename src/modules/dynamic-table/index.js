import { renderDynamicTableConf, renderDynamicTableRowConf, renderDynamicTableCellConf } from "./render-elem/index";
import {
    InsertDynamicTableMenuConf,
    DeleteTableMenuConf,
    InsertRowMenuConf, 
    InsertColMenuConf,
    DeleteRowMenuConf,
    DeleteColMenuConf,
    MergeCellMenuConf
} from "./menu";
import { withDynamicTable } from "./plugin";

const dynamicTableModule = {
    menus: [
        InsertDynamicTableMenuConf,
        DeleteTableMenuConf,
        InsertRowMenuConf,
        InsertColMenuConf,
        DeleteRowMenuConf,
        DeleteColMenuConf,
        MergeCellMenuConf,
    ],
    editorPlugin: withDynamicTable,
    renderElems: [renderDynamicTableConf, renderDynamicTableRowConf, renderDynamicTableCellConf]
}

export default dynamicTableModule