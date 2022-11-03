<template>
  <div>
    <el-row>
      <el-col :span="20">
        <el-upload
            class="upload-file"
            drag
            action="#"
            :multiple="false"
            :show-file-list="true"
            :http-request="uploadHttpRequest"
            :file-list="fileList"
            :on-change="handleUploadChange"
        >
          <i class="el-icon-upload"></i>
          <div>将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </el-col>
      <el-col :span="4">
        <div>
          <el-button @click="onConfirm">确定</el-button>
        </div>
        <div style="margin-top: 10px">
          <el-button @click="onCancel">取消</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import $ from "jquery"
import {ElMessage} from "element-plus";
import {insertAttachment} from "../modules/attachment/helper";

export default {
  name: 'UploadFileModel',
  props: {},
  data() {
    return {
      fileList: [],
      formData: new FormData(),
      fileName: "",
      fileType: "",
    }
  },
  methods: {
    uploadHttpRequest(data) {
      this.formData = new FormData()
      this.formData.append("file", data.file)
      this.fileName = data.file.name
      this.fileType = data.file.name.substring(data.file.name.lastIndexOf('.'))
    },
    handleUploadChange(file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]] // 这一步，是 展示最后一次选择的文件
      }
    },
    onCancel() {
      this.$emit("hide");
    },
    onConfirm() {
      const that = this
      const file_upload_url = 'http://192.168.1.78:8089/file/upload';
      $.ajax(file_upload_url, {
        method: "POST",
        data: this.formData,
        processData: false,
        contentType: false,
        success: function (data) {
          const download_dir = "http://192.168.1.78:8089/file/download?filePathName=" + data.value
          const editor = window.editor
          if(editor !== null){
            editor.restoreSelection()
            insertAttachment(editor, that.fileName, that.fileType, download_dir)
          }
          that.onCancel()
        },
        error: function (err) {
          ElMessage({
            message: "上传文件失败",
            center: true,
            duration: 2000,
            type: "error"
          });
          that.onCancel()
        }
      })
    }
  }
}

</script>

<style scoped>

</style>