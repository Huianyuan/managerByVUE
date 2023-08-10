<!-- 日新增用户 -->
<template>

  <el-card shadow="naver">
    <!--    <template #header >-->
    <div class="flex justify-between">
      <span class="text-sm">日新增用户</span>
      <div>
        <div>
          <el-check-tag v-for="(item,index) in options" :key="index"
                        :checked="current == item.value"
                        @click="handleChoose(item.value)"
                        style="margin-right: 8px">{{ item.text }}  </el-check-tag>
        </div>
      </div>
    </div>
    <!--    </template>-->
    <div id="newMemberCountDiv" style="width: 100%;height: 300px;"></div>
    <div style="font-size: 10px; color: grey;">注：每日新增用户，特指注册用户</div>

  </el-card>

</template>
<script setup>
import * as echarts from 'echarts';
import { ref,onMounted,onBeforeUnmount  } from 'vue'
import {memberDailyActivity, newMemberCount} from "~/api/dataStatistic";

const current = ref(7)
const options = [{
  text: "近1周",
  value: 7
},
  {
    text: "近2周",
    value: 15
  }
]

let newMemberCountDiv = null

onMounted(() => {
  // 初始化图表
  newMemberCountDiv = echarts.init(document.getElementById('newMemberCountDiv'));
  // 获取数据
  getNewMemberCountData(current.value)

})

// 释放echarts对象，非常重要，没有释放的话，打包之后会出现白屏现象
onBeforeUnmount(() => {
  if (newMemberCountDiv) {
    echarts.dispose(newMemberCountDiv)
  }
})


const handleChoose = (v) => {
  current.value = v
  getNewMemberCountData(v)
}


function getNewMemberCountData(type = 7) {
  newMemberCountDiv.showLoading();

  var option;

  option = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b} <br/> 新增：{c}'
    },
    xAxis: {
      type: 'category',
      data: []
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [],
        type: 'line',
        smooth: true
      }
    ]
  };

  let param = {"dayCount":current.value};
  newMemberCount( param ).then(res=>{
    option.xAxis.data = res.result.resuleDateX;
    option.series[0].data = res.result.resuleDateY;
    option && newMemberCountDiv.setOption(option);
  }).finally(() => {
    newMemberCountDiv.hideLoading();
  })
}


</script>

<style scoped>


</style>