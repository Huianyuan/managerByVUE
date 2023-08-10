<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12" :offset="0">
        <memberDailyActivity/>
      </el-col>
      <el-col :span="12" :offset="0">
        <newMemberCount/>
      </el-col>
      <el-col :span="12" :offset="0"></el-col>
    </el-row>
  </div>
  <div style="margin-top: 15px">
    <el-row :gutter="20">
      <el-col :span="12" :offset="0">
        <member-retention/>
      </el-col>
<!--      <el-col :span="16" :offset="0">-->
<!--        <gameClickTimes/>-->
<!--      </el-col>-->
    </el-row>
  </div>
  <div style="margin-top: 15px">
    <el-row :gutter="20">
      <el-col :span="24" :offset="0">
        <gameClickTimes/>
      </el-col>
    </el-row>
  </div>


</template>

<script setup>
import { ref } from "vue";
import memberDailyActivity from "~/pages/dataStatistics/memberDailyActivity.vue";
import newMemberCount from "~/pages/dataStatistics/newMemberCount.vue";

import gameClickTimes from "~/pages/dataStatistics/gameClickTimes.vue";
import MemberRetention from "~/pages/dataStatistics/memberRetention.vue";
</script>

<style scoped>


</style>