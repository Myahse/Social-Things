# Load backend/.env then start Spring Boot against Neon
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

$envFile = Join-Path $PSScriptRoot '.env'
if (-not (Test-Path $envFile)) {
  Write-Error 'Missing backend/.env — copy backend/.env.example and fill Neon credentials.'
}

Get-Content $envFile | ForEach-Object {
  $line = $_.Trim()
  if (-not $line -or $line.StartsWith('#')) { return }
  $parts = $line -split '=', 2
  if ($parts.Length -ne 2) { return }
  [System.Environment]::SetEnvironmentVariable($parts[0].Trim(), $parts[1].Trim(), 'Process')
}

$mvn = 'C:\Program Files\Apache\apache-maven-3.9.11\bin\mvn.cmd'
Write-Host 'Starting API with Neon datasource...'
& $mvn spring-boot:run
