# 太空捕手 🚀💰

這是一個有趣的接錢遊戲，使用 HTML5 Canvas 開發！

![Game Screenshot](https://img.shields.io/badge/status-active-success.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

## 🎮 遊戲簡介

太空捕手是一個反應速度遊戲，玩家需要控制白色方塊左右移動，接住從天而降的鈔票！

### 遊戲特色

- 💵 **雙幣值系統**: 1000元 / 2000元鈔票
- 🎉 **獎勵機制**: 達到100分觸發千張鈔票雨！
- ⚡ **即時反饋**: 接住加分，錯過扣分
- 🎨 **精美設計**: 現代化 UI 設計，漸變背景和玻璃態效果
- 📱 **響應式設計**: 支援各種螢幕尺寸

## 🎯 遊戲規則

1. 使用 ← → 方向鍵控制玩家左右移動
2. 接住 1000 元鈔票獲得 1000 分
3. 接住 2000 元鈔票獲得 2000 分（20%掉落率）
4. 錯過任何鈔票扣 5 分
5. 達到 100 分時，會觸發 1000 張鈔票雨！

## 🚀 快速開始

### 在線遊玩

訪問 GitHub Pages 部署的遊戲：
```
https://[你的用戶名].github.io/[你的倉庫名]/
```

### 本地運行

1. 克隆此倉庫：
```bash
git clone https://github.com/[你的用戶名]/[你的倉庫名].git
cd [你的倉庫名]
```

2. 使用任何 HTTP 服務器運行：

**使用 Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**使用 Node.js (http-server):**
```bash
npx http-server -p 8000
```

**使用 PHP:**
```bash
php -S localhost:8000
```

3. 在瀏覽器中打開 `http://localhost:8000`

### 直接打開

也可以直接在瀏覽器中打開 `index.html` 文件，但可能會遇到圖片載入問題（CORS）。

## 📁 專案結構

```
.
├── index.html          # 主 HTML 文件
├── style.css           # 樣式表
├── script.js           # 遊戲邏輯
├── 1000_ntd.png       # 1000元鈔票圖片（可選）
├── 2000_ntd.png       # 2000元鈔票圖片（可選）
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Actions 部署配置
└── README.md          # 本文件
```

## 🛠️ 技術棧

- **HTML5**: 網頁結構
- **CSS3**: 樣式設計（漸變、動畫、響應式）
- **JavaScript**: 遊戲邏輯
- **Canvas API**: 遊戲渲染
- **GitHub Actions**: 自動部署
- **GitHub Pages**: 靜態網站託管

## 🎨 特色功能

### 視覺設計
- 漸變背景和玻璃態效果（Glassmorphism）
- 流暢的動畫和過渡效果
- 現代化的按鈕設計和懸停效果
- 使用 Google Fonts (Orbitron, Noto Sans TC)

### 遊戲機制
- 物理碰撞檢測
- 分數系統
- 獎勵機制（鈔票雨）
- 暫停/繼續功能
- 遊戲結束畫面

### 圖片處理
- 自動載入外部圖片
- 載入失敗時使用程序生成的替代圖片
- 支援自定義鈔票圖片

## 📦 部署到 GitHub Pages

### 自動部署

本專案已配置 GitHub Actions 自動部署：

1. **推送代碼到 GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/[你的用戶名]/[倉庫名].git
git push -u origin main
```

2. **啟用 GitHub Pages:**
   - 進入倉庫設置 (Settings)
   - 點擊左側的 "Pages"
   - 在 "Source" 下選擇 "GitHub Actions"

3. **自動部署:**
   - 每次推送到 `main` 分支時，GitHub Actions 會自動部署
   - 也可以在 Actions 頁面手動觸發部署

### 手動部署

如果不使用 GitHub Actions，也可以：

1. 進入倉庫設置 → Pages
2. 選擇分支（如 `main`）
3. 選擇根目錄 `/`
4. 保存設置

## 🎮 控制說明

| 按鍵 | 功能 |
|------|------|
| ← 左方向鍵 | 向左移動 |
| → 右方向鍵 | 向右移動 |
| 開始遊戲按鈕 | 開始新遊戲 |
| 暫停按鈕 | 暫停/繼續遊戲 |

## 🔧 自定義

### 修改遊戲參數

編輯 `script.js` 中的 `CONFIG` 對象：

```javascript
const CONFIG = {
    WINDOW_WIDTH: 800,      // 遊戲畫布寬度
    WINDOW_HEIGHT: 600,     // 遊戲畫布高度
    PLAYER_SIZE: 50,        // 玩家大小
    PLAYER_SPEED: 5,        // 玩家移動速度
    BILL_WIDTH: 100,        // 鈔票寬度
    BILL_HEIGHT: 50,        // 鈔票高度
    COIN_SPEED: 4,          // 鈔票下落速度
    SPAWN_RATE: 60,         // 鈔票生成頻率
    BONUS_THRESHOLD: 100,   // 觸發獎勵的分數
    BONUS_COINS: 1000,      // 獎勵鈔票數量
    MISS_PENALTY: 5,        // 錯過懲罰
    FPS: 60                 // 幀率
};
```

### 添加自定義鈔票圖片

1. 準備圖片文件：`1000_ntd.png` 和 `2000_ntd.png`
2. 將圖片放在專案根目錄
3. 圖片會自動載入，失敗則使用生成的替代圖片

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📝 授權

MIT License

## 👤 作者

謝翔宇

## 🙏 致謝

- 原始 Pygame 版本：`space_catcher.py`
- 靈感來源：經典接物遊戲

---

**享受遊戲！💰🎮**
