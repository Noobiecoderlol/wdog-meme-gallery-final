# Create examples directory
New-Item -ItemType Directory -Force -Path "public/dogs"

$baseUrl = "https://web.archive.org/web/20240814103328im_/https://www.makeyourwdog.xyz"

# Download all example dogs (0-99)
0..99 | ForEach-Object {
    $url = "$baseUrl/dogs/$_.webp"
    $output = "public/dogs/$_.webp"
    Write-Host "Downloading example dog $_.webp"
    try {
        Invoke-WebRequest -Uri $url -OutFile $output
        Write-Host "Successfully downloaded dog $_.webp"
    }
    catch {
        Write-Host "Failed to download dog $_.webp: $_"
    }
}

Write-Host "Example dogs download complete!" 