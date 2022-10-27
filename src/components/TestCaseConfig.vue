<template>
  <div>
    <div>
      <el-button @click="addNewTestCase">新增</el-button>
      <el-button @click="deleteChoose">删除</el-button>
    </div>
    <div>
      <el-table
          :data="testcases"
          stripe
          height="200"
          style="width: 100%"
      >
        <el-table-column prop="name" label="用例主题"></el-table-column>
        <el-table-column prop="type" label="类型"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="precondition" label="前置条件"></el-table-column>
        <el-table-column prop="expected" label="预期结果"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import {ref, shallowRef} from 'vue'


const testcases = ref([])
const chooses = ref([])

const addNewTestCase = () => {
  console.log("add new testcase")
}

const deleteChoose = () => {
  console.log("delete choose")
}


</script>

<style scoped>

</style>