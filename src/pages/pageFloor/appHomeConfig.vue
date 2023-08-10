<template>
  <el-card shadow="never" class="border-0">
    <template #header>
      <div class="card-header">
        <span>App首页配置</span>
      </div>
    </template>

    <!-- 主体展示table-->
    <el-table :data="groupListTableData" style="width: 100%" v-loading="loading" calss="el-table__fixed-body-wrapper"
              header-align="center" @selection-change="handleSelectionChange">

      <el-table-column type="selection" width="55"/>

      <el-table-column prop="sort" label="排序" width="60px">
        <template #default="{ row }">
          <el-input v-model="row.sort" size="small" @input="onSortInput(row)"></el-input>
        </template>
      </el-table-column>

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
          <el-switch :model-value="row.status" :active-value="1" :inactive-value="0"
                     @click="handleGroupStatus(row,2)"/>
          {{ getStatusText(row.status) }}
        </template>
      </el-table-column>

    </el-table>
    <div style="display: flex;justify-content: space-between;margin-top: 10px">
      <div>
        <el-button type="primary" @click="handleSortSubmit">保存排序</el-button>
      </div>

      <div>
          <el-button type="primary"   @click="handleCorrelate" style="margin-left: -10px;">
            进行关联
          </el-button>
        <el-button type="danger" @click="handleUnlinkSubmit">解除关联</el-button>
      </div>
    </div>


    <!--分组列表弹框-->
    <el-dialog v-model="groupListDialogVisible" title="PageFloor关联的分组列表" width="60%" draggable destroy-on-close>

      <el-table :data="groupListTableData" style="width: 100%" v-loading="loading" calss="el-table__fixed-body-wrapper"
                header-align="center" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"/>

        <el-table-column prop="sort" label="排序">
          <template #default="{ row }">
            <el-input v-model="row.sort" size="small" @input="onSortInput(row)"></el-input>
          </template>
        </el-table-column>

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
            <el-switch :model-value="row.status" :active-value="1" :inactive-value="0"
                       @click="handleGroupStatus(row,2)"/>
            {{ getStatusText(row.status) }}
          </template>
        </el-table-column>

      </el-table>

      <template #footer>
        <div style="display: flex;justify-content: space-between">
          <div>
            <el-button type="danger" @click="handleUnlinkSubmit">解除关联</el-button>
            <el-button type="primary" @click="handleSortSubmit">保存排序</el-button>
          </div>
          <div>
            <el-button type="danger" @click="handleCancelDialog">关闭</el-button>
          </div>
        </div>
      </template>
    </el-dialog>

    <!--进行关联弹框-->
    <el-dialog v-model="unlinkGroupDialogVisible" title="进行关联" width="60%" draggable destroy-on-close>
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
                <el-option label="已上架" :value="1"/>
                <el-option label="未上架" :value="0"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="0">
            <div class="flex items-center justify-end">
              <el-button type="primary" @click="getSearchData(3)">搜索</el-button>
              <el-button @click="resetSearchForm(3)">重置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>

      <el-table :data="tableGroupData" style="width: 100%" v-loading="loading" calss="el-table__fixed-body-wrapper"
                header-align="center" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"/>

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
            <el-switch :model-value="row.status" :active-value="1" :inactive-value="0"
                       @click="handleGroupStatus(row,3)"/>
            {{ getStatusText(row.status) }}
          </template>
        </el-table-column>

      </el-table>

      <template #footer>
        <div style="display: flex;justify-content: space-between">
          <div>
            <el-button type="danger" @click="handleCorrelateSuccess">提交关联</el-button>
          </div>
          <!-- 分页 -->
          <el-pagination background layout="prev,pager,next" :total="totalGroup" :current-page="currentPageGroup"
                         :page-size="limitGroup" @current-change=""/>
          <div>
            <el-button type="danger" @click="handleCancelDialog">关闭</el-button>
          </div>
        </div>
      </template>
    </el-dialog>

  </el-card>

</template>


<script setup>
import {computed, reactive, ref} from "vue";
import FromDrawer from "~/components/FormDrawer.vue";
import {toast} from "~/composables/util";
import {
  updateAdvertGroup,
  getExGroupByQuery,
  updateAdGroupStatus
} from "~/api/groupAd";
import {
  getAllPageFloor,
  updatePageFloorStatus,
  getPageFloorByFloorId,
  floorLinkGroup,
  updateSort, floorUnlinkGroup
} from "~/api/pageFloor";

const pageFloorId = ref(1)

const groupListDialogVisible = ref(false)
const unlinkGroupDialogVisible = ref(false)

const groupListTableData = ref([])
//表单
const linkForm = reactive({
  bannerList: [
    {
      floorLinkGroupId: "",
      id: "",
    }
  ],
  id: "",
  title: "",
  status: "",
  description: ""
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
// 抽屉组件-end

//搜索表单
const searchForm = reactive({
  keyword: "",
  status: null,
})

const loading = ref(false)

//重置表单
function resetForm(row = null) {
  if (formRef.value) formRef.value.clearValidate()
  if (row) {
    for (const key in linkForm) {
      linkForm[key] = row[key]
    }
  }
}

//ad表单
const multipleSelection = ref([])
const tableGroupData = ref([])//进行关联 按钮 点击时获取当前floor未包含的分组数据


function getGroupList(floorId) {
  loading.value = true
  getPageFloorByFloorId(floorId)
      .then(res => {
        resetForm(groupListTableData)
        groupListTableData.value = res.result.bannerList
      }).finally(() => {
    loading.value = false
  })
}

getGroupList(1)

// 弹窗分页
const currentPageGroup = ref(1)
const totalGroup = ref(0)
const limitGroup = ref(6)

// 关联时，获取分组的数据
let dataGroup

function getGroupData(p = null) {
  dataGroup = {
    "title": searchForm.keyword,
    "pageNo": currentPageGroup.value,
    "pageSize": limitGroup.value,
    "status": searchForm.status,
    "floorId": pageFloorId.value
  }
  if (typeof p == "number") {
    dataGroup.pageNo = p
  }
  // loading.value = true

  getExGroupByQuery(dataGroup)
      .then(res => {
        tableGroupData.value = res.result.records
        totalGroup.value = res.result.total_record
        currentPageGroup.value = res.result.page
      }).finally(() => {
    loading.value = false
  })
}

//关联 选项
const handleCorrelate = () => {
  loading.value = true
  linkForm.id = pageFloorId.value
  getGroupData()
  unlinkGroupDialogVisible.value = true
}
//监听行变化
const handleSelectionChange = (row) => {
  multipleSelection.value = row
}
//提交关联
const handleCorrelateSuccess = () => {
  //linkForm 表单填充，两个东西：pageFloorId 和 groupList.
  linkForm.bannerList = multipleSelection.value
  floorLinkGroup(linkForm).then(res => {
    if (res.code === 200) {
      toast("关联成功！")
      getGroupData()
      multipleSelection.value = []
    } else {
      toast(res.message, "error")
    }
  })
}

//解除关联
const handleUnlinkSubmit = () => {
  linkForm.id = pageFloorId.value
  linkForm.bannerList = multipleSelection.value
  floorUnlinkGroup(linkForm).then(res => {
    toast("解除关联成功！")
    getGroupList(pageFloorId.value)
  })
}

//搜索功能
const getSearchData = (flag) => {
  if (flag === 3) {
    // 关联 按钮
    getGroupData()
  }
}

//搜索框重置
const resetSearchForm = (flag) => {
  searchForm.keyword = ""
  searchForm.status = ""
  if (flag === 3) {
    // 关联 按钮
    getGroupData()
  }

}

//记录修改排序值后的整行字段
const editSortTable = ref([])

// 表单中排序值修改，监听
function onSortInput(row) {
  if (!editSortTable.value.includes(row)) {
    editSortTable.value.push(row)
  }
}

const handleSortSubmit = () => {
  // loading.value = true
  linkForm.bannerList = editSortTable.value
  linkForm.id = pageFloorId.value
  updateSort(linkForm).then(res => {
    if (res.code === 200) {
      toast("保存排序值成功！")

      resetForm({
        bannerList: [
          {
            id: "",
            sort: "",
            status: "",
            groupLinkAdId: "",
          }
        ],
        id: "",
      })
      editSortTable.value = []
      getGroupList(pageFloorId.value)
    } else {
      toast(res.message)
    }
  }).finally(() => {
    loading.value = false
  })
}

//弹窗关闭
const handleCancelDialog = () => {
  groupListDialogVisible.value = false
  unlinkGroupDialogVisible.value = false
  getGroupList(1)
}

//group状态  弹窗中 修改后数据更新操作
const handleGroupStatus = (row, flag) => {
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
  // 变更ad状态
  updateAdGroupStatus(data).then(res => {
    toast("修改状态成功！")
    if (flag === 3) {
      getGroupData()
    }
    if (flag === 2) {
      getGroupList(pageFloorId.value)
    }
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