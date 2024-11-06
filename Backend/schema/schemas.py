def individual_serial(user)->dict:
    return{
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "password": user["password"],
        "phone_number": user["phone_number"],
        "role":user["role"],
        "orders": user["orders"]
    }

def individual_serial_order(order)->dict:
    return{
        "id": str(order["_id"]),
        "pickUp_Location": order["pickUp_Location"],
        "dropOff_Location": order["dropOff_Location"],
        "packageDetails": order["packageDetails"],
        "status": order["status"],
        "deliveryTime": order["deliveryTime"],
        "userOwner": order["userOwner"],
        "courierId": order["courierId"]
    }


def list_serial(users)->list:
    return[individual_serial(user) for user in users]


def list_serial_order(orders)->list:
    return[individual_serial_order(order) for order in orders]