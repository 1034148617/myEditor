<template>
  <div>
    <el-table ref="multipleTableRef" :data="templateList" style="width: 100%" height="350px" :key="tableKey">
      <el-table-column type="index"/>
      <el-table-column prop="DocumentName" label="文档名" width="140"/>
      <el-table-column prop="DocumentType" label="文档类型" width="80"/>
      <el-table-column prop="Creator" label="创建者" width="90"/>
      <el-table-column prop="isTemplate" label="是否为模板" width="75"/>
      <el-table-column prop="latestVersion" label="全部版本" width="60"/>
      <el-table-column label="选中版本" width="200">
        <template #default="version">
          <el-input-number v-model="version.row.useVersion" :min="1" @change="onVersionChange(version.row)"
                           :disabled="version.row.latestVersion===1"/>
        </template>
      </el-table-column>
      <el-table-column prop="chooseNodesNum" label="已选节点" width="50" sortable />
      <el-table-column label="操作" width="100">
        <template #default="scoped">
          <el-button type="info" @click="onPreview(scoped.row)">选择</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin-top:10px;text-align: right">
      <el-button @click="onConfirm">确定</el-button>
      <el-button @click="onCancel">取消</el-button>
    </div>

    <el-dialog v-model="PreviewDialogVisible" :title="template.DocumentName" width="60%" :destroy-on-close="true">
      <PreviewEditor
          :key="new Date().getTime()"
          :template="template"
          :isCheck="true"
          @hide="hidePreviewEditor"
          @confirm="chooseNewNodes"
      />
    </el-dialog>

  </div>
</template>

<script>
import axios from "axios";
import {SlateTransforms} from '@wangeditor/editor'
import {url_open_document_info} from '@/assets/urls';
import PreviewEditor from './PreviewEditor.vue';
import {new_Document} from '@/modules/document/helper'


export default {
  name: "Modal",
  props: {},
  components: {
    PreviewEditor,
  },
  data() {
    return {
      tableKey: Math.random(),
      templateList: [], // 加载所有模板信息
      typeList: [],     // 文档类型，用于筛选
      creatorList: [],  // 创建者列表，用于筛选
      isAjaxDown: false,
      PreviewDialogVisible: false, // 控制是否显示对话框
      template: [], // 用于预览时传递参数信息
      changeList: [], // 选中的列表
    }
  },
  methods: {
    onCancel() {
      this.$emit("hide");
    },
    onConfirm() {
      if (this.changeList.length > 0) {
        this.$refs.multipleTableRef.clearSelection();
        this.onCancel();
        new_Document(this.changeList)
      }

    },
    onVersionChange(value) {
      if (value.useVersion > value.latestVersion) {
        this.templateList.forEach((v, index) => {
          if (value.DocumentID === v.DocumentID) {
            v.useVersion = 1;
            this.templateList[index] = v;
          }
        });
      }
    },
    onPreview(value) {
      this.template = JSON.parse(JSON.stringify(value));
      this.PreviewDialogVisible = true;
    },
    hidePreviewEditor(){
      this.PreviewDialogVisible = false;
    },
    chooseNewNodes(info){
      this.changeList.push(info)

      for (let i = 0; i < this.templateList.length; i++) {
        if(this.templateList[i]["DocumentID"] === info["documentID"]){
          this.templateList[i]["chooseNodesNum"] += info["result"].length
          break
        }
      }
      this.tableKey = Math.random()
    },
  },
  mounted() {
    let modal = this;
    axios.get(url_open_document_info, {
      params: {
        SqlWhere: "isPublic=1"
      }
    }).then(function (result) {
      let datas = result.data;
      let typeList = []
      let creatorList = []
      for (let i = 0; i < datas.length; i++) {
        datas[i]["useVersion"] = parseInt(datas[i]["useVersion"]);
        datas[i]["latestVersion"] = parseInt(datas[i]["latestVersion"]);
        typeList.push(datas[i]["DocumentType"])
        creatorList.push(datas[i]["Creator"])
      }

      modal.templateList = result.data;

      for (let i = 0; i < modal.templateList.length; i++) {
        modal.templateList[i]["chooseNodesNum"] = 0;
      }

      modal.typeList = Array.from(new Set(typeList))

      modal.creatorList = Array.from(new Set(creatorList))

      modal.isAjaxDown = true;

    });
  }
  ,
}
;

</script>
