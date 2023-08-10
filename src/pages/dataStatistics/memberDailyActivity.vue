<!-- 用户日活 -->
<template>

  <el-card shadow="naver" >
<!--    <template #header >-->
      <div class="flex justify-between">
        <span class="text-sm">用户日活</span>
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
    <div id="memberDailyActivityDiv" style="width: 100%;height: 300px;"></div>
    <div style="font-size: 10px; color: grey;">注：每日活跃用户，登陆过即算活跃</div>

  </el-card>

</template>
<script setup>
import * as echarts from 'echarts';
import { ref,onMounted,onBeforeUnmount  } from 'vue'
import {memberDailyActivity} from "~/api/dataStatistic";

const current =ref(7)
const options = [{
  text:"近1周",
  value:7
},
  {
    text:"近2周",
    value:15
  }
]



let myChart = null

onMounted(()=>{
  // 初始化图表
  myChart = echarts.init(document.getElementById('memberDailyActivityDiv'));
  // 获取数据
  getData(current.value)

})

// 释放echarts对象，非常重要，没有释放的话，打包之后会出现白屏现象
onBeforeUnmount(()=>{
  if (myChart) {
    echarts.dispose(myChart)
  }
})


const handleChoose = (v)=> {
  current.value = v
  getData(v)
}


function getData(type = 7){
  myChart.showLoading();

  var option;

  option = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b} <br/> 活跃数：{c}'
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
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        }
      }
    ]
  };

  let param = {"dayCount":current.value};
  memberDailyActivity( param ).then(res=>{
    option.xAxis.data = res.result.resuleDateX;
    option.series[0].data = res.result.resuleDateY;
    option && myChart.setOption(option);
  }).finally(() => {
    myChart.hideLoading();
  })
}


</script>

<style scoped>


</style>