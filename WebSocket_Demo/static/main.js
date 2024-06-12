let myUsername = document.getElementById("myUsername");
let userList = document.getElementById("userList");
let registerUser = document.getElementById("registerUser");
let chatContent = document.getElementById("chatContent");
let chatInputBox = document.getElementById("chatInput");

/**
 * @typedef {{name: string, id: string}} User
 */



var socket = io();
socket.on('connect', function () {
    console.log("connected");
});

// alerts send from the server
socket.on("alert", (message) => {
    alert(message);
})


registerUser.addEventListener("click", () => {
    const username = myUsername.value;
    socket.emit("registerUser", username);
})


// server will send this on connection, and whenever the list changes.
socket.on("users", function (/**@type {User[]}*/users) {
    userList.innerHTML = ""
    for (const user of users) {
        const a = document.createElement("a");
        a.href = "#";
        a.addEventListener("click", () => {
            requestChatWithUser(user)
        })
        a.innerText = user.name
        userList.appendChild(a);
    }
})

/**
 * 
 * @param {User} user 
 */
async function requestChatWithUser(user) {
    socket.emit("requestChatWithUser", user.id)
}




// socket.on("server message", (data) => {
//     console.log(data)
// })

