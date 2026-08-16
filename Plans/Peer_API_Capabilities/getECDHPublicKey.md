To set up AES-256-GCM encryption on the ctl channel, a shared secret is required. To obtain the secret, Elyptic Curve Diffie-Hellman (DH) key exchange can be used, with the modp14 group.

This function gets the peer's DH public key so that the secret can be computed.

Both peers must initiate this routine for them both to obtain the shared secret. Once a peer has the secret and is sure that the other also has the secret, further messages on the ctl channel should be sent in this form:

| Field                                 | Length      |
|---------------------------------------|-------------|
| Tag                                   | 16 bytes    |
| Constant (1000 0001)                  | 1 byte      |
| Nonce                                 | 12 bytes    |
| Ciphertext (including transaction id) | rest of msg |

A => B
```jsonc
{
    "initiate": "getECDHPublicKey"
}
```

B => A
```jsonc
{
    "payload": {
        "getECDHPublicKey": "...", // base64
        "toPk": "...", // A's Harmony public key
        "purpose": "getECDHPublicKey",
        "expires": "2026-07-18T11:37:52+0000" // RFC3339 time string.
    },
    "signature": "..." // payload signed with B's Harmony private key
}
```

A => B
```jsonc
{
    "termnate": "done"
}
```