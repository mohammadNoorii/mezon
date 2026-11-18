# Sepid bridal site - download all photos from Unsplash (free license) into .\images
# Run: right-click > "Run with PowerShell"  (or double-click download-images.bat)
$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$dir = Join-Path $PSScriptRoot 'images'
New-Item -ItemType Directory -Force -Path $dir | Out-Null
$list = @(
  @('hero','https://images.unsplash.com/photo-1622277430358-f4d134452e2e?w=2400&h=1400&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('style-princess','https://images.unsplash.com/photo-1681714552617-fe3f4cf4be47?w=800&h=1000&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('style-mermaid','https://images.unsplash.com/photo-1585241920473-b472eb9ffbae?w=800&h=1000&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('style-aline','https://images.unsplash.com/photo-1548313093-370cf4ba3892?w=800&h=1000&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('style-boho','https://images.unsplash.com/photo-1654266552357-c743547d54dd?w=800&h=1000&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('style-minimal','https://images.unsplash.com/photo-1676132068643-9ebacec267e2?w=800&h=1000&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('style-modest','https://images.unsplash.com/photo-1604531825858-a8e24ed6b43d?w=800&h=1000&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('dress-01','https://images.unsplash.com/photo-1673936089727-6edda18b127e?w=900&h=1200&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('dress-01-b','https://images.unsplash.com/photo-1521467752200-3bccf80f16ed?w=900&h=1200&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('dress-02','https://images.unsplash.com/photo-1754549229229-a63d681d6993?w=900&h=1200&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('dress-02-b','https://images.unsplash.com/photo-1525169087805-031a4da0623c?w=900&h=1200&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('dress-03','https://images.unsplash.com/photo-1696831610247-5fd886f65d5b?w=900&h=1200&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('dress-03-b','https://images.unsplash.com/photo-1625224702026-dd5f6734ccdc?w=900&h=1200&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('dress-04','https://images.unsplash.com/photo-1790503076102-2d21c7b5bf4e?w=900&h=1200&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('dress-04-b','https://images.unsplash.com/photo-1706741921229-b3d2e431daab?w=900&h=1200&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('dress-05','https://images.unsplash.com/photo-1593835351974-1c99239fed62?w=900&h=1200&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('dress-05-b','https://images.unsplash.com/photo-1632378464836-a6a856632552?w=900&h=1200&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('dress-06','https://images.unsplash.com/photo-1529636273736-fc88b31ea9d9?w=900&h=1200&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('dress-06-b','https://images.unsplash.com/photo-1774660810310-5023390fe028?w=900&h=1200&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('dress-07','https://images.unsplash.com/photo-1560612268-80be18b2ad9f?w=900&h=1200&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('dress-07-b','https://images.unsplash.com/photo-1524649847196-ccb8e27b902d?w=900&h=1200&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('dress-08','https://images.unsplash.com/photo-1761116065261-586acfd09b7f?w=900&h=1200&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('dress-08-b','https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=900&h=1200&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('dress-09','https://images.unsplash.com/photo-1774009501393-bac5a0a11afc?w=900&h=1200&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('dress-09-b','https://images.unsplash.com/photo-1549488497-94b52bddac5d?w=900&h=1200&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('dress-10','https://images.unsplash.com/photo-1782776852907-de5259d03e2d?w=900&h=1200&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('dress-10-b','https://images.unsplash.com/photo-1549416878-b9ca95e26903?w=900&h=1200&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('dress-11','https://images.unsplash.com/photo-1770757685010-2d3d30d270d6?w=900&h=1200&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('dress-11-b','https://images.unsplash.com/photo-1566942974683-0a1aa5d212f1?w=900&h=1200&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('dress-12','https://images.unsplash.com/photo-1790503076066-9e41dcb6b4fc?w=900&h=1200&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('dress-12-b','https://images.unsplash.com/photo-1549417229-7686ac5595fd?w=900&h=1200&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('about','https://images.unsplash.com/photo-1781269199194-500fa51986d2?w=1200&h=1400&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('about-detail','https://images.unsplash.com/photo-1706741921229-b3d2e431daab?w=900&h=1100&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('about-fitting','https://images.unsplash.com/photo-1678862812110-2326de6ea750?w=900&h=1100&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('service-rent','https://images.unsplash.com/photo-1781269119690-8fa19aafe13d?w=900&h=600&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('service-custom','https://images.unsplash.com/photo-1632378464836-a6a856632552?w=900&h=600&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('service-engagement','https://images.unsplash.com/photo-1765871421513-452fe03d15cc?w=900&h=600&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('service-evening','https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=900&h=600&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('service-accessory','https://images.unsplash.com/photo-1719953146138-e3d54f36a25c?w=900&h=600&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('service-package','https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=900&h=600&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('gallery-01','https://images.unsplash.com/photo-1557363763-8381968f8353?w=900&h=1200&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('gallery-02','https://images.unsplash.com/photo-1517456215183-9a2c3a748d0c?w=1000&h=1000&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('gallery-03','https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=960&h=1200&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('gallery-04','https://images.unsplash.com/photo-1502955422409-06e43fd3eff3?w=720&h=1200&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('gallery-05','https://images.unsplash.com/photo-1511288702291-e55d6cfbe3b5?w=1000&h=1000&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('gallery-06','https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=900&h=1200&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('gallery-07','https://images.unsplash.com/photo-1779055660462-4a5c1414d56d?w=960&h=1200&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('gallery-08','https://images.unsplash.com/photo-1596181243306-e02a1897afb1?w=900&h=1200&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('gallery-09','https://images.unsplash.com/photo-1543290556-86c013a17574?w=1000&h=1000&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('gallery-10','https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=900&h=1200&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('gallery-11','https://images.unsplash.com/photo-1581017381153-d8d61f603589?w=1000&h=1000&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('gallery-12','https://images.unsplash.com/photo-1595868321403-bac51fbdeb97?w=960&h=1200&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('gallery-13','https://images.unsplash.com/photo-1593575620619-602b4ddf6e96?w=900&h=1200&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('gallery-14','https://images.unsplash.com/photo-1534821163011-cffe981cc8cb?w=1000&h=1000&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('gallery-15','https://images.unsplash.com/photo-1492175742197-ed20dc5a6bed?w=900&h=1200&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('cta-bg','https://images.unsplash.com/photo-1589458456444-f7158a7e8a4f?w=2000&h=900&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('page-collection','https://images.unsplash.com/photo-1759893362613-8bb8bb057af1?w=2000&h=800&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('page-services','https://images.unsplash.com/photo-1529635322560-e767888a1583?w=2000&h=800&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('page-about','https://images.unsplash.com/photo-1632378464836-a6a856632552?w=2000&h=800&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('page-brides','https://images.unsplash.com/photo-1549416878-b9ca95e26903?w=2000&h=800&fit=crop&crop=faces,center&fm=webp&q=80'),
  @('page-contact','https://images.unsplash.com/photo-1781269119690-8fa19aafe13d?w=2000&h=800&fit=crop&crop=faces,center&fm=webp&q=80')
)
$ok = 0; $fail = @()
foreach ($item in $list) {
  $out = Join-Path $dir ($item[0] + '.webp')
  if (Test-Path $out) { $ok++; Write-Host "skip  $($item[0])"; continue }
  try {
    Invoke-WebRequest -Uri $item[1] -OutFile $out -UseBasicParsing -TimeoutSec 60
    $ok++; Write-Host "ok    $($item[0])" -ForegroundColor Green
  } catch { $fail += $item[0]; Write-Host "FAIL  $($item[0])" -ForegroundColor Red }
}
Write-Host ""
Write-Host "Done: $ok of $($list.Count) images saved in $dir"
if ($fail.Count) { Write-Host "Failed (run again to retry): $($fail -join ', ')" -ForegroundColor Yellow }
Read-Host "Press Enter to close"
