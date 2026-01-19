# 修复Cursor使用错误用户路径的问题
# 问题：Cursor尝试使用 C:\Users\Aquarius 而不是 C:\Users\Administrator

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "修复 Cursor 用户路径问题" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$currentUser = $env:USERNAME
$currentUserProfile = $env:USERPROFILE
$cursorSettingsPath = "$env:APPDATA\Cursor\User\settings.json"

Write-Host "当前用户: $currentUser" -ForegroundColor Yellow
Write-Host "用户目录: $currentUserProfile" -ForegroundColor Yellow
Write-Host ""

# 检查Cursor设置文件
Write-Host "检查 Cursor 设置文件..." -ForegroundColor Yellow
if (Test-Path $cursorSettingsPath) {
    Write-Host "找到设置文件: $cursorSettingsPath" -ForegroundColor Green
    
    try {
        $settingsContent = Get-Content $cursorSettingsPath -Raw -Encoding UTF8
        $settings = $settingsContent | ConvertFrom-Json
        
        $needsUpdate = $false
        $updatedSettings = $settings
        
        # 检查 remote.SSH.configFile 设置
        if ($settings.PSObject.Properties.Name -contains "remote.SSH.configFile") {
            $configFile = $settings."remote.SSH.configFile"
            Write-Host "当前 remote.SSH.configFile: $configFile" -ForegroundColor Gray
            
            if ($configFile -match "Aquarius") {
                Write-Host "发现错误的用户路径！" -ForegroundColor Red
                $correctPath = "$currentUserProfile\.ssh\config"
                $updatedSettings."remote.SSH.configFile" = $correctPath
                $needsUpdate = $true
                Write-Host "将更新为: $correctPath" -ForegroundColor Green
            }
        }
        
        # 检查其他可能包含错误路径的设置
        $settingsJson = $settings | ConvertTo-Json -Depth 10
        if ($settingsJson -match "Aquarius") {
            Write-Host "发现其他包含错误路径的设置" -ForegroundColor Yellow
            $settingsJson = $settingsJson -replace "C:\\\\Users\\\\Aquarius", "C:\\Users\\$currentUser"
            $settingsJson = $settingsJson -replace "C:/Users/Aquarius", "C:/Users/$currentUser"
            $updatedSettings = $settingsJson | ConvertFrom-Json
            $needsUpdate = $true
        }
        
        if ($needsUpdate) {
            $updatedJson = $updatedSettings | ConvertTo-Json -Depth 10
            # 备份原文件
            $backupPath = "$cursorSettingsPath.backup.$(Get-Date -Format 'yyyyMMddHHmmss')"
            Copy-Item $cursorSettingsPath $backupPath
            Write-Host "已备份原文件到: $backupPath" -ForegroundColor Gray
            
            # 更新设置文件
            $updatedJson | Set-Content -Path $cursorSettingsPath -Encoding UTF8
            Write-Host "已更新 Cursor 设置文件" -ForegroundColor Green
        } else {
            Write-Host "未发现需要修复的配置" -ForegroundColor Green
        }
        
    } catch {
        Write-Host "无法解析设置文件: $_" -ForegroundColor Yellow
        Write-Host "请手动检查文件: $cursorSettingsPath" -ForegroundColor Yellow
    }
} else {
    Write-Host "Cursor 设置文件不存在: $cursorSettingsPath" -ForegroundColor Yellow
    Write-Host "这可能是正常的，如果这是首次使用 Cursor" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "修复完成" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "下一步操作：" -ForegroundColor Yellow
Write-Host "1. 重启 Cursor" -ForegroundColor White
Write-Host "2. 按 Ctrl+Shift+P" -ForegroundColor White
Write-Host "3. 输入: Remote-SSH: Connect to Host" -ForegroundColor White
Write-Host "4. 选择: root@115.190.54.220" -ForegroundColor White
Write-Host ""
