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
import {Utils} from '@/assets/Module/utils'
import {base_open} from '@/assets/Module/menus/btn_open'
import {url_photo_upload} from '@/assets/urls'
import '../assets/Module/index'
import {renderDrow} from "@/assets/Module/menus/Drow/btn_switchDrow";
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
      'menu-clear',
      'menu-save',
      'menu-save-data',
      'menu-open',
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
      {
        key: "group-MyTable-operate",
        title: "表格操作",
        iconSvg:
            '<svg t="1649987024247" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2569" width="200" height="200"><path d="M568.6 0h454.9v454.9H568.6V0z m0 568.6h454.9v454.9H568.6V568.6zM0 568.6h454.9v454.9H0V568.6zM0 0h454.9v454.9H0V0z" p-id="2570"></path></svg>',
        menuKeys: ["menu-insert-ptable"],
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

  let url_args = Utils.getUrlParams() // 获取url中的参数

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
      // 1.还原pdr
      for (let i = editor.children.length - 1; i >= 0; i--) {
        const node = editor.children[i];
        if (node["type"] === "pdr" && node["isTemplate"] === true) {
          editor.select({
            anchor: {path: [i, 0], offset: 0},
            focus: {path: [i, 0], offset: 0}
          });
          renderDrow(editor);
        }
      }


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
