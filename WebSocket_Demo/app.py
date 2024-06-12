from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)


users = []


@app.route("/")
def homepage():
    """Send script to load socketio client library and switch protocol.
    
    Websockets can also be established by sending a Switching Protocols response code, but socketio handles that for us
    """
    
    return render_template("main.html")

# @socketio.on("client message")
# def receive_message(data):
#     """Receive messages from the client.

#     The client can send these with `emit("client message", "YOUR MESSAGE HERE")`
#     """

#     # emit to the current client only - context sensitive
#     emit("server message", "Thank you for that message")
#     print(data)


@socketio.on("connect")
def connect():
    """Special event, called when a user connects.
    """
    emit("users", users)

@socketio.on("disconnect")
def disconnect():

    global users
    print("removing user with sid: " + request.sid)

    # remove user from list
    users = [user for user in users if user["id"] != request.sid]

    # broadcast new list of users
    emit("users", users, broadcast=True)

@socketio.event
def registerUser(username: str):
    """Add user to the "database" and update everyone about their existence

    Args:
        username (str): The username of the new user.
    """

    for user in users:
        if user["id"] == request.sid:
            emit("alert", f"You are already registered as {user['name']}")
            return

    print(f"Registering user {username} with id {request.sid}")

    # store the username with the socket id
    users.append({"name": username, "id": request.sid})
    
    # broadcast new list of users
    emit("users", users, broadcast=True)


@socketio.event
def requestChatWithUser(userId):
    print(f"User {request.sid} requests chat with {userId}")
    if request.sid == userId:
        emit("alert", "You can't chat with yourself")
        return
    userIds = [user["id"] for user in users]
    if request.sid not in userIds:
        emit("alert", "You have not registered")
        return
    if userId not in userIds:
        emit("alert", "That user has disconnected")
        return
    
    

    pass



if __name__ == '__main__':
    socketio.run(app)

# send a message from the client by calling emit("client message", "YOUR MESSAGE HERE")