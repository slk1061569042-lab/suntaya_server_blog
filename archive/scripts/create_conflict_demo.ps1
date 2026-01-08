# Git 冲突演示脚本
# 创建一个真实的冲突场景供练习

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Git 冲突演示脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查是否在 Git 仓库中
if (Test-Path ".git") {
    Write-Host "[警告] 当前目录已经是 Git 仓库" -ForegroundColor Yellow
    $continue = Read-Host "是否继续？(y/n)"
    if ($continue -ne "y") {
        exit
    }
} else {
    # 初始化 Git 仓库
    Write-Host "步骤 1: 初始化 Git 仓库..." -ForegroundColor Yellow
    git init
    Write-Host "[OK] Git 仓库已初始化" -ForegroundColor Green
    Write-Host ""
}

# 创建初始文件
Write-Host "步骤 2: 创建初始文件..." -ForegroundColor Yellow
@"
def get_user():
    name = 'Alice'
    age = 25
    return {'name': name, 'age': age}
"@ | Out-File -FilePath "app.py" -Encoding UTF8

@"
def validate_email(email):
    if '@' in email:
        return True
    return False
"@ | Out-File -FilePath "utils.py" -Encoding UTF8

Write-Host "[OK] 文件已创建" -ForegroundColor Green
Write-Host ""

# 第一次提交
Write-Host "步骤 3: 创建初始提交..." -ForegroundColor Yellow
git add .
git commit -m "Initial commit: Add user and validation functions"
Write-Host "[OK] 初始提交完成" -ForegroundColor Green
Write-Host ""

# 创建分支（模拟同事的修改）
Write-Host "步骤 4: 创建分支并修改（模拟同事的修改）..." -ForegroundColor Yellow
git checkout -b colleague-branch

# 同事修改了 app.py
@"
def get_user():
    username = 'Alice'  # 同事改成了 username
    age = 25
    birthday = '1998-01-01'  # 同事添加了 birthday
    return {'username': username, 'age': age, 'birthday': birthday}
"@ | Out-File -FilePath "app.py" -Encoding UTF8

# 同事也修改了 utils.py
@"
import re

def validate_email(email):
    # 同事改用了正则表达式
    pattern = r'^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]+$'
    return bool(re.match(pattern, email))
"@ | Out-File -FilePath "utils.py" -Encoding UTF8

git add .
git commit -m "Refactor: Change name to username, improve email validation"
Write-Host "[OK] 同事的修改已提交到 colleague-branch 分支" -ForegroundColor Green
Write-Host ""

# 切换回主分支（模拟你的修改）
Write-Host "步骤 5: 切换回主分支并修改（模拟你的修改）..." -ForegroundColor Yellow
git checkout main

# 你修改了 app.py（同一行，会产生冲突）
@"
def get_user():
    fullname = 'Alice'  # 你改成了 fullname
    age = 25
    email = 'alice@example.com'  # 你添加了 email
    return {'fullname': fullname, 'age': age, 'email': email}
"@ | Out-File -FilePath "app.py" -Encoding UTF8

# 你也修改了 utils.py（同一行，会产生冲突）
@"
def validate_email(email):
    # 你改用了更简单的方法
    if '@' in email and '.' in email.split('@')[1]:
        return True
    return False
"@ | Out-File -FilePath "utils.py" -Encoding UTF8

git add .
git commit -m "Refactor: Change name to fullname, add email field"
Write-Host "[OK] 你的修改已提交到 main 分支" -ForegroundColor Green
Write-Host ""

# 尝试合并（会产生冲突）
Write-Host "步骤 6: 尝试合并分支（会产生冲突）..." -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  即将产生冲突，这是正常的！" -ForegroundColor Yellow
Write-Host ""

$mergeResult = git merge colleague-branch 2>&1
Write-Host $mergeResult

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "冲突已创建！" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "现在你可以练习解决冲突：" -ForegroundColor Green
Write-Host ""
Write-Host "1. 查看冲突文件：" -ForegroundColor White
Write-Host "   code app.py" -ForegroundColor Gray
Write-Host "   code utils.py" -ForegroundColor Gray
Write-Host ""
Write-Host "2. 查看冲突状态：" -ForegroundColor White
Write-Host "   git status" -ForegroundColor Gray
Write-Host ""
Write-Host "3. 解决冲突后：" -ForegroundColor White
Write-Host "   git add app.py utils.py" -ForegroundColor Gray
Write-Host "   git commit -m 'Resolve merge conflicts'" -ForegroundColor Gray
Write-Host ""
Write-Host "4. 如果想放弃合并：" -ForegroundColor White
Write-Host "   git merge --abort" -ForegroundColor Gray
Write-Host ""
Write-Host "查看 'Git冲突解决完全指南.md' 了解详细步骤" -ForegroundColor Cyan
Write-Host ""
