Get a list of routines which the peer can execute.

A => B
```jsonc
{
    "initiate": "getCapabilities"
}
```

B => A
```jsonc
{
    "capabilities": ["verifyIdentity", "getCapabilities", "message", "videoCallRequest" /*, ...*/],
    // Any future ammended versions of these routines will have the version number appended to the name, e.g. {"initiate":"message1.0"}. These can be included as well as the original 0.0 versions.
    "terminate": "done"
}
```