# Cognigy Web Chat

This repo contains a chat component which connects to the Cognigy brain, and which can be deployed easily on a website.

## Note!

Please note that video and audio files are currently not supported.

## Image
![Image of webchat](images/webchat.jpg)

## Usage
To use the Cognigy Web Chat, simply:
- Download/clone all the files to your project.
- Add an empty div component with the class "cognigy-web-chat" and an id of "cognigy".
- Add `<link rel="stylesheet" type="text/css" href="index.css">` and `<link rel="stylesheet" type="text/css" href="rich_message_style.css">`
- At the bottom of the body tag (or at least after aforementioned div), insert these two scripts:
  ```
  <script src="cognigy-web-chat.js"></script>
  <script src="cognigy-web-client.js"></script>
  <script src="rich-messages.js"></script>
  ```
- Add the following script for minimal functionality:
```
 <script>
    const options = {
        baseUrl: 'host',
        user: 'username',
        apikey: 'apikey',
        channel: 'my-website',
        flow: 'flow',
        language: 'language',
        resetContext: true,
        resetState: true,
        handleOutput: function(output) {
            displayCognigyMessage(output);
        }
    };
    const inputValue = document.getElementById("cognigy-input").value;
    //Reset input value
    document.getElementById("cognigy-input").value = "";
    const client = new Cognigy.CognigyWebClient(options);

    client.connect()
    .catch(function(error) {
            console.log(error);
    });

    //Function used by postback buttons
    const handleCognigyMessage = (message) => {
        if (client && client.isConnected()) {
            const inputValue = document.getElementById("cognigy-input").value;
            document.getElementById("cognigy-input").value = "";
            if (message) {
                client.sendMessage(message, undefined);
            } else {
                client.sendMessage(inputValue, undefined);
            }
        }
    }

    // listen on form submit event and use handleCognigyMessage function
    formElement.addEventListener("submit", () => {
        if (client && client.isConnected()) {
            const inputValue = document.getElementById("cognigy-input").value;
            document.getElementById("cognigy-input").value = "";

            client.sendMessage(inputValue, undefined);
        }
    }, false);
</script>
```

 ## Example

```
<head>
   <link rel="stylesheet" type="text/css" href="index.css">
   <link rel="stylesheet" type="text/css" href="rich_message_style.css">
</head>
  
<body>
    <div class="cognigy-web-chat" id="cognigy"></div>

    <script src="cognigy-web-chat.js"></script>
    <script src="cognigy-web-client.js"></script>
    <script src="rich-messages.js"></script>

    <script>
        let recording = false;
        const options = {
            baseUrl: 'host',
            user: 'username',
            apikey: 'apikey',
            channel: 'my-website',
            flow: 'flow',
            language: 'language',
            resetContext: true,
            resetState: true,
            handleOutput: function(output) {
                displayCognigyMessage(output);
            }
        };
        const inputValue = document.getElementById("cognigy-input").value;
        //Reset input value
        document.getElementById("cognigy-input").value = "";
        var client = new Cognigy.CognigyWebClient(options);

        client.connect()
        .catch(function(error) {
                console.log(error);
        });

        //Function used by postback buttons
        const handleCognigyMessage = (message) => {
            if (client && client.isConnected()) {
                var inputValue = document.getElementById("cognigy-input").value;
                document.getElementById("cognigy-input").value = "";
                if (message) {
                    client.sendMessage(message, undefined);
                } else {
                    client.sendMessage(inputValue, undefined);
                }
            }
        }

    	if (client && client.isConnected) {
			if (recordButton !== null) {
				recordButton.onclick = function () {
					recording = !recording;

					recordButton.style.backgroundImage = (recording) ? "url(./images/mic-animate.gif)" : "url(./images/mic.gif)";

					if (recording) {
						var beep = new Audio("https://www.freesound.org/data/previews/259/259703_4486188-lq.mp3");
						beep.play();
					}

					client.toggleRec();
				}
			}

			client.registerOnRecEnd( transcript => {
				handleDisplayRecording(transcript)
				client.sendMessage(transcript, undefined);
				console.log("what you said was: ", transcript);
			})
		}

        // listen on form submit event and use handleCognigyMessage function
        formElement.addEventListener("submit", () => {
            if (client && client.isConnected()) {
                const inputValue = document.getElementById("cognigy-input").value;
                document.getElementById("cognigy-input").value = "";

                client.sendMessage(inputValue, undefined);
            }
        }, false);
    </script>
</body>
 ```

## Using Facebook messenger extensions in the webchat
You can use your custom Facebook extensions in the webchat if you want. Here is a simple example on how to use them in Node.js

### Client
Since we have to communicate with the server, which receives a post request from the FB extension, we will in this example add a small socket-io implementation:

```
<script src="/socket.io/socket.io.js"></script>
<script>
    const socket = io.connect('http://localhost:9001');
    socket.on('extensionEvent', function (message) {
        handleDisplayPostbackMessage(message.text);
        handleCognigyMessage(message.text);
    });
</script>
```

The two functions, handleDisplayPostbackMessage and handleCognigMessage, ensures that the message from the extension (e.g. a calendar date) is displayed in the webchat and sent to Cognigy.

### Server
On the server we will do a simple express + socket-io implementation, listening on post requests to /extension, which is the entrypoint for Cognigy's FB extensions.

```
const express = require("express");
const socketio = require("socket.io");
const bodyParser = require("body-parser");
const http = require("http");

const port = 9001;

const app = express();

app.use(bodyParser.json());

const server = http.createServer(app);
const io = socketio(server);

io.on('connection', function (socket) {
	app.post("/", (request, response) => {
		socket.emit('extensionEvent', request.body );

		response.sendStatus(200);
	})
});	

server.listen(port);
```