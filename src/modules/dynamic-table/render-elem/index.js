import renderDynamicTable from "./render-table";
import renderDynamicTableRow from "./render-table-row";
import renderDynamicTableCell from "./render-table-cell";

export const renderDynamicTableConf = {
    type: 'ptable',
    renderElem: renderDynamicTable,
}

export const renderDynamicTableRowConf = {
    type: 'ptable-row',
    renderElem: renderDynamicTableRow,
}

export const renderDynamicTableCellConf = {
    type: 'ptable-cell',
    renderElem: renderDynamicTableCell,
}