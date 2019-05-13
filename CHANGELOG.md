# Changelog

## WIP

### Breaking Changes
- `WebchatUI` will now pass the rest props to a wrapper around the webchat root, not to the webchat root itself anymore.

### New Features
- automatic scrolling in webchat will now happen smoothly if supported by browser
- in mobile view, the webchat header will now show a 'close' button to the right

### Bug Fixes
- incoming bot messages will not scroll the webchat history to the bottom if it was scrolled up before
- fixed a bug where special characters in image urls would result in the image not being displayed correctly when using messenger templates

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
