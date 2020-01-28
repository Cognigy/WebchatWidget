import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { styled } from '../webchat-ui/style';
import uuid from 'uuid';
import './embedded-webchat-styles.css';

// load plugins
import '../plugins/get-started-button-input';
import '../plugins/date-picker';
import '../plugins/messenger';
import { Webchat } from '../webchat/components/Webchat';


type SocketOptions = React.ComponentProps<typeof Webchat>['options'];
type WebchatSettings = React.ComponentProps<typeof Webchat>['settings'];

type InitWebchatOptions = SocketOptions & {
    settings?: WebchatSettings;
}

const initWebchat = async (webchatConfigUrl: string, options?: InitWebchatOptions, callback?: (webchat: Webchat) => void) => {
    // @ts-ignore
    const messagePlugins = (window.cognigyWebchatMessagePlugins || [])
        .map(plugin => typeof plugin === 'function'
            ? plugin({ React, styled })
            : plugin
        )
        .map(plugin => typeof plugin.match === 'string'
            ? { ...plugin, match: ({ data }) => data && data._plugin && data._plugin.type === plugin.match }
            : plugin
        );

    // @ts-ignore
    const inputPlugins = (window.cognigyWebchatInputPlugins || [])
        .map(plugin => typeof plugin === 'function'
            ? plugin({ React, styled })
            : plugin
        );

    // if no specific userId is provided, try to load one from localStorage, otherwise generate one and persist it in localstorage
    if ((!options || !options.userId) && localStorage) {
        let userId = localStorage.getItem('userId');

        if (!userId) {
            userId = uuid.v4();
            localStorage.setItem('userId', userId);
        }

        if (!options)
            options = {}

        options.userId = userId;
    }

    let settings: WebchatSettings = {} as any;
    if (options && options.settings) {
        settings = options.settings;
        options.settings = undefined;
    }

    const webchatRoot = document.createElement('div');
    document.body.appendChild(webchatRoot);

    let cognigyWebchat: Webchat | null = null;

    ReactDOM.render(
        (
            <Webchat
                ref={ref => cognigyWebchat = ref}
                url={webchatConfigUrl}
                options={options}
                settings={settings}
                messagePlugins={messagePlugins}
                inputPlugins={inputPlugins}
            />
        ),
        webchatRoot
    );

    // the ref call might not be executed synchronously
    while (!cognigyWebchat) {
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    if (callback) {
        return callback(cognigyWebchat)
    }

    return cognigyWebchat;
};

// @ts-ignore
window.initWebchat = initWebchat;

// @ts-ignore
window.__COGNIGY_WEBCHAT = {
    React
};