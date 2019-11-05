# Embedding

## Embedding on a Website

### 1. Load Webchat Bundle
### 2. (optional) Load Plugin Bundles
### 3. Initialize Webchat 
```javascript
initWebchat('<< WEBCHAT CONFIG URL HERE >>')

initWebchat('<< WEBCHAT CONFIG URL HERE >>', {
    userId: 'custom-user-id'
})

// link to customization settings here
// link to WebchatClient overrides here
// link to EndpointSettings overrides here

initWebchat('<< WEBCHAT CONFIG URL HERE >>')
    .then(webchat => {
        webchat.open();
        webchat.sendMessage('auto message')
    });
// link to webchat api here

```

## Customization

### Disable Toggle Button
`disableToggleButton` (default false)
### Connection Status Indicator
`enableConnectionStatusIndicator` (default false)
### Dynamic Image Aspect Ratios
`dynamicImageAspectRatio` (default false)
