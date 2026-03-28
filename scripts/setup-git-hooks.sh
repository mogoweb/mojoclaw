#!/bin/bash

# Git 工作流工具安装脚本
# 用途：安装 Git hooks 并设置脚本执行权限

set -e

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

echo ""
echo "━━━ Git 工作流工具安装 ━━━"
echo ""

# 检查是否在 git 仓库中
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "错误：当前目录不是 Git 仓库"
    exit 1
fi

# 获取 git hooks 目录
HOOKS_DIR=$(git rev-parse --git-dir)/hooks
PROJECT_ROOT=$(git rev-parse --show-toplevel)

print_info "Git 仓库根目录: $PROJECT_ROOT"
print_info "Git hooks 目录: $HOOKS_DIR"
echo ""

# 1. 设置脚本执行权限
print_info "设置脚本执行权限..."
chmod +x "$PROJECT_ROOT/scripts/git/start-branch.sh"
chmod +x "$PROJECT_ROOT/scripts/git/branch-status.sh"
print_success "脚本执行权限已设置"
echo ""

# 2. 安装 pre-commit hook
print_info "安装 Git pre-commit hook..."

if [ -f "$HOOKS_DIR/pre-commit" ]; then
    print_warning "pre-commit hook 已存在，将备份为 pre-commit.bak"
    mv "$HOOKS_DIR/pre-commit" "$HOOKS_DIR/pre-commit.bak"
fi

cp "$PROJECT_ROOT/scripts/git/hooks/pre-commit" "$HOOKS_DIR/pre-commit"
chmod +x "$HOOKS_DIR/pre-commit"
print_success "pre-commit hook 已安装"
echo ""

# 3. 创建符号链接方便全局访问（可选）
if [ -d "/usr/local/bin" ] && [ -w "/usr/local/bin" ]; then
    print_info "创建全局命令符号链接..."
    ln -sf "$PROJECT_ROOT/scripts/git/start-branch.sh" /usr/local/bin/mj-git-branch
    ln -sf "$PROJECT_ROOT/scripts/git/branch-status.sh" /usr/local/bin/mj-git-status
    print_success "全局命令已创建：mj-git-branch, mj-git-status"
    echo ""
else
    print_warning "无法在 /usr/local/bin 创建全局符号链接（需要 sudo 权限）"
    echo ""
fi

# 4. 显示安装总结
echo "━━━ 安装完成 ━━━"
echo ""
echo "已安装的组件："
echo "  ✓ 实用脚本（设置执行权限）"
echo "    - ./scripts/git/start-branch.sh  - 创建新分支"
echo "    - ./scripts/git/branch-status.sh - 查看分支状态"
echo ""
echo "  ✓ Git hooks"
echo "    - pre-commit hook - 防止在 main 分支提交，检查提交格式"
echo ""
echo "━━━ 使用说明 ━━━"
echo ""
echo "1. 创建新分支（推荐使用）："
echo "   ${GREEN}./scripts/git/start-branch.sh${NC}"
echo ""
echo "2. 查看当前分支状态："
echo "   ${GREEN}./scripts/git/branch-status.sh${NC}"
echo ""
echo "3. 提交代码："
echo "   ${GREEN}git add .${NC}"
echo "   ${GREEN}git commit -m \"feat: add new feature\"${NC}"
echo "   ${GREEN}git push origin <branch-name>${NC}"
echo ""
echo "4. 如果需要在 main 分支提交（不推荐）："
echo "   ${YELLOW}git commit --no-verify -m \"...\"${NC}"
echo ""
echo "详细工作流程请参考：DEVELOPMENT_WORKFLOW.md"
echo ""
print_info "开始使用 Git 工作流吧！🚀"
