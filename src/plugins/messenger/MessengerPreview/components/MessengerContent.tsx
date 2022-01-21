import { MessagePluginFactoryProps } from "../../../../common/interfaces/message-plugin";

export const getMessengerContent = ({
  React,
  styled,
}: MessagePluginFactoryProps) => {
  const MessengerContent = styled.div({
    padding: 10,
    wordWrap: "break-word",
    "&:focus": {
      outline: "none",
    },
  });

  return MessengerContent;
};
