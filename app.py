from flask import Flask
from flask import request
from flask import jsonify
from flask_cors import CORS
import time
from flask import render_template

app = Flask(__name__, template_folder='./static')
CORS(app)

players = {}
exiting = None
exit_time = 0


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/setData')
def data():
    global exit_time
    global exiting
    user = request.args.get('user')
    avatar = request.args.get('avatar')
    x = request.args.get('x')
    y = request.args.get('y')
    z = request.args.get('z')
    rx = request.args.get('rx')
    ry = request.args.get('ry')
    rz = request.args.get('rz')
    if user == exiting:
        if time.time() - exit_time < 1:
            return jsonify(players)
        else:
            exiting = None

    players[user] = [avatar, x, y, z, rx, ry, rz]
    return jsonify(players)

@app.route('/getData')
def get():
    return jsonify(players)

@app.route('/exit')
def ex():
    global exiting
    global exit_time
    user = request.args.get('user')
    players.pop(user)
    exiting = user
    exit_time = time.time()
    return "done"

if __name__ == "__main__":
    app.run(host='0.0.0.0')
