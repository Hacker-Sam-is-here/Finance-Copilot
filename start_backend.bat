@echo off
echo Starting Bharat AI Finance Copilot Backend...
cd backend

echo Activating virtual environment...
if exist venv\Scripts\activate (
    call venv\Scripts\activate
) else (
    echo Virtual environment not found in backend\venv. Running without it...
)

echo Starting FastAPI server...
uvicorn main:app --reload --port 8000

pause
