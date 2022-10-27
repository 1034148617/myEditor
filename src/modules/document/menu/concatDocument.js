/**
 * @description  打开按钮
 * @createTime 2022.10.09
 */
class ConcatMenu {
    constructor() {
        this.title = '新建'
        this.iconSvg = '<svg t="1665276928365" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2133" width="200" height="200"><path d="M768 131.2 259.2 131.2c-54.4 0-96 41.6-96 96L163.2 864c0 54.4 41.6 96 96 96 6.4 0 12.8-3.2 16-3.2l236.8-147.2 240 147.2c6.4 3.2 9.6 3.2 16 3.2 54.4 0 96-41.6 96-96L864 227.2C864 172.8 822.4 131.2 768 131.2zM672 640 352 640c-19.2 0-32-12.8-32-32s12.8-32 32-32l320 0c19.2 0 32 12.8 32 32S691.2 640 672 640zM672 512 352 512c-19.2 0-32-12.8-32-32s12.8-32 32-32l320 0c19.2 0 32 12.8 32 32S691.2 512 672 512zM672 384 352 384c-19.2 0-32-12.8-32-32s12.8-32 32-32l320 0c19.2 0 32 12.8 32 32S691.2 384 672 384z" p-id="2134"></path></svg>'
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
        if (window.openDialogModel) {
            window.openDialogModel("ConcatDocumentModal", "拼接文档/模板")
        }
    }
}

export default ConcatMenu