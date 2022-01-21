import { MessagePluginFactoryProps } from "../../../../common/interfaces/message-plugin";

export const getFlexImage = ({ React, styled }: MessagePluginFactoryProps) => {
  const FlexImage = styled.img({
    display: "block",
    width: "100%",
  });

  return FlexImage;
};
