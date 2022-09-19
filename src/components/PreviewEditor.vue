<template>
  <div style="border: 1px solid #ccc;">
    <Editor
        :defaultConfig="editorConfig"
        @onCreated="handleCreated"
        style="height: 300px"
    />
  </div>
</template>

<script setup>
import {Editor} from "@wangeditor/editor-for-vue";
import {onBeforeUnmount, shallowRef, toRefs} from "vue";
import {base_open} from "@/assets/Module/menus/btn_open";
import {Transforms} from "slate";

const editorRef = shallowRef()

// eslint-disable-next-line no-undef
const props = defineProps({
  template: Object
})

const {template} = toRefs(props)

const editorConfig = {
  placeholder: '请输入内容...',
  autoFocus: true
}

const handleCreated = (editor) => {
  editorRef.value = editor

  const documentID = template.value["DocumentID"]
  const documentVersion = template.value["useVersion"]

  base_open({
    "DocumentID": documentID,
    "Version": documentVersion
  }, function (res) {   // res为此文档的所有版本的所有节点列表

    Transforms.insertNodes(editor, res, {
      at: [editor.children.length]
    })
    if (editor.children.length > 1) {
      Transforms.removeNodes(editor, {
        at: [0]
      })
    }
    editor.disable()
  })

}

onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return

  // 销毁，并移除 editor
  editor.destroy()
})
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
