$ErrorActionPreference = 'Stop'
$dest = 'H:\React\TransferLK\deploy_package'
if (Test-Path $dest) {
    Remove-Item -Recurse -Force $dest
}
New-Item -ItemType Directory -Path $dest | Out-Null

# 1. Copy Frontend Dist
Copy-Item -Path 'H:\React\TransferLK\frontend\dist\*' -Destination $dest -Recurse -Force
if (Test-Path 'H:\React\TransferLK\frontend\dist\.htaccess') {
    Copy-Item -Path 'H:\React\TransferLK\frontend\dist\.htaccess' -Destination $dest -Force
}

# 2. Copy Backend
$backendDest = Join-Path $dest 'backend'
New-Item -ItemType Directory -Path $backendDest | Out-Null
Copy-Item -Path 'H:\React\TransferLK\backend\config' -Destination $backendDest -Recurse -Force
Copy-Item -Path 'H:\React\TransferLK\backend\Controller' -Destination $backendDest -Recurse -Force
Copy-Item -Path 'H:\React\TransferLK\backend\Model' -Destination $backendDest -Recurse -Force
Copy-Item -Path 'H:\React\TransferLK\backend\routes' -Destination $backendDest -Recurse -Force
Copy-Item -Path 'H:\React\TransferLK\backend\services' -Destination $backendDest -Recurse -Force
Copy-Item -Path 'H:\React\TransferLK\backend\index.php' -Destination $backendDest -Force
Copy-Item -Path 'H:\React\TransferLK\backend\.htaccess' -Destination $backendDest -Force
Copy-Item -Path 'H:\React\TransferLK\backend\.env' -Destination $backendDest -Force
Copy-Item -Path 'H:\React\TransferLK\backend\database.sql' -Destination $backendDest -Force

# 3. Create deploy.zip
$zipFile = 'H:\React\TransferLK\deploy_transferlk.zip'
if (Test-Path $zipFile) {
    Remove-Item -Force $zipFile
}
Compress-Archive -Path "$dest\*" -DestinationPath $zipFile -Force

Write-Host "Deployment package created successfully at: $dest and $zipFile"

