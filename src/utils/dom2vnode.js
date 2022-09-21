import { h } from 'snabbdom'

/**
 利用递归 来遍历DOM元素 生成虚拟DOM
 Vue中的源码使用 栈结构  ，使用栈存储 父元素来实现递归生成
 */
export function getVNode( node ){
    let nodeType = node.nodeType;
    let _vnode = null;

    if( nodeType === 1){
        // 元素
        let nodeName = node.nodeName;//元素名 什么标签？
        let attrs = node.attributes;//属性  伪数组 元素上的属性
        let _attrObj = {};

        for(let i=0;i<attrs.length;i++){//attrs[ i ] 属性节点（nodeType == 2) 是对象
            _attrObj[ attrs[ i ].nodeName ] = attrs[ i ].nodeValue;//attrs[ i ].nodeName:属性名 attrs[ i ].nodeValue：属性值
        }
        _vnode = {
            "sel": nodeName,
            "data": _attrObj,
            "children": []
        }

        // 考虑node的子元素
        let childNodes = node.childNodes;
        for(let i = 0;i<childNodes.length;i++){
            _vnode.children.push( getVNode( childNodes[ i ] ) );//递归
        }
    }else if(  nodeType === 3 ){
        // 文本节点
        _vnode = {
            "sel": undefined,
            "data": undefined,
            "children": []
        }
    }
    return _vnode;
}

/**
 * 将从dom 得到的vnode转换成 snabbdom里的 vnode
 */
export function transformVNode( vnode ){
    if(vnode.children.length === 0){
        return h(
            vnode.sel,
            vnode.data,
            []
        )
    }else{
        let _children = []
        for(let i=0;i<vnode.children.length;i++){
            _children.push( transformVNode(vnode.children[i]))
        }
        return h(
            vnode.sel,
            vnode.data,
            _children
        )
    }
}