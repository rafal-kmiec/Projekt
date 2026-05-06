$ErrorActionPreference = "Stop"
$ProjectRoot = Resolve-Path "$PSScriptRoot\.."
$ReportsDir = Join-Path $ProjectRoot "reports"
$ExitCode = 0

New-Item -ItemType Directory -Force -Path $ReportsDir | Out-Null

Push-Location "$PSScriptRoot\..\tests\selenium-python"
.\.venv\Scripts\python.exe -m pytest --junitxml="$ReportsDir\selenium-all.xml"
if ($LASTEXITCODE -ne 0) { $ExitCode = $LASTEXITCODE }
Pop-Location

& "$PSScriptRoot\generate-report.ps1"
if ($ExitCode -ne 0) { exit $ExitCode }
