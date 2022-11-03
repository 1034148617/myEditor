<template>
  <div>
    <div>
      <el-button @click="addNewTestCase">新增</el-button>
      <el-button @click="deleteChoose">删除</el-button>
    </div>
    <div>
      <el-table
          :data="testcases"
          :cell-style="rowStyle"
          stripe
          height="280"
          style="width: 100%"
          @selection-change="handleTableSelectChange"
      >
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="name" label="用例主题" align="center"></el-table-column>
        <el-table-column prop="type" label="类型" :formatter="typeFormatter" align="center"></el-table-column>
        <el-table-column prop="description" label="描述" align="center" :show-overflow-tooltip='true'></el-table-column>
        <el-table-column prop="precondition" label="前置条件" align="center"
                         :show-overflow-tooltip='true'></el-table-column>
        <el-table-column prop="expected" label="预期结果" align="center" :show-overflow-tooltip='true'></el-table-column>
        <el-table-column label="查看" width="100" align="center">
          <template #default="scoped">
            <el-button type="info" @click="onEdit(scoped.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div style="margin-top:10px;text-align: right">
      <el-button @click="onConfirm">确定</el-button>
      <el-button @click="onCancel">取消</el-button>
    </div>
  </div>

  <el-dialog v-model="isEdit" width="50%" center="center" :destroy-on-close="true">
    <el-row>
      <el-col :span="5" style="line-height: 40px"><span>用例主题:</span></el-col>
      <el-col :span="19">
        <el-input v-model="chooseRow.name"></el-input>
      </el-col>
    </el-row>
    <el-row style="margin-top: 10px;">
      <el-col :span="5" style="line-height: 40px"><span>类型:</span></el-col>
      <el-col :span="19">
        <el-select v-model="chooseRow.type">
          <el-option
              v-for="item in testcaseType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-col>
    </el-row>
    <el-row style="margin-top: 10px;">
      <el-col :span="5" style="line-height: 40px"><span>描述:</span></el-col>
      <el-col :span="19">
        <el-input type="textarea" v-model="chooseRow.description" :autosize="textareaSize"></el-input>
      </el-col>
    </el-row>
    <el-row style="margin-top: 10px;">
      <el-col :span="5" style="line-height: 40px"><span>前置条件:</span></el-col>
      <el-col :span="19">
        <el-input type="textarea" v-model="chooseRow.precondition" :autosize="textareaSize"></el-input>
      </el-col>
    </el-row>
    <el-row style="margin-top: 10px;">
      <el-col :span="5" style="line-height: 40px"><span>预期结果:</span></el-col>
      <el-col :span="19">
        <el-input type="textarea" v-model="chooseRow.expected" :autosize="textareaSize"></el-input>
      </el-col>
    </el-row>
    <el-row style="margin-top: 10px;">
      <el-col :span="11">
        <div></div>
      </el-col>
      <el-col :span="13">
        <el-button @click="isEdit = false">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script setup>
import {defineEmits, defineProps, ref} from 'vue'
import {SlateTransforms} from '@wangeditor/editor'
import {NewID} from "../utils/util";

const props = defineProps({
  config: {
    type: Array,
    default: () => {
      return [
        {
          testcases: []
        },
        []
      ]
    }
  },
})

const testcaseType = [
  {
    label: '功能测试',
    value: '01'
  },
  {
    label: '性能测试',
    value: '02'
  },
  {
    label: '配置相关',
    value: '03'
  },
  {
    label: '安装部署',
    value: '04'
  },
  {
    label: '安全相关',
    value: '05'
  },
  {
    label: '接口测试',
    value: '06'
  },
  {
    label: '其他',
    value: '07'
  },
]
const textareaSize = {minRows: 2, maxRows: 3}
const typeFormatter = function (row, col){
  let typename = null
  for (let i = 0; i < testcaseType.length; i++) {
    if(testcaseType[i]["value"] === row.type ){
      typename = testcaseType[i]["label"]
      break
    }
  }
  return typename
}
const rowStyle = function (){      // 表头和表行样式居中
  return "text-align:center";
}


const isEdit = ref(false)
const chooseRow = ref([])
const testcases = ref(props.config[0].testcases)
const nodePath = ref(props.config[1])

if (testcases.value === undefined) {
  testcases.value = []
}

// 表格多选框改变事件
const handleTableSelectChange = (val) => {
  chooseRow.value = [];
  for (let i = 0; i < val.length; i++) {
    for (let j = 0; j < testcases.value.length; j++) {
      if (val[i]["name"] === testcases.value[j]["name"] && val[i]["description"] === testcases.value[j]["description"]) {
        chooseRow.value.push(j);
        break;
      }
    }
  }
}

// 新增按钮事件
const addNewTestCase = () => {
  testcases.value.push({
    ObjectID: NewID(32),
    name: "新建测试用例" + (testcases.value.length + 1),
    type: "01",
    description: "",
    precondition: "",
    expected: ""
  })
}

// 删除按钮事件
const deleteChoose = () => {
  const newList = []
  for (let i = 0; i < testcases.value.length; i++) {
    if (chooseRow.value.indexOf(i) === -1) {
      newList.push(testcases.value[i])
    }
  }
  testcases.value = newList
}

// 编辑按钮事件
const onEdit = (rowData) => {
  chooseRow.value = rowData
  isEdit.value = true
}

// 传递回App.vue页面的事件
const emit = defineEmits(['hide', 'confirm'])
const onCancel = () => {
  emit('hide')
}
const onConfirm = () => {
  SlateTransforms.setNodes(window.editor, {
    testcases: JSON.parse(JSON.stringify(testcases.value))
  },{
    at: nodePath.value
  })
  emit("hide")
}

</script>

<style scoped>

</style>