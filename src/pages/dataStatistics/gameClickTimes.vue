<!-- 日新增用户 -->
<template>

  <el-card shadow="naver" >
    <!--    <template #header >-->
    <div class="flex justify-between">
      <span class="text-sm"> 游戏点击次数</span>
      <div>
        <div>
          <el-check-tag @click="toGameClickTimesData"
                        style="margin-right: 8px">更多... </el-check-tag>
        </div>
      </div>
    </div>
    <!--    </template>-->
    <div id="gameStartTimesDiv" style="width: 100%;height: 300px;"></div>
    <div style="font-size: 10px; color: grey;">注：每款游戏的点击次数，点击右上角更多，查看游戏详情</div>

  </el-card>

</template>
<script setup>
import * as echarts from 'echarts';
import { ref,onMounted,onBeforeUnmount  } from 'vue'
import {gameStartTimes} from "~/api/dataStatistic";
import router from "~/router";

const current =ref(7)

let gameStartTimesDiv = null

onMounted(()=>{
  // 初始化图表
  gameStartTimesDiv = echarts.init(document.getElementById('gameStartTimesDiv'));
  // 获取数据
  gameStartTimesData(current.value)

})

// 释放echarts对象，非常重要，没有释放的话，打包之后会出现白屏现象
onBeforeUnmount(()=>{
  if (gameStartTimesDiv) {
    echarts.dispose(gameStartTimesDiv)
  }
})

function gameStartTimesData(){
  gameStartTimesDiv.showLoading();

  var option;

  option = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b} <br/> 点击次数：{c}'
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
        type: 'bar'
      }
    ]
  };

  option && gameStartTimesDiv.setOption(option);

  let param = {"pageSize":20};
  gameStartTimes( param ).then(res=>{
    option.xAxis.data = res.result.resuleDateX;
    option.series[0].data = res.result.resuleDateY;
    option && gameStartTimesDiv.setOption(option);
  }).finally(() => {
    gameStartTimesDiv.hideLoading();
  })
}


const toGameClickTimesData = () => {
  router.push( "/gameClickTimesData")
}


</script>

<style scoped>


</style>