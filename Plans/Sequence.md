
## Connecting to the signalling server/coming online

![Establish connection to the server/getting online sequence diagram](./connecting%20to%20the%20server.drawio.png)



## Friend request

![Friend request sequence diagram](./friend%20request.drawio.png)


## Establishing a connection to a peer

![Establish peer connection sequence diagram](./establish%20connection.drawio.png)

Extra points:
- Message 4 is referred to as 4x to denote that multiple may be send by each client.
- Client B rejects the connection request if Client A is not a friend of Client B, and sends a Reject message in place of 2.
- Users should not be able send the messages 1, 2, 3, and 4x out of the order as follows (prevent spam):
    - 2 must be after 1
    - Client B's ICE candidates (4x) must be after 2
    - 3 must be after 2
    - Client A's ICE candidates (4x) must be after 3

- Signalling server has a timeout window to verify the above. Messages sent after the timeout or in the wrong order are ignored by the server (not forwarded on to the peer.)

## Sending a message to a peer

Just a single message from client A to client B over WebRTC.
    
## Closing a connection

May not need to have a specific message for this. You can detect when a websocket is closed, and when WebRTC is closed.


## Possible change

Instead of connecting to peers as soon as the client is opened, we only connect to a peer when we have a message to send (or they have a message to send to us).

Advantages:
- Don't have to have as many open connections
- Solves issue of both connecting to each other at the same time when a clients add each other as friends

Disadvantages:
- Don't know whether user is online until we try to send a message (or, we make a separate mechanism to check whether users are online. Perhaps users submit their friend list to the signalling server, and the server informs users when their friends go online/offline.)
