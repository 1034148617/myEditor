/**
 * @description  插入数据标签按钮
 * @createTime 2022.08.16
 */
import {insertDataSpanExec} from "../helper";

class InsertDataHolder {
    constructor() {
        this.title = '插入数据标签'
        this.iconSvg = '<svg t="1649210359029" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2342" width="200" height="200"><path d="M469.333333 151.808v64.554667c-144.746667 20.693333-256 145.173333-256 295.637333 0 164.949333 133.717333 298.666667 298.666667 298.666667 150.464 0 274.944-111.253333 295.637333-256h64.554667c-21.12 180.181333-174.336 320-360.192 320-200.298667 0-362.666667-162.368-362.666667-362.666667 0-185.856 139.818667-339.072 320-360.192zM512 149.333333c197.973333 0 358.933333 158.656 362.602667 355.776L874.666667 512H512V149.333333z m64 70.869334V448h227.797333a299.093333 299.093333 0 0 0-220.885333-226.197333L576 220.202667z" p-id="2343"></path></svg>'
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
        insertDataSpanExec(editor)
    }
}

export default InsertDataHolder



