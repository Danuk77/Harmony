from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)


# {name:str, id:str}
users = []
def getUserById(id:str):
    return next((user for user in users if user["id"] == id), None)

# list of forwarding rules
# {fromId: toId, ...}
forwardingMap = dict()


@app.route("/")
def homepage():
    """Send script to load socketio client library and switch protocol.
    
    Websockets can also be established by sending a Switching Protocols response code, but socketio handles that for us
    """
    
    return render_template("main.html")



@socketio.on("connect")
def connect():
    """Special event, called when a user connects.
    """
    emit("users", users)

@socketio.on("disconnect")
def disconnect():
    """Special event, called when a user disconnects.
    """
    global users, forwardingMap

    print("removing user with sid: " + request.sid)

    # remove user
    users = [user for user in users if user["id"] != request.sid]

    # remove user from forwarding map
    forwardingMap = {fromId:toId for fromId, toId in forwardingMap.items() if request.sid not in (fromId, toId)}

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
        
    if username == "" or username is None:
        emit("alert", "Please enter a username")
        return

    print(f"Registering user {username} with id {request.sid}")

    # store the username with the socket id
    users.append({"name": username, "id": request.sid})
    
    # broadcast new list of users
    emit("users", users, broadcast=True)


@socketio.event
def requestChatWithUser(userId: str):
    """Local user requests to chat to remote user with id `userId`

    Args:
        userId (str): sid of remote user
    """


    print(f"User {request.sid} requests chat with {userId}")
    if request.sid == userId:
        emit("alert", "You can't chat with yourself")
        return
    
    # check if the users exist
    localUser = getUserById(request.sid)
    remoteUser = getUserById(userId)
    
    if localUser is None:
        emit("alert", "You have not registered")
        return
    if remoteUser is None:
        emit("alert", "That user has disconnected")
        return
    
    # ask the remote user to accept the connection
    emit("receiveChatRequest", localUser, room=remoteUser["id"])


@socketio.event
def confirmChatWithUser(userId:str):
    """Positive response to a request to chat

    Args:
        userId (str): UserId of the chat initiator
    """

    # check if the users exist
    acceptor = getUserById(request.sid)
    initiator = getUserById(userId)

    if acceptor is None or initiator is None:    
        emit("alert", "Connection failed")
        return
    
    # If I could be bothered I would check here if the other user is "engaged"

    # setup forwarding rules
    forwardingMap[request.sid] = userId
    forwardingMap[userId] = request.sid

    # inform clients who they are conencted to
    emit("forwardingRuleCreated", {"remoteUser":initiator, "initiator":True})
    emit("forwardingRuleCreated", {"remoteUser":acceptor, "initiator":False}, room=initiator["id"])


@socketio.event
def passMessage(message:str):
    """Forward a message to the current recipient in the forwardingMap
    """
    
    try:
        remoteId = forwardingMap[request.sid]
    except:
        emit("alert", "Connection not set up")
        return
    
    emit("receiveMessage", message, room=remoteId)




if __name__ == '__main__':
    socketio.run(app)
