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

#first change
#@ashraf updated the authenticate route to return the user id
#so upon successful login the user id is returned to the frontend to be set in the user service
# and got for the courier service to get the courier id
@router.post("/authenticate")
async def authenticate_user(name: str = Form(...), password: str = Form(...)):
    try:
        found_user = collection_name.find_one({"name": name,"password":password})
        
        if not found_user:
            raise HTTPException(status_code=401, detail="Invalid username or password")
        
        # print(individual_serial(found_user))
        user_data = individual_serial(found_user)
        user_data['id'] = str(found_user['_id'])#to add user ID to response
        
        print(user_data)
        return {"user": user_data}
    
    except Exception as e:
        print(f"Error occurred: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while authenticating the user.")
    

@router.put("/addOrder/{name}/{orderID}")
async def add_order_to_courier(name:str,orderID:str):
    
    order_id = ObjectId(orderID)  
    
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


#this route is for the courier to get his assigned orders
@router.get("/getCourierOrders")
async def get_courier_orders(name: str):
    try:
        #to get the courier id based on name passed by params
        found_courier = collection_name.find_one({"name": name})

        if found_courier is None:
            raise HTTPException(status_code=404, detail="Courier not found")
                
        ordersIds = found_courier.get("orders", [])
        orders = []
        
        #to get the orders based on the courier id
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

#this route is for the courier to update the status of his assigned orders
# @router.put("/updateOrderStatus")
# # async def update_order_status(id:str,orderId:str,status:str):
# #     courier_id=ObjectId(id)
# #     order_Id=ObjectId(orderId)

# #     found_courier=collection_name.find_one({"_id":courier_id})
# #     if found_courier["role"]!="courier":
# #         raise HTTPException(status_code=404, detail="Access Denied")
    
# #     if found_courier is None:
# #             raise HTTPException(status_code=404, detail="Courier not found")
    
# #     found_order=collection_name_2.find_one({"_id":order_Id})
# #     if found_order is None:
# #             raise HTTPException(status_code=404, detail="Order not found")
    
# #     isOrder=False
# #     for order in found_courier["orders"]:
# #             if orderId == order:
# #                  isOrder=True

# #     if isOrder:
# #          found_order["status"]=status
# #          collection_name_2.update_one(
# #             {"_id": order_Id},
# #             {"$set": {"status": found_order["status"]}}
# #         )
# #          return JSONResponse(status_code=201, content={"message": "Order status updated successfully"})

# #     else:
# #          raise HTTPException(status_code=404, detail="Order not found in courier's assigned orders")

# @ashraf i commented out your code for the update 
# order status because i want to make it like the user service
#takes the courier id and the order id and the newstatus to update the order status
@router.put("/updateOrderStatus")
async def update_order_status(id: str, orderId: str, status: str):
    try:
        courier_id = ObjectId(id)
        order_Id = ObjectId(orderId)

        found_courier = collection_name.find_one({"_id": courier_id})
        if found_courier is None:
            raise HTTPException(status_code=404, detail="Courier not found")
        
        if found_courier.get("role") != "courier":
            raise HTTPException(status_code=403, detail="Access Denied")
        
        found_order = collection_name_2.find_one({"_id": order_Id})
        if found_order is None:
            raise HTTPException(status_code=404, detail="Order not found")
        
        if orderId not in found_courier.get("orders", []):
            raise HTTPException(status_code=404, detail="Order not found in courier's assigned orders")
        
        collection_name_2.update_one(
            {"_id": order_Id},
            {"$set": {"status": status}}
        )
        return JSONResponse(status_code=200, content={"message": "Order status updated successfully"})
    
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")


@router.delete("/deleteOrder/{orderId}/{name}")
async def delete_order(orderId: str, name: str):
    try:
        OrderID = ObjectId(orderId)
        
        result = collection_name_2.delete_one({"_id": OrderID})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Order not found")
        
        users = collection_name.find({"orders": orderId})
        for user in users:
            updated_orders = [order for order in user["orders"] if order != orderId]
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