$ErrorActionPreference = "Stop"

Push-Location "$PSScriptRoot\..\tests\playwright-js"
npm run test
Pop-Location

Push-Location "$PSScriptRoot\..\tests\selenium-python"
pytest
Pop-Location
