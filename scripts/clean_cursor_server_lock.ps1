# Clean Cursor Server lock files and processes on remote server

Write-Host "Cleaning Cursor Server lock files and processes..." -ForegroundColor Yellow
Write-Host ""

$server = "root@115.190.54.220"
$lockFile = "/run/user/0/cursor-remote-lock.6ca0869f6193ac0d40fa6ae74ed01260"

Write-Host "Connecting to server: $server" -ForegroundColor Cyan
Write-Host ""

# Clean lock files and processes
$cleanCommands = @"
echo '=== Checking Cursor Server processes ==='
ps aux | grep -E 'cursor-server|cursor-remote' | grep -v grep || echo 'No Cursor processes found'

echo ''
echo '=== Stopping Cursor Server processes ==='
pkill -f cursor-server 2>/dev/null || echo 'No cursor-server processes to kill'
pkill -f cursor-remote 2>/dev/null || echo 'No cursor-remote processes to kill'

echo ''
echo '=== Cleaning lock files ==='
rm -f /run/user/0/cursor-remote-lock.* 2>/dev/null && echo 'Lock files removed' || echo 'No lock files found'

echo ''
echo '=== Cleaning temporary files ==='
rm -rf /tmp/cursor-* 2>/dev/null && echo 'Temp files removed' || echo 'No temp files found'
rm -rf /run/user/0/cursor-remote-* 2>/dev/null && echo 'Remote files removed' || echo 'No remote files found'

echo ''
echo '=== Checking for remaining processes ==='
ps aux | grep -E 'cursor-server|cursor-remote' | grep -v grep || echo 'All processes cleaned'
"@

Write-Host "Executing cleanup commands..." -ForegroundColor Yellow
ssh $server $cleanCommands

Write-Host ""
Write-Host "Cleanup completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Wait 5-10 seconds for processes to fully terminate" -ForegroundColor White
Write-Host "2. In Cursor, try connecting again: root@115.190.54.220" -ForegroundColor White
Write-Host ""
