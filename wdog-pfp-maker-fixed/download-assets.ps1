# Create directories if they don't exist
New-Item -ItemType Directory -Force -Path "src/assets/back"
New-Item -ItemType Directory -Force -Path "src/assets/body"
New-Item -ItemType Directory -Force -Path "src/assets/eyes"
New-Item -ItemType Directory -Force -Path "src/assets/hats"
New-Item -ItemType Directory -Force -Path "src/assets/clothes"
New-Item -ItemType Directory -Force -Path "src/assets/items"

$baseUrl = "https://web.archive.org/web/20240814103328im_/https://www.makeyourwdog.xyz"

# Download backgrounds (0-35)
0..35 | ForEach-Object {
    $url = "$baseUrl/back/$_.webp"
    $output = "src/assets/back/$_.webp"
    Write-Host "Downloading $url"
    Invoke-WebRequest -Uri $url -OutFile $output
}

# Download body (0-1)
0..1 | ForEach-Object {
    $url = "$baseUrl/body/$_.webp"
    $output = "src/assets/body/$_.webp"
    Write-Host "Downloading $url"
    Invoke-WebRequest -Uri $url -OutFile $output
}

# Download eyes (0-21)
0..21 | ForEach-Object {
    $url = "$baseUrl/eyes/$_.webp"
    $output = "src/assets/eyes/$_.webp"
    Write-Host "Downloading $url"
    Invoke-WebRequest -Uri $url -OutFile $output
}

# Download hats (0-37)
0..37 | ForEach-Object {
    $url = "$baseUrl/hats/$_.webp"
    $output = "src/assets/hats/$_.webp"
    Write-Host "Downloading $url"
    Invoke-WebRequest -Uri $url -OutFile $output
}

# Download clothes (0-35)
0..35 | ForEach-Object {
    $url = "$baseUrl/clothes/$_.webp"
    $output = "src/assets/clothes/$_.webp"
    Write-Host "Downloading $url"
    Invoke-WebRequest -Uri $url -OutFile $output
}

# Download items (0-13)
0..13 | ForEach-Object {
    $url = "$baseUrl/items/$_.webp"
    $output = "src/assets/items/$_.webp"
    Write-Host "Downloading $url"
    Invoke-WebRequest -Uri $url -OutFile $output
}

Write-Host "Download complete!" 