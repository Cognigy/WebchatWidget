import React from 'react';
import ReactDOM from 'react-dom';
import styled from '@emotion/styled';
import { v4 as uuidv4 } from "uuid"
import './embedded-webchat-styles.css';

// load plugins
import '../plugins/get-started-button-input';
import '../plugins/rating';
import { Webchat } from '../webchat/components/Webchat';
import { getRegisteredMessagePlugins, prepareMessagePlugins } from '../plugins/helper';
import { getStorage } from '../webchat/helper/storage';
import { IWebchatSettings } from '../common/interfaces/webchat-config';


type SocketOptions = React.ComponentProps<typeof Webchat>['options'];
type WebchatSettings = React.ComponentProps<typeof Webchat>['settings'];

type InitWebchatOptions = SocketOptions & {
    settings?: WebchatSettings;
}

declare global {
	interface Window {
		initWebchat: typeof initWebchat;
		cognigyWebchatInputPlugins: any[];
		__COGNIGY_WEBCHAT: {
			React: typeof React;
		};
	}

}

const initWebchat = async (webchatConfigUrl: string, options?: InitWebchatOptions, callback?: (webchat: Webchat) => void) => {
    const messagePlugins = prepareMessagePlugins(getRegisteredMessagePlugins(), {
        React,
        styled
    });

    const inputPlugins = (window.cognigyWebchatInputPlugins || [])
        .map(plugin => typeof plugin === 'function'
            ? plugin({ React, styled })
            : plugin
        );

	const disableLocalStorage = options?.settings?.embeddingConfiguration?.disableLocalStorage ?? false;
	const useSessionStorage = options?.settings?.embeddingConfiguration?.useSessionStorage ?? false;
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

	let settings: Partial<IWebchatSettings> = {};
    if (options && options.settings) {
        settings = options.settings;
    }
	settings.embeddingConfiguration = { ...settings?.embeddingConfiguration, _endpointTokenUrl: webchatConfigUrl } as Partial<IWebchatSettings>['embeddingConfiguration'];
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

window.initWebchat = initWebchat;

window.__COGNIGY_WEBCHAT = {
    React
};