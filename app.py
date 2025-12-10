from flask import Flask, request, jsonify # pyright: ignore[reportMissingImports]
import sqlite3
from flask import * # type: ignore
import json
import uuid

class Student:

    def __init__(self, firstname, lastname, department):
        self.id = uuid.uuid4().hex
        self.firstname = firstname
        self.lastname = lastname
        self.department = department

app = Flask(__name__)

def connect_db():
    c = sqlite3.connect("student.db").cursor()
    c.execute("CREATE TABLE IF NOT EXISTS STUDENTS("
              "id TEXT, firstname TEXT, lastname TEXT, department TEXT)")
    c.connection.close()


@app.route('/', methods=['GET'])
def index():
    connect_db()
    data = getStudents()
    return render_template('test.html', data = data) # type: ignore


@app.route('/test', methods=['GET', 'POST'])
def test():
    if request.method == 'GET':
        return jsonify({"response": "Get Request Called"})
    elif request.method == "POST":
        req_json = request.json
        name = req_json['name']
        return jsonify({"response": "Hi "+ name})


@app.route('/addStudentTest', methods=['POST'])
def addStudentTest():
    db = sqlite3.connect("student.db")
    c = db.cursor()
    req_json = request.json
    student = Student(req_json['firstname'],req_json['lastname'], req_json['department'])
    c.execute("INSERT INTO STUDENTS VALUES(?,?,?,?)", 
              (student.id, student.firstname, student.lastname,
              student.department))
    db.commit()
    return jsonify({"response": "Student Added"})

@app.route('/addStudent', methods=['POST', 'GET'])
def addStudent():
    db = sqlite3.connect("student.db")
    c = db.cursor()
    student = Student(request.form["firstname"],
                      request.form["lastname"],
                      request.form["department"]
                      )
    print(student)
    c.execute("INSERT INTO STUDENTS VALUES(?,?,?,?)",
              (student.id, student.firstname, student.lastname, student.department))
    db.commit()
    data = getStudents()
    return render_template('test.html', data = data) # type: ignore


@app.route('/getStudents', methods=['GET'])
def getStudents():
    c = sqlite3.connect("student.db").cursor()
    c.execute("SELECT * FROM STUDENTS")
    data = c.fetchall()
    return data

@app.route('/deleteStudent', methods=['POST'])
def deleteStudent():
    student_id = request.form["id"]
    db = sqlite3.connect("student.db")
    c = db.cursor()
    c.execute("DELETE FROM STUDENTS WHERE id=?", (student_id,))
    db.commit()
    data = getStudents()
    return render_template('test.html', data = data) # type: ignore


if __name__ == '__main__':
    app.run(debug=True, port=9090)
