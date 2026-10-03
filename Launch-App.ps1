# Apex Horizon School Management System - Standalone HTTP Web Server & Browser Launcher
$port = 3000
$path = $PSScriptRoot
if (-not $path) { $path = (Get-Location).Path }

# Detect Local IPv4 for Mobile Testing
$localIp = "127.0.0.1"
try {
    $ipLines = (ipconfig | Select-String "IPv4")
    foreach ($line in $ipLines) {
        if ($line -match "192\.168\.\d{1,3}\.\d{1,3}") {
            $localIp = $matches[0]
            break
        }
    }
} catch {}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  APEX HORIZON ACADEMY - SCHOOL MANAGEMENT SYSTEM (PWA)   " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Serving application from: $path" -ForegroundColor Yellow
Write-Host "Computer Browser URL : http://localhost:$port" -ForegroundColor Green
Write-Host "Mobile / Tablet URL  : http://$localIp`:$port" -ForegroundColor Magenta
Write-Host "   (Connect your phone to the same Wi-Fi or Mobile Hotspot)" -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Cyan

# Check if Python is available
$py = Get-Command python -ErrorAction SilentlyContinue
if ($py) {
    Write-Host "Starting Python HTTP Server on 0.0.0.0:$port..." -ForegroundColor Cyan
    Start-Process "http://localhost:$port" -ErrorAction SilentlyContinue
    python -m http.server $port --bind 0.0.0.0 --directory $path
    exit
}

# Fallback to Native PowerShell HTTP Server
Start-Process "http://localhost:$port" -ErrorAction SilentlyContinue

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")

try {
    $listener.Start()
    Write-Host "PowerShell Web server active on port $port! Press Ctrl+C to terminate." -ForegroundColor Green
    
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawUrl = $request.Url.LocalPath
        if ($rawUrl -eq "/") { $rawUrl = "/index.html" }

        $localFilePath = Join-Path $path $rawUrl.TrimStart('/')

        if (Test-Path $localFilePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($localFilePath)
            
            $ext = [System.IO.Path]::GetExtension($localFilePath).ToLower()
            $contentType = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".json" { "application/json; charset=utf-8" }
                ".webmanifest" { "application/manifest+json; charset=utf-8" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".svg"  { "image/svg+xml" }
                Default { "application/octet-stream" }
            }

            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $notFoundBytes = [System.Text.Encoding]::UTF8.GetBytes("404 - File Not Found")
            $response.OutputStream.Write($notFoundBytes, 0, $notFoundBytes.Length)
        }

        $response.Close()
    }
} catch {
    Write-Host "Server stopped or port in use: $_" -ForegroundColor Yellow
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
}
