@ECHO OFF

SET WSL_HOME=your_username_on_wsl

for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do SET "dt=%%a"
SET "YY=%dt:~2,2%" & SET "YYYY=%dt:~0,4%" & SET "MM=%dt:~4,2%" & SET "DD=%dt:~6,2%"
SET "HH=%dt:~8,2%" & SET "Min=%dt:~10,2%" & SET "Sec=%dt:~12,2%"

SET "fullstamp=%YYYY%-%MM%-%DD%_%HH%-%Min%-%Sec%"

SET SOURCE_DIRECTORY=%cd%

ECHO %TIME% Building the executable: Started
SET CGO_ENABLED=0

SET GOARCH=amd64
SET GOOS=linux
ECHO %TIME% Building the executable: Linux amd64
go build -a -tags netgo -o .\build\linux_amd64\terraform-provider-dynatrace_v1.8.3 %SOURCE_DIRECTORY%
xcopy /Y /s .\build\linux_amd64\terraform-provider-dynatrace_v1.8.3 \\wsl.localhost\Ubuntu\home\%WSL_HOME%\repos\Dynatrace-Config-Manager\flask-backend\terraform\dynatrace.com\com\dynatrace\1.8.3\linux_amd64

ECHO %TIME% Building the executable: Done