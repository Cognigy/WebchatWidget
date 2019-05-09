import { MessagePluginFactoryProps } from "../../../../common/interfaces/message-plugin";

export const getMessengerSubtitle = ({ React, styled }: MessagePluginFactoryProps) => {
    const MessengerSubtitle = styled.p({
        margin: 0,
        color: 'hsla(0, 0%, 0%, .54)',
        fontSize: 13
    });

    return MessengerSubtitle;
}