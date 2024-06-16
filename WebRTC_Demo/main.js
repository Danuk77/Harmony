
/**
 * @type RTCPeerConnection
 */
let peerConnection;

/**
 * @type RTCDataChannel
 */
let myChannel;

// let createDataChannelButton = document.getElementById("create-data-channel");
// let dataChannelCreatedText = document.getElementById("data-channel-created");
let createOfferButton = document.getElementById("create-offer");
let createAnswerButton = document.getElementById("create-answer");
let localDescriptionBox = document.getElementById("local-description");
let remoteDescriptionBox = document.getElementById("remote-description");
let connectionInputBox = document.getElementById("connection-input");
// let setLocalDescriptionButton = document.getElementById("set-local-description");
let setRemoteDescriptionButton = document.getElementById("set-remote-description")
let chatContent = document.getElementById("chat-content");
let chatInputBox = document.getElementById("chat-input");

/**
 * @type RTCConfiguration
 */
let servers = {
    iceServers: [
        {
            urls: ['stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302', "stun:stun.ekiga.net:3478"],
        },
    ],
}


async function init() {

    peerConnection = new RTCPeerConnection();

    // received channel from remote.
    peerConnection.ondatachannel = (event) => {
        myChannel = event.channel;
        setupChannelListeners(event.channel)
    };

}

/**
 * @param channel RTCDataChannel
 */
async function setupChannelListeners(channel) {
    myChannel.onopen = () => {
        chatContent.innerText += "[Channel opened]\n"
        peerConnection.remo
    }
    myChannel.onclose = () => {
        chatContent.innerText += "[Channel closed]\n"
    }
    myChannel.onmessage = (ev) => {
        chatContent.innerText += "[Received]: " + ev.data + "\n"
    }
}



createOfferButton.addEventListener("click", async () => {
    try {

        // ***

        // add stun servers.
        peerConnection.setConfiguration(servers);

        // create a channel with whatever label we like
        myChannel = peerConnection.createDataChannel("my_channel", {ordered: true /*reliable*/})
        setupChannelListeners(myChannel);

        // create the offer
        let offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        // update answer with ice candidates when they arrive
        peerConnection.onicecandidate = async ({candidate}) => {
            if (candidate) {
                localDescriptionBox.innerText = JSON.stringify(peerConnection.localDescription);
            }
        }
        // ***

        localDescriptionBox.innerText = JSON.stringify(offer);

    } catch (e) {
        return alert(e)
    }
})

createAnswerButton.addEventListener("click", async () => {
    try {

        // ***
        // add stun servers to start generating ice candidates
        peerConnection.setConfiguration(servers);

        // create the answer
        let answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        // update answer with ice candidates when they arrive
        peerConnection.onicecandidate = async ({ candidate }) => {
            if (candidate) {
                localDescriptionBox.innerText = JSON.stringify(peerConnection.localDescription);
            }
        }
        // ***

        localDescriptionBox.innerText = JSON.stringify(answer);
    } catch (e) {
        return alert(e)
    }
})



setRemoteDescriptionButton.addEventListener("click", async () => {

    const remoteDescStr = connectionInputBox.value;
    let remoteDesc;
    try {

        remoteDesc = JSON.parse(remoteDescStr);

        // ***
        // set the remote description
        await peerConnection.setRemoteDescription(remoteDesc);
        // ***
        
        remoteDescriptionBox.innerText = remoteDescStr;

    } catch (e) {
        return alert(e)
    }


});

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

init();
