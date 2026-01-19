# Fix Cursor settings to use correct user path

$currentUser = $env:USERNAME
$currentUserProfile = $env:USERPROFILE
$cursorSettingsPath = "$env:APPDATA\Cursor\User\settings.json"

Write-Host "Current user: $currentUser" -ForegroundColor Yellow
Write-Host "User profile: $currentUserProfile" -ForegroundColor Yellow
Write-Host ""

if (Test-Path $cursorSettingsPath) {
    Write-Host "Found Cursor settings file" -ForegroundColor Green
    
    try {
        $settingsContent = Get-Content $cursorSettingsPath -Raw -Encoding UTF8
        
        if ($settingsContent -match "Aquarius") {
            Write-Host "Found incorrect user path 'Aquarius' in settings" -ForegroundColor Red
            
            # Backup
            $backupPath = "$cursorSettingsPath.backup.$(Get-Date -Format 'yyyyMMddHHmmss')"
            Copy-Item $cursorSettingsPath $backupPath
            Write-Host "Backed up to: $backupPath" -ForegroundColor Gray
            
            # Replace Aquarius with current user
            $fixedContent = $settingsContent -replace "C:\\\\Users\\\\Aquarius", "C:\\Users\\$currentUser"
            $fixedContent = $fixedContent -replace "C:/Users/Aquarius", "C:/Users/$currentUser"
            $fixedContent = $fixedContent -replace "Users/Aquarius", "Users/$currentUser"
            
            $fixedContent | Set-Content -Path $cursorSettingsPath -Encoding UTF8
            Write-Host "Fixed settings file" -ForegroundColor Green
        } else {
            Write-Host "No incorrect paths found" -ForegroundColor Green
        }
    } catch {
        Write-Host "Error: $_" -ForegroundColor Red
    }
} else {
    Write-Host "Cursor settings file not found (this is OK for first-time use)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Restart Cursor" -ForegroundColor White
Write-Host "2. Press Ctrl+Shift+P" -ForegroundColor White
Write-Host "3. Type: Remote-SSH: Connect to Host" -ForegroundColor White
Write-Host "4. Select: root@115.190.54.220" -ForegroundColor White
Write-Host ""
