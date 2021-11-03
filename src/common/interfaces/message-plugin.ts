import React from 'react';
import { IMessage } from "./message";
import { MessageSender } from '../../webchat-ui/interfaces';
import { styled, IWebchatTheme } from '../../webchat-ui/style';
import { IWebchatConfig } from './webchat-config';

export interface MessageComponentProps {
    attributes?: React.HTMLProps<HTMLDivElement>;
    config: IWebchatConfig;
    isFullscreen?: boolean;
    message: IMessage;
    direction: 'incoming' | 'outgoing';
    color: 'primary' | 'neutral';
    onDismissFullscreen?: () => void;
    onEmitAnalytics: (name: string, data?: any) => void;
    onSendMessage: MessageSender;
    onSetFullscreen?: () => void;
    theme: IWebchatTheme;
}

export type MessageMatcher = (message: IMessage, config: IWebchatConfig) => boolean;

export interface MessagePluginOptions {
    fullscreen: boolean;
    fullwidth: boolean;
    passthrough: boolean;
}

export type MessageComponent = ((props: MessageComponentProps) => JSX.Element | null)
    | React.ComponentClass<MessageComponentProps>;

export interface MessagePlugin {
    name?: string;
    match: MessageMatcher | string;
    component: MessageComponent;
    options?: Partial<MessagePluginOptions>;
}

export interface MessagePluginFactoryProps {
    React: typeof React;
    styled: typeof styled;
}

export type MessagePluginFactory = (props: MessagePluginFactoryProps) => MessagePlugin;