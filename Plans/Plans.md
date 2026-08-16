# Plans

## Peer-to-peer group chats

Many p2p messaging services rely on a large network of peers, e.g. Tox. This section is focussed on p2p messaging in a small group.

- Users are uniquely identified by their public key only.
- Users create and sign an identity message saying all the ways of contacting them, eg

```jsonc
{
    "username": "Joe Bloggs",
    "time": "2024-05-31 13:50:24.608740",
    "devices": [
        // attempt to connect to all devices.
        {
            "name":"Desktop-4235",
            "contact": [
                // try each of the options in turn 
                // until a successful connection is made.
                {
                    "type": "direct-tcp",
                    "socket": "172.217.16.227:1234"
                },
                {
                    // a relay server the user is likely to be connected to
                    // has some protocol for routing
                    // could also be used for signalling
                    "type": "relay-tcp",
                    "socket": "212.75.91.54:5134"
                }
                // if failed, try asking already-connected peers if they have an open connection to Joe Bloggs on device "Desktop-4235", then use them for signalling for UDP hole punching, or to relay the messages via as a last resort.
                // an already-connected peer need not be an actual person. This could be a dedicated matchmaking server.
            ]
        } 
    ] 
}
```
This message is signed with Joe Bloggs' private key.

When a connection to a remote peer is made, the remote peer is asked if they have any new copies of the "identity messages" that the local peer owns. If so they transmit the new messages. The local peer knows they are genuine from the signature.


## group messages

Messages are sent to all members of the group simultaneously. Instructions to edit/delete messages can also be sent.

## If users are not online

Message history can be loaded from other peers. Since the messages are signed we know they must be genuine. However, a user can still attempt to insert an old message into the conversation by forging the message timestamp. There could be a mechanism where requests for the message history could be made to multiple peers to see if any of them received the message live.

In order to compare message history and check that there are no messages missing, perhaps there needs to be some kind of hierarchical system where large timeframes are queried together and then it narrows down to find the discrepancy, e.g.:
- Two users can check to see if they have the same message history for a particular day by adding up the hashes of the messages stored for that day.
- If the messages are different, they can repeat the process, perhaps for each hour of the message history, and keep narrowing the window until they find the missing message(s).
- This will speed up the process of synchronizing missing messages.

## Adding new users to groups

Any user can add new users to the group by informing the other users.

Users can remove themselves, or group admins can remove people (if we want to go there). We could have some kind of voting system otherwise I guess.


# Disjoint group chats/failed connections

There are several ways that this could happen

- User 1 and User 2 establish a p2p connection using UDP hole punching, signalled by a User 3, using 3's open TCP port. If user 3 then goes offline, then there is no way to contact users 1 and 2, despite that they still have an active p2p connection. 
- All online users has changed address or are otherwise inaccessible. The new identify messages will have to be sent by other means.


# Other random ideas

## Routing messages

If creating a communication link between every pair of users is too much, then we could perhaps exchange messages in a graph pattern.

In a group chat with members $N$, each member $p$ selects $M_p \subseteq N$ to transmit messages to. Whenever peer $p$ receives a message from $q$, if they have not already received the same message from another source, they transmit it to the members in $M_p$.

This could leave members with no one sending them messages. Therefore it would also be beneficial if we had 2-way connection here, i.e. $q \in M_p \Rightarrow p \in M_q$. This would make this message distribution work like on an undirected graph. Even with this, disjoint sets of members are possible, but this is probably unlikely.

