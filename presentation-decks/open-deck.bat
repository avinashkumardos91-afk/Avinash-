@echo off
setlocal
title Presentation Decks

:menu
cls
echo.
echo   PRESENTATION DECKS
echo   ==================================================
echo.
echo    1   Digital Marketing Basics   (v2 - with features)
echo    2   Digital Marketing Basics   (v1 - base version)
echo    3   Blank deck template
echo.
echo    Q   Quit
echo.
set "choice="
set /p "choice=  Choose and press Enter: "

if /i "%choice%"=="1" goto deck1
if /i "%choice%"=="2" goto deck2
if /i "%choice%"=="3" goto deck3
if /i "%choice%"=="q" goto end
goto menu

:deck1
start "" "%~dp0digital-marketing\digital-marketing-deck-v2.html"
goto menu

:deck2
start "" "%~dp0digital-marketing\digital-marketing-deck.html"
goto menu

:deck3
start "" "%~dp0template\deck-template.html"
goto menu

:end
endlocal
