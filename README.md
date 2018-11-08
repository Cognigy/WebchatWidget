# Cognigy Webchat

This repo contains a Webchat that seemlessly integrates with your website and lets your users chat with your Conversational AI built with COGNIGY.AI.

Please read the Documentation [here](https://docs.cognigy.com/v3.0/docs/integrate-the-webchat-on-your-own-website) for information about how you can integrate this Webchat on your own website.

## Using this Github Repo ##
The best way to use the COGNIGY.AI Webchat is to follow the instructions in our [documentation](https://docs.cognigy.com/v3.0/docs/integrate-the-webchat-on-your-own-website) and load the Webchat via a script hosted on our servers. However, if you want to use the source files directly, or if you even want to modify the Webchat, then this is of course also possible.

To start using the Repo, you have to have ``Node.js`` installed on your system, since the Webchat depends on Preact.js and Babel for compilation so that the Webchat can run on all browsers. To install these dependencies, simply cd into the Webchat folder and run ``npm i``.

All the source files for the Webchat are in the /src folder, and they are all compiled into a single cognigyWebChat.js file that resides in the /build folder. Whenever you change something in the source files, you have to run ``npm run build`` to compile a new cognigyWebChat.js file. It is this file that you need to include in your html file, when you want to load the Webchat.You can open the example.html file to see how you initialize the COGNIGY.AI Webchat with the cognigyWebChat.js file.
