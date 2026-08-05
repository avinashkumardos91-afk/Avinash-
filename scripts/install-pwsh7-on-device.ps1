<#
.SYNOPSIS
    Installs PowerShell 7.6.4 on a remote ARM64 device (IoT Core / Nano Server)
    and registers a PowerShell 7 remoting endpoint.

.EXAMPLE
    .\install-pwsh7-on-device.ps1 -DeviceIp 192.168.1.50

.NOTES
    Run from an elevated Windows PowerShell or pwsh session.
    Install-PowerShellRemoting.ps1 restarts WinRM on the device, which drops
    the session - that is expected. Reconnect with:
        Enter-PSSession -ComputerName <ip> -Credential Administrator `
                        -ConfigurationName PowerShell.7.6.4
#>
param(
    [Parameter(Mandatory)]
    [string] $DeviceIp,

    [string] $ZipFile = "$env:USERPROFILE\Downloads\PowerShell-7.6.4-win-arm64.zip",

    # Path on the device. U:\ is the IoT Core data partition; on a normal
    # Windows ARM install this is C:\Users\Administrator\Downloads.
    [string] $DownloadFolder = 'U:\Users\Administrator\Downloads',

    # Saved credential, so the run needs no interactive prompt. Create it once:
    #   Get-Credential Administrator | Export-CliXml "$env:USERPROFILE\device-cred.xml"
    # The file is encrypted by Windows DPAPI - only your account on this
    # machine can read it back.
    [string] $CredentialPath
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path $ZipFile)) { throw "Package not found: $ZipFile" }
$zipName = Split-Path $ZipFile -Leaf
$expandedName = [IO.Path]::GetFileNameWithoutExtension($zipName)

# -Concatenate keeps any hosts already trusted instead of replacing the list
Write-Host "Trusting $DeviceIp for WinRM..." -ForegroundColor Cyan
$current = (Get-Item WSMan:\localhost\Client\TrustedHosts).Value
if ($current -split ',' -notcontains $DeviceIp) {
    Set-Item WSMan:\localhost\Client\TrustedHosts -Value $DeviceIp -Concatenate -Force
}

if ($CredentialPath) {
    if (-not (Test-Path $CredentialPath)) { throw "Credential file not found: $CredentialPath" }
    $cred = Import-CliXml $CredentialPath
} else {
    $cred = Get-Credential -UserName Administrator -Message "Password for Administrator on $DeviceIp"
}

if (-not (Test-Connection $DeviceIp -TcpPort 5985 -TimeoutSeconds 5)) {
    throw "$DeviceIp is not listening on 5985. Check the device is powered on, joined to this network, and has WinRM enabled (run 'winrm quickconfig' on the device once)."
}

Write-Host "Connecting to $DeviceIp..." -ForegroundColor Cyan
$S = New-PSSession -ComputerName $DeviceIp -Credential $cred

try {
    Write-Host "Copying $zipName (105 MB) to $DownloadFolder..." -ForegroundColor Cyan
    Invoke-Command -Session $S -ScriptBlock {
        param($folder)
        if (-not (Test-Path $folder)) { New-Item -ItemType Directory -Path $folder | Out-Null }
    } -ArgumentList $DownloadFolder
    Copy-Item $ZipFile -Destination $DownloadFolder -ToSession $S -Force

    Write-Host "Expanding and registering the remoting endpoint..." -ForegroundColor Cyan
    Invoke-Command -Session $S -ScriptBlock {
        param($folder, $zip, $expanded)
        Set-Location $folder
        Expand-Archive -Path (Join-Path $folder $zip) -DestinationPath (Join-Path $folder $expanded) -Force
        Set-Location (Join-Path $folder $expanded)

        # -PowerShellHome is required; without it the endpoint is created
        # against Windows PowerShell 5.1 instead of pwsh 7
        .\Install-PowerShellRemoting.ps1 -PowerShellHome .
    } -ArgumentList $DownloadFolder, $zipName, $expandedName
}
catch [System.Management.Automation.Remoting.PSRemotingTransportException] {
    # Expected: registering the endpoint restarts WinRM and kills the session
    Write-Host "Session dropped - WinRM restarted, which means the endpoint registered." -ForegroundColor Yellow
}
finally {
    if ($S) { Remove-PSSession $S -ErrorAction SilentlyContinue }
}

Write-Host "`nDone. Connect to PowerShell 7 on the device with:" -ForegroundColor Green
Write-Host "  Enter-PSSession -ComputerName $DeviceIp -Credential Administrator -ConfigurationName PowerShell.7.6.4"
