<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { renderSheetApi, saveLuckySheet } from '@/apis/home'
import { exportExcel } from '@/components/export'
import { useRoute } from 'vue-router'

const props = defineProps({
  msg: {
    type: String
  }
})
const route = useRoute()
const luckySheetData = ref('')
const selected = ref('')
const autoFillInfo = ref([] as any)
const indexMap = ref({} as any)
const options = ref([
  {
    text: 'Money Manager.xlsx',
    value: 'https://minio.cnbabylon.com/public/luckysheet/money-manager-2.xlsx'
  },
  {
    text: 'Activity costs tracker.xlsx',
    value: 'https://minio.cnbabylon.com/public/luckysheet/Activity%20costs%20tracker.xlsx'
  },
  {
    text: 'House cleaning checklist.xlsx',
    value: 'https://minio.cnbabylon.com/public/luckysheet/House%20cleaning%20checklist.xlsx'
  },
  {
    text: 'Student assignment planner.xlsx',
    value: 'https://minio.cnbabylon.com/public/luckysheet/Student%20assignment%20planner.xlsx'
  },
  {
    text: 'Credit card tracker.xlsx',
    value: 'https://minio.cnbabylon.com/public/luckysheet/Credit%20card%20tracker.xlsx'
  },
  {
    text: 'Blue timesheet.xlsx',
    value: 'https://minio.cnbabylon.com/public/luckysheet/Blue%20timesheet.xlsx'
  },
  {
    text: 'Student calendar (Mon).xlsx',
    value: 'https://minio.cnbabylon.com/public/luckysheet/Student%20calendar%20%28Mon%29.xlsx'
  },
  {
    text: 'Blue mileage and expense report.xlsx',
    value:
      'https://minio.cnbabylon.com/public/luckysheet/Blue%20mileage%20and%20expense%20report.xlsx'
  }
])
const isMaskShow = ref(false)

//保存表格中的数据到数据库
const saveInDatabase = () => {
  // console.log(this.luckySheetData)
  const allSheets = luckysheet.getAllSheets()
  console.log(allSheets)
  saveLuckySheet(allSheets)
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err + '失败')
    })
}
//#region 得到数据库里面的数据
const getInDatabase = () => {
  console.log('666')
  const options = {
    lang: 'zh',
    container: 'luckysheet',
    allowUpdate: true,
    loadUrl: 'http://' + 'localhost:8080' + '/getLuckySheet'
  }
  luckysheet.create(options)
  console.log('666')
}
//endregion
//#region 上传EXCEL
//本地导入excel
const uploadExcel = (evt: any) => {
  const files = evt.target.files
  if (files == null || files.length == 0) {
    alert('No files wait for import')
    return
  }
  let name = files[0].name
  let suffixArr = name.split('.'),
    suffix = suffixArr[suffixArr.length - 1]
  if (suffix != 'xlsx') {
    alert('Currently only supports the import of xlsx files')
    return
  }
  LuckyExcel.transformExcelToLucky(files[0], (exportJson: any, luckysheetfile: any) => {
    if (exportJson.sheets == null || exportJson.sheets.length == 0) {
      alert('Failed to read the content of the excel file, currently does not support xls files!')
      return
    }
    //console.log(exportJson, luckysheetfile);
    console.log('------------------------')
    //console.log(luckysheetfile)
    window.luckysheet.destroy()
    window.luckysheet.create({
      lang: 'zh',
      container: 'luckysheet', //luckysheet is the container id
      showinfobar: false,
      data: exportJson.sheets,
      title: exportJson.info.name,
      userInfo: exportJson.info.name.creator
    })
    luckySheetData.value = luckysheetfile
    console.log(luckySheetData)
  })
}

//endregion

//#region 渲染为excel
const selectExcel = (evt: any) => {
  const value = selected.value
  const name = evt.target.options[evt.target.selectedIndex].innerText
  if (value == '') {
    return
  }
  isMaskShow.value = true
  LuckyExcel.transformExcelToLuckyByUrl(value, name, (exportJson: any, luckysheetfile) => {
    if (exportJson.sheets == null || exportJson.sheets.length == 0) {
      alert('Failed to read the content of the excel file, currently does not support xls files!')
      return
    }
    isMaskShow.value = false
    window.luckysheet.destroy()
    window.luckysheet.create({
      lang: 'zh',
      container: 'luckysheet', //luckysheet is the container id
      showinfobar: false,
      data: exportJson.sheets,
      title: exportJson.info.name,
      userInfo: exportJson.info.name.creator
    })
  })
}

//#endregion

//#region 下载文件
const downloadExcel = () => {
  // const value = this.selected;;
  //
  // if(value.length==0){
  //     alert("Please select a demo file");
  //     return;
  // }
  //
  // var elemIF = document.getElementById("Lucky-download-frame");
  // if(elemIF==null){
  //     elemIF = document.createElement("iframe");
  //     elemIF.style.display = "none";
  //     elemIF.id = "Lucky-download-frame";
  //     document.body.appendChild(elemIF);
  // }
  // elemIF.src = value;
  exportExcel(luckysheet.getAllSheets(), '下载')
  // testaaa();
}

//endregion

//#region 处理单元格更新
const handleCellUpdated = (r: any, c: any, val: any) => {
  console.log(autoFillInfo.value, 'this.autoFillInfo')
  if (autoFillInfo.value.length == 0) {
    return
  }
  for (let i = 0; i < autoFillInfo.value.length; i++) {
    let item = autoFillInfo.value[i] as any
    console.log(item, c, val)
    if (item.c == c) {
      let tmp = item.d.find((e: any) => e.name == val.v) as any
      if (tmp) {
        console.log(r, indexMap.value, 'this.indexMap')
        window.luckysheet.setCellValue(r, indexMap.value.customAddress, tmp.adress)
        console.log('ok')
      }
      break
    }
  }
}

//#region 保存json数据
const loadJsonData = () => {
  window.luckysheet.destroy()
  window.luckysheet.create({
    lang: 'zh',
    container: 'luckysheet',
    data: [
      {
        name: 'Sheet1',
        index: 0,
        status: 1,
        celldata: []
      }
    ],
    hook: {
      cellUpdated: function (r: any, c: any, oldValue: any, newValue: any, isRefresh: any) {
        console.info('cellUpdated', r, c, oldValue, newValue, isRefresh)
        handleCellUpdated(r, c, newValue)
      }
    },
    showinfobar: false
  })
  nextTick(() => {
    setTimeout(() => loadJsonDataMain(), 1000)
  })
}

//#endregion

//#region
const loadJsonDataMain = () => {
  let tableHeader = [
    {
      name: 'orderNumber',
      width: 100,
      fit: true,
      label: '订单编号',
      fixed: true
    },
    {
      name: 'agency',
      width: 100,
      fit: true,
      label: '经销商'
    },
    {
      name: 'customAddress',
      width: 120,
      fit: true,
      label: '终端地址'
    },
    {
      name: 'createTimeLabel',
      width: 150,
      label: '创建日期'
    },
    {
      name: 'totalMoney',
      width: 100,
      label: '总额'
    },
    {
      name: 'shouldMoney',
      width: 100,
      label: '应收金额'
    },
    {
      name: 'discount',
      width: 70,
      label: '折扣'
    },
    {
      name: 'hadMoney',
      width: 100,
      label: '已收金额'
    },
    {
      name: 'payState',
      width: 80,
      label: '付款状态',
      filters: {
        true: '已付清',
        false: '未付清'
      }
    },
    {
      name: 'checkState',
      width: 80,
      label: '审核状态',
      filters: {
        true: '已审核',
        false: '未审核'
      }
    }
  ]
  let tableList = [
    {
      orderNumber: '2310-22',
      agency: '李四',
      customAddress: '成都地址1',
      createTimeLabel: '2023-10-23 17:25:00',
      totalMoney: 9800,
      shouldMoney: 9800,
      discount: 0,
      hadMoney: 3000,
      payState: false,
      checkState: true
    },
    {
      orderNumber: '2310-25',
      agency: '张三',
      customAddress: '成都地址2',
      createTimeLabel: '2023-10-22 13:25:00',
      totalMoney: 19800,
      shouldMoney: 9800,
      discount: 0,
      hadMoney: 10000,
      payState: false,
      checkState: true
    }
  ]
  let agencyList = [
    { name: '经销商1', adress: '地址1' },
    { name: '经销商2', adress: '地址2' },
    { name: '经销商3', adress: '地址3' },
    { name: '经销商4', adress: '地址4' },
    { name: '经销商5', adress: '地址5' },
    { name: '经销商6', adress: '地址6' }
  ]
  indexMap.value = {}
  autoFillInfo.value = []
  // 获取列号
  let r = 0
  for (let i = 0; i < tableHeader.length; i++) {
    let item = tableHeader[i]
    indexMap.value[item.name] = i
    // 为特定字段添加数据验证下拉选项
    if (item.name == 'agency') {
      window.luckysheet.setDataVerification(
        {
          type: 'dropdown',
          type2: null,
          value1: `${agencyList.map((e) => e.name).join(',')}`
        },
        {
          range: { row: [r + 1, r + 999], column: [i, i] }
        }
      )
    }
    // 表头
    window.luckysheet.setCellValue(r, i, item.label)
  }
  // 获取自动补齐的数据
  autoFillInfo.value.push({
    c: indexMap.value.agency,
    d: agencyList
  })
  r += 1
  for (let i = 0; i < tableList.length; i++) {
    let item = tableList[i]
    let itemArr = Object.entries(item)
    for (let j = 0; j < itemArr.length; j++) {
      let v = itemArr[j][1]
      window.luckysheet.setCellValue(r, j, v)
    }
    r++
  }
}

//#endregion

//endregion

//#region 获取图表数据
const getSheetData = async () => {
  const res = await renderSheetApi(route.params.id as number)
  console.log(res)
}

//endregion

//初始化luckySheet
const init = () => {
  luckysheet.create({
    lang: 'zh',
    container: 'luckysheet',
    showinfobar: false,
    loadUrl: 'http://127.0.0.1:3000/commonExcel/fetchExcelData'
  })
}
onMounted(() => {
  nextTick(() => {
    init()
  })
  getSheetData()
})
</script>

<template>
  <div class="hello">
    <div style="position: absolute; top: 0; left: 0">
      <input style="font-size: 16px" type="file" @change="uploadExcel" />
      <span>选择在线Excel文件：</span>
      <select v-model="selected" @change="selectExcel">
        <option disabled value="">Choose</option>
        <option v-for="option in options" :key="option.text" :value="option.value">
          {{ option.text }}
        </option>
      </select>
      <button @click="downloadExcel">下载保存</button>
      <button @click="loadJsonData">加载JSON数据</button>
      <button @click="saveInDatabase">保存至数据库</button>
      <button @click="getInDatabase">从数据库获取</button>
    </div>

    <div
      id="luckysheet"
      style="
        margin: 0px;
        padding: 0px;
        position: absolute;
        width: 100%;
        left: 0px;
        top: 30px;
        bottom: 0px;
      "
    ></div>

    <div
      v-show="isMaskShow"
      style="
        position: absolute;
        z-index: 1000000;
        left: 0px;
        top: 0px;
        bottom: 0px;
        right: 0px;
        background: rgba(255, 255, 255, 0.8);
        text-align: center;
        font-size: 40px;
        align-items: center;
        justify-content: center;
        display: flex;
      "
    >
      Downloading
    </div>
  </div>
</template>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
