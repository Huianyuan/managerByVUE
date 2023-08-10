<template>
  <div class="f-header">
        <span class="logo">
            <el-icon class="mr-1">
              <svg t="1691139095987" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5222" width="200" height="200"><path d="M896 767H129c-35.3 0-64-28.7-64-64V128.3c0-35.3 28.7-64 64-64h767c35.3 0 64 28.7 64 64V703c0 35.3-28.7 64-64 64z m-766.9-64H896l0.1-0.1V128.4l-0.1-0.1H129.1l-0.1 0.1 0.1 574.6c-0.1 0-0.1 0 0 0z" fill="#ffffff" p-id="5223"></path><path d="M383.1 592h-0.1c-27.5-0.1-41.8-27.8-48.8-41.2-8.1-15.6-16.4-35.9-24.5-55.5-6.4-15.6-13.1-31.7-19.3-44.7-2.3-4.8-4.2-8.6-5.9-11.6-4.8 3.8-11.3 9.9-19.8 19.4-11.8 13.2-20.5 25.3-20.6 25.4-10.3 14.4-30.3 17.7-44.6 7.4-14.4-10.3-17.7-30.3-7.4-44.6 0.5-0.7 12.8-17.9 28.9-35.2 26.7-28.8 49.1-42.2 70.3-42.4h0.3c13.1 0 25 6.2 35.3 18.4 5.1 6.1 10.3 14.1 15.7 24.5 8.8 16.8 17.7 38.3 26.2 59 3.7 9 8.9 21.6 14.1 33.3 8.3-17.2 17.6-38.2 24.5-53.5C451.2 352.3 473.9 305 511.6 305c34.4 0 63 34.2 105.9 90.5 7.4 9.7 17.3 22.7 24.9 31.6 11.1-9.8 33-32.8 72.2-85.5 32.6-43.8 60.5-85.9 60.8-86.3 9.7-14.7 29.6-18.8 44.3-9 14.7 9.7 18.8 29.6 9 44.3-1.3 2-32.7 49.4-69.2 97.7-21.7 28.8-40.8 52-56.5 68.7-26.8 28.5-45.3 40.1-63.9 40.1-17.9 0-31.3-12.5-43.2-25.9-8.9-10.1-18.8-23.1-29.4-37-11.9-15.6-24.2-31.8-35.9-44.9-6.2-7-11-11.7-14.5-14.8-3.8 5.6-9.1 14.6-16.3 28.8-11 21.6-22.7 47.9-34 73.3-11.5 25.8-22.3 50.1-32 68.8-5.8 11.2-10.7 19.3-15.3 25.6-3.8 5.3-15.5 21-35.4 21z m249.8-157.7z m-338.7-1.6z m213.5-64.3zM512.1 846.7c-38 0-74.1-7.6-101.7-21.4-33.1-16.5-51.3-40.5-51.3-67.6 0-13.8 11.2-25 25-25s25 11.2 25 25c0 13.7 39.1 38.9 103 38.9s103-25.2 103-38.9c0-13.8 11.2-25 25-25s25 11.2 25 25c0 27-18.2 51-51.3 67.6-27.6 13.8-63.7 21.4-101.7 21.4zM161 960c-17.7 0-32-14.3-32-32s14.3-32 32-32l703.4-0.7c17.7 0 32 14.3 32 32s-14.3 32-32 32L161 960z" fill="#ffffff" p-id="5224"></path></svg>
            </el-icon>
            后台管理
        </span>

    <el-tooltip effect="dark" content="回首页" placement="bottom">
      <el-icon class="icon-btn" @click="toIndex">
        <HomeFilled/>
      </el-icon>
    </el-tooltip>

    <el-tooltip effect="dark" content="刷新" placement="bottom">
      <el-icon class="icon-btn" @click="handleRefresh">
        <refresh/>
      </el-icon>
    </el-tooltip>

    <div class="ml-auto flex items-center">
      <el-tooltip effect="dark" content="全屏" placement="bottom">
        <el-icon class="icon-btn" @click="toggle">
          <full-screen v-if="!isFullscreen"/>
          <aim v-else/>
        </el-icon>
      </el-tooltip>

      <el-dropdown class="dropdown" @command="handleCommand">
                <span class="flex items-center text-light-50">
                    <el-avatar class="mr-2" :size="25" src="src/assets/avatar1.png"/>
                    {{ $store.state.user.username }}
                    <el-icon class="el-icon--right">
                        <arrow-down/>
                    </el-icon>
                </span>
        <template #dropdown>
          <el-dropdown-menu>
            <!--<el-dropdown-item command="rePassword">修改密码</el-dropdown-item>-->
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>

  <!--    <form-drawer ref="formDrawerRef" title="修改密码" destroyOnClose @submit="onSubmit">-->
  <!--        <el-form ref="formRef" :rules="rules" :model="form" label-width="80px" size="small">-->
  <!--            <el-form-item prop="oldpassword" label="旧密码">-->
  <!--                <el-input v-model="form.oldpassword" placeholder="请输入旧密码"></el-input>-->
  <!--            </el-form-item>-->
  <!--            <el-form-item prop="password" label="新密码">-->
  <!--                <el-input type="password" v-model="form.password" placeholder="请输入密码" show-password></el-input>-->
  <!--            </el-form-item>-->
  <!--            <el-form-item prop="repassword" label="确认密码">-->
  <!--                <el-input type="password" v-model="form.repassword" placeholder="请输入确认密码" show-password></el-input>-->
  <!--            </el-form-item>-->
  <!--        </el-form>-->
  <!--    </form-drawer>-->

</template>
<script setup>
import FormDrawer from '~/components/FormDrawer.vue'
import {useFullscreen} from '@vueuse/core'
import {useRepassword, useLogout} from "~/composables/useManager"
import {HomeFilled, Refresh} from "@element-plus/icons-vue";
import router from "~/router";

const {
  // 是否全屏状态
  isFullscreen,
  // 切换全屏
  toggle
} = useFullscreen()

const {
  formDrawerRef,
  form,
  rules,
  formRef,
  onSubmit,
  openRePasswordForm
} = useRepassword()

const {
  handleLogout
} = useLogout()

const handleCommand = (c) => {
  switch (c) {
    case "logout":
      handleLogout()
      break;
    case "rePassword":
      openRePasswordForm()
      break;
  }
}

// 刷新
const handleRefresh = () => {
  location.reload()
  router.push('/')
}

//回首页
const toIndex = () => {
  router.push('/')
}

</script>
<style>
.f-header {
  @apply flex items-center bg-indigo-700 text-light-50 fixed top-0 left-0 right-0;
  height: 64px;
  z-index: 1000;
}

.logo {
  width: 250px;
  @apply flex justify-center items-center text-xl font-thin;
}

.icon-btn {
  @apply flex justify-center items-center;
  width: 42px;
  height: 64px;
  cursor: pointer;
}

.icon-btn:hover {
  @apply bg-indigo-600;
}

.f-header .dropdown {
  height: 64px;
  cursor: pointer;
  @apply flex justify-center items-center mx-5;
}
</style>