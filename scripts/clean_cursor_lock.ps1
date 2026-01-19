# Clean Cursor Server lock files on remote server

$server = "root@115.190.54.220"

Write-Host "Cleaning Cursor Server on: $server" -ForegroundColor Yellow
Write-Host ""

# Use semicolon-separated commands to avoid line ending issues
$commands = "pkill -9 -f cursor-server; pkill -9 -f cursor-remote; pkill -9 -f 'wget.*cursor'; rm -f /run/user/0/cursor-remote-lock.*; rm -rf /tmp/cursor-*; rm -rf /run/user/0/cursor-remote-*; echo 'Cleanup completed'"

ssh $server $commands

Write-Host ""
Write-Host "Cleanup done! Wait 5 seconds, then try connecting again in Cursor." -ForegroundColor Green
Write-Host ""
