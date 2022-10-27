<template>
  <div>
    <div style="border: 1px solid #ccc;">
      <Editor
          :defaultConfig="editorConfig"
          @onCreated="handleCreated"
          style="height: 300px"
      />
    </div>
    <div v-if="isCheck" style="margin-top:10px;text-align: right">
      <el-button @click="onConfirm">确定</el-button>
      <el-button @click="onCancel">取消</el-button>
    </div>
  </div>
</template>

<script setup>
import {Transforms} from "slate";
import {Editor} from "@wangeditor/editor-for-vue";
import {onBeforeUnmount, shallowRef, toRefs, defineProps, defineEmits} from "vue";
import {base_open} from "../modules/document/helper";
import {insertCheckBox, getCheckedNodes} from "../modules/checkbox/helper";

const editorRef = shallowRef()

const props = defineProps({
  template: Object,
  isCheck: Boolean
})

const {template,isCheck} = toRefs(props)

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
    let newNodes
    if(isCheck.value){
      // 插入多选框节点
      newNodes = insertCheckBox(res)
    }else{
      newNodes = res
    }

    Transforms.insertNodes(editor, newNodes, {
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

const emit = defineEmits(['hide', 'confirm'])
const onCancel = () => {
  emit('hide')
}

const onConfirm = () => {
  const editor = editorRef.value
  if (editor != null) {
    const info = {
      documentID: template.value["DocumentID"],
      version: template.value["useVersion"],
      result: getCheckedNodes(editor)
    }

    if (info.result.length > 0) {
      emit('confirm', info)
    }
  }

  emit("hide")
}

onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return

  // 销毁，并移除 editor
  editor.destroy()
})
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
