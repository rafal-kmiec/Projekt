$ErrorActionPreference = "Stop"
$ProjectRoot = Resolve-Path "$PSScriptRoot\.."
$ReportsDir = Join-Path $ProjectRoot "reports"
$ExitCode = 0

New-Item -ItemType Directory -Force -Path $ReportsDir | Out-Null

Push-Location "$PSScriptRoot\.."
docker compose up --build -d demo-app
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
docker compose exec -T demo-app npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Pop-Location

Push-Location "$PSScriptRoot\..\tests\playwright-ts"
$env:PLAYWRIGHT_JUNIT_OUTPUT_FILE = Join-Path $ReportsDir "playwright-smoke.xml"
npm run test:smoke
if ($LASTEXITCODE -ne 0) { $ExitCode = $LASTEXITCODE }
Remove-Item Env:\PLAYWRIGHT_JUNIT_OUTPUT_FILE -ErrorAction SilentlyContinue
Pop-Location

Push-Location "$PSScriptRoot\..\tests\selenium-python"
.\.venv\Scripts\python.exe -m pytest tests\smoke -q --junitxml="$ReportsDir\selenium-smoke.xml"
if ($LASTEXITCODE -ne 0 -and $ExitCode -eq 0) { $ExitCode = $LASTEXITCODE }
Pop-Location

& "$PSScriptRoot\generate-report.ps1"
if ($ExitCode -ne 0) { exit $ExitCode }
