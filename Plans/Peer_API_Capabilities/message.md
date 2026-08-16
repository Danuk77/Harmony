## Sending a message

A => B

```jsonc
{
    "initiate": "message",
    "message": "...",
    "number": 1234 // used to identify messages later. Receiver checks if there is already a message with this id. Integer in the range 0 to 9007199254740991
}
```

B => A
```jsonc
{
    "terminate": "done"
}
```