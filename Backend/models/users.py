from enum import Enum
from typing import List, Optional
from pydantic import BaseModel



class RoleEnum(str, Enum):
    admin = "admin"
    user = "user"
    courier = "courier"





class Order(BaseModel): 
    pickUp_Location: str
    dropOff_Location: str
    packageDetails: str
    status: str
    deliveryTime: str
    userOwner: str
    courierId: str   


class User(BaseModel):
    name: str
    email: str
    password: str
    phone_number: str
    role: RoleEnum
    orders: List[str]= []    