<template>
  <n-layout has-sider>
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      :collapsed="collapsed"
      show-trigger
      @collapse="collapsed = true"
      @expand="collapsed = false"
    >
      <div class="logo">
        <img src="@/assets/logo.png" alt="logo" />
        <span v-if="!collapsed">系统菜单</span>
      </div>
      <n-menu
        :collapsed="collapsed"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
      />
    </n-layout-sider>

    <n-layout>
      <n-layout-header bordered>
        <div class="header-content">
          <div class="header-left">
            <n-button quaternary @click="collapsed = !collapsed">
              <template #icon>
                <n-icon size="20">
                  <MenuOutline />
                </n-icon>
              </template>
            </n-button>
          </div>
          <div class="header-right">
            <n-dropdown :options="userOptions" @select="handleUserSelect">
              <n-button quaternary>
                管理员
                <n-icon size="14">
                  <ChevronDownOutline />
                </n-icon>
              </n-button>
            </n-dropdown>
          </div>
        </div>
      </n-layout-header>

      <n-layout-content content-style="padding: 24px;">
        <router-view></router-view>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { h, ref } from 'vue'
import { NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import {
  HomeOutline,
  GameControllerOutline,
  MenuOutline,
  ChevronDownOutline
} from '@vicons/ionicons5'

const collapsed = ref(false)

// 渲染图标的函数
function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

// 菜单配置
const menuOptions: MenuOption[] = [
  {
    label: '首页',
    key: 'dashboard',
    icon: renderIcon(HomeOutline)
  },
  {
    label: '贪吃蛇游戏',
    key: 'snake-game',
    icon: renderIcon(GameControllerOutline)
  }
]

// 用户下拉菜单选项
const userOptions = [
  {
    label: '个人信息',
    key: 'profile'
  },
  {
    label: '退出登录',
    key: 'logout'
  }
]

// 处理用户菜单选择
const handleUserSelect = (key: string) => {
  if (key === 'logout') {
    // 处理退出登录
  }
}
</script>

<style scoped>
.logo {
  height: 64px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo img {
  width: 32px;
  height: 32px;
}

.header-content {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
</style> 