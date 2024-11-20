<template>
  <div class="login-container">
    <div class="cyber-card">
      <div class="card-header">
        <div class="title">{{ isRegister ? '用户注册' : '系统登录' }}</div>
        <div class="cyber-line"></div>
      </div>

      <n-form
        ref="formRef"
        :model="formValue"
        :rules="rules"
        label-placement="left"
        class="cyber-form"
      >
        <n-form-item path="username" label="账号">
          <n-input
            v-model:value="formValue.username"
            placeholder="请输入账号"
            :disabled="isRegister"
          >
            <template #prefix>
              <n-icon><PersonOutline /></n-icon>
            </template>
          </n-input>
        </n-form-item>

        <n-form-item path="password" label="密码">
          <n-input
            v-model:value="formValue.password"
            type="password"
            show-password-on="click"
            placeholder="请输入密码"
            @keydown.enter.prevent="handleSubmit"
          >
            <template #prefix>
              <n-icon><LockClosedOutline /></n-icon>
            </template>
          </n-input>
        </n-form-item>

        <template v-if="isRegister">
          <n-form-item path="nickname" label="昵称">
            <n-input
              v-model:value="formValue.nickname"
              placeholder="请输入昵称"
            >
              <template #prefix>
                <n-icon><IdCardOutline /></n-icon>
              </template>
            </n-input>
          </n-form-item>

          <n-form-item path="confirmPassword" label="确认密码">
            <n-input
              v-model:value="formValue.confirmPassword"
              type="password"
              show-password-on="click"
              placeholder="请再次输入密码"
            >
              <template #prefix>
                <n-icon><LockClosedOutline /></n-icon>
              </template>
            </n-input>
          </n-form-item>
        </template>

        <div class="action-buttons">
          <n-button
            type="primary"
            class="cyber-button"
            :loading="loading"
            @click="handleSubmit"
          >
            {{ isRegister ? '注册' : '登录' }}
          </n-button>

          <n-button
            class="cyber-button switch-button"
            @click="switchMode"
          >
            {{ isRegister ? '返回登录' : '注册账号' }}
          </n-button>
        </div>
      </n-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import type { FormInst } from 'naive-ui'
import { PersonOutline, LockClosedOutline, IdCardOutline } from '@vicons/ionicons5'

const router = useRouter()
const message = useMessage()
const formRef = ref<FormInst | null>(null)
const loading = ref(false)
const isRegister = ref(false)

// 表单数据
const formValue = ref({
  username: '',
  password: '',
  nickname: '',
  confirmPassword: ''
})

// 生成随机账号
function generateUserId() {
  const min = 10000000
  const max = 99999999
  return Math.floor(Math.random() * (max - min + 1) + min).toString()
}

// 表单验证规则
const rules = computed(() => {
  const baseRules = {
    username: [
      { required: true, message: '请输入账号', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
    ]
  }

  if (isRegister.value) {
    return {
      ...baseRules,
      nickname: [
        { required: true, message: '请输入昵称', trigger: 'blur' },
        { min: 2, max: 10, message: '昵称长度在2-10个字符', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '请确认密码', trigger: 'blur' },
        {
          validator: (rule: any, value: string) => {
            return value === formValue.value.password
          },
          message: '两次输入的密码不一致',
          trigger: 'blur'
        }
      ]
    }
  }

  return baseRules
})

// 切换登录/注册模式
function switchMode() {
  isRegister.value = !isRegister.value
  formValue.value = {
    username: '',
    password: '',
    nickname: '',
    confirmPassword: ''
  }
  if (isRegister.value) {
    formValue.value.username = generateUserId()
  }
}

// 处理提交
async function handleSubmit() {
  loading.value = true
  try {
    await formRef.value?.validate()
    
    if (isRegister.value) {
      // 处理注册逻辑
      localStorage.setItem(formValue.value.username, JSON.stringify({
        password: formValue.value.password,
        nickname: formValue.value.nickname
      }))
      message.success('注册成功')
      isRegister.value = false
      formValue.value = {
        username: '',
        password: '',
        nickname: '',
        confirmPassword: ''
      }
    } else {
      // 处理登录逻辑
      if (formValue.value.username === 'admin' && formValue.value.password === '123456') {
        message.success('登录成功')
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('currentUser', 'admin')
        router.push('/snake-game')
        return
      }

      const userData = localStorage.getItem(formValue.value.username)
      if (userData) {
        const user = JSON.parse(userData)
        if (user.password === formValue.value.password) {
          message.success('登录成功')
          localStorage.setItem('isLoggedIn', 'true')
          localStorage.setItem('currentUser', formValue.value.username)
          router.push('/snake-game')
        } else {
          message.error('密码错误')
        }
      } else {
        message.error('账号不存在')
      }
    }
  } catch (err) {
    // 表单验证失败
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #000428 0%, #004e92 100%);
  padding: 20px;
}

.cyber-card {
  width: 400px;
  padding: 30px;
  background: rgba(13, 17, 23, 0.95);
  border: 1px solid #00ffff33;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.cyber-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00ffff);
  animation: scanline 3s linear infinite;
}

.card-header {
  margin-bottom: 30px;
}

.title {
  color: #00ffff;
  font-size: 24px;
  text-align: center;
  margin-bottom: 10px;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

.cyber-line {
  height: 2px;
  background: linear-gradient(90deg, #00ffff33, #00ffff, #00ffff33);
  margin: 10px 0;
}

.cyber-form :deep(.n-form-item-label) {
  color: #00ffff !important;
}

.cyber-form :deep(.n-input) {
  background: rgba(0, 255, 255, 0.1) !important;
  border: 1px solid #00ffff33 !important;
}

.cyber-form :deep(.n-input:hover),
.cyber-form :deep(.n-input:focus) {
  border-color: #00ffff !important;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.3) !important;
}

.cyber-form :deep(.n-input__input) {
  color: #00ffff !important;
}

.cyber-form :deep(.n-input__placeholder) {
  color: rgba(0, 255, 255, 0.5) !important;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
}

.cyber-button {
  background: linear-gradient(45deg, #000428, #004e92) !important;
  border: 1px solid #00ffff33 !important;
  color: #00ffff !important;
  height: 40px;
  font-size: 16px;
  position: relative;
  overflow: hidden;
}

.cyber-button::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #00ffff, #00ffff33);
  z-index: -1;
  animation: borderGlow 2s linear infinite;
}

.cyber-button:hover {
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.3) !important;
}

.switch-button {
  background: transparent !important;
}

@keyframes scanline {
  0% {
    left: -100%;
  }
  50%, 100% {
    left: 100%;
  }
}

@keyframes borderGlow {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
}
</style> 