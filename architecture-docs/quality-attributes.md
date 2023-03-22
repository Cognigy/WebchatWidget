# Quality Attributes

# Maintainability:
Sometimes, we need to add a new configuration option in some part of the webchat.
In that case, we need to add that option to the [`IWebchatConfig` interface](../src/common/interfaces/webchat-config.ts) and set its default value in the [`config` reducer](../src/webchat/store/config/config-reducer.ts).

# Extensibility:
In most cases, "extending" means "adding support for another message type", in which case we'd add a new "Message Plugin" to the `src/plugins` folder and load it into the bundle by `import`ing it in [`src/webchat-embed/index.tsx`](../src/webchat-embed//index.tsx).

# Testability:
We do have integration testing running via `cypress`. Most tests are utilizing an exposed, internal function from the `webchat` instance in order to simulate "receiving a message from the socket".
See the [`receiveMessage` cypress command in `commands.ts`](../cypress/support/commands.ts)

# Scalability:
The WebchatWidget was designed as a "drop-in"-solution for any type of website.
This lead to a couple of decisions making sure that it is suited for that purpose, but also added limitations, such as:
- using the `initWebchat` function from `webchat.js`, you may only add _one_ webchat widget to your website at a time
- the webchat widget is not designed to be used with multiple sessions (neither parallel nor in series)
- despite being "react-based", there is no exposed react component 

# Availability:
  - The "persistent history" can cause trouble in scenarios where there is either a lot of raw data in the history (e.g. base64-encoded content rather than links) in which the webchat might fail to work properly
  - Quickly reloading a website with a webchat that auto-connects could put quite some request load onto the endpoint

# Other
## Ideas:
- use `IndexedDB` for storing conversation histories to circumvent the (rather limited) `localStorage`/`sessionStorage` capacity limits.
- add "housekeeping" logic to automatically clean up old persisted conversation histories. This would save storage capacity on the user's machine.
- add an encapsulation for an "endpoint connection" using an adapter + reference implementation for `@cognigy/socket-client`. This would add better testing capabilities and make it possible to re-use the webchat in scenarios where we're not connecting to a regular endpoint.
- refactor the "Messenger Plugin" to use regular code style. It was written with a "dependency injection" style where `react` and emotion's `styled` were injected into the plugin at runtime so it can reuse the ones from the host, saving space and avoiding issues with hooks. There are other ways to achieve this, though, and we're using it in our `WebchatPlugins` repository already: adding an `alias` to the exposed libraries. (see [a plugin's `alias` file](https://github.com/Cognigy/WebchatPlugins/blob/0ca12f4154f394faeb7183be9453ee3f13236d2f/plugins/qr-code-reader/alias/react.js#L5) and [a plugin's `package.json` bundler configuration](https://github.com/Cognigy/WebchatPlugins/blob/0ca12f4154f394faeb7183be9453ee3f13236d2f/plugins/qr-code-reader/package.json#L22) for "consumption" and [WebchatWidget's embedding script](https://github.com/Cognigy/WebchatWidget/blob/1b280dc69fc9618664ee9355ff2b72f3121194e4/src/webchat-embed/index.tsx#L102) for "exposing")