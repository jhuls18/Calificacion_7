@echo off
title Sistema de Calificaciones - Servidor Local
color 0B

echo ========================================================
echo   SISTEMA DE CALIFICACIONES - SERVIDOR LOCAL
echo ========================================================
echo.

:: Detectar ejecutable de PHP
set PHP_CMD=php
where php >nul 2>nul
if %errorlevel% neq 0 (
    if exist "C:\xampp\php\php.exe" (
        set PHP_CMD=C:\xampp\php\php.exe
    ) else if exist "C:\laragon\bin\php\php*\php.exe" (
        for /f "delims=" %%i in ('dir /b /s "C:\laragon\bin\php\php*\php.exe"') do set PHP_CMD=%%i
    ) else (
        echo [ERROR] No se encontro PHP en el sistema.
        echo.
        echo Por favor instale una de estas opciones:
        echo   1. XAMPP: https://www.apachefriends.org/
        echo   2. Laragon: https://laragon.org/
        echo   3. PHP standalone: https://windows.php.net/download/
        echo.
        pause
        exit /b 1
    )
)

echo [INFO] Usando PHP: %PHP_CMD%
echo.

echo [INFO] Iniciando servidor local en puerto 8000...
echo.
echo ========================================================
echo   ENLACE PARA EL NAVEGADOR:
echo   http://localhost:8000
echo ========================================================
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

"%PHP_CMD%" -S localhost:8000

pause
