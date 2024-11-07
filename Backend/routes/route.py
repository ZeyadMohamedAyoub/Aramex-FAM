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
        orders_cursor = collection_name_2.find()
        orders = list_serial_order(orders_cursor)
        return JSONResponse(status_code=200,content=orders)
    except Exception as e:
        
        print(f"Error occurred: {e}")
        
        raise HTTPException(status_code=500, detail="An error occurred while fetching orders.")



@router.get("/orders/{orderId}")
async def getOrders(orderId:str):
    try:
        order_id=ObjectId(orderId)
        order = collection_name_2.find_one({"_id": order_id})
        order["_id"] = str(order["_id"])
        return order
    except Exception as e:
        
        print(f"Error occurred: {e}")
        
        raise HTTPException(status_code=500, detail="An error occurred while fetching orders.")

@router.get("/getUserOrders")
async def get_user_orders(username:str):
     try:
          orders= list_serial_order(collection_name_2.find({"userOwner":username}))
          print(orders)
          return JSONResponse(status_code=200,content=orders)
     except Exception as e:
          print(f"Error occured: {e}")
          raise HTTPException(status_code=500, detail="An error occurred while fetching orders.")


@router.post("/postUser")
async def post_user(user:User):
    try:
        
         existing_user = collection_name.find_one({"name": user.name})
         if existing_user:
            raise HTTPException(status_code=400, detail="Username already exists")
        
         collection_name.insert_one(dict(user))
         return {"message": "User created successfully"}
    except Exception as e:
        print(f"Error occurred: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while creating the user.")  



@router.post("/postOrder")
async def post_order(order: Order):
    try:
        
        result= collection_name_2.insert_one(order.model_dump())

        
        order_id=str(result.inserted_id)
        
        
        user = collection_name.find_one({"name": order.userOwner})  
        
        
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")

        

        
        user["orders"].append(order_id)

        
        print("Updated orders list for user:", user["orders"])
        
        
        result = collection_name.update_one(
            {"name": order.userOwner},
            {"$set": {"orders": user["orders"]}}
        )
        
        
        

        return JSONResponse(status_code=201, content={"message": "Order created and added to user's order list successfully"})
    
    except Exception as e:
        print(f"Error occurred: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while creating the order.")







@router.post("/authenticate")
async def authenticate_user(name: str = Form(...), password: str = Form(...)):
    try:
        
        
        
        found_user = collection_name.find_one({"name": name,"password":password})
        
        if not found_user:
            raise HTTPException(status_code=401, detail="Invalid username or password")
        
        
        
        
        print(individual_serial(found_user))
        
        
        return {"user": individual_serial(found_user)}
    
    except Exception as e:
        
        print(f"Error occurred: {e}")
        
        raise HTTPException(status_code=500, detail="An error occurred while authenticating the user.")
    

@router.put("/addOrder/{name}/{orderID}")
async def add_order_to_courier(name:str,orderID:str):
    
    order_id = ObjectId(orderID)  
    
    
    # Check if the courier exists
    found_courier = collection_name.find_one({"name": name})
    if found_courier is None:
        raise HTTPException(status_code=404, detail="Courier not found")
    
    
    found_courier_id = str(found_courier["_id"])
    
    
    found_order = collection_name_2.find_one({"_id": order_id})
    if found_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    
    
    result = collection_name_2.update_one(
        {"_id": order_id},
        {"$set": {"courierId": found_courier_id}}
    )
    
    
    found_courier["orders"].append(orderID)
    
    
    result = collection_name.update_one(
        {"name": name},
        {"$set": {"orders": found_courier["orders"]}}
    )
    
    
    if result.modified_count == 0:
        raise HTTPException(status_code=500, detail="Failed to update user's order list")

    return JSONResponse(status_code=201, content={"message": "Order assigned to courier successfully"})


@router.get("/getCourierOrders")
async def get_courier_orders(name: str):
    try:
        
    
        
        
        found_courier = collection_name.find_one({"name": name})

        
        if found_courier is None:
            raise HTTPException(status_code=404, detail="Courier not found")
        
        
        ordersIds = found_courier.get("orders", [])
        orders = []
        for order_id in ordersIds:
            order = collection_name_2.find_one({"_id": ObjectId(order_id)})
            if order:
                order["_id"] = str(order["_id"])
                order["courierId"]=str(order["courierId"])  
                orders.append(order)


        print(orders)        
        
        
        
        
        
        return JSONResponse(status_code=200, content={"orders": orders})
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")


@router.put("/updateOrderStatus")
async def update_order_status(id:str,orderId:str,status:str):
    courier_id=ObjectId(id)
    order_Id=ObjectId(orderId)

    found_courier=collection_name.find_one({"_id":courier_id})
    if found_courier["role"]!="courier":
        raise HTTPException(status_code=404, detail="Access Denied")
    
    if found_courier is None:
            raise HTTPException(status_code=404, detail="Courier not found")
    
    found_order=collection_name_2.find_one({"_id":order_Id})
    if found_order is None:
            raise HTTPException(status_code=404, detail="Order not found")
    
    

    
    

    isOrder=False
    for order in found_courier["orders"]:
            if orderId == order:
                 isOrder=True


    if isOrder:
         found_order["status"]=status
         collection_name_2.update_one(
            {"_id": order_Id},
            {"$set": {"status": found_order["status"]}}
        )
         return JSONResponse(status_code=201, content={"message": "Order status updated successfully"})

    else:
         raise HTTPException(status_code=404, detail="Order not found in courier's assigned orders")
                           

@router.delete("/deleteOrder/{orderId}/{name}")
async def delete_order(orderId: str, name: str):
    try:
        OrderID = ObjectId(orderId)
        
        # Delete the order from the orders collection
        result = collection_name_2.delete_one({"_id": OrderID})
        
        # If the order doesn't exist, raise an error
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Iterate through all users and remove the order ID from their lists if it exists
        users = collection_name.find({"orders": orderId})
        for user in users:
            updated_orders = [order for order in user["orders"] if order != orderId]
            
            # Update the user order list if there were changes
            collection_name.update_one(
                {"_id": user["_id"]},
                {"$set": {"orders": updated_orders}}
            )
        
        return JSONResponse(status_code=200, content={"message": "Order deleted successfully"})
    
    except Exception as e:
        print(f"Error occurred while deleting order: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while deleting the order")



                           
@router.put("/updateOrderStatusAdmin/{orderId}/{status}")
async def update_order_status_admin(orderId:str,status:str):
    order_Id=ObjectId(orderId)

    found_order=collection_name_2.find_one({"_id":order_Id})
    if found_order is None:
            raise HTTPException(status_code=404, detail="Order not found")
    
    found_order["status"]=status
    collection_name_2.update_one(
            {"_id": order_Id},
            {"$set": {"status": found_order["status"]}})
        
    return JSONResponse(status_code=201, content={"message": "Order status updated successfully"})



@router.put("/updateOrderStatusUser/{orderId}/{status}")
async def update_order_status_user(orderId:str,status:str):
    order_Id=ObjectId(orderId)

    
    
    found_order=collection_name_2.find_one({"_id":order_Id})
    if found_order is None:
            raise HTTPException(status_code=404, detail="Order not found")
    
    found_order["status"]=status
    collection_name_2.update_one(
            {"_id": order_Id},
            {"$set": {"status": found_order["status"]}})
        
    return JSONResponse(status_code=201, content={"message": "Order status updated successfully"})    

    
    

    


    
   

    
