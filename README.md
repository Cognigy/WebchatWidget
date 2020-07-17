# Cognigy Webchat Widget

This repo contains a Webchat that seemlessly integrates with your website and lets your users chat with your Conversational AI built with COGNIGY.AI.

## Documentation
To get started using the Webchat on your Website, you can use the [Documentation section](./docs/README.md) in this repository.
For Information on how to set up the Webchat on Cognigy side, please refer to the "[Deploy a Webchat Endpoint](https://docs.cognigy.com/docs/deploy-a-webchat-20-endpoint)" guide in our product documentation.

Please read the Documentation [here](https://docs.cognigy.com/docs/cognigy-webchat) for information about how you can integrate this Webchat on your own website.
For customization of styling, please read the [guide on applying custom CSS to the Webchat](./src/webchat-ui/README.md).

## About this Repository
This repository contains the source code for the Cognigy Webchat within our product.
It is divided into multiple sub-projects
- `webchat-ui` contains the source code used to render the webchat and webchat-plugins via `react`
- `webchat` makes use of `webchat-ui` and adds the socket connection as well as state management to it. It can be used within react applications for seamless integration
- `webchat-embed` takes the `webchat` and renders it into a website without further manual integration into an existing react application
- `plugins` contains builtin webchat-plugins that can be understood as a basic featureset.

## Building the Webchat
To build the webchat, you will need an installed version of `Node.js`.
Clone this repository, then run `npm i` and `npm run bundle` within the root folder to install dependencies and create bundle files in `dist/`.

## Development
For development, you may use `npm run dev`, which will spawn a http-server on port 8080 that features the webchat in the current form from the source code. On updating source files, it will reload automatically to ease up the development process.

## Compatibility Builds
The `npm run bundle` task will create bundle files for the webchat itself as well as basic webchat plugins.
It will also create a second version of each bundle ending in `.legacy.js`.
Those builds contain the same featureset as the regular builds, but are translated into an older standard of JavaScript, providing improved compatibility for older browsers which do not support modern JavaScript features (e.g. Internet Explorer 11).
