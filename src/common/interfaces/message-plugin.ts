import React from 'react';
import { IMessage } from "./message";
import { IWebchatConfig } from "@cognigy/webchat-client/lib/interfaces/webchat-config";
import { MessageSender } from '../../webchat-ui/interfaces';
import { styled, IWebchatTheme } from '../../webchat-ui/style';

export interface MessageComponentProps {
    attributes?: React.HTMLProps<HTMLDivElement>;
    config: IWebchatConfig;
    isFullscreen?: boolean;
    message: IMessage;
    onDismissFullscreen?: () => void;
    onSendMessage: MessageSender;
    onSetFullscreen?: () => void;
    theme: IWebchatTheme;
}

export type MessageMatcher = (message: IMessage) => boolean;

export interface MessagePluginOptions {
    fullscreen: boolean;
    fullwidth: boolean;
    passthrough: boolean;
}

export type MessageComponent = ((props: MessageComponentProps) => JSX.Element | null)
    | React.ComponentClass<MessageComponentProps>;

export interface MessagePlugin {
    match: MessageMatcher | string;
    component: MessageComponent;
    options?: Partial<MessagePluginOptions>;
}

export interface MessagePluginFactoryProps {
    React: typeof React;
    styled: typeof styled;
}

export type MessagePluginFactory = (props: MessagePluginFactoryProps) => MessagePlugin;