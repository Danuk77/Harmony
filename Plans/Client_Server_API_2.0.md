Harmony client/server API version 2.0

# Websocket message format

All messages about the same instance of a routine should begin with 16 random bytes identifying the routine. The JSON message should then follow, encoded in UTF-8.

General patterns:
+ The first message of each transaction (initiated by the client or the server) must contain the property `"initiate":"..."` with the name of the transaction.
+ The `"terminate": "..."` property, when sent by either the client or the server, indicates that the transaction has ended.
    + `"terminate": "done"` is sent **by the server only** when the routine has completed.
    + `"terminate": "cancel"` is sent **by either the server or the client** when it wants to end the transaction early, e.g. because of a timeout or user cancel. If sent from the **server**, it may also include an `"error": "..."` property containing a helpful error message for the client.
+ For messages that a client wants to forward to a peer through the signalling server, the general format for the send and receive is:
    ```jsonc
    // send
    {
        "forward": {
            "type": "...",
            "payload": {...} // may be omitted
        }
    }
    ```
    ```jsonc
    // receive
    {
        "forwarded": {
            "type": "...",
            "payload": {...} // may be omitted
        }
    }
    ```
    + The server checks the forwarded messages are of the expected format

## Changes since protocol version 1.1

Changed comeOnline client verification.

## Connecting to the signalling server/coming online

To server ==>
```jsonc
{
    "initiate": "comeOnline"
}
```

To client <==
```jsonc
{
    "version": "1.0", // current server protocol version
}
```

==>
```jsonc
{
    "publicKey": "MCowBQYDK2VwAyEAD3pfdaWP1vA8nXUAf5dzdsGevPqsnTHeAdHycHZ7Zm4=" // Ed25519 public key in PKCS#1/DER format, encoded in base64
}
```

<==
```jsonc
{
    "challenge": "..." // random string
}
```

==>
```jsonc
{
    "payload": {
        "challenge": "...", // the orignal challenge sent by the server
        "hostname": "harmonytestserver.org", // domain name (or IP address if the server allows it) of the server
        "purpose": "comeOnline",
        "currentTime": "2026-07-18T11:37:52+0000" // RFC3339 time string. must be no more than 2 seconds out from the server time.
    },
    "signature": "...", // payload coverted to canonical json, sha256 hashed, signed with private key, and encoded in base64
}
```

A `"terminate": "cancel"` error message is sent by the server if the payload or signature is invalid.

<==
```jsonc
{
    "welcome": "welcome",
    "terminate": "done"
}
```


## Friend request

Indicate you wish to become friends with a peer, and get a response `"reject"`, `"accept"`, or `"pending"`.

Client A ==> Server
```jsonc
{
    "initiate": "sendFriendRequest",
    "key": "..." // the public key of the friend
}
```

**If the requested friend is offline:**

Client A <==
```jsonc
{
    "peerStatus": "offline",
    "forwarded": null,
    "terminate": "done"
}
```

**Else:**

Client B <==
```jsonc
{
    "initiate": "receiveFriendRequest",
    "key": "..." // public key of the requestee (client A)
}
```

Client B ==> Server
```jsonc
{
    "forward": {
        "type": "reject" // or "accept", "pending"
    }
}
```

Client B <==
```jsonc
{
    "terminate": "done"
}
```

Client A <==
```jsonc
{
    "peerStatus": "online",
    "forwarded": {
        "type": "reject" // or "accept", "pending"
    },
    "terminate": "done"
}
```

## Friend rejection

Indicate you do **not** want to become friends with a peer.

Client A ==> Server
```jsonc
{
    "initiate": "sendFriendRejection",
    "key": "..." // the public key of the friend
}
```

**If the requested friend is offline:**

Client A <==
```jsonc
{
    "peerStatus": "offline",
    "terminate": "done"
}
```

**Else:**

Client B <==
```jsonc
{
    "initiate": "receiveFriendRejection",
    "key": "...", // public key of the requestee (client A)
    "terminate": "done"
}
```

Client A <==
```jsonc
{
    "peerStatus": "online",
    "terminate": "done"
}
```

## Establishing a connection to a peer

Client A ==> Server
```jsonc
{
    "initiate": "sendConnectionRequest",
    "key": "..." // the public key of the friend
}
```

**If the requested friend is offline:**

Client A <==
```jsonc
{
    "peerStatus": "offline",
    "forwarded": null,
    "terminate": "done"
}
```

**Else:**

Client B <==
```jsonc
{
    "initiate": "receiveConnectionRequest",
    "key": "..."
}
```

**If client B rejects the connection request:**

Client B ==> Server
```jsonc
{
    "forward": {
        "type": "reject"
    }
}
```

Client B <==
```jsonc
{
    "terminate": "done"
}
```

Client A <==
```jsonc
{
    "peerStatus": "online",
    "forwarded": {
        "type": "reject"
    },
    "terminate": "done"
}
```

**Else if client B accepts the connection request:**

Client B ==> Server
```jsonc
{
    "forward": {
        "type": "acceptAndOffer",
        "payload": {
            // generated by WebRTC
            "type": "offer",
            "sdp": "..."
        }
    }
}
```

Client A <==
```jsonc
{
    "peerStatus": "online",
    "forwarded": {
        "type": "acceptAndOffer",
        "payload": {
            // generated by WebRTC
            "type": "offer",
            "sdp": "..."
        }
    }
}
```

Client A ==> Server
```jsonc
{
    "forward": {
        "type": "answer",
        "payload": {
            // generated by WebRTC
            "type": "answer",
            "sdp": "..."
        }
    }
}
```

Client B <==
```jsonc
{
    "forwarded": {
        "type": "answer",
        "payload": {
            // generated by WebRTC
            "type": "answer",
            "sdp": "..."
        }
    }
}
```

As soon as client A sends its answer SDP, it starts sending ICE candidates.

As soon as client B receives client A's answer SDP, it starts sending ICE candidates.

The format of the messages is the same in both directions, so the client identifiers A and B have been replaced with **x** and **y** to abstract the direction of the messages. 

Client **x** ==> Server
```jsonc
{
    "forward": {
        "type": "ICECandidate",
        "payload": {
            // generated by WebRTC
            "candidate":"...",
            "sdpMLineIndex":0,
            "sdpMid":"...", // optional
            "usernameFragment":"..." // optional
        }
    }
}
```

Client **y** <==
```jsonc
{
    "forwarded": {
        "type": "ICECandidate",
        "payload": {
            // generated by WebRTC
            "candidate":"...",
            "sdpMLineIndex":0,
            "sdpMid":"...", // optional
            "usernameFragment":"..." // optional
        }
    }
}
```

The last ICE candidate from both peers contains `"candidate": ""` (empty string). Once both clients have sent this ICE candidate:

Client A <==
```jsonc
{
    "terminate": "done"
}
```

Client B <==
```jsonc
{
    "terminate": "done"
}
```

> Note: often a final empty ICE candidate is not sent by either of the clients. In this case we rely on the server timeout to end the transaction.