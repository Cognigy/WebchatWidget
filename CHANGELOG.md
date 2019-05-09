# Changelog

## v2.2.0

### Breaking Changes

- if not set manually, the webchat will reuse the `userId` from before, persisted in local storage

## v2.1.0

### Breaking Changes

- `initWebchat(...)` does not set `window.cognigyWebchat` any more. Instead, it resolves it via a promise or via a callback when the webchat is connected. To achieve the previous behavior, see the example below:

```javascript
// using a promise
initWebchat("example.url").then(webchat => {
  window.cognigyWebchat = webchat;
});

// using a callback as the third parameter
// 'null' means no option override here
initWebchat("example.url", null, webchat => {
  window.cognigyWebchat = webchat;
});
```

- the webchat will not automatically open on init anymore. To achieve the previous behavior, see the example below:

```javascript
initWebchat("example.url").then(webchat => {
  webchat.open();
});
```

### New Features

- the webchat exposes a `.on()` function that allows subscribing to events of the underlying `SocketClient`
- `webchat.onMessage()` is a shorthand method directly subscribing to incoming message events
