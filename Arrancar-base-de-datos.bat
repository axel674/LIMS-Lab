@echo off
title Base de datos LIMS (local)
cd /d "%~dp0"
if not exist node_modules (
  echo Instalando dependencias, solo la primera vez...
  call npm install
)
node database\servidor-local.mjs
pause
