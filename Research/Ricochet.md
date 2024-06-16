# Ricochet

Ricochet is a messaging protocol that uses the Tor network.

## Tor (The Onion Router)

Computerphile video https://www.youtube.com/watch?v=QRYzre4bf7I

https://en.wikipedia.org/wiki/Tor_(network)

https://en.wikipedia.org/wiki/.onion

https://en.wikipedia.org/wiki/Onion_routing

This has some detail about the encryption
https://blog.insiderattack.net/deep-dive-into-tor-the-onion-router-6de4c25beba7

Explainer diagram linked to from the above: https://blog.insiderattack.net/deep-dive-into-tor-the-onion-router-6de4c25beba7

Traffic through the Tor network passes through several random relays, masking the IP addresses of both sides.

### Onion routing

Tor browsers are configured to send network traffic through through the "a Tor instance's SOCKS interface" (proxy) on localhost. The Tor instance has randomly selected a sequence of relays/nodes to send traffic through using public *directory servers*. (the *circuit*)

The originator uses symetric enctryption (keys exchanged using Diffie-Hellman Key Exchange) to encrypt the data in multiple layers such that each router "peels" a layer away, revealing the next hop.

ChatGPT is saying that first a shared secret key is created with the first node in path, then a shared key is created with the second node in the path via the first node using the just-generated secret key, and etc.

### Onion services (aka Hidden services)

https://community.torproject.org/onion-services/overview/

*Onion services* are sites accessible only from the Tor network using a `.onion` address. These addresses are not DNS.

When an Onion service is created a public/private key pair is generated. The public key is encoded in the address, so .onion addresses are generally not human-readable.

*Onion Service descriptors* are stored in a distributed hash table (DHT), which each contain a list of *introduction points* (selected onion nodes) to the service, signed using the service's private key. The Onion service maintains a circuit (connection) to each of its introduction points - this actually allows onion services to run behind NAT without port fowarding. 

To connect to an onion service, you to pick an onion node as a *rendezvous* node - this will be where the data from the server passes through. You also need to generate a *secret string*. The idea is that the client and the onion service will meet at the rendezvous point and identify each other by the secret string.

The client sends the secret string and rendezvous address to one of the introduction points. The introduction point forwards it to the onion service. A connection via the rendezvous node can then be made.

Guardian article about their onion service. Somewhat techincal. I didn't read this fully, but might be useful. https://www.theguardian.com/info/2022/oct/06/how-we-built-the-guardians-tor-onion-service

Setting up an onion service https://community.torproject.org/onion-services/setup/https://community.torproject.org/onion-services/setup/

## Ricochet

https://github.com/blueprint-freespeech/ricochet-refresh/blob/main/doc/design.md

Ricochet-refresh is the new version of Ricochet, since the old one used v2 onion services which are deprecated and disabled.

End users of Ricochet run an Onion service. Ricochet users are identified by their contact id, eg `ricochet:qjj5g7bxwcvs3d7i`. (These addresses are v2 onion services because they are 80 bits/16 characters?? Newer V3 onion services use 256bit/56 character addresses. Perhaps they haven't updated their documentation)

Because it uses Onion services, it can work through NAT without aditional configuration.

Ricochet periodically makes requrest to friends to see if they are online. The connection is kept open if they are.





