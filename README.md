---
AIGC:
    ContentProducer: Minimax Agent AI
    ContentPropagator: Minimax Agent AI
    Label: AIGC
    ProduceID: "00000000000000000000000000000000"
    PropagateID: "00000000000000000000000000000000"
    ReservedCode1: 3044022025dc91c3d3c8b239a78794c122cc4e0c281d0a0f56e6a21a0c619abcc5ed46750220782f7be1c55233589ce9f652b6f60aea80f2f5c6c42d1e19aa05e05e33a9d1f9
    ReservedCode2: 30450221009acd5c3d3335cf41c11f8c499476d1e6578f2b83dc08afd3b3fba5841f3512d102204021755e919eb0693ff7f9456aac53f1515e778ef8d8081da5c1411492c17fb1
---

# 智链AI平台 (Zhililian AI Platform)

React + TypeScript + Vite + Supabase 构建的保险AI服务平台。

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
复制 `.env.example` 为 `.env.local`，并填入你的 Supabase 配置：
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 运行开发服务器
```bash
npm run dev
```

## 部署到 Vercel

### 步骤 1：推送到 GitHub
```bash
# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 添加远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/zhililian-ai-platform.git

# 推送代码
git push -u origin main
```

### 步骤 2：Vercel 部署
1. 访问 https://vercel.com/new
2. 导入你的 GitHub 仓库
3. 框架选择 **Vite**
4. 添加环境变量：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. 点击 **Deploy**

## Supabase 配置

1. 访问 https://supabase.com 创建项目
2. 获取 Project URL 和 Anon Key
3. 在 Vercel 项目设置中添加环境变量

## 技术栈

- **前端**: React 18 + TypeScript + Vite
- **样式**: Tailwind CSS + Radix UI
- **图表**: ECharts + Recharts
- **后端**: Supabase
- **部署**: Vercel

## 开发指南

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run lint` - 运行 ESLint 检查
