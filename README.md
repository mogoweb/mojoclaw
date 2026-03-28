# MojoClaw

OpenClaw Desktop GUI - A graphical interface for the OpenClaw CLI tool.

## 项目结构

```
mojoclaw/
├── gui/                    # Electron + React 桌面应用
│   ├── src/               # React 源代码
│   ├── electron/          # Electron 主进程
│   └── scripts/           # 构建和工具脚本
├── openspec/              # OpenSpec 工作流集成
├── scripts/               # 项目级脚本
│   └── git/              # Git 工作流工具
└── DEVELOPMENT_WORKFLOW.md # 开发工作流文档
```

## 快速开始

### 环境要求

- Node.js >= 24.x
- npm >= 10.x
- Git

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/mogoweb/mojoclaw.git
cd mojoclaw

# 安装 GUI 依赖
cd gui
npm install
```

### 安装 Git 工作流工具（推荐）

```bash
# 返回项目根目录
cd ..

# 执行安装脚本
./scripts/setup-git-hooks.sh
```

这将安装：
- Git pre-commit hook（防止在 main 分支提交）
- 分支管理辅助脚本
- 提交信息格式检查

### 开发模式

```bash
cd gui

# 启动开发服务器
npm run dev

# 或启动 Electron 开发模式（GUI 应用）
npm run electron:dev
```

### 构建

```bash
# 构建 React 应用
npm run build

# 编译 Electron 主进程
npm run electron:compile

# 完整构建
npm run electron:build
```

## Git 工作流

⚠️ **重要：不要在 main 分支上直接提交！**

### 标准流程

```bash
# 1. 创建新分支（使用辅助脚本）
./scripts/git/start-branch.sh

# 2. 进行开发
# ... 修改代码 ...

# 3. 提交代码
git add .
git commit -m "feat: your changes"

# 4. 推送到远程
git push origin feature/your-feature

# 5. 在 GitHub 上创建 Pull Request

# 6. 合并后更新本地
git checkout main
git pull origin main
```

### 分支命名规范

```
feature/功能描述    # 新功能
bugfix/问题描述      # Bug 修复
hotfix/紧急修复     # 紧急问题修复
docs/文档更新       # 文档相关
refactor/重构描述   # 代码重构
```

### 提交信息规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

```
feat: 添加新功能
fix: 修复 bug
docs: 更新文档
refactor: 重构代码
```

详细工作流请参考：[DEVELOPMENT_WORKFLOW.md](DEVELOPMENT_WORKFLOW.md)

## 工具脚本

### Git 工作流工具

```bash
# 创建新分支
./scripts/git/start-branch.sh

# 查看分支状态
./scripts/git/branch-status.sh

# 安装 Git hooks
./scripts/setup-git-hooks.sh
```

### GUI 工具

```bash
# 开发模式
npm run dev                    # React 开发服务器
npm run electron:dev          # Electron 开发模式

# 构建
npm run build                 # 构建 React
npm run electron:build        # 完整构建
npm run build:app             # 打包应用

# 测试
npm run test                  # 运行测试
npm run test:coverage         # 测试覆盖率
```

## 文档

- [开发工作流](DEVELOPMENT_WORKFLOW.md) - Git 工作流和提交规范
- [GUI 文档](gui/README.md) - Electron + React 应用文档
- [OpenSpec 集成](openspec/) - OpenSpec 工作流说明

## 贡献

欢迎贡献！请遵循以下步骤：

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: add some amazing feature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

注意：提交信息必须遵循 Conventional Commits 规范。

## 许可证

[待添加]

## 联系方式

- 项目维护者：OpenClaw Team
- 问题反馈：[GitHub Issues](https://github.com/mogoweb/mojoclaw/issues)
