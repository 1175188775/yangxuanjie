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
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key !== 'isLoggedIn' && key !== 'currentUser') {
        const userData = JSON.parse(localStorage.getItem(key) || '{}')
        if (userData.username) {
          users.push(userData)
        }
      }
    }
    return users
  },

  // 获取排行榜
  getLeaderboard(): UserData[] {
    return this.getAllUsers()
      .sort((a, b) => b.highScore - a.highScore)
      .slice(0, 10)
  },

  // 更新用户游戏记录
  updateGameHistory(username: string, score: number, duration: number) {
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
      if (score > (userData.highScore || 0)) {
        userData.highScore = score
      }
      
      localStorage.setItem(username, JSON.stringify(userData))
    }
  }
} 