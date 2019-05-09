import { MessagePluginFactoryProps } from "../../../../../common/interfaces/message-plugin";

export const getMessengerTitle = ({ React, styled }: MessagePluginFactoryProps) => {
    const MessengerTitle = styled.h6({
        marginTop: 2,
        marginBottom: 5,
        fontSize: 15,
        color: 'hsla(0, 0%, 0%, .8)'
    });

    return MessengerTitle
}