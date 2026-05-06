$ErrorActionPreference = "Stop"

Write-Host "Installing Playwright TypeScript dependencies..."
Push-Location "$PSScriptRoot\..\tests\playwright-ts"
npm install
npx playwright install chromium
Pop-Location

Write-Host "Preparing Selenium Python virtual environment..."
Push-Location "$PSScriptRoot\..\tests\selenium-python"
if (-not (Test-Path ".venv")) {
  py -m venv .venv
}
.\.venv\Scripts\python.exe -m pip install -e .
Pop-Location

Write-Host "Setup complete."
