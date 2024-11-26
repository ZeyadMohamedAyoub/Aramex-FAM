from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI()

from routes.route import router

app.include_router(router)

origins = [
    "*",  
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)


import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv

load_dotenv()  #loading environment variables from .env file

MONGO_URL = os.getenv("MONGO_URL")

uri = MONGO_URL

client = MongoClient(uri, server_api=ServerApi('1'))

#confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
