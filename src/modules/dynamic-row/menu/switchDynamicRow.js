/**
 * @description 切换动态行状态
 * @createTime 2022.09.20
 */
import {switchPdr} from "@/modules/dynamic-row/helper";

class SwitchDynamicRow {
    constructor() {
        this.title = '切换'
        this.iconSvg = '<svg t="1660805377510" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2356" width="200" height="200"><path d="M872.1 197.6L684.4 72.5c-5.3-3.5-12.4 0.3-12.4 6.7V160H384C207.3 160 64 303.3 64 480v64c0 45.9 9.7 89.6 27.1 129 2 4.6 7.6 6.2 11.8 3.5l95.4-63.6c3-2 4.3-5.7 3.2-9.2-6.2-19-9.4-39.1-9.4-59.7v-64c0-51.3 20-99.5 56.2-135.8C284.5 308 332.7 288 384 288h288v81.3c0 6.4 7.1 10.2 12.4 6.7L872 250.9c19.1-12.7 19.1-40.6 0.1-53.3zM151.2 833.3l187.6 125.1c5.3 3.5 12.4-0.3 12.4-6.7v-80.8h288c176.7 0 320-143.3 320-320v-64c0-45.9-9.7-89.6-27.1-129-2-4.6-7.6-6.2-11.8-3.5L825 418c-3 2-4.3 5.7-3.2 9.2 6.2 19 9.4 39.1 9.4 59.7v64c0 51.3-20 99.5-56.2 135.8-36.3 36.3-84.5 56.2-135.8 56.2h-288v-81.3c0-6.4-7.1-10.2-12.4-6.7L151.2 780c-18.9 12.7-18.9 40.6 0 53.3z" p-id="2357"></path></svg>'
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
        switchPdr(editor)
    }
}

export default SwitchDynamicRow