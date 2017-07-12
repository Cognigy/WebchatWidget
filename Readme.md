# Cognigy Web Chat

This repo contains a chat component which connects to the cognigy brain, and which can be deployed easily on a website.

#### Please view the branch "feature/facebook_design" for an improved design + some bug fixes

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
       var handleCognigyMessage = function() {
           const options = {
               baseUrl: 'url',
               user: 'username',
               apikey: 'your-api-key',
               channel: 'my-website',
               flow: 'your-flow',
               language: 'en-US',
               handleOutput: function(output) {
                 displayCognigyMessage(output);
               }
           };
           const inputValue = document.getElementById("cognigy-input").value;
           var client = new Cognigy.CognigyWebClient(options);
           client.connect()
               .then(function() {
                   // 1) send an event directly
                   client.sendMessage(inputValue, undefined);
               })
               .catch(function(error) {
                   console.log(error);
               });
       };

       // listen on form submit event and use handleCognigyMessage function
      formElement.addEventListener("submit", () => handleCognigyMessage(), false);

   </script>
   ```

 ## Example

```
<head>
  <link rel="stylesheet" type="text/css" href="index.css">
</head>

<body>
  <div
    class="cognigy-web-chat"
    id="cognigy"
  >
  </div>
  <script src="cognigy-web-chat.js"></script>
  <script src="cognigy-web-client.js"></script>
   <script>
       var handleCognigyMessage = function() {
           const options = {
               baseUrl: 'url',
               user: 'username',
               apikey: 'your-api-key',
               channel: 'my-website',
               flow: 'your-flow',
               language: 'en-US',
               handleOutput: function(output) {
                 displayCognigyMessage(output);
               }
           };
           const inputValue = document.getElementById("cognigy-input").value;
           var client = new Cognigy.CognigyWebClient(options);
           client.connect()
               .then(function() {
                   // 1) send an event directly
                   client.sendMessage(inputValue, undefined);
               })
               .catch(function(error) {
                   console.log(error);
               });
       };

       // listen on form submit event and use handleCognigyMessage function
      formElement.addEventListener("submit", () => handleCognigyMessage(), false);

   </script>
 </body>
 ```
