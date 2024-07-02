import { MessagePlugin, MessageComponent, MessagePluginOptions, MessageMatcher, MessagePluginFactory, MessagePluginFactoryProps } from "../common/interfaces/message-plugin";
import { InputPlugin, InputPluginFactory } from "../common/interfaces/input-plugin";
import { IMessage } from "../common/interfaces/message";
import { IWebchatConfig } from "../common/interfaces/webchat-config";

const createStringMatcher = (name: string): MessageMatcher => message => message.data
    && message.data._plugin
    && message.data._plugin.type === name;

type MessagePluginCreator = (match: MessageMatcher | string, component: MessageComponent, options?: Partial<MessagePluginOptions>) => MessagePlugin;
export const createMessagePlugin: MessagePluginCreator = (match, component, options = {}): MessagePlugin => {
    if (typeof match === 'string')
        match = createStringMatcher(match);

    const plugin: MessagePlugin = {
        match,
        component,
        options
    }

    return plugin;
};

export const registerMessagePlugin = (plugin: MessagePlugin | MessagePluginFactory) => {
    if (window) {
        // @ts-ignore
        window.cognigyWebchatMessagePlugins = [...(window.cognigyWebchatMessagePlugins || []), plugin];
        console.debug('added cognigy message plugin');
    }
}

export const getRegisteredMessagePlugins = (): (MessagePlugin | MessagePluginFactory)[] => 
    // @ts-ignore
    [...(window.cognigyWebchatMessagePlugins || [])].reverse();

export const prepareMessagePlugins = (messagePlugins = getRegisteredMessagePlugins(), {
    React,
    styled
}): MessagePlugin[] => messagePlugins
    .map(plugin => typeof plugin === 'function'
        ? plugin({ React, styled })
        : plugin
    )
    .map(plugin => typeof plugin.match === 'string'
        ? { ...plugin, match: ({ data }) => data && data._plugin && data._plugin.type === plugin.match }
        : plugin
    );




// type InputPluginCreator = (match: InputRule | string, component: InputComponent, options?: Partial<InputPluginOptions>) => InputPlugin;
// export const createInputPlugin: InputPluginCreator = (match, component, options = {}) => {
//     const plugin = {
//         match,
//         component,
//         options
//     }

//     return plugin;
// };

export const registerInputPlugin = (plugin: InputPlugin | InputPluginFactory) => {
    if (window) {
        // @ts-ignore
        window.cognigyWebchatInputPlugins = [...(window.cognigyWebchatInputPlugins || []), plugin];
        console.debug('added cognigy input plugin');
    }
}

export const getPluginsForMessage = (plugins: MessagePlugin[], config: IWebchatConfig) => (message: IMessage): MessagePlugin[] => {
    const matchedPlugins: MessagePlugin[] = [];
    
    for (const plugin of plugins) {
        const isMatch = (plugin.match as MessageMatcher)(message, config);

        if (isMatch) {
            matchedPlugins.push(plugin);

            if (!plugin.options || !plugin.options.passthrough)
                break;
        }
    }

    return matchedPlugins;
}

export const isFullscreenPlugin = (plugin: MessagePlugin) => plugin.options && plugin.options.fullscreen;