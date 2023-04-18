if (Test-Path ./server.zip) {
        Remove-Item ./server.zip
    }
Get-ChildItem -Path ./ -File | Where-Object { $_.Extension -ne '.env' -and $_.Extension -ne '.ps1' } -outvariable files
Compress-Archive $files server.zip