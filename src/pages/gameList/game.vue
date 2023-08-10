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
    <!--  新增 -->
    <div class="flex items-center justify-between mb-4">
      <el-button @click="handleCreate" type="primary" size="small">新增</el-button>
      <el-tooltip effect="dark" content="刷新数据" placement="top">
        <el-button text @click="getData">
          <el-icon :size="20">
            <Refresh/>
          </el-icon>
        </el-button>
      </el-tooltip>
    </div>
    <!-- 主体展示table-->
    <el-table :data="tableData" style="width: 100%" v-loading="loading" calss="el-table__fixed-body-wrapper">
      <!--      <el-table-column prop="id" label="id" width="60px"/>-->
      <el-table-column prop="name" label="游戏名" />
      <el-table-column prop="gameCode" label="游戏编码" />
      <el-table-column prop="score" label="评分" width="80px"/>

      <el-table-column prop="gameRome" label="Rom下载地址" >
        <template #default="{ row }">
          <el-tooltip :content="row.gameRome" placement="top-start">
            <div style="width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              {{ row.gameRome }}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column prop="stores" label="游戏分类">
        <template #default="{ row }">
          <div>
            <span v-for="store in row.stores" :key="store.id">{{ store.name + " " }}</span>
          </div>
        </template>
      </el-table-column>


      <el-table-column prop="tags" label="已关联标签">
        <template #default="{ row }">
          <div>
            <span v-for="tag in row.tags" :key="tag.id">{{ tag.name + " " }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="gameImage" label="游戏图标" >
        <template #default="{ row }">
          <el-image :src="row.gameImage" fit="cover" alt="Image"
                    style="width: 50px;height: 50px" lazy/>
        </template>
      </el-table-column>


      <el-table-column prop="status" label="状态" >
        <template #default="{ row }">
          <el-switch :model-value="row.status" :active-value="1" :inactive-value="0" @click="handleGameStatus(row)"/>
          {{ getStatusText(row.status) }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" text @click="handleDetails(scope.row)" style="margin-left: -10px;">
            详情
          </el-button>
          <el-button type="primary" size="small" text @click="handleEdit(scope.row)" style="margin-left: -10px;">编辑
          </el-button>
          <el-popconfirm title="确认删除？" confirm-button-text="确认" cancel-button-text="取消"
                         @confirm="handleDelete(scope.row.id)">
            <template #reference>
              <el-button text type="danger" size="small" style="margin-left: -10px;">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>

    </el-table>



    <!--抽屉组件-->
    <FromDrawer :title="drawerTitle" ref="formDrawerRef" @cancel="handleCancel" @submit="handleSubmit" size="500px"
                destroy-on-close>
      <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
        <el-form-item label="游戏名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入游戏名称"></el-input>
        </el-form-item>
        <el-form-item label="游戏Code" prop="gameCode">
          <el-input v-model="form.gameCode" placeholder="请输入游戏代码"></el-input>
        </el-form-item>
        <el-form-item label="游戏别名" prop="alias">
          <el-input v-model="form.alias" placeholder="请输入游戏别名"></el-input>
        </el-form-item>

        <el-form-item label="游戏分类" prop="stores">
          <el-checkbox-group v-model="storeSelected" size="small">
            <el-checkbox-button v-for="store in getStores" :key="store.id" :label="store">{{
                store.name
              }}
            </el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="游戏标签" prop="tags">
          <el-checkbox-group v-model="tagSelected" size="small">
            <el-checkbox-button v-for="tag in tags" :key="tag.id" :label="tag">{{
                tag.name
              }}
            </el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="游戏图标" prop="gameImage">
          <template #default="{ row }">
            <el-upload :action="uploadFileAction" :show-file-list="false"
                       :on-success="handleGameImageSuccess">
              <el-button size="small" type="primary" style="margin-top: -60px;">上传</el-button>
            </el-upload>
            <el-image :src="gameImageUrl" alt="游戏图标" placeholder="游戏图标" :zoom-rate="1.2"
                      style="width: 50px;height:50px;margin-left: 10px" lazy/>
          </template>
        </el-form-item>
        <el-form-item label="大图标" prop="largeImage">
          <template #default="{ row }">
            <el-upload :action="uploadFileAction" :show-file-list="false"
                       :on-success="handleLargeImageSuccess">
              <el-button size="small" type="primary" style="margin-top: -60px;">上传</el-button>
            </el-upload>
            <el-image :src="largeImageUrl" alt="游戏图标"
                      style="width: 50px;height:50px;margin-left: 10px" lazy/>
          </template>
        </el-form-item>
        <el-form-item label="下载地址" prop="gameRome">
          <el-input v-model="form.gameRome" placeholder="请输入下载地址"></el-input>
        </el-form-item>
        <el-form-item label="游戏描述" prop="describe">
          <el-input v-model="form.describe" placeholder="游戏描述"></el-input>
        </el-form-item>
        <el-form-item label="游戏介绍" prop="briefIntroduction">
          <el-input type="textarea" v-model="form.briefIntroduction" placeholder="游戏介绍" text></el-input>
        </el-form-item>

        <el-form-item label="游戏图片">

          <template #default="{ row }">
            <el-upload :action="uploadFileAction" :show-file-list="false"
                       :on-success="handleImage1Success">
              <el-button size="small" type="primary" style="margin-top: -60px;">上传</el-button>
            </el-upload>
            <el-image :src="image1Url" alt="图片1"
                      style="width: 50px;height:50px;margin-left: 10px;margin-top: 5px;" lazy/>

            <el-upload :action="uploadFileAction" :show-file-list="false"
                       :on-success="handleImage2Success">
              <el-button size="small" type="primary" style="margin-top: -60px;margin-left: 10px">上传</el-button>
            </el-upload>
            <el-image :src="image2Url" alt="图片2"
                      style="width: 50px;height:50px;margin-left: 10px;margin-top: 5px;" lazy/>

            <el-upload :action="uploadFileAction" :show-file-list="false"
                       :on-success="handleImage3Success">
              <el-button size="small" type="primary" style="margin-top: -60px; margin-left: 10px">上传</el-button>
            </el-upload>
            <el-image :src="image3Url" alt="图片3"
                      style="width: 50px;height:50px;margin-left: 10px;margin-top: 5px;" lazy/>

            <el-upload :action="uploadFileAction" :show-file-list="false"
                       :on-success="handleImage4Success">
              <el-button size="small" type="primary" style="margin-top: -60px;">上传</el-button>
            </el-upload>
            <el-image :src="image4Url" alt="图片4"
                      style="width: 50px;height:50px;margin-left: 10px;margin-top: 5px;" lazy/>

            <el-upload :action="uploadFileAction" :show-file-list="false"
                       :on-success="handleImage5Success">
              <el-button size="small" type="primary" style="margin-top: -60px;margin-left: 10px">上传</el-button>
            </el-upload>
            <el-image :src="image5Url" alt="图片5"
                      style="width: 50px;height:50px;margin-left: 10px;margin-top: 5px;" lazy/>

            <el-upload :action="uploadFileAction" :show-file-list="false"
                       :on-success="handleImage6Success">
              <el-button size="small" type="primary" style="margin-top: -60px;margin-left: 10px">上传</el-button>
            </el-upload>
            <el-image :src="image6Url" alt="图片6"
                      style="width: 50px;height:50px;margin-left: 10px;margin-top: 5px;" lazy/>

          </template>
        </el-form-item>

        <el-form-item label="游戏评分" prop="score">
          <el-input v-model="form.score" placeholder="请输入游戏评分，满分10分"></el-input>
        </el-form-item>

      </el-form>
    </FromDrawer>

    <!--详情弹框-->
    <el-dialog v-model="dialogVisible" width="60%" title="游戏详情" draggable>
      <el-row :gutter="20">
        <el-col :span="6">ID：{{ rowForm.id }}</el-col>
        <el-col :span="6">名称：{{ rowForm.name }}</el-col>
        <el-col :span="6">别名：{{ rowForm.alias }}</el-col>
        <el-col :span="6">状态：{{ getStatusText(rowForm.status) }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">包含tags：
          <template v-if="rowForm.tags&&rowForm.tags.length">
            <span v-for="tag in rowForm.tags" :key="tag.id"> {{ tag.name + " " }}</span>
          </template>
        </el-col>
        <el-col :span="12">所属分类：
          <template v-if="rowForm.stores&&rowForm.stores.length">
            <span v-for="store in rowForm.stores" :key="store.id"> {{ store.name + " " }}</span>
          </template>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">游戏Code：{{ rowForm.gameCode }}</el-col>
        <el-col :span="12">是否允许下载：{{ getAllowDownloadsFlagText(rowForm.allowDownloadsFlag) }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">游戏介绍：{{ rowForm.briefIntroduction }}</el-col>
        <el-col :span="12">游戏描述：{{ rowForm.describe }}</el-col>
      </el-row>

      <el-divider/>

      <el-row :gutter="20"><span>游戏图标：</span>
        <el-col :span="6">
          <el-image
              style="width: 100px; height: 100px" :src="rowForm.gameImage" :zoom-rate="1.2" :preview-src-list="srcList"
              :initial-index="0" fit="cover" lazy/>
        </el-col>
        <span>游戏大图：</span>
        <el-image
            style="width: 100px; height: 100px" :src="rowForm.largeImage" :zoom-rate="1.2" :preview-src-list="srcList"
            :initial-index="1" fit="cover" lazy/>
      </el-row>
      <el-divider/>
      <el-row :gutter="20"><span>游戏图片：</span>
        <el-col :span="20">
          <el-image
              style="width: 100px; height: 100px;" :src="rowForm.image1" :zoom-rate="1.2" :preview-src-list="srcList"
              :initial-index="2" fit="cover" lazy/>
          <el-image
              style="width: 100px; height: 100px;margin-left: 8px" :src="rowForm.image2" :zoom-rate="1.2"
              :preview-src-list="srcList"
              :initial-index="3" fit="cover" lazy/>

          <el-image
              style="width: 100px; height: 100px;margin-left: 8px" :src="rowForm.image3" :zoom-rate="1.2"
              :preview-src-list="srcList"
              :initial-index="4" fit="cover" lazy/>

          <el-image
              style="width: 100px; height: 100px;margin-left: 8px" :src="rowForm.image4" :zoom-rate="1.2"
              :preview-src-list="srcList"
              :initial-index="5" fit="cover" lazy/>

          <el-image
              style="width: 100px; height: 100px;margin-left: 8px" :src="rowForm.image5" :zoom-rate="1.2"
              :preview-src-list="srcList"
              :initial-index="6" fit="cover" lazy/>

          <el-image
              style="width: 100px; height: 100px;margin-left: 8px" :src="rowForm.image6" :zoom-rate="1.2"
              :preview-src-list="srcList"
              :initial-index="7" fit="cover" lazy/>

        </el-col>
      </el-row>
      <template #footer>
        <el-button type="primary" @click="handleCancelDialog">
          关闭
        </el-button>
      </template>
    </el-dialog>
    <!-- 分页 -->
    <div class="flex items-center justify-center mt-5">
      <el-pagination background layout="prev,pager,next"
                     :total="total" :current-page="currentPage" :page-size="limit" @current-change="getData"/>
    </div>
  </el-card>

</template>


<script setup>
import {computed, reactive, ref, ssrContextKey} from "vue";
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
// 表单校验
const rules = {
  name: [
    {required: true, message: '用户名不能为空', trigger: 'blur'},
  ],
  gameImage: [
    {required: true, message: '游戏图标不能为空', trigger: 'blur'},
  ],
  largeImage: [
    {required: true, message: '游戏大图不能为空', trigger: 'blur'},
  ],
  gameRome: [
    {required: true, message: 'rom下载地址不能为空', trigger: 'blur'},
  ],
}

//抽屉组件-begin
const formDrawerRef = ref(null)
const formRef = ref(null)

//多方共用标识，0时为新增，当前数据id时为修改
const editId = ref(0)
const drawerTitle = computed(() => editId.value ? "编辑" : "新增")
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    //提交前将tag和store赋值给form
    form.tags = tagSelected.value
    form.stores = storeSelected.value

    formDrawerRef.value.showLoading();

    const fun = editId.value ? updateGame(form) : createGame(form)

    fun.then(res => {
      toast(drawerTitle.value + "成功！")
      //修改刷新当前页，新增刷新第一页
      getData(editId.value ? false : 1)
      formDrawerRef.value.close()
    }).finally(() => {
      formDrawerRef.value.hideLoading()
    })
  })
}
const handleCancel = () => {
  formDrawerRef.value.close()
  resetForm({
    name: "",
    sort: "",
    code: "",
    id: "",
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
  gameImageUrl.value = ""
  largeImageUrl.value = ""
  image1Url.value = null
  image2Url.value = null
  image3Url.value = null
  image4Url.value = null
  image5Url.value = null
  image6Url.value = null
}
// 抽屉组件-end

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
const limit = ref(10)

// 获取数据
let data;

function getData(p = null) {
  data = {
    "pageNo": currentPage.value,
    "pageSize": limit.value,
    "name": searchForm.keyword,
    "gameCode": searchForm.gameCode
  }

  if (typeof p == "number") {
    data.pageNo = p
  }
  loading.value = true

  queryGame(data)
      .then(res => {
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

//新增按钮
const handleCreate = () => {
  editId.value = 0

  //获取tags 游戏标签
  getAllTags().then(res => {
    tags.value = (res.result);
  })
  //获取stores 游戏库
  getAllGameStore().then(res => {
    getStores.value = (res.result);
  })
  // 表单初始化
  resetForm({
    name: "",
    sort: "",
    code: "",
    id: "",
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
  tagSelected.value = []
  storeSelected.value = []
  image1Url.value = ""
  image2Url.value = ""
  image3Url.value = ""
  image4Url.value = ""
  image5Url.value = ""
  image6Url.value = ""
  gameImageUrl.value = ""
  largeImageUrl.value = ""
  //打开抽屉组件
  formDrawerRef.value.open()
}
//删除
const handleDelete = (id) => {
  loading.value = true
  //根据id删除对应数据
  deleteGameById(id).then(res => {
    toast("删除成功！")
    getData()
  }).finally(() => {
    loading.value = false
  })
}
//修改
const handleEdit = (row) => {
  editId.value = row.id

  //获取tags 游戏标签
  getAllTags().then(res => {
    tags.value = (res.result);
  })
  //获取stores 游戏库
  getAllGameStore().then(res => {
    getStores.value = (res.result);
  })

  resetForm(row)

  image1Url.value = row.image1
  image2Url.value = row.image2
  image3Url.value = row.image3
  image4Url.value = row.image4
  image5Url.value = row.image5
  image6Url.value = row.image6
  gameImageUrl.value = row.gameImage
  largeImageUrl.value = row.largeImage

  tagSelected.value = row.tags
  storeSelected.value = row.stores

  formDrawerRef.value.open(row)
}

//搜索功能
function getSearchData() {
  data.name = searchForm.keyword
  data.gameCode = searchForm.gameCode
  getData()
}

//搜索框重置
const resetSearchForm = () => {
  searchForm.keyword = ""
  searchForm.gameCode = ""
  getData()
}


//上传图片相关
const gameImageUrl = ref(null)
const handleGameImageSuccess = (response, file, fileList) => {

  gameImageUrl.value = response.result
  form.gameImage = gameImageUrl
}
const largeImageUrl = ref(null)
const handleLargeImageSuccess = (response, file, fileList) => {

  largeImageUrl.value = response.result
  form.largeImage = largeImageUrl
}
const image1Url = ref(null)
const image2Url = ref(null)
const image3Url = ref(null)
const image4Url = ref(null)
const image5Url = ref(null)
const image6Url = ref(null)
const handleImage1Success = (response, file, fileList) => {
  image1Url.value = response.result
  form.image1 = image1Url.value
}
const handleImage2Success = (response, file, fileList) => {
  image2Url.value = response.result
  form.image2 = image2Url.value
}
const handleImage3Success = (response, file, fileList) => {
  image3Url.value = response.result
  form.image3 = image3Url.value
}
const handleImage4Success = (response, file, fileList) => {
  image4Url.value = response.result
  form.image4 = image4Url.value
}
const handleImage5Success = (response, file, fileList) => {
  image5Url.value = response.result
  form.image5 = image5Url.value
}
const handleImage6Success = (response, file, fileList) => {
  image6Url.value = response.result
  form.image6 = image6Url.value
}

//详情功能
//当前行表单
const rowForm = reactive({
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
const handleDetails = (row) => {

  Object.assign(rowForm, row);
  srcList.value = srcList.value.concat([
    rowForm.gameImage,
    rowForm.largeImage,
    rowForm.image1,
    rowForm.image2,
    rowForm.image3,
    rowForm.image4,
    rowForm.image5,
    rowForm.image6
  ])
  dialogVisible.value = true
}

const handleCancelDialog = () => {
  dialogVisible.value = false
  srcList.value = []
}


//游戏状态 status
const statusLoadingValue = ref(false)

function getStatusText(status) {
  if (status === 1) {
    return "已上架";
  } else {
    return "未上架";
  }
}

function getAllowDownloadsFlagText(allowDownloadsFlag) {
  switch (allowDownloadsFlag) {
    case 1:
      return "允许";
    case 2:
      return "禁止";
    default:
      return "未知类型";
  }
}

const handleGameStatus = (row) => {
  loading.value = true
  let data = {
    id: row.id,
    status: 0
  }
  if (row.status === 1) {
    data.status = 0
  } else {
    data.status = 1
  }
  //变更游戏状态
  updateGameStatus(data).then(res => {
    toast("修改状态成功！")
    getData()
  }).finally(() => {
    loading.value = false
  })
}
</script>


<style scoped>

</style>