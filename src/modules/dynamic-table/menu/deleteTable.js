/**
 * @description  删除表格
 * @createTime 2022.09.27
 */
import {deleteTable} from '../helper'

class DeleteTable {
    constructor() {
        this.title = '删除表格'
        this.iconSvg = '<svg t="1664244837253" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2141" width="200" height="200"><path d="M341.312 85.312l64-85.312h213.376l64 85.312H960v85.376H64V85.312h277.312zM170.688 256h682.624v768H170.688V256zM256 341.312v597.376h512V341.312H256z m213.312 85.376v426.624H384V426.688h85.312z m170.688 0v426.624H554.688V426.688H640z" fill="#262626" p-id="2142"></path></svg>'
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
        deleteTable(editor)
    }
}

export default DeleteTable



