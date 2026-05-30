# DNS

## Dynamic DNS (DDNS)

Can be used for networks where the public IP address frequently changes.

A script runs every few minutes on your router or a computer on the network, which sends a packet to a DDNS provider. The provider then updates the IP address assigned to your host name.

## Multicast DNS (mDNS)

https://en.wikipedia.org/wiki/Multicast_DNS

Used on local networks, and concerns the `.local` top-level domain. Serverless.

In order to resolve an mDNS domain, an IP multicast message sent to the network. The owner of the name then multicasts their address.