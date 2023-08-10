<template>
  <el-card shadow="never" class="border-0">
    <template #header>
      <div class="card-header">
        <span>游戏Tag列表</span>
      </div>
    </template>
    <!--搜索表单-->
    <el-form :model="searchForm" label-width="80px" class="mb-3" size="small">
      <el-row :gutter="10">
        <el-col :span="8" :offset="0">
          <el-form-item label="查询名称">
            <el-input v-model="searchForm.keyword" placeholder="请输入待查询名称" clearable></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="0">
          <el-form-item label="查询状态">
            <el-select v-model="searchForm.status" placeholder="请选择查询状态" clearable>
              <el-option label="已上架" :value="1"/>
              <el-option label="未上架" :value="0"/>
            </el-select>
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
    <!--table主体-->
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <!--      <el-table-column prop="id" label="id" width="70"/>-->
      <el-table-column prop="sort" label="排序" width="60px">
        <template #default="{ row }">
          <el-input v-model="row.sort" size="small" @input="onSortInput(row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称"/>
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-switch :model-value="row.status" :active-value="1" :inactive-value="0" @click="handleTagStatus(row)"/>
          {{ getStatusText(row.status) }}
        </template>
      </el-table-column>
      <el-table-column prop="tagType" label="tag类别">
        <template #default="{ row }">{{ getTagType(row.tagType) }}</template>
      </el-table-column>


      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" text @click="handleEdit(scope.row)">编辑</el-button>

          <el-popconfirm title="确认删除？" confirm-button-text="确认" cancel-button-text="取消"
                         @confirm="handleDelete(scope.row.id)">
            <template #reference>
              <el-button text type="primary" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-button class="custom-button" type="danger" size="small" @click="handleSortSubmit">保存排序</el-button>

    <div class="flex items-center justify-center mt-5">
      <el-pagination background layout="prev,pager,next"
                     :total="total" :current-page="currentPage" :page-size="limit" @current-change="getData"/>
    </div>

    <FromDrawer :title="drawerTitle" ref="formDrawerRef" @submit="handleSubmit" @cancel="handleCancel" size="30%">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
        <el-form-item label="Tag名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入Tag名称"></el-input>
        </el-form-item>
        <el-form-item label="排序值" prop="sort">
          <el-input v-model.number="form.sort" placeholder="请输入排序值，数字"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="选择状态" clearable>
            <el-option label="已上架" :value="1"/>
            <el-option label="未上架" :value="0"/>
          </el-select>
        </el-form-item>
      </el-form>
    </FromDrawer>


  </el-card>

</template>

<script setup>
import {computed, reactive, ref} from "vue";
import FromDrawer from "~/components/FormDrawer.vue";
import {toast} from "~/composables/util";
import {
  createGameTag,
  deleteGameTag,
  queryGameTag,
  updateGameTag,
  batchUpdateSort,
  updateTagStatus
} from "~/api/gameTag";
import {Refresh} from "@element-plus/icons-vue";
import {updateGameStoreStatus} from "~/api/gameStore";

//表单
const form = reactive({
  id: "",
  name: "",
  sort: "",
  status: "",
  cateType: "",
  tagType: ""
})
// 表单校验
const rules = {
  name: [
    {required: true, message: '用户名不能为空', trigger: 'blur'},
  ],
  sort: [
    {required: true, message: '排序不能为空', trigger: 'blur'},
    {type: 'number', message: '排序值使用数字表示'}
  ],
  status: [
    {required: true, message: '状态不能为空', trigger: 'blur'},
    {type: 'number', message: '状态使用数字表示'}
  ]
}
// 抽屉组件-begin
const formDrawerRef = ref(null)
const formRef = ref(null)

//多方共用标识，0时为新增，当前数据id时为修改
const editId = ref(0)
const drawerTitle = computed(() => editId.value ? "编辑" : "新增")
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    formDrawerRef.value.showLoading();

    const fun = editId.value ? updateGameTag(form) : createGameTag(form)

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
    name: "",
    sort: "",
    status: "",
    cateType: "",
    tagType: ""
  })
}
// 抽屉组件-end

//搜索表单
const searchForm = reactive({
  keyword: "",
  status: null
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
  if (typeof p == "number") {
    data.pageNo = p
  }
  data = {
    "pageNo": currentPage.value,
    "pageSize": limit.value,
    "name": searchForm.keyword,
    "status": searchForm.status
  }
  loading.value = true
  queryGameTag(data)
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

//新增
const handleCreate = () => {
  editId.value = 0
  // 表单初始化
  resetForm({
    name: "",
    sort: "",
    status: "",
  })
  //打开抽屉组件
  formDrawerRef.value.open()
}
//删除
const handleDelete = (id) => {
  loading.value = true
  //根据id删除对应数据
  deleteGameTag(id).then(res => {
    toast("删除成功！")
    getData()
  }).finally(() => {
    loading.value = false
  })
}
//修改
const handleEdit = (row) => {
  editId.value = row.id
  resetForm(row)
  formDrawerRef.value.open(row)
}


//搜索功能
function getSearchData() {
  data.name = searchForm.keyword
  data.status = searchForm.status
  getData()
}

//搜索框重置
const resetSearchForm = () => {
  searchForm.keyword = ""
  searchForm.status=null
  getData()
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
  batchUpdateSort(editTable.value).then(res => {
    toast("保存排序值成功！")
  })


  loading.value = false
}

const handleTagStatus=(row)=>{
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
  updateTagStatus(data).then(res => {
    toast("修改状态成功！")
    getData()
  }).finally(() => {
    loading.value = false
  })
}


function getStatusText(status) {
  if (status === 1) {
    return "已上架";
  } else {
    return "未上架";
  }
}


function getTagType(tagType) {
  if (tagType === 1) {
    return "游戏标签";
  } else {
    return "其他标签";
  }
}

</script>


<style scoped>
.custom-button {
  margin-top: 10px;
}
</style>