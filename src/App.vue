<template>
  <div>
    <el-row>
      <el-col :span="menuSpan" v-if="isSideBar">
        <!--   侧边栏   -->
        <el-scrollbar height="620px">
          <el-menu @open="handleOpen">
            <el-submenu index="1">
              <template #title>
                <el-icon><Menu /></el-icon>
                <span> 大纲</span>
              </template>
              <el-menu-item v-for="node in catalogNodes" :index="node.num" :key="node" @click="titleJump(node)" style="height: 30px;line-height: 30px;">
                {{ node.content }}
              </el-menu-item>
            </el-submenu>
            <el-submenu index="2">
              <template #title>
                <el-icon><InfoFilled /></el-icon>
                <span> 文档信息</span>
              </template>
              <el-descriptions :column="1" style="margin-left:20px;margin-right:20px;" :border="true" size="small">
                <el-descriptions-item label="文档名称">{{ documentInfo.DocumentName }}</el-descriptions-item>
                <el-descriptions-item label="文档类型">{{ documentInfo.DocumentType }}</el-descriptions-item>
                <el-descriptions-item label="最新版本">{{ documentInfo.latestVersion }}</el-descriptions-item>
                <el-descriptions-item label="当前版本">{{ documentInfo.useVersion }}</el-descriptions-item>
                <el-descriptions-item label="更新时间">{{ documentInfo.UpdateTime }}</el-descriptions-item>
              </el-descriptions>
            </el-submenu>
          </el-menu>
        </el-scrollbar>
      </el-col>
      <el-col :span="editorSpan">
        <!--   编辑器主体     ？-->
        <ExtendEditor></ExtendEditor>
      </el-col>
    </el-row>

    <!-- 通用对话框组件   -->
    <el-dialog v-model="isDialog" :title="dialogTitle" width="70%" center="center" :destroy-on-close="true">
      <component :is="dialogModel" :key="new Date().getTime()" @hide="hideDialogModel()"/>
    </el-dialog>

    <!-- 选择数据标签对话框  -->
    <el-dialog v-model="isInsertDataSpanModal" title="选择数据标签" width="55%" center="center" :destroy-on-close="true">
      <InsertDataSpanModal
          :key="new Date().getTime()"
          :config="dataModalArgs"
          @hide="hideInsertDataSpanComponent()"
      />
    </el-dialog>

  </div>
</template>

<script>
import axios from "axios";
import ExtendEditor from './components/ExtendedEditor.vue'
import OpenDocumentModal from './components/OpenDocument.vue'
import InsertDataSpanModal from './components/InsertDataSpan.vue'
import InsertTableModal from './components/InsertTable.vue'
import ConcatDocumentModal from './components/ConcatDocument.vue'
import TestCaseConfigModal from "./components/TestCaseConfig.vue";
import {getHeaderNodes} from "./modules/document/helper";
import {url_read_document_info} from "./assets/urls";
import {getUrlParams} from "./utils/util";

export default {
  name: 'App',
  components: {
    ExtendEditor,
    OpenDocumentModal,
    InsertDataSpanModal,
    InsertTableModal,
    ConcatDocumentModal,
    TestCaseConfigModal
  },
  data() {
    return {
      isInit: true,     //编辑器初始化参数
      // 侧边栏相关参数
      menuSpan: 5,
      editorSpan: 19,
      isSideBar: true,
      catalogNodes: [],     // 目录节点
      documentInfo: [], // 文档信息节点
      // 对话框控制参数
      isDialog: false,
      dialogModel: "",
      dialogTitle: "",
      isInsertDataSpanModal: false,       // 控制数据标签插入对话框打开与关闭
      dataModalArgs: {},      // 数据插入对话框配置参数
    }
  },
  methods: {
    openDialogModel(model, title) {
      this.dialogTitle = title
      this.dialogModel = model
      this.isDialog = true
    },
    hideDialogModel() {
      this.isDialog = false;
    },
    insertDataSpanComponent(argument) {
      this.dataModalArgs = argument
      this.isInsertDataSpanModal = true
    },
    hideInsertDataSpanComponent() {
      this.isInsertDataSpanModal = false
    },
    switchSideBar(){
      this.isSideBar = !this.isSideBar
      if(this.menuSpan === 5){
        this.menuSpan = 0
        this.editorSpan = 24
      }else{
        this.menuSpan = 5
        this.editorSpan = 19
      }
    },
    handleOpen(key, keyPath){
      if(key === '1'){
        this.catalogNodes = getHeaderNodes(window.editor)
        // console.log(this.catalogNodes)
      }else if(key === "2"){
        let m = this
        let params =  getUrlParams()
        if("DocumentID" in params){
          axios.get(url_read_document_info + "?DocumentID=" +params["DocumentID"],{}).then(function(res){
            m.documentInfo = res.data[0]
            // console.log(m.documentInfo)
          })
        }
      }
    },
    titleJump(node){
      const editor = window.editor
      if(editor == null) return
      editor.scrollToElem(node["id"])
    }
  },
  mounted() {
    window.openDialogModel = this.openDialogModel;    // 普通js文件内通过window变量调用dialog
    window.insertDataSpanModal = this.insertDataSpanComponent;
    window.switchSideBar = this.switchSideBar;
  }
}
</script>

<style>
</style>
