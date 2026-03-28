# Development Workflow

本项目的 Git 工作流遵循 **Feature Branch Workflow**，确保代码质量和团队合作效率。

## 核心原则

1. **不要在 `main` 分支上直接提交**
2. **所有开发都在独立分支上进行**
3. **通过 Pull Request 合并到 main**
4. **保持 main 分支始终处于可发布状态**

## 工作流程

### 1. 开始新任务

使用提供的辅助脚本创建新分支：

```bash
# 使用辅助脚本创建分支（推荐）
./scripts/git/start-branch.sh

# 或手动创建分支
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
# 或 bugfix/bug-description
# 或 hotfix/critical-fix
# 或 docs/documentation-update
```

### 2. 开发与提交

```bash
# 查看修改
git status

# 添加文件
git add <path/to/file>
# 或添加所有修改
git add .

# 提交（遵循提交规范）
git commit -m "feat: add user authentication"
git commit -m "fix: resolve login timeout issue"
git commit -m "docs: update API documentation"

# 推送到远程
git push -u origin feature/your-feature-name
```

### 3. 创建 Pull Request

在 GitHub 上创建 PR：
- 填写清晰的标题和描述
- 关联相关 Issue
- 请求至少一人 Code Review
- 确保所有 CI 检查通过

### 4. 代码审查与合并

- 审查者检查代码质量、测试覆盖率
- 根据反馈进行修改
- 通过 Squash Merge 合并到 main

### 5. 更新本地

```bash
git checkout main
git pull origin main
git branch -d feature/your-feature-name  # 删除已合并的本地分支
```

## 分支命名规范

```
feature/功能描述    # 新功能
bugfix/问题描述      # Bug 修复
hotfix/紧急修复     # 紧急问题修复（针对生产环境）
docs/文档更新       # 文档相关
refactor/重构描述   # 代码重构
test/测试相关       # 测试相关
chore/杂务          # 构建、工具链等
style/格式调整      # 代码格式调整（不影响功能）
```

## 提交信息规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

### 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整（不影响代码运行）
- `refactor`: 重构（既不是新功能也不是修复）
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动
- `ci`: CI/CD 配置文件和脚本的变动
- `revert`: 回滚之前的 commit

### 示例

```bash
feat(auth): add OAuth2 login support

- Add Google OAuth2 provider
- Add user session management
- Update login UI

Closes #123

---

fix(api): resolve null reference error

The issue occurred when API response was empty.
Added defensive checks to prevent crashes.

Fixes #456

---

docs(readme): update installation instructions

Added prerequisites for Windows development.
Updated Node.js version requirement.

---

refactor(user): simplify state management

Migrated from Redux to Zustand store.
Reduced bundle size by 20%.
```

## 代码审查要点

提交 PR 时，确保：

- [ ] 代码遵循项目代码风格
- [ ] 有适当的单元测试
- [ ] 文档已更新（API、README 等）
- [ ] 提交信息清晰明确
- [ ] 没有引入新的 ESLint/TypeScript 错误
- [ ] 功能完整且可测试
- [ ] 性能影响在可控范围内

## 紧急修复流程

对于生产环境的紧急问题：

```bash
# 从 main 的当前生产版本创建分支
git checkout main
git pull origin main
git checkout -b hotfix/critical-issue

# 快速修复
# ...

# 直接合并到 main（不经过完整 PR 流程）
git push -u origin hotfix/critical-issue
# 在 GitHub 上快速合并

# 合并后创建 release tag
git tag -a v1.0.1 -m "Hotfix for critical issue"
git push origin v1.0.1
```

## 常用命令

```bash
# 查看当前分支
git branch --show-current

# 查看所有分支
git branch -a

# 查看最近的提交
git log --oneline -10

# 查看状态
git status

# 取消未提交的修改
git restore <file>

# 查看远程分支更新
git fetch --all

# 同步远程分支到本地
git pull origin main

# 删除已合并的本地分支
git branch -d <branch-name>

# 强制删除分支
git branch -D <branch-name>
```

## 实用技巧

### 合并过程中的冲突解决

```bash
# 如果 PR 合并时有冲突
git checkout main
git pull origin main
git checkout feature/your-feature
git rebase main

# 解决冲突后
git add .
git rebase --continue

# 完成后推送
git push -f origin feature/your-feature
```

### 暂存当前工作

```bash
# 临时保存未提交的修改
git stash

# 恢复修改
git stash pop

# 查看暂存列表
git stash list
```

### 查看差异

```bash
# 查看工作区与暂存区的差异
git diff

# 查看暂存区与上一次提交的差异
git diff --staged

# 查看两个分支之间的差异
git diff main feature/your-feature
```

## 工具集成

### 使用辅助脚本

项目提供了 Git 工作流辅助脚本：

```bash
# 创建新分支并确保 main 是最新的
./scripts/git/start-branch.sh

# 显示当前分支状态和建议的下一步操作
./scripts/git/branch-status.sh
```

### Git Hook

项目配置了 pre-commit hook，会自动检查：
- 提交信息格式
- ESLint 错误
- TypeScript 类型检查
- 测试通过

如果检查失败，提交将被阻止。

## 常见问题

### Q: 我不小心在 main 分支上提交了怎么办？

```bash
# 回退提交（谨慎操作！）
git reset --soft HEAD~1

# 然后创建正确的分支
git checkout -b feature/your-feature
git commit  # 重新提交
git push -u origin feature/your-feature
```

### Q: 如何拉取远程的最新变更到我的分支？

```bash
# 方式1：rebase（推荐，保持提交历史干净）
git fetch origin
git rebase origin/main

# 方式2：merge（保留分支历史）
git fetch origin
git merge origin/main
```

### Q: 如何清理已删除的远程分支引用？

```bash
git remote prune origin
```

## 参考资源

- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Git 分支管理最佳实践](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)

---

**最后更新：** 2026-03-29
**维护者：** OpenClaw Team
