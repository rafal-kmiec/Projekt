$ErrorActionPreference = "Stop"

Push-Location "$PSScriptRoot\..\tests\playwright-ts"
npm run test
Pop-Location

Push-Location "$PSScriptRoot\..\tests\selenium-python"
pytest
Pop-Location
