#!/bin/bash

# Git 分支创建辅助脚本
# 用途：确保在最新的 main 分支上创建新的开发分支

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的信息
print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# 检查是否在 git 仓库中
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "当前目录不是 Git 仓库"
    exit 1
fi

# 获取当前分支
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# 检查是否在 main 分支上
if [ "$CURRENT_BRANCH" != "main" ]; then
    print_warning "当前不在 main 分支上（当前：$CURRENT_BRANCH）"
    
    # 检查是否有未提交的修改
    if [ -n "$(git status --porcelain)" ]; then
        print_error "存在未提交的修改，请先处理"
        git status --short
        exit 1
    fi
    
    print_info "切换到 main 分支..."
    git checkout main
fi

# 拉取最新代码
print_info "拉取 main 分支最新代码..."
git fetch origin
git pull origin main
print_success "main 分支已更新到最新"

# 提示用户输入分支类型
echo ""
echo "请选择分支类型："
echo "  1) feature  - 新功能"
echo "  2) bugfix   - Bug 修复"
echo "  3) hotfix   - 紧急修复（生产环境）"
echo "  4) docs     - 文档更新"
echo "  5) refactor - 代码重构"
echo "  6) test     - 测试相关"
echo "  7) chore    - 构建、工具链等"
echo "  8) style    - 代码格式调整"
echo ""
read -p "请输入选项 (1-8): " branch_type_option

case $branch_type_option in
    1) branch_type="feature" ;;
    2) branch_type="bugfix" ;;
    3) branch_type="hotfix" ;;
    4) branch_type="docs" ;;
    5) branch_type="refactor" ;;
    6) branch_type="test" ;;
    7) branch_type="chore" ;;
    8) branch_type="style" ;;
    *) 
        print_error "无效的选项"
        exit 1
        ;;
esac

# 提示用户输入分支描述
echo ""
read -p "请输入分支描述（小写，连字符分隔，如 'add-user-auth'）: " branch_description

# 检查分支描述是否为空
if [ -z "$branch_description" ]; then
    print_error "分支描述不能为空"
    exit 1
fi

# 转换为小写并用连字符替换空格
branch_description=$(echo "$branch_description" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')

# 构建分支名
BRANCH_NAME="${branch_type}/${branch_description}"

# 检查分支是否已存在
if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
    print_error "分支 '$BRANCH_NAME' 已存在"
    print_info "是否要切换到现有分支？(y/n)"
    read -p "> " switch_to_existing
    
    if [ "$switch_to_existing" = "y" ] || [ "$switch_to_existing" = "Y" ]; then
        git checkout "$BRANCH_NAME"
        print_success "已切换到分支: $BRANCH_NAME"
        exit 0
    else
        exit 1
    fi
fi

# 创建新分支
print_info "创建新分支: $BRANCH_NAME"
git checkout -b "$BRANCH_NAME"

print_success "分支创建成功！"
echo ""
echo "======================================"
echo "当前分支: $BRANCH_NAME"
echo "======================================"
echo ""
echo "接下来可以："
echo "  1. 进行代码修改"
echo "  2. 使用 'git add .' 添加修改"
echo "  3. 使用 'git commit -m \"type: description\"' 提交"
echo "  4. 使用 'git push -u origin $BRANCH_NAME' 推送到远程"
echo "  5. 在 GitHub 上创建 Pull Request"
echo ""
echo "提交信息格式参考："
echo "  feat: add new feature"
echo "  fix: resolve bug"
echo "  docs: update documentation"
echo ""
print_info "开始开发吧！💪"
