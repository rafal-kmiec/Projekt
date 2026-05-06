$ErrorActionPreference = "Stop"
$ProjectRoot = Resolve-Path "$PSScriptRoot\.."
$ReportsDir = Join-Path $ProjectRoot "reports"
$ExitCode = 0

New-Item -ItemType Directory -Force -Path $ReportsDir | Out-Null

Push-Location "$PSScriptRoot\..\tests\playwright-ts"
$env:PLAYWRIGHT_JUNIT_OUTPUT_FILE = Join-Path $ReportsDir "playwright-regression.xml"
npm run test:regression
if ($LASTEXITCODE -ne 0) { $ExitCode = $LASTEXITCODE }
Remove-Item Env:\PLAYWRIGHT_JUNIT_OUTPUT_FILE -ErrorAction SilentlyContinue
Pop-Location

Push-Location "$PSScriptRoot\..\tests\selenium-python"
.\.venv\Scripts\python.exe -m pytest tests\regression -q --junitxml="$ReportsDir\selenium-regression.xml"
if ($LASTEXITCODE -ne 0 -and $ExitCode -eq 0) { $ExitCode = $LASTEXITCODE }
Pop-Location

& "$PSScriptRoot\generate-report.ps1"
if ($ExitCode -ne 0) { exit $ExitCode }
