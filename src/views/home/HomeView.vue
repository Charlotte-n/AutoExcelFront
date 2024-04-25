<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const tableData1 = ref([])
const tableData2 = ref([
  { object: 'string', nickName: '姓名', id: '1' },
  { object: 'string', nickName: '性别', id: '2' },
  { object: 'string', nickName: '班级', id: '3' },
  { object: 'int', nickName: '学号', id: '4' },
  { object: 'int', nickName: '身份证号', id: '5' },
  { object: 'int', nickName: '成绩', id: '6' },
  { object: 'string', nickName: '人', id: '7' },
  { object: 'string', nickName: '人', id: '8' },
  { object: 'string', nickName: '人', id: '9' },
  { object: 'string', nickName: '人', id: '10' }
])

// 左数据
let nowSelectData = ref([])
// 右数据
let nowSelectRightData = ref([])

//新建表格
let dialogVisibleNewForm = ref(false)
//表格
const form = {
  name: '',
  style: '',
  desc: '',
  group: ''
}

//上传表格
const dialogVisibleForm = ref(false)
// 存储 Excel 表头信息
const excelHeader = ''

//表格数据
const title = '测试'
const type1 = 'Excel表格'
const type2 = '多级填报'
const name = '某某某'
const time = '2024-02-12 10:23:49'

//搜索框
let input = ''
//已选择
let selectData = ref([])
//弹框
let dialogVisible = ref(false)
//表格
const tableData = [
  {
    id: '姓名'
  },
  {
    id: '性别'
  },
  {
    id: '班级'
  },
  {
    id: '身份证号'
  }
]
// 添加序号后的excel导入数据
let processedTableData = ref<
  {
    styleId: number
    styleName: string
    id: string
  }[]
>([])

onMounted(() => {
  processedTableData.value = tableData.map((item, index) => {
    return {
      styleId: index + 1,
      styleName: item.id,
      id: `${item.id}--->[${index + 1}]`
    }
  })
})

const beforeUpload = (file: any) => {
  const isExcel =
    file.type === 'application/vnd.ms-excel' ||
    file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  if (!isExcel) {
    // this.$message.error('上传文件格式必须为Excel文档！');
  }
  return isExcel
}
// 上传成功
const handleSuccess = () => {
  ElMessage({
    message: '上传成功',
    type: 'success',
    plain: true
  })
}
// 上传失败
const handleError = () => {
  ElMessage({
    message: '上传失败',
    type: 'error',
    plain: true
  })
}

//--------------------------穿梭框----------------------------------
// 左边全选事件
const checkAll = (row: any) => {
  nowSelectData.value = row
}
// 右边全选事件
const checkRightAll = (row: any) => {
  nowSelectRightData.value = row
}
// 左边选中事件
const checkLeft = (row: any) => {
  nowSelectData.value = row
}
// 右边选中事件
const checkRight = (row: any) => {
  nowSelectRightData.value = row
}
// 点击去右边
const right = () => {
  tableData2.value = tableData2.value.concat(nowSelectData.value)
  handleRemoveTabList(nowSelectData, tableData1)
  // 按钮禁用
  nowSelectData.value = []
}
// 点击去左边
const left = () => {
  tableData1.value = tableData1.value.concat(nowSelectRightData.value)
  handleRemoveTabList(nowSelectRightData, tableData2)
  // 按钮禁用
  nowSelectRightData.value = []
}
// 方法
const handleRemoveTabList = (isNeedArr: any, originalArr: any) => {
  if (isNeedArr.length && originalArr.length) {
    for (let i = 0; i < isNeedArr.length; i++) {
      for (let k = 0; k < originalArr.length; k++) {
        if (isNeedArr[i]['nickName'] === originalArr[k]['nickName']) {
          selectData.value = tableData1.value
          originalArr.splice(k, 1)
        }
      }
    }
  }
}

//关闭弹框
const handleClose = () => {
  ElMessageBox.confirm('确定要删除吗', '提醒', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      dialogVisibleForm.value = false
      dialogVisibleNewForm.value = false
      dialogVisible.value = false
      ElMessage({
        type: 'success',
        message: '取消成功'
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消'
      })
    })
}

//搜索框
const selectDataInput = () => {
  console.log('搜索' + input)
}

//建新表格
const newForm = () => {
  console.log('新建表格信息' + JSON.stringify(form))
  //创建表格后向后台传，之后接收项目ID

  //绑定模块提交后将ID一起提交到后台
}

//提交
const submitForm = () => {
  dialogVisible.value = false

  //处理多选框数
  const modifiedData = selectData.value.map((obj: any, index: number) => {
    return { ID: index + 1, ...obj }
  })

  //整合数据
  const formData = processedTableData

  // 合并数据的函数
  function mergeData(modifiedData: any, formData: any) {
    const mergedArray = modifiedData.map((modifiedItem: any) => {
      const formDataItem = formData.find(
        (formDataItem: any) => formDataItem.styleId === modifiedItem.ID
      )
      return {
        ...modifiedItem,
        ...formDataItem
      }
    })
    return mergedArray
  }

  // 调用函数合并数据
  const mergedData = mergeData(modifiedData, formData)

  //清空
  tableData1.value = []

  console.log(JSON.stringify(mergedData))
}
</script>

<template>
  <div id="excelPage">
    <div class="boxLeft">
      <div class="boxLeftTop">
        <span class="boxLeftText">全部分组</span>
        <div class="boxLeftTop1">
          <el-input v-model="input" placeholder="请输入内容"></el-input>
          <el-button class="boxLeftTop1Button" type="primary" @click="selectDataInput"
            >搜索</el-button
          >
        </div>
      </div>

      <!--死-->
      <div class="box1">默认分组</div>
    </div>
    <div class="boxRight">
      <div class="boxRightTop">
        <el-button
          class="boxRightButton"
          type="text"
          @click="
            () => {
              dialogVisibleNewForm = true
            }
          "
          >创建填报</el-button
        >
      </div>
      <div class="boxRightBottom">
        <div class="mainBox">
          <div style="padding: 0 10px; height: 80%">
            <span class="mainBoxText1">{{ title }}</span>
            <div class="mainBoxType">
              <el-tag type="success" style="margin-right: 10px">{{ type1 }}</el-tag>
              <el-tag type="warning">{{ type2 }}</el-tag>
            </div>
            <span class="mainBoxText2">{{ name }}</span>
            <span class="mainBoxText3">{{ time }}</span>
          </div>
          <div class="mainBoxBottom">
            <el-button
              class="mainBoxButton1"
              type="text"
              @click="
                () => {
                  dialogVisibleForm = true
                }
              "
              >上传表格</el-button
            ><!--未写-->
            <el-button
              class="mainBoxButton2"
              type="text"
              @click="
                () => {
                  dialogVisible = true
                }
              "
              >绑定模块</el-button
            >
            <el-button class="mainBoxButton3" type="text">查阅数据</el-button>
          </div>
        </div>
      </div>
    </div>

    <!--上传表格-->
    <el-dialog
      title="上传模块"
      v-model="dialogVisibleForm"
      width="950px"
      :before-close="handleClose"
    >
      <el-upload
        class="upload-demo"
        action="/uploadExcel"
        :before-upload="beforeUpload"
        :on-success="handleSuccess"
        :on-error="handleError"
      >
        <el-button type="primary" style="margin-top: 10px"
          >点击上传(仅支持第一行为表头格式的Excel文件上传)</el-button
        >
        <div class="preview">{{ excelHeader }}</div>
      </el-upload>
    </el-dialog>

    <!--编辑表格-->
    <el-dialog title="选择模块" v-model="dialogVisible" width="950px" :before-close="handleClose">
      <div style="display: flex; flex-direction: row">
        <!--表格框-->
        <div style="flex: 0; margin-right: 10px">
          <el-table :data="processedTableData" height="270" border style="width: 100%">
            <el-table-column
              prop="id"
              label="字段"
              width="180"
              :header-background-color="'#f0f0f0'"
            >
            </el-table-column>
          </el-table>
        </div>

        <!--穿梭框-->
        <el-row :gutter="20">
          <el-col :span="10">
            <!-- 穿梭框左边 -->
            <el-table
              ref="multipleTable"
              :data="tableData1"
              height="300"
              tooltip-effect="dark"
              style="width: 100%"
              @select="checkLeft"
              @select-all="checkAll"
              class="el-table-dialog"
              row-key="id"
            >
              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <el-table-column type="index" label="序号" align="center" width="55">
              </el-table-column>

              <el-table-column label="类型" align="center">
                <template #default="scope">
                  <span>{{ scope.row.object }}</span>
                </template>
              </el-table-column>
              <el-table-column label="模块" align="center">
                <template #default="scope">
                  <span>{{ scope.row.nickName }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="4" class="el-btn-dialog">
            <el-button
              @click="left"
              type="primary"
              :disabled="nowSelectRightData.length ? false : true"
              icon="el-icon-arrow-left"
              >加入左侧</el-button
            >
            <el-button
              @click="right"
              type="primary"
              :disabled="nowSelectData.length ? false : true"
              icon="el-icon-arrow-right"
              style="margin-left: 0; margin-top: 10px"
              >加入右侧</el-button
            >
          </el-col>
          <el-col :span="10">
            <!-- 穿梭框右边 -->
            <el-table
              ref="multipleTable"
              :data="tableData2"
              max-height="300"
              tooltip-effect="dark"
              style="width: 100%"
              @select="checkRight"
              @select-all="checkRightAll"
              row-key="id"
              class="el-table-dialog"
            >
              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <el-table-column type="index" label="序号" align="center" width="55">
              </el-table-column>

              <el-table-column label="类型" align="center">
                <template #default="scope">
                  <span>{{ scope.row.object }}</span>
                </template>
              </el-table-column>
              <el-table-column label="模块" align="center">
                <template #default="scope">
                  <span>{{ scope.row.nickName }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>

      <span class="dialog-footer">
        <el-button
          @click="
            () => {
              dialogVisible = false
            }
          "
          >取 消</el-button
        >
        <el-button type="primary" @click="submitForm()">确 定</el-button>
      </span>
    </el-dialog>

    <!--创建表格-->
    <el-dialog
      title="新建填报"
      v-model="dialogVisibleNewForm"
      width="600px"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="名称:">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="类型:">
          <el-select v-model="form.style" placeholder="请选择类型">
            <el-option label="Excel<------>表单" value="excel"></el-option>
            <el-option label="无" value="wu"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述:">
          <el-input type="textarea" v-model="form.desc" class="custom-input"></el-input>
        </el-form-item>
        <el-form-item label="分组:">
          <el-select v-model="form.group" placeholder="请选择分组">
            <el-option label="默认分组" value="style1"></el-option>
            <el-option label="一级分组" value="style2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span class="dialog-footer">
        <el-button @click="dialogVisibleNewForm = false">取 消</el-button>
        <el-button type="primary" @click="newForm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style lang="scss">
* {
  padding: 0;
  margin: 0;
}
#excelPage {
  display: flex;
  width: 100%;
  overflow-x: hidden;
}
/*------------------------------左盒子----------------------------*/
.boxLeft {
  width: 30%;
  height: 100vh;
  border-right: 2px solid #cccccc;
}
.boxLeftText {
  margin-right: 15px;
  font-size: 25px;
  font-weight: bolder;
}
.boxLeftTop {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 12%;
  width: 100%;
  border-bottom: 1px solid #cccccc;
  .el-input__wrapper {
    height: 30px;
  }
}
.boxLeftTop1 {
  display: flex;
  height: 39%;
  width: 50%;
}
.boxLeftTop1Button {
  margin-left: 3%;
}
.box1 {
  padding: 10px;
  font-size: 20px;
  font-weight: bolder;
  border-bottom: 1px solid #cccccc;
}
/*------------------------------------右盒子-----------------------------*/
.boxRight {
  width: 70%;
  height: 100vh;
  border-left: 1px solid #cccccc;
}
.boxRightTop {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 12%;
  width: 100%;
  border-bottom: 1px solid #cccccc;
}
.boxRightButton {
  font-weight: bolder;
  font-size: 25px;
}
.boxRightBottom {
  padding: 30px;
}
/*-------------------------上传模块-------------------*/
.upload-demo {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  background-color: #f5f7fa;
}
.preview {
  margin-top: 20px;
  font-size: 18px;
}
/*---------------------右下多个小盒子字体-------------------*/
.mainBox {
}
.mainBoxText1 {
  font-size: 25px;
  font-weight: bolder;
}
.mainBoxText2 {
  font-size: 15px;
  font-weight: bolder;
  color: #a0a1a1;
}
.mainBoxText3 {
  font-size: 15px;
  font-weight: bolder;
  color: #a0a1a1;
}
.mainBoxType {
  margin-top: 5px;
  margin-bottom: 5px;
}
/*---------------------右下多个小盒子-------------------*/
.mainBox {
  padding: 20px 0 0 0;
  width: 40%;
  border-radius: 10px;
  border: 2px solid #cccccc;
}
.mainBoxBottom {
  margin-top: 10px;
  height: 20%;
  width: 100%;
  display: flex;
  border-top: 2px solid #cccccc;
  .el-button {
    padding: 8px 0;
  }
}
.mainBoxButton1 {
  height: 100%;
  width: 30%;
  font-size: 1vw;

  border-radius: 0;
}
.mainBoxButton2 {
  height: 100%;
  width: 30%;
  border-radius: 0;
  font-size: 1vw;

  border-left: 2px solid #cccccc;
}
.mainBoxButton2:hover {
  border-left: 2px solid #cccccc;
}
.mainBoxButton2:focus {
  border-left: 2px solid #cccccc;
}
.mainBoxButton3 {
  margin-left: 60%;
  height: 100%;
  width: 35%;
  border-radius: 0;
  border-left: 2px solid #cccccc;
  font-size: 1vw;
}
.mainBoxButton3:hover {
  border-left: 2px solid #cccccc;
}
.mainBoxButton3:focus {
  border-left: 2px solid #cccccc;
}

.el-table-dialog {
  border: 1px solid #e8e6e6;
}

.el-table-dialog thead th {
  background-color: #f4f4f4;
}

.el-table-dialog thead th .cell {
  font-weight: bold;
}

.el-table-dialog thead th:last-child {
  text-align: center;
}
.el-table td,
.el-table th {
  padding: 3.6px 0;
  min-width: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
  text-align: right;
}
.el-dialog__body {
  padding: 0 20px;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
}
.el-dialog__title {
  line-height: 20px;
  font-size: 20px;
  color: #303133;
  font-weight: bolder;
}
</style>
