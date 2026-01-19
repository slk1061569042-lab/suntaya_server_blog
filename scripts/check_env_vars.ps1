# Check environment variables for incorrect paths

Write-Host "Checking environment variables..." -ForegroundColor Yellow
Write-Host ""

$envVars = @('SSH_CONFIG_FILE', 'USERPROFILE', 'HOME', 'USER')
foreach ($var in $envVars) {
    $val = [Environment]::GetEnvironmentVariable($var, 'User')
    if ($val) {
        Write-Host "$var = $val" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Checking for 'Aquarius' in environment variables..." -ForegroundColor Yellow
$found = $false
Get-ChildItem Env: | Where-Object { $_.Value -match 'Aquarius' } | ForEach-Object {
    Write-Host "$($_.Name) = $($_.Value)" -ForegroundColor Red
    $found = $true
}

if (-not $found) {
    Write-Host "No environment variables with 'Aquarius' found" -ForegroundColor Green
}

Write-Host ""
