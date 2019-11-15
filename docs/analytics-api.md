# Analytics API

It is possible to register to analytics events via `webchat.registerAnalyticsService`. 
This can be used to create integrations with custom analytics services.
Plugins can now access the `onEmitAnalytics` function to emit analytics that will be forwarded to the analytics service.

Example code:
```javascript
webchat.registerAnalyticsService(event => {
    const { type, payload } = event;
    // console.info(`[ANALYTICS] ${type}`);

    switch (type) {
        // CB When a user opens/closes the chatbot
        case 'webchat/open':
            console.log('WEBCHAT WAS OPENED')
            break;

        case 'webchat/close':
            console.log('WEBCHAT WAS CLOSED')
            break;

        // CB When a user sends a message to the chatbot (either by clicking the “Send” button or by hitting Enter on the keyboard)
        case 'webchat/incoming-message': {
            const { text, data } = payload;
            console.log('INCOMING MESSAGE');

            break;
        }

        case 'webchat/outgoing-message': {
            const { text, data } = payload;
            console.log('OUTGOING MESSAGE');

            break;
        }

        // CB When the user opens the persistent menu
        case 'plugin/text-input/open-persistent-menu':
            console.log('OPENED PERSISTENT MENU');
            break;

        // CB When the user closes the persistent menu
        case 'plugin/text-input/close-persistent-menu':
            console.log('CLOSED PERSISTENT MENU');
            break;

        // CB When the user clicks on an item in the persistent menu
        case 'plugin/text-input/click-persistent-menu-item': {
            const { text } = payload;
            console.log('CLICKED PERSISTENT MENU ITEM');

            break;
        }

        // CB When a user clicks on a button and/or link inside of a result from the chatbot
        case 'plugin/messenger/action':
            const { type } = payload;
            console.log('HANDLED MESSENGER ACTION');

            if (payload.type === 'web_url' && payload.url) {
                const { url } = payload;
                // user clicked a link in a messenger preview
            }

            if (payload.type === 'postback') {
                const { text } = payload;
                // user clicked a 'postback' button that sends a message
            }

            if (payload.type === '') {

            }

            break;
    }
})
```
