import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { styled } from '../webchat-ui/style';
import uuid from 'uuid';
import './embedded-webchat-styles.css';

// load plugins
import '../plugins/get-started-button-input';
import '../plugins/date-picker';
import '../plugins/messenger';

import EmbeddedWebchat from './components/presentational/EmbeddedWebchat';
import { Webchat } from '../webchat/components/Webchat';



const initWebchat = async (webchatConfigUrl: string, options?: React.ComponentProps<typeof EmbeddedWebchat>['options'], callback?: (webchat: Webchat) => void) => {
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

    const webchatRoot = document.createElement('div');
    document.body.appendChild(webchatRoot);

    let cognigyWebchat: Webchat | null = null;

    ReactDOM.render(
        (
            <EmbeddedWebchat
                ref={ref => cognigyWebchat = ref}
                url={webchatConfigUrl}
                options={options}
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

    await (cognigyWebchat as Webchat).connect();

    // @ts-ignore
    // window.cognigyWebchat.open();
    if (callback) {
        return callback(cognigyWebchat)
    }

    return cognigyWebchat;
};

// @ts-ignore
window.initWebchat = initWebchat;