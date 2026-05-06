$ErrorActionPreference = "Stop"

Push-Location "$PSScriptRoot\.."
docker compose up --build -d demo-app
docker compose exec -T demo-app npm run build
Pop-Location

Push-Location "$PSScriptRoot\..\tests\playwright-ts"
npm run test:smoke
Pop-Location

Push-Location "$PSScriptRoot\..\tests\selenium-python"
.\.venv\Scripts\python.exe -m pytest tests\smoke -q
Pop-Location
