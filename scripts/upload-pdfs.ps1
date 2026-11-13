# Envia os PDFs do site para o bucket privado "pdfs" do Supabase.
#
# Os arquivos ficam em pdf\site\<categoria>\<arquivo>.pdf (pasta ignorada pelo git)
# e vão para pdfs/<categoria>/<arquivo>.pdf — o mesmo storage_path cadastrado em
# supabase/migrations/0004_catalogo_real.sql.
#
# Uso (na raiz do projeto, com o projeto já linkado via `supabase link`):
#   powershell -ExecutionPolicy Bypass -File scripts\upload-pdfs.ps1

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$siteDir = Join-Path $root 'pdf\site'

if (-not (Test-Path $siteDir)) {
    Write-Error "Pasta não encontrada: $siteDir"
}

$supabase = if (Get-Command supabase -ErrorAction SilentlyContinue) { @('supabase') } else { @('npx', 'supabase') }

$files = Get-ChildItem -Path $siteDir -Recurse -File -Filter *.pdf
$ok = 0
$failed = @()

foreach ($file in $files) {
    $relative = $file.FullName.Substring($siteDir.Length + 1).Replace('\', '/')
    $sizeMb = [math]::Round($file.Length / 1MB, 1)
    Write-Host "Enviando $relative ($sizeMb MB)..."

    # Caminho relativo à raiz: a CLI interpreta "C:\..." como esquema de URL.
    # --yes confirma o envio ao projeto remoto (a CLI v3 exige em modo não interativo).
    $cmd = $supabase + @('storage', 'cp', "pdf/site/$relative", "ss:///pdfs/$relative",
        '--content-type', 'application/pdf', '--experimental', '--remote', '--yes')
    Push-Location $root
    try { & $cmd[0] $cmd[1..($cmd.Length - 1)] } finally { Pop-Location }

    if ($LASTEXITCODE -eq 0) { $ok++ } else { $failed += $relative }
}

Write-Host ""
Write-Host "Enviados: $ok de $($files.Count)"
if ($failed.Count -gt 0) {
    Write-Host "Falharam:" -ForegroundColor Red
    $failed | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
    exit 1
}
