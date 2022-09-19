import { SlateElement } from '@wangeditor/editor'

/**
 * 生成dynamic row元素的 HTML
 * @param elem 元素
 * @param childrenHtml 子节点的 HTML 代码
 * @returns
 */
function pdrToHtml(elem, childrenHtml) {

    // 获取附件元素的数据
    const { field = '' } = elem

    // 生成 HTML 代码
    return`<div data-w-e-type="pdr" data-field="${field}">${childrenHtml}</div>`

}
export const pdrToHtmlConf = {
    type: 'pdr',
    elemToHtml: pdrToHtml,
}


