import { ThemeProvider } from "emotion-theming";
import * as React from "react";
import { FC, useMemo, useCallback } from "react";
import { IMessage } from "../common/interfaces/message";
import { IWebchatConfig } from "../common/interfaces/webchat-config";
import {
  getRegisteredMessagePlugins,
  prepareMessagePlugins,
} from "../plugins/helper";
import regularMessagePlugin from "../webchat-ui/components/plugins/message/regular";
import MessagePluginRenderer from "../webchat-ui/components/plugins/MessagePluginRenderer";
import { createWebchatTheme, styled } from "../webchat-ui/style";
import { getInitialState } from "../webchat/store/config/config-reducer";

interface IMessageRendererProps {
  message: IMessage;
  config?: IWebchatConfig;
}

const MessageRenderer: FC<IMessageRendererProps> = (props) => {
  const { message, config } = props;

  const actualConfig = useMemo(() => {
    const defaultConfig = getInitialState();

    return {
      ...defaultConfig,
      ...config,
      settings: {
        ...defaultConfig.settings,
        ...config?.settings
      }
    }
  }, [config]);

  const onEmitAnalytics = useCallback(console.log.bind(console), []);
  const onSendMessage = useCallback(
    (message) => console.log("sending message", message),
    []
  );

  const plugins = useMemo(() => {
    const plugins = prepareMessagePlugins(
      [...getRegisteredMessagePlugins(), regularMessagePlugin],
      { React, styled }
    );

    return plugins;
  }, []);

  const theme = useMemo(() => createWebchatTheme(), []);

  return (
    <ThemeProvider theme={theme}>
      <div data-cognigy-webchat-root>
        <MessagePluginRenderer
          config={actualConfig}
          message={message}
          onEmitAnalytics={onEmitAnalytics}
          onSendMessage={onSendMessage}
          plugins={plugins}
          webchatTheme={theme}
          hideAvatar
        />
      </div>
    </ThemeProvider>
  );
};

export default MessageRenderer;
