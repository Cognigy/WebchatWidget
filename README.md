## DEPRECATION WARNING FOR WEBCHAT v2

With the release of our [Webchat v3](https://github.com/Cognigy/Webchat), we are also announcing the deprecation of older versions of Webchat (v2.X).

**End of Support: 31st January 2026**

### What This Means for You:
Effective immediately, there will be
- No Further Feature Updates: We will no longer release feature updates for the deprecated Webchat versions.
- No Bug Fixes: Issues reported in the deprecated versions will not be addressed.
- Limited Support: Customer support for the deprecated versions will be significantly reduced and eventually unavailable after the end of support date.
- Security Fixes: We will continue to provide security fixes until the end of the support date. 

Please follow our [guide to migrate from Webchat v2 to v3](https://docs.cognigy.com/webchat/migration/).

# Cognigy Webchat Widget

This repository contains a Webchat feature that seamlessly integrates with your website, enabling your users to chat with your Conversational AI, built with Cognigy.

## Documentation

To get started using the Webchat on your website, you can refer to the [Documentation section](./docs/README.md) in this repository. For information on how to set up the Webchat on the Cognigy side, please consult the [Deploy a Webchat Endpoint](https://docs.cognigy.com/ai/endpoints/webchat/deploy-webchat-endpoint/) guide in our product documentation.

Read the documentation [here](https://docs.cognigy.com/ai/endpoints/webchat/webchat/) for information about integrating this Webchat on your own website. For styling customization, refer to the [guide on applying custom CSS to the Webchat](./src/webchat-ui/README.md).

## About this Repository

This repository contains the source code for the Cognigy Webchat within our product. It is divided into multiple sub-projects:

- `webchat-ui`: contains the source code used to render the webchat and webchat-plugins via `react`.
- `webchat`: makes use of `webchat-ui` and adds the socket connection as well as state management to it. It can be used within React applications for seamless integration.
- `webchat-embed`: takes the `webchat` and renders it into a website without further manual integration into an existing React application.
- `plugins`: contains built-in webchat-plugins that can be understood as a basic feature set.

## Building your Webchat

You need an installed version of `Node.js` to build your Webchat. Clone this repository, then run `npm i` and `npm run bundle` within the root folder to install dependencies and create bundle files in `dist/`.

## Development

For development purposes, you can utilize `npm run dev`. This command spawns an HTTP server on port 8080, showcasing the current form of the webchat directly from the source code. It automatically reloads upon updating source files, simplifying the development process.
It automatically reloads when you make changes, streamlining the development process.

## Compatibility Builds

The `npm run bundle` command generates bundle files for the Webchat itself and basic Webchat plugins. Additionally, it produces a second version of each bundle ending in `.legacy.js`. These builds maintain the same feature set as the regular ones but are converted into an older JavaScript standard, enhancing compatibility for older browsers that lack support for modern JavaScript features, such as Internet Explorer 11. When you run the command `npm run bundle`, it creates bundle files for the Webchat along with some basic Webchat plugins. This command also produces a second version of each bundle, which has `.legacy.js` at the end of its name. These builds have the same features as the regular ones but are converted into an older JavaScript standard. This enhances compatibility for older browsers that don't support modern JavaScript features, such as Internet Explorer 11.
