<template>
  <el-container>

    <el-header>
      <f-header/>
    </el-header>

    <el-container>
      <el-aside>
        <f-menu></f-menu>
      </el-aside>

      <el-main>
        <router-view v-slot="{Component}">
          <transition name="fade">
              <component :is="Component"></component>
          </transition>
        </router-view>
      </el-main>

    </el-container>
  </el-container>
</template>
<script setup>
import FHeader from './components/FHeader.vue';
import FMenu from './components/FMenu.vue';
</script>

<style>
.el-aside{
  transition: all 0.2s;
}
.fade-enter-from{
  opacity: 0;
}
.fade-enter-to{
  opacity: 1;
}
.fade-leave-from{
  opacity: 1;
}
.fade-leave-to{
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active{
  transition: all 0.3s;
}
.fade-enter-active{
  transition-delay: 0.3s;
}
</style>