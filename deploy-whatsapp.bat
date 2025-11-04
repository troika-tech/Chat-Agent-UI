@echo off
echo ========================================
echo  WhatsApp.0804.in Deployment Script (SCP)
echo ========================================
echo.

echo [1/6] Building production version locally...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo.
echo [2/6] Connecting to server...
ssh -i "C:\Users\USER\Desktop\SupaAgent Production/supapai.pem" ubuntu@3.7.68.23 "echo '✓ Connected to server'"

echo.
echo [3/6] Backing up current deployment...
ssh -i "C:\Users\USER\Desktop\SupaAgent Production/supapai.pem" ubuntu@3.7.68.23 "cd /var/www/whatsapp.0804.in && rm -rf dist.backup && cp -r dist dist.backup 2>/dev/null || echo 'No previous dist to backup'"

echo.
echo [4/6] Uploading new files to server...
scp -i "C:\Users\USER\Desktop\SupaAgent Production/supapai.pem" -r dist ubuntu@3.7.68.23:/tmp/whatsapp-dist
if %errorlevel% neq 0 (
    echo ❌ Upload failed!
    pause
    exit /b 1
)

echo.
echo [5/6] Moving files to production directory...
ssh -i "C:\Users\USER\Desktop\SupaAgent Production/supapai.pem" ubuntu@3.7.68.23 "rm -rf /var/www/whatsapp.0804.in/dist && mv /tmp/whatsapp-dist /var/www/whatsapp.0804.in/dist && chmod -R 755 /var/www/whatsapp.0804.in/dist"

echo.
echo [6/6] Reloading nginx...
ssh -i "C:\Users\USER\Desktop\SupaAgent Production/supapai.pem" ubuntu@3.7.68.23 "sudo systemctl reload nginx"

echo.
echo ========================================
echo  ✅ Deployment completed successfully!
echo ========================================
echo.
echo 🌐 Your site is live at:
echo    https://whatsapp.0804.in
echo.
echo 💡 Tip: Your old files are backed up at dist.backup
echo.
pause
