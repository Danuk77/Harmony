let myUsername = document.getElementById("myUsername");
let userList = document.getElementById("userList");
let registerUser = document.getElementById("registerUser");
let chatContent = document.getElementById("chatContent");
let chatInputBox = document.getElementById("chatInput");

/**
 * @typedef {{name: string, id: string}} User
 */

/**
 * @type RTCConfiguration
 * STUN servers, etc.
 */
let servers = {
    iceServers: [
        {
            urls: ['stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302', "stun:stun.ekiga.net:3478"],

        },

    ],
    // iceTransportPolicy:"public"
    iceCandidatePoolSize: 3,
}

/**@type RTCPeerConnection*/ let peerConnection;
/**@type RTCDataChannel*/ let myChannel;

/**
 * WebRTC channel listeners
 * @param channel RTCDataChannel
 */
async function setupChannelListeners(channel) {
    myChannel.onopen = () => {
        chatContent.innerText += "[WebRTC channel opened]\n"
        // peerConnection.remo
    }
    myChannel.onclose = () => {
        chatContent.innerText += "[WebRTC channel closed]\n"
    }
    myChannel.onmessage = (ev) => {
        chatContent.innerText += "[Received]: " + ev.data + "\n"
    }
}



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

//
// /**
//  * Send a message
//  */
// chatInputBox.addEventListener("keypress", event => {
//     if (event.key == "Enter") {
//         const message = chatInputBox.value;
//         // send message
//         socket.emit("passMessage", message);
//         // log message
//         chatContent.innerText += "[Sent]: " + message + "\n"
//         // clear input box
//         chatInputBox.value = "";
//     }
// })

// /**
//  * receive a message
//  */
// socket.on("receiveMessage", (/**@type {string}*/message) => {
//     chatContent.innerText += "[Received]: " + message + "\n"
// })


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
socket.on("forwardingRuleCreated", async (/**@type {{remoteUser:User, initiator:bool}} */conn) => {
    chatContent.innerText += `[Connected WebSocket to ${conn.remoteUser.name}]\n`

    // reset WebRTC connection
    peerConnection = new RTCPeerConnection();
    peerConnection.ondatachannel = (event) => {
        myChannel = event.channel;
        setupChannelListeners(event.channel)
    };
    // add stun servers.
    peerConnection.setConfiguration(servers);
    // send ice candidates to peer
    peerConnection.onicecandidate = async ({ candidate }) => {
        if (candidate) {
            socket.emit("passICECandidate", JSON.stringify(candidate.toJSON()))
        }
    }
    
    
    // send sdp if you are the initiator
    // (conn.initiator refers to the other person)
    if (!conn.initiator) {

        // create a channel with whatever label we like
        myChannel = peerConnection.createDataChannel("my_channel", { ordered: true /*reliable*/ })
        setupChannelListeners(myChannel);

        // create the offer
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        // send offer to peer
        socket.emit("passSDP", JSON.stringify(offer));
    }
})

socket.on("receiveSDP", async (/**@type {string}*/sdpStr) => {

    /**@type {RTCSessionDescriptionInit}*/
    const sdp = JSON.parse(sdpStr);

    console.log("received SDP")
    console.log(sdp);

    await peerConnection.setRemoteDescription(sdp);

    // if the sdp was an offer we need to create an answer
    if (sdp.type == "offer") {

        // create the answer
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        
        // send answer to peer
        socket.emit("passSDP", JSON.stringify(answer));
    }



})

socket.on("receiveICECandidate", async (/**@type {string}*/candidateStr) => {

    console.log("received ICE candidate")
    console.log(candidateStr);

    /**@type {RTCIceCandidateInit} */
    const candidate = JSON.parse(candidateStr);

    await peerConnection.addIceCandidate(candidate);

})

// submit message.
chatInputBox.addEventListener("keypress", async (event) => {

    if (event.key == 'Enter') {

        let message = chatInputBox.value;

        try {
            myChannel.send(message);
            chatContent.innerText += "[Sent]: " + message + "\n"
            chatInputBox.value = ""
        } catch (e) {
            alert(e)
        }

    }

})

