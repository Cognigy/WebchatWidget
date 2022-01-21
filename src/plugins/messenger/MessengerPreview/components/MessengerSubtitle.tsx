import { MessagePluginFactoryProps } from "../../../../common/interfaces/message-plugin";
import { IWebchatConfig } from "../../../../common/interfaces/webchat-config";

export const getMessengerSubtitle = ({
  React,
  styled,
}: MessagePluginFactoryProps) => {
  const MessengerSubtitle = styled.p<{ config: IWebchatConfig }>((props) => ({
    margin: 0,
    color: "hsla(0, 0%, 0%, .54)",
    fontSize: 13,
    whiteSpace: props.config.settings.ignoreLineBreaks ? "initial" : "pre-line",
  }));

  return MessengerSubtitle;
};
