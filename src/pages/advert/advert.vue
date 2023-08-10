<template>
  <el-card shadow="never" class="border-0">
    <template #header>
      <div class="card-header">
        <span>广告列表</span>
      </div>
    </template>
    <!--搜索表单-->
    <el-form :model="searchForm" label-width="80px" class="mb-3" size="small">
      <el-row :gutter="10">
        <el-col :span="6" :offset="0">
          <el-form-item label="广告标题">
            <el-input v-model="searchForm.keyword" placeholder="请输入广告标题" clearable></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6" :offset="0">
          <el-form-item label="点击事件">
            <el-select v-model="searchForm.jumpTargetType" placeholder="选择点击事件" clearable>
              <el-option label="游戏详情" :value="1"/>
              <el-option label="H5" :value="2"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="0">
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="选择状态" clearable>
              <el-option label="已上架" :value="1"/>
              <el-option label="未上架" :value="0"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="0">
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
    <el-table :data="tableData" style="width: 100%" v-loading="loading" calss="el-table__fixed-body-wrapper"
              header-align="center">
      <el-table-column prop="title" label="广告标题"/>

      <el-table-column prop="jumpTargetType" label="点击事件">
        <template #default="{ row }">
          {{ getJumpTargetTypeText(row.jumpTargetType) }}
        </template>
      </el-table-column>
      <el-table-column prop="jumpTargetName" label="跳转名称"/>
      <el-table-column prop="jumpTarget" label="跳转地址"/>

      <el-table-column prop="backgroundUrl" label="图片" width="100px">
        <template #default="{ row }">
          <el-image :src="row.backgroundUrl" fit="cover" alt="Image" :preview-src-list="srcList" :initial-index="0"
                    style="width: 50px;height: 50px"/>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-switch :model-value="row.status" :active-value="1" :inactive-value="0" @click="handleAdStatus(row)"/>
          {{ getStatusText(row.status) }}
        </template>
      </el-table-column>

      <el-table-column prop="beginTime" label="开始时间"/>

      <el-table-column prop="endTime" label="结束时间"/>

      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="danger" size="small" text @click="handleDetails(scope.row)">详情</el-button>
          <el-button type="primary" size="small" text @click="handleEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>

    </el-table>


    <!-- 分页 -->
    <div class="flex items-center justify-center mt-5">
      <el-pagination background layout="prev,pager,next"
                     :total="total" :current-page="currentPage" :page-size="limit" @current-change="getData"/>
    </div>

    <!--抽屉组件-->
    <FromDrawer :title="drawerTitle" ref="formDrawerRef" @cancel="handleCancel" @submit="handleSubmit" size="500px"
                destroy-on-close>
      <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
        <el-form-item label="广告标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入广告标题"></el-input>
        </el-form-item>
        <el-form-item label="点击事件" prop="alias">
          <el-select v-model="form.jumpTargetType" placeholder="选择点击事件" clearable>
            <el-option label="游戏详情" :value="1"/>
            <el-option label="H5" :value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="选择状态" clearable>
            <el-option label="已上架" :value="1"/>
            <el-option label="未上架" :value="0"/>
          </el-select>
        </el-form-item>

        <el-form-item label="排序值" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序值"></el-input>
        </el-form-item>

        <el-form-item label="广告图片">
          <template #default="{ row }">
            <el-upload :action="uploadFileAction" :show-file-list="false"
                       :on-success="handleImage1Success">
              <el-button size="small" type="primary" style="margin-top: -60px;margin-left: 10px">上传</el-button>
            </el-upload>
            <el-image :src="image1Url" alt="图片1"
                      style="width: 100px;height:100px;margin-left: 10px;margin-top: 5px;"/>

            <el-upload :action="uploadFileAction" :show-file-list="false"
                       :on-success="handleImage2Success">
              <el-button size="small" type="primary" style="margin-top: -60px;margin-left: 10px">上传</el-button>
            </el-upload>
            <el-image :src="image2Url" alt="图片2"
                      style="width: 100px;height:100px;margin-left: 10px;margin-top: 5px;"/>

            <el-upload :action="uploadFileAction" :show-file-list="false"
                       :on-success="handleImage3Success">
              <el-button size="small" type="primary" style="margin-top: -60px;margin-left: 10px">上传</el-button>
            </el-upload>
            <el-image :src="image3Url" alt="图片3"
                      style="width: 100px;height:100px;margin-left: 10px;margin-top: 5px;"/>

            <el-upload :action="uploadFileAction" :show-file-list="false"
                       :on-success="handleImage5Success">
              <el-button size="small" type="primary" style="margin-top: -60px;margin-left: 10px">上传</el-button>
            </el-upload>
            <el-image :src="image5Url" alt="图片4"
                      style="width: 100px;height:100px;margin-left: 10px;margin-top: 5px;"/>
          </template>
        </el-form-item>

        <el-form-item label="开始时间" prop="beginTime">
          <el-date-picker v-model="form.beginTime" type="datetime" placeholder="选择开始时间"
                          format="YYYY/MM/DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss"/>
        </el-form-item>

        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker v-model="form.endTime" type="datetime" placeholder="选择结束时间"
                          format="YYYY/MM/DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss"/>
        </el-form-item>

      </el-form>
    </FromDrawer>

    <!--详情弹框-->
    <el-dialog v-model="dialogVisible" width="60%" title="广告详情" draggable>
      <el-row :gutter="20">
        <el-col :span="6">ID：{{ rowForm.id }}</el-col>
        <el-col :span="6">标题：{{ rowForm.title }}</el-col>
        <el-col :span="6">标题颜色：{{ rowForm.titleColor }}</el-col>
        <el-col :span="6">状态：{{ getStatusText(rowForm.status) }}</el-col>
      </el-row>
      <!--      <el-divider/>-->
      <el-row :gutter="20">
        <el-col :span="6">开始时间：{{ rowForm.beginTime }}</el-col>
        <el-col :span="6">结束时间：{{ rowForm.endTime }}</el-col>
        <el-col :span="6">创建时间：{{ rowForm.createTime }}</el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="20">描述：{{ rowForm.description }}</el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="6">跳转名称：{{ rowForm.jumpTargetName }}</el-col>
        <el-col :span="6">跳转类型：{{ getJumpTargetTypeText(rowForm.jumpTargetType) }}</el-col>
        <el-col :span="12">跳转目标：{{ rowForm.jumpTarget }}</el-col>
      </el-row>
      <el-divider/>
      <el-row :gutter="20"><span>背景图片：</span>
        <el-col :span="6">
          <el-image
              style="width: 100px; height: 100px" :src="rowForm.backgroundUrl" :zoom-rate="1.2"
              :preview-src-list="srcList"
              :initial-index="0" fit="cover"/>
        </el-col>
      </el-row>
      <el-divider/>
      <el-row :gutter="20"><span>其他图片：</span>
        <el-col :span="5">
          <el-image
              style="width: 100px; height: 100px" :src="rowForm.picUrl1" :zoom-rate="1.2" :preview-src-list="srcList"
              :initial-index="1" fit="cover"/>
        </el-col>
        <el-col :span="5">
          <el-image
              style="width: 100px; height: 100px" :src="rowForm.picUrl2" :zoom-rate="1.2" :preview-src-list="srcList"
              :initial-index="2" fit="cover"/>
        </el-col>
        <el-col :span="5">
          <el-image
              style="width: 100px; height: 100px" :src="rowForm.picUrl3" :zoom-rate="1.2" :preview-src-list="srcList"
              :initial-index="3" fit="cover"/>
        </el-col>
        <el-col :span="5">
          <el-image
              style="width: 100px; height: 100px" :src="rowForm.picUrl5" :zoom-rate="1.2" :preview-src-list="srcList"
              :initial-index="4" fit="cover"/>
        </el-col>
      </el-row>

      <template #footer>
        <el-button type="primary" @click="dialogVisible = false">
          关闭
        </el-button>
      </template>
    </el-dialog>

  </el-card>

</template>


<script setup>
import {computed, reactive, ref} from "vue";
import {getAdvertByQuery, createAdvert, updateAdvertStatus, updateAdvert} from "~/api/advert"
import FromDrawer from "~/components/FormDrawer.vue";
import {toast} from "~/composables/util";
import {uploadFileAction} from "~/api/uploadFile";

const dialogVisible = ref(false)
//预览图list
const srcList = ref([])

//表单
const form = reactive({
  id: "",
  sort: "",
  title: "",
  titleColor: "",
  status: "",
  backgroundUrl: "",
  beginTime: "",
  endTime: "",
  createBy: "",
  createTime: "",
  description: "",
  groupLinkAdId: "",
  isDeleted: "",
  jumpTarget: "",
  jumpTargetName: "",
  jumpTargetType: "",
  jumpType: "",
  linkFlag: "",
  picUrl1: "",
  picUrl2: "",
  picUrl3: "",
  picUrl5: "",
  updateBy: "",
  updateTime: ""
})
// 表单校验
const rules = {
  title: [
    {required: true, message: '广告标题不能为空', trigger: 'blur'},
  ],
  // adUrl: [
  //   {required: true, message: '最少上传一张图片', trigger: 'blur'},
  // ]
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

    formDrawerRef.value.showLoading();
    const fun = editId.value ? updateAdvert(form) : createAdvert(form)
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
    id: "",
    sort: "",
    title: "",
    titleColor: "",
    status: "",
    backgroundUrl: "",
    beginTime: "",
    endTime: "",
    createBy: "",
    createTime: "",
    description: "",
    groupLinkAdId: "",
    isDeleted: "",
    jumpTarget: "",
    jumpTargetName: "",
    jumpTargetType: "",
    jumpType: "",
    linkFlag: "",
    picUrl1: "",
    picUrl2: "",
    picUrl3: "",
    picUrl5: "",
    updateBy: "",
    updateTime: ""

  })

  image1Url.value = ""
  image2Url.value = ""
  image3Url.value = ""
  image5Url.value = ""

}
// 抽屉组件-end

//搜索表单
const searchForm = reactive({
  keyword: "",
  status: null,
  jumpTargetType: null
})

const tableData = ref([])
const loading = ref(false)

// 分页
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)

// 获取数据
let data

function getData(p = null) {

  if (typeof p == "number") {
    data.pageNo = p
  }
  data = {
    "pageNo": currentPage.value,
    "pageSize":limit.value,
    "title": searchForm.keyword,
    "jumpTargetType": searchForm.jumpTargetType,
    "status": searchForm.status
  }
  loading.value = true

  getAdvertByQuery(data)
      .then(res => {
        tableData.value = res.result.records
        total.value = res.result.total_record
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
  //打开抽屉组件
  formDrawerRef.value.open()
}

//修改
const handleEdit = (row) => {
  editId.value = row.id
  loading.value = true
  resetForm(row)

  image1Url.value = row.picUrl1
  image2Url.value = row.picUrl2
  image3Url.value = row.picUrl3
  image5Url.value = row.picUrl5
  loading.value = false
  formDrawerRef.value.open(row)
}
//详情功能
//当前行表单
const rowForm = reactive({
  id: "",
  sort: "",
  title: "",
  titleColor: "",
  status: "",
  backgroundUrl: "",
  beginTime: "",
  endTime: "",
  createBy: "",
  createTime: "",
  description: "",
  groupLinkAdId: "",
  isDeleted: "",
  jumpTarget: "",
  jumpTargetName: "",
  jumpTargetType: "",
  jumpType: "",
  linkFlag: "",
  picUrl1: "",
  picUrl2: "",
  picUrl3: "",
  picUrl5: "",
  updateBy: "",
  updateTime: ""
})
const handleDetails = (row) => {

  Object.assign(rowForm, row);
  srcList.value=[]
  srcList.value = srcList.value.concat([
    rowForm.backgroundUrl,
    rowForm.picUrl1,
    rowForm.picUrl2,
    rowForm.picUrl3,
    rowForm.picUrl5
  ])
  dialogVisible.value = true
}

//搜索功能
function getSearchData() {

  data.title = searchForm.keyword
  data.status = searchForm.status
  data.jumpTargetName = searchForm.jumpTargetName
  getData()
}

//搜索框重置
const resetSearchForm = () => {
  searchForm.keyword = ""
  searchForm.jumpTargetType=null
  searchForm.status = null
  console.log(searchForm)
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
const image5Url = ref(null)

const handleImage1Success = (response, file, fileList) => {
  image1Url.value = response.result
  form.picUrl1 = image1Url.value
}
const handleImage2Success = (response, file, fileList) => {
  image2Url.value = response.result
  form.picUrl2 = image2Url.value
}
const handleImage3Success = (response, file, fileList) => {
  image3Url.value = response.result
  form.picUrl3 = image3Url.value
}
const handleImage5Success = (response, file, fileList) => {
  image5Url.value = response.result
  form.picUrl5 = image5Url.value
}

//点击事件
function getJumpTargetTypeText(jumpTargetType) {
  if (jumpTargetType === 1) {
    return "游戏详情";
  } else {
    return "H5";
  }
}

function getStatusText(status) {
  if (status === 1) {
    return "已上架";
  } else {
    return "未上架";
  }
}

const handleAdStatus = (row) => {
  loading.value = true
  let data = {
    id: row.id,
    newStatus: 0
  }
  if (row.status === 1) {
    data.newStatus = 0
  } else {
    data.newStatus = 1
  }
  //变更ad状态
  updateAdvertStatus(data).then(res => {
    toast("修改状态成功！")
    getData()
  }).finally(() => {
    loading.value = false
  })
}
</script>


<style scoped>

</style>