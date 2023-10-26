import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { styled } from '../webchat-ui/style';
import { v4 as uuidv4 } from "uuid"
import './embedded-webchat-styles.css';

// load plugins
import '../plugins/get-started-button-input';
import '../plugins/date-picker';
import '../plugins/messenger';
import '../plugins/rating';
import '../plugins/adaptivecards';
import '../plugins/attachments';
import '../plugins/full-screen-notification';
import { Webchat } from '../webchat/components/Webchat';
import { getRegisteredMessagePlugins, prepareMessagePlugins } from '../plugins/helper';
import { getStorage } from '../webchat/helper/storage';


type SocketOptions = React.ComponentProps<typeof Webchat>['options'];
type WebchatSettings = React.ComponentProps<typeof Webchat>['settings'];

type InitWebchatOptions = SocketOptions & {
    settings?: WebchatSettings;
}

const initWebchat = async (webchatConfigUrl: string, options?: InitWebchatOptions, callback?: (webchat: Webchat) => void) => {
    // @ts-ignore
    const messagePlugins = prepareMessagePlugins(getRegisteredMessagePlugins(), {
        React,
        styled
    });

    // @ts-ignore
    const inputPlugins = (window.cognigyWebchatInputPlugins || [])
        .map(plugin => typeof plugin === 'function'
            ? plugin({ React, styled })
            : plugin
        );

    const disableLocalStorage = options?.settings?.disableLocalStorage ?? false;
    const useSessionStorage = options?.settings?.useSessionStorage ?? false;
    const browserStorage = getStorage({ disableLocalStorage, useSessionStorage });

    // if no specific userId is provided, try to load one from localStorage/sessionStorage, otherwise generate one and persist it in localStorage/sessionStorage
    if ((!options || !options.userId) && browserStorage) {
        let userId;
        
        if (!disableLocalStorage) {
            userId = browserStorage.getItem('userId');
        }

        if (!userId) {
            userId = uuidv4();
            if (!disableLocalStorage) browserStorage.setItem('userId', userId);
        }

        if (!options)
            options = {}

        options.userId = userId;
    }

    let settings: Partial<WebchatSettings> = {};
    if (options && options.settings) {
        settings = options.settings;
    }
    settings._endpointTokenUrl = webchatConfigUrl;
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