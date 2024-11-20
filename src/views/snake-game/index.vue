<template>
  <div class="game-container">
    <n-space vertical size="large" style="width: 100%; max-width: 1200px;">
      <!-- 用户信息卡片 -->
      <n-card class="user-card">
        <n-space justify="space-between" align="center">
          <n-space align="center">
            <n-avatar
              round
              :size="48"
              :src="currentUserData.avatar || 'https://api.dicebear.com/7.x/pixel-art/svg?seed=' + currentUser"
            />
            <n-space vertical :size="4">
              <span class="user-nickname">{{ currentUserData.nickname || currentUser }}</span>
              <span class="user-id">ID: {{ currentUser }}</span>
            </n-space>
          </n-space>
          <n-button class="logout-button" @click="handleLogout">
            退出登录
          </n-button>
        </n-space>
      </n-card>

      <n-grid :cols="24" :x-gap="24">
        <!-- 游戏主区域 -->
        <n-grid-item :span="16">
          <n-card title="贪吃蛇游戏" class="game-card">
            <!-- 游戏控制面板 -->
            <div class="control-panel tech-panel">
              <n-space vertical>
                <n-space>
                  <n-select
                    v-model:value="difficulty"
                    :options="difficultyOptions"
                    placeholder="选择难度"
                    :disabled="isPlaying"
                    style="width: 100px"
                    class="tech-select"
                  />
                  <n-switch v-model:value="soundEnabled" size="large" class="tech-switch">
                    <template #checked>
                      声音开
                    </template>
                    <template #unchecked>
                      声音关
                    </template>
                  </n-switch>
                </n-space>
                <n-space>
                  <n-button @click="startGame" :disabled="isPlaying" class="tech-button">
                    开始游戏
                  </n-button>
                  <n-button @click="pauseGame" :disabled="!isPlaying" class="tech-button">
                    {{ isPaused ? '继续' : '暂停' }}
                  </n-button>
                </n-space>
              </n-space>
            </div>

            <!-- 游戏画布 -->
            <div class="canvas-wrapper tech-border">
              <div class="canvas-container" :class="{ paused: isPaused }">
                <canvas ref="gameCanvas" width="400" height="400" class="game-canvas"></canvas>
                <div v-if="isPaused" class="pause-overlay">
                  <n-icon size="48" class="pause-icon">
                    <PauseCircleOutline />
                  </n-icon>
                  <div>游戏已暂停</div>
                </div>
              </div>
            </div>

            <!-- 操作说明 -->
            <div class="instructions tech-panel">
              <n-space vertical size="small">
                <div class="tech-text">操作说明：</div>
                <div class="tech-text">↑↓←→ 控制方向</div>
                <div class="tech-text">空格键 暂停/继续</div>
              </n-space>
            </div>
          </n-card>
        </n-grid-item>

        <!-- 排行榜和历史记录 -->
        <n-grid-item :span="8">
          <n-space vertical :size="24" style="height: 100%">
            <!-- 排行榜 -->
            <n-card title="排行榜" class="rank-card">
              <n-list>
                <n-list-item v-for="(user, index) in leaderboard" :key="user.username">
                  <n-space align="center">
                    <div class="rank-number" :class="'rank-' + (index + 1)">
                      {{ index + 1 }}
                    </div>
                    <n-avatar
                      round
                      :size="32"
                      :src="user.avatar || 'https://api.dicebear.com/7.x/pixel-art/svg?seed=' + user.username"
                    />
                    <span class="rank-name">{{ user.nickname || user.username }}</span>
                    <span class="rank-score">{{ user.highScore }}</span>
                  </n-space>
                </n-list-item>
              </n-list>
            </n-card>

            <!-- 历史记录 -->
            <n-card title="游戏历史" class="history-card">
              <n-list>
                <n-list-item v-for="(record, index) in gameHistory" :key="index">
                  <n-space vertical :size="4">
                    <n-space justify="space-between">
                      <span class="history-score">得分：{{ record.score }}</span>
                      <span class="history-duration">时长：{{ formatDuration(record.duration) }}</span>
                    </n-space>
                    <span class="history-date">{{ formatDate(record.date) }}</span>
                  </n-space>
                </n-list-item>
              </n-list>
            </n-card>
          </n-space>
        </n-grid-item>
      </n-grid>
    </n-space>

    <!-- 游戏结束对话框 -->
    <n-modal v-model:show="showGameOver" preset="dialog" title="游戏结束">
      <div class="game-over-content">
        游戏已结束，当前得分：{{ score }}
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { PauseCircleOutline } from '@vicons/ionicons5'
import { userManager } from '@/utils/userManager'

const message = useMessage()
const gameCanvas = ref<HTMLCanvasElement | null>(null)
const score = ref(0)
const isPlaying = ref(false)
const isPaused = ref(false)
const showGameOver = ref(false)
const highScore = ref(Number(localStorage.getItem('snakeHighScore') || '0'))
const soundEnabled = ref(localStorage.getItem('snakeSoundEnabled') !== 'false')
const difficulty = ref('normal')
const router = useRouter()
const showLogoutConfirm = ref(false)
const currentUser = ref(localStorage.getItem('currentUser') || '')
const gameStartTime = ref(0)
const leaderboard = ref(userManager.getLeaderboard())
const currentUserData = computed(() => {
  const userData = JSON.parse(localStorage.getItem(currentUser.value) || '{}')
  return userData
})
const gameHistory = computed(() => {
  return currentUserData.value.gameHistory || []
})

// 音效
const sounds = {
  eat: new Audio('/sounds/eat.mp3'),
  die: new Audio('/sounds/die.mp3'),
  move: new Audio('/sounds/move.mp3')
}

// 难度设置
const difficultyOptions = [
  { label: '简单', value: 'easy', speed: 200 },
  { label: '普通', value: 'normal', speed: 150 },
  { label: '困难', value: 'hard', speed: 100 }
]

// 游戏配置
const GRID_SIZE = 20
let GAME_SPEED = 150

// 游戏状态
let snake: Array<{ x: number; y: number }> = []
let food: { x: number; y: number } = { x: 0, y: 0 }
let direction = 'right'
let gameInterval: ReturnType<typeof setInterval> | null = null

// 播放音效
function playSound(type: keyof typeof sounds) {
  if (soundEnabled.value) {
    sounds[type].currentTime = 0
    sounds[type].play()
  }
}

// 暂停游戏
function pauseGame() {
  if (!isPlaying.value) return
  
  if (isPaused.value) {
    isPaused.value = false
    gameInterval = setInterval(moveSnake, GAME_SPEED)
  } else {
    isPaused.value = true
    if (gameInterval) {
      clearInterval(gameInterval)
      gameInterval = null
    }
  }
}

// 初始化蛇的位置
function initSnake() {
  snake = [
    { x: 3, y: 1 },
    { x: 2, y: 1 },
    { x: 1, y: 1 }
  ]
  direction = 'right'
}

// 生成食物
function generateFood() {
  const maxPos = 400 / GRID_SIZE - 1
  food = {
    x: Math.floor(Math.random() * maxPos),
    y: Math.floor(Math.random() * maxPos)
  }
  while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
    food = {
      x: Math.floor(Math.random() * maxPos),
      y: Math.floor(Math.random() * maxPos)
    }
  }
}

// 绘制游戏
function draw() {
  const ctx = gameCanvas.value?.getContext('2d')
  if (!ctx) return

  // 清空画布
  ctx.clearRect(0, 0, 400, 400)

  // 绘制科技风格背景网格
  ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)'
  ctx.lineWidth = 0.5
  
  // 绘制小网格
  for (let i = 0; i <= 400; i += GRID_SIZE / 2) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i, 400)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, i)
    ctx.lineTo(400, i)
    ctx.stroke()
  }

  // 绘制主网格
  ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)'
  ctx.lineWidth = 1
  for (let i = 0; i <= 400; i += GRID_SIZE) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i, 400)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, i)
    ctx.lineTo(400, i)
    ctx.stroke()
  }

  // 绘制蛇
  snake.forEach((segment, index) => {
    // 创建发光效果
    ctx.shadowBlur = 15
    ctx.shadowColor = '#00ffff'

    if (index === 0) {
      // 蛇头
      ctx.fillStyle = '#00ffff'
      // 绘制六边形蛇头
      const centerX = segment.x * GRID_SIZE + GRID_SIZE / 2
      const centerY = segment.y * GRID_SIZE + GRID_SIZE / 2
      const size = GRID_SIZE / 2 - 2
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = i * Math.PI / 3
        const x = centerX + size * Math.cos(angle)
        const y = centerY + size * Math.sin(angle)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.fill()
    } else {
      // 蛇身
      ctx.fillStyle = '#0ff8'
      ctx.fillRect(
        segment.x * GRID_SIZE + 2,
        segment.y * GRID_SIZE + 2,
        GRID_SIZE - 4,
        GRID_SIZE - 4
      )
    }
    
    // 重置阴影
    ctx.shadowBlur = 0
  })

  // 绘制食物
  ctx.shadowBlur = 20
  ctx.shadowColor = '#ff0080'
  ctx.fillStyle = '#ff0080'
  
  // 绘制脉冲动画
  const time = Date.now() / 1000
  const pulseSize = Math.sin(time * 4) * 2
  
  ctx.beginPath()
  ctx.arc(
    food.x * GRID_SIZE + GRID_SIZE / 2,
    food.y * GRID_SIZE + GRID_SIZE / 2,
    (GRID_SIZE / 2 - 2) + pulseSize,
    0,
    Math.PI * 2
  )
  ctx.fill()

  // 重置阴影
  ctx.shadowBlur = 0
}

// 移动蛇
function moveSnake() {
  const head = { ...snake[0] }

  switch (direction) {
    case 'up':
      head.y--
      break
    case 'down':
      head.y++
      break
    case 'left':
      head.x--
      break
    case 'right':
      head.x++
      break
  }

  // 检查是否吃到食物
  if (head.x === food.x && head.y === food.y) {
    score.value += 10
    generateFood()
    playSound('eat')
    message.success('得分 +10')
  } else {
    snake.pop()
    playSound('move')
  }

  // 检查是否撞墙或撞到自己
  if (
    head.x < 0 ||
    head.x >= 400 / GRID_SIZE ||
    head.y < 0 ||
    head.y >= 400 / GRID_SIZE ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    gameOver()
    return
  }

  snake.unshift(head)
  draw()
}

// 开始游戏
function startGame() {
  if (isPlaying.value) return
  
  gameStartTime.value = Date.now()
  isPlaying.value = true
  showGameOver.value = false
  score.value = 0
  initSnake()
  generateFood()
  draw()
  gameInterval = setInterval(moveSnake, GAME_SPEED)
}

// 游戏结束
function gameOver() {
  if (gameInterval) {
    clearInterval(gameInterval)
    gameInterval = null
  }
  isPlaying.value = false
  
  const duration = Date.now() - gameStartTime.value
  userManager.updateGameHistory(currentUser.value, score.value, duration)
  leaderboard.value = userManager.getLeaderboard()
  
  showGameOver.value = true
}

// 关闭游戏结束对话框
function closeGameOver() {
  showGameOver.value = false
}

// 键盘控制
function handleKeydown(e: KeyboardEvent) {
  // 阻止方向键的默认滚动行为
  if (e.key.startsWith('Arrow')) {
    e.preventDefault()
  }

  if (!isPlaying.value) return

  if (e.code === 'Space') {
    e.preventDefault()
    pauseGame()
    return
  }

  if (isPaused.value) return

  switch (e.key) {
    case 'ArrowUp':
      if (direction !== 'down') direction = 'up'
      break
    case 'ArrowDown':
      if (direction !== 'up') direction = 'down'
      break
    case 'ArrowLeft':
      if (direction !== 'right') direction = 'left'
      break
    case 'ArrowRight':
      if (direction !== 'left') direction = 'right'
      break
  }
}

// 保存声音设置
watch(soundEnabled, (newValue: boolean) => {
  localStorage.setItem('snakeSoundEnabled', String(newValue))
})

// 处理退出登录
function handleLogout() {
  if (isPlaying.value) {
    showLogoutConfirm.value = true
  } else {
    confirmLogout()
  }
}

// 确认退出
function confirmLogout() {
  // 清除游戏状态
  if (gameInterval) {
    clearInterval(gameInterval)
    gameInterval = null
  }
  isPlaying.value = false
  
  // 清除登录信息
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('currentUser')
  
  // 显示提示
  message.success('已退出登录')
  
  // 跳转到登录页
  router.push('/login')
}

// 取消退出
function cancelLogout() {
  showLogoutConfirm.value = false
}

// 生命周期钩子
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  draw()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (gameInterval) {
    clearInterval(gameInterval)
  }
})

// 格式化时间
function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString()
}
</script>

<style scoped>
.game-container {
  display: flex;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(135deg, #000428 0%, #004e92 100%);
  min-height: 100vh;
  overflow: hidden; /* 防止页面滚动 */
  position: fixed; /* 固定位置 */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.game-card {
  width: 500px;
  background: rgba(13, 17, 23, 0.95) !important;
  border: 1px solid #00ffff33 !important;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.2) !important;
}

.game-card :deep(.n-card-header) {
  color: #00ffff !important;
  border-bottom: 1px solid #00ffff33 !important;
}

.tech-panel {
  margin-bottom: 16px;
  padding: 16px;
  background: rgba(0, 255, 255, 0.05);
  border: 1px solid #00ffff33;
  border-radius: 8px;
}

.canvas-wrapper {
  padding: 4px;
  background: linear-gradient(45deg, #000428, #004e92);
  border-radius: 10px;
  position: relative;
}

.canvas-wrapper::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #00ffff, #00ffff33);
  border-radius: 12px;
  z-index: -1;
  animation: borderGlow 2s linear infinite;
}

.canvas-container {
  position: relative;
  margin: 0;
}

.game-canvas {
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.8);
}

.pause-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #00ffff;
  border-radius: 8px;
  text-shadow: 0 0 10px #00ffff;
}

.tech-stat {
  color: #00ffff !important;
}

.tech-text {
  color: #00ffff;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

.tech-button {
  background: linear-gradient(45deg, #000428, #004e92) !important;
  border: 1px solid #00ffff33 !important;
  color: #00ffff !important;
}

.tech-button:hover {
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.3) !important;
}

.tech-select :deep(.n-base-selection) {
  background: rgba(0, 255, 255, 0.1) !important;
  border: 1px solid #00ffff33 !important;
}

.tech-switch :deep(.n-switch__rail) {
  background-color: rgba(0, 255, 255, 0.1) !important;
}

.paused .game-canvas {
  filter: blur(2px);
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

/* 添加全局样式覆盖 */
:deep(.n-card) {
  color: #00ffff !important;
}

:deep(.n-statistic-value) {
  color: #00ffff !important;
}

:deep(.n-statistic-label) {
  color: #00ffff88 !important;
}

/* 添加新样式 */
.user-info {
  color: #00ffff;
  font-size: 14px;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

.logout-button {
  background: linear-gradient(45deg, #ff4081, #ff1744) !important;
  border: 1px solid rgba(255, 64, 129, 0.3) !important;
  color: white !important;
  padding: 4px 12px;
  transition: all 0.3s ease;
}

.logout-button:hover {
  box-shadow: 0 0 15px rgba(255, 64, 129, 0.3) !important;
  transform: translateY(-1px);
}

.logout-confirm-content {
  color: #00ffff;
  text-align: center;
  padding: 20px 0;
}

/* 修改确认对话框样式 */
:deep(.n-modal) {
  background: rgba(13, 17, 23, 0.95) !important;
  border: 1px solid #00ffff33 !important;
}

:deep(.n-modal-header) {
  color: #00ffff !important;
}

:deep(.n-button--primary-type) {
  background: linear-gradient(45deg, #000428, #004e92) !important;
  border: 1px solid #00ffff33 !important;
  color: #00ffff !important;
}

:deep(.n-button--primary-type:hover) {
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.3) !important;
}

.user-card {
  background: rgba(13, 17, 23, 0.95) !important;
  border: 1px solid #00ffff33 !important;
}

.user-nickname {
  color: #00ffff;
  font-size: 18px;
  font-weight: bold;
}

.user-id {
  color: #00ffff88;
  font-size: 12px;
}

.rank-card, .history-card {
  background: rgba(13, 17, 23, 0.95) !important;
  border: 1px solid #00ffff33 !important;
}

.rank-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.rank-1 {
  background: linear-gradient(45deg, #ffd700, #ffa000);
  color: #000;
}

.rank-2 {
  background: linear-gradient(45deg, #c0c0c0, #a0a0a0);
  color: #000;
}

.rank-3 {
  background: linear-gradient(45deg, #cd7f32, #a05a2c);
  color: #fff;
}

.rank-name {
  color: #00ffff;
  flex: 1;
}

.rank-score {
  color: #00ffff;
  font-weight: bold;
}

.history-score {
  color: #00ffff;
  font-weight: bold;
}

.history-duration {
  color: #00ffff88;
}

.history-date {
  color: #00ffff66;
  font-size: 12px;
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .n-grid {
    display: flex;
    flex-direction: column;
  }

  .n-grid-item {
    width: 100% !important;
    margin-bottom: 24px;
  }
}
</style> 