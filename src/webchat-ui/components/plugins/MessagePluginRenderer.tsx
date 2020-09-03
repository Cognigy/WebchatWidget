import * as React from "react";
import { IMessage } from "../../../common/interfaces/message";
import { MessagePlugin } from "../../../common/interfaces/message-plugin";
import { MessageSender } from "../../interfaces";
import { IWebchatConfig } from "@cognigy/webchat-client/lib/interfaces/webchat-config";
import { getPluginsForMessage } from "../../../plugins/helper";
import MessageRow from "../presentational/MessageRow";
import Avatar from "../presentational/Avatar";
import { styled, IWebchatTheme } from "../../style";

export interface MessageProps extends React.HTMLProps<HTMLDivElement> {
  message: IMessage;
  config: IWebchatConfig;
  onSendMessage: MessageSender;
  onSetFullscreen?: () => void;
  onDismissFullscreen?: () => void;
  onEmitAnalytics: (name: string, payload?: any) => void;
  plugins: MessagePlugin[];
  isFullscreen?: boolean;
  webchatTheme: IWebchatTheme;
}

const FullWidthMessageRow = styled.div(({ theme }) => ({
  alignItems: "normal",
  display: 'flex',
  flexDirection: "column",
  flexShrink: 0,
  marginTop: theme.unitSize,
  marginBottom: theme.unitSize,
  paddingTop: theme.unitSize,
  paddingBottom: theme.unitSize,
}));

export default ({
  message,
  config,
  onSendMessage,
  plugins,
  isFullscreen,
  onSetFullscreen,
  onDismissFullscreen,
  webchatTheme,
  onEmitAnalytics,
  ...props
}: MessageProps): JSX.Element => {
  const attributes = Object.keys(props).length > 0 ? props : undefined;

  const matchedPlugins = getPluginsForMessage(plugins, config)(message);
  const source = message.source;

  let className;
  let avatar;
  let align;

  switch (source) {
    case "user":
      className = "webchat-message-row user";
      avatar = "webchat-avatar user";
      align = "right";
      break;
    case "bot":
      className = "webchat-message-row bot";
      avatar = "webchat-avatar bot";
      align = "left";
      break;
    case "agent":
      className = "webchat-message-row agent";
      avatar = "webchat-avatar agent";
      align = "left";
      break;
    default:
      break;
  }

  return (
    <>
      {matchedPlugins.map(
        ({ component: Component, options, name = "unknown" }, index) => {
          const emitAnalytics = (event: string, payload?: any) =>
            onEmitAnalytics(`plugin/${name}/${event}`, payload);

          const messageElement = (
            <Component
              key={index}
              config={config}
              message={message}
              onSendMessage={onSendMessage}
              onSetFullscreen={onSetFullscreen}
              onDismissFullscreen={onDismissFullscreen}
              attributes={attributes}
              isFullscreen={isFullscreen}
              theme={webchatTheme}
              onEmitAnalytics={emitAnalytics}
            />
          );

          const key = `${index}:${JSON.stringify(message)}`;

          if (isFullscreen) {
            return messageElement;
          }

          if (options && options.fullwidth) {
            return (
              <FullWidthMessageRow className={className} key={key}>
                {messageElement}
              </FullWidthMessageRow>
            );
          }

          return (
            <MessageRow key={key} align={align} className={className}>
              <Avatar src={message.avatarUrl as string} className={avatar} />
              {messageElement}
            </MessageRow>
          );
        }
      )}
    </>
  );
};
