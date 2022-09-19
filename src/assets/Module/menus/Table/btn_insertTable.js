/**
 * @description  插入表格
 * @createTime 2022.08.16
 */
class InsertTable {
    constructor() {
        this.title = '插入表格'
        this.iconSvg = '<svg t="1649987159259" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2704" width="200" height="200"><path d="M896 192H128c-35.2 0-64 28.8-64 64v512c0 35.2 28.8 64 64 64h768c35.2 0 64-28.8 64-64V256c0-35.2-28.8-64-64-64zM384 608v-96h256v96h-256z m256 64v96h-256v-96h256zM128 512h192v96H128v-96z m576-160h192v96h-192v-96z m-64 96h-256v-96h256v96z m-320-96v96H128v-96h192z m384 160h192v96h-192v-96zM128 672h192v96H128v-96z m576 96v-96h192v96h-192z" p-id="2705"></path></svg>'
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
        console.log("插入表格")
    }
}

export const InsertTableConf = {
    key: 'menu-insert-ptable',
    factory() {
        return new InsertTable()
    },
}