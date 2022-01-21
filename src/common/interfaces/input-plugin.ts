import React from "react";
import { IMessage } from "./message";
import { MessageSender } from "../../webchat-ui/interfaces";
import { MessagePluginFactoryProps } from "./message-plugin";
import { IWebchatTheme } from "../../webchat-ui/style";
import { IWebchatConfig } from "./webchat-config";

export interface InputButtonProps extends React.HTMLProps<HTMLButtonElement> {
  active: boolean;
}

export interface InputComponentProps {
  attributes?: React.HTMLProps<HTMLDivElement>;
  config: IWebchatConfig;
  onSendMessage: MessageSender;
  onEmitAnalytics: (name: string, data?: any) => void;
  theme: IWebchatTheme;
}

interface MatcherArgs {
  config: IWebchatConfig;
  messages: IMessage[];
}

export type InputRule = (args: MatcherArgs) => boolean;

export interface InputPluginOptions {
  // fullscreen: boolean;
  // passthrough: boolean;
}

type Component<P> =
  | ((props: P) => JSX.Element | null)
  | React.ComponentClass<P>;

export type InputComponent = Component<InputComponentProps>;
export type InputButtonComponent = Component<InputButtonProps>;

type InputPluginType = "select" | "rule";

interface InputPluginBase {
  name?: string;
  type: InputPluginType;
  component: InputComponent;
  options?: Partial<InputPluginOptions>;
}

export interface RuleInputPlugin extends InputPluginBase {
  type: "rule";
  rule: InputRule;
}

export interface SelectInputPlugin extends InputPluginBase {
  type: "select";
  id: string;
  icon: Component<React.HTMLProps<HTMLOrSVGElement>>;
}

export type InputPlugin = RuleInputPlugin | SelectInputPlugin;
export type InputPluginFactoryProps = MessagePluginFactoryProps;
export type InputPluginFactory = (
  props: InputPluginFactoryProps
) => InputPlugin;
