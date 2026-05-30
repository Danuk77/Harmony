# Public key encryption

Summarized from https://en.wikipedia.org/wiki/Public-key_cryptography

A key generation program generate a public and a private key pair. There are 2 uses:

- Encryption. Messages encoded using the public key cann be decoded with the private key.
- Digital signature. Messages can be *signed* with the private key, and the public key can be used to verify that the contents of the message are genuine.

It is important to verify that public keys are genuine. This can be done in 2 ways:

- Public Key Infrastructure to certify ownsership of key pairs. [needs further explaination]
- Web of trust. Decentralized approach [explain]

> **Definition: Asymmetric vs symmetric.** Asymmetric uses a public and private key. Symmetric encryption uses the same key to both encode and decode messages. 

## Algorithm

https://medium.com/techanic/the-math-in-public-key-cryptography-in-simple-words-with-examples-e3a18cb4fa85

> Definition: **co-prime numbers**: a pair of numbers that do not have any common factors other than 1.
