@echo off
title SaaS Legal - The Sovereign Vault v2.4 AI (Localhost Server)
echo ===================================================================
echo   Iniciando SaaS Legal ("The Sovereign Vault" v2.4 AI)
echo   URL Local: http://localhost:8080
echo ===================================================================
start "" "http://localhost:8080"
python -m http.server 8080
pause
