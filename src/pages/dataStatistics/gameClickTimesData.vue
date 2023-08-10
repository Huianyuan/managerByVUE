<template>
  <el-card shadow="never" class="border-0">
    <template #header>
      <div class="card-header">
        <span>游戏列表</span>
      </div>
    </template>
    <!--搜索表单-->
    <el-form :model="searchForm" label-width="80px" class="mb-3" size="small">
      <el-row :gutter="10">
        <el-col :span="8" :offset="0">
          <el-form-item label="游戏名">
            <el-input v-model="searchForm.keyword" placeholder="请输入待查询游戏名" clearable></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="0">
          <el-form-item label="游戏编码">
            <el-input v-model="searchForm.gameCode" placeholder="请输入待查询游戏code" clearable></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="0">
          <div class="flex items-center justify-end">
            <el-button type="primary" @click="getSearchData">搜索</el-button>
            <el-button @click="resetSearchForm">重置</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>

    <!-- 主体展示table-->
    <el-table :data="tableData" style="width: 100%" v-loading="loading" calss="el-table__fixed-body-wrapper">
      <!--      <el-table-column prop="id" label="id" width="60px"/>-->
      <el-table-column prop="gameName" label="游戏名" />
      <el-table-column prop="gameCode" label="游戏编码" />
      <el-table-column prop="clickTimes" label="点击次数" />

      <el-table-column prop="gameImage" label="游戏图标" width="100px">
        <template #default="{ row }">
          <el-image :src="row.gameImage" fit="cover" alt="Image"
                    style="width: 50px;height: 50px" lazy />
        </template>
      </el-table-column>



    </el-table>

    <!-- 分页 -->
    <div class="flex items-center justify-center mt-5">
      <el-pagination background layout="prev,pager,next"
                     :total="total" :current-page="currentPage" :page-size="limit" @current-change="getData"/>
    </div>




  </el-card>

</template>


<script setup>
import {computed, reactive, ref, ssrContextKey} from "vue";
import {gameStartTimesDetails} from "~/api/dataStatistic"
import {getAllGameStore} from "~/api/gameStore"
import FromDrawer from "~/components/FormDrawer.vue";
import {toast} from "~/composables/util";
import {queryGame, updateGame, createGame, updateGameStatus, deleteGameById} from "~/api/game";
import {uploadFileAction} from "~/api/uploadFile";
import {getAllTags} from "~/api/gameTag";


//tags 和 stores 相关变量
const tagSelected = ref([])
const tags = ref([])

const storeSelected = ref([])
const getStores = ref([]);


const dialogVisible = ref(false)
//预览图list
const srcList = ref([])


//表单
const form = reactive({
  id: "",
  name: "",
  score: "",
  gameCode: "",
  tags: [],
  alias: "",
  status: "",
  stores: [],
  gameImage: "",
  largeImage: "",
  describe: "",
  briefIntroduction: "",
  allowDownloadsFlag: "",
  gameRome: "",
  image1: "",
  image2: "",
  image3: "",
  image4: "",
  image5: "",
  image6: "",

})




//搜索表单
const searchForm = reactive({
  keyword: "",
  gameCode: ""
})

const tableData = ref([])
const loading = ref(false)

// 分页
const currentPage = ref(1)
const total = ref(0)
const limit = ref(20)

// 获取数据
let data;

function getData(p = null) {
  data = {
    "pageNo": currentPage.value,
    "pageSize": limit.value,
    "gameName": searchForm.keyword,
    "gameCode": searchForm.gameCode
  }

  if (typeof p == "number") {
    data.pageNo = p
  }
  loading.value = true

  gameStartTimesDetails(data)
      .then(res => {
        console.log(res);
        tableData.value = res.result.records
        total.value = res.result.totalRecord
        currentPage.value = res.result.page

      }).finally(() => {
    loading.value = false
  })
}

getData()

//重置表单
function resetForm(row = null) {
  if (formRef.value) formRef.value.clearValidate()
  if (row) {
    for (const key in form) {
      form[key] = row[key]
    }
  }
}


//搜索功能
function getSearchData() {
  data.name = searchForm.keyword
  data.gameCode = searchForm.game_code
  getData()
}

//搜索框重置
const resetSearchForm = () => {
  searchForm.keyword = ""
  searchForm.game_code = ""
  getData()
}






//游戏状态 status

function getStatusText(status) {
  if (status === 1) {
    return "已上架";
  } else {
    return "未上架";
  }
}

</script>


<style scoped>

</style>