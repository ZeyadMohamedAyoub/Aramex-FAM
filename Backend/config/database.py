from pymongo import MongoClient


client = MongoClient("mongodb+srv://mohamedsolimanfcai:Ashraf_123@aramex.6k45j.mongodb.net/?retryWrites=true&w=majority&appName=Aramex")

db = client.user_db

collection_name = db["user_collection"]

collection_name_2=db["order_collection"]