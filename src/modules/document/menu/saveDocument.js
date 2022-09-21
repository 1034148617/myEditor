/**
 * @description  保存按钮
 * @createTime 2022.08.15
 */
import {base_save} from "../helper";

class SaveMenu {
    constructor() {
        this.title = '保存'
        this.iconSvg = "<svg t=\"1648778092320\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"3282\" width=\"200\" height=\"200\"><path d=\"M85.312 85.312v853.376h853.376v-512L597.312 85.312h-512zM0 0h640l384 384v640H0V0z m170.688 512v341.312h170.624V512H170.688z m256 0v341.312h170.624V512H426.688z m256 0v341.312h170.624V512h-170.624z m-512-341.312v256h680.192l-253.568-256H170.688z\" fill=\"#262626\" p-id=\"3283\"></path></svg>"
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
        base_save(editor);
    }
}

export default SaveMenu