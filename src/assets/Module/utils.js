import { SlateRange, SlateEditor, SlateTransforms, SlateElement } from '@wangeditor/editor'
import { DomEditor, IDomEditor } from '@wangeditor/editor'

/**
 * @description 通用方法
 * @createTime  2022.08.15
 * @author hong liu
 */

export class Utils {
    /**
     * @description 随机生成_id
     */
    static NewID(num) {
        num = num || 32;
        // let t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789",
        let t = "ABCDEFGHIJKLMNOPQRSTWUVXYZ123456789",
            a = t.length,
            n = "";
        for (let i = 0; i < num; i++) {
            n += t.charAt(Math.floor(Math.random() * a));
        }
        return n
    }

    /**
     * @description 获取url传递的所有参数
     */
    static getUrlParams() {
        let url = window.location.search;
        let theRequest = []
        if (url.indexOf("?") !== -1) {
            // 把问号去掉
            let str = url.substr(1);
            // 以&符分项组成数组
            let strs = str.split("&");
            // 循环数组
            for (let i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
            }
        }
        return theRequest
    }

    /**
     * @description 获取格式化时间
     */
    static getTime(mf) {
        Date.prototype.Format = function (fmt) {
            let o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "H+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                S: this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(
                    RegExp.$1,
                    (this.getFullYear() + "").substr(4 - RegExp.$1.length)
                );
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(
                        RegExp.$1,
                        RegExp.$1.length === 1
                            ? o[k]
                            : ("00" + o[k]).substr(("" + o[k]).length)
                    );
            return fmt;
        };

        mf = mf || "yyyy-MM-dd HH:mm:ss";

        return new Date().Format(mf);
    }

    /**
     * @description 修改 URL 参数
     */
    static changeURLParam(url, name, value) {
        let reg = eval('/([?|&]' + name + '=)[^&]*/gi');
        value = value.toString().replace(/(^\s*)|(\s*$)/g, ""); // 移除首尾空格
        let url2;
        if (!value) { // remove
            url2 = url.replace(reg, '');
        } else {
            if (url.match(reg)) { // edit
                url2 = url.replace(reg, '$1' + value);
            } else { // add
                url2 = url + (url.indexOf('?') > -1 ? '&' : '?') + name + '=' + value;
            }
        }
        return url2;
    }

    /**
     * @description 修改地址栏 URL参数 不跳转
     */
    static changeURL(name, value) {
        let url = this.changeURLParam(location.href, name, value); // 修改 URL 参数
        history.replaceState(null, null, url);  // 替换地址栏
    }

    static getBeforeText(editor){
        const { selection } = editor
        if (selection == null) return { beforeText: '', range: null }
        const { anchor } = selection
        // 找到当前文本上面的 block 元素，如 header1 paragraph
        const block = SlateEditor.above(editor, {
            match: n => SlateEditor.isBlock(editor, n),
        })
        if (block == null) return { beforeText: '', range: null }
        const blockPath = block[1]
        const blockStart = SlateEditor.start(editor, blockPath) // block 元素的起始位置，就第一个文字的位置
        const range = { anchor, focus: blockStart }
        const beforeText = SlateEditor.string(editor, range) || ''
        return { beforeText, range }
    }

    static getNodeRow(editor){
        const { selection } = editor;
        if(selection == null) return null;
        return selection["anchor"]["path"][0];
    }


}




