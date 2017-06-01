# typescript-sample-client

## IResponse Interface
The `IResponse` interface is defined as follows:

```typescript
export interface IResponse<T> {
    success: boolean;
    error?: IError;
    results: [T];
}
```

The `results` object on `IResponse` is in reality an *optional* field (see below the perfectly valid 'error response', without `results` object, which the data api could return). The client however, assumes the user won't attempt to access `results` unless a successful request has been made. This ensures that the type typescript comiplier won't try and coerce the types of variables accessing the results object, but instead will provide the helpful static typing tooling we want.

*possible error response:*
```json
{
    "error": {
        "code": "internal_error",
        "message": "This embarrassing!"
    },
    "success": false
}
```
