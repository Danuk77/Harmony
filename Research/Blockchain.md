# Blockchain

Some notes on what it is.

Most of this info is from this YouTube playlist:
https://www.youtube.com/watch?v=dSiZdYzJ7xw&list=PL_c9BZzLwBRJsMptw588B8U6QyZLUcini&index=2

Blockchain is a distributed append-only list of immutable records.

Blockchain is:

- Decentralized - Not owned by a specific company/entity. If this is not desired then blockchain is not necessary
- Distributed - Located on many computers/nodes
- Permissionless - anyone can run their own node
- Public - anyone can view actions of the blockchain
- Permanent - blocks cannot be removed from the blockchain. The only way to "remove" a block is to _fork_ the blockchain and hope that everyone moves over to the new one. (i think)

## Blocks

Each "commit" to the blockchain is called a _block_.
Blocks each contain a hash of the previous block in the chain. This makes it extremely difficult to alter a block, as the hash of every subsequent block in the chain depends on it.

## Consensus mechanism

A blockchain uses a _consensus mechanism_ to determine which blocks get accepted to the blockchain. They disincentivise bad players by making contributors to the block chain take on some large cost (not necessarily monetary).

I'm still not 100% sure on why this works

### Proof of work

Miners compete to attempt to add a block to the blockchain and receive a reward. The amount of computational work required to add a block increases with the amount of combined computation done by miners. This method of proof of work has a notoriously high energy consumption.

See section in Bitcoin section.

### Proof of stake

Users set some of their currency aside (_staking_). They receive a share of the minted coins (often with some randomness) for doing so, but lose their stake if they break the rules. (idk, this is very vague I'm not 100% sure about this yet.)

### Proof of space

I don;t really care about the details but it involves using large amounts of hard drive space or something

## Example: Bitcoin

All other systems of payment except cash payments require some kind of third party (banks, credit cards, PayPal, etc). Bitcoin gets around this. It is a distributed _ledger_ (def: a record in which commercial accounts are recorded).

A block is added to the blockchain about every 10 minutes, and each block in the contains multiple transactions.

Say that person A wants to send 0.01 Bitcoin to person B. Person A creates a transaction that contains:

- 0.01 Bitcoin, the amount to be exchanged
- an _address_ of person B.

Addresses are generated from a public key. Person B holds the private key to the address, and will need to use that private key to sign the future transaction where they sell the bitcoin. This can be verified using the public key.

### Mining / proof of work

_Proof of work_ is the _consensus mechanism_ used by Bitcoin. The blockchain can only be altered if more that 50% of the miners work together(idk why), which requires a huge amount of computing pouer.

How it works:
A new list of transactions is to be added to the blockchain.
There are multiple competing blocks which only differ by one transaction - the address to where the block reward will be sent. Miners compete to _confirm_ the block in which **they** receive the _block reward_. This reward started at 50 Bitcoin in 2009, and gets cut in half roughly every 4 years.

The goal for the miners is to find a string with the following properties:

- It begins with the _merkel root_ of the block that the miner wants to verify (where they get the reward). The merkel root is essentially the hash value of the block.
- The rest of it is any 32-bit string (the _nonce_)
- When the string is run through SHA256 the value must be **lower** than the _target hash value_. This amount is the same for everybody, and decreases the more miners there are making it more difficult. The target hash value is adjusted every 2 weeks such that the expected time for a block to be confirmed (the _block time_) is always 10 minutes.

## On messaging apps

A lot of this section is my (mostly uninformed) opinion, so pls take with a pinch of salt. I need to do more reseach really, some/all of this might not be correct.

From my understanding, blockchain technology has some features that could be beneficial for messaging apps, but these reasons might make blockchain a bad idea:

- Blockchains are closely tied to finance, as they often have to rely on financial incentives to maintain integrity.
- Proof-of-work blockchains have a high power consumption and therefore a negative environemental impact. (Proof of stake blockchains might be better in this regard, but are more closely tied to finance)
- Due to the immutable nature of blockchains, leaked private information could be impossible to remove. This is also somewhat the case with conventional messaging apps where anyone can take a screenshot, however the permanent+public nature of blockchains sounds like an unnecessary feature.
- We don't want the messages to be public, so we would have to encrypt the messages in some way, or just have a new private blockchain for each group chat (if you can even do that I don't know).
- If the blockchain is only used amongst friends then we should consider how much we would benefit from a trustless system.
- Using blockchain could have issues with clients going offline, as this could lead to diverging chains, e.g. if two non-intersecting groups of people use the group chat at different times then there would have to be some sort of merging going on. (I don't know if this is difficult to accomplish in blockchain)

Howerer, blockchain being decentralized is a plus, as well as the cryptographic techniques used to verify identity. Again, I need to look into this more.

## Other stuff

I haven't read this yet but it seems like useful info: https://medium.com/coinmonks/building-a-blockchain-based-messaging-application-on-ethereum-a-complete-guide-3ce5a7253260
