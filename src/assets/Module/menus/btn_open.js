/**
 * @description  打开按钮
 * @createTime 2022.08.16
 */
import {Utils} from '../utils'
import {DB, COL, OpenDocument} from "../../../dmc/MongoConn"

export function base_open(condition, callback) {
    OpenDocument(DB, COL, condition, {
        "_id": 0,
        "DocumentID": 0,
        "UpdateTime": 0,
    }, (res) => {
        let data = res["data"]["result"];
        if (callback) callback(data);
    })
}

export function open_documents(condition, callback) {
    OpenDocument(DB, COL, {'$or':condition}, {
        "_id": 0,
        "Version": 0,
        "DocumentID": 0,
        "UpdateTime": 0,
    }, (res) => {
        let data = res["data"]["result"];
        if (callback) callback(data);
    })
}

class OpenMenu {
    constructor() {
        this.title = '打开'
        this.iconSvg = '<svg t="1648887567074" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2201" width="200" height="200"><path d="M928 444H820V330.4c0-17.7-14.3-32-32-32H473L355.7 186.2c-1.5-1.4-3.5-2.2-5.5-2.2H96c-17.7 0-32 14.3-32 32v592c0 17.7 14.3 32 32 32h698c13 0 24.8-7.9 29.7-20l134-332c1.5-3.8 2.3-7.9 2.3-12 0-17.7-14.3-32-32-32zM136 256h188.5l119.6 114.4H748V444H238c-13 0-24.8 7.9-29.7 20L136 643.2V256z m635.3 512H159l103.3-256h612.4L771.3 768z" p-id="2202"></path></svg>'
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
        if (window.openDocumentModal) {
            window.openDocumentModal()
        }
    }
}

export const OpenConf = {
    key: 'menu-open',
    factory() {
        return new OpenMenu()
    },
}



