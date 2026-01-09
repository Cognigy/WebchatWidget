
# [Removal in February 2026] Cognigy Webchat v2 

> [!CAUTION]
> Webchat v2 was deprecated[^1] in August 2024 and will be removed in February 2026. The removal includes deleting this repository and the Webchat v2 Endpoint in Cognigy.AI. Make sure you have [migrated](https://docs.cognigy.com/webchat/migration/) from Webchat v2 to Webchat v3 before the removal date. After that date, Webchat v2 will no longer be available on your website via its bundle URL.

[^1]: During the deprecation stage (August 2024 – February 2026), support will be limited to critical security updates only. Webchat will not receive new features or bug fixes.

This repository contains the Webchat v2 widget, which integrates smoothly with your website and lets users chat with your AI Agents created using Cognigy.AI.

## Documentation

To get started using the Webchat on your website, you can refer to the [Documentation section](./docs/README.md) in this repository. For information on how to set up the Webchat on the Cognigy side, please consult the [Deploy a Webchat Endpoint](https://docs.cognigy.com/ai/endpoints/webchat/deploy-webchat-endpoint/) guide in our product documentation.

Read the documentation [here](https://docs.cognigy.com/ai/endpoints/webchat/webchat/) for information about integrating this Webchat on your own website. For styling customization, refer to the [guide on applying custom CSS to the Webchat](./src/webchat-ui/README.md).

## About this Repository

This repository contains the source code for the Cognigy Webchat within our product. It is divided into multiple sub-projects:

- `webchat-ui`: contains the source code used to render the webchat and webchat-plugins via `react`.
- `webchat`: makes use of `webchat-ui` and adds the socket connection as well as state management to it. It can be used within React applications for seamless integration.
- `webchat-embed`: takes the `webchat` and renders it into a website without further manual integration into an existing React application.
- `plugins`: contains built-in webchat plugins that can be understood as a basic feature set.

## Building your Webchat

You need a version of `Node.js` installed to build your Webchat. Clone this repository, then run `npm i` and `npm run bundle` within the root folder to install dependencies and create bundle files in `dist/`.

## Development

For development, you can run `npm run dev`. This command starts an HTTP server on port 8080 that serves the current Webchat form directly from the source code. It automatically reloads when source files change, simplifying the development process.
It automatically reloads when you make changes, streamlining the development process.

## Compatibility Builds

The `npm run bundle` command generates bundle files for the Webchat itself and basic Webchat plugins. Additionally, it produces a second version of each bundle ending in `.legacy.js`. These builds retain the same feature set as the regular builds but are compiled to an older JavaScript standard, improving compatibility with older browsers that lack support for modern JavaScript features, such as Internet Explorer 11. When you run the command `npm run bundle`, it creates bundle files for the Webchat along with some basic Webchat plugins. This command also produces a second version of each bundle, which has `.legacy.js` at the end of its name. These builds share the same features as the regular builds but are compiled to an older JavaScript standard. This enhances compatibility for older browsers that don't support modern JavaScript features, such as Internet Explorer 11.
