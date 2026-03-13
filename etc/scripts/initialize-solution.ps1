$ErrorActionPreference = "Stop"
$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

function Run-Step {
    param(
        [string] $Name,
        [scriptblock] $Action
    )

    try {
        & $Action

        if ($LASTEXITCODE -ne 0) {
            throw "Step '$Name' exited with code $LASTEXITCODE"
        }
    }
    catch {
        [Console]::Error.WriteLine("Step '$Name' FAILED")
        exit -1
    }
}

Run-Step "InstallLibs" {
    Set-Location (Join-Path $scriptRoot "..\..\")
    abp install-libs
}

Run-Step "DbMigrator" {
    Set-Location (Join-Path $scriptRoot "../../WebAppSample")
    dotnet run --migrate-database
    dotnet run --migrate-database
}

Run-Step "DevCert" {
    Set-Location (Join-Path $scriptRoot "../../WebAppSample")
    dotnet dev-certs https -v -ep openiddict.pfx -p 99c7649d-ec25-4d02-96cd-44b0030513b1
}

exit 0
