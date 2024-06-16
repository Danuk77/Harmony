# WebRTC

Sources: https://www.youtube.com/watch?v=8I2axE6j204

Protocol for peer-to-peer communication between browsers. It can be used for voice and video, and also arbitrary data. It uses UDP.

Not entirely serverless - it needs a _signalling_ server to establish the connection, and sometimes a peer-to-peer connection isn't possible due to [NAT](https://en.wikipedia.org/wiki/NAT_traversal) settings, so a relay server is used instead.

## Features

From https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API

> WebRTC serves multiple purposes; together with the Media Capture and Streams API, they provide powerful multimedia capabilities to the Web, including support for audio and video conferencing, file exchange, screen sharing, identity management, and interfacing with legacy telephone systems including support for sending DTMF (touch-tone dialing) signals. Connections between peers can be made without requiring any special drivers or plug-ins, and can often be made without any intermediary servers.

The `RTCDataChannel` creates a bi-directional peer-to-peer socket that could be used for a messaging service. Despite using UDP, this can be set to be ordered and fully reliable.

## Signalling

This is the process of sending initial inforrmation before setting up the WebRTC connection.

Can be done through websockets or some other third-party signalling service.

Before starting a WebRTC session some information needs to be exchanged:

- Session Description Protocol (SDP)

  - Contains information about the codecs used, ICE candidates, etc.
  - Person A sends an SDP to person B via the signalling server, then person B replies to person A.

- ICE candidates
  - ICE candidates are socket address that could be used to recieve data.
  - https://www.geeksforgeeks.org/interactive-connectivity-establishment-ice/
  - Mutiple are provided.
  - Can be obtained by STUN (see below section).
  - If not possible to use STUN (e.g. because [symmetric NAT](https://en.wikipedia.org/wiki/Network_address_translation#Methods_of_translation) is used on the local network) then a relay server needs to be used - _Traversal Using Relays Around NATs (TURN)_. This method is not fully peer-to-peer.
  - Interactive Connectivity Establishment (ICE) tries to use STUN first and then TURN.

## UDP Hole Punching / STUN

https://en.wikipedia.org/wiki/UDP_hole_punching

https://en.wikipedia.org/wiki/STUN (Session Traversal Utilities for NAT.)

https://github.com/nilcons/ipsec-stun-explain - This has a tutorial using the `netcat` command.

UDP hole punching is a NAT traversal technique. Example:

- A computer with a local IP 192.168.1.0 running on a network with NAT wants to open a public port, eg port 1234, for UDP connections.
- It sends a message to an external server (a STUN server), telling it to reply to the socket address 192.168.1.0:1234.
- The router performs a network address translation, editing the socket address by replacing the local IP with the public IP, e.g 142.250.178.14 and the port number with an arbitrary port, eg 34567.
- The STUN server sends a packet back to the translated 142.250.178.14:34567, where the body of the message **also** contains that address.
- The computer now knows that the public socket address 142.250.178.14:34567 maps to the local socket address 192.168.1.0:1234.
- Other peers can now send UDP messages to 142.250.178.14:34567, which will reach the port 1234 on the computer.

Caveats:

- This doesn't always work since NAT implementations are not standardized - see next section. 

## NAT implementations

https://en.wikipedia.org/wiki/Network_address_translation#Methods_of_translation

Full-cone, (Address-)restricted cone, and port-restricted cone NAT schemes translate the internal port numbers in a predictable way, so we can work out what the external port is using a STUN server. (Address-)restricted and port-restricted cone schemes have an additional requirement: If side A, under a layer of NAT, wants to receive packets from side B, then side A must have first sent a packet to side B. (port-restricted also requires it to be sent to the correct port of side B)

Symmetric NAT uses different mappings based on the destination IP address, meaning STUN servers cannot be used to determine the external mapped port. A relay server will likely need to be used in this case. This NAT type is more common for business connections and mobile data.

[pystun3](https://github.com/talkiq/pystun3) can be used to determine your NAT type.
