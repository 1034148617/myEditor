<template>
  <div>
    <ExtendEditor></ExtendEditor>

    <!-- 打开文档/模板对话框  -->
    <el-dialog v-model="isOpenDocumentModal" title="打开文档/模板" width="70%" center="center" :destroy-on-close="true">
      <OpenDocumentModal
          :key="new Date().getTime()"
          @hide="hideOpenDocumentComponent()"
      />
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
import ExtendEditor from './components/ExtendedEditor.vue'
import OpenDocumentModal from './components/OpenDocument.vue'
import InsertDataSpanModal from './components/InsertDataSpan.vue'

export default {
  name: 'App',
  components: {
    ExtendEditor,
    OpenDocumentModal,
    InsertDataSpanModal,
  },
  data() {
    return {
      isInit: true,     //编辑器初始化参数
      isOpenDocumentModal: false,   // 控制文档打开对话框打开与关闭
      isInsertDataSpanModal: false,   // 控制数据标签插入对话框打开与关闭
      dataModalArgs: {},      // 数据插入对话框配置参数
    }
  },
  methods: {
    openDocumentComponent() {
      this.isOpenDocumentModal = true
    },
    hideOpenDocumentComponent() {
      this.isOpenDocumentModal = false
    },
    insertDataSpanComponent(argument) {
      this.dataModalArgs = argument
      this.isInsertDataSpanModal = true
    },
    hideInsertDataSpanComponent() {
      this.isInsertDataSpanModal = false
    },
  },
  mounted() {
    window.openDocumentModal = this.openDocumentComponent;
    window.insertDataSpanModal = this.insertDataSpanComponent;
  }
}
</script>

<style>
</style>
