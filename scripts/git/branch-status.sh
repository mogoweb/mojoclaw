#!/bin/bash

# Git 分支状态检查脚本
# 用途：显示当前分支状态和建议的下一步操作

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
GRAY='\033[0;90m'
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

print_header() {
    echo ""
    echo -e "${CYAN}━━━ $1 ━━━${NC}"
    echo ""
}

# 检查是否在 git 仓库中
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "当前目录不是 Git 仓库"
    exit 1
fi

# 获取当前分支
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
print_header "Git 分支状态"

echo -e "当前分支: ${GREEN}$CURRENT_BRANCH${NC}"

# 检查是否在 main 分支
if [ "$CURRENT_BRANCH" = "main" ]; then
    print_warning "你正在 main 分支上！"
    print_warning "请不要在 main 分支上进行开发"
    echo ""
    print_info "建议："
    echo "  - 使用 './scripts/git/start-branch.sh' 创建新分支"
    echo "  - 或 'git checkout -b feature/your-feature' 手动创建"
fi

echo ""

# 检查与远程的差异
print_header "远程状态"

# 获取远程 main 最新提交
MAIN_LATEST=$(git ls-remote --heads origin main | awk '{print $1}')
MAIN_LOCAL=$(git rev-parse main 2>/dev/null)

if [ "$MAIN_LOCAL" = "$MAIN_LATEST" ]; then
    print_success "本地 main 与远程同步"
else
    print_warning "本地 main 与远程不同步"
    print_info "建议运行: git checkout main && git pull origin main"
fi

# 获取当前分支与远程的差异
if [ "$CURRENT_BRANCH" != "main" ] && [ -n "$(git ls-remote --heads origin $CURRENT_BRANCH)" ]; then
    REMOTE_TRACKING=$(git rev-parse origin/$CURRENT_BRANCH 2>/dev/null)
    LOCAL_BRANCH=$(git rev-parse HEAD)

    if [ "$LOCAL_BRANCH" = "$REMOTE_TRACKING" ]; then
        print_success "分支 $CURRENT_BRANCH 与远程同步"
    else
        print_warning "分支 $CURRENT_BRANCH 与远程不同步"
        BEHIND=$(git rev-list --count HEAD..origin/$CURRENT_BRANCH 2>/dev/null || echo "0")
        AHEAD=$(git rev-list --count origin/$CURRENT_BRANCH..HEAD 2>/dev/null || echo "0")

        if [ "$BEHIND" -gt 0 ]; then
            echo "  - 本地落后远程 $BEHIND 个提交"
            echo "  - 建议运行: git pull origin $CURRENT_BRANCH"
        fi

        if [ "$AHEAD" -gt 0 ]; then
            echo "  - 本地领先远程 $AHEAD 个提交"
            echo "  - 建议运行: git push origin $CURRENT_BRANCH"
        fi
    fi
else
    print_info "分支 $CURRENT_BRANCH 尚未推送到远程"
fi

echo ""

# 检查工作区状态
print_header "工作区状态"

# 检查未暂存的修改
UNSTAGED=$(git status --porcelain | grep -v "^?" | grep "^ M" | wc -l)
# 检查已暂存的修改
STAGED=$(git status --porcelain | grep -v "^?" | grep "^M\|^A" | wc -l)
# 检查未跟踪的文件
UNTRACKED=$(git status --porcelain | grep "^??" | wc -l)

if [ "$UNSTAGED" -eq 0 ] && [ "$STAGED" -eq 0 ] && [ "$UNTRACKED" -eq 0 ]; then
    print_success "工作区干净，没有待提交的修改"
else
    if [ "$UNSTAGED" -gt 0 ]; then
        echo "  ${YELLOW}未暂存的修改:${NC} $UNSTAGED 个文件"
        git status --short | grep "^ M"
    fi

    if [ "$STAGED" -gt 0 ]; then
        echo "  ${YELLOW}已暂存的修改:${NC} $STAGED 个文件"
        git status --short | grep "^M\|^A"
    fi

    if [ "$UNTRACKED" -gt 0 ]; then
        echo "  ${GRAY}未跟踪的文件:${NC} $UNTRACKED 个文件"
        echo "  ${GRAY}(使用 'git add <file>' 添加到暂存区)${NC}"
    fi

    echo ""
    print_info "建议："
    echo "  - 使用 'git add .' 添加所有修改"
    echo "  - 使用 'git commit -m \"type: description\"' 提交"
fi

echo ""

# 检查提交历史
print_header "最近提交"

git log --oneline -5 --decorate

echo ""

# 提供建议
print_header "下一步建议"

if [ "$CURRENT_BRANCH" = "main" ]; then
    print_error "警告：正在 main 分支！请先创建开发分支"
    echo ""
    echo "${GRAY}./scripts/git/start-branch.sh${NC}"
elif [ -n "$(git status --porcelain)" ]; then
    print_info "你有待处理的修改"
    echo ""
    echo "  添加修改:"
    echo "  ${GRAY}git add <file>${NC}  或  ${GRAY}git add .${NC}"
    echo ""
    echo "  提交修改:"
    echo "  ${GRAY}git commit -m \"type: description\"${NC}"
    echo ""
    echo "  推送到远程:"
    echo "  ${GRAY}git push origin $CURRENT_BRANCH${NC}"
else
    local_behind_main=$(git rev-list --count HEAD..origin/main 2>/dev/null || echo "0")
    
    if [ "$local_behind_main" -gt 0 ]; then
        print_warning "你的分支落后于 main $local_behind_main 个提交"
        echo ""
        echo "  更新你的分支:"
        echo "  ${GRAY}git fetch origin${NC}"
        echo "  ${GRAY}git rebase origin/main${NC}"
    else
        print_success "分支状态良好"
        echo ""
        echo "  开始开发:"
        echo "  ${GRAY}# 进行修改${NC}"
        echo "  ${GRAY}git add .${NC}"
        echo "  ${GRAY}git commit -m \"feat: your changes\"${NC}"
        echo "  ${GRAY}git push origin $CURRENT_BRANCH${NC}"
    fi
fi

echo ""

# 检查是否有 PR 可以合并
if [ "$CURRENT_BRANCH" != "main" ] && command -v gh &> /dev/null; then
    PR_URL=$(gh pr view --json url -q .url 2>/dev/null || echo "")
    
    if [ -n "$PR_URL" ]; then
        print_info "已创建的 Pull Request:"
        echo "  ${CYAN}$PR_URL${NC}"
    else
        print_info "尚未创建 Pull Request"
        echo "  使用以下命令创建 PR:"
        echo "  ${GRAY}gh pr create --title \"PR Title\" --body \"PR Description\"${NC}"
    fi
fi

echo ""
print_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
