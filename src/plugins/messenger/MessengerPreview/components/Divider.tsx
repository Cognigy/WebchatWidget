import { MessagePluginFactoryProps } from "../../../../common/interfaces/message-plugin";

export const getDivider = ({ React, styled }: MessagePluginFactoryProps) => {
  const Divider = styled.div(({ theme }) => ({
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: theme.greyColor,
  }));

  return Divider;
};
