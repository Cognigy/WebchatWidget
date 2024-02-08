import React from "react";
import { ThemeProvider } from "@emotion/react";
import { FC, useMemo, useCallback } from "react";
import { IMessage } from "../common/interfaces/message";
import { IWebchatConfig } from "../common/interfaces/webchat-config";
import {
  getRegisteredMessagePlugins,
  prepareMessagePlugins,
} from "../plugins/helper";
import regularMessagePlugin from "../webchat-ui/components/plugins/message/regular";
import MessagePluginRenderer from "../webchat-ui/components/plugins/MessagePluginRenderer";
import styled from '@emotion/styled';
import { createWebchatTheme } from "../webchat-ui/style";
import { getMessageRendererConfig } from "./getMessageRendererConfig";
import { getMessageRendererPlugins } from "./getMessageRendererPlugins";

interface IMessageRendererProps {
  message: IMessage;
  config?: IWebchatConfig;
}

const MessageRenderer: FC<IMessageRendererProps> = (props) => {
  const { message, config } = props;

  const actualConfig = useMemo(() => getMessageRendererConfig(config), [config]);

  const onEmitAnalytics = useCallback(console.log.bind(console), []);
  const onSendMessage = useCallback(
    (message) => console.log("sending message", message),
    []
  );

  const plugins = useMemo(() => getMessageRendererPlugins(), []);

  const theme = useMemo(() => createWebchatTheme({
	  primaryColor: actualConfig.settings.colors.primaryColor
  }), [actualConfig.settings.colors.primaryColor]);

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
