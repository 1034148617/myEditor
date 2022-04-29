import { SlateDescendant, SlateElement, SlateText } from '@wangeditor/editor'
import { Text } from 'slate';

/**
 * @description 表格结构(表、行、单元格)
 */
export declare type MyTableElement = {
    type: 'ptab'
    children: MyTableRowElement[]
}
export declare type MyTableRowElement = {
    type: 'tab-row'
    children: MyTableCellElement[]
}
export declare type MyTableCellElement = {
    type: 'tab-cell'
    isHeader?: boolean
    colSpan?: number
    rowSpan?: number
    children: SlateDescendant[]
}
