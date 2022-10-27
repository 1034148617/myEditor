/**
 * @description  打开/隐藏侧边栏
 * @createTime 2022.08.15
 */

class SwitchSideBar {
    constructor() {
        this.title = '打开/关闭侧边栏'
        this.iconSvg = "<svg t=\"1665968176986\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"2269\" width=\"200\" height=\"200\"><path d=\"M987.7 86.8H367.3c-20.1 0-36.3 11-36.3 24.7v178.1c0 13.7 16.2 24.7 36.3 24.7h620.4c20.1 0 36.3-11 36.3-24.7v-178c0-13.8-16.2-24.8-36.3-24.8zM987.7 398.2H367.3c-20.1 0-36.3 11-36.3 24.7V601c0 13.7 16.2 24.7 36.3 24.7h620.4c20.1 0 36.3-11 36.3-24.7V423c0-13.7-16.2-24.8-36.3-24.8zM987.7 709.7H367.3c-20.1 0-36.3 11-36.3 24.7v178.1c0 13.7 16.2 24.7 36.3 24.7h620.4c20.1 0 36.3-11 36.3-24.7V734.4c0-13.7-16.2-24.7-36.3-24.7zM209.6 276.7L9.9 500.9c-5.6 6.3-5.6 15.9 0 22.2l199.7 224.2c10.2 11.4 29.1 4.2 29.1-11.1V287.8c0-15.3-18.9-22.6-29.1-11.1z\" p-id=\"2270\"></path></svg>"
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
        if (window.switchSideBar) {
            window.switchSideBar()
        }
    }
}

export default SwitchSideBar