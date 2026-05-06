$ErrorActionPreference = "Stop"

Push-Location "$PSScriptRoot\..\tests\playwright-ts"
npm run test:regression
Pop-Location

Push-Location "$PSScriptRoot\..\tests\selenium-python"
.\.venv\Scripts\python.exe -m pytest tests\regression -q
Pop-Location
