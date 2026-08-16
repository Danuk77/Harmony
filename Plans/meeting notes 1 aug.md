sequence diagram points

storing friend list on the signalling server




Peer A keeps track of a status of each of its friends. This is either *online connected*, *online disconnected*, *offline*, or *unknown*.

+ When A's client program starts, all friends are *unknown*.
+ When A tries to connect to a client B, B's status is set to either *online connected*, *online disconnected* (if WebRTC fails), or *offline* depending on the outcome.
+ When client B tries to connect to client A, B's status is set to either *online connected*, or *online disconnected* (if WebRTC fails).
+ If clients A and B are connected, client B can send a message to client A saying that they (client B) are going offline, before closing the WebRTC connection. Client A sets the status of client B to *offline*.
+ If client A is connected to client B, and the WebRTC connection closes/times out without receiving a graceful close message from client B, then client A sets the status of client B to *online disconnected*.

Depending on the status of B, client A attempts to connect to B:
+ *online connected*: Never (already connected)
+ *online disconnected*: Periodically, then stop after several failed attempts.
+ *offline*: Rarely 
* *unknown*: Immediately


The signalling server keeps track of clients either being *online* or *offline*.



 






Client A knows that client B is online because:
- A has an open connection to B
- On A's most recent connection attempt to B, the signalling server said that B was online (but the WebRTC connection failed to establish)

Client A knows that client B is offline because:
- On A's most recent connection attempt to B, the signalling server said that B was not online
- A and B had an open WebRTC connection, but client B gracefully closed the connection

Client A does not know whether client B is online when:
- 




- reconnecting and timeouts
not doing message caching
Signal server tells users when the other person is offline
reducing state on the server