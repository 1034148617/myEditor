/**
 * @description  清空按钮
 * @createTime 2022.08.16
 */
class ClearEditor {
    constructor() {
        this.title = '清空'
        this.iconSvg = "<svg t=\"1647312352525\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"2191\" width=\"200\" height=\"200\"><path d=\"M899.1 869.6l-53-305.6H864c14.4 0 26-11.6 26-26V346c0-14.4-11.6-26-26-26H618V138c0-14.4-11.6-26-26-26H432c-14.4 0-26 11.6-26 26v182H160c-14.4 0-26 11.6-26 26v192c0 14.4 11.6 26 26 26h17.9l-53 305.6c-0.3 1.5-0.4 3-0.4 4.4 0 14.4 11.6 26 26 26h723c1.5 0 3-0.1 4.4-0.4 14.2-2.4 23.7-15.9 21.2-30zM204 390h272V182h72v208h272v104H204V390z m468 440V674c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v156H416V674c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v156H202.8l45.1-260H776l45.1 260H672z\" p-id=\"2192\"></path></svg>"
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
        editor.clear()
        editor.history.undos = []
        //其他重置操作
        //
    }

}
export default ClearEditor
