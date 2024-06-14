let myUsername = document.getElementById("myUsername");
let userList = document.getElementById("userList");
let registerUser = document.getElementById("registerUser");
let chatContent = document.getElementById("chatContent");
let chatInputBox = document.getElementById("chatInput");

/**
 * @typedef {{name: string, id: string}} User
 */


var socket = io();

/**
 * WebSocket created
 */
socket.on('connect', function () {
    console.log("connected");
});

/**
 * Display any alerts sent from the server
 */
socket.on("alert", (message) => {
    alert(message);
})

/**
 * Send request to "register user" to the server
 */
registerUser.addEventListener("click", () => {
    const username = myUsername.value;
    socket.emit("registerUser", username);
})

/**
 * Send a message
 */
chatInputBox.addEventListener("keypress", event => {
    if (event.key == "Enter") {
        const message = chatInputBox.value;
        // send message
        socket.emit("passMessage", message);
        // log message
        chatContent.innerText += "[Sent]: " + message + "\n"
        // clear input box
        chatInputBox.value = "";
    }
})

/**
 * receive a message
 */
socket.on("receiveMessage", (/**@type {string}*/message) => {
    chatContent.innerText += "[Received]: " + message + "\n"
})


/**
 * users(users)
 * 
 * Receive a list of currently online users 
 */
socket.on("users", function (/**@type {User[]}*/users) {

    userList.innerHTML = ""

    // recreate the list of online users
    for (const user of users) {
        const a = document.createElement("a");
        a.href = "#";
        a.innerText = user.name

        // request to connect when clicked
        a.addEventListener("click", () => {
            socket.emit("requestChatWithUser", user.id)
        })

        userList.appendChild(a);
    }
})


/**
 * receiveChatRequest(user)
 * 
 * Receieve a chat request from the specified user.
 */
socket.on("receiveChatRequest", (/**@type {User}*/user) => {
    if (confirm(`User ${user.name} wants to connect! Accept?`)) {
        socket.emit("confirmChatWithUser", user.id)
    }
})

/**
 * forwardingRuleCreated
 * 
 * Receive a message saying to which user messages are being sent to
 * */
socket.on("forwardingRuleCreated", (/**@type {{remoteUser:User, initiator:bool}} */conn) => {
    chatContent.innerText += `[Connected to ${conn.remoteUser.name}]\n`
})

