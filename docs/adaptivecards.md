## Preview Notice
This feature is available as a preview and will undergo further changes until officially released.
The visual appearance and our integration API may change until then.
If you want to start using AdaptiveCards right away and don't want to use the preview, you can use our existing [AdaptiveCards Webchat Plugin](https://github.com/Cognigy/WebchatPlugins/tree/master/plugins/adaptivecards).

# AdaptiveCards 
The WebchatWidget now supports the usage of [AdaptiveCards](https://adaptivecards.io/) up to Schema Version `1.5` out-of-the-box.
Using AdaptiveCards, you can serve custom structured content, allowing you to shape the message layout and optimize the structure for the content you want to deliver. It also allows you to introduce custom interaction points to the end-user, e.g. by sending a form that needs to be filled and submitted.
For the complete reference of AdaptiveCards, please visit https://adaptivecards.io/.



## How To Use
To render an AdaptiveCard in the Webchat, send a message with the following `data` structure:

```typescript
{
    data: {
        _plugin: {
            type: "adaptivecard",
            payload: { 
                // full adaptivecard JSON object here 
            }
        }
    }
}
```

## Supported Features

### Form Submission
When the user submits a Form via an AdaptiveCard, it will send a "data-only-message" (which is invisible to the end-user) containing the following `data` structure:

```typescript
{
    data: {
        adaptivecards: {
            // form payload is sent here
        }
    }
}
```