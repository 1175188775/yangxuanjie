interface UserData {
  username: string;
  nickname: string;
  password: string;
  avatar: string;
  highScore: number;
  gameHistory: Array<{
    score: number;
    date: string;
    duration: number;
  }>;
}

export const userManager = {
  // 获取所有用户数据
  getAllUsers(): UserData[] {
    const users: UserData[] = []
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key !== 'isLoggedIn' && key !== 'currentUser') {
          try {
            const userData = JSON.parse(localStorage.getItem(key) || '{}')
            if (userData.username) {
              users.push(userData)
            }
          } catch (e) {
            console.warn(`Failed to parse user data for key: ${key}`)
            continue
          }
        }
      }
    } catch (e) {
      console.error('Error getting users:', e)
    }
    return users
  },

  // 获取排行榜
  getLeaderboard(): UserData[] {
    try {
      return this.getAllUsers()
        .filter(user => typeof user.highScore === 'number')
        .sort((a, b) => (b.highScore || 0) - (a.highScore || 0))
        .slice(0, 10)
    } catch (e) {
      console.error('Error getting leaderboard:', e)
      return []
    }
  },

  // 更新用户游戏记录
  updateGameHistory(username: string, score: number, duration: number) {
    try {
      const userData = JSON.parse(localStorage.getItem(username) || '{}')
      if (userData.username) {
        userData.gameHistory = userData.gameHistory || []
        userData.gameHistory.unshift({
          score,
          date: new Date().toISOString(),
          duration
        })
        // 只保留最近20条记录
        userData.gameHistory = userData.gameHistory.slice(0, 20)
        
        // 更新最高分
        userData.highScore = Math.max(score, userData.highScore || 0)
        
        localStorage.setItem(username, JSON.stringify(userData))
      }
    } catch (e) {
      console.error('Error updating game history:', e)
    }
  },

  // 初始化用户数据
  initUserData(username: string, userData: Partial<UserData>) {
    try {
      const defaultData: UserData = {
        username,
        nickname: username,
        password: '',
        avatar: '',
        highScore: 0,
        gameHistory: []
      }
      
      const finalData = { ...defaultData, ...userData }
      localStorage.setItem(username, JSON.stringify(finalData))
      return finalData
    } catch (e) {
      console.error('Error initializing user data:', e)
      return null
    }
  }
} 