from fastapi import APIRouter, Form
from fastapi.responses import JSONResponse
from models.users import User,Order
from config.database import collection_name,collection_name_2
from schema.schemas import list_serial, individual_serial,list_serial_order,individual_serial_order
from bson import ObjectId
from fastapi import HTTPException
import bcrypt



router = APIRouter()


@router.get("/getUsers")
async def get_users():
    try:
        users = list_serial(collection_name.find())
        return users
    except Exception as e:
        
        print(f"Error occurred: {e}")
        
        raise HTTPException(status_code=500, detail="An error occurred while fetching users.")
    


@router.get("/getOrders")
async def getOrders():
    try:
        orders = list_serial_order(collection_name_2.find())
        return orders
    except Exception as e:
        
        print(f"Error occurred: {e}")
        
        raise HTTPException(status_code=500, detail="An error occurred while fetching orders.")

@router.post("/postUser")
async def post_user(user:User):
    try:
        collection_name.insert_one(dict(user))
        return {"message": "User created successfully"}
    except Exception as e:
        print(f"Error occurred: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while creating the user.")  



@router.post("/postOrder")
async def post_order(order: Order):
    try:
        
        collection_name_2.insert_one(order.model_dump())
        
        
        user = collection_name.find_one({"name": order.userOwner})  
        
       
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")

        
        if "orders" not in user:
            user["orders"] = []  

       
        user["orders"].append(order.model_dump())

        
        print("Updated orders list for user:", user["orders"])
        
       
        result = collection_name.update_one(
            {"name": order.userOwner},
            {"$set": {"orders": user["orders"]}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=500, detail="Failed to update user's order list")

        return JSONResponse(status_code=201, content={"message": "Order created and added to user's order list successfully"})
    
    except Exception as e:
        print(f"Error occurred: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while creating the order.")







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