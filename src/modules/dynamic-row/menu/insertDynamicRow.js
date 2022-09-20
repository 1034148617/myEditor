/**
 * @description  插入动态行按钮
 * @createTime 2022.09.20
 */

class InsertDynamicRow {
    constructor() {
        this.title = '插入动态行'
        this.iconSvg = '<svg t="1649309800118" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7235" width="200" height="200"><path d="M904 768H120c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-80c0-4.4-3.6-8-8-8zM878.7 160H145.3c-18.4 0-33.3 14.3-33.3 32v464c0 17.7 14.9 32 33.3 32h733.3c18.4 0 33.3-14.3 33.3-32V192c0.1-17.7-14.8-32-33.2-32zM360 616H184V456h176v160z m0-224H184V232h176v160z m240 224H424V456h176v160z m0-224H424V232h176v160z m240 224H664V456h176v160z m0-224H664V232h176v160z" p-id="7236"></path></svg>'
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
        if (window.insertDataSpanModal) {
            window.insertDataSpanModal({
                "model": "drow",
                "filter": ["20"]
            })
        }
    }
}

export default InsertDynamicRow
