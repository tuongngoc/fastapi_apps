# main.py
import uvicorn
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()
# first 'static' specify route path, second 'static' specify html files directory.
app.mount('/static', StaticFiles(directory='static',html=True))
if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0')