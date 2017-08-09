# Cognigy Web Chat

This repo contains a chat component which connects to the Cognigy brain, and which can be deployed easily on a website.

## Usage
To use the Cognigy Web Chat, simply:
- Download/clone all the files to your project.
- Add an empty div component with the class "cognigy-web-chat" and an id of "cognigy".
- Add `<link rel="stylesheet" type="text/css" href="index.css">`
- At the bottom of the body tag (or at least after aforementioned div), insert these two scripts:
  ```
  <script src="cognigy-web-chat.js"></script>
  <script src="cognigy-web-client.js"></script>
  ```
- Add the following script for minimal functionality:
```
<script>
	const options = {
		baseUrl: 'url',
		user: 'username',
		apikey: 'your-apikey',
		channel: 'my-website',
		flow: 'the-flow-name',
		language: 'en-US',
		handleOutput: function(output) {
			displayCognigyMessage(output);
		}
	};

	var client = new Cognigy.CognigyWebClient(options);
	client.connect()
		.catch(function(error) {
			console.log(error);
		});


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
</head>

<body>
    <div class="cognigy-web-chat" id="cognigy"></div>

    <script src="cognigy-web-chat.js"></script>
    <script src="cognigy-web-client.js"></script>

    <script>
        const options = {
            baseUrl: 'url',
            user: 'username',
            apikey: 'your-apikey',
            channel: 'my-website',
            flow: 'the-flow-name',
            language: 'en-US',
            handleOutput: function(output) {
                displayCognigyMessage(output);
            }
        };

        var client = new Cognigy.CognigyWebClient(options);
        client.connect()
            .catch(function(error) {
                console.log(error);
            });


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
