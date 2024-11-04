from fastapi import APIRouter, Form
from models.users import User
from config.database import collection_name
from schema.schemas import list_serial, individual_serial
from bson import ObjectId
from fastapi import HTTPException
import bcrypt



router = APIRouter()


@router.get("/")
async def get_users():
    try:
        users = list_serial(collection_name.find())
        return users
    except Exception as e:
        
        print(f"Error occurred: {e}")
        
        raise HTTPException(status_code=500, detail="An error occurred while fetching users.")
    

@router.post("/")
async def post_user(user:User):
    try:
        collection_name.insert_one(dict(user))
        return {"message": "User created successfully"}
    except Exception as e:
        print(f"Error occurred: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while creating the user.")  







@router.post("/authenticate")
async def authenticate_user(name: str = Form(...), password: str = Form(...)):
    try:
        
        
        
        found_user = collection_name.find_one({"name": name})
        
        if not found_user:
            raise HTTPException(status_code=401, detail="Invalid username or password")
        
        
        '''if not bcrypt.checkpw(password.encode('utf-8'), found_user['password'].encode('utf-8')):
            raise HTTPException(status_code=401, detail="Invalid username or password")'''
        
        
        return {"user": individual_serial(found_user)}
    
    except Exception as e:
        
        print(f"Error occurred: {e}")
        
        raise HTTPException(status_code=500, detail="An error occurred while authenticating the user.")