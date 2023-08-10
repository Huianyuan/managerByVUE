
<template>

  <el-card shadow="naver">
    <!--    <template #header >-->
    <div class="flex justify-between">
      <span class="text-sm">留存率</span>
      <div>
        <div>
          <el-check-tag v-for="(item,index) in options" :key="index"
                        :checked="current === item.value"
                        @click="handleChoose(item.value)"
                        style="margin-right: 8px">{{ item.text }}
          </el-check-tag>
        </div>
      </div>
    </div>
    <!--    </template>-->
    <div id="memberRetentionDiv" style="width: 100%;height: 300px;"></div>
    <div style="font-size: 10px; color: grey;">注：每天的7日留存率和15日留存率，表示从当天往前推7天或15天，然后统计注册人数，再除以当天登录过的用户数，得到留存率</div>

  </el-card>

</template>
<script setup>
import * as echarts from 'echarts';
import {ref, onMounted, onBeforeUnmount} from 'vue'
import {memberRetention} from "~/api/dataStatistic";

const current = ref(7)
const options = [{
  text: "7日留存",
  value: 7
},
  {
    text: "15日留存",
    value: 15
  }
]

let memberRetentionDiv = null

onMounted(() => {
  // 初始化图表
  memberRetentionDiv = echarts.init(document.getElementById('memberRetentionDiv'));
  // 获取数据
  getMemberRetention(current.value)

})

// 释放echarts对象，非常重要，没有释放的话，打包之后会出现白屏现象
onBeforeUnmount(() => {
  if (memberRetentionDiv) {
    echarts.dispose(memberRetentionDiv)
  }
})


const handleChoose = (value) => {
  current.value = value
  getMemberRetention(value)
}


function getMemberRetention(type = 7) {
  memberRetentionDiv.showLoading();

  var option;

  option = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b} <br/> 留存率：{c}%'
    },
    xAxis: {
      type: 'category',
      data: []
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}%'
      }
    },
    series: [
      {
        name: '留存率',
        type: 'line',
        data: []
      }
    ]
  };

  let param = {"dayCount": current.value};
  memberRetention(param).then(res => {
    console.log(res)
    option.xAxis.data = res.result.resuleDateX;
    option.series[0].data = res.result.resuleDateY;
    option && memberRetentionDiv.setOption(option);
  }).finally(() => {
    memberRetentionDiv.hideLoading();
  })
}


</script>
<style scoped>


</style>