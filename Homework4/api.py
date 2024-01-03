from flask import Flask, request, jsonify
from flask_cors import CORS

import sqlite3
app = Flask("products_api")
CORS(app, resources=r'/api/*')
DB_Path = "Homework\Homework4\products.db"

# gets all products
@app.route("/api/products", methods = ["GET"])
def getAllProducts():
    try:
        #connect to db/ create cursor
        connection = sqlite3.connect(DB_Path) 
        cursor = connection.cursor()
        # define query
        query = f"""select * from products """
        # execute querry
        productsData= cursor.execute(query) 
        productsData = list(productsData)
        #close connection to DB
        connection.close() 
        # create response with all of the products
        response = {}
        for productElement in productsData:
           id =int(productElement[0])
           product_name = productElement[1]
           product_description = productElement[2]
           product_price = productElement[3]
           product={
               "id": id,
               "name": product_name,
               "description" :product_description,
               "price": product_price
           }
           response[id] = product

        response = jsonify(response)
        response.headers.add("Access-Control-Allow-Origin","*")
        return response,200
    except Exception as error:
        #error code
        response = {
            "message":f"Something went wrong. Cause: {error}"
        }
        response = jsonify(response)
        response.headers.add("Access-Control-Allow-Origin","*")
        return response, 500

@app.route("/api/product/<product_id>", methods = ["GET"])
def getProduct(product_id):
    try:
        # create connection to db / create cursor
        connection = sqlite3.connect(DB_Path) 
        cursor = connection.cursor()
        # define query
        query = f"""select * from products Where id = {product_id}"""
        # execute querry
        productData= cursor.execute(query) 
        productData = list(productData)[0]
        #close connection to DB
        connection.close() 
        #create response with product with specified id
        response = {
            "id": productData[0],
            "name": productData[1],
            "description": productData[2],
            "price": productData[3]
        }

        response = jsonify(response)
        response.headers.add("Access-Control-Allow-Origin","*")
        return response,200
    except Exception as error:
        #error code
        response = {
            "message":f"Something went wrong. Cause: {error}"
        }
        response = jsonify(response)
        response.headers.add("Access-Control-Allow-Origin","*")
        return response, 500

@app.route("/api/createProduct", methods= ["POST"])
def createProduct():
    body = request.json
    try:   
        #price not a number
        try:
            price = int(body["price"])
        except Exception as error:
            response = {
            "message": f"The price value is not a integer. {error}"
            }
            response = jsonify(response)
            response.headers.add("Access-Control-Allow-Origin", "*")
            return response, 400
        
        #No name sent
        if body["name"] is None:
            response = {
            "message": "Product name is null."
            }
            response = jsonify(response)
            response.headers.add("Access-Control-Allow-Origin", "*")
            return response, 400
        
        #No description sent
        if body["description"] is None:
            response = {
            "message": "Product description is null."
            }
            response = jsonify(response)
            response.headers.add("Access-Control-Allow-Origin", "*")
            return response, 400
        
        #connection open/ create cursor
        connection = sqlite3.connect(DB_Path)
        cursor = connection.cursor()

        #define query
        query = f"""INSERT INTO products(product_name,product_description,price) values ('{body["name"]}','{body["description"]}','{body["price"]}')"""
        #execute query
        cursor.execute(query)
        connection.commit()

        #define query for getting id of the last created product
        query = "select last_insert_rowid()"
        #execute query
        id = list(cursor.execute(query))[0][0]
        #close connection
        connection.close()
        #create response with the id of the product
        response = {
                "productId": id
        }
        response= jsonify(response)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response, 200
    except Exception as error:
        # codul pt erori 
        response = {
            "message": f"Something went wrong. Cause: {error}."
        }
        response = jsonify(response)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response, 500

#update description
@app.route("/api/updateProduct/<product_id>", methods = ["PUT"])
def updateProduct(product_id):
    body = request.json
    try:
        product_name = body['name']
        product_description = body['description']
        price = body['price']
        #checks if name is not null
        if len(product_name) == 0:
            response = {
            "message":"Invalid name change. (Is null)"
            }
            response = jsonify(response)
            response.headers.add("Access-Control-Allow-Origin", "*")
            return response,400
        
        #checks if description is not null
        if len(product_description) ==0:
            response = {
            "message":"Invalid description change. (Is null)"
            }
            response = jsonify(response)
            response.headers.add("Access-Control-Allow-Origin", "*")
            return response,400
        
        #checks if price is not null
        if len(price) ==0:
            response = {
            "message":"Invalid price change. (Is null)"
            }
            response = jsonify(response)
            response.headers.add("Access-Control-Allow-Origin", "*")
            return response,400
        
        #checks is price is a number
        try:
            price = int(price)
        except Exception as error:
            response = {
                "message":"The Price is not a number."
            }
            response = jsonify(response)
            response.headers.add("Access-Control-Allow-Origin", "*")
            return response,400
        
        connection = sqlite3.connect(DB_Path)
        cursor = connection.cursor()

        #define query
        query = f"""
            UPDATE products 
            SET 
                product_name=?,
                product_description=?,
                price=?
            WHERE 
                id=?"""
        #execut query with the parameters provided
        cursor.execute(query, (product_name, product_description, price, product_id))
        #commit changes
        connection.commit()
        #close connection to db
        connection.close()
        #request successfull
        response = {
            "message":"Update successfull"
        }
        response = jsonify(response)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response, 200 #204 no content
        
    except Exception as error:
        #error code
        response = {
            "message":f"Something went wrong. Cause: {error}"
        }
        response = jsonify(response)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response,500

#delete request
@app.route("/api/deleteProduct/<product_id>", methods = ["DELETE"])
def deleteProduct(product_id):
    try:
        #connect to db/ create cursor
        connection = sqlite3.connect(DB_Path)
        cursor = connection.cursor()
        #define query
        query = f"""DELETE FROM products WHERE id = {product_id}"""
        #execute query
        cursor.execute(query)
        #commit changes
        connection.commit()
        #close connection to db
        connection.close()
        #request successfull
        response = {
            "message":"Delete successfull"
        }
        response = jsonify(response)
        response.headers.add("Access-Control-Allow-Origin","*")
        return response, 200
    except Exception as error:
        #error code
        response = {
            "Message":f"Something went wrong. Cause {error}"
        }
        response = jsonify(response)
        response.headers.add("Access-Control-Allow-Origin","*")
        return response,500
if __name__ == "__main__":
    app.run(debug=True, port=5000)