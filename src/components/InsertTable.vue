<template>
  <div style="height:350px;">
    <!-- 页签 -->
    <el-switch v-model="isDataRender" active-text="自定义表格" inactive-text="数据源导入" @change="changeConfigArea" />

    <div  style="height:280px;margin-top:20px">
      <!-- 自定义表格 -->
      <div ref="simple" style="float:left">
        <div>行：
          <el-input-number v-model="rowNum" :min="1" :max="30" @change="changeTableConfig" />
        </div>
        <div style="margin-top:10px">列：
          <el-input-number v-model="colNum" :min="1" :max="20" @change="changeTableConfig" />
        </div>
        <table style="margin-top:15px;margin-left:20px" ref="configView">
          <tr v-for="(row,index) in Array.from({length:10}, (v,k) => k)" :key="index">
            <td v-for="(col,index) in Array.from({length:10}, (v,k) => k)" :key="index"
                :title="row+1+'X'+(col+1)" :data-x="row" :data-y="col"
                style="width:10px;height:10px;border:1px solid"
                @mouseenter="changeThumbnail"
                @click="changeTableNumber" />
          </tr>
        </table>
      </div>
      <!-- 数据源生成表格 -->
      <div ref="format" style="display:none;float:left;overflow-y: scroll;overflow-x: scroll;height:260px;width:210px;">
        <el-tree :data="groupInfo" show-checkbox />
      </div>
      <div style="margin-left:220px">
        <el-table v-if="TableConfig!=null" :data="TableConfig" style="width: 100%" border height="250px" :header-cell-style="{'text-align':'center'}">
          <el-table-column type="index" fixed />
          <el-table-column v-if="isHeader" label="列名" width="143" fixed>
            <template #default="colName">
              <el-input v-model="colName.row.colName" style="width:120px" />
            </template>
          </el-table-column>
          <el-table-column label="指标宽度" width="95" align="center">
            <template #default="width">
              <el-input-number v-model="width.row.width" :min="10" :controls="false" style="width:70px" />
            </template>
          </el-table-column>
          <el-table-column label="水平位置" width="80" align="center">
            <template #default="location">
              <select v-model="location.row.location">
                <option value="left">居左</option>
                <option value="center" selected>居中</option>
                <option value="right">居右</option>
              </select>
            </template>
          </el-table-column>
          <el-table-column label="垂直位置" width="80" align="center">
            <template #default="vertical">
              <select v-model="vertical.row.valign">
                <option value="top">居上</option>
                <option value="middle" selected>居中</option>
                <option value="bottom">居下</option>
              </select>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div>
      <span> 显示表头：</span>
      <el-switch v-model="isHeader" inline-prompt active-text="是" inactive-text="否" active-color="#13ce66" inactive-color="#ff4949" />
      <span> 显示边框：</span> <!-- 待修改成编辑边框的对话框 -->
      <el-switch v-model="isBorder" inline-prompt active-text="是" inactive-text="否" active-color="#13ce66" inactive-color="#ff4949" />
      <span> 显示序号</span>
      <el-switch v-model="isSerial" inline-prompt active-text="是" inactive-text="否" active-color="#13ce66" inactive-color="#ff4949" />
      <el-button style="float:right" @click="onHide">取消</el-button>
      <el-button style="float:right;margin-right:13px" @click="onConfirm">确定</el-button>
    </div>
  </div>
</template>

<script>
import {Transforms} from "slate";
import {genTableNodeFromConfig} from '../modules/dynamic-table/helper'
import {getNodeRow} from "../utils/util";
import {url_load_data_source} from "../assets/urls";
import axios from "axios";

export default {
  name: "InsertTableModal",
  props: {},
  data() {
    return {
      isDataRender: true,       // 切换页签
      TableConfig: [],
      rowNum: 3,
      colNum: 4,
      isHeader: true,
      isBorder: true,
      isSerial: true,
      groupInfo: [],          // 分组信息

    }
  },
  methods: {
    changeConfigArea(val) {
      if(val){
        this.$refs.format.style.display = "none";
        this.$refs.simple.style.display = "block";
      }else{
        this.$refs.format.style.display = "block";
        this.$refs.simple.style.display = "none";
      }
      this.TableConfig = []
    },
    onHide() {
      this.$emit("hide")
    },
    changeTableNumber(value) {
      this.rowNum = parseInt(value.target.getAttribute("data-x")) + 1
      this.colNum = parseInt(value.target.getAttribute("data-y")) + 1
      this.changeTableConfig()
    },
    changeTableConfig() {
      let infoList = [];
      for (let i = 0; i < this.colNum; i++) {
        let info = {
          colIndex: i,
          colName: "",
          width: 100,
          height: 30,
          location: "center",
          valign: "middle",
        };
        if (this.TableConfig.length > i) {
          infoList.push(this.TableConfig[i]);
        } else {
          infoList.push(info);
        }
      }
      this.TableConfig = infoList;
    },
    changeTableStyle(row, col, className) {
      let tab = this.$refs.configView;
      for (let i = 0; i < tab.children.length; i++) {
        for (let j = 0; j < tab.children[i].children.length; j++) {
          let td = tab.children[i].children[j];
          if (i <= row && j <= col) {
            td.classList.add(className);
          } else {
            td.classList.remove(className);
          }
        }
      }
    },
    changeThumbnail(value) {
      let row = parseInt(value.target.getAttribute("data-x"));
      let col = parseInt(value.target.getAttribute("data-y"));
      this.changeTableStyle(row, col, "class-table-active");
    },
    onConfirm() {
      const editor = window.editor
      if(editor != null){
        if(this.isDataRender){
          // 自定义表格
          const TableNode = genTableNodeFromConfig(this.rowNum, this.TableConfig, this.isHeader, this.isSerial)
          editor.restoreSelection()
          const row = getNodeRow(editor)
          Transforms.insertNodes(editor, TableNode, {at:[row]})
        }else{
          // 数据源导入
          console.log(this.isDataRender)
        }

      }
      this.onHide()
    },
  },
  mounted() {
    let modal = this;
    axios.get(url_load_data_source,{}).then(function(res){
      let datas = res.data;

      for(let i = 0; i < datas.Group.length; i++){
        const group_info = datas.Group[i];
        if(group_info["GroupTypeCode"].substring(0,1) !== '2') continue
        const leaf_nodes = []
        for(let j = 0; j < datas.Field.length; j++){
          const field_info = datas.Field[j]
          if(field_info["GroupID"] === group_info["GroupID"]){
            leaf_nodes.push({
              // label: field_info["FieldName"] + '(' + field_info["FieldID"] + ')',
              label: field_info["FieldName"] || field_info["FieldID"]
            })
          }
        }
        modal.groupInfo.push({
          label: group_info["GroupName"] || group_info["GroupID"],
          children: leaf_nodes
        })
      }
    });
  }
}

</script>

<style scoped>

</style>