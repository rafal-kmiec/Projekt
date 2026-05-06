$ErrorActionPreference = "Stop"
Push-Location "$PSScriptRoot\..\tests\playwright-js"
npm run test
Pop-Location
