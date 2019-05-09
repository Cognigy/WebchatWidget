import React, { ComponentProps } from 'react';
import { IMessage } from "./message";
import { IWebchatConfig } from "@cognigy/webchat-client/lib/interfaces/webchat-config";
import { MessageSender } from '../../webchat-ui/interfaces';
import { MessagePluginFactoryProps } from './message-plugin';

export interface InputButtonProps extends React.HTMLProps<HTMLButtonElement> {
    active: boolean;
}

export interface InputComponentProps {
    config: IWebchatConfig;
    onSendMessage: MessageSender;
    attributes?: React.HTMLProps<HTMLDivElement>;
}

interface MatcherArgs {
    config: IWebchatConfig,
    messages: IMessage[];
}

export type InputRule = (args: MatcherArgs) => boolean;

export interface InputPluginOptions {
    // fullscreen: boolean;
    // passthrough: boolean;
}

type Component<P>  = ((props: P) => JSX.Element | null)
    | React.ComponentClass<P>;

export type InputComponent = Component<InputComponentProps>;
export type InputButtonComponent = Component<InputButtonProps>;

type InputPluginType = 'select' | 'rule';

interface InputPluginBase {
    type: InputPluginType;
    component: InputComponent;
    options?: Partial<InputPluginOptions>;
}

export interface RuleInputPlugin extends InputPluginBase {
    type: 'rule';
    rule: InputRule;
}

export interface SelectInputPlugin extends InputPluginBase {
    type: 'select';
    id: string;
    icon: Component<React.HTMLProps<HTMLOrSVGElement>>;
}

export type InputPlugin = RuleInputPlugin | SelectInputPlugin;
export type InputPluginFactoryProps = MessagePluginFactoryProps
export type InputPluginFactory = (props: InputPluginFactoryProps) => InputPlugin;