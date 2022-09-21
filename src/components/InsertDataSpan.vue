<template>
  <div>
    <el-collapse accordion v-model="activeNames" @change="handleChange">
      <div v-for="item in page_ds_group" :key="item.GroupID">
        <el-collapse-item :name="item.GroupID">
          <template #title>
            {{ item.GroupName }}-----------{{ item.GroupType }}
          </template>
          <div>
            <el-table
                v-if="isShowTable"
                :data="field_data"
                stripe
                height="200"
                style="width: 100%"
                @row-dblclick="fieldTableDbClickEvent"
            >
              <el-table-column prop="FieldID" label="字段ID"></el-table-column>
              <el-table-column prop="FieldName" label="字段名"></el-table-column>
            </el-table>
          </div>
          <div>
            <el-descriptions v-if="isShowXQ" :title="item.GroupName">
              <el-descriptions-item label="类型：">{{ item.GroupType }}</el-descriptions-item>
              <el-descriptions-item label="分组名：">{{ item.GroupName }}</el-descriptions-item>
              <el-descriptions-item>
                <el-button @click="insertDynamicRow">选 择</el-button>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-collapse-item>
      </div>
    </el-collapse>

    <div style="text-align:center">
      <el-pagination
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :current-page="currentPage"
          :total="max_page"/>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {getUrlParams} from '@/utils/util'
import {url_load_data_source} from "@/assets/urls"
import {insertDataHolder} from "@/modules/data-holder/helper"
import {insertTemplatePdr} from "@/modules/dynamic-row/helper";

export default {
  name: 'InsertDataSpanModal',
  props: {
    config: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      // 编辑器初始化参数
      isInit: false,
      isShowTable: false,
      isShowXQ: false,
      model: "",
      filter: [],
      // 文档环境中的参数
      env_args: [],
      // 数据源
      ds_group: [],
      ds_field: [],
      ds_args: [],
      // 折叠面板的选中的面板的name值
      activeNames: '',
      // 动态加载Field表格的数据
      field_data: [],
      /***************** 分页相关参数 *****************/
      currentPage: 1,
      page_size: 5,
      max_page: 100,
      page_ds_group: [],
    }
  },
  methods: {
    onCancel() {
      this.$emit("hide");
    },
    handleChange(data) {
      // data = el-collapse-item name
      let res = [];
      this.ds_field.forEach((item) => {
        if (item["GroupID"] === data) {
          res.push(item);
        }
      })
      this.field_data = res;
    },
    handleCurrentChange(currentPage) {
      this.getFieldList(currentPage);
      this.currentPage = currentPage;
    },
    getFieldList(page) {
      let field_list = [];

      let start = (page === 1) ? 0 : (page - 1) * this.page_size;
      let end = ((page * 10) === this.max_page) ? this.ds_group.length : (page * this.page_size);

      for (let i = start; i < end; i++) {
        field_list.push(this.ds_group[i]);
      }

      this.page_ds_group = field_list;
    },
    fieldTableDbClickEvent(row) {
      const editor = window.editor
      if (editor == null) return;
      if (editor.selection == null) editor.restoreSelection();
      insertDataHolder(editor, row["GroupID"], row["FieldID"], row["FieldName"]);
      this.onCancel();
    },
    insertDynamicRow() {
      const editor = window.editor
      if (editor == null) return;
      if (editor.selection == null) editor.restoreSelection();
      // insert_pdr_template(editor,this.activeNames,'')
      insertTemplatePdr(editor,this.activeNames,'')
      this.onCancel()
    }
  },
  mounted() {
    this.model = this.config["model"];
    this.filter = this.config["filter"];

    this.env_args = getUrlParams();

    const m = this;

    axios.get(url_load_data_source, {}).then(function (res) {
      m.ds_group = res["data"]["Group"];
      m.ds_field = res["data"]["Field"];
      m.ds_args = res["data"]["Args"];

      if (m.model === "data") {
        m.isShowTable = true;
        let res = m.ds_group.filter(item => {
          const type_code = item["GroupTypeCode"];
          for (let i = 0; i < m.filter.length; i++) {
            if (type_code.indexOf(m.filter[i]) > -1) return true;
          }
        })

        if ("group" in m.config) {
          m.ds_group.filter(item => {
            if (item["GroupID"] === m.config["group"]) {
              res.unshift(item);
            }
          })
        }

        m.ds_group = res;
      } else if (m.model === "drow") {
        m.isShowXQ = true;
        m.ds_group = m.ds_group.filter(item => {
          const type_code = item["GroupTypeCode"];
          for (let i = 0; i < m.filter.length; i++) {
            if (type_code.indexOf(m.filter[i]) > -1) return true;
          }
        });
      }

      m.max_page = Math.ceil(m.ds_group.length / m.page_size) * 10;

      m.getFieldList(1);

      m.isInit = true;
    })
  }
}

</script>
