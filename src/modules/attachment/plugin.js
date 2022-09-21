/**
 * @description editor 插件，重写 editor API
 * @createTime 2022.09.21
 */
export function withAttachment(editor) {
    const { isInline, isVoid} = editor
    const newEditor = editor

    // 重写 isInline
    newEditor.isInline = elem => {
        const { type } = elem

        if (type === 'attachment') {
            return true
        }

        return isInline(elem)
    }

    // 重写 isVoid
    newEditor.isVoid = elem => {
        const { type } = elem

        if (type === 'attachment') {
            return true
        }

        return isVoid(elem)
    }

    // 返回 editor ，重要！
    return newEditor
}

