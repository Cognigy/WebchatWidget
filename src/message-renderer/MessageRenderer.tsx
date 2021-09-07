import { ThemeProvider } from "emotion-theming";
import * as React from "react";
import { FC, useMemo, useCallback } from "react";
import { IMessage } from "../common/interfaces/message";
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
}

const MessageRenderer: FC<IMessageRendererProps> = (props) => {
  const { message } = props;

  const config = useMemo(() => getInitialState(), []);

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
          config={config}
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
