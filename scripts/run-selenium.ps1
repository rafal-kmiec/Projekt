$ErrorActionPreference = "Stop"
Push-Location "$PSScriptRoot\..\tests\selenium-python"
pytest
Pop-Location
