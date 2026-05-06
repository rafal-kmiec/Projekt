$ErrorActionPreference = "Stop"

$ProjectRoot = Resolve-Path "$PSScriptRoot\.."
$ReportsDir = Join-Path $ProjectRoot "reports"
$OutputFile = Join-Path $ReportsDir "index.html"

New-Item -ItemType Directory -Force -Path $ReportsDir | Out-Null

function ConvertTo-Int($Value) {
    if ($null -eq $Value -or "$Value" -eq "") {
        return 0
    }

    return [int][double]$Value
}

function ConvertTo-Decimal($Value) {
    if ($null -eq $Value -or "$Value" -eq "") {
        return [decimal]0
    }

    return [decimal]$Value
}

function Escape-Html($Value) {
    return [System.Net.WebUtility]::HtmlEncode("$Value")
}

function Get-JUnitSuites($Document) {
    if ($Document.testsuites) {
        return @($Document.testsuites.testsuite)
    }

    if ($Document.testsuite) {
        return @($Document.testsuite)
    }

    return @()
}

$XmlFiles = Get-ChildItem -Path $ReportsDir -Filter "*.xml" -File | Sort-Object Name
$Rows = @()

foreach ($XmlFile in $XmlFiles) {
    [xml]$Document = Get-Content -Path $XmlFile.FullName
    $Suites = Get-JUnitSuites $Document

    $Tests = 0
    $Failures = 0
    $Errors = 0
    $Skipped = 0
    $Duration = [decimal]0

    foreach ($Suite in $Suites) {
        $Tests += ConvertTo-Int $Suite.tests
        $Failures += ConvertTo-Int $Suite.failures
        $Errors += ConvertTo-Int $Suite.errors
        $Skipped += ConvertTo-Int $Suite.skipped
        $Duration += ConvertTo-Decimal $Suite.time
    }

    $Failed = $Failures + $Errors
    $Passed = [Math]::Max(0, $Tests - $Failed - $Skipped)
    $Status = if ($Failed -eq 0) { "passed" } else { "failed" }

    $Rows += [pscustomobject]@{
        Source = $XmlFile.Name
        Status = $Status
        Tests = $Tests
        Passed = $Passed
        Failed = $Failed
        Skipped = $Skipped
        Duration = [Math]::Round($Duration, 2)
        Updated = $XmlFile.LastWriteTime.ToString("yyyy-MM-dd HH:mm:ss")
    }
}

$TotalTests = ($Rows | Measure-Object -Property Tests -Sum).Sum
$TotalPassed = ($Rows | Measure-Object -Property Passed -Sum).Sum
$TotalFailed = ($Rows | Measure-Object -Property Failed -Sum).Sum
$TotalSkipped = ($Rows | Measure-Object -Property Skipped -Sum).Sum
$TotalDuration = ($Rows | Measure-Object -Property Duration -Sum).Sum
$OverallStatus = if ($TotalFailed -eq 0) { "passed" } else { "failed" }
$GeneratedAt = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

$TableRows = if ($Rows.Count -gt 0) {
    ($Rows | ForEach-Object {
        "<tr><td>$(Escape-Html $_.Source)</td><td><span class=""status $($_.Status)"">$($_.Status)</span></td><td>$($_.Tests)</td><td>$($_.Passed)</td><td>$($_.Failed)</td><td>$($_.Skipped)</td><td>$($_.Duration)s</td><td>$(Escape-Html $_.Updated)</td></tr>"
    }) -join "`n"
} else {
    "<tr><td colspan=""8"" class=""empty"">No JUnit XML files found in reports.</td></tr>"
}

$Html = @"
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>CommsFlow Test Report</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f6f7f9;
      --panel: #ffffff;
      --text: #172033;
      --muted: #617086;
      --border: #d9e0ea;
      --passed: #157347;
      --failed: #b42318;
    }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: "Segoe UI", Arial, sans-serif;
    }
    main {
      width: min(1120px, calc(100% - 40px));
      margin: 32px auto;
    }
    h1 {
      margin: 0 0 6px;
      font-size: 30px;
      font-weight: 700;
    }
    .meta {
      color: var(--muted);
      margin-bottom: 24px;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(5, minmax(120px, 1fr));
      gap: 12px;
      margin-bottom: 22px;
    }
    .metric,
    table {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 8px;
    }
    .metric {
      padding: 16px;
    }
    .metric span {
      color: var(--muted);
      display: block;
      font-size: 13px;
      margin-bottom: 8px;
    }
    .metric strong {
      font-size: 28px;
    }
    table {
      border-collapse: separate;
      border-spacing: 0;
      width: 100%;
      overflow: hidden;
    }
    th,
    td {
      padding: 12px 14px;
      text-align: left;
      border-bottom: 1px solid var(--border);
    }
    th {
      color: var(--muted);
      font-size: 13px;
      font-weight: 650;
    }
    tr:last-child td {
      border-bottom: 0;
    }
    .status {
      border-radius: 999px;
      color: white;
      display: inline-block;
      font-size: 12px;
      font-weight: 700;
      padding: 4px 9px;
      text-transform: uppercase;
    }
    .status.passed {
      background: var(--passed);
    }
    .status.failed {
      background: var(--failed);
    }
    .empty {
      color: var(--muted);
      text-align: center;
    }
    @media (max-width: 780px) {
      .summary {
        grid-template-columns: repeat(2, minmax(120px, 1fr));
      }
      table {
        font-size: 14px;
      }
      th,
      td {
        padding: 10px;
      }
    }
  </style>
</head>
<body>
  <main>
    <h1>CommsFlow Test Report</h1>
    <div class="meta">Generated at $GeneratedAt from JUnit XML files in <code>reports/</code>.</div>
    <section class="summary" aria-label="Summary">
      <div class="metric"><span>Status</span><strong>$(Escape-Html $OverallStatus)</strong></div>
      <div class="metric"><span>Total</span><strong>$TotalTests</strong></div>
      <div class="metric"><span>Passed</span><strong>$TotalPassed</strong></div>
      <div class="metric"><span>Failed</span><strong>$TotalFailed</strong></div>
      <div class="metric"><span>Skipped</span><strong>$TotalSkipped</strong></div>
    </section>
    <table>
      <thead>
        <tr>
          <th>Source</th>
          <th>Status</th>
          <th>Tests</th>
          <th>Passed</th>
          <th>Failed</th>
          <th>Skipped</th>
          <th>Duration</th>
          <th>Updated</th>
        </tr>
      </thead>
      <tbody>
        $TableRows
      </tbody>
    </table>
  </main>
</body>
</html>
"@

Set-Content -Path $OutputFile -Value $Html -Encoding UTF8
Write-Host "Combined report written to $OutputFile"
