$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$ports = 8123, 8124, 8125

function Test-PortFree {
  param([int]$Port)

  $busy = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
  return -not $busy
}

$port = ($ports | Where-Object { Test-PortFree $_ } | Select-Object -First 1)
if (-not $port) {
  throw "No free port found in: $($ports -join ', ')"
}

Set-Location $root

if (-not (Test-Path "node_modules")) {
  Write-Host "Installing npm dependencies..."
  npm install
}

Write-Host "Starting Learn C++ RU on port $port..."
Write-Host "Local URL:   http://127.0.0.1:$port/index.html"
Write-Host "Lesson URL:  http://127.0.0.1:$port/lesson.html?id=cpp-basics"

$addresses = Get-NetIPAddress -AddressFamily IPv4 |
  Where-Object { $_.IPAddress -notlike "127.*" -and $_.PrefixOrigin -ne "WellKnown" } |
  Select-Object -ExpandProperty IPAddress

foreach ($address in $addresses) {
  Write-Host "Network URL: http://$address`:$port/index.html"
}

npm run dev -- --port $port
