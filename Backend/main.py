from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI()

from routes.route import router

app.include_router(router)

origins = [
    "http://localhost:4200",  
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)



from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://mohamedsolimanfcai:Ashraf_123@aramex.6k45j.mongodb.net/?retryWrites=true&w=majority&appName=Aramex"

client = MongoClient(uri, server_api=ServerApi('1'))

#confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
