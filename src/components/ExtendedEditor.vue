<template>
  <div style="border: 1px solid #ccc">
    <!-- 工具栏 -->
    <Toolbar
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        style="border-bottom: 1px solid #ccc"
    />
    <!-- 编辑器 -->
    <Editor
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        @onChange="handleChange"
        @onCreated="handleCreated"
        @onDestroyed="handleDestroyed"
        @onFocus="handleFocus"
        @onBlur="handleBlur"
        @customAlert="customAlert"
        @customPaste="customPaste"
        style="height: 500px"
    />
  </div>
</template>

<script setup>
import {onBeforeUnmount, ref, shallowRef} from 'vue'
import {Transforms} from 'slate'
import {Boot} from '@wangeditor/editor'
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
import {getUrlParams} from '@/utils/util'
import {base_open} from '@/modules/document/helper'
import {url_photo_upload} from '@/assets/urls'
import '../modules/index'


/***************************************编辑器设置*****************************************/
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('')

// 编辑器配置
const editorConfig = {
  placeholder: '请输入内容...',
  autoFocus: true,
  MENU_CONF: {
    uploadImage: {
      // 配置接受图片的接口
      server: url_photo_upload,
    },
  },
}

// 工具栏配置
const toolbarConfig = {
  excludeKeys: [
    /* 隐藏哪些菜单 */ "emotion",
    "group-video",
    // "insertTable",
  ],
  insertKeys: {
    index: 32,
    keys: [
      'clearEditor',
      'openDocument',
      'saveDocument',
      'saveData',
      'insertDataHolder',
      {
        key: "group-rows-operate",
        title: "多行操作",
        iconSvg:
            '<svg t="1649390139943" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="43249" width="200" height="200"><path d="M993.622303 209.223676l-460.79999-204.799996a51.199999 51.199999 0 0 0-41.59488 0l-460.79999 204.799996a51.199999 51.199999 0 0 0 0 93.593598l460.79999 204.799996a51.384319 51.384319 0 0 0 41.59488 0l460.79999-204.799996a51.199999 51.199999 0 0 0 0-93.593598z" p-id="43250"></path><path d="M512.035113 767.999985a51.199999 51.199999 0 0 1-20.7872-4.4032l-460.79999-204.799996a51.210239 51.210239 0 0 1 41.594879-93.593598L512.035113 660.766707l439.992311-195.543036a51.210239 51.210239 0 0 1 41.594879 93.593598l-460.79999 204.799996A51.199999 51.199999 0 0 1 512.035113 767.999985z" p-id="43251"></path><path d="M512.035113 1023.99998a51.199999 51.199999 0 0 1-20.7872-4.4032l-460.79999-204.799996a51.210239 51.210239 0 0 1 41.594879-93.593598L512.035113 916.766702l439.992311-195.543036a51.210239 51.210239 0 0 1 41.594879 93.593598l-460.79999 204.799996A51.199999 51.199999 0 0 1 512.035113 1023.99998z" p-id="43252"></path></svg>',
        menuKeys: [
          'insertDynamicRow', 'switchDynamicRow', 'cancelDynamicRow'
        ],
      },
      // {
      //   key: "group-MyTable-operate",
      //   title: "表格操作",
      //   iconSvg:
      //       '<svg t="1649987024247" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2569" width="200" height="200"><path d="M568.6 0h454.9v454.9H568.6V0z m0 568.6h454.9v454.9H568.6V568.6zM0 568.6h454.9v454.9H0V568.6zM0 0h454.9v454.9H0V0z" p-id="2570"></path></svg>',
      //   menuKeys: ["menu-insert-ptable"],
      // },
      {
        key: "group-attachment-operate",
        title: "附件操作",
        iconSvg:
            '<svg t="1663738693419" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1374" width="200" height="200"><path d="M145.6 0C100.8 0 64 35.2 64 80v862.4C64 987.2 100.8 1024 145.6 1024h732.8c44.8 0 81.6-36.8 81.6-81.6V324.8L657.6 0h-512z" fill="#8199AF" p-id="1375"></path><path d="M960 326.4v16H755.2s-100.8-20.8-99.2-108.8c0 0 4.8 92.8 97.6 92.8H960z" fill="#617F9B" p-id="1376"></path><path d="M657.6 0v233.6c0 25.6 17.6 92.8 97.6 92.8H960L657.6 0z" fill="#FFFFFF" opacity=".5" p-id="1377"></path><path d="M489.6 664c17.6-19.2 17.6-48 0-67.2s-48-17.6-65.6 0l-147.2 147.2c-17.6 17.6-17.6 48 0 65.6s48 19.2 65.6 0l91.2-89.6c4.8-4.8 4.8-12.8 0-17.6s-14.4-6.4-19.2 0l-57.6 56c-8 8-19.2 8-27.2 0s-8-20.8 0-28.8l56-56c20.8-20.8 54.4-20.8 75.2 0 20.8 20.8 20.8 54.4 0 75.2l-89.6 89.6c-33.6 33.6-88 33.6-123.2 0-33.6-33.6-33.6-88 0-121.6l147.2-147.2c33.6-33.6 89.6-33.6 123.2 0 33.6 33.6 33.6 88 0 121.6l-14.4 14.4c-1.6-14.4-6.4-28.8-16-41.6h1.6z" fill="#FFFFFF" p-id="1378"></path></svg>',
        menuKeys: ["insertAttachment"],
      },
    ]
  }
}

// 及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return

  // 销毁，并移除 editor
  editor.destroy()
})
/************************************编辑器回调函数****************************************/
const handleCreated = (editor) => {

  editorRef.value = editor // 记录 editor 实例，重要！

  window.editor = editor // 将editor对象暴露给window 用于在Dialog中调用

  let url_args = getUrlParams() // 获取url中的参数

  // 自动打开文档
  if ("DocumentID" in url_args) {
    base_open({
      "DocumentID": url_args["DocumentID"]
    }, function (res) {   // res为此文档的所有版本的所有节点列表
      let nodes = []
      let version = 1
      if ("Version" in url_args) {
        version = parseInt(url_args["Version"])
      } else {
        for (let i = 0; i < res.length; i++) {
          if (res[i]["Version"] > version) {
            version = res[i]["Version"]
          }
        }
      }
      res.forEach((item) => {
        if (item["Version"] === version) {
          delete item["Version"]
          nodes.push(item)
        }
      })

      // 插入节点
      Transforms.insertNodes(editor, nodes, {
        at: [editor.children.length]
      })
      if (editor.children.length > 1) {
        Transforms.removeNodes(editor, {
          at: [0]
        })
      }

      /********************************* 还原模板 ***********************************/


    })
  }

  // 加载参数

}
const handleChange = (editor) => {
  // 内容发生改变事件
}
const handleDestroyed = (editor) => {
  // 编辑器销毁事件
}
const handleFocus = (editor) => {
  // 编辑器聚焦事件
}
const handleBlur = (editor) => {
  // 失去焦点事件
}
const customAlert = (info, type) => {
  // 自定义弹出框
  alert("编辑器提示:" + info);
}
const customPaste = (editor, event, callback) => {
  // 自定义插入内容
  // editor.insertText('xxx')

  // 返回值（注意，vue 事件的返回值，不能用 return）
  callback(true) // 返回 false ，阻止默认粘贴行为
}
</script>


<style src="@wangeditor/editor/dist/css/style.css"></style>
