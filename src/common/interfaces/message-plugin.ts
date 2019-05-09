import React from 'react';
import { IMessage } from "./message";
import { IWebchatConfig } from "@cognigy/webchat-client/lib/interfaces/webchat-config";
import { MessageSender } from '../../webchat-ui/interfaces';
import { styled } from '../../webchat-ui/style';

export interface MessageComponentProps {
    message: IMessage;
    config: IWebchatConfig;
    onSendMessage: MessageSender;
    onSetFullscreen: () => void;
    onDismissFullscreen: () => void;
    isFullscreen?: boolean;
    attributes?: React.HTMLProps<HTMLDivElement>;
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