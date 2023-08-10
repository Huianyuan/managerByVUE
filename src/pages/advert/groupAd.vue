<template>
  <el-card shadow="never" class="border-0">
    <template #header>
      <div class="card-header">
        <span>广告分组配置</span>
      </div>
    </template>
    <!--搜索表单-->
    <el-form :model="searchForm" label-width="80px" class="mb-3" size="small">
      <el-row :gutter="10">
        <el-col :span="8" :offset="0">
          <el-form-item label="标题">
            <el-input v-model="searchForm.keyword" placeholder="请输入标题" clearable></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="0">
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="选择状态" clearable>
              <el-option label="生效" :value="1"/>
              <el-option label="失效" :value="0"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="0">
          <div class="flex items-center justify-end">
            <el-button type="primary" @click="getSearchData(1)">搜索</el-button>
            <el-button @click="resetSearchForm(1)">重置</el-button>
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
      <!--      <el-table-column prop="id" label="id" width="60px"/>-->
      <el-table-column prop="title" label="分组名称"/>

      <el-table-column prop="position" label="类型">
        <template #default="{ row }">
          {{ getPositionText(row.position) }}
        </template>
      </el-table-column>

      <el-table-column prop="description" label="描述"/>

      <el-table-column prop="intervals" label="轮播图时间单位">
        <template #default="{ row }">
          {{ getIntervalsText(row.intervals) }}
        </template>
      </el-table-column>

      <el-table-column prop="playStyle" label="呈现样式">
        <template #default="{ row }">
          {{ getPlayStyleText(row.playStyle) }}
        </template>

      </el-table-column>

      <el-table-column prop="backgroundUrl" label="背景图片" width="100px">
        <template #default="{ row }">
          <el-image :src="row.backgroundUrl" fit="cover" alt="Image"
                    style="width: 50px;height: 50px" lazy/>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-switch :model-value="row.status" :active-value="1" :inactive-value="0" @click="handleGroupAdStatus(row)"/>
          {{ getStatusText(row.status) }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="200px">
        <template #default="scope">
          <el-button type="primary" size="small" text @click="handleCorrelate(scope.row)" style="margin-left: -10px;">
            关联
          </el-button>
          <el-button type="primary" size="small" text @click="handleAdList(scope.row)" style="margin-left: -10px;">
            广告列表
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

    <!-- 分页 -->
    <div class="flex items-center justify-center mt-5">
      <el-pagination background layout="prev,pager,next"
                     :total="total" :current-page="currentPage" :page-size="limit" @current-change="getData"/>
    </div>

    <!--抽屉组件-->
    <FromDrawer :title="drawerTitle" ref="formDrawerRef" @cancel="handleCancel" @submit="handleSubmit" size="500px"
                destroy-on-close>
      <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
        <el-form-item label="分组标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入分组标题"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入描述" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="背景图" prop="backgroundUrl">
          <template #default="{ row }">
            <el-upload :action="uploadFileAction" :show-file-list="false"
                       :on-success="handleBackGroupUrlSuccess">
              <el-button size="small" type="primary" style="margin-top: -160px;">上传</el-button>
            </el-upload>
            <el-image :src="backGroundUrl" alt="背景图片" :preview-src-list="srcList" :initial-index="0"
                      style="width: 100px;height:100px;margin-left: 10px;margin-top: 5px;" lazy/>
          </template>
        </el-form-item>

        <el-form-item label="类型" prop="position">
          <el-select v-model="form.position" placeholder="选择广告位值" clearable :default-first-option="true">
            <el-option label="轮播图" :value="0"/>
            <el-option label="广告位" :value="1"/>
          </el-select>
        </el-form-item>

        <el-form-item label="时间间隔" prop="intervals">
          <el-select v-model="form.intervals" placeholder="选择时间间隔" clearable>
            <el-option label="秒" :value="1"/>
            <el-option label="分钟" :value="2"/>
            <el-option label="小时" :value="3"/>
            <el-option label="天" :value="4"/>
          </el-select>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="选择状态" clearable>
            <el-option label="已上架" :value="1"/>
            <el-option label="未上架" :value="0"/>
          </el-select>
        </el-form-item>
        <el-form-item label="呈现样式" prop="playStyle">
          <el-select v-model="form.playStyle" placeholder="选择呈现样式" clearable>
            <el-option label="轮播图" :value="10"/>
            <el-option label="一列" :value="21"/>
            <el-option label="一排" :value="22"/>
            <el-option label="二排两列" :value="23"/>
            <el-option label="info-1" :value="31"/>
          </el-select>
        </el-form-item>


      </el-form>
    </FromDrawer>

    <!--广告列表弹框-->
    <el-dialog v-model="dialogVisible" title="分组关联的广告列表" width="60%" draggable destroy-on-close>
      <el-form :model="searchForm" label-width="80px" class="mb-3" size="small">
        <el-row :gutter="10">
          <el-col :span="6" :offset="0">
            <el-form-item label="标题">
              <el-input v-model="searchForm.keyword" placeholder="请输入标题" clearable></el-input>
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
              <el-button type="primary" @click="getSearchData(2)">搜索</el-button>
              <el-button @click="resetSearchForm(2)">重置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>

      <el-table :data="adListTableData" style="width: 100%" v-loading="loading" calss="el-table__fixed-body-wrapper"
                header-align="center" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="sort" label="排序" width="60px">
          <template #default="{ row }">
            <el-input v-model="row.sort" size="small" @input="onSortInput(row)"></el-input>
          </template>
        </el-table-column>

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
            <el-image :src="row.backgroundUrl" fit="cover" alt="Image" style="width: 50px;height: 50px" lazy/>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-switch :model-value="row.status" :active-value="1" :inactive-value="0" @click="handleAdStatus(row,2)"/>
            {{ getStatusText(row.status) }}
          </template>
        </el-table-column>

        <el-table-column prop="beginTime" label="开始时间"/>

        <el-table-column prop="endTime" label="结束时间"/>

      </el-table>

      <template #footer>
        <div style="display: flex;justify-content: space-between">
          <div>
            <el-button type="danger" @click="handleUnlinkSubmit">解除关联</el-button>
            <el-button type="primary" @click="handleSortSubmit">保存排序</el-button>
          </div>
          <el-pagination background layout="prev,pager,next" :total="totalAd" :current-page="currentPageAd"
                         :page-size="limitAd" @current-change="getGroupAdList"/>
          <div>
            <el-button type="danger" @click="handleCancelDialog">关闭</el-button>
          </div>
        </div>
      </template>
    </el-dialog>

    <!--进行关联弹框-->
    <el-dialog v-model="dialogVisible2" title="进行关联" width="60%">
      <el-form :model="searchForm" label-width="80px" class="mb-3" size="small">
        <el-row :gutter="10">
          <el-col :span="6" :offset="0">
            <el-form-item label="标题">
              <el-input v-model="searchForm.keyword" placeholder="请输入标题" clearable></el-input>
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
              <el-button type="primary" @click="getSearchData(3)">搜索</el-button>
              <el-button @click="resetSearchForm(3)">重置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <el-table ref="multipleTableRef" :data="tableAdData" style="width:100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="title" label="广告标题"/>
        <el-table-column prop="jumpTargetType" label="点击事件">
          <template #default="{ row }">
            {{ getJumpTargetTypeText(row.jumpTargetType) }}
          </template>
        </el-table-column>
        <!--        <el-table-column prop="jumpTarget" label="跳转地址"/>-->
        <el-table-column prop="backgroundUrl" label="图片" width="100px">
          <template #default="{ row }">
            <el-image :src="row.backgroundUrl" fit="cover" alt="Image" style="width: 50px;height: 50px" lazy/>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-switch :model-value="row.status" :active-value="1" :inactive-value="0" @click="handleAdStatus(row,3)"/>
            {{ getStatusText(row.status) }}
          </template>
        </el-table-column>
        <el-table-column prop="beginTime" label="开始时间"/>
        <el-table-column prop="endTime" label="结束时间"/>

      </el-table>

      <template #footer>
        <div style="display: flex;justify-content: space-between">
          <el-button type="primary" @click="handleCorrelateSuccess">提交关联</el-button>
          <el-pagination background layout="prev,pager,next" :total="totalAd" :current-page="currentPageAd"
                         :page-size="limitAd" @current-change="getAdData"/>
          <el-button type="danger" @click="handleCancelDialog">关闭</el-button>
        </div>
      </template>
    </el-dialog>

  </el-card>

</template>


<script setup>
import {computed, reactive, ref} from "vue";
import FromDrawer from "~/components/FormDrawer.vue";
import {toast} from "~/composables/util";
import {uploadFileAction} from "~/api/uploadFile";
import {
  createAdGroup,
  getAdGroupByQuery,
  updateAdGroupStatus,
  updateAdvertGroup,
  deleteAdvertGroup, updateAdGroupSort, groupLinkAd, groupUnlinkAd, getAdvertByGroupIdQuery
} from "~/api/groupAd";
import {getAdvertByQuery, getExGroupAdByQuery, updateAdvertStatus} from "~/api/advert";

const dialogVisible = ref(false)
const dialogVisible2 = ref(false)
//预览图list
const srcList = ref([])
const adListTableData = ref([])
//表单
const linkForm = reactive({
  advertVoList: [
    {
      id: "",
      sort: "",
      status: "",
      groupLinkAdId: "",
    }
  ],
  id: "",
})
const form = reactive({
  advertVoList: [
    {
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
    }
  ],
  backgroundUrl: "",
  createBy: "",
  createTime: "",
  description: "",
  floorLinkGroupId: "",
  id: "",
  intervals: "",
  isDeleted: "",
  linkFlag: "",
  playStyle: "",
  position: "",
  sort: "",
  status: "",
  title: "",
  updateBy: "",
  updateTime: ""
})


// 表单校验
const rules = {
  title: [
    {required: true, message: '标题不能为空', trigger: 'blur'},
  ]
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
    const fun = editId.value ? updateAdvertGroup(form) : createAdGroup(form)
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
  resetForm(form)
  backGroundUrl.value = null
}
// 抽屉组件-end

//搜索表单
const searchForm = reactive({
  keyword: "",
  status: null,
  jumpTargetType: null,
  groupId:null
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
  data = {
    "pageNo": currentPage.value,
    "pageSize": limit.value,
    "title": searchForm.keyword,
    "status": searchForm.status
  }
  if (typeof p == "number") {
    data.pageNo = p
  }

  loading.value = true

  getAdGroupByQuery(data)
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
  loading.value = true
  // 表单初始化
  resetForm({
    backgroundUrl: "",
    createBy: "",
    createTime: "",
    description: "",
    floorLinkGroupId: "",
    id: "",
    intervals: "",
    isDeleted: "",
    linkFlag: "",
    payStyle: "",
    position: "",
    sort: "",
    status: "",
    title: "",
    updateBy: "",
    updateTime: ""
  })
  loading.value = false
  //打开抽屉组件
  formDrawerRef.value.open()
}

//修改
const handleEdit = (row) => {
  editId.value = row.id
  resetForm(row)
  srcList.value = []
  srcList.value = srcList.value.concat([
    form.backgroundUrl
  ])
  backGroundUrl.value = row.backgroundUrl
  formDrawerRef.value.open(row)
}

//关联
//ad表单
const multipleSelection = ref([])
const tableAdData = ref([])
// 弹窗分页
const currentPageAd = ref(1)
const totalAd = ref(0)
const limitAd = ref(6)

//广告列表
const groupId = ref()
const currentRow = ref()
const handleAdList = (row) => {
  // loading.value = true
  groupId.value = row.id
  getGroupAdList()
  Object.assign(currentRow, row)
  dialogVisible.value = true
  loading.value=false
}

let dataGroupAd

function getGroupAdList(p = null) {
  dataGroupAd = {
    "groupId": groupId.value,
    "pageNo": currentPageAd.value,
    "pageSize": limitAd.value,
    "title": searchForm.keyword,
    "status":searchForm.status,
    "jumpTargetType":searchForm.jumpTargetType
  }
  if (typeof p == "number") {
    dataGroupAd.pageNo = p
  }
  loading.value = true
  getAdvertByGroupIdQuery(dataGroupAd).then(res => {
    adListTableData.value = res.result.records
    currentPageAd.value=res.result.page
    totalAd.value=res.result.total_record
  }).finally(() => {
    loading.value = false
  })
}


// 关联时，获取分组的ad数据
let dataAd

function getAdData(p = null) {
  dataAd = {
    "title": searchForm.keyword,
    "jumpTargetType": searchForm.jumpTargetType,
    "pageNo": currentPageAd.value,
    "pageSize": limitAd.value,
    "groupId":groupId.value
  }
  if (typeof p == "number") {
    dataAd.pageNo = p
  }
  loading.value = true
  getExGroupAdByQuery(dataAd)
      .then(res => {
        tableAdData.value = res.result.records
        totalAd.value = res.result.total_record
        currentPageAd.value = res.result.page

      }).finally(() => {
    loading.value = false
  })
}


//关联
const handleCorrelate = (row) => {
  loading.value = true
  groupId.value = row.id
  getAdData()
  linkForm.id = groupId.value
  dialogVisible2.value = true
}
//监听行变化
const handleSelectionChange = (row) => {
  multipleSelection.value = row
}
//提交关联
const handleCorrelateSuccess = () => {
  //linkForm 表单填充，两个东西：分组本身id 和 adList.
  linkForm.advertVoList = multipleSelection.value
  groupLinkAd(linkForm).then(res => {
    if (res.code === 200) {
      toast("关联成功！")
      getAdData()
      multipleSelection.value = []
    } else {
      toast(res.message, "error")
    }
  })
}

//解除关联
const handleUnlinkSubmit = () => {
  linkForm.id = groupId.value
  linkForm.advertVoList = multipleSelection.value
  groupUnlinkAd(linkForm).then(res => {
    toast("解除关联成功！")
    getGroupAdList()//todo 解除关联后刷新表单 待解决
  })
}

//搜索功能
const getSearchData = (flag) => {

  if (flag === 1) {
    // 分组信息查询
    getData()
  }
  if (flag === 2) {
    //执行已关联ad的查询 分组关联的广告列表
    getGroupAdList()
  }
  if (flag === 3) {
    //执行未关联时ad的查询 进行关联
    getAdData()
  }
}

//搜索框重置
const resetSearchForm = (flag) => {

  if (flag === 1) {
    searchForm.keyword = ""
    searchForm.status = ""
    getData()
  }
  if (flag === 2) {
    searchForm.keyword = ""
    searchForm.status = ""
    searchForm.jumpTargetType=""
    // 分组关联的广告列表
    getGroupAdList()
  }
  if (flag === 3) {
    searchForm.keyword = ""
    searchForm.status = ""
    searchForm.jumpTargetType=""
    // 进行关联
    getAdData()
  }
}


//上传图片相关
const backGroundUrl = ref(null)
const handleBackGroupUrlSuccess = (response, file, fileList) => {
  backGroundUrl.value = response.result
  form.backgroundUrl = backGroundUrl.value
}

//记录修改排序值后的整行字段
const editTable = ref([])

// 表单中排序值修改，监听
function onSortInput(row) {
  if (!editTable.value.includes(row)) {
    editTable.value.push(row)
  }
}

const handleSortSubmit = () => {
  loading.value = true
  linkForm.advertVoList=editTable.value
  linkForm.id=groupId.value
  updateAdGroupSort(linkForm).then(res => {
    if (res.code === 200) {
      toast("保存排序值成功！")
      getGroupAdList()//todo 保存排序之后获取数据 获取的数据没有sort值
    } else {
      toast(res.message)
    }
  }).finally(() => {
    loading.value = false
  })
}


//弹窗关闭
const handleCancelDialog = () => {
  dialogVisible.value = false
  dialogVisible2.value = false
}

//修改分组状态 status
const handleGroupAdStatus = (row) => {
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
  //变更AdGroup状态
  updateAdGroupStatus(data).then(res => {
    toast("修改状态成功！")
    getData()
  }).finally(() => {
    loading.value = false
  })
}
//Ad状态  弹窗中 修改后数据更新操作
const handleAdStatus = (row,flag) => {
  // loading.value = true
  let data = {
    id: row.id,
    newStatus: 0
  }
  if (row.status === 1) {
    data.newStatus = 0
  } else {
    data.newStatus = 1
  }
  // 变更ad状态
  updateAdvertStatus(data).then(res => {
    toast("修改状态成功！")
    if (flag===3){
      getAdData()
    }
    if (flag===2){
      getGroupAdList()
    }
    getAdData()
  }).finally(() => {
    loading.value = false
  })
}

//删除
const handleDelete = (id) => {
  loading.value = true
  //根据id删除对应数据
  deleteAdvertGroup(id).then(res => {
    toast("删除成功！")
    getData()
  }).finally(() => {
    loading.value = false
  })
}


function getStatusText(status) {
  if (status === 1) {
    return "已生效";
  } else {
    return "未生效";
  }
}

function getPositionText(position) {
  if (position === 0) {
    return "轮播图";
  } else {
    return "广告位";
  }
}

function getPlayStyleText(playStyle) {
  switch (playStyle) {
    case 10:
      return "轮播图";
    case 21:
      return "1列";
    case 22:
      return "1排";
    case 23:
      return "2排2列";
    case 31:
      return "info-1";
    default:
      return "未知类型";
  }
}

function getIntervalsText(intervals) {
  switch (intervals) {
    case 1:
      return "秒";
    case 2:
      return "分钟";
    case 3:
      return "小时";
    case 4:
      return "天";
    default:
      return "未知类型";
  }
}

function getJumpTargetTypeText(jumpTargetType) {
  if (jumpTargetType === 1) {
    return "游戏详情";
  } else {
    return "H5";
  }
}


</script>


<style scoped>

</style>