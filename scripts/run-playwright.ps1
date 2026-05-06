$ErrorActionPreference = "Stop"
Push-Location "$PSScriptRoot\..\tests\playwright-ts"
npm run test
Pop-Location
