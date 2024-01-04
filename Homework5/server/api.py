from flask import Flask, request, jsonify
from flask_cors import CORS

import sqlite3
app = Flask("notes_api")
CORS(app, resources=r'/api/*')
DB_Path = "Homework\Homework5\data\db.db"

#GET -> request data from specified resource (database)
#POST ->create a resource
#PUT -> Update a resource
#DELETE -> delete a resource

#codes
#200-OK
#204-ok with no content returned
#400-bad request

#get all notes
@app.route("/api/notes", methods = ["GET"])
def getAllNotes():
    try:
        connection = sqlite3.connect(DB_Path)
        cursor = connection.cursor()
        query = "select id,title from notes"
        notes = list(cursor.execute(query))
        connection.close()

        i = 1
        response ={}
        for noteElement in notes:
            id = int(noteElement[0])
            title = noteElement[1]
            note = {
                "id":id,
                "title":title
            }
            response[i]= note
            i = i+1
        
        response = jsonify(response)
        response.headers.add("Access-Control-Allow-Origin","*")
        return response,200
    except Exception as error:
        response = {
            "message":f"Something went wrong. Cause {error}"
        }
        response = jsonify(response)
        response.headers.add("Access-Control-Allow-Origin","*")
        return response,500

#content for the notes
@app.route("/api/note/<noteId>", methods = ["GET"])
def getNoteContent(noteId):
    try:
        connection = sqlite3.connect(DB_Path)
        cursor = connection.cursor()
        query = f"select title,content from notes where id={noteId}"
        data = list(cursor.execute(query))[0]
        connection.close()
        title = data[0]
        content = data[1]
        response = {
            "title":title,
            "content":content
        }
        response = jsonify(response)
        response.headers.add("Access-Control-Allow-Origin","*")
        return response,200
    except Exception as error:
        response = {
            "message":f"Something went wrong. Cause {error}"
        }
        response = jsonify(response)
        response.headers.add("Access-Control-Allow-Origin","*")
        return response,500

@app.route("/api/createNote", methods = ["POST"])
def createNote():
    body = request.json

    try:
        title = body["title"]
        content = body["content"]

        #data validity
        if len(title) == 0:
            response = {
            "message":"Title is empty"
            }
            response = jsonify(response)
            response.headers.add("Access-Control-Allow-Origin","*")
            return response,400
        if len(content) == 0:
            response = {
            "message":"Content is empty"
            }
            response = jsonify(response)
            response.headers.add("Access-Control-Allow-Origin","*")
            return response,400
        
        
        connection = sqlite3.connect(DB_Path)
        cursor = connection.cursor()
        query = f"""INSERT INTO notes(title,content) values('{title}','{content}')"""
        cursor.execute(query)
        connection.commit()
        query = "select last_insert_rowid()"
        id = list(cursor.execute(query))[0][0]
        connection.close()
        response={
            "id":id,
            "title":title
        }
        response = jsonify(response)
        response.headers.add("Access-Control-Allow-Origin","*")
        return response,200
    except Exception as error:
        response = {
            "message":f"Something went wrong. Cause {error}"
        }
        response = jsonify(response)
        response.headers.add("Access-Control-Allow-Origin","*")
        return response,500


@app.route("/api/updateNote/<noteId>", methods = ["PUT"])
def updateNote(noteId):
    body= request.json
    try:
        title = body["title"]
        content = body["content"]
        if len(title) ==0:
            response = {
            "message":"Title is empty"
            }
            response = jsonify(response)
            response.headers.add("Access-Control-Allow-Origin","*")
            return response,400
        if len(content) ==0:
            response = {
            "message":"Content is empty"
            }
            response = jsonify(response)
            response.headers.add("Access-Control-Allow-Origin","*")
            return response,400
        
        connection = sqlite3.connect(DB_Path)
        cursor = connection.cursor()
        query = f""" UPDATE notes
                SET
                    title=?,
                    content=?
                WHERE 
                    id=?
                """
        cursor.execute(query, (title,content,noteId))
        connection.commit()
        connection.close()
        response = {
            "message":"Update successfull"
        }
        response = jsonify(response)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response,200
    except Exception as error:
        response = {
            "message":f"Something went wrong. Cause {error}"
        }
        response = jsonify(response)
        response.headers.add("Access-Control-Allow-Origin","*")
        return response,500
    

@app.route("/api/deleteNote/<noteId>", methods = ["DELETE"])
def  deleteNote(noteId):
    try:
        connection = sqlite3.connect(DB_Path)
        cursor =connection.cursor()
        query = f"DELETE FROM notes WHERE id ={noteId}"
        cursor.execute(query)
        connection.commit()
        connection.close()
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