import InsertDynamicTable from './insertTable'
import DeleteTable from "./deleteTable";
import InsertRow from "./insertRow";
import InsertCol from "./insertCol";
import DeleteRow from "./deleteRow";
import DeleteCol from "./deleteCol";
import MergeCell from "./mergeCell";


export const InsertDynamicTableMenuConf = {
    key: 'insertPTable',
    factory() {
        return new InsertDynamicTable()
    },
}

export const DeleteTableMenuConf = {
    key: 'deletePTable',
    factory() {
        return new DeleteTable()
    },
}

export const InsertRowMenuConf = {
    key: 'insertPRow',
    factory() {
        return new InsertRow()
    },
}

export const InsertColMenuConf = {
    key: 'insertPCol',
    factory() {
        return new InsertCol()
    },
}

export const DeleteRowMenuConf = {
    key: 'deletePRow',
    factory() {
        return new DeleteRow()
    },
}

export const DeleteColMenuConf = {
    key: 'deletePCol',
    factory() {
        return new DeleteCol()
    },
}

export const MergeCellMenuConf = {
    key: 'mergeCell',
    factory() {
        return new MergeCell()
    },
}